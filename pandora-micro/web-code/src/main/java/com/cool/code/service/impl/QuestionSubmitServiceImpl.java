package com.cool.code.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cool.code.mapper.QuestionSubmitMapper;
import com.cool.code.rabbitmq.CodeMqProducer;
import com.cool.code.service.QuestionCodeService;
import com.cool.code.service.QuestionSubmitService;
import com.cool.common.common.ErrorCode;
import com.cool.common.constant.CommonConstant;
import com.cool.common.exception.BusinessException;
import com.cool.model.dto.questionSubmit.QuestionSubmitAddRequest;
import com.cool.model.dto.questionSubmit.QuestionSubmitQueryRequest;
import com.cool.model.entity.question.QuestionCode;
import com.cool.model.entity.question.QuestionSubmit;
import com.cool.model.entity.User;
import com.cool.model.enums.QuestionSubmitLanguageEnum;
import com.cool.model.enums.QuestionSubmitStatusEnum;
import com.cool.model.vo.QuestionSubmitVO;
import com.cool.common.utils.SqlUtils;
import com.cool.server.JudgeFeignClient;
import com.cool.server.UserFeignClient;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

/**
 * @author Cool
 * @description 针对表【question_submit(题目提交)】的数据库操作Service实现
 * @createDate 2023-11-30 14:57:28
 */
@Service
public class QuestionSubmitServiceImpl extends ServiceImpl<QuestionSubmitMapper, QuestionSubmit>
        implements QuestionSubmitService {

    @Resource
    private QuestionCodeService questionCodeService;

    @Resource
    private UserFeignClient userFeignClient;

    @Resource
    @Lazy
    private JudgeFeignClient judgeFeignClient;

    @Resource
    private CodeMqProducer codeMqProducer;

    /**
     * 题目提交
     *
     * @param questionSubmitAddRequest
     * @param loginUser
     * @return
     */
    @Override
    public long doQuestionSubmit(QuestionSubmitAddRequest questionSubmitAddRequest, User loginUser) {
        // 校验编程语言是否合法
        String language = questionSubmitAddRequest.getSubmitLanguage();
        QuestionSubmitLanguageEnum languageEnum = QuestionSubmitLanguageEnum.getEnumByValue(language);
        if (languageEnum == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "编程语言错误");
        }
        // 判断实体是否存在，根据类别获取实体
        Long questionId = questionSubmitAddRequest.getQuestionId();
        QuestionCode questionCode = questionCodeService.getById(questionId);
        if (questionCode == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        // 是否已题目提交
        long userId = loginUser.getId();
        // 每个用户串行题目提交
        QuestionSubmit questionSubmit = new QuestionSubmit();
        questionSubmit.setUserId(userId);
        questionSubmit.setQuestionId(questionId);
        questionSubmit.setSubmitCode(questionSubmitAddRequest.getSubmitCode());
        questionSubmit.setSubmitLanguage(language);
        questionSubmit.setSubmitState(QuestionSubmitStatusEnum.WAITING.getValue());
        // 设置初始状态
        questionSubmit.setJudgeInfo("{}");

        // 执行代码判断是提交还是运行
        if (StringUtils.isNotBlank(questionSubmitAddRequest.getInputList())){
            questionSubmit.setRunStatus("run");
        }
        boolean save = this.save(questionSubmit);
        if (!save) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "数据插入失败");
        }
        Long questionSubmitId = questionSubmit.getId();
        // CompletableFuture.runAsync(()->{
        //     judgeService.doJudge(questionSubmitId,questionSubmitAddRequest);
        // });

        //  设置mq消息队列发送消息
        codeMqProducer.sendMessage("code_exchange","my_routingkey",String.valueOf(questionSubmitId));
        // 异步化，执行判题服务
        CompletableFuture.runAsync(()->{
            judgeFeignClient.doJudge(questionSubmitId);
        });

        return questionSubmitId;

    }

    /**
     * 获取查询包装类 (用户根据哪些字段查询，根据前端传来的请求对象，得到 mybatis 框架支持的查询类)
     *
     * @param questionSubmitQueryRequest
     * @return
     */
    @Override
    public QueryWrapper<QuestionSubmit> getQueryWrapper(QuestionSubmitQueryRequest questionSubmitQueryRequest) {
        QueryWrapper<QuestionSubmit> queryWrapper = new QueryWrapper<>();
        if (questionSubmitQueryRequest == null) {
            return queryWrapper;
        }
        Long questionId = questionSubmitQueryRequest.getQuestionId();
        String submitLanguage = questionSubmitQueryRequest.getSubmitLanguage();
        Integer status = questionSubmitQueryRequest.getStatus();
        Integer userId = questionSubmitQueryRequest.getUserId();
        String sortField = questionSubmitQueryRequest.getSortField();
        String sortOrder = questionSubmitQueryRequest.getSortOrder();

        // 拼接查询条件
        queryWrapper.eq(StringUtils.isNotBlank(submitLanguage), "submitLanguage", submitLanguage);
        queryWrapper.eq(ObjectUtils.isNotEmpty(userId), "userId", userId);
        queryWrapper.eq(ObjectUtils.isNotEmpty(questionId), "questionId", questionId);
        queryWrapper.eq(QuestionSubmitStatusEnum.getEnumByValue(status) != null, "status", status);
        queryWrapper.eq("runStatus","submit");//显示提交的代码，运行的不显示
        queryWrapper.eq("isDelete", false);
        queryWrapper.orderBy(SqlUtils.validSortField(sortField), sortOrder.equals(CommonConstant.SORT_ORDER_ASC),
                sortField);
        return queryWrapper;
    }

    /**
     * 获取查询封装类（单个）
     *
     * @param questionSubmit
     * @param loginUser
     * @return
     */
    @Override
    public QuestionSubmitVO getQuestionSubmitVO(QuestionSubmit questionSubmit, User loginUser) {
        QuestionSubmitVO questionSubmitVO = QuestionSubmitVO.objToVo(questionSubmit);
        // 脱敏：仅本人和管理员能看见自己（提交 userId 和登录用户 id 不同）提交的代码
        long userid = loginUser.getId();
        //处理脱敏
        if (userid != questionSubmit.getUserId() && userFeignClient.isAdmin(loginUser)){
            questionSubmitVO.setSubmitCode(null);
        }
            return questionSubmitVO;
    }

    @Override
    public Page<QuestionSubmitVO> getQuestionSubmitVOPage(Page<QuestionSubmit> questionSubmitPage, User loginUser) {
        List<QuestionSubmit> questionSubmitList = questionSubmitPage.getRecords();
        Page<QuestionSubmitVO> questionSubmitVOPage = new Page<>(questionSubmitPage.getCurrent(), questionSubmitPage.getSize(), questionSubmitPage.getTotal());
        if (CollectionUtils.isEmpty(questionSubmitList)) {
            return questionSubmitVOPage;
        }
        List<QuestionSubmitVO> questionSubmitVOList = questionSubmitList.stream()
                .map(questionSubmit -> getQuestionSubmitVO(questionSubmit, loginUser))
                .collect(Collectors.toList());
        questionSubmitVOPage.setRecords(questionSubmitVOList);
        return questionSubmitVOPage;
    }
}





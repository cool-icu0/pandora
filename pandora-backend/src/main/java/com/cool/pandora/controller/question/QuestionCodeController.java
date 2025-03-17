package com.cool.pandora.controller.question;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.cool.pandora.annotation.AuthCheck;
import com.cool.pandora.common.BaseResponse;
import com.cool.pandora.common.DeleteRequest;
import com.cool.pandora.common.ErrorCode;
import com.cool.pandora.common.ResultUtils;
import com.cool.pandora.constant.UserConstant;
import com.cool.pandora.exception.BusinessException;
import com.cool.pandora.exception.ThrowUtils;
import com.cool.pandora.mapper.question.QuestionCodeMapper;
import com.cool.pandora.model.dto.questionCode.*;
import com.cool.pandora.model.dto.questionSubmit.QuestionSubmitAddRequest;
import com.cool.pandora.model.dto.questionSubmit.QuestionSubmitQueryRequest;
import com.cool.pandora.model.entity.question.QuestionCode;
import com.cool.pandora.model.entity.question.QuestionSubmit;
import com.cool.pandora.model.entity.User;
import com.cool.pandora.model.vo.QuestionCodeVO;
import com.cool.pandora.model.vo.QuestionSubmitVO;
import com.cool.pandora.service.question.QuestionCodeService;
import com.cool.pandora.service.question.QuestionSubmitService;
import com.cool.pandora.service.user.UserService;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * 题目接口
 */
@RestController
@RequestMapping("/questionCode")
@Slf4j
public class QuestionCodeController {

    @Resource
    private QuestionCodeService questionCodeService;

    @Resource
    private UserService userService;

    @Resource
    private QuestionSubmitService questionSubmitService;
    @Resource
    private QuestionCodeMapper questionCodeMapper;

    private final static Gson GSON = new Gson();

    // region 增删改查

    /**
     * 创建
     *
     * @param questionAddRequest
     * @param request
     * @return
     */
    @PostMapping("/add")
    public BaseResponse<Long> addQuestion(@RequestBody QuestionAddRequest questionAddRequest, HttpServletRequest request) {
        if (questionAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QuestionCode questionCode = new QuestionCode();
        BeanUtils.copyProperties(questionAddRequest, questionCode);
        List<String> tags = questionAddRequest.getTags();
        if (tags != null) {
            questionCode.setTags(GSON.toJson(tags));
        }
        List<JudgeCase> judgeCase = questionAddRequest.getJudgeCase();
        if (judgeCase != null) {
            questionCode.setJudgeCase(GSON.toJson(judgeCase));
        }
        JudgeConfig judgeConfig = questionAddRequest.getJudgeConfig();
        if (judgeConfig != null) {
            questionCode.setJudgeConfig(GSON.toJson(judgeConfig));
        }
        questionCodeService.validQuestionCode(questionCode, true);
        User loginUser = userService.getLoginUser(request);
        questionCode.setUserId(loginUser.getId());
        questionCode.setFavourNum(0);
        questionCode.setThumbNum(0);
        boolean result = questionCodeService.save(questionCode);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        long newQuestionId = questionCode.getId();
        return ResultUtils.success(newQuestionId);
    }

    /**
     * 删除
     *
     * @param deleteRequest
     * @param request
     * @return
     */
    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteQuestionCode(@RequestBody DeleteRequest deleteRequest, HttpServletRequest request) {
        if (deleteRequest == null || deleteRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.getLoginUser(request);
        long id = deleteRequest.getId();
        // 判断是否存在
        QuestionCode oldQuestionCode = questionCodeService.getById(id);
        ThrowUtils.throwIf(oldQuestionCode == null, ErrorCode.NOT_FOUND_ERROR);
        // 仅本人或管理员可删除
        if (!oldQuestionCode.getUserId().equals(user.getId()) && !userService.isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        boolean b = questionCodeService.removeById(id);
        return ResultUtils.success(b);
    }

    /**
     * 批量删除
     *
     * @param deleteRequest
     * @param request
     * @return
     */
    @PostMapping("/batchDelete")
    public BaseResponse<Boolean> batchDeleteQuestionCode(@RequestBody DeleteRequest deleteRequest, HttpServletRequest request) {
        if (deleteRequest == null || deleteRequest.getIds() == null || deleteRequest.getIds().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.getLoginUser(request);
        List<Long> ids = deleteRequest.getIds();

        // 判断是否存在以及权限
        for (Long id : ids) {
            QuestionCode oldQuestionCode = questionCodeService.getById(id);
            ThrowUtils.throwIf(oldQuestionCode == null, ErrorCode.NOT_FOUND_ERROR);
            if (!oldQuestionCode.getUserId().equals(user.getId()) && !userService.isAdmin(request)) {
                throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
            }
        }
        boolean success = questionCodeService.removeByIds(ids);
        return ResultUtils.success(success);
    }

    /**
     * 批量下载MD文件
     *
     * @param
     * @return
     */

    @PostMapping("/batchDownload")
    public ResponseEntity<byte[]> batchDownloadQuestions(@RequestBody List<Long> ids) {
        List<QuestionCode> questionCodes = questionCodeMapper.selectBatchIds(ids);
        if (questionCodes.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        // 创建临时zip文件
        byte[] zipFileContent = createTempZipFile(questionCodes);

        // 设置响应头，指定文件名
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=questions.zip");

        // 返回文件内容
        return ResponseEntity.ok()
                .headers(headers)
                .contentLength(zipFileContent.length)
                .contentType(MediaType.parseMediaType("application/zip"))
                .body(zipFileContent);
    }

    private byte[] createTempZipFile(List<QuestionCode> questionCodes) {
        // 创建临时zip文件并写入问题内容，具体实现需要根据业务逻辑进行
        // 以下是一个简化的示例，实际需要根据具体需求进行实现
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            for (QuestionCode questionCode : questionCodes) {
                ZipEntry entry = new ZipEntry("question_code_" + questionCode.getId() + ".md");
                zos.putNextEntry(entry);
                zos.write(questionCode.getContent().getBytes());
                zos.closeEntry();
            }
        } catch (IOException e) {
            // 处理异常
        }
        return baos.toByteArray();
    }


    /**
     * 更新（仅管理员）
     *
     * @param questionUpdateRequest
     * @return
     */
    @PostMapping("/update")
    @AuthCheck(mustRole = UserConstant.DEFAULT_ROLE)
    public BaseResponse<Boolean> updateQuestionCode(@RequestBody QuestionUpdateRequest questionUpdateRequest) {
        if (questionUpdateRequest == null || questionUpdateRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QuestionCode questionCode = new QuestionCode();
        BeanUtils.copyProperties(questionUpdateRequest, questionCode);
        List<String> tags = questionUpdateRequest.getTags();
        if (tags != null) {
            questionCode.setTags(GSON.toJson(tags));
        }
        List<JudgeCase> judgeCase = questionUpdateRequest.getJudgeCase();
        if (judgeCase != null) {
            questionCode.setJudgeCase(GSON.toJson(judgeCase));
        }
        JudgeConfig judgeConfig = questionUpdateRequest.getJudgeConfig();
        if (judgeConfig != null) {
            questionCode.setJudgeConfig(GSON.toJson(judgeConfig));
        }
        // 参数校验
        questionCodeService.validQuestionCode(questionCode, false);
        long id = questionUpdateRequest.getId();
        // 判断是否存在
        QuestionCode oldQuestionCode = questionCodeService.getById(id);
        ThrowUtils.throwIf(oldQuestionCode == null, ErrorCode.NOT_FOUND_ERROR);
        boolean result = questionCodeService.updateById(questionCode);
        return ResultUtils.success(result);
    }

    /**
     * 根据 id 获取
     *
     * @param id
     * @return
     */
    @GetMapping("/get")
    public BaseResponse<QuestionCode> getQuestionCodeById(long id, HttpServletRequest request) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QuestionCode questionCode = questionCodeService.getById(id);
        if (questionCode == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        // 不是本人或管理员，不能直接获取所有信息
        if (!questionCode.getUserId().equals(loginUser.getId()) && !userService.isAdmin(loginUser)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        return ResultUtils.success(questionCode);
    }
    /**
     * 根据 id 获取
     *
     * @param id
     * @return
     */
    @GetMapping("/get2Answer")
    public BaseResponse<QuestionCode> getQuestionById2Answer(long id, HttpServletRequest request) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QuestionCode questionCode = questionCodeService.getById(id);
        if (questionCode == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        QuestionCode q1 = new QuestionCode();
        BeanUtils.copyProperties(q1,questionCode);
        q1.setAnswer(questionCode.getAnswer());
        return ResultUtils.success(q1);
    }

    /**
     * 根据 id 获取（脱敏）
     *
     * @param id
     * @return
     */
    @GetMapping("/get/vo")
    public BaseResponse<QuestionCodeVO> getQuestionCodeVOById(long id, HttpServletRequest request) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QuestionCode questionCode = questionCodeService.getById(id);
        if (questionCode == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        return ResultUtils.success(questionCodeService.getQuestionCodeVO(questionCode, request));
    }

    /**
     * 分页获取列表（封装类）
     *
     * @param questionQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/list/page/vo")
    public BaseResponse<Page<QuestionCodeVO>> listQuestionCodeVOByPage(@RequestBody QuestionQueryRequest questionQueryRequest,
                                                               HttpServletRequest request) {
        long current = questionQueryRequest.getCurrent();
        long size = questionQueryRequest.getPageSize();
        // 限制爬虫
        ThrowUtils.throwIf(size > 20, ErrorCode.PARAMS_ERROR);
        Page<QuestionCode> questionCodePage = questionCodeService.page(new Page<>(current, size),
                questionCodeService.getQueryWrapper(questionQueryRequest));
        return ResultUtils.success(questionCodeService.getQuestionCodeVOPage(questionCodePage, request));
    }

    /**
     * 分页获取当前用户创建的资源列表
     *
     * @param questionQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/my/list/page/vo")
    public BaseResponse<Page<QuestionCodeVO>> listMyQuestionCodeVOByPage(@RequestBody QuestionQueryRequest questionQueryRequest,
                                                                         HttpServletRequest request) {
        if (questionQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        questionQueryRequest.setUserId(loginUser.getId());
        long current = questionQueryRequest.getCurrent();
        long size = questionQueryRequest.getPageSize();
        // 限制爬虫
        ThrowUtils.throwIf(size > 20, ErrorCode.PARAMS_ERROR);
        Page<QuestionCode> questionCodePage = questionCodeService.page(new Page<>(current, size),
                questionCodeService.getQueryWrapper(questionQueryRequest));
        return ResultUtils.success(questionCodeService.getQuestionCodeVOPage(questionCodePage, request));
    }

    /**
     * 分页获取题目列表（仅管理员）
     *
     * @param questionQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/list/page")
    @AuthCheck(mustRole = UserConstant.ADMIN_ROLE)
    public BaseResponse<Page<QuestionCode>> listQuestionCodeByPage(@RequestBody QuestionQueryRequest questionQueryRequest,
                                                           HttpServletRequest request) {
        long current = questionQueryRequest.getCurrent();
        long size = questionQueryRequest.getPageSize();
        Page<QuestionCode> questionCodePage = questionCodeService.page(new Page<>(current, size),
                questionCodeService.getQueryWrapper(questionQueryRequest));
        return ResultUtils.success(questionCodePage);
    }

    // endregion

    /**
     * 编辑（用户）
     *
     * @param questionEditRequest
     * @param request
     * @return
     */
    @PostMapping("/edit")
    public BaseResponse<Boolean> editQuestionCode(@RequestBody QuestionEditRequest questionEditRequest, HttpServletRequest request) {
        if (questionEditRequest == null || questionEditRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QuestionCode questionCode = new QuestionCode();
        BeanUtils.copyProperties(questionEditRequest, questionCode);
        List<String> tags = questionEditRequest.getTags();
        if (tags != null) {
            questionCode.setTags(GSON.toJson(tags));
        }
        List<JudgeCase> judgeCase = questionEditRequest.getJudgeCase();
        if (judgeCase != null) {
            questionCode.setJudgeCase(GSON.toJson(judgeCase));
        }
        JudgeConfig judgeConfig = questionEditRequest.getJudgeConfig();
        if (judgeConfig != null) {
            questionCode.setJudgeConfig(GSON.toJson(judgeConfig));
        }
        // 参数校验
        questionCodeService.validQuestionCode(questionCode, false);
        User loginUser = userService.getLoginUser(request);
        long id = questionEditRequest.getId();
        // 判断是否存在
        QuestionCode oldQuestionCode = questionCodeService.getById(id);
        ThrowUtils.throwIf(oldQuestionCode == null, ErrorCode.NOT_FOUND_ERROR);
        // 仅本人或管理员可编辑
        if (!oldQuestionCode.getUserId().equals(loginUser.getId()) && !userService.isAdmin(loginUser)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        boolean result = questionCodeService.updateById(questionCode);
        return ResultUtils.success(result);
    }

    /**
     * 提交题目
     *
     * @param questionSubmitAddRequest
     * @param request
     * @return 提交记录的 id
     */
    @PostMapping("/question_submit/do")
    public BaseResponse<Long> doQuestionCodeSubmit(@RequestBody QuestionSubmitAddRequest questionSubmitAddRequest,
                                               HttpServletRequest request) {
        if (questionSubmitAddRequest == null || questionSubmitAddRequest.getQuestionId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 登录才能提交
        final User loginUser = userService.getLoginUser(request);
        long questionSubmitId = questionSubmitService.doQuestionSubmit(questionSubmitAddRequest, loginUser);
        return ResultUtils.success(questionSubmitId);
    }

    /**
     * 分页获取题目提交列表（除了管理员外，普通用户只能看到非答案、提交代码等公开信息）
     *
     * @param questionSubmitQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/question_submit/list/page")
    public BaseResponse<Page<QuestionSubmitVO>> listQuestionCodeSubmitByPage(@RequestBody QuestionSubmitQueryRequest questionSubmitQueryRequest,
                                                                         HttpServletRequest request) {
        long current = questionSubmitQueryRequest.getCurrent();
        long size = questionSubmitQueryRequest.getPageSize();
        // 从数据库中查询原始的题目提交分页信息
        Page<QuestionSubmit> questionSubmitPage = questionSubmitService.page(new Page<>(current, size),
                questionSubmitService.getQueryWrapper(questionSubmitQueryRequest));
        final User loginUser = userService.getLoginUser(request);
        // 返回脱敏信息
        return ResultUtils.success(questionSubmitService.getQuestionSubmitVOPage(questionSubmitPage, loginUser));
    }



}

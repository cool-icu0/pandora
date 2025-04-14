package com.cool.pandora.service.question;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cool.pandora.model.dto.questionCode.QuestionQueryRequest;
import com.cool.pandora.model.entity.question.QuestionCode;
import com.cool.pandora.model.vo.QuestionCodeVO;
import com.cool.pandora.model.vo.UserVO;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @Author Cool
 * @Date 2025/3/6 上午10:15
 */

public interface QuestionCodeService extends IService<QuestionCode> {
    /**
     * 校验
     *
     * @param questionCode
     * @param add
     */
    void validQuestionCode(QuestionCode questionCode, boolean add);

    /**
     * 获取查询条件
     *
     * @param questionQueryRequest
     * @return
     */
    QueryWrapper<QuestionCode> getQueryWrapper(QuestionQueryRequest questionQueryRequest);

    /**
     * 获取题目封装
     *
     * @param questionCode
     * @param request
     * @return
     */
    QuestionCodeVO getQuestionCodeVO(QuestionCode questionCode, HttpServletRequest request);

    /**
     * 分页获取题目封装
     *
     * @param questionCodePage
     * @param request
     * @return
     */
    Page<QuestionCodeVO> getQuestionCodeVOPage(Page<QuestionCode> questionCodePage, HttpServletRequest request);

    /**
     * 获取通过题目排行榜
     * @param limit 返回数量
     * @param year 年份
     * @param month 月份
     * @return 通过题目信息列表
     */
    List<UserVO> getQuestionCodeRank(Integer limit, Integer year, Integer month);
}

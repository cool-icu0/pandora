package com.cool.code.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cool.model.dto.questionCode.QuestionQueryRequest;
import com.cool.model.entity.question.QuestionCode;
import com.cool.model.vo.QuestionCodeVO;
import com.cool.model.vo.UserVO;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
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

    /**
     * 获取用户已完成的题目ID列表
     * @param userId 用户ID
     * @return 已完成的题目ID列表
     */
    List<Long> getCompletedQuestionIds(Long userId);

    /**
     * 获取用户最近时间段内完成的题目
     * @param userId 用户ID
     * @param date 时间段
     * @return 最近完成的题目列表
     */
    List<QuestionCode> selectRecentCompletedQuestions(Long userId, String date);

    /**
     * 获取最近时间段内完成的题目数量
     * @param userId 用户ID
     * @param date 时间段
     * @return 最近完成的题目数量
     */
    Integer getRecentCompletedQuestionsCount(Long userId, String date);
}

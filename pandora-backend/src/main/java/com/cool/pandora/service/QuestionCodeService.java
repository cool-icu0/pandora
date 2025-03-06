package com.cool.pandora.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.cool.pandora.model.dto.questionCode.QuestionQueryRequest;
import com.cool.pandora.model.entity.QuestionCode;
import com.cool.pandora.model.vo.QuestionCodeVO;

import javax.servlet.http.HttpServletRequest;

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

}

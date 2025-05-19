package com.cool.code.controller.inner;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cool.code.service.QuestionCodeService;
import com.cool.code.service.QuestionSubmitService;
import com.cool.model.entity.question.QuestionCode;
import com.cool.model.entity.question.QuestionSubmit;
import com.cool.server.QuestionCodeFeignClient;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 该服务仅内部调用，不是给前端的
 */

@RestController
@RequestMapping("/questionCode/inner")
public class QuestionCodeInnerController implements QuestionCodeFeignClient {

    @Resource
    private QuestionCodeService questionCodeService;
    @Resource
    private QuestionSubmitService questionSubmitService;

    @Override
    @GetMapping("/get/id")
    public QuestionCode getQuestionCodeById(@RequestParam("questionId") long questionId){
        return questionCodeService.getById(questionId);
    }
    @Override
    @GetMapping("/question_submit/get/id")
    public QuestionSubmit getQuestionSubmitById(@RequestParam("questionSubmitId") long questionSubmitId){
        return questionSubmitService.getById(questionSubmitId);
    }

    @Override
    @PostMapping("/question_submit/update")
    public boolean updateQuestionSubmitById(@RequestBody QuestionSubmit questionSubmit){
        return questionSubmitService.updateById(questionSubmit);
    }

    //根据参数获取题目
    @Override
    @PostMapping("/get/similar")
    public List<QuestionCode> getSimilarQuestionCode(QueryWrapper<QuestionCode> queryWrapper) {
        return questionCodeService.list(queryWrapper);
    }

    //获取用户已完成的题目ID列表
    @Override
    @GetMapping("/get/completed/question/ids")
    public List<Long> getCompletedQuestionIds(@RequestParam("userId") Long userId) {
        return questionCodeService.getCompletedQuestionIds(userId);
    }

    //获取用户最近时间段内完成的题目
    @Override
    @GetMapping("/questionCode/get/recent")
    public List<QuestionCode> getRecentCompletedQuestions(@RequestParam("userId") Long userId,
                                                          @RequestParam("date") String date) {
        return questionCodeService.selectRecentCompletedQuestions(userId, date);
    }

    //获取最近时间段内完成的题目数量
    @Override
    @GetMapping("/questionCode/get/recent/count")
    public Integer getRecentCompletedQuestionsCount(@RequestParam("userId") Long userId,
                                                    @RequestParam("date") String date) {
        return questionCodeService.getRecentCompletedQuestionsCount(userId, date);
    }

    //更新算法题目
    @Override
    @PostMapping("/update/code")
    public Boolean updateQuestionCode(QuestionCode questionCode) {
        return questionCodeService.updateById(questionCode);
    }

    //查询数据库提交信息
    @Override
    @GetMapping("/get/submit")
    public QuestionSubmit getQuestionSubmit(Long questionId) {
        return questionSubmitService.getById(questionId);
    }
}

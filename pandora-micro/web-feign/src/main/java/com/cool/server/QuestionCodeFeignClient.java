package com.cool.server;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cool.model.entity.question.QuestionCode;
import com.cool.model.entity.question.QuestionSubmit;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;

/**
* 题目服务
*/
@FeignClient(name = "web-code", path = "/api/questionCode/inner")
public interface QuestionCodeFeignClient {
    @GetMapping("/get/id")
    QuestionCode getQuestionCodeById(@RequestParam("questionId") long questionId);

    @GetMapping("/question_submit/get/id")
    QuestionSubmit getQuestionSubmitById(@RequestParam("questionSubmitId") long questionSubmitId);

    @PostMapping("/question_submit/update")
    boolean updateQuestionSubmitById(@RequestBody QuestionSubmit questionSubmit);

    //根据参数获取题目
    @PostMapping("/get/similar")
    List<QuestionCode> getSimilarQuestionCode(QueryWrapper<QuestionCode> queryWrapper);

    //获取用户已完成的题目ID列表
    @GetMapping("/get/completed/question/ids")
    List<Long> getCompletedQuestionIds(@RequestParam("userId") Long userId);

    //获取用户最近时间段内完成的题目
    @GetMapping("/questionCode/get/recent")
    List<QuestionCode> getRecentCompletedQuestions(@RequestParam("userId") Long userId,
                                                   @RequestParam("date") String date);

    //获取最近时间段内完成的题目数量
    @GetMapping("/questionCode/get/recent/count")
    Integer getRecentCompletedQuestionsCount(@RequestParam("userId") Long userId,
                                         @RequestParam("date") String date);
}

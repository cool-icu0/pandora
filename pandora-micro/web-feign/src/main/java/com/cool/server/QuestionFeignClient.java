package com.cool.server;
import com.cool.model.entity.question.QuestionCode;
import com.cool.model.entity.question.QuestionSubmit;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

/**
* 题目服务
*/
@FeignClient(name = "XmutOJ-backend-question-service", path = "/api/question/inner")
public interface QuestionFeignClient{
    @GetMapping("/get/id")
    QuestionCode getQuestionCodeById(@RequestParam("questionId") long questionId);

    @GetMapping("/question_submit/get/id")
    QuestionSubmit getQuestionSubmitById(@RequestParam("questionSubmitId") long questionSubmitId);

    @PostMapping("/question_submit/update")
    boolean updateQuestionSubmitById(@RequestBody QuestionSubmit questionSubmit);
}

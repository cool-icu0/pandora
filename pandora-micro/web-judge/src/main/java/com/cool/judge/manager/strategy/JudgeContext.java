package com.cool.judge.manager.strategy;


import com.cool.model.codesandbox.JudgeInfo;
import com.cool.model.dto.questionCode.JudgeCase;
import com.cool.model.entity.question.QuestionCode;
import com.cool.model.entity.question.QuestionSubmit;
import lombok.Data;

import java.util.List;

/**
 * 上下文（用于定义在策略中传递的参数）
 */
@Data
public class JudgeContext {

    private JudgeInfo judgeInfo;

    private List<String> inputList;

    private List<String> outputList;

    private List<JudgeCase> judgeCaseList;

    private QuestionCode questionCode;

    private QuestionSubmit questionSubmit;

}

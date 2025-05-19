package com.cool.judge.manager;

import com.cool.judge.manager.strategy.DefaultJudgeStrategy;
import com.cool.judge.manager.strategy.JavaLanguageJudgeStrategy;
import com.cool.judge.manager.strategy.JudgeContext;
import com.cool.judge.manager.strategy.JudgeStrategy;
import com.cool.model.codesandbox.JudgeInfo;
import com.cool.model.entity.question.QuestionSubmit;
import org.springframework.stereotype.Service;

/**
 * 判题管理（简化调用）
 */
@Service
public class JudgeManager {

    /**
     * 执行判题
     *
     * @param judgeContext
     * @return
     */
    public JudgeInfo doJudge(JudgeContext judgeContext) {
        QuestionSubmit questionSubmit = judgeContext.getQuestionSubmit();
        String language = questionSubmit.getSubmitLanguage();
        JudgeStrategy judgeStrategy = new DefaultJudgeStrategy();
        if ("java".equals(language)) {
            judgeStrategy = new JavaLanguageJudgeStrategy();
        }
        return judgeStrategy.doJudge(judgeContext);
    }
}
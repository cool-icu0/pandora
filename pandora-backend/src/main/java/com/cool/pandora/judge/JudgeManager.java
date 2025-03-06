package com.cool.pandora.judge;

import com.cool.pandora.judge.codesandbox.model.JudgeInfo;
import com.cool.pandora.judge.strategy.DefaultJudgeStrategy;
import com.cool.pandora.judge.strategy.JavaLanguageJudgeStrategy;
import com.cool.pandora.judge.strategy.JudgeContext;
import com.cool.pandora.judge.strategy.JudgeStrategy;
import com.cool.pandora.model.entity.QuestionSubmit;
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
    JudgeInfo doJudge(JudgeContext judgeContext) {
        QuestionSubmit questionSubmit = judgeContext.getQuestionSubmit();
        String language = questionSubmit.getSubmitLanguage();
        JudgeStrategy judgeStrategy = new DefaultJudgeStrategy();
        if ("java".equals(language)) {
            judgeStrategy = new JavaLanguageJudgeStrategy();
        }
        return judgeStrategy.doJudge(judgeContext);
    }
}
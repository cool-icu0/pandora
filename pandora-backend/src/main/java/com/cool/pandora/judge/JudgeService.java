package com.cool.pandora.judge;
import com.cool.pandora.model.dto.questionSubmit.QuestionRunAddRequest;
import com.cool.pandora.model.dto.questionSubmit.QuestionSubmitAddRequest;
import com.cool.pandora.model.entity.question.QuestionSubmit;

/**
 * 判题服务 ：执行代码
 */
public interface JudgeService {
    /**
     * 判题
     *
     * @param questionSubmitId
     * @return
     */
    // QuestionSubmit doJudge(long questionSubmitId);

    /**
     * 判题
     *
     * @param questionSubmitId
     * @return
     */
    QuestionSubmit doJudge(long questionSubmitId, QuestionSubmitAddRequest questionSubmitAddRequest);
}

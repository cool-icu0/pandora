package com.cool.judge.service.impl;

import cn.hutool.json.JSONUtil;
import com.cool.common.common.ErrorCode;
import com.cool.common.exception.BusinessException;
import com.cool.judge.manager.JudgeManager;
import com.cool.judge.codesandbox.CodeSandBoxProxy;
import com.cool.judge.codesandbox.CodeSandbox;
import com.cool.judge.codesandbox.CodeSandboxFactory;
import com.cool.judge.service.JudgeService;
import com.cool.judge.manager.strategy.JudgeContext;
import com.cool.model.codesandbox.ExecuteCodeRequest;
import com.cool.model.codesandbox.ExecuteCodeResponse;
import com.cool.model.codesandbox.JudgeInfo;
import com.cool.model.dto.questionCode.JudgeCase;
import com.cool.model.entity.question.QuestionCode;
import com.cool.model.entity.question.QuestionSubmit;
import com.cool.model.enums.QuestionSubmitStatusEnum;
import com.cool.server.QuestionCodeFeignClient;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 判题服务实现类
 */
@Service
public class JudgeServiceImpl implements JudgeService {

    @Resource
    private QuestionCodeFeignClient questionCodeFeignClient;

    @Resource
    private JudgeManager judgeManager;

    @Value("${codesandbox.type:example}")
    private String judgeType;

    @Override
    public QuestionSubmit doJudge(long questionSubmitId) {
        // 1、传入题目的提交 id，获取到对应的题目、提交信息（包含代码、编程语言等）
        QuestionSubmit questionSubmit = questionCodeFeignClient.getQuestionSubmitById(questionSubmitId);
        if (questionSubmit == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "提交信息不存在");
        }
        // 通过提交的信息中的题目id 获取到题目的全部信息
        Long questionId = questionSubmit.getQuestionId();
        QuestionCode questionCode = questionCodeFeignClient.getQuestionCodeById(questionId);
        if (questionId == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "题目不存在");
        }
        // 2、如果题目提交状态不为等待中，就不用重复执行了
        if (!questionSubmit.getSubmitState().equals(QuestionSubmitStatusEnum.WAITING.getValue())) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "题目正在判题中");
        }
        // 3、更改判题（题目提交）的状态为 “判题中”，防止重复执行，也能让用户即时看到状态
        QuestionSubmit updateQuestionSubmit = new QuestionSubmit();
        updateQuestionSubmit.setId(questionSubmitId);
        updateQuestionSubmit.setSubmitState(QuestionSubmitStatusEnum.RUNNING.getValue());
        boolean updateState = questionCodeFeignClient.updateQuestionSubmitById(updateQuestionSubmit);
        if (!updateState) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "题目状态更新失败");
        }
        //4、调用沙箱，获取到执行结果
        CodeSandbox codeSandbox = CodeSandboxFactory.newInstance(judgeType);
        codeSandbox = new CodeSandBoxProxy(codeSandbox);
        String submitLanguage = questionSubmit.getSubmitLanguage();
        String submitCode = questionSubmit.getSubmitCode();
        // 获取输入用例
        String judgeCaseStr = questionCode.getJudgeCase();
        List<JudgeCase> judgeCasesList = JSONUtil.toList(judgeCaseStr, JudgeCase.class);
        // 通过Lambda表达式获取到每个题目的输入用例
        List<String> inputList = judgeCasesList.stream().map(JudgeCase::getInput).collect(Collectors.toList());
        // 调用沙箱
        ExecuteCodeRequest executeCodeRequest = ExecuteCodeRequest.builder()
                .code(submitCode)
                .language(submitLanguage)
                .inputList(inputList)
                .build();
        ExecuteCodeResponse executeCodeResponse = codeSandbox.executeCode(executeCodeRequest);
        List<String> outputList = executeCodeResponse.getOutputList();
        // 5、根据沙箱的执行结果，设置题目的判题状态和信息
        JudgeContext judgeContext = new JudgeContext();
        judgeContext.setJudgeInfo(executeCodeResponse.getJudgeInfo());
        judgeContext.setInputList(inputList);
        judgeContext.setOutputList(outputList);
        judgeContext.setJudgeCaseList(judgeCasesList);
        judgeContext.setQuestionCode(questionCode);
        judgeContext.setQuestionSubmit(questionSubmit);
        // 进入到代码沙箱，执行程序，返回执行结果
        JudgeInfo judgeInfo = judgeManager.doJudge(judgeContext);
        // 6、修改判题结果
        updateQuestionSubmit = new QuestionSubmit();
        updateQuestionSubmit.setId(questionSubmitId);
        updateQuestionSubmit.setSubmitState(QuestionSubmitStatusEnum.SUCCEED.getValue());
        updateQuestionSubmit.setJudgeInfo(JSONUtil.toJsonStr(judgeInfo));
        updateState = questionCodeFeignClient.updateQuestionSubmitById(updateQuestionSubmit);
        //判完题目进行数据增加（通过率）
        System.out.println("test01:"+updateQuestionSubmit);
        //提交数+1
        // todo 1 增加一个判断
        if (questionCode.getSubmitNum() == null ){
            questionCode.setSubmitNum(1);
        } else {
            questionCode.setSubmitNum(questionCode.getSubmitNum() +1);
        }
        // 如果通过了，则通过数+1
        // 创建 Gson 对象
        Gson gson = new Gson();
        // 将 JSON 字符串解析为 JsonObject 对象
        JsonObject jsonObject = gson.fromJson(updateQuestionSubmit.getJudgeInfo(), JsonObject.class);
        // 获取 message 字段的值
        String message = jsonObject.get("message").getAsString();
        // 打印获取到的 message 值
//        System.out.println("message的值为：" + message);
        if (message.equals("成功")){
            if (questionCode.getAcceptedNum()==null){
                questionCode.setAcceptedNum(1);
            }else {
                questionCode.setAcceptedNum(questionCode.getAcceptedNum() + 1);
            }
        }
        //进行题目更新操作
        questionCodeFeignClient.updateQuestionCode(questionCode);
        System.out.println("题目更新成功:"+questionCode.toString());
        if (!updateState) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "题目状态更新失败");
        }
        // 再次查询数据库，返回最新提交信息
        QuestionSubmit questionSubmitResult = questionCodeFeignClient.getQuestionSubmit(questionId);
        return questionSubmitResult;
    }
}

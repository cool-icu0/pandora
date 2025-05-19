package com.cool.judge.codesandbox.impl;

import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.cool.judge.manager.AiManager;
import com.cool.judge.codesandbox.CodeSandbox;
import com.cool.model.codesandbox.ExecuteCodeRequest;
import com.cool.model.codesandbox.ExecuteCodeResponse;
import com.cool.model.codesandbox.JudgeInfo;
import com.cool.model.enums.JudgeInfoMessageEnum;
import com.cool.model.enums.QuestionSubmitStatusEnum;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * @Author Cool
 * @Date 2025/3/21 上午10:22
 */
@Service
public class AICodeSandbox implements CodeSandbox {

    @Resource
    private AiManager aiManager;

    @Override
    public ExecuteCodeResponse executeCode(ExecuteCodeRequest executeCodeRequest) {
        // 1. 构造系统提示词
        String systemPrompt = "你是一个代码执行和评判助手。请根据提供的代码和输入用例，模拟代码的执行过程，并返回执行结果。\n" +
                "要求：\n" +
                "1. 严格按照输入用例执行代码，不要有多余的操作\n" +
                "2. 返回每个用例的执行结果\n" +
                "3. 如果执行过程中发生错误，需要指出具体的错误信息\n" +
                "4. 统计代码的执行时间和消耗的内存,只为整数类型，不要有除了整数其他东西\n" +
                "5. 判断代码的执行结果是否符合预期\n" +
                "输出格式：\n" +
                "{\n" +
                "  \"status\": \"SUCCESS/FAILED\",\n" +
                "  \"message\": \"执行信息\",\n" +
                "  \"results\": [每个测试用例的输出结果],\n" +
                "  \"memory\": \"内存消耗\",\n" +
                "  \"time\": \"执行时间\"\n" +
                "}";

        // 2. 构造用户提示词
        String code = executeCodeRequest.getCode();
        List<String> inputList = executeCodeRequest.getInputList();
        String userPrompt = String.format("请执行以下代码：\n%s\n输入用例：\n%s", 
                code, String.join("\n", inputList));

        // 3. 调用 AI 执行代码
        String executeResult = aiManager.doChat(systemPrompt, userPrompt);
        System.out.println("输出"+executeResult);
        String jsonContent = executeResult.replaceAll("`{3}", "").replaceAll("json", "").trim();
        Map map = JSONUtil.toBean(jsonContent, Map.class);
        JSONObject jsonObject = new JSONObject(jsonContent);
        // 4. 解析 AI 返回结果
        ExecuteCodeResponse executeCodeResponse = new ExecuteCodeResponse();
        //解析 AI 返回的 JSON 结果，设置到 response 对象中
        executeCodeResponse.setOutputList((List<String>) map.get("results"));
        executeCodeResponse.setMessage(jsonObject.getStr("message"));
        executeCodeResponse.setStatus(QuestionSubmitStatusEnum.SUCCEED.getValue());
        JudgeInfo judgeInfo = new JudgeInfo();
        judgeInfo.setMessage(JudgeInfoMessageEnum.ACCEPTED.getText());
        judgeInfo.setMemory(jsonObject.getLong("memory"));
        judgeInfo.setTime(jsonObject.getLong("time"));
        if (jsonObject.getStr("status").equals("SUCCESS")){
            judgeInfo.setMessage("成功");
        }
        executeCodeResponse.setJudgeInfo(judgeInfo);
        return executeCodeResponse;
    }
}

package com.cool.judge.codesandbox.impl;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONUtil;
import com.cool.common.common.ErrorCode;
import com.cool.common.exception.BusinessException;
import com.cool.judge.codesandbox.CodeSandbox;
import com.cool.model.codesandbox.ExecuteCodeRequest;
import com.cool.model.codesandbox.ExecuteCodeResponse;
import org.apache.commons.lang3.StringUtils;


/**
 * 远程代码沙箱（实际调用接口的沙箱）
 */
public class RemoteCodeSandbox implements CodeSandbox {

    // 定义鉴权请求头和密钥
    private static final String AUTH_REQUEST_HEADER = "auth";

    private static final String AUTH_REQUEST_SECRET = "secretKey";


    @Override
    public ExecuteCodeResponse executeCode(ExecuteCodeRequest executeCodeRequest) {
        System.out.println("远程代码沙箱");
        String url = "http://localhost:8090/executeCode";
        String json = JSONUtil.toJsonStr(executeCodeRequest);
        String responseStr = HttpUtil.createPost(url)
                .header(AUTH_REQUEST_HEADER, AUTH_REQUEST_SECRET)
                .body(json)
                .execute()
                .body();
        if (StringUtils.isBlank(responseStr)) {
            throw new BusinessException(ErrorCode.API_REQUEST_ERROR, "executeCode remoteSandbox error, message = " + responseStr);
        }
        return JSONUtil.toBean(responseStr, ExecuteCodeResponse.class);
    }
}


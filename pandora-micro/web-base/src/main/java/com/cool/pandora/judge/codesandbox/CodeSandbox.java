package com.cool.pandora.judge.codesandbox;

import com.cool.pandora.judge.codesandbox.model.ExecuteCodeRequest;
import com.cool.pandora.judge.codesandbox.model.ExecuteCodeResponse;

/**
 * 代码沙箱接口定义
 */
public interface CodeSandbox {

    /**
     * 代码沙箱执行代码接口
     *
     * @param executeCodeRequest
     * @return
     */
    ExecuteCodeResponse executeCode(ExecuteCodeRequest executeCodeRequest);
}

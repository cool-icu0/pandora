package com.cool.pandora.model.vo;

import cn.hutool.json.JSONUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.baomidou.mybatisplus.annotation.TableName;
import com.cool.pandora.model.dto.questionCode.JudgeConfig;
import com.cool.pandora.model.entity.QuestionCode;
import lombok.Data;
import org.springframework.beans.BeanUtils;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
 * 题目
 *
 * @TableName question_code
 */
@TableName(value = "question_code")
@Data
public class QuestionCodeVO implements Serializable {
    /**
     * id
     */
    private Long id;

    /**
     * 创建题目用户 id
     */
    private Long userId;

    /**
     * 标题
     */
    private String title;

    /**
     * 内容
     */
    private String content;

    /**
     * 标签列表（json 数组）
     */
    private List<String> tags;

    /**
     * 判题配置（json 对象）
     */
    private JudgeConfig judgeConfig;

    /**
     * 题目提交数
     */
    private Integer submitNum;

    /**
     * 题目通过数
     */
    private Integer acceptedNum;

    /**
     * 点赞数
     */
    private Integer thumbNum;

    /**
     * 收藏数
     */
    private Integer favourNum;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
    /**
     * 创建题目人的信息
     */
    private UserVO userVO;

    private static final long serialVersionUID = 1L;

    /**
     * 包装类转对象
     *
     * @param questionCodeVO
     * @return
     */
    public static QuestionCode voToObj(QuestionCodeVO questionCodeVO) {
        if (questionCodeVO == null) {
            return null;
        }
        QuestionCode questionCode = new QuestionCode();
        BeanUtils.copyProperties(questionCodeVO, questionCode);
        List<String> tagList = questionCodeVO.getTags();
        if (tagList != null) {
            String jsonStr = JSONUtil.toJsonStr(tagList);
            questionCode.setTags(jsonStr);
        }
        JudgeConfig voJudgeConfig = questionCodeVO.getJudgeConfig();
        if (voJudgeConfig != null) {
            questionCode.setJudgeConfig(JSONUtil.toJsonStr(voJudgeConfig));
        }
        return questionCode;
    }

    /**
     * 对象转包装类
     *
     * @param questionCode
     * @return
     */
    public static QuestionCodeVO objToVo(QuestionCode questionCode) {
        if (questionCode == null) {
            return null;
        }
        QuestionCodeVO questionCodeVO = new QuestionCodeVO();
        BeanUtils.copyProperties(questionCode, questionCodeVO);
        // List<String> tagList = JSONUtil.toList(questionCode.getTags(), String.class);
        JSONArray tagsArray = JSON.parseArray(questionCode.getTags());
        List<String> tagList = tagsArray.toJavaList(String.class);
        questionCodeVO.setTags(tagList);
        String judgeConfig = questionCode.getJudgeConfig();
        questionCodeVO.setJudgeConfig(JSONUtil.toBean(judgeConfig, JudgeConfig.class));

        return questionCodeVO;
    }
}
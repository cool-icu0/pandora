package com.cool.pandora.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cool.pandora.manager.AiManager;
import com.cool.pandora.mapper.QuestionViewsMapper;
import com.cool.pandora.model.entity.QuestionViews;
import com.cool.pandora.service.QuestionBankQuestionService;
import com.cool.pandora.service.QuestionViewsService;
import com.cool.pandora.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * 题目服务实现

 */
@Service
@Slf4j
public class QuestionViewsServiceImpl extends ServiceImpl<QuestionViewsMapper, QuestionViews> implements QuestionViewsService {

    @Resource
    private UserService userService;

    @Resource
    private QuestionBankQuestionService questionBankQuestionService;

    @Resource
    private ElasticsearchRestTemplate elasticsearchRestTemplate;

    @Resource
    private AiManager aiManager;

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    // Redis中题目浏览量的key前缀
    private static final String QUESTION_VIEW_COUNT_KEY_PREFIX = "question:view:count:";

    /**
     * 增加题目浏览量
     *
     * @param questionId
     * @return
     */
    @Override
    public boolean increaseViewCount(Long questionId) {
        
        // 2. 构建Redis key
        String redisKey = QUESTION_VIEW_COUNT_KEY_PREFIX + questionId;
        
        // 3. 增加浏览量
        redisTemplate.opsForValue().increment(redisKey, 1);
        
        // 4. 设置过期时间（可选，这里设置7天）
        redisTemplate.expire(redisKey, 7, TimeUnit.DAYS);
        return true;
    }

    /**
     * 获取题目浏览量
     *
     * @param questionId
     * @return
     */
    @Override
    public long getViewCount(Long questionId) {
        // 1. 构建Redis key
        String redisKey = QUESTION_VIEW_COUNT_KEY_PREFIX + questionId;
        
        // 2. 从Redis获取浏览量
        Object viewCountObj = redisTemplate.opsForValue().get(redisKey);
        long redisViewCount = 0;
        if (viewCountObj != null) {
            redisViewCount = Long.parseLong(viewCountObj.toString());
        }
        
        // 3. 如果Redis中没有，则从数据库获取
        if (redisViewCount == 0) {

            // 从数据库获取浏览量
            QuestionViews views = this.getById(questionId);
            if (views != null && views.getViewCount() != null) {
                redisViewCount = views.getViewCount();
                // 将数据库中的浏览量同步到Redis
                redisTemplate.opsForValue().set(redisKey, redisViewCount, 7, TimeUnit.DAYS);
            }
        }
        
        return redisViewCount;
    }

    @Override
    public void syncViewCountToDb() {
        try {
            // 1. 获取所有需要同步的键
            Set<String> keys = redisTemplate.keys(QUESTION_VIEW_COUNT_KEY_PREFIX + "*");
            if (keys == null || keys.isEmpty()) {
                log.info("No view count data to sync");
                return;
            }
            
            log.info("Start syncing view count data, total: {}", keys.size());
            
            // 2. 遍历所有键，更新到数据库
            for (String key : keys) {
                try {
                    // 提取题目ID
                    String questionIdStr = key.substring(QUESTION_VIEW_COUNT_KEY_PREFIX.length());
                    Long questionId = Long.valueOf(questionIdStr);
                    
                    // 获取Redis中的浏览量
                    Object viewCountObj = redisTemplate.opsForValue().get(key);
                    if (viewCountObj == null) {
                        continue;
                    }
                    
                    long viewCount = Long.parseLong(viewCountObj.toString());
                    
                    // 更新数据库
                    QuestionViews question = new QuestionViews();
                    question.setId(questionId);
                    question.setViewCount(viewCount);
                    this.updateById(question);
                    
                    log.info("Synced view count for question {}: {}", questionId, viewCount);
                } catch (Exception e) {
                    log.error("Error syncing view count for key: " + key, e);
                }
            }
            
            log.info("View count sync completed");
        } catch (Exception e) {
            log.error("Error syncing view count data", e);
        }
    }

}







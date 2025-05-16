package com.cool.post.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.cool.model.entity.post.PostViews;
import com.cool.post.mapper.PostViewsMapper;
import com.cool.post.service.PostViewsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * 帖子服务实现

 */
@Service
@Slf4j
public class PostViewsServiceImpl extends ServiceImpl<PostViewsMapper, PostViews> implements PostViewsService {

    @Resource
    private RedisTemplate<String, Object> redisTemplate;

    // Redis中帖子浏览量的key前缀
    private static final String POST_VIEW_COUNT_KEY_PREFIX = "post:view:count:";

    /**
     * 增加帖子浏览量
     *
     * @param postId 帖子ID
     * @return 是否添加成功
     */

    @Override
    public boolean addPostViews(Long postId) {
        
        // 2. 构建Redis key
        String redisKey = POST_VIEW_COUNT_KEY_PREFIX + postId;
        
        // 3. 增加浏览量
        redisTemplate.opsForValue().increment(redisKey, 1);
        
        // 4. 设置过期时间（可选，这里设置7天）
        redisTemplate.expire(redisKey, 7, TimeUnit.DAYS);
        return true;
    }

    /**
     * 获取帖子浏览量
     *
     * @param postId 帖子ID
     * @return 浏览量
     */
    @Override
    public long getPostViews(Long postId) {
        // 1. 构建Redis key
        String redisKey = POST_VIEW_COUNT_KEY_PREFIX + postId;
        
        // 2. 从Redis获取浏览量
        Object viewCountObj = redisTemplate.opsForValue().get(redisKey);
        long redisViewCount = 0;
        if (viewCountObj != null) {
            redisViewCount = Long.parseLong(viewCountObj.toString());
        }
        
        // 3. 如果Redis中没有，则从数据库获取
        if (redisViewCount == 0) {

            // 从数据库获取浏览量
            PostViews views = this.getById(postId);
            if (views != null && views.getViewCount() != null) {
                redisViewCount = views.getViewCount();
                // 将数据库中的浏览量同步到Redis
                redisTemplate.opsForValue().set(redisKey, redisViewCount, 7, TimeUnit.DAYS);
            }
        }
        
        return redisViewCount;
    }

    /**
     * 同步Redis中的浏览量数据到MySQL
     */
    @Override
    public void syncViewCountPostToDb() {
        try {
            // 1. 获取所有需要同步的键
            Set<String> keys = redisTemplate.keys(POST_VIEW_COUNT_KEY_PREFIX + "*");
            if (keys == null || keys.isEmpty()) {
                log.info("No view count data to sync");
                return;
            }
            
            log.info("Start syncing view count data, total: {}", keys.size());
            
            // 2. 遍历所有键，更新到数据库
            for (String key : keys) {
                try {
                    // 提取帖子ID
                    String postIdStr = key.substring(POST_VIEW_COUNT_KEY_PREFIX.length());
                    Long postId = Long.valueOf(postIdStr);
                    
                    // 获取Redis中的浏览量
                    Object viewCountObj = redisTemplate.opsForValue().get(key);
                    if (viewCountObj == null) {
                        continue;
                    }
                    
                    long viewCount = Long.parseLong(viewCountObj.toString());
                    
                    // 更新数据库
                    PostViews post = new PostViews();
                    post.setId(postId);
                    post.setViewCount(viewCount);
                    this.updateById(post);
                    
                    log.info("Synced view count for post {}: {}", postId, viewCount);
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







package com.cool.pandora.service.recommend.algorithm;

import cn.hutool.core.date.DateUtil;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.cool.pandora.mapper.UserMapper;
import com.cool.pandora.mapper.question.QuestionCodeMapper;
import com.cool.pandora.mapper.question.QuestionCommentMapper;
import com.cool.pandora.model.entity.User;
import com.cool.pandora.model.entity.question.QuestionCode;
import com.cool.pandora.model.entity.recommend.QuestionRecommend;
import com.cool.pandora.model.entity.recommend.UserRecommend;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class RecommendAlgorithm {

    @Resource
    private UserMapper userMapper;

    @Resource
    private QuestionCodeMapper questionCodeMapper;

    @Resource
    private QuestionCommentMapper questionCommentMapper;

    /**
     * 查找相似用户
     */
    public List<User> findSimilarUsers(Long userId) {
        // 1. 获取用户标签
        User user = userMapper.selectById(userId);
        List<String> userTags = parseUserTags(user);

        // 2. 查找具有相似标签的用户
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.ne("id", userId);
        for (String tag : userTags) {
            queryWrapper.or().like("expertiseDirection", tag);
        }
        return userMapper.selectList(queryWrapper);
    }


    /**
     * 获取相似题目推荐
     */
    public List<QuestionRecommend> getSimilarQuestions(Long userId) {
        // 1. 获取用户最近完成的题目
        List<QuestionCode> recentQuestions = getRecentCompletedQuestions(userId);

        // 2. 基于题目标签找相似题目
        Set<Long> recommendQuestionIds = new HashSet<>();
        for (QuestionCode question : recentQuestions) {
            List<String> tags = parseQuestionTags(question);
            QueryWrapper<QuestionCode> queryWrapper = new QueryWrapper<>();
            queryWrapper.ne("id", question.getId());
            for (String tag : tags) {
                queryWrapper.or().like("tags", tag);
            }
            queryWrapper.last("LIMIT 5");
            List<QuestionCode> similar = questionCodeMapper.selectList(queryWrapper);
            similar.forEach(q -> recommendQuestionIds.add(q.getId()));
        }

        // 3. 生成推荐记录
        return createQuestionRecommendations(userId, recommendQuestionIds, "similar");
    }

    /**
     * 获取每日推荐题目
     */
    public List<QuestionRecommend> getDailyRecommendations(Long userId) {
        // 1. 获取用户已完成的题目
        List<Long> completedQuestionIds = questionCodeMapper.selectCompletedQuestionIds(userId);

        // 2. 随机选择一些题目
        QueryWrapper<QuestionCode> queryWrapper = new QueryWrapper<>();
        if (completedQuestionIds != null && !completedQuestionIds.isEmpty()) {
            queryWrapper.notIn("id", completedQuestionIds);
        }
        List<QuestionCode> dailyQuestions = questionCodeMapper.selectList(
            queryWrapper.orderByAsc("RAND()").last("LIMIT 50")
        );

        // 3. 生成推荐记录
        return createQuestionRecommendations(userId,
                dailyQuestions.stream().map(QuestionCode::getId).collect(Collectors.toSet()),
                "daily");
    }

    /**
     * 获取难度递进的题目
     */
    public List<QuestionRecommend> getLevelProgressions(Long userId) {
        // 1. 获取用户当前水平
        String currentLevel = getUserLevel(userId);

        // 2. 选择稍难的题目
        List<QuestionCode> progressionQuestions = questionCodeMapper.selectList(new QueryWrapper<QuestionCode>()
                .gt("difficulty", currentLevel)
                .last("LIMIT 10"));

        // 3. 生成推荐记录
        return createQuestionRecommendations(userId,
                progressionQuestions.stream().map(QuestionCode::getId).collect(Collectors.toSet()),
                "level");
    }

    // 计算用户分数
    public List<UserRecommend> calculateUserScores(Long userId, List<User> similarUsers) {
        // 获取当前用户信息
        User currentUser = userMapper.selectById(userId);
        List<String> currentUserTags = JSONObject.parseArray(currentUser.getExpertiseDirection(), String.class);

        List<UserRecommend> recommendations = new ArrayList<>();

        for (User similarUser : similarUsers) {
            // 1.计算标签相似度
            List<String> similarUserTags = JSONObject.parseArray(similarUser.getExpertiseDirection(), String.class);
            float tagSimilarity = calculateTagSimilarity(currentUserTags, similarUserTags);

            // 2.计算工作经验匹配度
            float experienceMatch = calculateExperienceMatch(currentUser.getWorkExperience(), similarUser.getWorkExperience());

            // 3.计算活跃度分数
            // 3.1计算用户最近一个月的活跃度
            Date oneMonthAgo = DateUtil.offsetMonth(new Date(), -1);
            // 3.2获取用户最近一个月的题目完成数量
            Integer questionCount = questionCodeMapper.countUserCompletedQuestions(userId, oneMonthAgo);
            // 3.3计算活跃度分数
            float activityScore = Math.min(1f,questionCount / 100f);

            // 综合计算最终分数 (权重可以根据实际需求调整)
            float finalScore = tagSimilarity * 0.5f + experienceMatch * 0.3f + activityScore * 0.2f;

            // 生成推荐原因
            String reason = generateRecommendReason(tagSimilarity, experienceMatch, activityScore);

            // 创建推荐记录
            UserRecommend recommend = new UserRecommend();
            recommend.setUserId(userId);
            recommend.setRecommendUserId(similarUser.getId());
            recommend.setScore(finalScore);
            recommend.setReason(reason);
            recommend.setTags(JSONObject.toJSONString(getCommonTags(currentUserTags, similarUserTags)));
            recommend.setStatus(1); // 待处理状态

            recommendations.add(recommend);
        }

        return recommendations;
    }

    private float calculateTagSimilarity(List<String> tags1, List<String> tags2) {
        if (tags1 == null || tags2 == null || tags1.isEmpty() || tags2.isEmpty()) {
            return 0f;
        }

        // 计算共同标签数量
        Set<String> commonTags = new HashSet<>(tags1);
        commonTags.retainAll(tags2);

        // 使用 Jaccard 相似度
        Set<String> allTags = new HashSet<>(tags1);
        allTags.addAll(tags2);

        return (float) commonTags.size() / allTags.size();
    }

    private float calculateExperienceMatch(String exp1, String exp2) {
        if (exp1 == null || exp2 == null) {
            return 0f;
        }

        // 简单的经验年限匹配度计算
        int years1 = parseExperienceYears(exp1);
        int years2 = parseExperienceYears(exp2);

        // 计算经验年限差距，差距越小分数越高
        return 1f / (1f + Math.abs(years1 - years2));
    }

    private String generateRecommendReason(float tagSimilarity, float experienceMatch, float activityScore) {
        List<String> reasons = new ArrayList<>();

        if (tagSimilarity > 0.5) {
            reasons.add("你们有相似的技术方向");
        }
        if (experienceMatch > 0.7) {
            reasons.add("工作经验相近");
        }
        if (activityScore > 0.6) {
            reasons.add("该用户最近很活跃");
        }

        return String.join("，", reasons);
    }

    /**
     * 解析用户标签
     */
    private List<String> parseUserTags(User user) {
        if (user == null || user.getExpertiseDirection() == null) {
            return new ArrayList<>();
        }
        return JSONObject.parseArray(user.getExpertiseDirection(), String.class);
    }

    /**
     * 解析题目标签标签
     */
    private List<String> parseQuestionTags(QuestionCode question) {
        if (question == null || question.getTags() == null) {
            return new ArrayList<>();
        }
        return JSONObject.parseArray(question.getTags(), String.class);
    }

    /**
     * 获取用户最近完成的题目
     */
    private List<QuestionCode> getRecentCompletedQuestions(Long userId) {
        // 获取最近一个月完成的题目
        Date oneMonthAgo = DateUtil.offsetMonth(new Date(), -1);
        return questionCodeMapper.selectRecentCompletedQuestions(userId, oneMonthAgo);
    }

    /**
     * 获取用户当前水平
     * @return EASY, MEDIUM, HARD
     */
    private String getUserLevel(Long userId) {
        Date threeMonthAgo = DateUtil.offsetMonth(new Date(), -3);
        // 1. 获取用户最近完成的题目难度分布
        Map<String, Long> difficultyStats = questionCodeMapper.selectRecentCompletedQuestions(userId,threeMonthAgo)  // 统计最近3个月
                .stream()
                .collect(Collectors.groupingBy(
                        QuestionCode::getDifficulty,
                        Collectors.counting()
                ));
        
        // 2. 计算总完成题目数
        long totalSolved = difficultyStats.values().stream().mapToLong(Long::longValue).sum();
        if (totalSolved == 0) {
            return "EASY";  // 未完成任何题目，返回初始难度
        }

        // 3. 计算各难度题目的占比
        double easyRatio = difficultyStats.getOrDefault("EASY", 0L) / (double) totalSolved;
        double mediumRatio = difficultyStats.getOrDefault("MEDIUM", 0L) / (double) totalSolved;
        double hardRatio = difficultyStats.getOrDefault("HARD", 0L) / (double) totalSolved;

        // 4. 判断用户水平
        if (hardRatio >= 0.2) {  // 困难题目占比超过20%
            return "HARD";
        } else if (mediumRatio >= 0.4) {  // 中等题目占比超过40%
            return "MEDIUM";
        } else if (easyRatio >= 0.6) {  // 简单题目完成较多
            return "EASY";
        } else {
            // 根据完成题目的最高难度判断
            if (difficultyStats.containsKey("HARD")) {
                return "HARD";
            } else if (difficultyStats.containsKey("MEDIUM")) {
                return "MEDIUM";
            } else {
                return "EASY";
            }
        }
    }

    /**
     * 解析工作经验年限
     */
    private int parseExperienceYears(String experience) {
        if (experience == null || experience.isEmpty()) {
            return 0;
        }
        // 假设格式为："3年经验" 或 "3"
        try {
            return Integer.parseInt(experience.replaceAll("[^0-9]", ""));
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    /**
     * 创建题目推荐记录
     */
    private List<QuestionRecommend> createQuestionRecommendations(Long userId, Set<Long> questionIds, String type) {
        List<QuestionRecommend> recommendations = new ArrayList<>();

        for (Long questionId : questionIds) {
            QuestionCode questionCode =  questionCodeMapper.selectById(questionId);
            if (questionCode == null) {
                continue;
            }

            // 计算推荐分数（可以根据具体需求调整计算方式）
            float score = calculateQuestionScore(userId, questionCode, type);

            QuestionRecommend recommend = new QuestionRecommend();
            recommend.setUserId(userId);
            recommend.setQuestionId(questionId);
            recommend.setScore(score);
            recommend.setReason(generateQuestionRecommendReason(questionCode, type));
            recommend.setType(type);
            recommend.setStatus(0); // 未查看状态

            recommendations.add(recommend);
        }

        return recommendations;
    }

    /**
     * 计算题目推荐分数
     */
    private float calculateQuestionScore(Long userId, QuestionCode questionCode, String type) {
        float score = 0.5f; // 基础分数

        switch (type) {
            case "similar":
                // 基于标签相似度计算分数
                List<String> userPreferredTags = getUserPreferredTags(userId);
                List<String> questionTags = parseQuestionTags(questionCode);
                score += calculateTagSimilarity(userPreferredTags, questionTags) * 0.5f;
                break;
            case "daily":
                // 考虑题目的通过率和难度
                score += calculateDailyScore(questionCode);
                break;
            case "level":
                // 考虑难度递进关系
                score += calculateLevelScore(userId, questionCode);
                break;
        }

        return Math.min(1.0f, score);
    }

    /**
     * 获取用户偏好的标签
     */
    private List<String> getUserPreferredTags(Long userId) {
        Date threeMonthAgo = DateUtil.offsetMonth(new Date(), -3);
        // 1. 获取用户最近完成的题目
        List<QuestionCode> completedQuestions = questionCodeMapper.selectRecentCompletedQuestions(userId,threeMonthAgo);  // 获取最近3个月的数据
        
        if (completedQuestions.isEmpty()) {
            // 如果没有完成的题目，返回用户个人信息中的技术方向
            User user = userMapper.selectById(userId);
            return parseUserTags(user);
        }

        // 2. 统计标签出现频率
        Map<String, Integer> tagFrequency = new HashMap<>();
        for (QuestionCode questionCode : completedQuestions) {
            List<String> tags = parseQuestionTags(questionCode);
            for (String tag : tags) {
                tagFrequency.merge(tag, 1, Integer::sum);
            }
        }

        // 3. 按频率排序并返回前5个最常用的标签
        return tagFrequency.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
    }

    /**
     * 计算每日推荐分数
     */
    private float calculateDailyScore(QuestionCode questionCode) {
        // 可以根据题目的通过率、点赞数等因素计算分数
        return 0.7f; // 示例固定值，实际应该根据具体因素计算
    }

    /**
     * 计算难度递进分数
     */
    private float calculateLevelScore(Long userId, QuestionCode questionCode) {
        String userLevel = getUserLevel(userId);
        String questionLevel = questionCode.getDifficulty();
        // 根据用户水平和题目难度的关系计算分数
        // 难度略高于用户水平的题目得分较高
        return 0.8f; // 示例固定值，实际应该根据具体因素计算
    }

    /**
     * 生成题目推荐原因
     */
    private String generateQuestionRecommendReason(QuestionCode questionCode, String type) {
        switch (type) {
            case "similar":
                return "与你最近做过的题目类似";
            case "daily":
                return "每日推荐题目";
            case "level":
                return "适合你当前水平的进阶题目";
            default:
                return "";
        }
    }

    private List<String> getCommonTags(List<String> tags1, List<String> tags2) {
        Set<String> commonTags = new HashSet<>(tags1);
        commonTags.retainAll(tags2);
        return new ArrayList<>(commonTags);
    }
}
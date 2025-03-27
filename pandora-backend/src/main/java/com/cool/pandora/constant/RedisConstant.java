package com.cool.pandora.constant;

/**
 * Redis 常量
 */
public interface RedisConstant {

    /**
     * 用户签到记录的 Redis key 前缀
     */
    String USER_SIGN_IN_REDIS_KEY_PREFIX = "user:signins";

    /**
     * 获取用户签到记录的 Redis Key
     * @param year 年份
     * @param userId 用户 id
     * @return 拼接好的 Redis Key
     */
    static String getUserSignInRedisKey(int year, long userId) {
        return String.format("%s:%s:%S", USER_SIGN_IN_REDIS_KEY_PREFIX, year, userId);
    }

    /**
     * 获取用户签到排行榜 Redis Key
     */
    static String getUserSignInRankKey(int year) {
        return String.format("pandora:user:sign_in:rank:%d", year);
    }

    /**
     * 获取用户月度签到排行榜 Redis Key
     */
    static String getUserSignInMonthlyRankKey(int year, int month) {
        return String.format("pandora:user:sign_in:rank:%d:%02d", year, month);
    }

    /**
     * 获取用户总签到排行榜 Redis Key
     */
    static String getUserSignInTotalRankKey() {
        return "pandora:user:sign_in:rank:total";
    }

    /**
     * 获取用户排行榜缓存 Redis Key
     */
    public static String getUserRankCacheKey() {
        return "pandora:user:rank:cache:%d";
    }
}

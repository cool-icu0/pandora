/*
 Navicat Premium Data Transfer

 Source Server         : a
 Source Server Type    : MySQL
 Source Server Version : 80040
 Source Host           : localhost:3306
 Source Schema         : pandora

 Target Server Type    : MySQL
 Target Server Version : 80040
 File Encoding         : 65001

 Date: 01/09/2025 17:39:22
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for comment_thumb
-- ----------------------------
DROP TABLE IF EXISTS `comment_thumb`;
CREATE TABLE `comment_thumb`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `commentId` bigint NOT NULL COMMENT '评论ID',
  `userId` bigint NOT NULL COMMENT '用户ID',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_comment_user`(`commentId` ASC, `userId` ASC) USING BTREE,
  INDEX `idx_user_id`(`userId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 81 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '评论点赞表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for mock_interview
-- ----------------------------
DROP TABLE IF EXISTS `mock_interview`;
CREATE TABLE `mock_interview`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `workExperience` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '工作年限',
  `jobPosition` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '工作岗位',
  `difficulty` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '面试难度',
  `messages` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '消息列表（JSON 对象数组字段，同时包括了总结）',
  `status` int NOT NULL DEFAULT 0 COMMENT '状态（0-待开始、1-进行中、2-已结束）',
  `userId` bigint NOT NULL COMMENT '创建人（用户 id）',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除（逻辑删除）',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_userId`(`userId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '模拟面试' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post`  (
  `id` bigint NOT NULL COMMENT '帖子ID',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '帖子标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '帖子内容',
  `tags` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '标签列表(JSON格式)',
  `thumbNum` int NULL DEFAULT 0 COMMENT '点赞数',
  `favourNum` int NULL DEFAULT 0 COMMENT '收藏数',
  `userId` bigint NOT NULL COMMENT '创建用户ID',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除(0-未删除, 1-已删除)',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user_id`(`userId` ASC) USING BTREE,
  INDEX `idx_create_time`(`createTime` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '帖子表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for post_comment
-- ----------------------------
DROP TABLE IF EXISTS `post_comment`;
CREATE TABLE `post_comment`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `postId` bigint NOT NULL COMMENT '帖子ID',
  `userId` bigint NOT NULL COMMENT '评论用户ID',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评论内容',
  `parentId` bigint NULL DEFAULT NULL COMMENT '父评论ID，如果是一级评论则为NULL',
  `rootId` bigint NULL DEFAULT NULL COMMENT '根评论ID，如果是一级评论则为NULL',
  `replyUserId` bigint NULL DEFAULT NULL COMMENT '回复用户ID，如果是一级评论则为NULL',
  `thumbNum` int NULL DEFAULT 0 COMMENT '点赞数',
  `replyCount` int NULL DEFAULT 0 COMMENT '回复数量',
  `heat` int NULL DEFAULT 0 COMMENT '热度值，用于排序',
  `level` int NULL DEFAULT 1 COMMENT '评论层级，1为一级评论，2为二级评论，以此类推',
  `status` tinyint NULL DEFAULT 0 COMMENT '状态，0-正常，1-被举报，2-被删除',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除(0-未删除, 1-已删除)',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_post_id`(`postId` ASC) USING BTREE,
  INDEX `idx_user_id`(`userId` ASC) USING BTREE,
  INDEX `idx_parent_id`(`parentId` ASC) USING BTREE,
  INDEX `idx_root_id`(`rootId` ASC) USING BTREE,
  INDEX `idx_heat`(`heat` ASC) USING BTREE,
  INDEX `idx_create_time`(`createTime` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '帖子评论表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for post_favour
-- ----------------------------
DROP TABLE IF EXISTS `post_favour`;
CREATE TABLE `post_favour`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `postId` bigint NOT NULL COMMENT '帖子 id',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_post_user`(`postId` ASC, `userId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 54 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '帖子收藏表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for post_thumb
-- ----------------------------
DROP TABLE IF EXISTS `post_thumb`;
CREATE TABLE `post_thumb`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `postId` bigint NOT NULL COMMENT '帖子 id',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_post_user`(`postId` ASC, `userId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 56 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '帖子点赞表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for question
-- ----------------------------
DROP TABLE IF EXISTS `question`;
CREATE TABLE `question`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '内容',
  `tags` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '标签列表（json 数组）',
  `difficulty` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '简单' COMMENT '难度',
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '推荐答案',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `editTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '编辑时间',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_title`(`title` ASC) USING BTREE,
  INDEX `idx_userId`(`userId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1899881909483290634 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '题目' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for question_bank
-- ----------------------------
DROP TABLE IF EXISTS `question_bank`;
CREATE TABLE `question_bank`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '标题',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '描述',
  `picture` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '图片',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `editTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '编辑时间',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_title`(`title` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1899878465305395202 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '题库' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for question_bank_question
-- ----------------------------
DROP TABLE IF EXISTS `question_bank_question`;
CREATE TABLE `question_bank_question`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `questionBankId` bigint NOT NULL COMMENT '题库 id',
  `questionId` bigint NOT NULL COMMENT '题目 id',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `questionBankId`(`questionBankId` ASC, `questionId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1899879067955576834 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '题库题目' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for question_code
-- ----------------------------
DROP TABLE IF EXISTS `question_code`;
CREATE TABLE `question_code`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `userId` bigint NOT NULL COMMENT '创建题目用户 id',
  `title` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '内容',
  `tags` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '标签列表（json 数组）',
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '题目答案',
  `judgeCase` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '判题用例（json 数组）',
  `judgeConfig` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '判题配置（json 对象）',
  `difficulty` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '简单' COMMENT '难度',
  `submitNum` int NOT NULL DEFAULT 0 COMMENT '题目提交数',
  `acceptedNum` int NOT NULL DEFAULT 0 COMMENT '题目通过数',
  `thumbNum` int NOT NULL DEFAULT 0 COMMENT '点赞数',
  `favourNum` int NOT NULL DEFAULT 0 COMMENT '收藏数',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_userId`(`userId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1734770960977956865 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '算法题' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for question_comment
-- ----------------------------
DROP TABLE IF EXISTS `question_comment`;
CREATE TABLE `question_comment`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `questionId` bigint NOT NULL COMMENT '题目 id',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评论内容',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_questionId`(`questionId` ASC) USING BTREE,
  INDEX `idx_userId`(`userId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '题目评论' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for question_favourite
-- ----------------------------
DROP TABLE IF EXISTS `question_favourite`;
CREATE TABLE `question_favourite`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `questionId` bigint NOT NULL COMMENT '题目 id',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `questionId`(`questionId` ASC, `userId` ASC) USING BTREE COMMENT '确保用户不会重复收藏'
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '题目收藏' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for question_recommend
-- ----------------------------
DROP TABLE IF EXISTS `question_recommend`;
CREATE TABLE `question_recommend`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `userId` bigint NOT NULL COMMENT '用户id',
  `questionId` bigint NOT NULL COMMENT '题目id',
  `score` float NULL DEFAULT 0 COMMENT '推荐分数',
  `reason` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '推荐原因',
  `type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '推荐类型（similar-相似题目、daily-每日推荐、level-难度递进）',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态（0-未查看、1-已查看、2-已完成）',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_question_type`(`userId` ASC, `questionId` ASC, `type` ASC) USING BTREE COMMENT '确保同类型推荐唯一',
  INDEX `idx_user`(`userId` ASC) USING BTREE,
  INDEX `idx_question`(`questionId` ASC) USING BTREE,
  INDEX `idx_type`(`type` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '题目推荐表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for question_submit
-- ----------------------------
DROP TABLE IF EXISTS `question_submit`;
CREATE TABLE `question_submit`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `questionId` bigint NOT NULL COMMENT '题目 id',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `judgeInfo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '判题信息（json 对象）',
  `submitLanguage` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '编程语言',
  `submitCode` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户提交代码',
  `submitState` int NOT NULL DEFAULT 0 COMMENT '判题状态（0 - 待判题、1 - 判题中、2 - 成功、3 - 失败）',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  `runStatus` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'submit' COMMENT '运行状态（run、submit）',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_questionId`(`questionId` ASC) USING BTREE,
  INDEX `idx_userId`(`userId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1924710406550474753 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '题目提交' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for question_thumb
-- ----------------------------
DROP TABLE IF EXISTS `question_thumb`;
CREATE TABLE `question_thumb`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `questionId` bigint NOT NULL COMMENT '题目 id',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `questionId`(`questionId` ASC, `userId` ASC) USING BTREE COMMENT '确保用户不会重复点赞'
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '题目点赞' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for question_views
-- ----------------------------
DROP TABLE IF EXISTS `question_views`;
CREATE TABLE `question_views`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `questionId` bigint NOT NULL COMMENT '题目 id',
  `viewCount` bigint NOT NULL DEFAULT 0 COMMENT '浏览量',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `userAccount` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '账号',
  `userPassword` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `unionId` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '微信开放平台id',
  `mpOpenId` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '公众号openId',
  `userName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户昵称',
  `userAvatar` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户头像',
  `userProfile` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户简介',
  `userRole` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user' COMMENT '用户角色：user/admin/ban',
  `editTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '编辑时间',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  `phoneNumber` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '手机号',
  `email` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '邮箱',
  `grade` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '年级',
  `workExperience` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '工作经验',
  `expertiseDirection` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '擅长方向',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_unionId`(`unionId` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1905495695878217730 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for user_recommend
-- ----------------------------
DROP TABLE IF EXISTS `user_recommend`;
CREATE TABLE `user_recommend`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `userId` bigint NOT NULL COMMENT '用户id',
  `recommendUserId` bigint NOT NULL COMMENT '被推荐的用户id',
  `score` float NULL DEFAULT 0 COMMENT '推荐分数',
  `reason` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '推荐原因',
  `tags` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户标签（JSON数组，记录共同兴趣、技能等）',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '推荐状态（0-已忽略、1-待处理、2-已添加好友）',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_recommend`(`userId` ASC, `recommendUserId` ASC) USING BTREE COMMENT '确保推荐关系唯一',
  INDEX `idx_user`(`userId` ASC) USING BTREE,
  INDEX `idx_recommend_user`(`recommendUserId` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户推荐表' ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;

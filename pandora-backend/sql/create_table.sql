# 数据库初始化

-- 创建库
create database if not exists pandora;

-- 切换库
use pandora;

-- 用户表
create table if not exists user
(
    id           bigint auto_increment comment 'id' primary key,
    userAccount  varchar(256)                           not null comment '账号',
    userPassword varchar(512)                           not null comment '密码',
    unionId      varchar(256)                           null comment '微信开放平台id',
    mpOpenId     varchar(256)                           null comment '公众号openId',
    userName     varchar(256)                           null comment '用户昵称',
    userAvatar   varchar(1024)                          null comment '用户头像',
    userProfile  varchar(512)                           null comment '用户简介',
    userRole     varchar(256) default 'user'            not null comment '用户角色：user/admin/ban',
    editTime     datetime     default CURRENT_TIMESTAMP not null comment '编辑时间',
    createTime   datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime   datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint      default 0                 not null comment '是否删除',
    index idx_unionId (unionId)
) comment '用户' collate = utf8mb4_unicode_ci;

-- 题库表
create table if not exists question_bank
(
    id          bigint auto_increment comment 'id' primary key,
    title       varchar(256)                       null comment '标题',
    description text                               null comment '描述',
    picture     varchar(2048)                      null comment '图片',
    userId      bigint                             not null comment '创建用户 id',
    editTime    datetime default CURRENT_TIMESTAMP not null comment '编辑时间',
    createTime  datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete    tinyint  default 0                 not null comment '是否删除',
    index idx_title (title)
) comment '题库' collate = utf8mb4_unicode_ci;

-- 题目表
create table if not exists question
(
    id         bigint auto_increment comment 'id' primary key,
    title      varchar(256)                       null comment '标题',
    content    text                               null comment '内容',
    tags       varchar(1024)                      null comment '标签列表（json 数组）',
    answer     text                               null comment '推荐答案',
    userId     bigint                             not null comment '创建用户 id',
    editTime   datetime default CURRENT_TIMESTAMP not null comment '编辑时间',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除',
    index idx_title (title),
    index idx_userId (userId)
) comment '题目' collate = utf8mb4_unicode_ci;

-- 题库题目表（硬删除）
create table if not exists question_bank_question
(
    id             bigint auto_increment comment 'id' primary key,
    questionBankId bigint                             not null comment '题库 id',
    questionId     bigint                             not null comment '题目 id',
    userId         bigint                             not null comment '创建用户 id',
    createTime     datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime     datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    UNIQUE (questionBankId, questionId)
) comment '题库题目' collate = utf8mb4_unicode_ci;

-- 功能扩展：用户个人主页资料修改
ALTER TABLE user
    ADD phoneNumber        VARCHAR(20) COMMENT '手机号',
    ADD email              VARCHAR(256) COMMENT '邮箱',
    ADD grade              VARCHAR(50) COMMENT '年级',
    ADD workExperience     VARCHAR(512) COMMENT '工作经验',
    ADD expertiseDirection VARCHAR(512) COMMENT '擅长方向';

-- 功能扩展：AI 模拟面试功能
-- 模拟面试表
create table if not exists mock_interview
(
    id             bigint auto_increment comment 'id' primary key,
    workExperience varchar(256)                       not null comment '工作年限',
    jobPosition    varchar(256)                       not null comment '工作岗位',
    difficulty     varchar(50)                        not null comment '面试难度',
    messages       mediumtext                         null comment '消息列表（JSON 对象数组字段，同时包括了总结）',
    status         int      default 0                 not null comment '状态（0-待开始、1-进行中、2-已结束）',
    userId         bigint                             not null comment '创建人（用户 id）',
    createTime     datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime     datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete       tinyint  default 0                 not null comment '是否删除（逻辑删除）',
    index idx_userId (userId)
) comment '模拟面试' collate = utf8mb4_unicode_ci;

-- 题目点赞表（硬删除）
create table if not exists question_thumb
(
    id         bigint auto_increment comment 'id' primary key,
    questionId bigint                             not null comment '题目 id',
    userId     bigint                             not null comment '创建用户 id',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    UNIQUE (questionId, userId) comment '确保用户不会重复点赞'
) comment '题目点赞' collate = utf8mb4_unicode_ci;

-- 题目评论表
create table if not exists question_comment
(
    id         bigint auto_increment comment 'id' primary key,
    questionId bigint                             not null comment '题目 id',
    userId     bigint                             not null comment '创建用户 id',
    content    text                               not null comment '评论内容',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除',
    index idx_questionId (questionId),
    index idx_userId (userId)
) comment '题目评论' collate = utf8mb4_unicode_ci;

-- 题目收藏表（硬删除）
create table if not exists question_favourite
(
    id         bigint auto_increment comment 'id' primary key,
    questionId bigint                             not null comment '题目 id',
    userId     bigint                             not null comment '创建用户 id',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    UNIQUE (questionId, userId) comment '确保用户不会重复收藏'
) comment '题目收藏' collate = utf8mb4_unicode_ci;

-- 题目浏览量表（硬删除）
CREATE TABLE question_views (
    id BIGINT AUTO_INCREMENT PRIMARY KEY comment 'id' ,
    questionId BIGINT not null comment '题目 id',
    viewCount BIGINT NOT NULL DEFAULT 0  comment '浏览量',
    createTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP not null comment '更新时间'
);

-- 算法题目表
create table if not exists question_code
(
    id          bigint auto_increment comment 'id' primary key,
    userId      bigint                             not null comment '创建题目用户 id',
    title       varchar(512)                       null comment '标题',
    content     text                               null comment '内容',
    tags        varchar(1024)                      null comment '标签列表（json 数组）',
    answer      text                               null comment '题目答案',
    judgeCase   text                               null comment '判题用例（json 数组）',
    judgeConfig text                               null comment '判题配置（json 对象）',
    submitNum   int      default 0                 not null comment '题目提交数',
    acceptedNum int      default 0                 not null comment '题目通过数',
    thumbNum    int      default 0                 not null comment '点赞数',
    favourNum   int      default 0                 not null comment '收藏数',
    createTime  datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete    tinyint  default 0                 not null comment '是否删除',
    index idx_userId (userId)
) comment '算法题' collate = utf8mb4_unicode_ci;


-- 算法题目提交表
create table if not exists question_submit
(
    id             bigint auto_increment comment 'id' primary key,
    questionId     bigint                             not null comment '题目 id',
    userId         bigint                             not null comment '创建用户 id',
    judgeInfo      text                               null comment '判题信息（json 对象）',
    submitLanguage varchar(128)                       not null comment '编程语言',
    submitCode     text                               not null comment '用户提交代码',
    submitState    int      default 0                 not null comment '判题状态（0 - 待判题、1 - 判题中、2 - 成功、3 - 失败）',
    runStatus      varchar(255) default 'submit'          null comment '运行状态（run、submit）',
    createTime     datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime     datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete       tinyint  default 0                 not null comment '是否删除',
    index idx_questionId (questionId),
    index idx_userId (userId)
) comment '算法题目提交';


-- 帖子表
create table if not exists post (
  id bigint PRIMARY KEY NOT NULL COMMENT '帖子ID',
  title varchar(100) NOT NULL COMMENT '帖子标题',
  content text COMMENT '帖子内容',
  tags varchar(1024) DEFAULT NULL COMMENT '标签列表(JSON格式)',
  thumbNum int DEFAULT '0' COMMENT '点赞数',
  favourNum int DEFAULT '0' COMMENT '收藏数',
  userId bigint NOT NULL COMMENT '创建用户ID',
  createTime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updateTime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  isDelete tinyint NOT NULL DEFAULT '0' COMMENT '是否删除(0-未删除, 1-已删除)',
  KEY idx_user_id (userId),
  KEY idx_create_time (createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='帖子表';

-- 创建帖子点赞表
create table if not exists post_thumb (
  id bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  postId bigint NOT NULL COMMENT '帖子 id',
  userId bigint NOT NULL COMMENT '创建用户 id',
  createTime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updateTime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  -- 添加联合索引提高查询效率
  INDEX idx_post_user (postId, userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='帖子点赞表';

-- 创建帖子收藏表
create table if not exists post_favour (
  id bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  postId bigint NOT NULL COMMENT '帖子 id',
  userId bigint NOT NULL COMMENT '创建用户 id',
  createTime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updateTime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (id),
  -- 添加联合索引提高查询效率
  INDEX idx_post_user (postId, userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='帖子收藏表';



-- 帖子浏览量表（硬删除）
CREATE TABLE post_views (
    id BIGINT AUTO_INCREMENT PRIMARY KEY comment 'id' ,
    postId BIGINT not null comment '帖子 id',
    viewCount BIGINT NOT NULL DEFAULT 0  comment '浏览量',
    createTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP not null comment '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='帖子浏览量表';


-- 创建评论表
CREATE TABLE IF NOT EXISTS post_comment (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '评论ID',
    postId BIGINT NOT NULL COMMENT '帖子ID',
    userId BIGINT NOT NULL COMMENT '评论用户ID',
    content TEXT NOT NULL COMMENT '评论内容',
    parentId BIGINT DEFAULT NULL COMMENT '父评论ID，如果是一级评论则为NULL',
    rootId BIGINT DEFAULT NULL COMMENT '根评论ID，如果是一级评论则为NULL',
    replyUserId BIGINT DEFAULT NULL COMMENT '回复用户ID，如果是一级评论则为NULL',
    thumbNum INT DEFAULT 0 COMMENT '点赞数',
    replyCount INT DEFAULT 0 COMMENT '回复数量',
    heat INT DEFAULT 0 COMMENT '热度值，用于排序',
    level INT DEFAULT 1 COMMENT '评论层级，1为一级评论，2为二级评论，以此类推',
    status TINYINT DEFAULT 0 COMMENT '状态，0-正常，1-被举报，2-被删除',
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updateTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    isDelete TINYINT NOT NULL DEFAULT 0 COMMENT '是否删除(0-未删除, 1-已删除)',
    PRIMARY KEY (id),
    KEY idx_post_id (postId),
    KEY idx_user_id (userId),
    KEY idx_parent_id (parentId),
    KEY idx_root_id (rootId),
    KEY idx_heat (heat),
    KEY idx_create_time (createTime)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='帖子评论表';

-- 创建评论点赞表
CREATE TABLE IF NOT EXISTS comment_thumb (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'ID',
    commentId BIGINT NOT NULL COMMENT '评论ID',
    userId BIGINT NOT NULL COMMENT '用户ID',
    createTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updateTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_comment_user (commentId, userId),
    KEY idx_user_id (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论点赞表';
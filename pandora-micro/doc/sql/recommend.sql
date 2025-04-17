

-- 用户推荐表（记录用户之间的推荐关系）
create table if not exists user_recommend (
    id bigint auto_increment comment 'id' primary key,
    userId bigint not null comment '用户id',
    recommendUserId bigint not null comment '被推荐的用户id',
    score float default 0 comment '推荐分数',
    reason varchar(512) comment '推荐原因',
    tags varchar(1024) comment '用户标签（JSON数组，记录共同兴趣、技能等）',
    status tinyint default 1 not null comment '推荐状态（0-已忽略、1-待处理、2-已添加好友）',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete tinyint default 0 not null comment '是否删除',
    index idx_user (userId),
    index idx_recommend_user (recommendUserId),
    unique key uk_user_recommend (userId, recommendUserId) comment '确保推荐关系唯一'
) comment '用户推荐表' collate = utf8mb4_unicode_ci;

-- 题目推荐表（记录给用户的题目推荐）
create table if not exists question_recommend (
    id bigint auto_increment comment 'id' primary key,
    userId bigint not null comment '用户id',
    questionId bigint not null comment '题目id',
    score float default 0 comment '推荐分数',
    reason varchar(512) comment '推荐原因',
    type varchar(32) not null comment '推荐类型（similar-相似题目、daily-每日推荐、level-难度递进）',
    status tinyint default 0 not null comment '状态（0-未查看、1-已查看、2-已完成）',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete tinyint default 0 not null comment '是否删除',
    index idx_user (userId),
    index idx_question (questionId),
    index idx_type (type),
    unique key uk_user_question_type (userId, questionId, type) comment '确保同类型推荐唯一'
) comment '题目推荐表' collate = utf8mb4_unicode_ci;
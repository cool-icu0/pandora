
[toc]

## 模板特点

### 主流框架 & 特性

- Spring Boot 2.7.x（贼新）
- Spring MVC
- MyBatis + MyBatis Plus 数据访问（开启分页）
- Spring Boot 调试工具和项目处理器
- Spring AOP 切面编程
- Spring Scheduler 定时任务
- Spring 事务注解

### 数据存储

- MySQL 数据库
- Redis 内存数据库
- Elasticsearch 搜索引擎
- 腾讯云 COS 对象存储

### 工具类

- Easy Excel 表格处理
- Hutool 工具库
- Apache Commons Lang3 工具类
- Lombok 注解

### 业务特性

- 业务代码生成器（支持自动生成 Service、Controller、数据模型代码）
- Spring Session Redis 分布式登录
- 全局请求响应拦截器（记录日志）
- 全局异常处理器
- 自定义错误码
- 封装通用响应类
- Swagger + Knife4j 接口文档
- 自定义权限注解 + 全局校验
- 全局跨域处理
- 长整数丢失精度解决
- 多环境配置


## 业务功能

- 提供示例 SQL（用户、帖子、帖子点赞、帖子收藏表）
- 用户登录、注册、注销、更新、检索、权限管理
- 帖子创建、删除、编辑、更新、数据库检索、ES 灵活检索
- 帖子点赞、取消点赞
- 帖子收藏、取消收藏、检索已收藏帖子
- 帖子全量同步 ES、增量同步 ES 定时任务
- 支持微信开放平台登录
- 支持微信公众号订阅、收发消息、设置菜单
- 支持分业务的文件上传

### 单元测试

- JUnit5 单元测试
- 示例单元测试类

### 架构设计

- 合理分层


## 快速上手

> 所有需要修改的地方都标记了 `todo`，便于大家找到修改的位置~

### MySQL 数据库

1）修改 `application.yml` 的数据库配置为你自己的：

```yml
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/pandora
    username: root
    password: root
```

2）执行 `sql/create_table.sql` 中的数据库语句，自动创建库表

3）启动项目，访问 `http://localhost:8101/api/doc.html` 即可打开接口文档，不需要写前端就能在线调试接口了~


### Redis 分布式登录

1）修改 `application.yml` 的 Redis 配置为你自己的：

```yml
spring:
  redis:
    database: 1
    host: localhost
    port: 6379
    timeout: 5000
#    password: 123456
```

2）修改 `application.yml` 中的 session 存储方式：

```yml
spring:
  session:
    store-type: redis
```

3）移除 `MainApplication` 类开头 `@SpringBootApplication` 注解内的 exclude 参数：

修改前：

```java
@SpringBootApplication(exclude = {RedisAutoConfiguration.class})
```

修改后：


```java
@SpringBootApplication
```

### Elasticsearch 搜索引擎

1）修改 `application.yml` 的 Elasticsearch 配置为你自己的：

```yml
spring:
  elasticsearch:
    uris: http://localhost:9200
#    username: root
#    password: 123456
```

2）复制 `sql/post_es_mapping.json` 文件中的内容，通过调用 Elasticsearch 的接口或者 Kibana Dev Tools 来创建索引（相当于数据库建表）

```
PUT post_v1
{
 参数见 sql/post_es_mapping.json 文件
}
```

这步不会操作的话需要补充下 Elasticsearch 的知识，或者自行百度一下~

3）开启同步任务，将数据库的帖子同步到 Elasticsearch

找到 job 目录下的 `FullSyncPostToEs` 和 `IncSyncPostToEs` 文件，取消掉 `@Component` 注解的注释，再次执行程序即可触发同步：

```java
// todo 取消注释开启任务
//@Component
```

### 业务代码生成器

支持自动生成 Service、Controller、数据模型代码，配合 MyBatisX 插件，可以快速开发增删改查等实用基础功能。

找到 `generate.CodeGenerator` 类，修改生成参数和生成路径，并且支持注释掉不需要的生成逻辑，然后运行即可。

```
// 指定生成参数
String packageName = "com.cool.pandora";
String dataName = "用户评论";
String dataKey = "userComment";
String upperDataKey = "UserComment";
```

生成代码后，可以移动到实际项目中，并且按照 `// todo` 注释的提示来针对自己的业务需求进行修改。

## 项目功能点

### 1. 用户模块
- 登录注册
- 用户信息管理
- 微信开放平台登录
- 微信公众号功能
### 2. 题库管理
接口前缀: /questionBank

- 创建题库: POST /questionBank/add
- 删除题库: POST /questionBank/delete
- 更新题库: POST /questionBank/update
- 获取题库详情: GET /questionBank/get/vo
- 分页获取题库列表: POST /questionBank/list/page
### 3. 题目管理
接口前缀: /question

- 创建题目: POST /question/add
- 删除题目: POST /question/delete
- 更新题目: POST /question/update
- 获取题目详情: GET /question/get/vo
- 分页获取题目列表: POST /question/list/page
### 4. 题目互动功能
1. 点赞功能
   接口前缀: /question_thumb
- 点赞/取消点赞: POST /question_thumb/
2. 评论功能
   接口前缀: /question_comment
- 发表评论: POST /question_comment/add
- 删除评论: POST /question_comment/delete
- 修改评论: POST /question_comment/update
- 获取评论详情: GET /question_comment/get
- 分页获取评论列表: POST /question_comment/list/page
3. 收藏功能
   接口前缀: /question_favourite
- 收藏/取消收藏: POST /question_favourite/
- 获取用户收藏的题目列表 : GET /question_favourite/my/list
### 5. 题库-题目关联管理
接口前缀: /questionBankQuestion

- 创建关联: POST /questionBankQuestion/add
- 删除关联: POST /questionBankQuestion/delete
- 更新关联: POST /questionBankQuestion/update
- 获取关联详情: GET /questionBankQuestion/get/vo
- 分页获取关联列表: POST /questionBankQuestion/list/page
- 分页获取关联列表(封装类): POST /questionBankQuestion/list/page/vo
### 6. AI 模拟面试功能
接口前缀: /mock_interview

- 创建模拟面试
- 更新面试状态
- 获取面试详情
- 获取面试列表
### 7、文件上传
- 文件上传: POST /file/upload
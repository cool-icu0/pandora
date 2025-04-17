-- 初始数据
use pandora;

-- 用户表初始数据（密码是 12345678）
INSERT INTO user (id, userAccount, userPassword, unionId, mpOpenId, userName, userAvatar, userProfile, userRole)
VALUES (1, 'user1', 'b0dd3697a192885d7c055db46155b26a', 'unionId1', 'mpOpenId1', 'user1',
        'https://avatar.moonshot.cn/avatar/co3qcgo3r072r8fqv7dg', '喜欢编程的小白', 'user'),
       (2, 'user2', 'b0dd3697a192885d7c055db46155b26a', 'unionId2', 'mpOpenId2', 'user2',
        'https://avatar.moonshot.cn/avatar/co3qcgo3r072r8fqv7dg', '全栈开发工程师', 'user'),
       (3, 'user3', 'b0dd3697a192885d7c055db46155b26a', 'unionId3', 'mpOpenId3', 'user3',
        'https://avatar.moonshot.cn/avatar/co3qcgo3r072r8fqv7dg', '前端爱好者', 'user'),
       (4, 'user4', 'b0dd3697a192885d7c055db46155b26a', 'unionId4', 'mpOpenId4', 'user4',
        'https://avatar.moonshot.cn/avatar/co3qcgo3r072r8fqv7dg', '后端开发工程师', 'user'),
       (5, 'admin', 'b0dd3697a192885d7c055db46155b26a', NULL, NULL, '程超级管理员', 'https://avatar.moonshot.cn/avatar/co3qcgo3r072r8fqv7dg',
        '系统管理员', 'admin');

-- 题库表初始数据
INSERT INTO question_bank (title, description, picture, userId)
VALUES ('JavaScript 基础', '包含 JavaScript 的基础知识题目',
        'https://pic.code-nav.cn/mianshiya/question_bank_picture/1777886594896760834/JldkWf9w_JavaScript.png', 1),
       ('CSS 样式', '包含 CSS 相关的样式问题',
        'https://pic.code-nav.cn/mianshiya/question_bank_picture/1777886594896760834/QatnFmEN_CSS.png', 2),
       ('HTML 基础', 'HTML 标记语言的基本知识', 'https://www.mianshiya.com/logo.png', 3),
       ('前端框架', 'React, Vue, Angular 等框架相关的题目', 'https://www.mianshiya.com/logo.png', 1),
       ('算法与数据结构', '数据结构和算法题目', 'https://www.mianshiya.com/logo.png', 2),
       ('数据库原理', 'SQL 语句和数据库设计', 'https://www.mianshiya.com/logo.png', 3),
       ('操作系统', '操作系统的基本概念', 'https://www.mianshiya.com/logo.png', 1),
       ('网络协议', 'HTTP, TCP/IP 等网络协议题目', 'https://www.mianshiya.com/logo.png', 2),
       ('设计模式', '常见设计模式及其应用', 'https://www.mianshiya.com/logo.png', 3),
       ('编程语言概述', '多种编程语言的基础知识', 'https://www.mianshiya.com/logo.png', 1),
       ('版本控制', 'Git 和 SVN 的使用', 'https://www.mianshiya.com/logo.png', 2),
       ('安全与加密', '网络安全和加密技术', 'https://www.mianshiya.com/logo.png', 3),
       ('云计算', '云服务和架构', 'https://www.mianshiya.com/logo.png', 1),
       ('微服务架构', '微服务的设计与实现', 'https://www.mianshiya.com/logo.png', 2),
       ('容器技术', 'Docker 和 Kubernetes 相关知识', 'https://www.mianshiya.com/logo.png', 3),
       ('DevOps 实践', '持续集成与持续交付', 'https://www.mianshiya.com/logo.png', 1),
       ('数据分析', '数据分析和可视化', 'https://www.mianshiya.com/logo.png', 2),
       ('人工智能', '机器学习与深度学习基础', 'https://www.mianshiya.com/logo.png', 3),
       ('区块链技术', '区块链的基本原理和应用', 'https://www.mianshiya.com/logo.png', 1),
       ('项目管理', '软件开发项目的管理和执行', 'https://www.mianshiya.com/logo.png', 2);

-- 题目表初始数据
INSERT INTO question (title, content, tags, answer, userId)
VALUES ('JavaScript 变量提升', '请解释 JavaScript 中的变量提升现象。', '["JavaScript", "基础"]',
        '变量提升是指在 JavaScript 中，变量声明会被提升到作用域的顶部。', 1),
       ('CSS Flexbox 布局', '如何使用 CSS 实现一个水平居中的盒子？', '["CSS", "布局"]',
        '可以使用 Flexbox 布局，通过设置父容器 display 为 flex，并使用 justify-content: center; 对齐子元素。', 2),
       ('HTML 中的语义化', '什么是 HTML 的语义化？为什么重要？', '["HTML", "语义化"]',
        'HTML 语义化是使用正确的标签来描述内容的意义，能够提高可访问性和 SEO 效果。', 3),
       ('React 中的状态管理', '如何在 React 中管理组件状态？', '["React", "状态管理"]',
        '可以使用 React 的 useState 或 useReducer 钩子来管理组件状态，或使用 Redux 进行全局状态管理。', 1),
       ('算法：二分查找', '请实现一个二分查找算法。', '["算法", "数据结构"]',
        '二分查找是一种在有序数组中查找特定元素的算法，通过不断折半的方式缩小查找范围。', 2),
       ('数据库索引的作用', '什么是数据库索引？它的作用是什么？', '["数据库", "索引"]',
        '数据库索引是用于加快查询速度的数据结构，它通过优化查找路径减少查询时间。', 3),
       ('HTTP 与 HTTPS 的区别', '请解释 HTTP 和 HTTPS 之间的主要区别。', '["网络", "协议"]',
        'HTTPS 是加密的 HTTP，通过 SSL/TLS 提供更安全的数据传输。', 1),
       ('设计模式：单例模式', '请解释单例模式的实现及应用场景。', '["设计模式", "单例"]',
        '单例模式确保一个类只有一个实例，并提供全局访问点。常用于配置类等只需一个实例的场景。', 2),
       ('Git 中的分支管理', '如何在 Git 中管理分支？', '["版本控制", "Git"]',
        'Git 中通过 branch 命令创建分支，使用 checkout 切换分支，使用 merge 合并分支。', 3),
       ('Docker 的基本命令', '列举并解释几个常用的 Docker 命令。', '["容器技术", "Docker"]',
        '常用命令包括 docker run, docker build, docker ps, docker stop 等。', 1),
       ('前端性能优化', '列举几个前端性能优化的手段。', '["前端", "性能优化"]',
        '包括代码分割、资源压缩、缓存策略、懒加载等。', 2),
       ('JavaScript 闭包的应用', '什么是闭包？举例说明闭包的实际应用。', '["JavaScript", "高级"]',
        '闭包是指函数能够记住创建时的上下文环境，常用于数据隐藏和模块化编程。', 3),
       ('数据库事务的特性', '请解释数据库事务的 ACID 特性。', '["数据库", "事务"]',
        'ACID 代表原子性、一致性、隔离性和持久性，是事务处理的四大特性。', 1),
       ('CSS 的 BEM 命名规范', '什么是 BEM？如何使用 BEM 进行 CSS 命名？', '["CSS", "命名规范"]',
        'BEM 代表块（Block）、元素（Element）和修饰符（Modifier），是一种 CSS 命名规范。', 2),
       ('JavaScript 原型链', '请解释 JavaScript 中的原型链机制。', '["JavaScript", "原型链"]',
        '原型链是 JavaScript 实现继承的机制，对象通过原型链可以继承其他对象的属性和方法。', 3),
       ('React 生命周期', '请说明 React 组件的生命周期方法。', '["React", "生命周期"]',
        'React 组件的生命周期包括初始化、更新和卸载三个阶段，各阶段有不同的生命周期方法。', 1),
       ('HTTP 状态码 404 与 500 的区别', '请解释 HTTP 状态码 404 和 500 的含义。', '["网络", "HTTP"]',
        '404 表示未找到资源，500 表示服务器内部错误。', 2),
       ('Python 与 Java 的区别', '比较 Python 和 Java 的主要区别。', '["编程语言", "Python", "Java"]',
        'Python 是动态类型语言，语法简洁，而 Java 是静态类型语言，注重严谨性和性能。', 3),
       ('Vue 的双向数据绑定', '请解释 Vue.js 是如何实现双向数据绑定的。', '["Vue", "数据绑定"]',
        'Vue.js 通过数据劫持和发布-订阅模式实现了双向数据绑定。', 1),
       ('前端工程化的意义', '为什么需要前端工程化？', '["前端", "工程化"]',
        '前端工程化能够提高开发效率、代码质量和可维护性，规范开发流程。', 2);

-- 题库题目关联初始数据
INSERT INTO question_bank_question (questionBankId, questionId, userId)
VALUES (1, 1, 1),
       (1, 2, 1),
       (1, 3, 1),
       (1, 4, 1),
       (1, 5, 1),
       (1, 6, 1),
       (1, 7, 1),
       (1, 8, 1),
       (1, 9, 1),
       (1, 10, 1),
       (2, 2, 2),
       (2, 14, 2),
       (3, 3, 3),
       (3, 13, 3),
       (4, 4, 1),
       (4, 16, 1),
       (5, 5, 2),
       (5, 18, 2),
       (6, 6, 3),
       (6, 19, 3),
       (7, 7, 1),
       (7, 11, 1),
       (8, 8, 2),
       (8, 10, 2),
       (9, 9, 3),
       (9, 17, 3),
       (10, 12, 1),
       (10, 20, 1);

-- 算法题目表初始数据
INSERT INTO `question_code` VALUES ('1734735574025236481', '1731620803078791170', '模拟栈', '实现一个栈，栈初始为空，支持四种操作：\n\npush x – 向栈顶插入一个数 x\n；\n\npop – 从栈顶弹出一个数；\n\nempty – 判断栈是否为空；\n\nquery – 查询栈顶元素。\n\n现在要对栈进行 M\n 个操作，其中的每个操作 3\n 和操作 4\n 都要输出相应的结果。', '[\"栈\",\"中等\",\"算法\"]', '```java\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt();\n\n        Stack<Integer> stk = new Stack<>();\n\n        while (m -- > 0) {\n            String op = sc.next();\n            if (\"push\".equals(op)) {\n                int x = sc.nextInt();\n                stk.push(x);\n            } else if (\"pop\".equals(op)) {\n                stk.pop();\n            } else if (\"empty\".equals(op)) {\n                if (stk.empty())\n                    System.out.println(\"YES\");\n                else\n                    System.out.println(\"NO\");\n            } else {\n                System.out.println(stk.peek());\n            }\n        }\n    }\n}\n```', '[{\"input\":\"10 push 5 query push 6 pop query pop empty push 4 query empty\",\"output\":\"5 5 YES 4 NO\"}]', '{\"timeLimit\":1000,\"memoryLimit\":1000,\"stackLimit\":1000}', '0', '0', '0', '0', '2023-12-13 08:42:45', '2023-12-13 08:42:45', '0');
INSERT INTO `question_code` VALUES ('1734736264302817281', '1731620803078791170', '斐波那契数列', '输入整数 N\n，求出斐波那契数列中的第 N\n 项是多少。\n\n斐波那契数列的第 0\n 项是 0\n，第 1\n 项是 1\n，从第 2\n 项开始的每一项都等于前两项之和。\n\n输入格式\n第一行包含整数 T\n，表示共有 T\n 个测试数据。\n\n接下来 T\n 行，每行包含一个整数 N\n。\n\n输出格式\n每个测试数据输出一个结果，每个结果占一行，\n\n结果格式为 Fib(N) = x，其中 N\n 为项数，x\n 为第 N\n 项的值。\n\n数据范围\n0≤N≤60', '[\"数组\",\"简单\",\"算法\",\"贪心\"]', '```java\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long[] f = new long[61];\n        f[0] = 0;\n        f[1] = 1;\n        for (int i = 2; i <= 60; i ++ )\n            f[i] = f[i - 1] + f[i - 2];\n\n        int T = sc.nextInt();\n        while (T -- > 0) {\n            int n = sc.nextInt();\n            System.out.printf(\"Fib(%d) = %d\\n\", n, f[n]);\n        }\n    }\n}\n```', '[{\"input\":\"3 0 4 2\",\"output\":\"Fib(0) \\u003d 0 Fib(4) \\u003d 3 Fib(2) \\u003d 1\"}]', '{\"timeLimit\":1002,\"memoryLimit\":1000,\"stackLimit\":1000}', '0', '0', '0', '0', '2023-12-13 08:45:29', '2023-12-13 08:45:29', '0');
INSERT INTO `question_code` VALUES ('1734736737516777473', '1731620803078791170', 'A+B', '输入两个整数，求这两个整数的和是多少。\n\n输入格式\n输入两个整数A,B\n，用空格隔开\n\n输出格式\n输出一个整数，表示这两个数的和\n\n数据范围\n0≤A,B≤108', '[\"简单\",\"模拟\"]', '```java\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt(), y = sc.nextInt();\n        System.out.println(x + y);\n    }\n}\n```', '[{\"input\":\"3 4\",\"output\":\"7\"}]', '{\"timeLimit\":1000,\"memoryLimit\":1000,\"stackLimit\":1000}', '6', '5', '0', '0', '2023-12-13 08:47:22', '2023-12-13 08:47:22', '0');
INSERT INTO `question_code` VALUES ('1734737227533119489', '1731620803078791170', '差', '读取四个整数 A,B,C,D\n，并计算 (A×B−C×D)\n 的值。\n\n输入格式\n输入共四行，第一行包含整数 A\n，第二行包含整数 B\n，第三行包含整数 C\n，第四行包含整数 D\n。\n\n输出格式\n输出格式为 DIFERENCA = X，其中 X\n 为 (A×B−C×D)\n 的结果。\n\n数据范围\n−10000≤A,B,C,D≤10000', '[\"顺序结构\",\"简单\"]', '```java\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt();\n        int c = sc.nextInt(), d = sc.nextInt();\n        System.out.printf(\"DIFERENCA = %d\\n\", a * b - c * d);\n    }\n}\n```', '[{\"input\":\"5 6 7 8\",\"output\":\"DIFERENCA \\u003d -26\"}]', '{\"timeLimit\":1000,\"memoryLimit\":1000,\"stackLimit\":1000}', '0', '0', '0', '0', '2023-12-13 08:49:19', '2023-12-13 08:52:06', '0');
INSERT INTO `question_code` VALUES ('1734737675463815170', '1731620803078791170', '圆的面积', '计算圆的面积的公式定义为 A=πR2\n。\n\n请利用这个公式计算所给圆的面积。\n\nπ\n 的取值为 3.14159\n。\n\n输入格式\n输入包含一个浮点数，为圆的半径 R\n。\n\n输出格式\n输出格式为 A=X，其中 X\n 为圆的面积，用浮点数表示，保留四位小数。\n\n数据范围\n0<R<10000.00', '[\"简单\",\"顺序结构\"]', '```java\nimport java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        double r = sc.nextDouble();\n\n        System.out.printf(\"A=%.4f\\n\", r * r * 3.14159);\n    }\n}\n```', '[{\"input\":\"2.00\",\"output\":\"A\\u003d12.5664\"}]', '{\"timeLimit\":1000,\"memoryLimit\":1000,\"stackLimit\":1000}', '0', '0', '0', '0', '2023-12-13 08:51:06', '2023-12-13 08:51:06', '0');
INSERT INTO `question_code` VALUES ('1734760170141118466', '1731620803078791170', '用户分组', '有 n 个人被分成数量未知的组。每个人都被标记为一个从 0 到 n - 1 的唯一ID 。\n\n给定一个整数数组 groupSizes ，其中 groupSizes[i] 是第 i 个人所在的组的大小。例如，如果 groupSizes[1] = 3 ，则第 1 个人必须位于大小为 3 的组中。\n\n返回一个组列表，使每个人 i 都在一个大小为 groupSizes[i] 的组中。\n\n每个人应该 恰好只 出现在 一个组 中，并且每个人必须在一个组中。如果有多个答案，返回其中 任何 一个。可以 保证 给定输入 至少有一个 有效的解。\n示例 ：\n\n输入：groupSizes = [3,3,3,3,3,1,3]\n输出：[[5],[0,1,2],[3,4,6]]\n解释：\n第一组是 [5]，大小为 1，groupSizes[5] = 1。\n第二组是 [0,1,2]，大小为 3，groupSizes[0] = groupSizes[1] = groupSizes[2] = 3。\n第三组是 [3,4,6]，大小为 3，groupSizes[3] = groupSizes[4] = groupSizes[6] = 3。 \n其他可能的解决方案有 [[2,1,6],[5],[0,4,3]] 和 [[5],[0,6,2],[4,3,1]]。\n\n ', '[\"数组\",\"哈希表\",\"中等\"]', '\n```java\nclass Solution {\n    public List<List<Integer>> groupThePeople(int[] groupSizes) {\n        Map<Integer, List<Integer>> hash = new HashMap<>();\n        List<List<Integer>> res = new ArrayList<>();\n        for (int i = 0; i < groupSizes.length; i ++ ) {\n            int x = groupSizes[i];\n            if (hash.get(x) == null) hash.put(x, new ArrayList<>());\n            hash.get(x).add(i);\n            if (hash.get(x).size() == x) {\n                res.add(hash.get(x));\n                hash.put(x, null);\n            }\n        }\n        return res;\n    }\n}\n```', '[{\"input\":\"groupSizes \\u003d [2,1,3,3,3,2]\",\"output\":\"[[1],[0,5],[2,3,4]]\"}]', '{\"timeLimit\":1000,\"memoryLimit\":1000,\"stackLimit\":1000}', '0', '0', '0', '0', '2023-12-13 10:20:29', '2023-12-13 10:20:29', '0');
INSERT INTO `question_code` VALUES ('1734760786108215297', '1731620803078791170', '最大公约数', '输入两个整数 a\n 和 b\n，请你编写一个函数，int gcd(int a, int b), 计算并输出 a\n 和 b\n 的最大公约数。\n\n输入格式\n共一行，包含两个整数 a\n 和 b\n。\n\n输出格式\n共一行，包含一个整数，表示 a\n 和 b\n 的最大公约数。\n\n数据范围\n1≤a,b≤1000', '[\"基础\",\"简单\",\"函数\"]', '\n```java\nimport java.util.Scanner;\n\npublic class Main {\n    private static int gcd(int a, int b) {\n        for (int i = 1000; i > 0; i -- )\n            if (a % i == 0 && b % i == 0)\n                return i;\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt(), b = sc.nextInt();\n        System.out.println(gcd(a, b));\n    }\n}\n```', '[{\"input\":\"12 16\",\"output\":\"4\"}]', '{\"timeLimit\":1000,\"memoryLimit\":1000,\"stackLimit\":1000}', '0', '0', '0', '0', '2023-12-13 10:22:56', '2023-12-13 10:22:56', '0');
INSERT INTO `question_code` VALUES ('1734761295196057601', '1731620803078791170', '两个数的和', '输入两个浮点数 x\n 和 y\n，请你编写一个函数，double add(double x, double y)，计算并输出 x\n 与 y\n 的和。\n\n输入格式\n共一行，包含两个浮点数 x\n 和 y\n。\n\n输出格式\n共一行，包含一个浮点数，表示两个数的和，结果保留 2\n 位小数。\n\n数据范围\n−1000≤x,y≤1000', '[\"简单\",\"函数\"]', '\n```java\nimport java.util.Scanner;\n\npublic class Main {\n    private static double add(double x, double y) {\n        return x + y;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.printf(\"%.2f\\n\", add(sc.nextDouble(), sc.nextDouble()));\n    }\n}\n```', '[{\"input\":\"1.11 2.22\",\"output\":\"3.33\"}]', '{\"timeLimit\":1000,\"memoryLimit\":1000,\"stackLimit\":1000}', '0', '0', '0', '0', '2023-12-13 10:24:57', '2023-12-13 10:24:57', '0');
INSERT INTO `question_code` VALUES ('1734761637199605761', '1731620803078791170', '最小公倍数', '输入两个整数 a\n 和 b\n，请你编写一个函数，int lcm(int a, int b)，计算并输出 a\n 和 b\n 的最小公倍数。\n\n输入格式\n共一行，包含两个整数 a\n 和 b\n。\n\n输出格式\n共一行，包含一个整数，表示 a\n 和 b\n 的最小公倍数。\n\n数据范围\n1≤a,b≤1000', '[\"简单\",\"基础\",\"函数\"]', '\n```\nimport java.util.Scanner;\n\npublic class Main {\n    private static int lcm(int a, int b) {\n        for (int i = 1; i <= a * b; i ++ )\n            if (i % a == 0 && i % b == 0)\n                return i;\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        System.out.println(lcm(sc.nextInt(), sc.nextInt()));\n    }\n}\n```', '[{\"input\":\"6 8\",\"output\":\"24\"}]', '{\"timeLimit\":1000,\"memoryLimit\":1000,\"stackLimit\":1000}', '0', '0', '0', '0', '2023-12-13 10:26:19', '2023-12-13 10:26:19', '0');
INSERT INTO `question_code` VALUES ('1734762018646388738', '1731620803078791170', '数组翻转', '给定一个长度为 n\n 的数组 a\n 和一个整数 size\n，请你编写一个函数，void reverse(int a[], int size)，实现将数组 a\n 中的前 size\n 个数翻转。\n\n输出翻转后的数组 a\n。\n\n输入格式\n第一行包含两个整数 n\n 和 size\n。\n\n第二行包含 n\n 个整数，表示数组 a\n。\n\n输出格式\n共一行，包含 n\n 个整数，表示翻转后的数组 a\n。\n\n数据范围\n1≤size≤n≤1000\n,\n1≤a[i]≤1000', '[\"简单\",\"数组\",\"函数\"]', '```\nimport java.util.Scanner;\n\npublic class Main {\n    private static void reverse(int[] a, int size) {\n        for (int i = 0, j = size - 1; i < j; i ++, j -- ) {\n            int t = a[i];\n            a[i] = a[j];\n            a[j] = t;\n        }\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt(), size = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i ++ )\n            a[i] = sc.nextInt();\n\n        reverse(a, size);\n        for (int i = 0; i < n; i ++ )\n            System.out.printf(\"%d \", a[i]);\n    }\n}\n```', '[{\"input\":\"5 3 1 2 3 4 5\",\"output\":\"3 2 1 4 5\"}]', '{\"timeLimit\":1000,\"memoryLimit\":1000,\"stackLimit\":1000}', '0', '0', '0', '0', '2023-12-13 10:27:50', '2023-12-13 10:27:50', '0');
INSERT INTO `question_code` VALUES ('1734770960977956865', '1731620803078791170', '模拟队列', '实现一个队列，队列初始为空，支持四种操作：\n\npush x – 向队尾插入一个数 x\n；\npop – 从队头弹出一个数；\nempty – 判断队列是否为空；\nquery – 查询队头元素。\n现在要对队列进行 M\n 个操作，其中的每个操作 3\n 和操作 4\n 都要输出相应的结果。\n\n输入格式\n第一行包含整数 M\n，表示操作次数。\n\n接下来 M\n 行，每行包含一个操作命令，操作命令为 push x，pop，empty，query 中的一种。\n\n输出格式\n对于每个 empty 和 query 操作都要输出一个查询结果，每个结果占一行。\n\n其中，empty 操作的查询结果为 YES 或 NO，query 操作的查询结果为一个整数，表示队头元素的值。\n\n数据范围\n1≤M≤100000\n,\n1≤x≤109\n,\n所有操作保证合法。', '[\"中等\",\"队列\"]', '```\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int m = sc.nextInt();\n\n        Queue<Integer> q = new LinkedList<>();\n        while (m -- > 0) {\n            String op = sc.next();\n            if (op.equals(\"push\")) {\n                int x = sc.nextInt();\n                q.add(x);\n            } else if (op.equals(\"pop\")) {\n                q.remove();\n            } else if (op.equals(\"empty\")) {\n                if (q.isEmpty()) {\n                    System.out.println(\"YES\");\n                } else {\n                    System.out.println(\"NO\");\n                }\n            } else {\n                System.out.println(q.peek());\n            }\n        }\n    }\n}\n```', '[{\"input\":\"10 push 6 empty query pop empty push 3 push 4 pop query push 6\",\"output\":\"NO 6 YES 4\"}]', '{\"timeLimit\":1000,\"memoryLimit\":1000,\"stackLimit\":1000}', '0', '0', '0', '0', '2023-12-13 11:03:22', '2023-12-13 11:03:22', '0');


-- 插入模拟帖子数据
INSERT INTO post (id, title, content, tags, thumbNum, favourNum, userId, createTime) VALUES
(1, '初学Java有什么好的学习路径？', '最近开始学习Java编程，想知道有什么推荐的学习路径和资源？谢谢大家！', '[\"Java\", \"编程学习\", \"新手\"]', 13, 5, 1001, NOW() - INTERVAL 30 DAY),
(2, 'Spring Boot项目实战分享', '分享一个我最近做的Spring Boot项目，包含完整的CRUD功能和权限管理系统...', '[\"Spring Boot\", \"项目实战\", \"后端\"]', 42, 18, 1002, NOW() - INTERVAL 25 DAY),
(3, '前端框架对比：React vs Vue', '本文将对比当前最流行的两个前端框架React和Vue的优缺点及适用场景...', '[\"前端\", \"React\", \"Vue\"]', 56, 30, 1003, NOW() - INTERVAL 20 DAY),
(4, 'MySQL性能优化技巧总结', '经过多年的MySQL使用经验，我总结了一些实用的性能优化技巧，包括索引设计、查询优化等...', '[\"MySQL\", \"数据库\", \"性能优化\"]', 78, 45, 1004, NOW() - INTERVAL 15 DAY),
(5, '微服务架构设计实践', '本文分享我们团队在微服务架构设计和实施过程中的经验和教训...', '[\"微服务\", \"架构设计\", \"分布式系统\"]', 65, 37, 1002, NOW() - INTERVAL 10 DAY),
(6, 'Docker入门到精通', 'Docker容器化技术已经成为现代开发不可或缺的一部分，本文将带你从入门到精通...', '[\"Docker\", \"容器化\", \"DevOps\"]', 49, 28, 1005, NOW() - INTERVAL 8 DAY),
(7, '算法学习笔记：动态规划', '动态规划是解决复杂问题的强大工具，本文记录了我学习和应用动态规划的心得...', '[\"算法\", \"动态规划\", \"编程技巧\"]', 37, 22, 1006, NOW() - INTERVAL 5 DAY),
(8, 'Python数据分析实战', '使用Python进行数据分析的完整实战案例，包括数据清洗、可视化和建模...', '[\"Python\", \"数据分析\", \"机器学习\"]', 51, 33, 1007, NOW() - INTERVAL 3 DAY);

-- 插入模拟点赞数据
INSERT INTO post_thumb (postId, userId, createTime) VALUES
(1, 1002, NOW() - INTERVAL 29 DAY),
(1, 1003, NOW() - INTERVAL 28 DAY),
(1, 1004, NOW() - INTERVAL 27 DAY),
(1, 1005, NOW() - INTERVAL 26 DAY),
(1, 1006, NOW() - INTERVAL 25 DAY),
(1, 1007, NOW() - INTERVAL 24 DAY),
(1, 1008, NOW() - INTERVAL 23 DAY),
(1, 1009, NOW() - INTERVAL 22 DAY),
(1, 1010, NOW() - INTERVAL 21 DAY),
(1, 1011, NOW() - INTERVAL 20 DAY),
(1, 1012, NOW() - INTERVAL 19 DAY),
(1, 1013, NOW() - INTERVAL 18 DAY),
(1, 1014, NOW() - INTERVAL 17 DAY),
(2, 1001, NOW() - INTERVAL 24 DAY),
(2, 1003, NOW() - INTERVAL 23 DAY),
(2, 1004, NOW() - INTERVAL 22 DAY),
(2, 1005, NOW() - INTERVAL 21 DAY),
(2, 1006, NOW() - INTERVAL 20 DAY),
(3, 1001, NOW() - INTERVAL 19 DAY),
(3, 1002, NOW() - INTERVAL 18 DAY),
(3, 1004, NOW() - INTERVAL 17 DAY),
(4, 1001, NOW() - INTERVAL 14 DAY),
(4, 1002, NOW() - INTERVAL 13 DAY),
(4, 1003, NOW() - INTERVAL 12 DAY),
(5, 1001, NOW() - INTERVAL 9 DAY),
(5, 1003, NOW() - INTERVAL 8 DAY),
(6, 1001, NOW() - INTERVAL 7 DAY),
(6, 1002, NOW() - INTERVAL 6 DAY),
(7, 1001, NOW() - INTERVAL 4 DAY),
(7, 1002, NOW() - INTERVAL 3 DAY),
(8, 1001, NOW() - INTERVAL 2 DAY),
(8, 1002, NOW() - INTERVAL 1 DAY);

-- 插入模拟收藏数据
INSERT INTO post_favour (postId, userId, createTime) VALUES
(1, 1002, NOW() - INTERVAL 28 DAY),
(1, 1003, NOW() - INTERVAL 27 DAY),
(1, 1004, NOW() - INTERVAL 26 DAY),
(1, 1005, NOW() - INTERVAL 25 DAY),
(1, 1006, NOW() - INTERVAL 24 DAY),
(2, 1001, NOW() - INTERVAL 23 DAY),
(2, 1003, NOW() - INTERVAL 22 DAY),
(2, 1004, NOW() - INTERVAL 21 DAY),
(2, 1005, NOW() - INTERVAL 20 DAY),
(2, 1006, NOW() - INTERVAL 19 DAY),
(2, 1007, NOW() - INTERVAL 18 DAY),
(2, 1008, NOW() - INTERVAL 17 DAY),
(3, 1001, NOW() - INTERVAL 19 DAY),
(3, 1002, NOW() - INTERVAL 18 DAY),
(3, 1004, NOW() - INTERVAL 17 DAY),
(3, 1005, NOW() - INTERVAL 16 DAY),
(3, 1006, NOW() - INTERVAL 15 DAY),
(4, 1001, NOW() - INTERVAL 14 DAY),
(4, 1002, NOW() - INTERVAL 13 DAY),
(4, 1003, NOW() - INTERVAL 12 DAY),
(5, 1001, NOW() - INTERVAL 9 DAY),
(5, 1003, NOW() - INTERVAL 8 DAY),
(6, 1001, NOW() - INTERVAL 7 DAY),
(6, 1002, NOW() - INTERVAL 6 DAY),
(7, 1001, NOW() - INTERVAL 4 DAY),
(7, 1002, NOW() - INTERVAL 3 DAY),
(8, 1001, NOW() - INTERVAL 2 DAY),
(8, 1002, NOW() - INTERVAL 1 DAY);


-- 插入评论表测试数据
INSERT INTO post_comment (postId, userId, content, parentId, rootId, replyUserId, thumbNum, replyCount, heat, level, status) VALUES
-- 一级评论
(1, 101, '这篇文章写得非常好，内容很有深度！', NULL, NULL, NULL, 15, 3, 25, 1, 0),
(1, 102, '我觉得这个观点很有启发性，学习了！', NULL, NULL, NULL, 8, 2, 12, 1, 0),
(1, 103, '文章的结构很清晰，逻辑性强。', NULL, NULL, NULL, 5, 1, 8, 1, 0),
(2, 101, '这个主题很有意思，期待更多相关内容。', NULL, NULL, NULL, 10, 2, 15, 1, 0),
(2, 104, '有些观点我持不同意见，但整体不错。', NULL, NULL, NULL, 3, 1, 5, 1, 0),
(3, 105, '这篇文章解决了我长期以来的困惑，感谢分享！', NULL, NULL, NULL, 20, 0, 25, 1, 0),

-- 二级评论（回复一级评论）
(1, 104, '我完全同意你的看法，作者的分析很到位。', 1, 1, 101, 6, 0, 8, 2, 0),
(1, 105, '能详细说说你觉得哪部分最有启发性吗？', 2, 2, 102, 3, 1, 5, 2, 0),
(1, 106, '我认为文章的案例分析部分做得最好。', 3, 3, 103, 2, 0, 3, 2, 0),
(2, 102, '我也很期待，作者的其他文章也都很棒。', 4, 4, 101, 4, 0, 6, 2, 0),
(2, 103, '能具体说说你不同意的观点是什么吗？', 5, 5, 104, 2, 0, 3, 2, 0),

-- 三级评论（回复二级评论）
(1, 102, '我觉得关于技术应用的部分讲得特别好。', 8, 2, 105, 1, 0, 2, 3, 0);

-- 插入评论点赞表测试数据
INSERT INTO comment_thumb (commentId, userId) VALUES
-- 对一级评论的点赞
(1, 102), (1, 103), (1, 104), (1, 105), (1, 106), (1, 107), (1, 108), (1, 109), (1, 110), (1, 111),
(1, 112), (1, 113), (1, 114), (1, 115), (1, 116), -- 15个点赞
(2, 101), (2, 103), (2, 105), (2, 107), (2, 109), (2, 111), (2, 113), (2, 115), -- 8个点赞
(3, 101), (3, 102), (3, 104), (3, 106), (3, 108), -- 5个点赞
(4, 102), (4, 103), (4, 104), (4, 105), (4, 106), (4, 107), (4, 108), (4, 109), (4, 110), (4, 111), -- 10个点赞
(5, 101), (5, 102), (5, 103), -- 3个点赞
(6, 101), (6, 102), (6, 103), (6, 104), (6, 105), (6, 106), (6, 107), (6, 108), (6, 109), (6, 110),
(6, 111), (6, 112), (6, 113), (6, 114), (6, 115), (6, 116), (6, 117), (6, 118), (6, 119), (6, 120), -- 20个点赞

-- 对二级评论的点赞
(7, 101), (7, 102), (7, 103), (7, 104), (7, 105), (7, 106), -- 6个点赞
(8, 101), (8, 102), (8, 103), -- 3个点赞
(9, 101), (9, 102), -- 2个点赞
(10, 101), (10, 103), (10, 105), (10, 107), -- 4个点赞
(11, 101), (11, 102), -- 2个点赞

-- 对三级评论的点赞
(12, 101); -- 1个点赞
# 构建阶段：使用 Maven 和 JDK 8 环境
FROM maven:3.8.1-jdk-8-slim as builder

# 设置工作目录
WORKDIR /app

# 将本地代码复制到容器中
COPY pom.xml .
COPY src ./src

# 构建项目，跳过测试
RUN mvn package -DskipTests

# 运行阶段：使用轻量级的 OpenJDK 环境
FROM openjdk:8-jre-slim

# 设置工作目录
WORKDIR /app

# 将构建阶段生成的 JAR 文件复制到运行阶段的容器中
COPY --from=builder /app/target/pandora-backend-0.0.1-SNAPSHOT.jar /app/

# 指定容器启动时运行的命令
CMD ["java", "-jar", "/app/pandora-backend-0.0.1-SNAPSHOT.jar"]
package com.cool.heart;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;


@MapperScan("com.cool.heart.mapper")
@EnableDiscoveryClient
@EnableFeignClients(basePackages = {"com.cool.server"})
@SpringBootApplication
public class WebRecommendApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebRecommendApplication.class, args);
    }

}

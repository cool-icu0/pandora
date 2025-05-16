package com.cool.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableDiscoveryClient
@EnableFeignClients(basePackages = {"com.cool.user"})
@SpringBootApplication
public class WebUserApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebUserApplication.class, args);
    }

}

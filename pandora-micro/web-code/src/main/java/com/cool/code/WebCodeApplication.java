package com.cool.code;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableDiscoveryClient
@EnableFeignClients(basePackages = {"com.cool.server"})
@SpringBootApplication
public class WebCodeApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebCodeApplication.class, args);
    }

}

package com.cool.post;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableDiscoveryClient
@EnableFeignClients(basePackages = {"com.cool.server"})
@SpringBootApplication
public class WebPostApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebPostApplication.class, args);
    }

}

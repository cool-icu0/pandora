package com.cool.file;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class WebFileApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebFileApplication.class, args);
    }

}

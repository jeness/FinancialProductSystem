package com.imooc.seller;

import com.imooc.swagger.EnableMySwagger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cache.annotation.EnableCaching;

/*
* Seller module starter
* */
@SpringBootApplication
@EnableCaching
@EntityScan("com.imooc.entity")
@EnableMySwagger
public class SellerApp {
    public static void main(String[] args){
        SpringApplication.run(SellerApp.class);
    }
}

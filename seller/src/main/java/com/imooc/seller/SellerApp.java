package com.imooc.seller;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/*
* Seller module starter
* */
@SpringBootApplication
@EnableCaching
public class SellerApp {
    public static void main(String[] args){
        SpringApplication.run(SellerApp.class);
    }
}

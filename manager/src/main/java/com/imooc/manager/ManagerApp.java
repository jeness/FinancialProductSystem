package com.imooc.manager;

import com.imooc.swagger.SwaggerConfiguration;
import io.swagger.models.Swagger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@EntityScan(basePackages = {"com.imooc.entity"})
@Import(SwaggerConfiguration.class)
public class ManagerApp {
    public static void main(String[] args){
        SpringApplication.run(ManagerApp.class);
    }
}

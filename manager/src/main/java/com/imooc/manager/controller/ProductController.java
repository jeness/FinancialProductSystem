package com.imooc.manager.controller;

import com.imooc.entity.Product;
import com.imooc.manager.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/products")
public class ProductController{
    private static Logger LOG = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService service;

    @RequestMapping(value = "", method = RequestMethod.POST)
    public Product addProduct(@RequestBody Product product){
        LOG.info("Create and add product:{}", product); //controller中是info级别的日志，实际生产过程中打印info级别，不打印debug级别的

        Product result = service.addProduct(product);

        LOG.info("Create and add product:{}", result);

        return result;
    }

}
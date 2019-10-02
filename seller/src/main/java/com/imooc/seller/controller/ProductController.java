package com.imooc.seller.controller;

import com.imooc.entity.Product;
import com.imooc.seller.service.ProductRpcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/*
* Product controller
* */
@RestController
@RequestMapping("/product")
public class ProductController {
    @Autowired
    private ProductRpcService productRpcService;

    @RequestMapping("/{id}")
    public Product findOne(@PathVariable String id){
        return productRpcService.findOne(id);
    }
}

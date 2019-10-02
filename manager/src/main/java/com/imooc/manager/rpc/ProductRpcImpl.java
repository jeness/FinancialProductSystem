package com.imooc.manager.rpc;


import com.googlecode.jsonrpc4j.spring.AutoJsonRpcServiceImpl;
import com.imooc.api.ProductRpc;
import com.imooc.api.domain.ProductRpcReq;
import com.imooc.entity.Product;
import com.imooc.manager.service.ProductService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/*
* RPC service implementation class
* */
@AutoJsonRpcServiceImpl
@Service
public class ProductRpcImpl implements ProductRpc {
    private static Logger LOG = LoggerFactory.getLogger(ProductRpcImpl.class);

    @Autowired
    private ProductService productService;

    @Override
    public List<Product> query(ProductRpcReq req) {
        LOG.info("LOG ===== Query for multiple products, request: {}", req);
        Pageable pageable = new PageRequest(req.getPage(),req.getPageSize(), req.getDirection(), req.getOrderBy());
        Page<Product> result = productService.query(req.getIdList(), req.getMinRewardRate(), req.getMaxRewardRate(), req.getStatusList(), pageable);
        LOG.info("LOG ===== Query for multiple products, result: {}", result);
        return result.getContent();
    }

    @Override
    public Product findOne(String id) {
        LOG.info("LOG ===== Query for one single product detail, request: {}", id);
        Product result = productService.findOne(id);
        LOG.info("LOG ===== Query for one single product detail, result: {}", result);
        return result;
    }
}

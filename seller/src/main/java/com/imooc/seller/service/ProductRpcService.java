package com.imooc.seller.service;

import com.imooc.api.ProductRpc;
import com.imooc.api.domain.ProductRpcReq;
import com.imooc.entity.Product;
import com.imooc.entity.enums.ProductStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

/*
* Product service RPC
* */
@Service
public class ProductRpcService {
    private static Logger LOG = LoggerFactory.getLogger(ProductRpcService.class);

    @Autowired
    private ProductRpc productRpc;

    public List<Product> findAll(){
        ProductRpcReq req = new ProductRpcReq();
        List<String> status = new ArrayList<>();
        status.add(ProductStatus.IN_SELL.name());
        Pageable pageable = new PageRequest(0, 1000, Sort.Direction.DESC, "rewardRate");
        req.setStatusList(status);
//        req.setPageable(pageable);
        req.setPage(0);
        req.setPageSize(1000);
        req.setDirection(Sort.Direction.DESC);
        req.setOrderBy("rewardRate");
        LOG.info("LOG ==== rpc query all products, request: {}", req);
        Page<Product> result = productRpc.query(req);
        LOG.info("LOG ==== rpc query all products, result: {}", result);
        return result.getContent();
    }

    @PostConstruct
    public void testFindAll(){
        findAll();
    }
}

package com.imooc.seller.service;

import com.hazelcast.core.HazelcastInstance;
import com.imooc.api.ProductRpc;
import com.imooc.api.domain.ProductRpcReq;
import com.imooc.entity.Product;
import com.imooc.entity.enums.ProductStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/*
* Product cache
* */
@Component
public class ProductCache {

    static final String CACHE_NAME = "bank_friend";
    Logger LOG = LoggerFactory.getLogger(ProductCache.class);


    @Autowired
    private ProductRpc productRpc;

    @Autowired
    private HazelcastInstance hazelcastInstance;

    /*
    * Read from cache.If there exists product in cache, then use cache. If there is no product in cache, then do not use cache.
    * */
    @Cacheable(cacheNames = CACHE_NAME)
    public Product readCache(String id){
        LOG.info("LOG ==== rpc query one single product, request:{}", id);
        Product result = productRpc.findOne(id);
        LOG.info("LOG ==== rpc query one single product, result: {}", result);
        return result;
    }

    /*
    * update cache
    * */
    @CachePut(cacheNames = CACHE_NAME, key = "#product.id")
    public Product putCache(Product product){
        return product;
    }

    /*
    * clear cache by id
    * */
    @CacheEvict(cacheNames = CACHE_NAME)
    public void removeCache(String id){

    }
    /*
    * Query for all products
    * */
    public List<Product> findAll(){
        ProductRpcReq req = new ProductRpcReq();
        List<String> status = new ArrayList<>();
        status.add(ProductStatus.IN_SELL.name());
        req.setStatusList(status);

        LOG.info("LOG ==== rpc query all products, request: {}", req);
        List<Product> result = productRpc.query(req);
        LOG.info("LOG ==== rpc query all products, result: {}", result);
        return result;
    }



    public List<Product> readAllCache(){
        Map map = hazelcastInstance.getMap(CACHE_NAME);
        List<Product> products = null;
        if(map.size() > 0){
            products = new ArrayList<>();
            products.addAll(map.values());
        }
        else{
            products = findAll();
        }
        return products;


    }


}

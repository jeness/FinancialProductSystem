package com.imooc.seller.service;

import com.imooc.api.ProductRpc;
import com.imooc.api.domain.ProductRpcReq;
import com.imooc.entity.Product;
import com.imooc.entity.enums.ProductStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
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
public class ProductRpcService implements ApplicationListener<ContextRefreshedEvent> {
    private static Logger LOG = LoggerFactory.getLogger(ProductRpcService.class);

    @Autowired
    private ProductRpc productRpc;

    @Autowired
    private ProductCache productCache;

    public List<Product> findAll(){
        return productCache.readAllCache();
    }

//    @PostConstruct
//    public void testFindAll(){
//        findAll();
//    }

    /**
    * Query one single product
    * @param id
    * @return
    * */
    public Product findOne(String id){
       Product product = productCache.readCache(id);
       if(product == null){
           productCache.removeCache(id); //avoid null product in the cache
       }
       return product;
    }

    @PostConstruct
    public void init(){
//        findOne("001");
//        findAll();
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        List<Product> products = findAll();
        products.forEach(product -> {
            productCache.putCache(product);
        });
    }
}

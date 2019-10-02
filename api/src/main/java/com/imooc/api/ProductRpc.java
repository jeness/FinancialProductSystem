package com.imooc.api;

import com.googlecode.jsonrpc4j.JsonRpcService;
import com.imooc.api.domain.ProductRpcReq;
import com.imooc.entity.Product;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.domain.Page;

import java.util.List;


/*
* Rpc service of Product
* */
@JsonRpcService("rpc/products") //不能以斜杠slash开始
public interface ProductRpc {
    /**
    * query for multiple products
    * @param req
    * @return
    */
    List<Product> query(ProductRpcReq req);

    /**
    * Query for single product
    *
    * @param id
    * @return
    * */
    Product findOne(String id);
}

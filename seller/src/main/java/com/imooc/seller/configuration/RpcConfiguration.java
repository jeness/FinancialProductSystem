package com.imooc.seller.configuration;

import com.googlecode.jsonrpc4j.spring.AutoJsonRpcClientProxyCreator;
import com.imooc.api.ProductRpc;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import java.net.MalformedURLException;
import java.net.URL;

/*
* RPC configuration in seller module
* */
@Configuration
@ComponentScan(basePackageClasses = {ProductRpc.class})
public class RpcConfiguration {

    private static Logger LOG = LoggerFactory.getLogger(RpcConfiguration.class);

    @Bean
    public AutoJsonRpcClientProxyCreator rpcClientProxyCreator(@Value("${rpc.manager.url}")String url){
        AutoJsonRpcClientProxyCreator creator = new AutoJsonRpcClientProxyCreator();
        try {
            creator.setBaseUrl(new URL(url));
        } catch (MalformedURLException e) {
            LOG.error("LOG: ERROR ==== Create rpc service url address has error!!!");
        }
        creator.setScanPackage(ProductRpc.class.getPackage().getName());
        return creator;
    }

    public static void main(String[] args) throws MalformedURLException{
        URL baseUrl = new URL("http://localhost:8081/manager/"); //以斜杠结尾
        String path = "rpc/products"; //不以斜杠开头
        System.out.println(new URL(baseUrl, path).toString());
    }
}

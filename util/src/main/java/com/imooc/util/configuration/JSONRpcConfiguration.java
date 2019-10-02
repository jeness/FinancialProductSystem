package com.imooc.util.configuration;
/*
* Jsonrpc auto config class
* */

import com.googlecode.jsonrpc4j.spring.AutoJsonRpcClientProxyCreator;
import com.googlecode.jsonrpc4j.spring.AutoJsonRpcServiceImplExporter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.MalformedURLException;
import java.net.URL;

@Configuration
public class JSONRpcConfiguration {
    private static Logger LOG = LoggerFactory.getLogger(JSONRpcConfiguration.class);


    @Bean
    public AutoJsonRpcServiceImplExporter rpcServiceImplExporter() {
        return new AutoJsonRpcServiceImplExporter();
    }

    @Bean
    @ConditionalOnProperty(value = {"rpc.client.url", "rpc.client.basePackage"})
    public AutoJsonRpcClientProxyCreator rpcClientProxyCreator(@Value("${rpc.client.url}")String url, @Value("${rpc.client.basePackage}")String basePackage){
        AutoJsonRpcClientProxyCreator creator = new AutoJsonRpcClientProxyCreator();
        try {
            creator.setBaseUrl(new URL(url));
        } catch (MalformedURLException e) {
            LOG.error("LOG: ERROR ==== Create rpc service url address has error!!!");
        }
        creator.setScanPackage(basePackage);
        return creator;
    }
}

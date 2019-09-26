package com.imooc.manager.service;

import com.imooc.entity.Product;
import com.imooc.entity.enums.ProductStatus;
import com.imooc.manager.repositories.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.util.Date;

/*
* product service class
* */
@Service
public class ProductService {
    private static Logger LOG = LoggerFactory.getLogger(ProductService.class);  //debug 级别的日志

    @Autowired
    private ProductRepository repository;



    public Product addProduct(Product product){
        LOG.debug("Create and add product, parameters:{}", product);//service中是debug级别的日志，实际生产过程中打印info级别，不打印debug级别的
        //data validation and check
        checkProduct(product);

        //Set default value
        setDefault(product);
        Product result = repository.save(product);

        LOG.debug("Create product, result: {}", result);
        return result;
    }
/*
* Set default value
* create time, update time, investment step, lock term, status
* */
    private void setDefault(Product product) {
        if(product.getCreateAt() == null){
            product.setCreateAt(new Date());
        }
        if(product.getUpdateAt() == null){
            product.setUpdateAt(new Date());
        }
        if(product.getStepAmount() == null){
            product.setStepAmount(BigDecimal.ZERO);
        }
        if(product.getLockTerm() == null){
            product.setLockTerm(0);
        }
        if(product.getStatus() == null){
            product.setStatus(ProductStatus.AUDITING.name());
        }
    }

    /*
    * product data validation(business logic requirement)
    * 1. not null
    * 2. Reward rate is 0-30
    * 3. investment step is integer
    * @param product
    * */
    private void checkProduct(Product product) {
        Assert.notNull(product.getId(), "Product id can not be null.");

        Assert.isTrue(BigDecimal.ZERO.compareTo(product.getRewardRate()) < 0 && BigDecimal.valueOf(30).compareTo(product.getRewardRate()) >= 30, "Reward rate is wrong.");

        Assert.isTrue(BigDecimal.valueOf(product.getStepAmount().longValue()).compareTo(product.getStepAmount()) == 0, "Investment amount should be integer");
    }
}

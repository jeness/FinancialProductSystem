package com.imooc.manager.service;

import com.imooc.entity.Product;
import com.imooc.entity.enums.ProductStatus;
import com.imooc.manager.error.ErrorEnum;
import com.imooc.manager.repositories.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import javax.persistence.criteria.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/*
* product service class
* */
@Service
public class ProductService {
    private static Logger LOG = LoggerFactory.getLogger(ProductService.class);  //debug 级别的日志

    @Autowired
    private ProductRepository repository;



    public Product addProduct(Product product){
        LOG.debug("LOG: Create and add product, parameters:{}", product);//service中是debug级别的日志，实际生产过程中打印info级别，不打印debug级别的
        //data validation and check
        checkProduct(product);

        //Set default value
        setDefault(product);
        Product result = repository.save(product);

        LOG.debug("LOG: Create product, result: {}", result);
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
        Assert.notNull(product.getId(), ErrorEnum.ID_NOT_NULL.getMessage()); //msg: "ID can not be empty"

        Assert.isTrue(BigDecimal.ZERO.compareTo(product.getRewardRate()) < 0 && BigDecimal.valueOf(30).compareTo(product.getRewardRate()) >= 0, ErrorEnum.REWARDRATE_IS_IN_WRONG_RANGE.getMessage());

        Assert.isTrue(BigDecimal.valueOf(product.getStepAmount().longValue()).compareTo(product.getStepAmount()) == 0, ErrorEnum.INVESTMENT_NUMBER_IS_NOT_INTEGER.getMessage());
    }

    /*
    * Query for one single product
    * @param id - product id
    * @return return the product or null
    * */
    public Product findOne(String id){
        Assert.notNull(id, "Need product id as param");
        LOG.debug("LOG: Query one single product, id={}", id);
        Product product = repository.findOne(id);
        LOG.debug("LOG: Query one single product, result={}", product);
        return product;
    }

    /**
     * 分页查询paging query
    * @Param: [idList, minRewardRate, maxRewardRate, statusList, pageable]
    * @return: org.springframework.data.domain.Page<com.imooc.entity.Product>
    */
    public Page<Product> query(List<String> idList,
                               BigDecimal minRewardRate, BigDecimal maxRewardRate,
                               List<String> statusList,
                               Pageable pageable){
        LOG.debug("LOG: Query products, idList={}, minRewardRate={},maxRewardRate={},statusList={},pageable={}", idList,minRewardRate,maxRewardRate,statusList,pageable);

        Specification<Product> specification = new Specification<Product>(){
            @Override
            public Predicate toPredicate(Root<Product> root, CriteriaQuery<?> query, CriteriaBuilder cb){
                Expression<String> idCol = root.get("id");
                Expression<BigDecimal> rewardRateCol = root.get("rewardRate");
                Expression<String> statusCol = root.get("status");
                List<Predicate> predicates = new ArrayList<>();
                if(idList != null && idList.size() > 0){
                    predicates.add(idCol.in(idList));
                }
                if(BigDecimal.ZERO.compareTo(minRewardRate) < 0){
                    predicates.add(cb.ge(rewardRateCol, minRewardRate));  //great or equal to >=
                }
                if(BigDecimal.ZERO.compareTo(maxRewardRate) < 0){
                    predicates.add(cb.le(rewardRateCol, maxRewardRate)); //less or equal to <=
                }
                if(statusList != null && statusList.size() > 0){
                    predicates.add(statusCol.in(statusList));
                }

                query.where(predicates.toArray(new Predicate[0]));
                return null;
            }
        };

        Page<Product> page = repository.findAll(specification, pageable);
        LOG.debug("LOG: Query products, result={}", page);
        return page;

    }
}

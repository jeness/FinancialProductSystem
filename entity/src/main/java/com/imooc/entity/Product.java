package com.imooc.entity;

import com.imooc.entity.enums.ProductStatus;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;
import java.util.Date;
/*
* Product entity
* */
@Entity
@ApiModel(value = "Products", description = "Model of products")
public class Product {
    @Id
    private String id;
    private String name;
    /**
    * @see com.imooc.entity.enums.ProductStatus
    */
    @ApiModelProperty(value = "Status of product", dataType = "com.imooc.entity.enums.ProductStatus")
    private String status;
    //起投金额
    private BigDecimal thresholdAmount;
    //投资步长
    private BigDecimal stepAmount;
    //锁定期
    private Integer lockTerm;  //不能设置为int类型，int的默认值是0，不符合requirement 要求，Integer的默认值是null
    //收益率，因为要与其他数相乘，所以使用BigDecimal
    private BigDecimal rewardRate;
    private String memo;
    private Date createAt;
    private Date updateAt;
    private String createUser;
    private String updateUser;

    public Product(){

    }

    public Product(String id, String name, String status, BigDecimal thresholdAmount, BigDecimal stepAmount, BigDecimal rewardRate) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.thresholdAmount = thresholdAmount;
        this.stepAmount = stepAmount;
        this.rewardRate = rewardRate;
    }

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getThresholdAmount() {
        return thresholdAmount;
    }

    public void setThresholdAmount(BigDecimal thresholdAmount) {
        this.thresholdAmount = thresholdAmount;
    }

    public BigDecimal getStepAmount() {
        return stepAmount;
    }

    public void setStepAmount(BigDecimal stepAmount) {
        this.stepAmount = stepAmount;
    }

    public Integer getLockTerm() {
        return lockTerm;
    }

    public void setLockTerm(Integer lockTerm) {
        this.lockTerm = lockTerm;
    }

    public BigDecimal getRewardRate() {
        return rewardRate;
    }

    public void setRewardRate(BigDecimal rewardRate) {
        this.rewardRate = rewardRate;
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo;
    }

    public Date getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Date createAt) {
        this.createAt = createAt;
    }

    public Date getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(Date updateAt) {
        this.updateAt = updateAt;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public String getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser;
    }
}

package com.imooc.entity.enums;

public enum OrderStatus {
    INIT("Init"),  //初始化
    PROCESS("Processing"), //处理中
    SUCCESS("Success"),//成功
    FAIL("Fail");//失败

    private String desc;

    OrderStatus(String desc){
        this.desc = desc;
    }

    public String getDesc(){
        return desc;
    }
}

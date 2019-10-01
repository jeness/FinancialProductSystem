package com.imooc.manager.error;

public enum ErrorEnum {
    ID_NOT_NULL("F001", "ERROR!!! ID can not be empty", false),
    REWARDRATE_IS_IN_WRONG_RANGE("F002", "ERROR!!! Reward rate is wrong", false),
    INVESTMENT_NUMBER_IS_NOT_INTEGER("F003", "ERROR!!! Investment amount should be integer", false),
    UNKNOW("999", "Unknowed error", false);
    private String code;
    private String message;
    private boolean canRetry;

    ErrorEnum(String code, String message, boolean canRetry) {
        this.code = code;
        this.message = message;
        this.canRetry = canRetry;
    }

    public static ErrorEnum getByCode(String code){
        for(ErrorEnum errorEnum: ErrorEnum.values()){
            if(errorEnum.code.equals(code)){
                return errorEnum;
            }
        }
        return UNKNOW;
    }

    public static ErrorEnum getByMessage(String msg){
        for(ErrorEnum errorEnum: ErrorEnum.values()){
            if(errorEnum.message.equals(msg)){
                return errorEnum;
            }
        }
        return UNKNOW;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    public boolean isCanRetry() {
        return canRetry;
    }
}

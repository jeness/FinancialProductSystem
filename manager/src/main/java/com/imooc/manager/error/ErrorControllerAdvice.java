package com.imooc.manager.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * Unified error handling
 */
@ControllerAdvice(basePackages = {"com.imooc.manager.controller"})
public class ErrorControllerAdvice {
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseEntity handleExpection(Exception e){
        Map<String, Object> attrs = new HashMap<>();
        String errorMsg = e.getMessage();
        ErrorEnum errorEnum = ErrorEnum.getByMessage(errorMsg);
        attrs.put("message", errorEnum.getMessage());
        attrs.put("code", errorEnum.getCode());
        attrs.put("canRetry", errorEnum.isCanRetry());
        attrs.put("type", "advice");
        Assert.isNull(attrs, errorMsg+"-Here are using advice. " + attrs.toString());

        return new ResponseEntity(attrs, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

package com.imooc.seller.sign;
/*
* Sign plaintext
* */

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.imooc.util.JsonUtil;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder(alphabetic = true)
public interface SignText {
    default String toText(){  //java8: use default keyword to implement interface
        return JsonUtil.toJson(this);
    }
}

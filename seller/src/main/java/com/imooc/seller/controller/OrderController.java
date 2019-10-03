package com.imooc.seller.controller;

import com.imooc.entity.Order;

import com.imooc.seller.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 订单相关
 */
@RestController
@RequestMapping("/order")
public class OrderController {
    static Logger LOG = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    /**
     * 下单
     *
     * @param order
     * @return
     */
    @RequestMapping(value = "/apply", method = RequestMethod.POST)
    public Order apply(@RequestBody Order order) {
        LOG.info("申购请求:{}", order);


        order = orderService.apply(order);
        LOG.info("申购结果:{}", order);
        return order;
    }
}
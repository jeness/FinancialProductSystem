package com.imooc.seller;
/*
* 对账测试
* */

import com.imooc.seller.repositories.OrderRepository;
import com.imooc.seller.service.VerifyService;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;
import java.util.Date;
import java.util.GregorianCalendar;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class VerifyTest {
    @Autowired
    private VerifyService verifyService;

    @Autowired
    private OrderRepository orderRepository;

    @Test
    public void makeVerificationTest(){  //主库
        Date day = new GregorianCalendar(2019, 9, 2).getTime();
        File file = verifyService.makeVerificationFile("111", day);
        System.out.println(file.getAbsolutePath());
    }

    @Test
    public void saveVerificationOrders(){
        Date day = new GregorianCalendar(2019, 9, 2).getTime();
        verifyService.saveChanOrders("111", day);
    }

    @Test
    public void verifyTest(){
        Date day = new GregorianCalendar(2019, 9, 2).getTime();
        System.out.println(String.join(";", verifyService.verifyOrder("111", day)));
    }

    @Test
    public void queryOrder(){ //备份库
        System.out.println(orderRepository.findAll());
    }
}

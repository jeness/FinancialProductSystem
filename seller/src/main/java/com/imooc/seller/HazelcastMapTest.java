package com.imooc.seller;


import com.hazelcast.core.HazelcastInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Map;

@Component
public class HazelcastMapTest {
    //为什么test不写在test下面？因为test执行完了就直接关闭了，我们再hazelcast management center里看不到这个node run的状况

    @Autowired
    private HazelcastInstance hazelcastInstance;

    @PostConstruct
    public void put() {
        Map map = hazelcastInstance.getMap("imooc"); //distributed used map, run on multiple nodes
        map.put("name", "bank_friend");

    }
}

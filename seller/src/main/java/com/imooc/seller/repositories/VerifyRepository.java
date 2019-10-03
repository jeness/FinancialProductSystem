package com.imooc.seller.repositories;

import com.imooc.entity.Order;
import com.imooc.entity.VerificationOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Date;
import java.util.List;

public interface VerifyRepository extends CrudRepository<VerificationOrder,String>, JpaRepository<VerificationOrder, String>, JpaSpecificationExecutor<VerificationOrder> {

    /**
    * query chanId in [start, end) time slot
    * @param chanId
     * @param start
     * @param end
     * @return 对账数据list
    * */
    @Query(value = "SELECT CONCAT_WS('|', order_id,outer_order_id,chan_id,chan_user_id,product_id,order_type,amount,DATE_FORMAT( create_at,'%Y-%m-%d %H:%i:%s')) FROM order_t WHERE order_status = 'success' AND chan_id = ?1 AND create_at >= ?2 AND create_at < ?3",nativeQuery = true)
    List<String> queryVerificationOrders(String chanId, Date start, Date end);

}

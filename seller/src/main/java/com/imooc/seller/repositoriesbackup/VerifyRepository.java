package com.imooc.seller.repositoriesbackup;

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

    /*长款*/
    @Query(value = "SELECT t.`order_id` FROM order_t t LEFT JOIN verification_order v ON t.`chan_id` = ?1 AND t.`outer_order_id` = v.`order_id` WHERE v.`order_id` IS NULL AND t.create_at >= ?2 AND t.create_at < ?3",nativeQuery = true)
    List<String> queryExcessOrders(String chanId, Date start,Date end);

    /*漏单*/
    @Query(value = "SELECT v.`order_id` FROM verification_order v LEFT JOIN order_t t ON t.`chan_id` = ?1 AND v.`outer_order_id` = t.`order_id` WHERE t.`order_id` IS NULL AND v.create_at >= ?2 AND v.create_at < ?3",nativeQuery = true)
    List<String> queryMissOrders(String chanId, Date start,Date end);

    /*不一致*/
    @Query(value = "SELECT t.order_id FROM order_t t JOIN verification_order v ON t.`chan_id` = ?1 AND t.`outer_order_id` = v.`order_id` WHERE CONCAT_WS('|',t.chan_id,t.chan_user_id,t.product_id,t.order_type,t.amount,DATE_FORMAT( t.create_at,'%Y-%m-%d %H:%i:%s')) != CONCAT_WS('|',v.chan_id,v.chan_user_id,v.product_id,v.order_type,v.amount,DATE_FORMAT( v.create_at,'%Y-%m-%d %H:%i:%s')) AND t.create_at >= ?2 AND t.create_at < ?3",nativeQuery = true)
    List<String> queryDifferentOrders(String chanId, Date start,Date end);
}

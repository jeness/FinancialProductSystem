-- 对账表
CREATE TABLE `verification_order` (
  `order_id` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '订单编号',
  `chan_id` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '渠道编号',
  `product_id` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '产品编号',
  `chan_user_id` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '渠道用户编号',
  `order_type` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '类型,APPLY:申购,REDEEM:赎回',

  `outer_order_id` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '外部订单编号',
  `amount` decimal(15,3) NOT NULL COMMENT '金额',

  `create_at` datetime DEFAULT NULL COMMENT '创建时间',
  
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
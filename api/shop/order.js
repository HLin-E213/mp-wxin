/*引入封装好的请求方法*/
import { dajxHttp } from '../../utils/request.js';

/**
 * @desc 确认订单
 * @param type
 * @param sku_list Array
 * @returns {Promise<any>}
 */
export async function confirmOrder(type,sku_list) {
    return await dajxHttp.post({
        url: '/api/shop-order/confirm',
        data: {
            type,
            sku_list,
        },
    })
}

/**
 * @desc
 * @param type
 * @param sku_list
 * @param address_id
 * @param coupon
 * @returns {Promise<any>}
 */
export async function createOrder(type, sku_list = [], address_id, coupon = []) {
    return await dajxHttp.post({
        url: '/api/shop-order/create',
        data: {
            type,
            sku_list,
            address_id,
            coupon,
        },
    });
}

/**
 * @desc 订单支付
 * @param order_no
 * @param pay_type
 * @returns {Promise<any>}
 */
export async function payOrder(order_no,pay_type = 2) {
    return await dajxHttp.post({
        url: '/api/shop-order/pay',
        data: {
            order_no,
            pay_type,
        },
    });
}

/**
 * @desc 获取订单详情
 * @param order_no
 * @returns {Promise<any>}
 */
export async function getOrderInfo(order_no) {
    return await dajxHttp.post({
        url: '/api/shop-order/info',
        data: {
            order_no,
        },
    });
}

/**
 * @desc 获取订单列表
 * @param type 订单类型 默认0-全部 1-待付款 2-待收货 3-已完成 4-已取消
 * @param page
 * @param pageSize
 * @returns {Promise<any>}
 */
export async function getOrderList(type, page, pageSize) {
    return await dajxHttp.post({
        url: '/api/shop-order/list',
        data: {
            type,
            page,
            pageSize,
        },
    });
}

/**
 * @desc 取消订单
 * @param order_no
 * @param cancel_reason
 * @returns {Promise<void>}
 * @constructor
 */
export async function CancelOrder(order_no, cancel_reason) {
    return await dajxHttp.post({
        url: '/api/shop-order/cancel',
        data: {
            order_no,
            cancel_reason,
        },
    });
}

/**
 * @desc 查看物流
 * @param order_no
 * @returns {Promise<any>}
 */
export async function getExpressInfo(order_no) {
    return await dajxHttp.post({
        url: '/api/shop-order/express-info',
        data: {
            order_no,
        },
    });
}

/**
 * @desc 确认收货
 * @param order_no
 * @returns {Promise<any>}
 * @constructor
 */
export async function ConfirmReceipt(order_no) {
    return await dajxHttp.post({
        url: '/api/shop-order/confirm-receipt',
        data: {
            order_no,
        },
    });
}

/**
 * @desc 子订单的退款订单列表
 * @param order_no
 * @returns {Promise<any>}
 */
export async function getRefundList(order_no){
    return await dajxHttp.post({
        url: '/api/shop-order/refund-list',
        data: {
            order_no,
        },
    });
}

/**
 * @desc 取消/退款进度详情
 * @param order_no
 * @param refund_no
 * @returns {Promise<void>}
 */
export async function getCancelProgressInfo(order_no, refund_no) {
    return await dajxHttp.post({
        url: '/api/shop-order/cancel-progress-info',
        data: {
            order_no,
            refund_no
        },
    });
}


/**
 * @desc 退款
 * @param order_no
 * @param product_sku_ids []
 * @param refund_reason
 * @param refund_explain
 * @param refund_images []
 * @returns {Promise<void>}
 */
export async function doRefund(order_no, product_sku_ids, refund_reason,refund_explain, refund_images) {
    return await dajxHttp.post({
        url: '/api/shop-order/refund',
        data: {
            order_no,
            product_sku_ids,
            refund_reason,
            refund_explain,
            refund_images,
        },
    });
}

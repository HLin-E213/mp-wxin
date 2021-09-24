/*引入封装好的请求方法*/
import { dajxHttp } from '../../utils/request.js';

/**
 * @desc 获取商城我的优惠券列表
 * @param type
 * @param pageSize
 * @param page
 * @returns {Promise<any>}
 */
export async function getCouponShopList(type, pageSize, page) {
    return await dajxHttp.post({
        url: '/api/shop-coupon/list',
        data: {
            type,
            pageSize,
            page,
        },
    })
}

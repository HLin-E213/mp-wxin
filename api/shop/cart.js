/*引入封装好的请求方法*/
import { dajxHttp } from '../../utils/request.js';

/**
 * @desc 获取购物车数量
 * @returns {Promise<any>}
 */
export async function getCartCount() {
    return await dajxHttp.post({
        url: '/api/cart/count',
        data: {},
    })
}

/**
 * @desc 添加购物车
 * @param product_sku_id
 * @param quantity
 * @returns {Promise<any>}
 */
export async function addCart(product_sku_id, quantity) {
    return await dajxHttp.post({
        url: '/api/cart/add',
        data: {
            product_sku_id,
            quantity
        },
    })
}

/**
 * @desc 获取购物车列表
 * @param page
 * @param pageSize
 * @returns {Promise<any>}
 * @constructor
 */
export async function GetCartList(page = 1, pageSize = 10) {
    return await dajxHttp.post({
        url: '/api/cart/list',
        data: {
            page,
            pageSize
        },
    })
}

/**
 * @desc 删除购物车商品和减少
 * @param product_sku_id
 * @param quantity
 * @returns {Promise<any>}
 * @constructor
 */
export async function DelCartItem(product_sku_id, quantity = 0) {
    return await dajxHttp.post({
        url: '/api/cart/del',
        data: {
            product_sku_id,
            quantity
        },
    })
}

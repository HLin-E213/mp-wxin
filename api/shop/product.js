/*引入封装好的请求方法*/
import { dajxHttp } from '../../utils/request.js';

/**
 * @desc 获取商品列表
 * @param is_recommend
 * @param product_category_id
 * @param pageSize
 * @param page
 * @returns {Promise<any>}
 */
export async function getProductList(is_recommend = false, product_category_id = '', pageSize = 10, page = 1) {
    return await dajxHttp.post({
        url: '/api/product/list',
        data: {
            is_recommend,
            pageSize,
            page,
            product_category_id,
        },
    })
}

/**
 * @desc 获取商品详情
 * @param id
 * @returns {Promise<any>}
 */
export async function getProductInfo(id) {
    return await dajxHttp.post({
        url: '/api/product/info',
        data: {
            id,
        },
    });
}

/**
 * @desc 获取商品sku
 * @param id
 * @returns {Promise<any>}
 */
export async function getProductSKU(id) {
    return await dajxHttp.post({
        url: '/api/product/product-sku-list',
        data: {
            id,
        },
    });
}

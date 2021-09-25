/*引入封装好的请求方法*/
import { dajxHttp } from '../../utils/request.js';

/**
 * @desc 获取商品列表
 * @param is_recommend
 * @param product_category_id
 * @param keyword_search
 * @param pageSize
 * @param page
 * @returns {Promise<any>}
 */
export async function getProductList(is_recommend = false, product_category_id = '', keyword_search='', pageSize = 10, page = 1) {
    return await dajxHttp.post({
        url: '/api/product/list',
        data: {
            is_recommend,
            product_category_id,
			keyword_search,
            pageSize,
            page
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

/**
 * @desc 获取热搜商品
 * @returns {Promise<any>}
 */
export async function getHotProduct() {
    return await dajxHttp.post({
        url: '/api/product/hot-keyword-search-list',
        data: {},
    });
}

/**
 * @desc 获取商品活动
 * @returns {Promise<any>}
 */
export async function getPromotionProduct() {
    return await dajxHttp.post({
        url: '/api/product/product-promotion-category',
        data: {},
    });
}


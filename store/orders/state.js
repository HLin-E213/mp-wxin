export default {
    orderSpec:{},
    orderData:{},
    //订单中心
    itemList: [
        {
            title: '全部',
            value: 0,
            check: true,
        },
        {
            title: '待付款',
            value: 1,
            check: false,
        },
        {
            title: '服务中',
            value: 2,
            check: false,
        },
        {
            title: '已完成',
            value: 3,
            check: false,
        },
        {
            title: '已取消',
            value: 4,
            check: false,
        },
    ],
    //订单状态页面图标路径
    imgUrlList: [
        {
            url: 'https://admin.dajxyl.com/oss?path=img/success_origin.png',
        },
        {
            url: 'https://admin.dajxyl.com/oss?path=img/fail@2x.png',
        }
    ],
    //产品详情服务流程数组
    processServiceList: [
        {
            imgUrl: 'https://admin.dajxyl.com/oss?path=img/dingdan@2x.png',
            name: '预约下单',
        },
        {
            imgUrl: 'https://admin.dajxyl.com/oss?path=img/duozhongzhifu@2x.png',
            name: '在线支付',
        },
        {
            imgUrl: 'https://admin.dajxyl.com/oss?path=img/fanhui2@2x.png',
            name: '系统派单',
        },
        {
            imgUrl: 'https://admin.dajxyl.com/oss?path=img/jiatingbaojie@2x.png',
            name: '进行服务',
        }
    ],
    //商品确认订单所选择的sku
    sku_type: null, // 	类型 1:来源于购物车 2:来源于立即购买
    sku_list: [],
    activeAddress: {},
    // 当前订单要用的优惠券列表
    couponList: [],
    activeShopCoupon: [],
}

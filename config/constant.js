/**
 * @Description: 用来存储全局的相关常量值以及方法
 * @Author: mahui
 * @Date: 2020/10/12 9:02 PM
 */

const { model='', statusBarHeight = 0 } = uni.getSystemInfoSync();
export const ISIPX = model.search('iPhone X') != -1; // 判断是否为iphoneX系列手机；
export const ISNOTCHSCREEN = statusBarHeight > 20; // 根据状态栏判定是否为刘海屏手机 在uni中状态栏高度超过20就为刘海屏手机
export const SHOP_ORDER_TAB = [
    {
        label: '全部',
        value: 0,
    },
    {
        label: '待付款',
        value: 1,
    },
    {
        label: '待收货',
        value: 2,
    },
    {
        label: '已完成',
        value: 3,
    },
    {
        label: '已取消',
        value: 4,
    }
];

/**
 // 订单状态  0=未发货  1=已发货  2=已完成
 "status": "0",
 // 支付状态: 0=未付款  1=已付款  2=退款中  3=已退款  4=已取消
 "pay_status": "0",

 订单列表的状态：
 0-全部
 1-待付款： pay_status => 0  取消 去支付
 2-待收货： pay_status => 1||2 && status => 0||1  退款 查看物流(判断 status => 1) 确认收货(判断 status => 1) 退款明细(判断pay_status => 2 || 3 || 4)
 3-已完成： status => 2  再次购买
 4-已取消： pay_status => 4||3 退款明细(判断是否pay_status => 2 || 3 || 4) 再次购买

 取消 去支付 退款 查看物流 确认收货 再次购买 退款明细
 cancel pay refund checkRail accept rebuy refundDetail

 订单详情的状态：
 待付款 pay_status => 0
 已取消 pay_status => 4
 已退款 pay_status => 3
 待收货 pay_status => 1||2 && status => 0||1
 已完成 status => 2
 */

export const SHOP_ORDER_BTN = [ // 根据订单状态来判断要不要做按钮展示
    {
        label: '取消',
        url: '',
        isShow: (type, status, pay_status) => (Number(pay_status) === 0 && Number(type) === 1),
        important: false,
        value: 'cancel'
    },
    {
        label: '去支付',
        url: '',
        isShow: (type, status, pay_status) => (Number(pay_status) === 0 && Number(type) === 1),
        important: true,
        value: 'pay'
    },
    {
        label: '退款',
        url: '',
        isShow: (type, status, pay_status) => (Number(type) === 2),
        important: false,
        value: 'refund'
    },
    {
        label: '查看物流',
        url: '',
        isShow: (type, status, pay_status) => (Number(type) === 2 && Number(status) === 1),
        important: false,
        value: 'checkRail'
    },
    {
        label: '确认收货',
        url: '',
        isShow: (type, status, pay_status) => (Number(type) === 2 && Number(status) === 1),
        important: true,
        value: 'accept'
    },
    {
        label: '退款明细',
        url: '',
        isShow: (type, status, pay_status , isShow = false) => ((Number(type) === 2 || Number(type) === 4) && (Number(pay_status) === 1 || Number(pay_status) === 2 || Number(pay_status) === 3 || Number(pay_status) === 4) && isShow),
        important: true,
        value: 'refundDetail'
    },
    {
        label: '再次购买',
        url: '',
        isShow: (type, status, pay_status) => ((Number(type) === 3 || Number(type) === 4) || Number(status) === 2),
        important: true,
        value: 'rebuy'
    },
];
export const couponTypeMap = {
    '1': '无门槛优惠券',
    '2': '满减优惠券',
    '3': '折扣优惠券',
};
export const CONTACT_TEL = '400-036-0036';
export const localStorageKey = {
  SIGN_POPUP_DATE: 'signPopupDate', // 金币签到弹框日期
}
export const VOICE_SOURCE = {
    SUC: 'https://admin.dajxyl.com/oss?path=video/upload/202108/sign-suc-voice.mp3',
    FAIL: 'https://admin.dajxyl.com/oss?path=video/upload/202108/sign-fail-voice.mp3',
}

export default {
    // 我的信息
    userInfo: {},
    // 优惠券列表
    couponList: {},
    //我的页面
    menu_list: [
        {
            imgUrl: 'https://admin.dajxyl.com/oss?path=video/upload/202108/gold-sign-icon@2x .png',
            name: '金币签到',
            path: '/pages/taskCenter/home',
        },
        {
            imgUrl: 'https://admin.dajxyl.com/oss?path=img/chengyunshangwodedingdan_origin.png',
            name: '订单管理',
            path: '/pages/orderList/orderList',
        },
        {
            imgUrl: 'https://admin.dajxyl.com/oss?path=img/dizhiguanli_origin.png',
            name: '地址管理',
            path: '/pages/managementAddress/managementAddress',
        },
        {
            imgUrl: 'https://admin.dajxyl.com/oss?path=img/youhuiquan_origin.png',
            name: '优惠券',
            path: '/pages/userCoupon/userCoupon',
        },
        // {
        // 	imgUrl:'/static/qianba_2@2x.png',
        // 	name:'我的钱包',
        // 	path:'/pages/detailsOrder/detailsOrder',
        // },
        // {
        // 	imgUrl:'/static/yaoqing_wode@2x.png',
        // 	name:'邀请人数',
        // 	path:'/pages/detailsOrder/detailsOrder',
        // },
    ],
    content_list: [
        {
            urlImg: 'https://admin.dajxyl.com/oss?path=img/shoubiao_origin.png',
            title: '我的消息',
            path: '/pages/centerMessage/centerMessage',
            key: 'message',
        },
        {
            urlImg: 'https://admin.dajxyl.com/oss?path=img/shimingrenzheng_origin.png',
            title: '联系客服',
            message: false,
            path: '',
            key: 'customer',
        },
        {
            urlImg: 'https://admin.dajxyl.com/oss?path=img/shezhi_origin.png',
            title: '设置',
            message: false,
            path: '/pages/upSet/upSet',
            key: 'setting',
        },
    ],
    current: '成都市',
    //地址管理
    addressList: [],
    //编辑地址数据
    editorData: {
        lat: 30.570533752441,
        lng: 104.06456756592,
    },
    //地址管理中选中单条地址数据，保留在vuex中供其他页面使用
    addressDataSingle: null,
    //添加服务地址中地图数据
    covers: [
        {
            // latitude: 30.64242,
            // longitude: 104.04311,
            width: 30,
            height: 40,
            iconPath: 'https://admin.dajxyl.com/oss?path=img/location.png'
        }
    ],
	//我的中点击优惠券，点击使用某个优惠券记录选择的优惠券数据
    couponUseData: null,
    // 修改用户信息的类型
    upSet: null,
}

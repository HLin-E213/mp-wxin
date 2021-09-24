/*引入封装好的请求方法*/
import {dajxAjax, dajxHttp} from '../utils/request.js';

//定义前端接口请求名称

let url = {
    loginVerify: "/user/login",					// 用户登录接口
    telByCodeGetToken: '/api/user/loginbycode', 	// 手机验证码获取token
}

/**
 * @desc 微信登录绑定手机号
 * @param openid 前端通过[user/wx-login]微信小程序登录接口获取openid
 * @param session_key 前端通过[user/wx-login]微信小程序登录接口获取session_key
 * @param encrypted_data 前端通过getPhoneNumber获取的encryptedData
 * @param iv 前端通过getPhoneNumber获取的iv
 * @param invite_code 邀请码
 * @returns {Promise<any>}
 */
export async function wxTel(openid, session_key, encrypted_data, iv, invite_code) {
    return await dajxHttp.post({
        url: '/api/user/wx-bind-mobile',
        data: {
            openid: openid,
            session_key: session_key,
            encrypted_data: encrypted_data,
            iv: iv,
            invite_code: invite_code,
        },
    })
}

/**
 * @desc 微信小程序登录
 * @param code 微信登录凭证,小程序调用wx.login方法获取的code值
 * @param nick_name 微信昵称,前端通过wx.getUserInfo获取的nickName值
 * @param avatar_url 微信头像,小程序调用wx.login方法获取的avatarUrl值
 * @param signature 签名
 * @param encrypted_data 数据
 * @param iv 加密
 * @param invite_code 邀请码
 * @returns {Promise<any>}
 */
export async function wxLogin(code, nick_name, avatar_url, signature, encrypted_data, iv, invite_code = null) {
    return await dajxHttp.post({
        url: '/api/user/wx-login',
        data: {
            code: code,
            nick_name: nick_name,
            avatar_url: avatar_url,
            signature: signature,
            encrypted_data: encrypted_data,
            iv: iv,
            invite_code: invite_code,
        },
    })
}

/**
 * @desc 轮播图数据接口
 * @param modelIDs array 轮播图模块ID以数组的方式
 * @returns {Promise<any>}
 */
export async function rotationPicture(modelIDs) {
    return await dajxHttp.post({
        url: '/api/banner/model',
        data: {
            modelID: modelIDs,
        },
    })
}

/**
 * @desc 获取首页热销单品数据列表
 * @param adCode 城市code
 * @returns {Promise<any>}
 */
export async function getSaleHot(adCode) {
    return await dajxHttp.post({
        url: '/api/home/hot',
        data: {
            adCode: adCode
        }
    })
}

/**
 * @desc 获取服务分类
 * @param adCode
 * @param pid
 * @param type
 * @returns {Promise<any>}
 */
export async function getMenuServiceType(adCode, pid = 0, type = '') {
    const params = {
        adCode,
        pid,
    }
    if (type) {
        params.type = type
    }
    return await dajxHttp.post({
        url: '/api/classify/service',
        data: params
    })
}

/**
 * @desc 获取用户地址
 * @returns {Promise<any>}
 */
export async function getAddressList() {
    return await dajxHttp.post({
        url: '/api/address/get',
        data: {}
    });
}

/**
 * @desc 设置默认用户地址
 * @param addressId 地址的ID
 * @returns {Promise<any>}
 */
export async function sefDefaultAddress(addressId) {
    return await dajxHttp.post({
        url: '/api/address/setdefault',
        data: {
            id: addressId
        }
    });
}

/**
 * @desc 获取用户信息
 * @returns {Promise<any>}
 */
export async function getUserInfo() {
    return await dajxHttp.post({
        url: '/api/user/info',
        data: {}
    });
}

/**
 * @desc 获取服务详情
 * @param sid 服务ID
 * @returns {Promise<any>}
 */
export async function getServiceInfo(sid) {
    return await dajxHttp.post({
        url: '/api/service/info',
        data: {
            sid: sid
        }
    });
}

/**
 * @desc 领取优惠券
 * @param code 优惠券码
 * @returns {Promise<any>}
 */
export async function couponPick(code) {
    return await dajxHttp.post({
        url: '/api/coupon/pick',
        data: {
            code: code
        }
    });
}

/**
 * @desc 领取优惠券
 * @param id 优惠券id
 * @returns {Promise<any>}
 */
export async function couponShopPick(id) {
    return await dajxHttp.post({
        url: '/api/shop-coupon/pick',
        data: {
            id: id,
            code: '',
        }
    });
}

/**
 * @desc 获取用户默认地址
 * @returns {Promise<any>}
 */
export async function getDefaultAddress() {
    return await dajxHttp.post({
        url: '/api/address/default',
        data: {}
    });
}

/**
 * @desc 获取我的优惠券
 * @returns {Promise<any>}
 */
export async function couponList() {
    return await dajxHttp.post({
        url: '/api/coupon/myself',
        data: {}
    });
}

/**
 * @desc 获取分享邀请码
 * @param phone 电话号码
 * @returns {Promise<any>}
 */
export async function codeInvitation(phone) {
    return await dajxHttp.post({
        url: '/api/user/invite',
        data: {
            phone: phone
        }
    });
}

/**
 * @desc 服务下单
 * @param serviceID 服务商品ID
 * @param addressID 用户地址ID
 * @param appointment 预约时间(时间戳)
 * @param hours 下单服务小时数
 * @param staff_num 订单服务人数
 * @param staff_ids 选择的服务人员IDs
 * @param remarks 用户备注
 * @param coupon 优惠卷编码(注意:有子码的优惠券只能使用子码)
 * @param is_wx_mini 是否为微信小程序下单 默认 0 = 不是 1 = 是
 * @param pid 默认为空字符串 父级id(套餐订单ID)
 * @param serviceSpec 服务规格
 * @param specAmount 规格金额（单位元）
 * @returns {Promise<any>}
 */
export async function serviceCashier(serviceID, addressID, appointment, hours, staff_num, staff_ids = '',
               serviceSpec = null, specAmount = null, remarks = '', coupon = null, is_wx_mini = 1, pid = '') {
    let params;
    if (coupon) {
        params = {
            serviceID: serviceID,
            addressID: addressID,
            appointment: appointment,
            hours: hours,
            staff_num: staff_num,
            remarks: remarks,
            coupon: coupon,
            is_wx_mini: is_wx_mini,
            serviceSpec: serviceSpec,
            specAmount: specAmount,
        };
    } else {
        params = {
            serviceID: serviceID,
            addressID: addressID,
            appointment: appointment,
            hours: hours,
            staff_num: staff_num,
            remarks: remarks,
            is_wx_mini: is_wx_mini,
            serviceSpec: serviceSpec,
            specAmount: specAmount,
        };
    }

    if (pid !== '') {
        params.pid = pid;
    }
    params.staff_ids = staff_ids;

    return await dajxHttp.post({
        url: '/api/service/cashier',
        data: params
    });
}

/**
 * @desc 微信付款
 * @param orderID 订单编号(不是订单ID,是订单编号)
 * @param type 	支付类型 默认1 = app支付 2 = 小程序支付
 * @returns {Promise<any>}
 */
export async function wxpay(orderID, type = 2) {
    return await dajxHttp.post({
        url: '/api/pay/wx',
        data: {
            orderID: orderID,
            type: type,
        }
    });
}

/**
 * @desc 检查订单是否已免单
 * @param orderID 订单编号
 * @returns {Promise<any>}
 */
export async function chekOrderFree(orderID) {
    return await dajxHttp.post({
        url: '/api/order/check-order-is-free',
        data: {
            order_id: orderID
        }
    });
}

/**
 * @desc 添加新服务地址接口
 * @param name
 * @param adCode
 * @param desc
 * @param doorplate 门牌号信息
 * @param tel
 * @param province
 * @param city
 * @param area
 * @param lng
 * @param lat
 * @returns {Promise<any>}
 */
export async function addAddress(name, adCode, desc, doorplate, tel, province, city, area, lng, lat) {
    return await dajxHttp.post({
        url: '/api/address/set',
        data: {
            name: name,
            adCode: adCode,
            desc: desc,
            doorplate: doorplate,
            tel: tel,
            province: province,
            city: city,
            area: area,
            lng: lng,
            lat: lat
        }
    });
}

/**
 * @desc 设置页面提交用户修改完成的数据
 * @name /api/user/updateinfo
 * @method POST
 * @param {Object} params
 */
/**
 * @desc 设置页面提交用户修改完成的数据
 * @param birthday
 * @param nickname
 * @param phone
 * @param sex
 * @param pic
 * @returns {Promise<any>}
 */
export async function updateUserData(birthday,nickname,phone,sex,pic) {
    let params = {info:{}};
    if (sex) {
        params.info.sex = parseInt(sex);
    }
    if (birthday) {
        params.info.birthday = birthday;
    }
    if (nickname) {
        params.info.nickname = nickname;
    }
    if (phone) {
        params.info.phone = phone;
    }
    if (pic) {
        params.info.pic = pic;
    }
    return await dajxHttp.post({
        url: '/api/user/updateinfo',
        data: params
    });
}

/**
 * @desc 获取订单列表
 * @param type  0-全部 1-待付款 2-服务中 3-已完成 4-已取消
 * @param page 页数
 * @param pageSize 页数偏移量（一页显示几个）
 * @returns {Promise<any>}
 * @constructor
 */
export async function OrderList(type, page, pageSize) {
    return await dajxHttp.post({
        url: '/api/order/list',
        data: {
            type: type,
            page: page,
            pageSize: pageSize,
        }
    });
}

/**
 * 个人中心修改用户头像
 * @param val bate64
 * @returns {Promise<any>}
 */
export async function updateUserImg(val) {
    return await dajxHttp.post({
        url: '/api/upload/image',
        data: {file_base64:{"0":val}}
    });
}

/**
 * @desc 取消订单
 * @param orderID 订单编号
 * @returns {Promise<any>}
 * @constructor
 */
export async function OrderCancel(orderID) {
    return await dajxHttp.post({
        url: '/api/order/cancel',
        data: {
            orderID: orderID,
        }
    });
}

/**
 * @desc 退款申请
 * @param orderID 订单编号
 * @param remarks 备注内容
 * @returns {Promise<any>}
 * @constructor
 */
export async function OrderRefund(orderID, remarks, reason) {
    return await dajxHttp.post({
        url: '/api/refund/index',
        data: {
            orderID: orderID,
            remarks: remarks,
            reason: reason,
        }
    });
}

/**
 * @desc 订单详情
 * @param orderID 订单编号
 * @returns {Promise<any>}
 * @constructor
 */
export async function OrderInfo(orderID) {
    return await dajxHttp.post({
        url: '/api/order/info',
        data: {orderID: orderID}
    });
}

/**
 * @desc 修改预约时间
 * @param orderID 订单编号
 * @param appointment_time 修改的时间戳
 * @returns {Promise<any>}
 */
export async function updateAppointmentTime(orderID, appointment_time) {
    return await dajxHttp.post({
        url: '/api/order/appointment',
        data: {
            orderID: orderID,
            appointment_time: appointment_time,
        }
    });
}

/**
 * @desc 获取消息中心数据
 * @param page 当前页数
 * @param pageSize 页数偏移量
 * @returns {Promise<any>}
 */
export async function getMessagesData(page, pageSize) {
    return await dajxHttp.post({
        url: '/api/message/text',
        data: {page: page, pageSize: pageSize}
    });
}

/**
 * @desc 获取消息中心的通知数据
 * @param page 当前页数
 * @param pageSize 页数偏移量
 * @returns {Promise<any>}
 */
export async function getNotifyData(page, pageSize) {
    return await dajxHttp.post({
        url: '/api/message/notify',
        data: {page: page, pageSize: pageSize}
    });
}

/**
 * @desc 获取最近帮我服务人员的列表
 * @param page 分页页码 默认1
 * @param pageSize 分页显示数据条数 默认10
 * @param hours 预约小时数
 * @param appointment 预约时间(时间戳)
 * @returns {Promise<any>}
 */
export async function getLatelyProviderService(page, pageSize, hours, appointment) {
    return await dajxHttp.post({
        url: '/api/order/history-order-staff',
        data: {
            page: page,
            pageSize: pageSize,
            hours: hours,
            appointment: appointment
        }
    });
}

/**
 * @desc 获取订单选择预约服务人员的列表
 * @param page
 * @param pageSize
 * @param hours
 * @param appointment
 * @param order_address
 * @returns {Promise<any>}
 */
export async function providersServiceOther(page, pageSize, hours, appointment, order_address) {
    return await dajxHttp.post({
        url: '/api/order/staff-list',
        data: {
            page: page,
            pageSize: pageSize,
            hours: hours,
            appointment: appointment,
            order_address: order_address
        }
    });
}

/**
 * @desc 消息已读接口请求
 * @param mid 消息ID
 * @returns {Promise<any>}
 */
export async function messageRead(mid) {
    return await dajxHttp.post({
        url: '/api/message/read',
        data: {mid: mid}
    });
}

/**
 * @desc 补单页聚合数据接口
 * @param orderID 订单ID
 * @returns {Promise<any>}
 */
export async function subOrder(orderID) {
    return await dajxHttp.post({
        url: '/api/order/sub-order-aggregate-data',
        data: {
            order_id: orderID
        }
    });
}

/**
 * @desc 用户删除地址
 * @param id 地址ID
 * @returns {Promise<any>}
 */
export async function deleteAddress(id) {
    return await dajxHttp.post({
        url: '/api/address/del',
        data: {
            id: id
        }
    });
}

/**
 * @desc 补单下单
 * @param order_id 	订单ID
 * @param staff_ids 选择补时的服务人员ID,多个使用英文逗号","分隔
 * @param spec_template_id 补时模板ID
 * @param pay_amount 实际付款金额(人民币：分)
 * @param pay_type 支付类型 1:支付宝 2:微信 3:微信小程序
 * @returns {Promise<any>}
 * @constructor
 */
export async function PayOrderSpec(order_id, staff_ids, spec_template_id, pay_amount, pay_type = 3) {
    return await dajxHttp.post({
        url: '/api/order/sub-order-pay',
        data: {
            order_id: order_id,
            pay_type: pay_type,
            staff_ids: staff_ids,
            spec_template_id: spec_template_id,
            pay_amount: pay_amount,
        }
    });
}

/**
 * @desc 获取指定服务的评论列表
 * @param sid 服务ID
 * @param page 分页页码（非必传，默认1）
 * @param pageSize 分页每页数量条数（非必传，默认10）
 * @returns {Promise<any>}
 */
export async function getOrderCommentList(sid,page,pageSize) {
    return await dajxHttp.post({
        url: '/api/service/service-comment-list',
        data: {
            sid: sid,
            page: page,
            pageSize: pageSize,
        }
    });
}

/**
 * @desc 获取指定套餐的评论列表
 * @param id
 * @param page
 * @param pageSize
 * @returns {Promise<void>}
 */
export async function getOrderComboCommentList(id,page,pageSize) {
    return await dajxHttp.post({
        url: '/api/combo/combo-comment-list',
        data: {
            id: id,
            page: page,
            pageSize: pageSize,
        }
    });
}

/**
 * @desc 获取首页促销服务列表
 * @param adCode 城市代码(默认全国)
 * @returns {Promise<any>}
 */
export async function getServicePromotion(adCode) {
    let params = {};
    if (adCode) {
        params = {adCode: adCode};
    }
    return await dajxHttp.post({
        url: '/api/home/service-promotion-list',
        data: params
    });
}

/**
 * @desc 修改用户地址
 * @param id 地址ID
 * @param name 名称
 * @param adCode 城市ID
 * @param desc 详情描述
 * @param doorplate 门牌号信息
 * @param tel 电话号码
 * @param province 省
 * @param city 城市
 * @param area 区
 * @param lng 经度
 * @param lat 纬度
 * @param is_default 是否默认 0 否 1 是
 * @returns {Promise<any>}
 */
export async function editAddress(id, name, adCode, desc, doorplate, tel, province, city, area, lng, lat, is_default) {
    return await dajxHttp.post({
        url: '/api/address/edit',
        data: {
            id: id,
            name: name,
            adCode: adCode,
            desc: desc,
            doorplate: doorplate,
            tel: tel,
            province: province,
            city: city,
            area: area,
            lng: lng,
            lat: lat,
            is_default: is_default,
        }
    });
}

/**
 * 获取开通的城市
 * @returns {Promise<any>}
 */
export async function getHotCity() {
    return await dajxHttp.post({
        url: '/api/home/city',
        data: {}
    });
}
/**
 * 获取热门城市
 * @returns {Promise<any>}
 */
export async function getHotCity2() {
    const token = uni.getStorageSync('token');
    return await dajxHttp.post({
        url: '/api/home/hot-city',
        data: {
            token,
        }
    });
}

/**
 * 获取员工信息
 * @param staffID 员工ID
 * @returns {Promise<any>}
 */
export async function getStaffInfo(staffID) {
    return await dajxHttp.post({
        url: '/api/staff/home',
        data: {
            sid: staffID,
        }
    });
}

/**
 * @desc 不知道哪冒出来的方法接口 @fixme
 * @param parma
 * @returns {Promise<any>}
 */
export async function loginVerify(parma) {
    return await dajxHttp.get({
        url: '/api/user/login',
        data: parma,
    })
}

/**
 * @desc 获取首页方格+菜单
 * @returns {Promise<any>}
 */
export async function menuSquare() {
    return await dajxHttp.post({
        url: '/api/menu/app_square',
        data: {}
    })
}

/**
 * @desc 获取首页服务推荐
 * @param adCode
 * @returns {Promise<any>}
 */
export async function getService(adCode) {
    return await dajxHttp.post({
        url: '/api/home/service',
        data: {
            adCode: adCode
        }
    })
}

/**
 * @desc 发送验证码
 * @param phone
 * @param scenariors 场景
 *  register 注册场景
 *  login 验证码登录场景
 *  forget 忘记密码场景
 *  beadhouse 康养中心托管申请场景
 *  beadhouseMan 康养中心申请入住场景
 *  volunteer 志愿者申请场景
 *  rescue 慈善捐助
 *  verify_tel 验证原有手机
 *  update_tel 修改手机号
 *  update_pass 修改密码
 * @returns {Promise<any>}
 */
export async function telForCode(phone, scenariors) {
    return await dajxHttp.post({
        url: '/api/code/get',
        data: {
            phone: phone,
            scenariors: scenariors
        }
    })
}

/**
 * @desc 用户登录 - 验证码登录
 * @param phone 手机号
 * @param verifyCode 短信验证码
 * @param invite_code 邀请码
 * @param cid 个推设备唯一ID
 * @param cityCode 城市code 默认0：全国
 * @returns {Promise<any>}
 */
export async function telByCodeGetToken(phone,verifyCode,invite_code = null,cid = null,cityCode = null) {
    let params = {};
    if (invite_code) {
        params.invite_code = invite_code;
    }
    if (cid) {
        params.cid = cid;
    }
    if (cityCode) {
        params.cityCode = cityCode;
    }
    params.phone = phone;
    params.verifyCode = verifyCode;

    return await dajxHttp.post({
        url: '/api/user/loginbycode',
        data: params
    });
}

/**
 * @desc 套餐详情页聚合数据
 * @param id 套餐ID
 * @returns {Promise<any>}
 */
export async function getComboInfo(id) {
    return await dajxHttp.post({
        url: '/api/combo/info',
        data: {
            id: id
        }
    });
}

/**
 *
 * @param id
 */
export async function comboCashier(id) {
    return await dajxHttp.post({
        url: '/api/combo/create-combo-order',
        data: {
            id: id
        }
    });
}


/**
 * @desc 获取默认服务规格及价格
 * @param service_id 服务id
 * @returns {Promise<any>}
 */
export async function getServiceDefaultSpec(service_id) {
    return await dajxHttp.post({
        url: '/api/service/get-service-default-spec',
        data: {
            service_id: service_id
        }
    });
}

/**
 * @desc 客户端获取服务规格
 * @param service_id 服务id
 * @param spec  规格
 * @param option 操作 +1获取后一个规格 -1获取前一个规格
 * @returns {Promise<any>}
 */
export async function serviceServiceSpec(service_id, spec, option) {
    return await dajxHttp.post({
        url: '/api/service/service-spec',
        data: {
            service_id: service_id,
            spec: spec,
            option: option
        }
    });
}

/**
 * @desc 获取指定套餐的评论列表
 * @param id 套餐ID
 * @returns {Promise<any>}
 */
export async function comboCommentList(id) {
    return await dajxHttp.post({
        url: '/api/combo/combo-comment-list',
        data: {
            id: id
        }
    });
}

/**
 * @desc 扫码进入小程序登录状态绑定邀请码
 * @param code 邀请码，用户扫码进入小程序后，如果是已经登录的状态需要调用该接口进行绑定
 * @returns {Promise<any>}
 */
export async function userBindQR(code) {
    return await dajxHttp.post({
        url: '/api/user/user-bind-qrcode',
        data: {
            invite_code: code,
        }
    });
}

/**
 * @desc 进入小程序后扫描次数+1
 * @param code 邀请码，前端需要判断，只能请求一次
 * @returns {Promise<any>}
 */
export async function miniScanSum(code) {
    return await dajxHttp.post({
        url: '/api/user/mini-scan-sum',
        data: {
            invite_code: code,
        }
    });
}

/**
 * @desc 获取虚拟号
 * @param orderNum
 * @param userTel
 * @param staffTel
 * @returns {Promise<any>}
 */
export async function getBingTel(orderNum, userTel, staffTel) {
    return await dajxHttp.post({
        url: '/api/virtual-phone/get-bind-phone',
        data: {
            order_id: orderNum,
            user_phone: userTel,
            staff_phone: staffTel,
        }
    });
}

/**
 * @desc 获取商品类型
 * @param page
 * @param pageSize
 * @returns {Promise<any>}
 */
export async function getCategoryList(page, pageSize) {
    return await dajxHttp.post({
        url: '/api/product-category/list',
        data: {
            page,
            pageSize,
        }
    });
}
/**
 * @desc 获取商品类型
 * @param id
 * @returns {Promise<any>}
 */
export async function getClassifyConsult(id) {
    return await dajxHttp.post({
        url: '/api/classify/consult',
        data: {
            id,
        }
    });
}
/**
 * @desc 获取康养中心数据
 * @param adCode
 * @param page
 * @param pageSize
 * @returns {Promise<any>}
 */
export async function getBeadhouse(adCode, page, pageSize) {
    return await dajxHttp.post({
        url: '/api/beadhouse/list',
        data: {
            adCode,
            page,
            pageSize
        }
    });
}

/**
 * @desc 服务订单评价
 * @param orderId 订单id
 * @param number 分数 0-10分
 * @param desc 评论内容
 * @param image <file_key: string, url: string> [] 图片对象
 * @param pid 父级评论id 默认为0
 * @returns {Promise<any>}
 */
export async function orderEvaluate(orderID, number, desc, image, pid = 0) {
    return await dajxHttp.post({
        url: '/api/order/evaluate',
        data: {
          orderID,
          number,
          desc,
          image,
          pid
        }
    });
}

/**
 * @desc 获取预约时间加价配置
 * @returns {Promise<any>}
 */
export async function getAppointmentTimeConfig() {
    return await dajxHttp.post({
        url: '/api/order/appointment-time-config',
        data: {}
    });
}

/**
 * @desc 操作服务评价对我有用的添加与取消 && 操作服务评价举报的添加与取消
 * @param id 评价id
 * @param type 操作类型 1：添加 2：取消
 * @param order_evaluation_extend_type 类型 1：对我有用 2：举报
 * @returns {Promise<any>}
 */
export async function optionServiceComment(id, type, order_evaluation_extend_type) {
    return await dajxHttp.post({
        url: '/api/service/service-comment',
        data: {
           id,
           type,
           order_evaluation_extend_type,
        }
    });
}

/**
 * @desc 获取指定评论的子评论列表
 * @param id 评论id
 * @param page 操作类型 1：添加 2：取消
 * @param pageSize 类型 1：对我有用 2：举报
 * @returns {Promise<any>}
 */
export async function getSubCommentList(id, page, pageSize) {
    return await dajxHttp.post({
        url: '/api/service/sub-comment-list',
        data: {
           id,
            page,
            pageSize,
        }
    });
}
/**
 * @desc 获取指定评论的子评论列表
 * @param orderID 订单id
 * @returns {Promise<any>}
 */
export async function getOrderComment(orderID) {
    return await dajxHttp.post({
        url: '/api/order/getcomment',
        data: {
            orderID,
        }
    });
}
/**
 * @desc 视频列表
 * @param page
 * @param pageSize
 * @param modelID
 * @returns {Promise<any>}
 */
export async function getVideoList(page, pageSize, modelID) {
    return await dajxHttp.post({
        url: '/api/video/list',
        data: {
            page,
            pageSize,
            modelID,
        }
    });
}
/**
 * @desc 文章列表
 * @param page
 * @param pageSize
 * @param modelID
 * @returns {Promise<any>}
 */
export async function getArticleList(page, pageSize, modelID) {
    return await dajxHttp.post({
        url: '/api/article/list',
        data: {
            page,
            pageSize,
            modelID,
        }
    });
}
/**
 * @desc 文章详情
 * @param aid
 * @returns {Promise<any>}
 */
export async function getArticleDetail(aid) {
    return await dajxHttp.post({
        url: '/api/article/info',
        data: {
            aid,
        }
    });
}
/**
 * @desc 文章喜欢
 * @param aid
 * @returns {Promise<any>}
 */
export async function articleLove(aid) {
    return await dajxHttp.post({
        url: '/api/article/love',
        data: {
            aid,
        }
    });
}
/**
 * @desc 文章收藏
 * @param aid
 * @returns {Promise<any>}
 */
export async function articleCollect(aid) {
    return await dajxHttp.post({
        url: '/api/article/collect',
        data: {
            aid,
        }
    });
}
/**
 * @desc 文章关注
 * @param userID
 * @returns {Promise<any>}
 */
export async function articleFollow(userID) {
    return await dajxHttp.post({
        url: '/api/user/follow',
        data: {
            userID,
        }
    });
}
/**
 * @desc 视频详情
 * @param vid
 * @param page
 * @param pageSize
 * @returns {Promise<any>}
 */
export async function getVideoInfo(vid, page, pageSize) {
    return await dajxHttp.post({
        url: '/api/video/info',
        data: {
            vid,
            page,
            pageSize,
        }
    });
}
/**
 * @desc 视频评论列表
 * @param page
 * @param pageSize
 * @param vid
 * @returns {Promise<any>}
 */
export async function getVideoComments(page, pageSize, vid) {
    return await dajxHttp.post({
        url: '/api/video/commentlist',
        data: {
            page,
            pageSize,
            vid,
        }
    });
}
/**
 * @desc 视频评论提交
 * @param vid
 * @param cid
 * @param rootID
 * @param content
 * @returns {Promise<any>}
 */
export async function videoCommentSend(vid, cid, rootID, content) {
    return await dajxHttp.post({
        url: '/api/video/commentsend',
        data: {
            vid,
            cid,
            rootID,
            content,
        }
    });
}
/**
 * @desc 视频喜欢
 * @param vid
 * @returns {Promise<any>}
 */
export async function videoLove(vid) {
    return await dajxHttp.post({
        url: '/api/video/love',
        data: {
            vid,
        }
    });
}

/**
 * @desc 活动列表
 * @param page
 * @param pageSize
 * @param modelID
 * @param adCode
 * @returns {Promise<any>}
 */
export async function getActiveList(page, pageSize, modelID, adCode) {
    return await dajxHttp.post({
        url: '/api/active/list',
        data: {
            page,
            pageSize,
            modelID,
            adCode,
        }
    });
}
/**
 * @desc 详情
 * @param aid
 * @returns {Promise<any>}
 */
export async function getActiveDetail(aid) {
    return await dajxHttp.post({
        url: '/api/active/info',
        data: {
            aid,
        }
    });
}

/**
 * @desc 活动报名提交
 * @param id
 * @returns {Promise<any>}
 */
export async function joinActive(id, name, participants, phone, remark, pay_type = '2' ) {
    return await dajxHttp.post({
        url: '/api/active/pay',
        data: {
            id,
            name,
            participants,
            phone,
            remark,
            pay_type,
        }
    });
}
/**
 * @desc 注销
 * @returns {Promise<any>}
 */
export async function logOff( ) {
    return await dajxHttp.post({
        url: '/api/user/close-account',
        data: {}
    });
}

/**
 * @desc 修改活动报名信息
 * @returns {Promise<any>}
 */
export async function editInfo(order_id, name, phone, remark) {
    return await dajxHttp.post({
        url: '/api/active/edit-info',
        data: {
            order_id,
            name,
            phone,
            remark,
        }
    });
}
/**
 * @desc 获取签到弹框配置
 * @returns {Promise<any>}
 */
export async function getSignPopInfo() {
    return await dajxHttp.post({
        url: '/api/sign-in/pop-info',
        data: {}
    });
}
/**
 * @desc 获取签到日历数据
 * @params
 *    date 精确到月份 如2021-08
 * @returns {Promise<any>}
 */
export async function getSingInCalenda(date) {
    return await dajxHttp.post({
        url: '/api/sign-in/sign-in-calendar',
        data: {date}
    });
}
/**
 * @desc 任务中心聚合页面聚合数据
 * @returns {Promise<any>}
 */
export async function getUserSignInData() {
    return await dajxHttp.post({
        url: '/api/sign-in/user-sign-in-data',
        data: {}
    });
}

/**
 * @desc 签到
 * @returns {Promise<any>}
 */
export async function signIn() {
    return await dajxHttp.post({
        url: '/api/sign-in/sign-in',
        data: {}
    });
}
/**
 * @desc 获取用户金币信息
 * @returns {Promise<any>}
 */
export async function getUserIntegral() {
    return await dajxHttp.post({
        url: '/api/sign-in/user-integral',
        data: {}
    });
}
/**
 * @desc 获取积分数据明细
 * @params
 *   date 日期，需至少精确到月份 如2021-08, 不传此参数时，不过滤时间
 * @returns {Promise<any>}
 */
export async function getUserIntegralLog(date, page = 1, page_size = 10) {
    return await dajxHttp.post({
        url: '/api/sign-in/user-integral-log',
        data: {date,page,page_size}
    });
}

/**
 * @desc 记录用户弹窗时间
 * @params
 * @returns {Promise<any>}
 */
export async function signPopLog() {
    return await dajxHttp.post({
        url: '/api/sign-in/pop-log',
        data: {}
    });
}

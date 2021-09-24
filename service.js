/**
 * @auth zhc
 * @description 全局共用方法函数
 * **/
import {cityCode} from "./utils/cityCode";
import {getServiceInfo} from "./api";

 /**
 * @desc 获取url的参数
 * @param url
 * @returns {{}}
 */
// 获得当前URL参数
const getUrlParams = function (url) {
    let tmpArr = [];
    const params = {};
    const urlArr = url.split('?');
    if (urlArr.length > 1) {
        tmpArr = urlArr[1].split('#')[0].split('&');
    }
    if (tmpArr.length > 0 && tmpArr[0] !== '') {
        tmpArr.forEach((item) => {
            const tmp = item.split('=');
            params[tmp[0]] = tmp[1];
        });
    }
    return params;
}

//获取当前定位
const getCityName = function () {
        uni.getLocation({
            type: 'gcj02',
            success: function (res) {
                console.log(res)
                return res
            }
        });
    }

//遍历数组
const mapArr = function (val) {
    val.map((item) => {
        if (item.check == true) {
            item.check = false
        }
        return val
    })
}
//拨打电话方法api
const dialPhone = function (phone) {
    uni.makePhoneCall({
        phoneNumber: phone
    })
}


//定位授权方法
const getLieAuth = function () {
    // #ifdef MP-WEIXIN
    uni.getSetting({
        success(res) {
            // console.log(res)
            if (!res.authSetting['scope.userLocation']) {
                // 未授权
                uni.authorize({
                    scope: 'scope.userLocation',
                    success() { //1.1 允许授权
                        uni.getLocation()
                    },
                    fail() {    //1.2 拒绝授权
                        console.log("你拒绝了授权，无法获得周边信息")
                    }
                })
            } else {
                // 已授权 ..(获取位置信息)
            }
        }
    });
    // #endif
}


//监听应用所处网络环境
const getNetwork = function () {
    uni.getNetworkType({
        success: function (res) {
            console.log(res)
            if (res.networkType == 'none') {
                uni.showToast({
                    title: '网络连接失败',
                    icon: 'none',
                    duration: 3000
                })
                return
            }
            if (res.networkType == '2g' || res.networkType == '3g') {
                uni.showToast({
                    title: '网络连接失败',
                    icon: 'none',
                    duration: 3000
                })
                return
            }
        }
    })
}

//存储token
const setToken = function (val, tokenName = 'token') {
    uni.setStorage({
        key: tokenName,
        data: val,
        success: function () {
            console.log('success');
        }
    });
}

// 时间戳处理
const showTime = function (timestamp, spread='/') {
    console.log('timestamp', timestamp);
    let stamp = parseInt(timestamp) * 1000, date, Y, M, D, h, m, s;
    date = new Date(stamp);
    Y = date.getFullYear() + spread;
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + spread;
    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return (Y + M + D + h + m + s);
}

// 日期显示
const showDateMD = function (timestamp) {
    let stamp = parseInt(timestamp) * 1000, date, M, D;
    date = new Date(stamp);
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    return (M + D);
}

// 时间显示
const showDateHI = function (timestamp) {
    let stamp = parseInt(timestamp) * 1000, date, h, m;
    date = new Date(stamp);
    h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    return (h + m);
}
const TIME_TYPE = {
  SECOND: 'second',
  MILLI_SECOND: 'millisecond'
};
const DATE_FORMAT = {
  YYYYMMDD: 'YYYY-MM-DD',
  YYYYMM: 'YYYY-MM',
};

// 时间戳处理 年月日
const showDate = function (timestamp, type = TIME_TYPE.SECOND, spread='.', format = DATE_FORMAT.YYYYMMDD ) {
    let stamp, date, Y, M, D;
    stamp = type === TIME_TYPE.SECOND ? parseInt(timestamp) * 1000 :　parseInt(timestamp);
    date = new Date(stamp);
    Y = date.getFullYear();
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    const YMD = [Y,M,D];
    let result;
    switch(format) {
      case 'YYYYMMDD': 
        result = YMD.join(spread);
        break;
     case 'YYYYMM': 
       result = YMD.slice(0, 2).join(spread);
       break;
     default: 
       result = YMD.join(spread);
       break;
    }
    return result;
}

// 订单状态规划显示状态
const showOrderStatus = function (orderStatus, payStatus, allotStatus) {
    // 4 5 10
    // 1
    // 9
    // 6 7
    // 8
    if (orderStatus === 0) return {status: 2, msg: '订单已取消'};
    if (payStatus === 0) return {status: 1, msg: '等待付款'};
    if (payStatus === 2) return {status: 4, msg: '退款中'};
    if (payStatus === 3) return {status: 10, msg: '退款被拒绝'};
    if (payStatus === 4) return {status: 5, msg: '已退款'};
    if (payStatus === 1 && allotStatus === 0) return {status: 6, msg: '等待派单'};
    if (payStatus === 1 && allotStatus === 1) return {status: 7, msg: '已派单，等待接单'};
    if (payStatus === 1 && allotStatus === 2) return {status: 8, msg: '服务完成'};
    if (payStatus === 1 && allotStatus === 4) return {status: 9, msg: '服务人员已接单'};
    if (payStatus === 1 && allotStatus === 5) return {status: 9, msg: '服务人员已到达'};
    if (payStatus === 1 && allotStatus === 6) return {status: 9, msg: '服务中'};
    return {};
}

const getCityCode = function (city) {
    cityCode.forEach(function(i,k){
        i.cities.forEach(function(n,m){
            if (n.city === city) {
                uni.setStorageSync('cityCode', n);
                return n;
            }
        })
    })
}

const gotoServiceInfo = function (obj,callBack) {
    let payload = obj.payload;
    if (payload.type === 1) {
        let res = getServiceInfo(obj.payload.id);
        // 服务详情存储vuex 然后跳转
        res.then(function(e){
            // console.log(e);
            callBack(e.data.data.info);
            uni.navigateTo({
                url: '/pages/detailsProduct/detailsProduct'
            });
        });
    } else if (payload.type === 2) {
        try {
            uni.setStorageSync('active-tab', payload.id);
        } catch (e) {
            console.log(e)
        }
        return uni.switchTab({
            url: '/pages/service/service'
        });
    } else if (payload.type === 32) {
        uni.setStorageSync('activeChooseId', payload.id);
        return uni.navigateTo({
            url: `/pages/whyChoose/index?id=${payload.id}`
        });
    } else {
        // return uni.showToast({
        //     title: '暂无服务',
        //     icon: 'none',
        //     duration: 3000
        // });
    }
}
const setPrePageUrl = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage.route;
  let urlWithArgs = url;
  const options = currentPage.options;
  if (options){
    urlWithArgs += '?';
    for (let key in options) {
      const value = options[key];
      urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);
  }
  uni.setStorageSync('loginReturnUrl', `/${urlWithArgs}`)
};

export {
    TIME_TYPE,
    getCityName,
    mapArr,
    dialPhone,
    getLieAuth,
    getNetwork,
    setToken,
    showTime,
    showOrderStatus,
	showDate,
    getCityCode,
    gotoServiceInfo,
    getUrlParams,
    showDateMD,
    showDateHI,
    setPrePageUrl,
}

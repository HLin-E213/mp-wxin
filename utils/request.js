//引入共用地址
import {baseUrl} from './config.js';
import {setPrePageUrl} from '@/service';

//封装请求
const dajxAjax = (param) => {
    let method = param.method,
        url = param.url,
        data = param.data || {},
        header = {},
        dataType = param.dataType,
        responseType = param.responseType;
    //请求方式:GET或POST(POST需配置header: {'content-type' : "application/x-www-form-urlencoded"},)
    if (method) {
        method = method.toUpperCase();//小写改为大写
        if (method === "POST") {
            header = {'content-type': "application/x-www-form-urlencoded", 'session_id': token};
        } else {
            header = {'content-type': "application/json", 'session_id': token};
        }
    } else {
        method = "GET";
        header = {'content-type': "application/json", 'session_id': token};
    }
    //返回一个promise对象
    return new Promise((resolve, reject) => {
        uni.request({
            method: method,
            url: baseUrl + url,
            data: data,
            header: header,
            dataType: dataType,
            responseType: responseType,
            success: function (res) {
                //接口返回结果，可根据前后端定义code来进行处理业务逻辑
                if (res) {
                    console.log(res)
                    resolve(res)
                }
            },
            fail: function (err) {
                reject(err)
            }
        })
    })
}

const core = (url, method, data, header, dataType, responseType) => {
  //当小程序访问时不需要使用devserver代理，需要处理接口上的/api
  // #ifdef MP-WEIXIN
  url = url.replace('/api', '');
  // #endif
  //返回一个promise对象
  return new Promise((resolve, reject) => {
    uni.request({
      method: method,
      // #ifdef MP-WEIXIN
      url: baseUrl + url,			//小程序访问路径
      // #endif
      // #ifdef H5
      url: url,						//h5访问路径
      // #endif
      data: data,
      header: header,
      dataType: dataType,
      responseType: responseType,
      success: function (res) {
        return resolve(res);
      },
      fail: function (err) {
        return reject(err);
      },
    })
  });
};

// api/staffapi 公用
const apiCommon = async (param, tokenName) => {
  let url = param.url;
  let header = {'content-type': "application/json", ...param.header};
  let obj = {
    "appVersion": "1.0.0",
    "clientTime": 0,
    // #ifdef MP-WEIXIN
    "system": "mp-weixin",
    // #endif
    // #ifdef H5
    "system": "h5",
    // #endif
  }
  let token = uni.getStorageSync(tokenName);
  if (token) {
    Object.assign(obj, {token: token})
  }
  let data = Object.assign(obj, {data: param.data});

  return core(url, "POST", data, header).then((res) => {
    if (res.data.code !== 1) {
      uni.showToast({
        title: res.data.message,
        duration: 2000,
        icon: 'none',
        mask: true,
      });
      return Promise.reject(res);
    }
    return res;
  });
};

//封装请求
const dajxHttp = {
  // for test only
  cms: async (param) => {
    let header = {'content-type': "application/x-www-form-urlencoded"};
    let info = await core('/cmsapi/index.php?s=/token', "POST", {}, header);
    param.data.__token__ = info.data;
    header = {...header, ...param.header};
    return core(param.url, "POST", param.data, header);
  },

  // for test only
  postRaw: (param) => {
    let url = param.url;
    let header = {'content-type': "application/json", ...param.header};
    return core(param.url, "POST", param.data, header);
  },

  // for test only
  postStaff: (param) => {
    return apiCommon(param, 'tokenStaff').catch((res) => {
      // 跳转登录
      if (res.data.code === 100003) {
        uni.showToast({
          title: "员工未登录",
          duration: 2000,
          icon: 'none',
          mask: true,
        });
      }
      return Promise.reject(res);
    });
  },

  post: (param) => {
    return apiCommon(param, 'token').catch((res) => {
      // 跳转登录
      if (res.data.code === 100003) {
        setPrePageUrl();
        uni.navigateTo({
          url: '/pages/login/index'
        });
      }
      return Promise.reject(res);
    });
  },
    get: (param) => { // TODO: 提取
        let obj = {
            "appVersion": "1.0.0",
            "clientTime": 0,
            "system": "mp-weixin",
        }
        token = uni.getStorageSync('token');
        if (token) {
            Object.assign(obj, {token: token})
        }
        let objs = Object.assign(obj, {data: param.data});
        let method = 'GET',
            url = param.url,
            data = param.data || {},
            header = {'content-type': "application/x-www-form-urlencoded"},
            dataType = param.dataType,
            responseType = param.responseType;
        //返回一个promise对象
        return new Promise((resolve, reject) => {
            uni.request({
                method: method,
                // #ifdef MP-WEIXIN
                url: baseUrl + url,			//小程序访问路径
                // #endif
                // #ifdef H5
                url: url,						//h5访问路径
                // #endif
                data: data,
                header: header,
                dataType: dataType,
                responseType: responseType,
                success: function (res) {
                    //接口返回结果，可根据前后端定义code来进行处理业务逻辑
                    resolve(res)
                    if (res.data.code == 9999) {
                        wx.showToast({
                            title: '服务器异常',
                            icon: 'loading',
                            duration: 2000
                        })
                        //进入主页
                        return
                    }
                    // if(res.data.code == 10000){
                    //   console.log(res)
                    // }
                },
                fail: function (err) {
                    return reject(err)
                }
            })
        })
    },
    put: (param) => { // TODO: 提取
        let obj = {
            "appVersion": "1.0.0",
            "clientTime": 0,
            "system": "mp-weixin",
            // "token":
        }
        token = uni.getStorageSync('token');
        if (token) {
            Object.assign(obj, {token: token})
        }
        let objs = Object.assign(obj, {data: param.data});
        let method = 'PUT',
            url = param.url,
            data = param.data || {},
            header = {'content-type': "application/json"},
            dataType = param.dataType,
            responseType = param.responseType;
        //返回一个promise对象
        return new Promise((resolve, reject) => {
            uni.request({
                method: method,
                // #ifdef MP-WEIXIN
                url: baseUrl + url,			//小程序访问路径
                // #endif
                // #ifdef H5
                url: url,						//h5访问路径
                // #endif
                data: data,
                header: header,
                dataType: dataType,
                responseType: responseType,
                success: function (res) {
                    //接口返回结果，可根据前后端定义code来进行处理业务逻辑
                    resolve(res)
                    if (res.data.code == 9999) {
                        wx.showToast({
                            title: '服务器异常',
                            icon: 'loading',
                            duration: 2000
                        })
                        //进入主页
                        return
                    }
                    // if(res.data.code == 10000){
                    //   console.log(res)
                    // }
                },
                fail: function (err) {
                    return reject(err)
                }
            })
        })
    }
}

//微信支付接口 // TODO: 无用？
const wxPayments = (params) => {
    var timeStamp = params.timeStamp,
        nonceStr = params.nonceStr,
        prepay_id = params.prepay_id,
        paySign = params.paySign;
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: prepay_id,
            signType: 'MD5',
            paySign: paySign,
            success(res) {
                console.log(res)
                resolve(res)
            },
            fail(err) {
                console.log(err)
                reject(err)
            }
        })
    })
}

export {
    dajxAjax,
    dajxHttp,
    wxPayments,
}

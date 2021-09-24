<!--地图求救页面-->
<template>
  <view class="map_content">
    <view class="head">
      <view class="head_left">
        <image src="https://admin.dajxyl.com/oss?path=img/guanbi-2@2x.png" mode=""></image>
      </view>
      <view class="head_center">
        SOS紧急求助信息
      </view>
      <view class="head_right"></view>
    </view>
    <view class="content" id="container"></view>
    <view class="content_top">
      <view class="content_left">
        <image src="https://admin.dajxyl.com/oss?path=img/yunyanlao@2x.png" mode=""></image>
      </view>
      <view class="content_center">
        大爱金孝App-大爱金孝
      </view>
      <view class="content_right">
        <button type="primary" @click="openApp">打开看看</button>
      </view>
    </view>
    <view class="bottom_content">
      <view class="help_info">
        <view class="first_col" @click="getPhone">
          <h4>求助者信息:</h4>
          <p>{{ help_name }}</p>
          <image src="https://admin.dajxyl.com/oss?path=img/phone.png" mode=""></image>
          <span>{{ help_phone }}</span>
        </view>
        <view class="second_col">
          <h4>求助位置信息:</h4>
          <p>{{ help_address }}</p>
        </view>
      </view>
      <view class="btn">
        <button type="primary" @click="openHight">打开地图 查看路线</button>
      </view>
      <view class="phone" @click="getPublic">
        <p>如需帮助请拨打：<span>{{ phones }}</span></p>
      </view>
    </view>
  </view>
</template>
<script>
// import AMapLoader from '@amap/amap-jsapi-loader';
import AMapLoader from '../../lib/amap-wx.js';
import { CONTACT_TEL } from "@/config/constant";

export default {
  data() {
    return {
      arr: [104.0745, 30.5535],
      map: null,
      help_name: '',
      help_phone: '',
      help_address: '',
      phones: CONTACT_TEL,
      city: '',
    }
  },
  created() {
    this.getInfo();
  },
  onLoad() {
    // this.getInfo();
  },
  methods: {
    getInfo() {
      this.arr = null;
      uni.request({
        method: 'POST',
        url: '/api/user/sos-get', //仅为示例，并非真实接口地址。
        data: {
          "appVersion": "1.0.0",
          "clientTime": 0,
          "system": "mp-weixin",
          "data": {
            "id": 1
          }
        },
        success: (res) => {
          console.log(res);
          if (res.data.code == 1) {
            this.help_name = res.data.data.info.name;
            this.help_phone = res.data.data.info.tel;
            let langlat = [];
            langlat.push(res.data.data.info.lng - 0);
            langlat.push(res.data.data.info.lat - 0)
            this.arr = langlat;
            let that = this;
            AMapLoader.load({
              "key": "37702dd19ec36aaaca2aa3885a3a0dd5", // 申请好的Web端开发者Key，首次调用 load 时必填
              "version": "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
              "plugins": [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
              "AMapUI": { // 是否加载 AMapUI，缺省不加载
                "version": '1.1', // AMapUI 缺省 1.1
                "plugins": [], // 需要加载的 AMapUI ui插件
              },
              "Loca": { // 是否加载 Loca， 缺省不加载
                "version": '1.3.2' // Loca 版本，缺省 1.3.2
              },
            }).then((AMap) => {
              var map = new AMap.Map('container', {
                resizeEnable: true,
                zoom: 11,
                center: that.arr
              });
              let icon = new AMap.Icon({
                size: new AMap.Size(52, 52), // 图标尺寸
                image: 'https://admin.dajxyl.com/oss?path=img/sos@2x.png', // Icon的图像
                imageSize: new AMap.Size(40, 40), // 根据所设置的大小拉伸或压缩图片
              })
              // 构造点标记4.125rem
              var marker = new AMap.Marker({
                icon: icon,
                position: that.arr
              });
              marker.setIcon(icon)
              map.add(marker);
              AMap.plugin('AMap.Geocoder', function () {
                var geocoder = new AMap.Geocoder({
                  // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                  city: '010'
                })
                // var lnglat = [104.0745,30.5535]
                geocoder.getAddress(langlat, function (status, result) {
                  if (status === 'complete' && result.info === 'OK') {
                    // result为对应的地理位置详细信息
                    console.log(result)
                    that.help_address = result.regeocode.formattedAddress;
                    // that.city = result.regeocode.addressComponent.city;
                    that.city = result.regeocode.formattedAddress;
                  }
                })
              })
              // console.log(111)
            }).catch(e => {
              console.log(e);
            })
          }
        },
        fail: (err) => {
          console.log(err)
        }
      });
    },
    /*点击打开高德地图*/
    openHight() {
      // console.log(this.arr[0])
      window.location.href = "http://uri.amap.com/marker?position=" + this.arr[0] + "," + this.arr[1] + "&name=" + this.city + "&coordinate=gaode" + "&callnative=1"
    },
    /*点击拨打求助者电话*/
    getPhone() {
      // console.log(11)
      uni.makePhoneCall({
        phoneNumber: this.help_phone
      })
    },
    /*点击拨打400电话*/
    getPublic() {
      uni.makePhoneCall({
        phoneNumber: this.phones
      })
    },
    /*打开看看点击事件*/
    openApp() {
      //打开app
      let u = navigator.userAgent;
      let isWeixin = u.toLowerCase().indexOf('micromessenger') !== -1; // 微信内
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // 微信内
      if (isWeixin) {
        alert('请在浏览器上打开')
      } else {
        //android端
        if (isAndroid) {
          // console.log(111)
          //安卓app的scheme协议
          window.location.href = 'dajx://dajx/openwith';
          // plus.runtime.openURL('dajx://dajx/openwith');		//只支持移动内置浏览器
          setTimeout(function () {
            let hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
            console.log(hidden)
            if ((typeof hidden == "undefined") || hidden == false) {
              // console.log(555)
              window.location.href = "http://dev.api.dajxyl.com/download/index";
            }
          }, 3000);
        }
        //ios端
        if (isiOS) {
          console.log(222)
          //ios的scheme协议
          window.location.href = 'dajx-deepLinking://'
          // plus.runtime.openURL( 'dajx-deepLinking://' );
          setTimeout(function () {
            // console.log(333)
            let hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
            if ((typeof hidden == "undefined") || hidden == false) {
              // console.log(444)
              //App store下载地址
              window.location.href = "http://dev.api.dajxyl.com/download/index";
            }
          }, 3000);
        }
      }
    },
  },
}
</script>
<style lang="less">
@item: {
  width: 30%;
  height: 100%;
  display: flex;
  align-items: center;
}

@content_item: {
  width: 13%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map_content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  .head {
    width: 94%;
    height: 2.28rem;
    display: flex;
    align-items: center;

    .head_left {
      @item();
      align-items: center;

      image {
        width: 0.815rem;
        height: 0.815rem;
      }
    }

    .head_center {
      @item();
      width: 60%;
      font-size: 0.94rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
    }

    .head_right {
      // @item();
    }
  }

  #container {
    width: 100%;
    // min-height: 11.25rem;
    min-height: 30rem;
  }

  .content_top {
    position: absolute;
    margin-top: 2.3rem;
    width: 100%;
    height: 3.75rem;
    background: #333333;
    opacity: 0.9;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .content_left {
      @content_item();

      image {
        width: 2.125rem;
        height: 2.125rem;
      }
    }

    .content_center {
      @content_item();
      width: 58%;
      justify-content: flex-start;
      // font-size:1.125rem;
      font-size: 0.95rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
      // line-height:4rem;
    }

    .content_right {
      @content_item();
      width: 25%;
      justify-content: flex-start;

      button {
        width: 4.905rem;
        height: 1.94rem;
        border-radius: 1rem;
        display: flex;
        justify-content: center;
        // font-size:0.875rem;
        font-size: 0.8rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  .bottom_content {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 14.5rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0rem 0rem 0.5rem 0rem rgba(136, 136, 136, 0.2);
    border-radius: 1.5rem;
    background: #FFFFFF;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    .help_info {
      width: 90%;
      // height: 3.06rem;
      height: 3.8rem;
      margin-top: 1.655rem;

      .first_col {
        width: 100%;
        height: 0.905rem;
        // height: 1.2rem;
        display: flex;
        flex-wrap: nowrap;
        // align-items: center;
        h4 {
          // width:4.97rem;
          width: 35%;
          height: 0.905rem;
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }

        p {
          // width:2.53rem;
          width: 20%;
          height: 0.815rem;
          font-size: 0.875rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }

        image {
          width: 0.97rem;
          height: 0.97rem;
          margin-top: 0.15rem;
        }

        span {
          width: 5.72rem;
          height: 0.69rem;
          font-size: 0.875rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: #fd7600;
        }
      }

      .second_col {
        width: 100%;
        height: 2.095rem;
        display: flex;
        flex-wrap: wrap;
        margin-top: 1.25rem;

        h4 {
          // width:5.905rem;
          width: 35%;
          height: 0.905rem;
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
        }

        p {
          // width:13.25rem;
          width: 65%;
          height: 2.095rem;
          font-size: 0.875rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 1.22rem;
        }
      }
    }

    .btn {
      width: 90%;
      height: 3.815rem;
      margin-top: 1.78rem;
      // background: #4CD964;
      button {
        width: 100%;
        height: 2.875rem;
        background: #fd7600;
        border-radius: 1.5rem;
        font-size: 1.125rem;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
      }
    }

    .phone {
      width: 90%;
      height: 2.97rem;
      display: flex;
      justify-content: center;
      // background: red;
      p {
        // width:6.375rem;
        height: 0.875rem;
        font-size: 0.875rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }

      span {
        // width:6.28rem;
        height: 0.69rem;
        font-size: 0.875rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(64, 149, 247, 1);
      }
    }
  }
}
</style>

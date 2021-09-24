<template>
  <view class="content">
    <!-- <view class="biglove-login-top" :style="{background: 'url('+item.imgLoginBackground+')'}"> -->
    <view class="biglove-login-top">
      <image class="getCodeBg" src="https://admin.dajxyl.com/oss?path=img/login_background_origin.png" mode=""></image>
      <view type="primary" class="biglove-goback" @tap="goback">
        <image
            style="width: 18px; height: 18px;"
            :mode="item.fanhui"
            :src="item.fanhui"
            @error="imageError"
        />
      </view>
      <view class="biglove-h1 biglove-login-font">登录</view>
    </view>
    <view class="biglove-span-font">欢迎来到大爱金孝</view>
    <view class="biglove-form-item biglove-column">
      <view class="biglove-phone-title">+86</view>
      <input class="biglove-phone-input" type="number" focus maxlength="11" placeholder=" "
             v-model="tel"/>
    </view>
    <view class="biglove-item">
      <button class="biglove-login-button" type="primary" @tap="apiGetCode">获取验证码</button>
    </view>
    <view class="biglove-small-font biglove-item font-color-grey">未注册手机验证码后自动完成注册</view>
    <view class="biglove-user-agreement">
      <!-- <radio-group name="radio" @change="isLook">
        <label>
          <radio class="agreement-radio" value="true" />
          <view>我已阅读并同意<a>《用户协议》</a><a>《法律申明及用户隐私》</a></view>
        </label>
      </radio-group> -->
      <!-- <radio class="agreement-radio" value="true" name="radio" @click="isLook"/> -->
      <image @click="agreementLaw" :src="imgUrl" mode=""></image>
      <p>我已阅读并同意<span>《用户协议》</span><span>《法律申明及用户隐私》</span></p>
    </view>
  </view>
</template>

<script>
import {telForCode} from '../../../api/index.js';

export default {
  data() {
    return {
      item: {
        'imgLoginBackground': 'https://admin.dajxyl.com/oss?path=img/login_background_origin.png',
        'fanhui': 'https://admin.dajxyl.com/oss?path=img/fanhui.png',
      },
      tel: '',
      is_look: false,
      imgUrl: 'https://admin.dajxyl.com/oss?path=img/unSelection@2x.png',
    }
  },
  computed: {},
  methods: {
    agreementLaw: function () {
      this.is_look = !this.is_look;
      if (this.is_look) {
        this.imgUrl = 'https://admin.dajxyl.com/oss?path=img/selectionPhone@2x_origin.png';
      }
      if (!this.is_look) {
        this.imgUrl = 'https://admin.dajxyl.com/oss?path=img/unSelection@2x.png';
      }
    },
    goback: function (e) {
      uni.navigateTo({
        url: '/pages/login/index',
      });
    },
    isLook: function () {
      // this.is_look = e.detail.value;
      this.is_look = !this.is_look;
    },
    apiGetCode: async function (e) {
      // 验证参数
      let tel = this.tel;
      let is_look = this.is_look;
      if (!is_look) {
        return uni.showToast({
          title: '请勾选用户协议',
          duration: 2000,
          icon: 'none',
          mask: true,
        });
      }
      if (tel == '') {
        return uni.showToast({
          title: '电话号码为空！',
          duration: 2000,
          icon: 'none',
          mask: true,
        });
      }
      if (tel.length < 11) {
        return uni.showToast({
          title: '电话号码不合法！',
          duration: 2000,
          icon: 'none',
          mask: true,
        });
      }
      // console.log(tel,is_look);
      /*获取手机验证码*/
      let that = this;

      let res = await telForCode(
        tel,
        "login"
      );

      if (res.data.code != 1) {
        return uni.showToast({
          title: res.data.message,
          duration: 2000,
          icon: 'none',
          mask: true,
        });
      }

      uni.showToast({
        title: '发送成功！',
        duration: 2000
      });

      // tel 带入下个页面，如果有code也带入下个页面。
      let getCodeForTel = {};
      if (res.data.data.verifyCode.code && res.data.data.verifyCode.code.length == 4) {
        getCodeForTel = {'tel': tel, 'code': res.data.data.verifyCode.code};
      } else {
        getCodeForTel = {'tel': tel};
      }

      uni.setStorage({
        key: 'getCodeForTel',
        data: getCodeForTel,
        success: function () {
          uni.navigateTo({
            url: '/pages/login/phone/code'
          });
        }
      });
    }
  }
}
</script>

<style>
.content {
  width: 100%;
}

.biglove-h1 {
  font-size: 1.8rem;
}

.biglove-login-font {
  padding-top: 3.8rem;
  padding-left: 1rem;
}

.biglove-span-font {
  font-size: 1rem;
  color: #656565;
  padding-left: 1rem;
}

.biglove-small-font {
  text-align: center;
  font-size: 0.8rem;
}

.biglove-login-top {
  height: 8rem;
  width: 100%;
}

.getCodeBg {
  width: 100%;
  height: 8.125rem;
  position: absolute;
}

.biglove-goback {
  margin: 2.2rem 0.4rem 0.4rem 0.4rem;
}

.biglove-form-item {
  margin-top: 3rem;
  margin-left: 1.2rem;
  margin-right: 1.2rem;
}

.biglove-column {
  padding-bottom: 1rem;
  border-bottom: rgba(153, 153, 153, 0.1) 0.1rem solid;
}

.biglove-column > view {
  float: left;
  font-size: 1.6rem;
}

.biglove-phone-title {
  padding-right: 0.8rem;
}

.biglove-phone-input {
  padding-left: 1rem;
  padding-top: 0.2rem;
  font-size: 1.2rem;
}

.biglove-phone-input:before {
  content: '';
  position: absolute;
  left: 25%;
  height: 3.8%;
  width: 0.04rem;
  background-color: rgba(0, 0, 0, 0.2);
}

.biglove-login-button {
  margin-top: 2rem;
  margin-left: 1rem;
  margin-right: 1rem;
  border-radius: 30px;
  background: #fd7600;
}

.biglove-item {
  margin-top: 0.5rem;
}

.font-color-grey {
  color: #656565;
}

.biglove-user-agreement {
  width: 100%;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
}

/* .biglove-user-agreement-left{
  height: 100%;
  display: flex;
} */
.biglove-user-agreement image {
  width: 0.965rem;
  height: 0.965rem;
}

.biglove-user-agreement p {
  font-size: 0.75rem;
  color: #656565;
  margin-left: 0.315rem;
}

.biglove-user-agreement a {
  font-size: 0.75rem;
  color: #656565;
}

/* .biglove-user-agreement-right{
  font-size: 0.815rem;
} */
.agreement-radio {
  padding-left: 0.01px;
  width: 0.565rem;
  height: 0.565rem;
}
</style>

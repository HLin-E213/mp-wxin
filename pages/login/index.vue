<template>
  <view class="login">
	<uni-nav-bar status-bar :title="title"></uni-nav-bar>
	<view class="loginContent">
		<view class="biglove-content">
		  <view class="biglove-logo">
		    <image
		        :mode="item.imgLogo"
		        src="https://admin.dajxyl.com/oss?path=video/upload/202108/dajxy-logo.png"
		        @error="imageError"
		    />
		  </view>
		  <view class="biglove-image-title">
		    <image src="https://admin.dajxyl.com/oss?path=img/logo_text@2x_origin.png" mode=""></image>
		  </view>
		</view>
		<view class="biglove-login">
		  <!-- #ifdef MP-WEIXIN -->
		  <button type="primary" style="color: #fd7600;border: 1px solid #fd7600;" plain="true" v-if="is_look"
		          open-type="getPhoneNumber"
		          @getphonenumber="getPhoneNumber">微信登录
		  </button>
      <button type="primary" style="color: #fd7600;border: 1px solid #fd7600;" plain="true" v-else
              >微信登录
      </button>
		  <!-- #endif -->
		  <!-- #ifdef H5 -->
		  <button type="primary" style="margin-top: 0.75rem;" @tap="bindLoginForApi">手机号码登录/注册</button>
		  <!-- #endif -->
		</view>
    <view class="biglove-user-agreement">
      <image @click="agreementLaw" :src="imgUrl" mode=""></image>
      <p><span @click="agreementLaw">我已阅读并同意</span><span style="color: #fd7600;" @click="xieyi">《用户协议及隐私协议》</span></p>
    </view>
	</view>

  </view>
</template>

<script>
import {wxLogin, wxTel} from "../../api";
import {setToken} from '../../service.js';
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';

export default {
  components: {
    uniNavBar,
  },
  data() {
    return {
      item: {
        'title': '大爱金孝云养老',
        'imgLogo': 'https://admin.dajxyl.com/oss?path=img/logo_origin.png',
      },
      title: '登录',
      is_look: false,
      imgUrl: 'https://admin.dajxyl.com/oss?path=img/unSelection@2x.png',
    }
  },
  onLoad() {
    // 获取微信用户信息，若未授权跳转授权页面
    // #ifdef MP-WEIXIN
    const value = uni.getStorageSync('wx_info');
    console.log(value);
    if (!value) {
      return uni.redirectTo({
        url: '/pages/loginAuthorized/loginAuthorized'
      });
    }
    // #endif
  },
  onShow() {
    // #ifdef MP-WEIXIN
    const value = uni.getStorageSync('wx_info');
    console.log(value);
    if (!value) {
      return uni.redirectTo({
        url: '/pages/loginAuthorized/loginAuthorized'
      });
    }
    // #endif
  },
  computed:{
	  ...mapState(['codeInvitation']),
  },
  methods: {
    imageError: function (e) {
      console.error('image发生error事件，携带值为' + e.detail.errMsg)
    },
    bindLoginForApi: function (e) {
      uni.navigateTo({
        url: '/pages/login/phone/index',
      });
    },
    agreementLaw: function () {
      this.is_look = !this.is_look;
      if (this.is_look) {
        this.imgUrl = 'https://admin.dajxyl.com/oss?path=img/selectionPhone@2x_origin.png';
      }
      if (!this.is_look) {
        this.imgUrl = 'https://admin.dajxyl.com/oss?path=img/unSelection@2x.png';
      }
    },
    xieyi: function (){
       return uni.navigateTo({
          url: '/pages/documentsLegal/documentsLegal'
        })
    },
    getPhoneNumber: function (e) {
		let that = this;
      let wx_info = uni.getStorageSync('wx_info');
      let wx_tel = e.detail, session_key, code, openid;

      // 点击拒绝处理逻辑
      if (e.detail.errMsg !== "getPhoneNumber:ok") {
        return false;
      }

      if (!this.is_look) {
        return uni.showToast({
          title: '请点击同意',
          icon: 'none',
          duration: 3000
        })
      }

      uni.login({
        provider: 'weixin',
        success: function (loginRes) {
          const login_invite_code = uni.getStorageSync('login_invite_code');
          uni.getUserInfo({
            provider: 'weixin',
            success: function (infoRes) {
              let ret_code = wxLogin(
                  loginRes.code,
                  wx_info.userInfo.nickName,
                  wx_info.userInfo.avatarUrl,
                  infoRes.signature,
                  infoRes.encryptedData,
                  infoRes.iv,
                  login_invite_code
              )
              ret_code.then(function (ret) {
                session_key = ret.data.data.info.session_key;
                openid = ret.data.data.info.openid;

                uni.setStorage({
                  key: 'wx_code',
                  data: loginRes.code,
                  success: function () {
                    code = loginRes.code;
                  }
                });

                uni.removeStorageSync('login_invite_code');
                if (ret.data.data.info.token != '') {
                  setToken(ret.data.data.info.token);
                  // 跳转到首页
                  const prePage = uni.getStorageSync('loginReturnUrl');
                  uni.removeStorageSync('loginReturnUrl');
                  return uni.reLaunch({
                    url: prePage || '/pages/main/main'
                  });
                }

                let token = wxTel(
                    openid,
                    session_key,
                    wx_tel.encryptedData,
                    wx_tel.iv,
                    that.codeInvitation,
                );

                token.then(function (ret) {
                  setToken(ret.data.data.info.token);
                  // 跳转到首页
                  const prePage = uni.getStorageSync('loginReturnUrl');
                  uni.removeStorageSync('loginReturnUrl');
                  return uni.reLaunch({
                    url: prePage || '/pages/main/main'
                  });
                });

              })
            }
          });

        }
      });

    }
  }
}
</script>

<style lang="less">
	@import url('@/common/common.less');
.login {
  width: 100%;
  height: 100%;
  background: @white;
}
.status_bar {
        width: 100%;
        background: @white;
        position: relative;
    }
	.heda{
			position: absolute;
			margin: auto;
			bottom:15px;
			left:0;
			right:0;
			text-align: center;
			height: 24px;
	    }
.loginContent{
	width: 100%;
}
.biglove-content {
  width: 100%;
}

.biglove-logo {
	padding-top: 197upx;
	@flex-center();
	width: 100%;
}

.biglove-logo image {
  width: 112upx;
  height: 112upx;
}

.biglove-image-title {
	padding-top: 28upx;
	@flex-center();
	width: 100%;
}

.biglove-image-title image {
  width: 209upx;
  height: 34upx;
}

.biglove-login {
	padding-top: 263upx;
	width: 100%;
	@flex-center();
}

.biglove-login button {
  width: 650upx;
  height: 90upx;
  font-size: 30upx;
  border-radius: 45upx;
  background: #fd7600;
  line-height: 90upx;
}
.biglove-user-agreement{
  width: 90%;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9rem;
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
}
.biglove-user-agreement image{
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
}
</style>

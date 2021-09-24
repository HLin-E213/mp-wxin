<!--授权登录-->
<template>
  <view class="loginAuthorized">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="loginAuthorized_content">
    	<view class="loginAuthorized_top">
    	  <p>小程序需要</p>
    	</view>
    	<view class="loginAuthorized_bottom">
    	  <image src="https://admin.dajxyl.com/oss?path=img/autg_bg@2x_origin.png" mode=""></image>
    	  <view class="loginAuthorized_bottom_top">
    	    <view class="auth-text">您的授权</view>
    	    <view class="auth-info">获取微信头像及名称</view>
    	  </view>
    	</view>
		<view class="loginAuthorized_bottom_bottom">
		  <button type="primary" :disabled=loading @click="getUserInfo">授权</button>

		</view>
    <view class="loginAuthorized_bottom_bottom_cancel">
      <button type="primary" @click="goBack">取消</button>
    </view>
    </view>
  </view>
</template>

<script>
import {wxLogin} from '../../api/index.js'
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';

export default {
  components: {
    uniNavBar
  },
  data() {
    return {
      title: '授权登录',
      loading: false,
    }
  },
  onLoad(){
    const value = uni.getStorageSync('wx_info');
    if (value) {
      return uni.redirectTo({
        url: '/pages/login/index'
      });
    }
	},
  onShow(){
    const value = uni.getStorageSync('wx_info');
    if (value) {
      return uni.redirectTo({
        url: '/pages/login/index'
      });
    }
  },
  methods: {
    getUserInfo: function () {
      const vm = this;
      let code, info, Res;
      vm.loading = true;
      uni.login({
        provider: 'weixin',
        success: function (loginRes) {
          uni.setStorage({
            key: 'wx_code',
            data: loginRes.code,
            success: function () {
              code = loginRes.code;
              Res = loginRes;
            }
          });
        },
      });
      uni.getUserProfile({
        lang: 'zh_CN',
        desc: '登录',
        success(infoRes) {
          uni.setStorage({
            key: 'wx_info',
            data: infoRes,
            success: function () {
              uni.getUserInfo({
                provider: 'weixin',
                success(userInfoData) {
                  info = infoRes;
                  // 请求接口
                  let res = wxLogin(
                      code,
                      info.userInfo.nickName,
                      info.userInfo.avatarUrl,
                      userInfoData.signature,
                      userInfoData.encryptedData,
                      userInfoData.iv
                  );

                  res.then(function (value) {
                    uni.setStorage({
                      key: 'wx_openid',
                      data: value.data.data.info.openid,
                      success: function () {
                        return uni.redirectTo({
                          url: '/pages/login/index',
                        });
                      },
											fail() {
                        vm.loading = false;
											}
                    });
                  }).finally(() => {
                    vm.loading = false;
									});
                },
                fail() {
                  vm.loading = false;
                },
              })
            },
            fail() {
              vm.loading = false;
            },
          });
        },
        fail() {
          vm.loading = false;
        },
      })
    },
    goBack(){
      return uni.navigateBack({
        delta:1
      });
    },
  }
}
</script>

<style lang="less">
	@import url('@/common/common.less');
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loginAuthorized {
  width: 100%;
  height: 100%;
  background: @white;
.status_bar {
        width: 100%;
        background: @white;
        position: relative;
		height: 88upx;
		.heda{
			position: absolute;
			margin: auto;
			bottom:15px;
			left:0;
			right:0;
			text-align: center;
			height: 24px;
		    }
    }
	.loginAuthorized_content{
		width: 100%;
		.loginAuthorized_top {
		  padding-top: 281upx;
		  @item();
		    background: @white;
		  p {
		    font-size: 36upx;
		    font-family: PingFang SC;
		    color: @sub-text-color;
		  }
		}

		.loginAuthorized_bottom {
			position: relative;
			padding-top: 21upx;
			height: 538upx;
			width: 100%;
			color: @main-text-color;
			image {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
		  .loginAuthorized_bottom_top {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 100%;
		   .auth-text{
			   padding-top: 45upx;
			   font-size: 62upx;;
		   }
		   .auth-info{
			   padding-top: 66upx;
			   font-size: 36upx;
			   color: @main-text-color;
		   }
		    }
		  }
		}
		.loginAuthorized_bottom_bottom {
		  width: 100%;
		  @item();
		  button {
		    width: 650upx;
		    height: 90upx;
		    border-radius: 45upx;
		    background: @bg-blue;
		    font-size: 30upx;
		    color: @white;
		    @item();
		  }
		}
    .loginAuthorized_bottom_bottom_cancel {
      margin-top: 30upx;
      width: 100%;
      @item();
      button {
        width: 650upx;
        height: 90upx;
        border-radius: 45upx;
        border: 1px solid @bg-blue;
        background: @white;
        font-size: 30upx;
        color: @bg-blue;
        @item();
      }
    }
	}
</style>

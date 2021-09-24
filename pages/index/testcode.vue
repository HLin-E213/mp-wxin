<template>
  <view class="contnet">
    <view style="margin-top: 220rpx">
      <button @click="getCode">获取code</button>
      <button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信登录
      </button>
      <view @click="copy1" style="margin-top: 25rpx;">
        {{code}}
      </view>
      <view @click="copy2" style="margin-top: 45rpx;width: 100px;word-break: normal;">
        {{encryptedData}}
      </view>
      <view @click="copy3" style="margin-top: 65rpx;">
        {{iv}}
      </view>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {
      code: '',
      encryptedData: '',
      iv: '',
    }
  },
  methods: {
    getCode: function () {
      let that = this;
      uni.login({
        provider: 'weixin',
        success: function (loginRes) {
          console.log(loginRes);
          that.code = loginRes.code;
        }
      });
    },
    getPhoneNumber: function (){
      let that = this;
      uni.getUserInfo({
        provider: 'weixin',
        success: function (loginRes) {
          console.log(loginRes);
          that.iv = loginRes.iv;
          that.encryptedData = loginRes.encryptedData;
        }
      });
    },
    copy1: function () {
      uni.setClipboardData({
        data: this.code,
        success: function () {
          console.log('success');
        }
      })
    },
    copy2: function () {
      uni.setClipboardData({
        data: this.encryptedData,
        success: function () {
          console.log('success');
        }
      })
    },
    copy3: function () {
      uni.setClipboardData({
        data: this.iv,
        success: function () {
          console.log('success');
        }
      })
    },
  }
}
</script>

<style>
.contnet {
  margin-top: 2rem;
  text-align: center;
  width: 100%;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.active {
  background: #fd7522;
  border: 1px solid #fd7522;
  color: #fff;
}

.item {
  background-color: #DDDDDD;
  margin-top: 0.2rem;
  padding: 0.2rem;
}

.small {
  font-size: 0.5rem;
}

.left {
  float: left;
}
</style>

<template>
  <view class="content">
    <view class="biglove-login-top" :style="{background: 'url('+item.imgLoginBackground+')'}">
      <view type="primary" class="biglove-goback" @tap="goback">
        <image style="width: 18px; height: 18px;"
               :mode="item.fanhui"
               :src="item.fanhui"
               @error="imageError"/>
      </view>
      <view class="biglove-h1 biglove-login-font">输入短信验证码</view>
    </view>
    <view class="biglove-span-font">短信验证码已经发送至{{ showTel }}</view>
    <view class="biglove-form-item biglove-column">
      <input class="biglove-phone-input" type="number" focus maxlength="1" placeholder=" "
             v-model="code" @input="getToken"/>
      <input class="biglove-phone-input" type="number" focus maxlength="1" placeholder=" "
             v-model="code2" @input="getToken"/>
      <input class="biglove-phone-input" type="number" focus maxlength="1" placeholder=" "
             v-model="code3" @input="getToken"/>
      <input class="biglove-phone-input" type="number" focus maxlength="1" placeholder=" "
             v-model="code4" @input="getToken"/>
    </view>
    <view class="biglove-item biglove-resend-code">
      <view v-if="codeDisabled !== true" class="biglove-second">{{ second }}
        <text>秒后重新发送</text>
      </view>
      <view v-else class="biglove-second" @tap="getCode()">重新发送</view>
    </view>
  </view>
</template>

<script>
import {telForCode, telByCodeGetToken} from '../../../api/index.js';
import {setToken} from '../../../service.js';
import {mapState, mapMutations} from 'vuex';

const TIME_COUNT = 60;
export default {
  data() {
    return {
      item: {
        'imgLoginBackground': 'https://admin.dajxyl.com/oss?path=img/login_background_origin.png',
        'fanhui': 'https://admin.dajxyl.com/oss?path=img/fanhui.png',
      },
      tel: '',
      code: '',
      code2: '',
      code3: '',
      code4: '',
      second: TIME_COUNT,
      // 定时器
      timer: null,
      // 是否禁用按钮
      codeDisabled: false,
    }
  },
  mounted() {
    // 获取发送的手机号码 处理为*号
    let tel, code;
    try {
      const value = uni.getStorageSync('getCodeForTel');
      if (value.tel) {
        this.tel = value.tel;
      }
      if (value.code) {
        this.code = value.code.slice(0, 1);
        this.code2 = value.code.slice(1, 2);
        this.code3 = value.code.slice(2, 3);
        this.code4 = value.code.slice(3, 4);
      }
    } catch (e) {
      console.log(e);
    }
    // 短信倒计时
    this.timer = setInterval(() => {
      if (this.second > 0 && this.second <= TIME_COUNT) {
        this.second--;
      } else {
        clearInterval(this.timer);
        this.timer = null;
        this.codeDisabled = true;
      }
    }, 1000);

    // 短信验证码 如果填写 直接提交跳转登录
    if (this.telCode.length == 4) {
      let res = this.getToken();
    }
  },
  computed: {
    ...mapState(['codeInvitation']),
    telCode: function () {
      return this.code + this.code2 + this.code3 + this.code4;
    },
    showTel: function () {
      const value = uni.getStorageSync('getCodeForTel');
      return value.tel.substr(0, 3) + '****' + value.tel.substr(7, 11);
    }
  },
  methods: {
    goback: function (e) {
      uni.navigateTo({
        url: '/pages/login/phone/index',
      });
    },
    getCode: async function (e) {
      let that = this;

      let res = await telForCode({
        phone: this.tel,
        scenariors: "login"
      });

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
      if (res.data.data.verifyCode.code) {
        getCodeForTel = {'tel': tel, 'code': res.data.data.verifyCode.code};
      } else {
        getCodeForTel = {'tel': tel};
      }

      // 短信倒计时
      this.codeDisabled = false;
      this.second = TIME_COUNT;
      this.timer = setInterval(() => {
        if (this.second > 0 && this.second <= TIME_COUNT) {
          this.second--;
        } else {
          clearInterval(this.timer);
          this.timer = null;
          this.codeDisabled = true;
        }
      }, 1000);
    },
    getToken: async function (e) {
      let that = this;

      if (this.tel == '' || this.tel.length < 11) {
        return uni.showToast({
          title: '手机号码不合法，请返回上一个页面！',
          duration: 2000,
          icon: 'none',
          mask: true,
        });
      }

      if (this.telCode.length != 4) {
        return false;
      }

      let obj = {
        phone: that.tel,
        verifyCode: that.telCode,
      },res;

      if (this.codeInvitation !== '') {
        Object.assign(obj, {invite_code: this.codeInvitation});
        res = await telByCodeGetToken(obj.phone,obj.verifyCode,obj.invite_code);
      } else {
        res = await telByCodeGetToken(obj.phone,obj.verifyCode);
      }

      console.log(res);
      setToken(res.data.data.token)
      // 跳转到首页
      return uni.reLaunch({
        url: '/pages/main/main'
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
  height: 9rem;
  width: 100%;
}

.biglove-goback {
  margin: 2.2rem 0.4rem 0.4rem 0.4rem;
}

.biglove-column {
  width: 100%;
  height: 2rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 1rem;
  margin-top: 2rem;
}

.biglove-column > view {
  float: left;
  font-size: 1.6rem;
}

.biglove-phone-title {
  padding-right: 0.8rem;
}

.biglove-phone-input {
  width: 15%;
  height: 3rem;
  /* padding-left: 1rem; */
  /* padding-top: 2.5rem; */
  font-size: 1.2rem;
  text-align: center;
  letter-spacing: 1.8rem;
  border-bottom: rgba(153, 153, 153, 0.1) 0.1rem solid;
}

.biglove-resend-code {
  margin-top: 1.565rem;
  margin-left: 0.5rem;
}

.biglove-second > text {
  color: #000;
  margin-left: 0.4rem;
}

.biglove-second {
  display: inline;
  margin-right: 0.2rem;
  color: #fd7600;
}
</style>

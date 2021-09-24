<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="webviewUrl"></web-view>
  </view>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
import {codeInvitation, getUserInfo} from "../../api";

export default {
  name: "webView",
  computed: {
    ...mapState(['h5']),
    ...mapState('users', {
      'userInfo':'userInfo'
    }),
      webviewUrl() {
        return this.h5 || this.webUrl;
      }
  },
  onLoad(options) {
    // 有token就更新用户数据
    const token = uni.getStorageSync('token');
    this.webUrl = decodeURIComponent(`${options.url}?from=share`) || '';
    if (token) {
      this.getUserInfo();
    }
  },
  data() {
    return {
      title: '',
      webUrl:'',
      webviewStyles: {
        progress: {
          color: '#FF3333'
        }
      }
    }
  },
  methods: {
    ...mapMutations('users', {
      'setUserInfoData': 'setUserInfoData',
    }),
    /*存储用户信息*/
    getUserInfo: async function () {
      let res = await getUserInfo(),that = this;
      // console.log(res);
      return that.setUserInfoData(res.data.data.info);
    },
    onShareAppMessage: async function() {
      let code;
      if (this.userInfo.phone) {
        let res = await codeInvitation(this.userInfo.phone);
        code = res.data.data.info.code;
      } else {
        code = '';
      }
      console.log(code);
      return {
        title: '大爱金孝',
        path: `/pages/main/webView?code=${code}&url=${encodeURIComponent(this.h5)}`,
        success: (data) => {
          console.log(data)
        }
      }
    },
    onShareTimeline: async function(){
      let code;
      if (this.userInfo.phone) {
        let res = await codeInvitation(this.userInfo.phone);
        code = res.data.data.info.code;
      } else {
        code = '';
      }
      console.log(code);
      return {
        title: '大爱金孝',
        path: `/pages/main/webView?code=${code}&url=${encodeURIComponent(this.h5)}`,
        success: (data) => {
          console.log(data)
        }
      }
    }
  },
}
</script>

<style scoped>

</style>

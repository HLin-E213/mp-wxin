<script>
import {mapState, mapMutations} from 'vuex';
import {getLieAuth, getNetwork} from './service.js';
import {codeInvitation, getUserInfo} from 'api/index.js';
import { ISIPX, ISNOTCHSCREEN } from './config/constant';

export default {
    globalData: {
        isNotchScreen: ISNOTCHSCREEN,
        isIPX: ISIPX,
    },
    onLaunch: function () {
    console.log('App Launch');
    // getLieAuth();
    // getNetwork();
    // this.getUserInfo();
  },
  computed: {
    ...mapState(['codeInvitation'])
  },
  onShow: function () {
    console.log('App Show');
  },
  onHide: function () {
    console.log('App Hide');
  },
  methods: {
    ...mapMutations(['setCode']),
    ...mapMutations('users', {
      'setUserInfoData': 'setUserInfoData',
    }),
    getUserInfo: function () {
      let that = this;
      let res = getUserInfo();
      res.then(function (e) {
        that.setUserInfoData(e.data.data.info);
        uni.setStorage({
          key: 'userData',
          data: e.data.data.info,
          success: function () {
          }
        });
      });
    },
    getCode: function () {
      let that = this;
      let userInfo = uni.getStorageSync('userData');
      if (userInfo.phone) {
        let res = codeInvitation(userInfo.phone);
        res.then(function (e) {
          console.log(e);
          that.setCode(e.data.data.info.code);
        });
      }
    },
  }
}
</script>

<style lang="less">
/* 头条小程序需要把 iconfont 样式放到组件外 */
/* @import "components/m-icon/m-icon.css"; */
/*每个页面公共css */
/* page {
  margin: 0;
  padding: 0;
  min-height: 100%;
  display: flex;
  font-size: 16px;
  background: #EFEFF4;
} */
@media screen and (min-width: 320px) {
  page {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    /* display: flex; */
    font-size: 21.33px;
    background: #f8f8f8;
  }
}

@media screen and (min-width: 750px) {
  page {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    /* display: flex; */
    /* font-size: 16px; */
    font-size: 50px;
    background: #f8f8f8;
  }

}
::-webkit-scrollbar{ display:none;}
.amap-logo {
  opacity: 0;
}

.amap-copyright {
  opacity: 0;
}

uni-radio .uni-radio-input {
  width: 12px;
  height: 12px;
  margin-right: 1px;
  margin-bottom: 3px;
}

/* 微信样式 */
checkbox .wx-checkbox-input {
  /* border-radius: 50% !important; */
  color: #fd7600 !important;
}

checkbox .wx-checkbox-input.wx-checkbox-input-checked {
  color: #fd7600;
  /* background: #3d7eff; */
  border: 1px solid #fd7600 !important;
}

.wx-checkbox-input.wx-checkbox-input-checked {
  border: none !important;
}
  .global-page{
    padding-bottom: 38upx;
  }
</style>

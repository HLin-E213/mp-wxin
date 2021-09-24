<template>
  <Layout
      title="注销明细"
      :showFooter="false"
  >
    <div class="log-off-page-wrap">
      <p class="title">注销当前账号</p>
      <p class="phone">180****6370</p>
      <div class="content-wrap">
        <p>如您注销当前账号，则当前服务在App、小程序等留存的信息均被清空且无法找回。具体包括以下信息：</p>
        <div class="divider"></div>
        <p>1.身份信息、账号信息将清空无法恢复；</p>
        <p>2.交易记录将被清空，历史交易无法通过该账户进行退款；</p>
        <p>3.如您的账户有余额，请您在注销前先将您的账户下对应的可以款项全部提现，或者通过转账、消费等途径支付完毕。</p>
      </div>
      <div class="button" @click="open">
        注销账号
      </div>
    </div>
    <uni-popup ref="popup" :maskClick="false" type="center">
      <div class="modal-wrap">
        <div class="title">确认注销该账号</div>
        <div class="body">注销后会清空该账号的所有数据 和信息且无法找回</div>
        <div class="footer">
          <p class="btn" @click="doLogOff">确定</p>
          <div class="footer-divider"></div>
          <p class="btn" @click="close">取消</p>
        </div>
      </div>
    </uni-popup>
  </Layout>
</template>

<script>
import Layout from "@/components/layout/index.vue";
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import { logOff } from "../../api";

export default {
  name: "log-off",
  components: {
    Layout,
    uniPopup,
  },
  methods: {
    open() {
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    async doLogOff() {
      await logOff();
      uni.showToast({
        title: '账号注销成功',
        duration: 2000,
      });
      uni.clearStorageSync();
      uni.reLaunch({
        url: '/pages/main/main',
      });
    }
  }
}
</script>

<style scoped lang="less">
.modal-wrap{
  margin: auto;
  width: 500rpx;
  background-color: #FFFFFF;
  border-radius: 10rpx;
  .title{
    padding-top: 42rpx;
    text-align: center;
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    line-height: 46rpx;
  }
  .body{
    text-align: center;
    position: relative;
    padding: 42rpx 0;
    margin: 0 41rpx;
    color: #333333;
    font-size: 30rpx;
    line-height: 46rpx;
  }
  .body::after{
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    width: 100%;
    height: 1px;
    background-color: rgba(153, 153, 153, .2);
  }
  .footer{
    height: 90rpx;
    display: flex;
    align-items: center;
    .footer-divider{
      width: 1px;
      height: 35rpx;
      background-color: rgba(153, 153, 153, .2);
    }
    .btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333333;
      font-size: 30rpx;
    }
  }
}
.log-off-page-wrap {
  padding: 70rpx 40rpx 99rpx 40rpx;
  background-color: #FFFFFF;
  min-height: 100%;
  .title{
    font-weight: 500;
    color: #333333;
    font-size: 54rpx;
  }
  .phone{
    padding-top: 36rpx;
    font-size: 30rpx;
    color: #666666;
  }
  .content-wrap{
    margin-top: 71rpx;
    width: 670rpx;
    padding: 37rpx 37rpx 33rpx 37rpx;
    box-sizing: border-box;
    background-image: url("http://admin.dajxyl.com/oss?path=video/upload/202107/9ah5h783jskjt8934hklasdt879435iojf9eryt304jojq98e75943joi.png");
    background-size: 100% 100%;
    height: 510rpx;
    color: #333333;
    line-height: 44rpx;
    font-size: 26rpx;
    .divider{
      margin: 35rpx 0;
      height: 1px;
      width: 100%;
      border-bottom: 1px dashed rgba(253,124,9, .2);
    }
  }
  .button{
    margin-top: 266rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 98rpx;
    background-color: #FD7C09;
    border-radius: 46rpx;
    font-weight: 500;
    color: #FFFFFF;
    font-size: 32rpx;
  }
}

</style>

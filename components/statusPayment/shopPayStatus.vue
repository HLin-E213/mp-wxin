<!--支付状态页面组件-->
<template>
  <view class="statusPayment">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="pagesImg">
      <img :src="imgUrl" alt="">
    </view>
    <view class="description">
      <h4>{{ content }}</h4>
    </view>
    <view class="downCount">
      <p>实付：<span>￥{{ money / 100 }}</span></p>
      <p>微信支付</p>
    </view>
    <view class="btn_button">
      <button @click="gotoInfo" type="primary">
        查看订单
        <img class="btn_img" src="https://admin.dajxyl.com/oss?path=img/shopfanhui.png" alt="">
      </button>
    </view>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"

export default {
  components: {
    uniNavBar,
  },
  data() {
    return {
      title: '支付订单',
      content: '支付成功',
      imgUrl: 'https://admin.dajxyl.com/oss?path=img/success_origin.png',
      money: 0,
      orderID: '',
    }
  },
  computed: {
  },
  onLoad(option) {
    this.money = option.pay_amount;
  },
  mounted() {
  },
  methods: {
    gotoInfo() {
      return uni.redirectTo({
        url: '/pages/orderList/orderList?type=shop',
      });
    },
  },
}
</script>

<style lang="less" scoped>
.statusPayment {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  .pagesImg {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 110upx;

    img {
      width: 230upx;
      height: 197upx;
    }
  }

  .description {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 27upx;

    h4 {
      font-size: 43upx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #333333;
    }
  }

  .downCount {
    width: 100%;
    text-align: center;
    font-size: 15upx;
    margin-top: 87upx;
    p {
      margin-top: 13upx;
      font-size: 28upx;
      font-weight: 400;
      color: #666666;
      span{
        color: #fd7600;
      }
    }
  }

  .btn_button {
    margin-top: 50upx;
    text-align: center;
  }
  .btn_button button {
    color: #fd7600;
    display: inline;
    width: 220upx;
    height: 40upx;
    background: #fff;
    border-radius: 70upx;
    padding: 15upx 40upx;
    font-size: 30upx;
    border: 1upx solid #fd7600;
    .btn_img {
      width: 25upx;
      height: 25upx;
    }
  }
  .btn_button button:after {
    border: none !important;
  }
}
</style>

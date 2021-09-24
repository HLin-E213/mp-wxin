<template>
  <layout :title="title"
          :showFooter="false"
          footerHeight="100"
  >
    <view class="content">
      <!--取消信息/退款信息-->
      <view class="canRef-info">
        <view class="canRef-info-body">
          <p class="canRef-item-left">取消/退款进度：<span class="canRef-item-right blue">{{ cancel_progress[0] && cancel_progress[0].progress }}</span></p>
        </view>
      </view>
      <!--退款明细 todo-->
      <view class="money-info" v-if="info.order_refund.status === '1' && info.order_refund.amount !== '0'">
        <view class="money-info-title">
          <img class="money-info-img" src="https://admin.dajxyl.com/oss?path=img/moneyInfo.png" alt="退款明细">
          <h1 class="money-info-h1">退款明细</h1>
        </view>
        <view class="money-info-body">
          <p class="money-item-left">微信支付：
            <span class="over-time">（{{ successTime(info.order_refund) }}已到账）</span>
            <span class="money-float">{{ moneyFloat(info.order_refund) }}</span>
            <span class="money-item-right money-int">￥{{ moneyInt(info) }}.</span>
          </p>
          <p class="money-item-left bgc-blue">{{ info.order_refund.refund_recv_accout }}：
            <span class="money-float">{{ moneyFloat(info.order_refund) }}</span>
            <span class="money-item-right money-int">￥{{ moneyInt(info.order_refund) }}.</span>
          </p>
          <p class="money-item-left">
            <img class="money-item-img" src="https://admin.dajxyl.com/oss?path=img/mark111@2x.png" alt="marks">
            <span class="money-item-span">退款只退还您实际支付的金额</span>
          </p>
        </view>
      </view>
      <!--处理进度-->
      <view class="handle-info">
        <view class="handle-info-title">
          <img class="handle-info-img" src="https://admin.dajxyl.com/oss?path=img/handle.png" alt="">
          <h1 class="handle-info-h1">处理进度</h1>
        </view>
        <view class="handle-info-body">

          <view class="handle-info-item" v-for="(item,index) in cancel_progress">
            <view class="handle-info-left">
              <template v-if="index === cancel_progress.length">
                <img v-if="index === 0" class="handle-info-img" src="https://admin.dajxyl.com/oss?path=img/dianliangport.png" alt="">
                <img v-else class="handle-info-img" src="https://admin.dajxyl.com/oss?path=img/nonePort@2x.png" alt="">
                <img class="handle-info-img-line" src="https://admin.dajxyl.com/oss?path=img/lineImg@2x.png" alt="">
              </template>
              <template v-else>
                <img v-if="index === 0" class="handle-info-img" src="https://admin.dajxyl.com/oss?path=img/dianliangport.png" alt="">
                <img v-else class="handle-info-img" src="https://admin.dajxyl.com/oss?path=img/nonePort@2x.png" alt="">
                <img v-if="index !== cancel_progress.length-1" class="handle-info-img-line" src="https://admin.dajxyl.com/oss?path=img/lineImg@2x.png" alt="">
              </template>
            </view>
            <view class="handle-info-right">
              <span class="handle-info-span">{{ item.progress }}</span>
              <span class="handle-info-span">{{ item.description }}</span>
              <span class="over-time">{{ showTime(item) }}</span>
            </view>
          </view>
        </view>
      </view>
    </view>
  </layout>
</template>

<script>

import layout from "@/components/layout/index.vue";
import {getCancelProgressInfo} from '../../../api/shop/order';
import {showTime} from '../../../service';

export default {
  name: "cancelRefund",
  components: {
    layout,
  },
  computed: {
    showTime(){
      return function({ create_time }){
        return showTime(create_time);
      }
    },
    successTime(){
      return function({ success_time }){
        return showTime(success_time);
      }
    },
    moneyFloat(){
      return function({ amount = 0 }){
        amount = amount / 100;
        amount = amount.toString();
        let arr = amount.split('.');
        return arr[1] ? arr[1] : '00';
      }
    },
    moneyInt(){
      return function({ amount = 0 }){
        amount = amount / 100;
        amount = amount.toString();
        let arr = amount.split('.');
        return arr[0] ? arr[0] : '0';
      }
    }
  },
  data: function () {
    return {
      title: '取消/退款详情',
      order_no: null,
      refund_no: null,
      info: {},
      cancel_progress: [],
    }
  },
  mounted() {
    // /api/shop-order/cancel-progress-info
  },
  onLoad(option) {
    this.order_no = option.order_no;
    this.refund_no = option.refund_no;
    this.getCancelProgressInfo();
  },
  methods: {
    getCancelProgressInfo() {
      const ret = getCancelProgressInfo(this.order_no, this.refund_no);
      ret.then((value) => {
        this.cancel_progress = value.data.data.info.cancel_progress;
        this.info = value.data.data.info;
      });
    }
  }
}
</script>

<style scoped lang="less">
.content {
  .canRef-info {
    background: #fff;
    border-radius: 10upx;
    margin-top: 24upx;
    margin-left: 20upx;
    margin-right: 20upx;
    .canRef-info-title {
      width: 93%;
      border-bottom: 1upx solid rgba(153, 153, 153, 0.2);
      margin: 0 auto;
      padding-bottom: 10upx;
      .canRef-info-img {
        width: 35upx;
        height: 35upx;
        display: inline;
        margin-top: 30upx;
      }
      .canRef-info-h1 {
        font-size: 30upx;
        color: #333;
        display: inline-block;
        margin-left: 14upx;
        margin-bottom: 10upx;
        vertical-align: middle;
      }
    }
    .canRef-info-body {
      padding: 22upx 25upx 38upx 25upx;
      margin-top: 22upx;
      .canRef-item-left {
        font-size: 28upx;
        color: #666;
        margin-top: 18upx;
        .canRef-item-right {
          font-size: 30upx;
          color: #333;
          float: right;
        }
        .blue {
          color: #fd7600;
        }
      }
    }
  }
  .money-info {
    background: #fff;
    border-radius: 10upx;
    margin-top: 24upx;
    margin-left: 20upx;
    margin-right: 20upx;
    .money-info-title {
      width: 93%;
      border-bottom: 1upx solid rgba(153, 153, 153, 0.2);
      margin: 0 auto;
      padding-bottom: 10upx;
      .money-info-img {
        width: 35upx;
        height: 35upx;
        display: inline;
        margin-top: 30upx;
      }
      .money-info-h1 {
        font-size: 30upx;
        color: #333;
        display: inline-block;
        margin-left: 14upx;
        margin-bottom: 12upx;
        vertical-align: middle;
      }
    }
    .money-info-body {
      padding-left: 25upx;
      padding-right: 25upx;
      padding-bottom: 30upx;
      margin-top: 22upx;
      .money-item-left {
        font-size: 28upx;
        color: #666;
        margin-top: 18upx;
        opacity: 1;
        .money-item-right {
          font-size: 30upx;
          color: #333;
          float: right;
        }
        .money-int {
          font-size: 30upx;
          color: #333;
          float: right;
        }
        .money-float {
          font-size: 26upx;
          color: #333;
          float: right;
          padding-top: 5upx;
        }
        .over-time {
          font-size: 24upx;
          color: #666;
          float: right;
          padding-top: 5upx;
        }
        .money-item-img {
          width: 30upx;
          height: 30upx;
          position: relative;
          top: 5.9upx;
        }
        .money-item-span {
          font-size: 24upx;
          color: #999;
          margin-left: 10upx;
        }
      }
      .bgc-blue {
        background: rgba(253, 118, 0, 0.1);
        border-radius: 0 0 10upx 10upx;
        padding: 20upx 10upx;
      }
    }
  }
  .handle-info {
    background: #fff;
    border-radius: 10upx;
    margin: 24upx 20upx 140upx 20upx;
    .handle-info-title {
      width: 93%;
      border-bottom: 1upx solid rgba(153, 153, 153, 0.2);
      margin: 0 auto;
      padding-bottom: 10upx;
      .handle-info-img {
        width: 35upx;
        height: 35upx;
        display: inline;
        margin-top: 30upx;
      }
      .handle-info-h1 {
        font-size: 30upx;
        color: #333;
        display: inline-block;
        margin-left: 14upx;
        margin-bottom: 12upx;
        vertical-align: middle;
      }
    }
    .handle-info-body {
      padding-left: 25upx;
      padding-right: 25upx;
      padding-bottom: 30upx;
      margin-top: 22upx;
      .handle-info-item {
        height: 150upx;
        margin-bottom: 30upx;
        padding-bottom: 30upx;
        .handle-info-left {
          float: left;
          .handle-info-img {
            width: 30upx;
            height: 30upx;
            display: block;
          }
          .handle-info-img-line {
            width: 2upx;
            height: 124upx;
            position: relative;
            top: 12upx;
            left: 14upx;
          }
        }
        .handle-info-right {
          .handle-info-span {
            display: block;
            font-size: 26upx;
            color: #333;
            margin-left: 45upx;
          }
          .over-time {
            display: block;
            font-size: 24upx;
            color: #999;
            margin-left: 45upx;
          }
        }
      }
      .handle-info-item:last-child {
        height: 40upx;
      }
    }
  }
}
</style>

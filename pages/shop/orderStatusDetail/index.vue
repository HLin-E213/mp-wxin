<!--
* @Description: // 商城各个订单状态的详情包括【'待付款'、'已取消'、'已退款'、 '待收货'、 '已完成'】
* @Author: mahui
* @Date: 2020/11/14 4:25 PM
-->
<template>
  <layout
      :showBcakImg="false"
      :showFooter="!showPopup"
      :footerHeight="98"
      showWhiteBackImg
      :backgroundColor="titleMap[status.key] && titleMap[status.key].backgroundColor"
  >
    <view slot="leftTitle" class="left" @click="goback">
      <image class="img" src="https://admin.dajxyl.com/oss?path=img/fanhui@2x.png" mode=""></image>
    </view>

    <view class="order-status-detail-wrap">
      <!--顶部标题-->
      <view
          class="status-title-wrap"
          :class="[`status-title-wrap__${titleMap[status.key] && titleMap[status.key].value}`]"
      >
        <view class="status-wrap">
          <image class="status-wrap__img" :src="titleMap[status.key] && titleMap[status.key].icon"></image>
          <view class="status-wrap__text">{{ titleMap[status.key] && titleMap[status.key].text }}</view>
        </view>
        <p class="pay-info" v-if="status.key === 'pengding-pay'">
          <span class="pay-info__money">需付款：￥{{ orderInfo.pay_amount / 100 }}</span>
          <span class="pay-info__time">剩余：{{ innerRemainPayTime }}</span>
        </p>
        <view class="to-pay" v-if="status.key === 'pengding-pay'" @click="pay(orderInfo)">去支付</view>
      </view>

      <!--查看取消、退款详情tab-->
      <view class="refund-wrap" v-if="showRefund" @click="gotoInfo">
        <p class="follow">
          <image class="follow__img" src="https://admin.dajxyl.com/oss?path=img/follow.png" mode=""></image>
          <span class="follow__title">取消/退款进度：</span>
          <span class="follow__content">您的订单已取消</span>
          <!--<span class="follow__content">您的订单已到账</span>-->
        </p>
        <p class="check-detail">
          详情 <image class="link" src="https://admin.dajxyl.com/oss?path=img/link.png" mode=""></image>
        </p>
      </view>

      <view class="order-status-content-wrap">
        <!--地址信息-->
        <view class="addr-wrap"><Addr :addrInfo="address" /></view>
        <!--订单内容区域-->
        <view class="order-info-wrap"><OrderInfo :orderInfo="orderInfo"/></view>
      </view>
    </view>

    <!--弹窗层-->
    <template>
      <view :class="showPopup ? '.wos-scroll-no' : '.wos-scroll-yes'">
        <uni-popup :maskClick="false" ref="popup" type="bottom" @change='changePopup'>
          <view class="popupView">

            <view class="popupReason">
              <view class="popupClose">
                <img src="https://admin.dajxyl.com/oss?path=img/close_popup.png" alt="关闭">
              </view>
              <view class="popupReason-body">
                <view class="popupReason-body-title" @click="closePopup">
                  <img class="title-img-left" src="https://admin.dajxyl.com/oss?path=img/14591@2x.png" alt="">
                  <p class="title-p">取消订单</p>
                  <img class="title-img-right" src="https://admin.dajxyl.com/oss?path=img/14592@2x.png" alt="">
                </view>
                <view class="popupReason-body-tip">
                  <p class="tip-p">温馨提示：</p>
                  <p class="tip-p">1、特价、打折等购买优惠可能一并取消；</p>
                  <p class="tip-p">2、订单一旦取消，不能恢复；</p>
                  <p class="tip-p">3、订单所使用的优惠券退回到账号中；</p>
                </view>
                <view class="popupReason-body-check">
                  <view class="popupReason-body-check-title">
                    <p class="title-p">请选择取消订单的原因（必选）：</p>
                  </view>
                  <view class="popupReason-body-check-list">
                    <view class="popupReason-body-check-item" v-for="(item,index) in reasonList" :key="index" @click="selectReason(index)">
                      <img class="item-img" :src="item.is_select ? selectUrl : unSelectUrl" alt="">
                      <p class="item-p">{{ item.desc }}</p>
                    </view>
                  </view>
                </view>
              </view>
              <view class="popupReason-sub">
                <button class="popupReason-sub-btn" @click="submitReason">提交</button>
              </view>
            </view>

          </view>
        </uni-popup>
      </view>
    </template>

    <!--底部按钮-->
    <view slot="footer" class="order-footer-wrap">
      <view style="flex: 1;">
        <footerBtn
            align="right"
            :btnStyle="btnStyle"
            @click-cancel="cancel"
            @click-pay="pay"
            @click-refund="refund"
            @click-checkRail="checkRail"
            @click-accept="accept"
            @click-rebuy="rebuy"
            @click-refundDetail="refundDetail"
            :isShowRefund="isShowRefund"
            :orderInfo="orderInfo"
            :status="orderInfo.status"
            :type="orderInfo.mallState && orderInfo.mallState.key"
            :pay_status="orderInfo.pay_status"></footerBtn>
      </view>
    </view>
    <Modal
        ref="modal"
        title="确认收货"
        @confirm="confirm"
        @cancel="close"
    >
      <view class="accept-info">
        收到的包裹和订单信息一致
      </view>
      <view  class="accept-info">收到的商品无损坏</view>
    </Modal>
    <Modal
        ref="Modal_pay"
        :showTitle="false"
        content="商品价格发生变化是否继续支付？"
        @confirm="confirm_pay"
        @cancel="close_pay"
    ></Modal>
  </layout>

</template>

<script>
import Layout from "@/components/layout/index.vue";
import Modal from '@/components/Modal';
import FooterBtn from '@/components/ShopOrderBtn';
import Addr from './components/Addr';
import OrderInfo from './components/OrderInfo';
import {payOrder, getOrderInfo, CancelOrder, ConfirmReceipt} from '../../../api/shop/order';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import countDown from '@/mixins/countDown.js';

const titleMap = {
    'pengding-pay': {
        icon: 'https://admin.dajxyl.com/oss?path=img/pendding-pay.png',
        text: '待付款',
        backgroundColor: 'linear-gradient(0deg, #fd7600, #fd7600)',
        value: 'pengding-pay',
    },
    'cancel': {
        icon: 'https://admin.dajxyl.com/oss?path=img/pendding-pay.png',
        text: '已取消',
        backgroundColor: 'linear-gradient(0deg, #fd7600, #fd7600)',
        value: 'cancel',
    },
    'refund': {
        icon: 'https://admin.dajxyl.com/oss?path=img/pendding-pay.png',
        text: '已退款',
        backgroundColor: 'linear-gradient(0deg, #fd7600, #fd7600)',
        value: 'refund',
    },
    'pending-receve': {
        icon: 'https://admin.dajxyl.com/oss?path=img/pendding-pay.png',
        text: '待收货',
        backgroundColor: 'linear-gradient(0deg, #fd7600, #fd7600)',
        value: 'pending-receve',
    },
    'complete': {
        icon: 'https://admin.dajxyl.com/oss?path=img/pendding-pay.png',
        text: '已完成',
        backgroundColor: 'linear-gradient(0deg, #fd7600, #fd7600)',
        value: 'complete',
    }
};
export default {
    name: 'orderStatusDetail',
    mixins: [countDown],
    components: {
        Layout,
        Modal,
        FooterBtn,
        Addr,
        OrderInfo,
        uniPopup,
        uniPopupMessage,
        uniPopupDialog,
    },
    onLoad(option) {
        this.order_no = option.order_no;
    },
    onShow(){
      this.getOrderInfo();
    },
    data() {
        return {
          showPopup: false,
          status: {},
          titleMap,
          order_no: '',
          address: {},
          orderInfo: {},
          payInfo: {},
          pay_amount: 0,
          selectUrl: 'https://admin.dajxyl.com/oss?path=img/shopping_cart_selected.png',
          unSelectUrl: 'https://admin.dajxyl.com/oss?path=img/shopping_cart_unselect.png',
          reasonList: [
            {
              is_select: true,
              desc: '不想要了',
            },{
              is_select: false,
              desc: '商品信息填写错误',
            }, {
              is_select: false,
              desc: '地址信息填写错误',
            }, {
              is_select: false,
              desc: '商品降价',
            }, {
              is_select: false,
              desc: '其他',
            }
          ],
          isShowRefund: false,
        };
    },
    computed: {
        btnStyle() {
            return {
                width: uni.upx2px(200) + 'px',
                height: uni.upx2px(70) + 'px',
                fontSize: uni.upx2px(30) + 'px',
                borderRadius: uni.upx2px(35) + 'px',
            }
        },
        showRefund() {
            return this.status.key === 'cancel' || this.status.key === 'refund'
        }
    },
    methods: {
      selectReason(key) {
        this.reasonList.forEach((i, k) => {
          if (k === key) {
            i.is_select = true;
          } else {
            i.is_select = false;
          }
        });
      },
      submitReason() {
        let order_no = this.orderInfo.order_no;
        let cancel_reason = '';
        this.reasonList.forEach((i, k) => {
          if (i.is_select) {
            cancel_reason = i.desc;
          }
        });
        const ret = CancelOrder(order_no, cancel_reason);
        ret.then((value) => {
          console.log(value);
          this.closePopup();
          return uni.navigateTo({
            // url: '/pages/orderList/orderList?type=shop'
            url: '/pages/shop/orderStatusDetail/index?order_no=' + order_no,
          });
        });
      },
        changePopup({show}) {
          this.showPopup = show;
        },
        openReason: function () {
          this.$refs.popup.open();
        },
        closePopup(){
          this.$refs.popup.close();
        },
        confirm() {
          const ret = ConfirmReceipt(this.order_no);
          ret.then((value) => {
            console.log(value);
          });
          this.$refs.modal.close();
          this.getOrderInfo();
        },
        close() {
            this.$refs.modal.close();
        },
        confirm_pay() {
          this.wxPay();
          this.$refs.modal_pay.close();
        },
        close_pay() {
          this.$refs.modal_pay.close();
        },
        gotoInfo() {
          if (this.orderInfo.pay_status === '4') {
            return uni.navigateTo({
              url: '/pages/shop/order/cancelRefund?order_no=' + this.orderInfo.order_no
            });
          }
          return uni.navigateTo({
            url: '/pages/shop/order/cancelRefundList?order_no=' + this.orderInfo.order_no
          });
        },
        getOrderInfo() {
          const ret = getOrderInfo(this.order_no);
          ret.then((value) => {
            console.log(value.data.data.info);
            this.address = value.data.data.info.order_address;
            this.orderInfo = value.data.data.info;
            this.orderInfo.mallState = this.mallState(this.orderInfo);
            this.status = this.showState(this.orderInfo);
            this.doCountDown();
            this.orderInfo.orderProduct.forEach((i, k) => {
              if (i.refund_order_product_info) {
                this.isShowRefund = true;
              }
            });
          });
        },
        doCountDown() {
            if (String(this.orderInfo.pay_status) === '0') { // 待付款订单
                if (this.timer) {
                    this.clearTimer();
                }
                this.endTime = this.orderInfo.create_time * 1000 + 30 * 60 * 1000 ; // 支付截止时间
                console.log(new Date(this.orderInfo.create_time* 1000), new Date(this.endTime));
                const res = this.countDown(this.endTime / 1000, new Date().valueOf() / 1000, 'mm:ss');
                if (!res) return false;
                this.innerRemainPayTime = res;
                this.dealPendingTime();
            }
        },
      mallState(item) {
        const pay_status = item.pay_status;
        const status = item.status;
        if (pay_status === "0") {
          return {key: 1, value: "待付款"};
        } else if ((pay_status === "1" || pay_status === "2") && (status === "0" || status === "1")) {
          return {key: 2, value: "待收货"};
        } else if (status === "2") {
          return {key: 3, value: "已完成"};
        } else if (pay_status === "3" || pay_status === "4") {
          return {key: 4, value: "已取消"};
        }
      },
      showState(item) {
        const pay_status = item.pay_status;
        const status = item.status;
        if (pay_status === '0') {
          return {key: 'pengding-pay', value: '待付款'};
        }
        if (pay_status === '4') {
          return {key: 'cancel', value: '已取消'};
        }
        if (pay_status === '3') {
          return {key: 'refund', value: '已退款'};
        }
        if ((pay_status === '1' || pay_status === '2') && (status === '0' || status === '1' )) {
          return {key: 'pending-receve', value: '待收货'};
        }
        if (status === '2') {
          return {key: 'complete', value: '已完成'};
        }
      },
      cancel(item){
        console.log(item);
        console.log('取消');
        this.openReason();
      },
      pay(item){
        console.log(item);
        console.log('去支付');
        uni.showLoading({
          title: '正在调起订单支付...'
        });
        const payRet = payOrder(item.order_no);
        payRet.then((v) => {
          console.log(v);
          this.payInfo = v.data.data.info.pay_info;
          this.pay_amount = v.data.data.info.pay_amount;
          uni.hideLoading();

          /*test 成功支付*/
          // return uni.navigateTo({
          //   url: '/components/statusPayment/shopPayStatus?pay_amount=' + this.pay_amount,
          // });
          /*test */

          if (v.data.data.info.is_price_change) {
            this.$refs.Modal_pay.open();
            return false;
          }
          this.wxPay();
        });
      },
      wxPay() {
        let that = this;
        return uni.requestPayment({
          provider: 'wxpay',
          timeStamp: this.payInfo.timeStamp,
          nonceStr: this.payInfo.nonceStr,
          package: this.payInfo.package,
          signType: this.payInfo.signType,
          paySign: this.payInfo.paySign,
          success: function (res) {
            console.log(res);
            uni.showToast({
              title: '支付成功！',
              duration: 2000
            });
            return uni.navigateTo({
              url: '/components/statusPayment/shopPayStatus?pay_amount=' + that.pay_amount,
            });
          },
          fail: function (err) {
            console.log(err);
            return uni.showToast({
              title: '您取消了付款！',
              duration: 2000,
              icon: 'none',
              mask: true,
            });
          }
        });
      },
      refund(item) {
        console.log(item);
          uni.navigateTo({
              url: '/pages/shop/order/refund?item=' + encodeURIComponent(JSON.stringify(item)),
          });
      },
      checkRail(item) {
        console.log(item);
        console.log('查看物流');
        return uni.navigateTo({
          url: '/pages/shop/order/logistics?id=' + item.order_no,
        });
      },
      accept(item) {
        console.log(item);
        console.log('确认收货');
        this.$refs.modal.open();
      },
      rebuy(item) {
        console.log(item);
        console.log('再次购买');
        return uni.navigateTo({
          url: '/pages/shop/detailsGood/index?id=' + item.orderProduct[0].product_id,
        });
      },
      refundDetail(item) {
        console.log(item);
        console.log('退款明细');
        return uni.navigateTo({
          url: '/pages/shop/order/cancelRefundList?order_no=' + item.order_no,
        });
      },
    },
};
</script>

<style scoped lang="less">
  .accept-info{
    text-align: left;
  }
  .left{
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    .img{
      margin-left: 20upx;
      height: 32upx;
      width: 18upx;
    }
  }
  .order-status-detail-wrap{
    .status-title-wrap{
      display: flex;
      flex-direction: column;
      color: #FFFFFF;
      align-items: center;
      border-radius: 0 0 20upx 20upx;
      .status-wrap{
        display: flex;
        align-items: center;
        justify-content: center;
        &__img{
          width: 50upx;
          height: 50upx;
        }
        &__text{
          margin-left: 10upx;
          font-size: 36upx;
          line-height: 35upx;
        }
      }
      .pay-info{
        padding-top: 26upx;
        &__money{
          font-size: 28upx;
        }
        &__time{
          font-size: 26upx;
          padding-left: 36upx;
          line-height: 25upx;
        }
      }
      .to-pay{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 26upx;
        width: 162upx;
        height: 62upx;
        font-size: 28upx;
        color: #fd7600;
        border-radius: 31upx;
        background-color: #ffffff;
      }
    }
    .status-title-wrap__pengding-pay{
      background: linear-gradient(0deg, #fd7600, #fd7600);
      padding: 0 0 34upx 0 ;
      justify-content: center;
    }
    .status-title-wrap__cancel{
      height: 170upx;
      background: linear-gradient(0deg, #fd7600, #fd7600);
    }
    .status-title-wrap__refund{
      height: 170upx;
      background: linear-gradient(0deg, #fd7600, #fd7600);
    }
    .status-title-wrap__pending-receve{
      height: 107upx;
      background: linear-gradient(0deg, #fd7600, #fd7600);
    }
    .status-title-wrap__complete{
      height: 107upx;
      background: linear-gradient(0deg, #fd7600, #fd7600);
    }
    .refund-wrap {
      display: flex;
      background-color: #ffffff;
      z-index: 10;
      padding: 42upx 41upx;
      font-size: 28upx;
      color: #666666;
      align-items: center;
      border-radius: 52upx;
      justify-content: space-between;
      margin-top: -96upx;
      .follow {
        display: flex;
        font-size: 28upx;
        color: #666666;
        align-items: center;
        &__img {
          width: 30upx;
          height: 30upx;
        }
        &__title {
        }
        &__content {
          font-size: 30upx;
          color: #333333;
        }
      }
      .check-detail {
        color: #999999;
        font-size: 26upx ;
        .link {
        width: 11upx;
        height: 20upx;
        margin-left: 26upx;
      }
      }
    }
    .order-status-content-wrap{
      margin: 24upx 20upx;
    }
    .addr-wrap{
      margin-top: 20upx;
    }
    .order-info-wrap{
      margin-top: 20upx;
    }

  }
  .order-footer-wrap{
    display: flex;
    height: 100%;
    padding-right: 44upx;
    align-items: center;
    text-align: right;
  }

  .popupView {
    width: 100%;
    max-height: 1100rpx;
    background-color: #fff;
    border-radius: 20upx 20upx 0 0;
    .popupReason {
      height: 2000upx;
      .popupClose {
        padding-right: 34upx;
        padding-top: 34upx;
        float: right;
        img {
          width: 46upx;
          height: 46upx;
        }
      }
      .popupReason-body {
        background-color: #fafafa;
        .popupReason-body-title {
          padding-top: 50upx;
          position: relative;
          .title-img-left {
            width: 70upx;
            height: 6upx;
            position: absolute;
            left: 220upx;
            top: 70upx;
          }
          .title-p {
            width: 165upx;
            text-align: center;
            margin: 0 auto;
            font-size: 34upx;
            color: #333;
          }
          .title-img-right {
            width: 70upx;
            height: 6upx;
            position: absolute;
            right: 220upx;
            top: 70upx;
          }
        }
        .popupReason-body-tip {
          background-color: rgba(253, 118, 0, 0.2);
          border-radius: 10upx;
          margin: 30upx 20upx;
          padding: 30upx;
          .tip-p {
            font-size: 30upx;
            line-height: 50upx;
            color: #666;
          }
        }
        .popupReason-body-check {
          background-color: #fff;
          border-radius: 10upx;
          margin: 0 20upx;
          .popupReason-body-check-title {
            .title-p {
              font-size: 30upx;
              color: #333;
              font-weight: 400;
              margin: 0 40upx;
              padding-top: 40upx;
              padding-bottom: 40upx;
              border-bottom: 1upx solid rgba(153, 153, 153, 0.2);
            }
          }
          .popupReason-body-check-list {
            .popupReason-body-check-item {
              position: relative;
              .item-img {
                top: 5upx;
                left: 45upx;
                position: absolute;
                width: 30upx;
                height: 30upx;
              }
              .item-p {
                font-size: 26upx;
                color: #666;
                margin: 30upx 95upx;
              }
            }
          }
        }
      }
      .popupReason-sub {
        position: fixed;
        bottom: 0;
        width: 100%;
        background: #fafafa;
        box-shadow: 0upx 1upx 0upx 0upx rgba(153, 153, 153, 0.2);
        .popupReason-sub-btn {
          width: 90%;
          border-radius: 46upx;
          height: 92upx;
          background-color: #fd7600;
          color: #fff;
          font-size: 35.64upx;
          line-height: 95upx;
          margin-bottom: 50upx;
          margin-top: 25upx;
        }
      }
    }
  }
</style>

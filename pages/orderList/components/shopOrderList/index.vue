<!--
* @Description:
* @Author: mahui
* @Date: 2020/11/12 9:14 PM
-->
<template>
  <view class="shop-order-list-wrap">
    <view
        class="card-item-wrap"
        v-for="(item, index) in list"
        :key="index"
    >
      <view>
        <card
            :title="item.product_title.length > 14 ? item.product_title.slice(0,14) + '...' : item.product_title "
            showFooter
            :selectImg="item.checked ? checkImg : unCheckImg"
        >
          <view slot="extra" class="order-status">{{ item.mallState && item.mallState.value }}</view>
          <view slot="content" class="goods-list-wrap">
            <view
                @click="gotoInfo(item)"
                class="goods-list-item"
                v-for="(goodItem, goodIndex) in item.orderProduct"
                :key="goodIndex"
            >
              <view class="goods-list-item__img-wrap">
                <img
                    class="goods-list-item__img-wrap__img"
                    :src="goodItem.product_images_url" alt="">
              </view>
              <view v-if="goodItem.refund_order_product_info">
                <view v-if="goodItem.refund_order_product_info.status === '0'">
                  <img class="refund_img" src="https://admin.dajxyl.com/oss?path=img/refunding.png" alt="退款中">
                </view>
                <view v-if="goodItem.refund_order_product_info.status === '1'">
                  <img class="refund_img" src="https://admin.dajxyl.com/oss?path=img/refunded.png" alt="已退款">
                </view>
              </view>
              <view class="goods-list-item__text">
                <view class="goods-list-item__text__name-wrap">
                  <view class="name">{{ skuName(goodItem) }}</view>
                </view>
                <view class="amount">单价：￥{{ goodItem.product_sku_price / 100 }}</view>
                <view class="mount-wrap">
                  <view>数量：</view>
                  <view class="sub-add">
                    <view class="mount">{{ goodItem.quantity }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view slot="footer" class="order-footer-wrap">
            <view class="order-info">共{{ item.order_product_sum }}件商品，总价：￥{{ item.amount / 100 }}，优惠：￥{{ item.discount_amount / 100 }}</view>
            <view class="pay">付款：<view class="pay-money">￥{{ item.pay_amount / 100 }}</view></view>
            <view class="btns-wrap">
              <footerBtn
                  @click-cancel="cancel"
                  @click-pay="pay"
                  @click-refund="refund"
                  @click-checkRail="checkRail"
                  @click-accept="accept"
                  @click-rebuy="rebuy"
                  @click-refundDetail="refundDetail"
                  :isShowRefund="item.isShowRefunds"
                  :orderInfo="item"
                  :status="item.status"
                  :type="item.mallState && item.mallState.key"
                  :pay_status="item.pay_status"></footerBtn>
            </view>
          </view>
        </card>
      </view>
    </view>
    <Modal
        ref="Modal_pay"
        :showTitle="false"
        content="商品价格发生变化是否继续支付？"
        @confirm="confirm_pay"
        @cancel="close_pay"
    ></Modal>
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

  </view>

</template>

<script>
  import card from '@/components/Card';
  import footerBtn from '@/components/ShopOrderBtn';
  import Modal from '@/components/Modal';
  import {payOrder, CancelOrder, ConfirmReceipt} from '../../../../api/shop/order';

  const subIMg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_sub.png';
  const unSubIMg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_un_sub.png';
  const unCheckImg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_unselect.png';
  const checkImg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_selected.png';
    export default {
        name: 'shopList',
        props: {
            list: {
                required: true,
                type: Array,
                default:() => [],
            }
        },
        components: {
            card,
            Modal,
            footerBtn,
        },
        computed: {
          getSubImg() {
            return function (mount) {
              return mount < 1 ? unSubIMg : subIMg
            }
          },
          skuName() {
            return function ({product_spec}) {
              let title = '';
              product_spec.forEach((i, k) => {
                title += i.product_spec_value.value + '，';
              });
              title = title.substr(0, title.length - 1);
              return title.length > 12 ? title.slice(0, 12) + '...' : title;
            }
          },
        },
        data() {
          return {
            unCheckImg,
            checkImg,
            payInfo: {},
            pay_amount: 0,
            showPopup: false,
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
            orderInfoItem: {},
          };
        },
        methods: {
          gotoInfo(item){
            return uni.navigateTo({
              url: '/pages/shop/orderStatusDetail/index?order_no=' + item.order_no
            });
          },
          confirm_pay() {
            this.wxPay();
            this.$refs.modal_pay.close();
          },
          close_pay() {
            this.$refs.modal_pay.close();
          },
          confirm() {
            const ret = ConfirmReceipt(this.orderInfoItem.order_no);
            ret.then((value) => {
              console.log(value);
            });
            this.$refs.modal.close();
            this.$emit('getShopOrderList');
          },
          close() {
            this.$refs.modal.close();
          },
          cancel(item){
            console.log(item);
            console.log('取消');
            this.orderInfoItem = item;
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
                this.$emit('getShopOrderList');
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
              console.log('item', item);
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
            this.orderInfoItem = item;
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
          changePopup({show}) {
            this.showPopup = show;
          },
          openReason: function () {
            this.$refs.popup.open();
          },
          closePopup(){
            this.$refs.popup.close();
          },
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
            let order_no = this.orderInfoItem.order_no;
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
              this.$emit('getShopOrderList');
              return uni.navigateTo({
                // url: '/pages/orderList/orderList?type=shop'
                url: '/pages/shop/orderStatusDetail/index?order_no=' + order_no,
              });
            });
          },
        },
    };
</script>

<style scoped lang="less">
  .shop-order-list-wrap{
    margin: 26upx 20upx;
    .card-item-wrap{
      margin-bottom: 24upx;
      .order-status{
        font-size: 26upx;
        color: #fd7600;
      }
    }
    .goods-list-wrap{
      padding: 31upx 0;
      .goods-list-item{
        display: flex;
        align-items: center;
        margin-bottom: 38upx;
        &__check-box{
          height: 30upx;
          width: 30upx;
        }
        &__img-wrap {
          display: flex;
          height: 160upx;
          width: 160upx;
          margin-left: 16upx;
          align-items: center;
          justify-content: center;
          background: #F3F3F3;
          border-radius: 10px;
          &__img{
            height: 100%;
            width: 100%;
          }
        }
        &__text{
          flex: 1;
          color: #999999;
          margin-left: 26upx;
          &__name-wrap{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-bottom: 37upx;
            .name{
              font-size: 26upx;
              color: #999999;
            }
          }
          .amount{
            font-size: 30upx;
            color: #FD7600;
            padding-bottom: 37upx;
            text-align: right;
          }
          .mount-wrap{
            display: flex;
            align-items: center;
            font-size: 26upx;
            justify-content: flex-end;
            .sub-add{
              display: flex;
              align-items: center;
              .sub{
                width: 51upx;
                height: 48upx;
              }
              .mount{
                font-size: 29upx;
                padding: 0 20upx;
              }
            }
          }

        }
      }
      .goods-list-item:last-of-type{
        margin-bottom: 0;
      }
    }
    .order-footer-wrap{
      text-align: right;
      .order-info{
        padding-top: 37upx;
        font-size: 26upx;
        color:#999999;
      }
      .pay{
        padding-top: 25upx;
        font-size: 30upx;
        color: #333333;
        .pay-money{
          display: inline-block;
          color: #FD7600;
        }
      }
      .btns-wrap{
        padding: 39upx 0 33upx 0;
      }
    }
  }

  .refund_img {
    margin-left: 41upx;
    height: 125upx;
    width: 125upx;
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
          margin-bottom: 110upx;
          margin-top: 25upx;
        }
      }
    }
  }
</style>

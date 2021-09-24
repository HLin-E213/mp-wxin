<!--
* @Description: 订单状态详情中的订单信息
* @Author: mahui
* @Date: 2020/11/14 9:46 PM
-->
<template>
  <view class="order-info-wrap">
    <card showFooter>
      <view slot="title" class="card-title">
        <p class="card-title__text">
          {{ orderInfo.product_title }}
        </p>
        <view
            class="goods-list-item"
            v-for="(goodItem, goodIndex) in orderInfo.orderProduct"
            :key="goodIndex"
        >
          <view class="goods-list-item__img-wrap">
            <img
                class="goods-list-item__img-wrap__img"
                :src="goodItem.product_images_url" alt="">
          </view>
          <view class="goods-list-item__text">
            <view class="goods-list-item__text__name-wrap">
              <view class="name">{{ specTitle(goodItem) }}</view>
            </view>
            <view class="amount">￥{{ goodItem.product_sku_price / 100 }}</view>
            <view class="mount-wrap">
              <view>数量</view>
              <view class="mount">{{ goodItem.quantity }}</view>
            </view>
          </view>
          <view v-if="goodItem.refund_order_product_info">
            <view v-if="goodItem.refund_order_product_info.status === '0'">
              <img class="refund_img" src="https://admin.dajxyl.com/oss?path=img/refunding.png" alt="退款中">
            </view>
            <view v-if="goodItem.refund_order_product_info.status === '1'">
              <img class="refund_img" src="https://admin.dajxyl.com/oss?path=img/refunded.png" alt="已退款">
            </view>
          </view>
        </view>
      </view>
      <view slot="content" class="order-info-items">
        <p class="order-info-item">
          <span>订单编号：</span>
          <span class="order-info-item__value">{{ orderInfo.order_no }}</span>
        </p>
        <p class="order-info-item">
          <span>下单时间：</span>
          <span class="order-info-item__value">{{ timeShow(orderInfo) }}</span>
        </p>
        <p class="order-info-item">
          <span>商品总额：</span>
          <span class="order-info-item__value">{{ orderInfo.amount / 100 }}</span>
        </p>
        <p class="order-info-item">
          <span>优惠券：</span>
          <span class="order-info-item__value">{{ couponShow(orderInfo) }}</span>
        </p>
        <p class="order-info-item">
          <span>运费：</span>
          <span class="order-info-item__value">{{ orderInfo.freight_amount / 100 }}</span>
        </p>
      </view>
      <view slot="footer" class="order-info-footer-wrap">
        <p class="total-money">合计 <span class="money">￥{{ orderInfo.pay_amount / 100 }}</span></p>
      </view>
    </card>
  </view>

</template>

<script>
import card from '@/components/Card';
import { showTime } from "../../../../../service";

export default {
    name: 'order-info',
    props: {
        orderInfo: {
          required: false,
            type: Object,
            default: () => ({
                goods: [
                    { img: '' , name: '中老年益生菌，1kg', amount: 120.0, mount: 1 },
                    { img: '' , name: '中老年益生菌，2kg', amount: 130.0, mount: 2 },
                    { img: '' , name: '中老年益生菌，32kg', amount: 140.0, mount: 3 },
                ],
                goodsName: '南极人短T恤',
                orderNo: '20200722123456',
                createTime: '2020-07-22 09:20:23',
                amount: '108.00',
                coupons: '无',
                railFee: '运费',
            })
        }
    },
    components: {
        card,
    },
    computed: {
      specTitle(){
        return function({ product_spec }){
          let title = '';
          product_spec.forEach((i, k) => {
            title += i.product_spec_value.value + '，'
          });
          return title = title.substr(0, title.length - 1);
        }
      },
      timeShow(){
        return function({ create_time }){
          return showTime(create_time);
        }
      },
      couponShow(){
        return function ({ coupon_info = [] }){
          if (coupon_info.length > 0) {
            // fixme todo
            return 'todo';
          }
          return '无';
        }
      },
    },
    data() {
        return {};
    },
    methods: {},
};
</script>

<style scoped lang="less">
  .order-info-wrap{
    .card-title{
      &__text{
        padding: 33upx 24upx;
        font-size: 34upx;
        line-height: 33upx;
        color: #333333;

      }
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
          height: 180upx;
          width: 180upx;
          margin-left: 16upx;
          align-items: center;
          justify-content: center;
          &__img{
            height: 180upx;
            width: 180upx;
            border-radius: 10px;
          }
        }
        &__text{
          flex: 1;
          color: #666666;
          margin-left: 26upx;
          &__name-wrap{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .name{
              font-size: 26upx;
              color: #666666;
            }
            .del{
              display: flex;
              align-items: center;
              padding: 4upx 15upx;
              background-color: rgba(253, 118, 0, .1);
              border-radius: 18px;
              font-size: 26upx;
              .icon{
                width:24upx;
                height:26upx;
              }
            }
          }
          .amount{
            font-size: 30upx;
            font-weight: 500;
            color: #FD7600;
          }
          .mount-wrap{
            display: flex;
            align-items: center;
            font-size: 26upx;
            .mount{
              font-size: 29upx;
              padding: 0 20upx;
            }
          }

        }
      }
    }
    .order-info-items{
      padding-bottom: 45upx;
      .order-info-item {
        display: flex;
        padding-top: 45upx;
        font-size: 26upx;
        line-height:25upx;
        color: #666666;
        justify-content: space-between;
        &__value{
          font-size: 30upx;
          line-height: 30upx;
          color: #333333;
        }
      }
    }
    .order-info-footer-wrap{
      .total-money{
        display: flex;
        padding: 40upx 0;
        font-size: 26upx;
        color: #333333;
        align-items: center;
        justify-content: flex-end;
        .money{
          font-size: 34upx;
          color: #FD7600;
        }
      }
    }
  }

  .refund_img {
    margin-left: 41upx;
    height: 125upx;
    width: 125upx;
  }
</style>

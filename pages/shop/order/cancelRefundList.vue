<template>
  <layout :title="title"
          :showFooter="false"
          footerHeight="100"
  >
    <view class="content">
      <!--取消信息/退款信息-->
      <view class="canRef-info">
        <view class="canRef-info-title">
          <img class="canRef-info-img" src="https://admin.dajxyl.com/oss?path=img/artTitle.png" alt="信息">
          <h1 class="canRef-info-h1">退款信息</h1>
        </view>
        <view class="canRef-info-body">
          <p class="canRef-item-left">订单编号：<span class="canRef-item-right">{{ order_no }}</span></p>
          <p class="canRef-item-left">取消商品数量：<span class="canRef-item-right">{{ orderList.quantity }}</span></p>
        </view>
      </view>
      <view class="canRef-info">
        <view class="canRef-info-title">
          <img class="canRef-info-img" src="https://admin.dajxyl.com/oss?path=img/listgoodimg.png" alt="信息">
          <h1 class="canRef-info-h1">退款商品</h1>
        </view>
        <view class="good-body">
          <view v-for="(goodItem, goodIndex) in orderList.list" :key="goodIndex">
            <view class="goods-list-item" v-for="(item,index) in goodItem.orderProduct">
              <view class="goods-list-item__img-wrap" @click="gotoInfo(order_no,goodItem.refund_no)">
                <img
                    class="goods-list-item__img-wrap__img"
                    :src="item.product_images_url" alt="">
              </view>
              <view class="goods-list-item__text" @click="gotoInfo(order_no,goodItem.refund_no)">
                <view class="goods-list-item__text__name-wrap">
                  <view class="name">{{ showDesc(item) }}</view>
                </view>
                <view class="amount">￥{{ item.product_sku_price / 100 }}</view>
                <view class="mount-wrap">
                  <p>x{{ item.quantity }}</p>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </layout>
</template>

<script>

import layout from "@/components/layout/index.vue";
import {getRefundList} from '../../../api/shop/order';

const subIMg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_sub.png';
const unSubIMg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_un_sub.png';
const unCheckImg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_unselect.png';
const checkImg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_selected.png';

export default {
  name: "cancelRefundList",
  components: {
    layout,
  },
  computed: {
    showDesc(){
      return function({ product_spec }){
        console.log(product_spec);
        let title = '';
        product_spec.forEach((i, k) => {
          title += i.product_spec_value.value + '，';
        });
        title = title.substr(0, title.length - 1);
        return title.length > 32 ? title.slice(0, 32) + '...' : title;
      }
    }
  },
  data: function () {
    return {
      title: '取消/退款详情',
      checkImg,
      unCheckImg,
      goods: [
        { img: '' , name: '中老年益生菌，1kg', amount: 120.0, mount: 1, checked: false },
        { img: '' , name: '中老年益生菌，2kg', amount: 130.0, mount: 2, checked: false },
        { img: '' , name: '中老年益生菌，32kg', amount: 140.0, mount: 3, checked: false },
      ],
      order_no: null,
      orderList: {},
    }
  },
  onLoad(option) {
    this.order_no = option.order_no;
    this.getRefundList();
  },
  methods: {
    getRefundList() {
      const ret = getRefundList(this.order_no);
      ret.then((value) => {
        console.log(value);
        this.orderList = value.data.data.info;
      });
    },
    gotoInfo(order_no, refund_no){
      return uni.navigateTo({
        url: '/pages/shop/order/cancelRefund?order_no=' + order_no + '&refund_no=' + refund_no,
      });
    },
  },
}
</script>

<style scoped lang="less">
.content {
  .canRef-info {
    .good-body {
      margin-top: 15upx;
      padding: 30upx 20upx 0upx 0upx;
      background-color: #fff;
      .goods-list-item:last-child {
        border-bottom: none;
      }
      .goods-list-item{
        display: flex;
        align-items: center;
        margin-bottom: 28upx;
        border-bottom: 1upx solid rgba(153, 153, 153, 0.2);
        padding-bottom: 30upx;
        margin-left: 0upx;
        margin-right: 45upx;
        position: relative;
        &__check-box{
          height: 30upx;
          width: 30upx;
          position: absolute;
          left: -45upx;
        }
        &__img-wrap {
          display: flex;
          margin-left: 16upx;
          align-items: center;
          justify-content: center;
          background: #F3F3F3;
          &__img{
            height: 180upx;
            width: 180upx;
            border-radius: 10px;
          }
        }
        &__text{
          position: relative;
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
            position: relative;
            right: -24upx;
            top: -75upx;
            font-size: 26upx;
            p {
              text-align: right;
            }
          }
        }
      }
      .goods-list-item:last-of-type{
        margin-bottom: 0;
      }
    }
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
      padding-left: 25upx;
      padding-right: 25upx;
      padding-bottom: 38upx;
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
}
</style>

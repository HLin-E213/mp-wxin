<template>
  <layout :title="title"
          :showFooter="true"
          footerHeight="100"
  >
    <view class="content">
      <view class="good-body">
        <view
            class="goods-list-item"
            v-for="(goodItem, goodIndex) in goods"
            :key="goodIndex"
            @click="toogleRefundProduct(goodItem)"
        >
          <img
              class="goods-list-item__check-box"
              :src="refundIds.includes(goodItem.product_sku_id) ? checkImg : unCheckImg"
              alt="">
          <view class="goods-list-item__img-wrap">
            <img
                class="goods-list-item__img-wrap__img"
                :src="goodItem.img" alt="">
          </view>
          <view class="goods-list-item__text">
            <view class="goods-list-item__text__name-wrap">
              <view class="name">
                <view>{{ goodItem.name }}</view>
                <view class="mount-wrap">
                  <p>x{{ goodItem.mount }}</p>
                </view>
              </view>
            </view>
            <view class="amount">￥{{ goodItem.amount }}</view>
          </view>
        </view>
      </view>
    </view>
    <view slot="footer" class="footer-wrap">
      <view class="check-box" @click="toogleAll">
        <img class="check-box-img" :src="isAllSelected ? checkImg: unCheckImg" alt="">
        全选
      </view>
      <view class="to-pay" @click="confirm">确定</view>
    </view>
  </layout>
</template>

<script>

import layout from "@/components/layout/index.vue";
import { fenToYuan } from '../../../utils/money';

const subIMg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_sub.png';
const unSubIMg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_un_sub.png';
const unCheckImg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_unselect.png';
const checkImg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_selected.png';

export default {
  name: "refund",
  components: {
    layout,
  },
  computed: {
    getSubImg() {
      return function(mount){
        return mount < 1 ? unSubIMg: subIMg
      }
    },
    refundIds() {
      return this.selectedRefundProduct.map((product) => (product.product_sku_id));
    },
      isAllSelected() {
          return this.selectedRefundProduct.length === this.goods.length;
      }
  },
    onLoad(option) {
        this.orderDetail = JSON.parse(decodeURIComponent(option.item));
        console.log(this.orderDetail);
        const { orderProduct, product_title, order_no } = this.orderDetail;
        this.goods = orderProduct.map((product) => {
           const {
               product_images_url,
               product_sku_price,
               product_spec = [],
               product_id,
               product_sku_id,
               quantity,
               refund_order_product_info,
           } = product;
           const specTextArr = product_spec.map((spec) => (spec.product_spec_value.value)).join(',');
           const amount = fenToYuan(product_sku_price);
           const [yuan, jiao] = amount.split('.');
           return {
               img: product_images_url,
               amount: amount,
               mount: quantity,
               product_id,
               product_sku_id,
               name: `${product_title},${specTextArr}`,
               yuan,
               jiao,
               order_no,
               refund_order_product_info,
           }
        });
    },
  data () {
    return {
      title: '商品退款',
      checkImg,
      unCheckImg,
      orderDetail: {},
      order_no: '',
      goods: [],
      selectedRefundProduct: [],
    }
  },
    methods: {
        toogleRefundProduct(product) {
           if (product.refund_order_product_info) {
             return uni.showToast({
               title: '此商品在退款中，请无重复操作！',
               duration: 2000,
               icon: 'none',
               mask: true,
             });
           }
           const index = this.refundIds.indexOf(product.product_sku_id);
           if (index > -1) {
               this.selectedRefundProduct.splice(index, 1);
           } else {
               this.selectedRefundProduct = [
                   ...this.selectedRefundProduct,
                   product,
               ];
           }
        },
        toogleAll() {
            if (this.refundIds.length !== this.goods.length) {
                let goodsArr = [];
                this.goods.forEach((i, k) => {
                  if (!i.refund_order_product_info) {
                    goodsArr.push(i);
                  }
                });
                this.selectedRefundProduct = JSON.parse(JSON.stringify(goodsArr));
            } else {
                this.selectedRefundProduct = [];
            }
        },
        confirm() {
            if (!this.selectedRefundProduct.length){
                uni.showToast({
                    title: '请先选择需要退款的商品',
                    icon: 'none',
                    duration: 3000
                });
                return false;
            }
            uni.navigateTo({
                url: '/pages/shop/order/refundInfo?refundInfo=' +encodeURIComponent(JSON.stringify(this.selectedRefundProduct)),
            });
        },
    },
}
</script>

<style scoped lang="less">
.content {
  .good-body {
    margin-top: 15upx;
    padding: 30upx 20upx 0upx 20upx;
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
      margin-left: 28upx;
      padding-right: 23upx;
      position: relative;
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
        background: #F3F3F3;
        border-radius: 10px;
        &__img{
          height: 162upx;
          width: 140upx;
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
            flex: 1;
            display: flex;
            font-size: 26upx;
            color: #666666;
            justify-content: space-between;
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

}
.footer-wrap{
  height: 100%;
  padding: 0 38upx;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color:#999999;
  font-size: 24upx;
  .check-box{
    display: flex;
    .check-box-img{
      width: 30upx;
      height: 30upx;
      margin-right: 9upx;
    }
  }
  .total-wrap{
    display: flex;
    .total-label{
      font-size: 26upx;
      color: #333333;
    }
    .total-amount{
      color: #FD7600;
    }

  }
  .to-pay{
    width:200upx;
    height: 70upx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 35upx;
    color: #ffffff;
    background: #fd7600;
  }
}
</style>

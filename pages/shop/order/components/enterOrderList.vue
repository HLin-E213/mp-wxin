<template>
  <view class="order-list">
    <view class="order-item">
      <h1 class="order-title">{{ order_title }}</h1>
      <view class="order-good-list">
        <enter-order-item
           v-for="(item, index) of enter_list"
           :key="index"
          :order_img="item.img"
          :order_sku="item.sku"
          :unit_price="isPromotion(item)"
          :unit_num="item.num"
        >
        </enter-order-item>
      </view>
      <view class="order-money">
        <h1 class="order-money-title">{{ order_money_title }}</h1>
        <p class="order-money-p">￥{{ amount_int }}.<span class="order-money-s">{{ amount_float }}</span></p>
      </view>
      <view class="order-fare">
        <h1 class="order-fare-title">{{ order_fare_title }}</h1>
        <p class="order-fare-p">{{ fare }}.<span class="order-fare-s">{{ fare_float }}</span></p>
      </view>
      <view class="order-coupon">
        <h1 class="order-coupon-title">{{ order_coupon_title }}</h1>
        <img :class="coupon_class_img" :src="coupon_icon" alt="coupon_icon">
        <p v-if="activeShopCoupon.length > 0" :class="coupon_class_p" @click="gotoCoupon">{{ showCoupon(product) }}</p>
        <p v-else :class="coupon_class_p" @click="gotoCoupon">{{ coupon_desc }}</p>
      </view>
      <view class="order-count">
        <p class="order-count-p">￥{{ amount_count_int }}.<span class="order-count-s">{{ amount_count_float }}</span></p>
        <h1 class="order-count-title">{{ order_count_title }}</h1>
      </view>
    </view>
  </view>
</template>

<script>
import enterOrderItem from "./enterOrderItem";
import {mapState, mapMutations} from 'vuex';

export default {
  name: "enterOrderList",
  components: {
    enterOrderItem,
  },
  props: {
    item: {
      type: Object,
      default: {},
    },
    order_title: {
      type: String,
      default: '',
    },
    order_fare: {
      type: String,
      default: 0,
    },
    enter_list: {
      type: Array,
      default: [],
    },
    coupon: {
      type: Array,
      default: [],
    },
    product: {
      type: Object,
      default: {},
    }
  },
  computed: {
    ...mapState('orders',{
      'couponList':'couponList',
      'activeShopCoupon':'activeShopCoupon',
    }),
    isPromotion() {
      return function (obj) {
        let goodNum = 0,promotion_price = null;
        if (this.item.product_sku_list) {
          this.item.product_sku_list.forEach((i,j)=>{
            goodNum += Number(i.cart_sku_quantity);
          });
          if (this.item.productPromotion) {
            if (Number(goodNum) + Number(this.item.productPromotion.used_number) <= Number(this.item.productPromotion.limit_number)) {
              this.item.productPromotion.productPromotionSku.forEach((j, n) => {
                if (obj.product_sku_id === j.product_sku_id) {
                  if (Number(j.promotion_number - j.used_number) >= Number(obj.num)) {
                    promotion_price = j.promotion_price;
                  }
                }
              });
            }
          }
          if (promotion_price !== null) {
            obj.price = String(promotion_price / 100);
            return String(promotion_price / 100);
          }
        }
        return obj.price;
      }
    },
    amount: function () {
      let arr = this.enter_list, arrSum = 0, priceArr = [];
      if (arr.length > 0) {
        arr.map((item, index) => {
          priceArr.push(item.num * item.price);
        });
        priceArr.map((i, k) => {
          arrSum += i;
        });
        return arrSum.toFixed(2);
      }
      return 0;
    },
    amount_int: function () {
      let arr = this.amount.split('.');
      return arr[0] ? arr[0] : '0';
    },
    amount_float: function () {
      let arr = this.amount.split('.');
      return arr[1] ? arr[1] : '00';
    },
    fare: function () {
      let arr = this.order_fare.split('.');
      return arr[0] ? arr[0] : '0';
    },
    fare_float: function () {
      let arr = this.order_fare.split('.');
      return arr[1] ? arr[1] : '00';
    },
    coupon_desc: function () {
      if (this.coupon.length) {
        return '有' + this.coupon.length + '张可用优惠券';
      }
      return '暂无优惠券';
    },
    showCoupon() {
      return function(){
        this.isCoupon = true;
        let coupon_id = '',coupon = {};
        this.activeShopCoupon.forEach((i,k)=>{
          if (this.product.id == i.product_id) {
            coupon_id = i.coupon_id;
          }
        });
        this.couponList.forEach((i,k)=>{
          if (coupon_id == i.id) {
            coupon = i;
          }
        });

        if (coupon.type === '1') {
          return '无门槛立减' + coupon.coupon_amount / 100;
        }
        if (coupon.type === '2') {
          return '满' + coupon.coupon_limit_amount / 100 + '减' + coupon.coupon_amount / 100 + '元';
        }
        if (coupon.type === '3') {
          return '折扣' + coupon.coupon_amount;
        }
        if (this.coupon.length) {
          return '有' + this.coupon.length + '张可用优惠券';
        }
        return '暂无优惠券';
      }
    },
    coupon_class_p: function () {
      return this.isCoupon ? 'order-coupon-p ' : 'order-coupon-p none';
    },
    coupon_class_img: function () {
      return this.isCoupon ? 'order-coupon-img' : 'order-coupon-img img-none';
    },
    amount_count: function () {
      let n = Number(this.amount);
      if (this.activeShopCoupon.length > 0) {
        let coupon_id = '',coupon = {};
        this.activeShopCoupon.forEach((i, k) => {
          if (this.product.id == i.product_id) {
            coupon_id = i.coupon_id;
          }
        });
        this.couponList.forEach((i, k) => {
          if (coupon_id == i.id) {
            coupon = i;
          }
        });
        if (coupon.type) {
          if (coupon.type != '3') {
            n = n - Number(coupon.coupon_amount / 100);
          } else {
            n = (n * coupon.coupon_amount).toFixed(2);
          }
        }
      }
      if (n <= 0) {
        n = 0;
      }
      n = Number(n) + parseFloat(this.order_fare);
      this.amount_count_num = Number(n);
      // console.log(n,this.amount_count_num);
      return n;
    },
    amount_count_int: function () {
      let arr = this.amount_count.toString().split('.');
      return arr[0] ? arr[0] : '0';
    },
    amount_count_float: function () {
      let arr = this.amount_count.toString().split('.');
      return arr[1] ? arr[1] : '00';
    },
  },
  data: function () {
    return {
      // 优惠券跳转图标
      coupon_icon: 'https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png',
      order_money_title: '商品总金额',
      order_fare_title: '运费',
      order_coupon_title: '优惠券',
      order_count_title: '合计：',
      // 是否使用优惠券
      isCoupon: false,
      amount_count_num: null,
    }
  },
  mounted(){
    this.$emit('onCountTotal',Number(this.amount_count_num))
  },
  methods: {
    gotoCoupon() {
      this.$emit('gotoCoupon',);
    },
  },
}
</script>

<style scoped lang="less">
.order-list {
  .order-item {
    margin: 24upx 20upx;
    border-radius: 10upx;
    background-color: #fff;
    .order-title {
      font-size: 34upx;
      color: #333;
      padding-top: 33upx;
      margin-left: 25upx;
    }
    .order-good-list {

    }
    .order-money {
      margin-top: 35upx;
      margin-left: 24upx;
      overflow: hidden;
      padding-right: 24upx;
      .order-money-title {
        font-size: 28upx;
        color: #333;
        float: left;
      }
      .order-money-p {
        font-size: 32upx;
        color: #333;
        float: right;
      }
      .order-money-s {
        font-size: 28upx;
        color: #333;
      }
    }

    .order-fare {
      margin-top: 35upx;
      margin-left: 24upx;
      overflow: hidden;
      padding-right: 24upx;
      .order-fare-title {
        font-size: 28upx;
        color: #333;
        float: left;
      }
      .order-fare-p {
        font-size: 32upx;
        color: #333;
        float: right;
      }
      .order-fare-s {
        font-size: 28upx;
        color: #333;
      }
    }
    .order-coupon {
      overflow: hidden;
      border-bottom: solid 1upx rgba(153, 153, 153, 0.2);
      width: 94%;
      margin: 35upx auto;
      padding-bottom: 30upx;
      position: relative;
      .order-coupon-title {
        font-size: 28upx;
        color: #333;
        float: left;
      }
      .order-coupon-p {
        font-size: 26upx;
        color: #fd7600;
        float: right;
        padding-right: 25upx;
      }
      .order-coupon-img {
        width: 8upx;
        height: 16upx;
        right: 0;
        top: 12upx;
        position: absolute;
      }
      .none {
        color: #999;
      }
      .img-none {
        opacity: 0.5;
      }
    }

    .order-count {
      margin-left: 24upx;
      overflow: hidden;
      padding-right: 24upx;
      padding-bottom: 30upx;
      .order-count-title {
        font-size: 26upx;
        color: #333;
        float: right;
        line-height: 50upx;
      }
      .order-count-p {
        font-size: 34upx;
        color: #fd7600;
        float: right;
      }
      .order-count-s {
        font-size: 30upx;
        color: #fd7600;
      }
    }
  }
}
</style>

<template>
  <layout :title="title"
          :showFooter="true"
          footerHeight="100"
  >
    <view class="content">
    <!--地址-->
      <order-address
        :desc="desc"
        :name="name"
        :tel="tel"
        @gotoAddress="gotoAddress"
      >
      </order-address>

      <enterOrderList
        v-for="(item, index) of enter_list"
        :key="index"
        :item="item"
        :order_title="item.product.title"
        :order_fare="item.order_fare"
        :enter_list="item.good_list"
        :coupon="coupon_list"
        :product="item.product"
        v-on:gotoCoupon="gotoCoupon(item.product.id)"
        @onCountTotal="onCountTotal"
      >
      </enterOrderList>

    </view>
    <view slot="footer" class="footer">
      <view class="btn_bottom">
        <p class="btn_p_span">
          <span class="num">共 {{ order_num }} 件，</span>
          <span class="cont">合计：</span>
          <span class="money">￥{{ money_count_format[0] }}.</span>
          <span class="small-num">{{ money_count_format[1] ? money_count_format[1] : '00' }}</span>
        </p>
        <view class="btn_button">
          <button @click="submitOrder" type="primary">提交订单</button>
        </view>
      </view>
    </view>
    <Modal
        ref="Modal"
        :showTitle="false"
        content="商品价格发生变化是否继续支付？"
        @confirm="confirm"
        @cancel="close"
    ></Modal>
  </layout>
</template>

<script>
import Modal from '@/components/Modal';
import layout from "@/components/layout/index.vue";
import orderAddress from "./components/orderAddress";
import enterOrderList from "./components/enterOrderList";
import {mapState, mapMutations} from 'vuex';
import {confirmOrder, createOrder, payOrder} from '../../../api/shop/order';

export default {
  name: "enter",
  components: {
    layout,
    orderAddress,
    enterOrderList,
    Modal
  },
  computed: {
    ...mapState('orders', {
      'sku_type': 'sku_type',
      'sku_list': 'sku_list',
      'activeAddress': 'activeAddress',
      'activeShopCoupon': 'activeShopCoupon',
    }),
    // 订单件数
    order_num: function () {
      return this.enter_list.length;
    },
    money_count_format() {
      if (this.money_count !== null) {
        let arr = this.money_count.toString().split('.');
        return arr;
      } else {
        return ['0', '00'];
      }
    },
  },
  data() {
    return {
      title: '订单详情',
      desc: '',
      name: '',
      tel: '',
      // 选择的商品列表
      enter_list: [
        // {
        //   // 商品标题
        //   order_title: '伊利中老年奶粉',
        //   // 商品运费
        //   order_fare: '10.44',
        //   // 商品 规格/单价/数量 列表
        //   good_list: [
        //     {
        //       id: '1',
        //       img: 'https://docs.dajxyl.com/__pic/aIndQZjuweNW.png',
        //       sku: '中老年益生菌，1kg',
        //       price: '128.56',
        //       num: '1',
        //     },
        //     {
        //       id: '2',
        //       img: 'https://docs.dajxyl.com/__pic/L3W9IeTuefy6.png',
        //       sku: '中老年多维高钙，2kg',
        //       price: '198.56',
        //       num: '2',
        //     },
        //   ],
        //   // 对应商品选择的优惠券
        //   coupon: {
        //       // todo 优惠券数据结构未知
        //       type: 1,
        //     },
        // },
        // {
        //   order_title: '南极人短T恤',
        //   order_fare: '9.46',
        //   good_list: [
        //     {
        //       id: '3',
        //       img: 'https://docs.dajxyl.com/__pic/O96lHQzgARwU.png',
        //       sku: '黑色，XL',
        //       price: '99.56',
        //       num: '2',
        //     },
        //   ],
        // },
      ],
      product_freight_list: [],
      payInfo: {},
      orderID: '',
      pay_amount: 0,
      coupon_list: [],
      money_count: 0,
      amountArr: [],
    }
  },
  mounted() {
  },
  onShow() {
    this.enter_list = [];
    this.GetActiveAddress(this.activeAddress);
    this.confirmOrder(this.sku_type, this.sku_list);
    this.money_count = 0;
  },
  methods: {
    ...mapMutations('orders',{
      'setShopCouponList':'setShopCouponList',
      'setActiveCoupon': 'setActiveCoupon',
    }),
    onCountTotal(n) {
      this.money_count += Number(n);
    },
    gotoAddress(){
      this.money_count = 0;
    },
    confirmOrder: function (sku_type, sku_list) {
      const ret = confirmOrder(sku_type, sku_list);
      ret.then((value) => {
        let info = value.data.data.info;
        const { address } = info;
        if (!this.activeAddress) {
            this.GetActiveAddress(address);
            this.$store.commit('orders/setShopSelectAddress', address);
        }
        this.product_freight_list = info.product_freight_list;
        info.cart_list.forEach((i, k) => {
          // 运费
          info.cart_list[k].order_fare = this.bigTotalYunfei(i);
          // 规格列表
          info.cart_list[k].good_list = this.getGoodList(i);
          // 优惠券
          // todo
          info.cart_list[k].coupon = {type : 0};
        });
        this.enter_list = info.cart_list;
        this.coupon_list = info.coupon_list;
      });
    },
    GetActiveAddress(activeAddress){
      const { desc = '', name = '', tel = '' } = activeAddress || {};
      this.desc = desc;
      this.name = name;
      if (tel) {
        this.tel = (tel.substr(0, 3) + '****' + tel.substr(7, 11));
      }
    },
    bigTotalYunfei: function(item) {
      let amount = '0.00';
      let yunfei = this.product_freight_list;
      let addressid = this.activeAddress.province_city_id;
      for(let i = 0; i < yunfei.length; i++){
        let yun = yunfei[i];
        if(item.product.id === yun.product_id){
          let product_freight = yun.product_freight;
          for(let j = 0; j<product_freight.length; j++){
            let reight =  product_freight[j];
            let area_id_arr = reight.area_id;
            if(area_id_arr.indexOf(addressid) !== -1){
              amount = reight.amount / 100;
              break;
            }
          }
        }
      }
      return amount.toString();
    },
    getGoodList: function(item) {
      let good_list = [];
      item.product_sku_list.forEach((i,k) => {
        let title = ''
        i.product_spec.forEach((j,g)=>{
          title += j.product_spec_value.value + '，';
        });
        title = title.substr(0, title.length - 1);
        good_list.push({
          product_sku_id: i.id,
          img: item.productImages.url,
          sku: title,
          price: i.price / 100 + '',
          num: i.cart_sku_quantity,
        });
      });
      return good_list;
    },
    submitOrder: function () {
      if (!(Object.keys(this.activeAddress)).length) {
        uni.showToast({
          title: '请添加收货地址',
          duration: 2000,
          icon: 'none',
        });
        return false;
      }
      uni.showLoading({
        title: '正在调起订单支付...'
      });
      const ret = createOrder(this.sku_type,this.sku_list,this.activeAddress.id,this.activeShopCoupon);
      ret.then((value) => {
        if (value.data.data.info.pay_amount === 0) {
          return uni.navigateTo({
            url: '/components/statusPayment/shopPayStatus?pay_amount=' + 0,
          });
        }
        this.order_no = value.data.data.info.order_no;
        const payRet = payOrder(this.order_no);
        payRet.then((v)=>{
          console.log(v);
          this.payInfo = v.data.data.info.pay_info;
          this.pay_amount = v.data.data.info.pay_amount;
          uni.hideLoading();
          this.$store.commit('orders/setActiveCoupon', []);
          /*test 成功支付*/
          // return uni.navigateTo({
          //   url: '/components/statusPayment/shopPayStatus?pay_amount=' + this.pay_amount,
          // });
          /*test */

          if (v.data.data.info.is_price_change) {
            this.$refs.Modal.open();
            return false;
          }
          this.wxPay();
        });
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
          uni.showToast({
            title: '您取消了付款！',
            duration: 2000,
            icon: 'none',
            mask: true,
          });
          return uni.redirectTo({
            url: '/pages/orderList/orderList?type=shop',
          });
        }
      });
    },
    close() {
      this.$refs.Modal.close();
    },
    confirm() {
      this.wxPay();
      this.$refs.Modal.close();
    },
    gotoCoupon(id) {
      if (this.coupon_list.length > 0) {
        this.money_count = 0;
        this.$store.commit('orders/setShopCouponList', this.coupon_list);
        return uni.navigateTo({
          url: '/pages/listCoupon/shopListCoupon?productId=' + id,
        });
      }
    },
  },
}
</script>

<style scoped lang="less">
.content {
}

.footer {
  height: 100%;
  .btn_bottom {
    height: 100%;
    display: flex;
    padding: 0 44rpx;
    align-items: center;
    justify-content: space-between;
    .btn_p_span {
      display: inline;
      .num {
        font-size: 26rpx;
        color: #999;
      }
      .cont {
        font-size: 26rpx;
        color: #333;
      }
      .money {
        font-size: 32rpx;
        color: #fd7600;
      }
      .small-num {
        font-size: 28rpx;
        color: #fd7600;
      }
    }
    .btn_button {
      display: inline;
      margin-left: 56rpx;
    }
    .btn_button button {
      display: inline;
      width: 200rpx;
      height: 70rpx;
      background: #fd7600;
      border-radius: 70rpx;
      padding: 21rpx 41rpx;
      font-size: 30rpx;
      border: none;
    }
    .btn_button button:after {
      border: none !important;
    }
  }
}
</style>

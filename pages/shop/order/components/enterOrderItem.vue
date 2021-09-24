<template>
  <view class="order-good-item">
    <img class="order-good-item-img" :src="order_img" alt="">
    <p class="order-good-item-p">{{ order_sku }}</p>
    <p class="order-good-item-unit">{{ unit_name }}<span class="order-good-item-money">￥{{ price }}.</span><span class="order-good-item-money-s">{{ price_float }}</span></p>
    <p class="order-good-item-num">{{ num_name }}{{ unit_num }}</p>
  </view>
</template>

<script>
export default {
  name: "enterOrderItem",
  props: {
    order_img: {
      type: String,
      default: '',
    },
    order_sku: {
      type: String,
      default: '',
    },
    unit_price: {
      type: String,
      default: '0',
    },
    unit_num: {
      type: String,
      default: '1',
    }
  },
  computed: {
    price: function () {
      let arr = this.unit_price.split('.');
      return arr[0] ? arr[0] : '0';
    },
    price_float: function () {
      let arr = this.unit_price.split('.');
      return arr[1] ? arr[1] : '00';
    },
  },
  data: function () {
    return {
      unit_name: '单价：',
      num_name: '数量：',
    }
  }
}
</script>

<style scoped lang="less">
.order-good-item {
  padding: 5upx 0;
  border-bottom: solid 1upx rgba(153, 153, 153, 0.2);
  width: 95%;
  margin: 0 auto;
  height: 226upx;
  .order-good-item-img {
    width: 180upx;
    height: 180upx;
    float: left;
    margin-top: 26upx;
  }
  .order-good-item-p {
    font-size: 26upx;
    color: #666;
    margin-left: 220upx;
    margin-top: 45upx;
  }
  .order-good-item-unit {
    font-size: 26upx;
    color: #666;
    margin-left: 220upx;
    margin-top: 10upx;
    .order-good-item-money {
      font-size: 30upx;
      color: #fd7600;
    }
    .order-good-item-money-s {
      font-size: 26upx;
      color: #fd7600;
    }
  }
  .order-good-item-num {
    font-size: 26upx;
    color: #666;
    margin-left: 220upx;
    margin-top: 10upx;
  }
}
</style>

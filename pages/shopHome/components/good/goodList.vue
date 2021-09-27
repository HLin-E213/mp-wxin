<template>
  <view class="good-list">
    <view class="good-list-img" @click="gotoInfo">
      <image class="goods-list-sample" mode="aspectFill" :src="goodImg"></image>
      <template v-if="isPromotion">
        <img class="goods-list-hot" :src="promotion_img" alt="goodTitle">
      </template>
    </view>
    <view class="good-list-desc" @click="gotoInfo">
      <h1>{{ title }}</h1>
      <p>{{ goodTitleDesc.length > 22 ? goodTitleDesc.slice(0,22) + '...' : goodTitleDesc }}</p>
    </view>
    <view class="good-list-price">
      <span class="price-unit">￥</span><span class="price">{{ money }}</span><span class="unit">/{{ unit }}</span>
      <span @click="openSku">
        <img class="shopping-cart-img" src="https://admin.dajxyl.com/oss?path=img/ShoppingCartSmall.png" alt="点击购买">
      </span>
    </view>
  </view>
</template>

<script>
export default {
  name: "goodList",
  props: {
    goodID: {
      type: String,
      default: null,
    },
    // 是否是促销
    isPromotion: {
      type: Boolean,
      default: false,
    },
    // 商品图片
    goodImg: {
      type: String,
      default: ""
    },
    // 商品标题
    goodTitle: {
      type: String,
      default: ""
    },
    // 商品副标题形容
    goodTitleDesc: {
      type: String,
      default: ""
    },
    // 商品价格
    money: {
      type: Number,
      default: ""
    },
    // 商品单位
    unit: {
      type: String,
      default: ""
    },
  },
  data: function(){
    return {
      // 促销的贴图
      promotion_img: 'https://admin.dajxyl.com/oss?path=img/ServicePromotion.png',
    }
  },
  computed: {
    title() {
      return this.goodTitle.length > 8 ? this.goodTitle.slice(0, 8) + '...' : this.goodTitle;
    },
  },
  methods: {
    // 跳转商品详情
    gotoInfo: function () {
      return uni.navigateTo({
        url: '/pages/shop/detailsGood/index?id=' + this.goodID,
      });
    },
    openSku(){
      this.$emit('openSku');
    },
  }
}
</script>

<style lang="less" scoped>
.good-list{
  width: 342upx;
  height: 570upx;
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  background: #fff;
  border-radius: 6upx;
  margin-top: 26upx;
  margin-left: 20upx;
}
.good-list-img{
  position: relative;
  width: 342upx;
  height: 342upx;
  .goods-list-sample{
    width: 342upx;
    height: 342upx;
    border-radius: 6upx;
  }
  .goods-list-hot{
    position: absolute;
    top: 0;
    left: 0;
    width: 152upx;
    height: 152upx;
   }
}
.good-list-desc h1{
  width: 300upx;
  font-size: 30upx;
  margin-top: 12upx;
  margin-left: 15upx;
  margin-bottom: 12upx;
  color: #333;
}
.good-list-desc p{
  font-size: 26upx;
  margin-left: 15upx;
  height: 64upx;
  color: #666;
}
.price{
  font-weight: bold;
}
.price-unit{
  font-size: 24upx;
  color: #FD7600;
}
.good-list-price{
  margin-left: 10upx;
  margin-bottom: 11upx;
  width: 300upx;
}
.good-list-price .price{
  font-size: 36upx;
  color: #FD7600;
}
.good-list-price .unit{
  font-size: 24upx;
}
.shopping-cart-img{
  width: 48upx;
  height: 48upx;
  float: right;
  margin-top: 10upx;
}
</style>

<template>
  <view class="address">
    <view class="address-view" @click="gotoAddress">
      <img class="p-img" :src="address_img" :alt="title">
      <p class="p-title">{{ title }}</p>
      <p class="p-desc"> {{ desc }}
        <img class="p-desc-img" :src="more" :alt="more">
      </p>
      <p class="p-name">{{ name }}</p>
      <span class="span-tel">{{ tel }}</span>
    </view>
  </view>
</template>

<script>
export default {
  name: "orderAddress",
  props: {
    desc: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    tel: {
      type: String,
      default: '',
    }
  },
  data: function () {
    return {
      address_img: 'https://admin.dajxyl.com/oss?path=img/orderAddress.png',
      more: 'https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png',
      title: '收货地址',
    }
  },
  methods: {
    gotoAddress: function () {
      this.$emit('gotoAddress','0');
      return uni.navigateTo({
        url: '/pages/managementAddress/managementAddress?type=shop'
      })
    },
  }
}
</script>

<style scoped lang="less">
.address {
  .address-view {
    margin: 20upx 24upx;
    background-color: #fff;
    border-radius: 10upx;
    position: relative;
    .p-img {
      width: 30upx;
      height: 30upx;
      margin-top: 27upx;
      margin-left: 18upx;
      margin-bottom: -5upx;
    }
    .p-title {
      display: inline-block;
      font-size: 28upx;
      font-weight: 400;
      color: #333;
    }
    .p-desc {
      font-size: 32upx;
      color: #333;
      width: 80%;
      margin-left: 25upx;
    }
    .p-desc-img {
      width: 14upx;
      height: 24upx;
      float: right;
      position: absolute;
      right: 45upx;
    }
    .p-name {
      margin-left: 24upx;
      font-size: 28upx;
      color: #333;
      display: inline-block;
      margin-bottom: 30upx;
    }
    .span-tel {
      margin-left: 25upx;
      font-size: 28upx;
      color: #666;
    }
  }
}
</style>

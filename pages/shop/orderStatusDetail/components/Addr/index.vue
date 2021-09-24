<!--
* @Description: 订单状态详情中的地址信息
* @Author: mahui
* @Date: 2020/11/14 9:16 PM
-->
<template>
  <view class="address-detail-wrap">
    <p class="user-info">
      <image class="icon" src="https://admin.dajxyl.com/oss?path=img/dingwei-4@2x.png"></image>
      <span class="name">{{ addrInfo.name }}</span>
      <span class="phone">{{ addrInfo.tel && addrInfo.tel.substr(0,3) + '****' + addrInfo.tel.substr(7, 11) }}</span>
    </p>
    <p class="address-info">{{ addrInfo.province + addrInfo.city + addrInfo.desc }}</p>
  </view>

</template>

<script>
    export default {
        props: {
            addrInfo: {
                required: false,
                type: Object,
                default: () => ({}),
            }
        },
        name: 'addr',
        data() {
            return {};
        },
        methods: {},
    };
</script>

<style scoped lang="less">
  .address-detail-wrap{
    background-color: #ffffff;
    color: #333333;
    padding: 24upx 30upx 22upx 25upx;
    border-radius: 10upx;
    .user-info{
      display: flex;
      font-size: 28upx;
      align-items: center;
      flex-wrap: wrap;
      .icon{
        width: 30upx;
        height: 30upx;
      }
      .name{
        padding-left: 18upx;
      }
      .phone{
        padding-left: 54upx;
      }
    }
    .address-info{
      padding-top: 46upx;
      color: #666666;
      font-size: 26upx;
      line-height: 36upx;
    }
  }

</style>

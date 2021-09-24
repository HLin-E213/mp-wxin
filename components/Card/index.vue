<!--
* @Description:
* @Author: mahui
* @Date: 2020/11/6 2:51 PM
-->
<template>
  <view class="card-wrap">
    <view class="card-title" @click="$emit('clickTitle')" v-if="title.length">
      <view class="title-content-wrap">
        <img
            v-if="showSelect"
            class="card-title__check-box"
            :src="selectImg" alt=""
        >
        <view class="card-title__text">{{ title }}</view>
      </view>
      <view class="extra"> <slot name="extra"></slot></view>
    </view>
    <view v-else class="card-title" @click="$emit('clickTitle')">
      <slot name="title"></slot>
    </view>
    <view class="card-content">
      <slot name="content"></slot>
    </view>
    <view class="card-footer" v-if="showFooter">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script>
    export default {
        name: 'shop-card',
        props: {
            title: {
                required: false,
                type: String,
                default: ''
            },
            showSelect: {
                type: Boolean,
                default: false
            },
            selectImg: {
                type: String,
                default: ''
            },
            showFooter: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {};
        },
        methods: {},
    };
</script>

<style scoped lang="less">
  .card-wrap{
    padding: 0 23upx 0 18upx;
    box-shadow: 0 0 15upx 0 rgba(169, 169, 169, 0.2);
    border-radius: 10upx;
    background-color: #ffffff;
    .card-title{
      position: relative;
      display: flex;
      min-height: 94upx;
      align-items: center;
      justify-content: space-between;
      .title-content-wrap{
        flex: 1;
        display: flex;
        align-items: center;
      }
      &__check-box{
        width: 30upx;
        height: 30upx;
        margin-right: 20upx;
      }
      &__text{
        flex: 1;
        font-size: 34upx;
        line-height: 33upx;
      }
    }
    .card-title::after{
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: rgba(153, 153, 153, .2);
    }
    .card-content{

    }
    .card-footer{
      position: relative;

    }
    .card-footer::after{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: rgba(153, 153, 153, .2);
    }
  }

</style>

<!--
* @Description:
* @Author: mahui
* @Date: 2021/1/19 7:35 PM
-->
<template>
  <view class="trend-list-item__title-wrap">
    <view class="trend-list-item__title">
      <img
          class="trend-list-item__title-pic"
          :src="user.pic"
          alt=""
          @click.stop.prevent="clickHead"
      />
      <view class="trend-list-item__title-info">
        <view>
          <view>{{ user.nickname || '' }}</view>
          <view class="trend-list-item__title-info-date">{{ formatTime || '' }}</view>
        </view>
      </view>
    </view>
    <view class="extra" v-if="extraText" @click="$emit('onClickExtra')">{{extraText}}</view>
    <view v-else class="extra" :style="extraStyle">
      <slot name="extra"></slot>
    </view>
  </view>
</template>

<script>
  import { showTime } from '../../../../../service';

  export default {
        name: 'itemTitlePlay',
        props: {
            extraStyle: {
                type: Object,
                default: () => ({}),
            },
            user: {
                type: Object,
                default: () => ({}),
            },
            time:{
                default: '',
            },
            extraText:{
                default: '',
            },
        },
        data() {
            return {};
        },
        computed: {
            formatTime() {
                return this.time ? showTime(this.time) : '';
            },
        },
        methods: {
            clickHead() {
              this.$emit('clickTrendListItemHead', this.user.uid)
            },
        },
    };
</script>

<style scoped lang="less">
  .trend-list-item__title-wrap{
    display: flex;
    justify-content: space-between;
    .trend-list-item__title{
      display: flex;
      align-items: center;
      &-pic{
        width: 62rpx;
        height: 62rpx;
        border-radius: 50%;
      }
      &-info{
        color: #333333;
        font-size: 32rpx;
        margin-left: 18rpx;
        &-date{
          margin-top: 15rpx;
          font-size: 22rpx;
          color: #666666;
        }
      }
    }
    .extra{
      display: flex;
      align-items: center;
      margin-right: 10rpx;
      font-size: 28rpx;
      color: #333333;
      z-index: 999;
      line-height: 98rpx;
    }
  }

</style>

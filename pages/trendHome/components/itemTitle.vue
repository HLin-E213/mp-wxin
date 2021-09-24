<!--
* @Description:
* @Author: mahui
* @Date: 2021/1/19 7:35 PM
-->
<template>
  <div class="trend-list-item__title-wrap">
    <div class="trend-list-item__title">
      <img
          class="trend-list-item__title-pic"
          :src="user.pic"
          alt=""
          @click.stop.prevent="clickHead"
      />
      <div class="trend-list-item__title-info">
        <div>
          <div>{{ user.nickname || '' }}</div>
          <div class="trend-list-item__title-info-date">{{ formatTime || '' }}</div>
        </div>
      </div>
    </div>
    <div class="extra" v-if="extraText" @click="$emit('onClickExtra')">{{extraText}}</div>
    <div v-else class="extra" :style="extraStyle">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script>
  import { showTime } from '../../../service';

  export default {
        name: 'itemTitle',
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
        width: 98rpx;
        height: 98rpx;
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

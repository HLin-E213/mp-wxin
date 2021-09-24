<!--
* @Description: 
* @Author: mahui
* @Date: 2020/11/16 8:21 PM
-->
<template>
  <view class="time-line-container">
    <view
        class="time-line-wrap"
        v-for="(item, index) in info"
        :key="index"
    >
      <view class="line-date-wrap">
        <view class="date">{{ item.date }}</view>
        <view class="time">{{ item.time }}</view>
      </view>
      <view class="line-body">
        <img class="dot" :class="{'dot-sub': item.isSub}" :src="getDotImg(item)" alt="">
        <view class="line-body-title" v-if="item.title.length">{{ item.title }}</view>
        <view class="line-body-content">{{ item.content }}</view>
      </view>
    </view>
  </view>
  
</template>

<script>
const dotImg = 'https://admin.dajxyl.com/oss?path=img/nonePort@2x.png';
const dotActiveImg = 'https://admin.dajxyl.com/oss?path=img/dianliangport.png';
const smallDot = 'https://admin.dajxyl.com/oss?path=img/smallportNone.png';
const smallDotActiveImg = 'https://admin.dajxyl.com/oss?path=img/smallport.png';
export default {
    name: 'timing-line',
    props: {
        info: {
            required: true,
            type: Array,
            default: () => ([]),
        }
    },
    computed: {
        getDotImg() {
            return function(item) {
                let dot = dotImg;
                if (item.isSub) {
                    dot = item.active ? smallDotActiveImg : smallDot;
                } else {
                    dot = item.active ? dotActiveImg : dotImg;
                }
                return dot;
            }
        },
    },
    data() {
        return {};
    },
    methods: {},
};
</script>

<style scoped lang="less">
  .time-line-wrap{
    display: flex;
    padding: 0 40upx 0 25upx;
    .line-date-wrap{
      text-align: right;
      color: #999999;
      line-height: 36upx;
      margin-right: 30upx;
      min-width: 75upx;
      .date{
        font-size: 26upx;
      }
      .time{
        font-size: 24upx;
      }
    }
    .line-body{
      position: relative;
      flex: 1;
      padding: 0 0 60upx 26upx;
      font-weight: 400;
      color: #999999;
      line-height: 36upx;
      border-left: 2upx dashed rgba(153, 153, 153, .2  );
      .line-body-title{
        font-size: 26upx;
        padding-bottom: 19upx;
      }
      .line-body-content{
        font-size: 24upx;
      }
    }
    .dot {
      position: absolute;
      top: 0;
      left: 0;
      width: 30upx;
      height: 30upx;
      transform: translateX(-50%);
      z-index: 9999;
      background-color: #FFFFFF;
    }
    .dot-sub{
      width: 20upx;
      height: 20upx;
    }
  }
  .time-line-wrap:last-of-type{
    .line-body{
      border-left: none;
    }
  }

</style>
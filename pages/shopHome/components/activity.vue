<template>
  <view class="activity">
    <view class="act-title">
      <view class="tit-left">限时抢购</view>
      <view class="tit-right">
        <view>新人专区</view>
        <view class="price-intro">低脂1元购</view>
      </view>
    </view>
    <view class="act-content">
<!--      <image class="preview-img" src="https://admin.dajxyl.com/oss?path=img/WechatIMG1047041.jpeg" mode="" @click="gotoInfo()"></image>-->
      <swiper
          class="swiper"
          circular
          :autoplay="autoplay"
          :interval="interval"
          :duration="duration"
          :previous-margin="previous_margin"
          :next-margin="next_margin"
          :style="{height: height}"
      >
        <swiper-item v-for="(item, k) in lists" :key="k">
          <view class="category-box">
            <view v-for="(e, i) in item" class="boc" :key="i">
              <view class="preview-img">
                <image class="preview-img" :src="e && e.img_src" mode="" @click="gotoInfo(e)" v-if="e && e.img_src"></image>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
export default {
  name: "activity",
  data() {
    return {
      height: '220rpx',
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      previous_margin: '0',
      next_margin: '0',
      img_list: [
        {
          img_src: 'https://admin.dajxyl.com/oss?path=img/WechatIMG1047041.jpeg',
          name: '生活用品'
        },{
          img_src: 'https://admin.dajxyl.com/oss?path=img/WechatIMG1047041.jpeg',
          name: '生活用品'
        },{
          img_src: 'https://admin.dajxyl.com/oss?path=img/WechatIMG1047041.jpeg',
          name: '生活用品'
        },{
          img_src: 'https://admin.dajxyl.com/oss?path=img/WechatIMG1047041.jpeg',
          name: '生活用品'
        }
      ]
    }
  },
  computed: {
    lists() {
      let arr = [];
      // 赋值给另一个数组
      let newarr = arr.concat(this.img_list);
      // 处理新数组，原数组不变
      // 打印结果
      let len = newarr.length;
      let n = 2
      let num = len % 2 === 0 ? len / 2 : Math.ceil(len / 2);
      let arr2 = [];
      for (let i = 0; i < num; i++) {
        let temp = newarr.slice(i * n, i * n + n);
        arr2.push(temp);
      }
      return arr2;
    }
  },
  methods: {
    gotoInfo(obj) {}
  }
}
</script>

<style lang="scss" scoped>
.activity{
  margin: 16rpx;
  padding: 26rpx;
  background-color: #FFECEC;
  border-radius: 10rpx;
  .act-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 34rpx;
    padding-bottom: 20rpx;
    .tit-right{
      display: flex;
      align-items: center;
      .price-intro{
        color: #ffffff;
        text-align:center;
        padding: 10rpx 15rpx;
        background: #FD7C09;
        font-size: 24rpx;
        border-top-left-radius: 30rpx;
        border-bottom-right-radius: 30rpx;
        margin-left: 10rpx;
      }
    }
  }
  .act-content{
    width: 100%;
    height: 100%;
  }
}
.category-box{
  display: flex;
  justify-content: space-around;
  .boc {
    width: calc(50% - 13rpx);
  }
}
.preview-img{
  width: 100%;
  height: 220rpx;
  border-radius: 10rpx;
}
</style>
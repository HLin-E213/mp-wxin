<template>
  <view id="main" class="empty-container" :style="{height: `${hTop}px`}">
    <img :src="imgSrc" mode="aspectFill" alt="空数据.png" />
    <text class="i-desc">暂无数据</text>
  </view>
</template>

<script>
import imgSrc from '@/static/empty.png';
export default {
  name: 'empty-data',
  data() {
    return {
      imgSrc: imgSrc,
      hTop: 0
    };
  },
  created(){
    let windowH = 0
    uni.getSystemInfo({
      success: function (res) {
        windowH = res.windowHeight
      }
    });
    const query = uni.createSelectorQuery().in(this);
    query.select('#main').boundingClientRect(data => {
      this.hTop = windowH - data.top
    }).exec();
  },
};
</script>

<style lang="scss" scoped>
.empty-container{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  .i-desc{
    color: #999999;
    font-size: 34rpx;
    font-family: PingFangSC-Regular;
  }
}
</style>

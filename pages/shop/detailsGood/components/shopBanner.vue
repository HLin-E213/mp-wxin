<template>
  <view class="page-section">
      <view class="page-section-spacing">
        <!-- #ifdef MP-WEIXIN -->
        <swiper class="swiper"
                circular
                @change="swiperChange"
                :autoplay="autoplay"
                :interval="interval"
                :duration="duration"
                :previous-margin="previous_margin"
                :next-margin="next_margin"
                :style="{height: `${imgheights[currentSwiper]}rpx`}"
        >
        <!-- #endif -->

          <!-- #ifdef H5 -->
          <swiper class="swiper"
                  circular
                  @change="swiperChange"
                  :autoplay="autoplay"
                  :interval="interval"
                  :duration="duration"
                  :previous-margin="previous_margin"
                  :next-margin="next_margin"
          >
            <!-- #endif -->
        <swiper-item v-for="(i,k) in img_list" :key="k" @click="$emit('previewImage', i.img_src, img_list)">
          <!-- #ifdef H5 -->
          <img class="preview-img" mode="widthFix" :src="i && i.img_src" alt="">
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <img class="preview-img" mode="widthFix" :data-id='k' :src="i.img_src" alt="" @load="imageLoad">
          <!-- #endif -->
        </swiper-item>
        </swiper>
        <view class="dots-wrap" v-if="indicatorDots && img_list.length !== 1">
          <block v-for="(imgItem, index) in img_list" :key="index">
            <view class="dot" :class="{'dot-active': index === currentSwiper}"></view>
          </block>
        </view>
      </view>
    <view class="wx-share" >
      <button class="share-btn" open-type="share" size="mini"><view class="iconfont icon-fenxiangshangpin"></view>分享</button>
    </view>
    </view>
</template>

<script>
export default {
  name: "shopBanner",
  props: {
    ids: {
      type: Number,
      default: 1
    },
    img_list: {
      type: Array,
      default: () => {
         return [];
      }
    }
  },
  watch: {
    ids: {
      handler() {
        // console.log(this.ids);
      },
      immediate: true
    },
    img_list: {
      handler() {
        // console.log(this.img_list);
      },
      immediate: true
    }
  },
  data() {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      previous_margin: '0',
      next_margin: '0',
      currentSwiper: 0,
      imgheights: [],
      statusBarHeight: 0
    }
  },
  onShow(){
    const SystemInfo = wx.getSystemInfoSync();
    this.statusBarHeight = SystemInfo.statusBarHeight
  },
  methods: {
    changeIndicatorDots(e) {
      console.log(e);
      this.indicatorDots = !this.indicatorDots
    },
    swiperChange(e) {
      this.currentSwiper = e.detail.current;
    },
    imageLoad (e) { // 获取图片真实宽度
          const imgWidth = e.detail.width;
          const imgHeight = e.detail.height;
          const ratio = imgWidth / imgHeight;
          const imgRealHeight = 750 / ratio;
          this.imgheights[e.target.dataset.id] = imgRealHeight;
          this.$forceUpdate();
      },
  },
}
</script>
<style>
.swiper img {
  width: 100%;
  height: auto;
}
</style>
<style scoped lang="less">
  .page-section{
    width: 100%;
    position: relative;
    .page-section-spacing{
      width: 100%;
    }
  }
  // #ifdef MP-WEIXIN
.swiper {
  height: auto;
  width: 100%;
  overflow: hidden;
  transform: translateY(0);
  z-index: 10;
  .preview-img {
    overflow: hidden;
  }
}
// #endif

// #ifdef H5
.swiper {
  height: 465upx;
  width: 100%;
  overflow: hidden;
  transform: translateY(0);
  z-index: 10;
  .preview-img {
    overflow: hidden;
  }
}
// #endif
.page-section-spacing {
  position: relative;
  overflow: hidden;
}
.dots-wrap {
  position: absolute;
  z-index: 9999;
  left: 332upx;
  bottom: 13upx;
  display: flex;
  .dot {
    width: 6upx;
    height: 6upx;
    border-radius: 50%;
    background-color: #c3c3c3;
    margin-left: 5upx;
  }
  .dot-active {
    width: 26upx;
    height: 6upx;
    border-radius: 3upx;
    background: #fd7600;
  }
  .dot:nth-of-type(1) {
    margin-left: 0;
  }
}
  .wx-share {
    width: 119rpx;
    height: 47rpx;
    font-family: PingFang SC;
    position: absolute;
    top: 30rpx;
    right: 30rpx;
    z-index: 9999;
    .iconfont {
      margin-right: 10rpx;
    }
  }
  @font-face {
    font-family: "iconfont"; /* Project id 2787414 */
    src: url('//at.alicdn.com/t/font_2787414_fx7qwcsbcve.woff2?t=1632470449916') format('woff2'),
    url('//at.alicdn.com/t/font_2787414_fx7qwcsbcve.woff?t=1632470449916') format('woff'),
    url('//at.alicdn.com/t/font_2787414_fx7qwcsbcve.ttf?t=1632470449916') format('truetype');
  }
  .iconfont {
    font-family: 'iconfont' !important;
    font-size: 16px;
    font-style: normal;
    fill: currentColor;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .icon-fenxiangshangpin:before {
    content: '\e655';
  }
  /deep/ .uni-searchbar__box {
    border-radius: 36rpx !important;
  }
  .share-btn{
    width: 100%;
    height: 100%;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fd7600;
    border: none;
    background: rgba(253, 118, 0, 0.1);
    border-radius: 23rpx;
    font-size: 26rpx;
    &:after{
      border: none;
    }
  }
</style>

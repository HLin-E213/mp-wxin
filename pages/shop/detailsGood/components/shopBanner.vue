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
    }
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
</style>

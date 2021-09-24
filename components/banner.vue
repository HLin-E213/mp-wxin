<!-- 云养老首页轮播图 -->
<template>
  <view>
    <view class="uni-padding-wrap">
      <view class="page-section swiper">
        <view class="page-section-spacing">
          <swiper
              class="swiper"
              circular
              @change="swiperChange"
              :autoplay="autoplay"
              :interval="interval"
              :duration="duration"
              :previous-margin="previous_margin"
              :next-margin="next_margin"
              :style="{height: height}"
          >
            <swiper-item v-for="(i,k) in img_list" :key="k">
              <image class="preview-img" :src="i && i.img_src" mode="" @click="gotoInfo(i)"></image>
            </swiper-item>
          </swiper>
		  <view class="dots-wrap" v-if="indicatorDots">
		        <block v-for="(imgItem, index) in img_list" :key="imgItem && imgItem.img_src">
		          <view class="dot" :class="{'dot-active': index === currentSwiper}"></view>
		        </block>
		   </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {rotationPicture} from '../api/index.js';
import {gotoServiceInfo} from "../service";
import {mapState, mapMutations} from 'vuex';

export default {
  props: {
    ids: {
      type: Number,
      default: 0
    },
    height: '',
    img_list: {
      type: Array,
      default: () => {
        []
      }
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
    }
  },
  watch: {
    ids: {
      handler() {
        console.log(this.ids)
      },
      immediate: true
    },
    img_list: {
      handler() {
        // console.log(this.img_list)
        this.img_list = this.img_list;
      },
      immediate: true
    }
  },
  created() {
    // this.get_rotation();
  },
  onLoad() {
  },
  methods: {
    ...mapMutations('serviceinfo', {
      'setData': 'setData',
    }),
    ...mapMutations(['setH5']),
    changeIndicatorDots(e) {
      this.indicatorDots = !this.indicatorDots
    },
	swiperChange(e) {
		this.currentSwiper = e.detail.current;
	 },
    gotoInfo: function(obj){
      let that = this;
      if (obj.payload.type === 3) {
        that.setH5(obj.payload.id);
        uni.navigateTo({
          url: '/pages/main/webView',
        });
      }
      if (obj.payload.type === 20) {
        that.setH5(obj.payload.id);
        uni.navigateTo({
          url: '/pages/main/webView',
        });
      }
      if (obj.payload.type === 4) {
        uni.navigateTo({
          url: '/pages/oldWorldPackage/articleDetail?aid=' + obj.payload.id,
        });
      }
      if (obj.payload.type === 40) {
        uni.navigateTo({
          url: `/pages/oldWorldPackage/playVideo/index?vid=${obj.payload.id}`,
        });
      }
      return gotoServiceInfo(obj,function(e){
        that.setData(e);
      });
    }
  }
}
</script>

<style>
.swiper image {
  width: 100%;
  /* position: absolute; */
  height: 100%;
  border-radius: 20upx;
}
swiper-item{
	border-radius: 20upx;
}
</style>
<style lang="less" scoped>
  .swiper{
    height: 285rpx;
    width: 100%;
    overflow: hidden;
    transform: translateY(0);
    .preview-img{
      overflow: hidden;
    }
  }
	.page-section-spacing{
		position: relative;
    overflow: hidden;

    border-radius: 20upx;
	}
	.dots-wrap{
		position: absolute;
		z-index: 9999;
		left: 332upx;
		bottom: 13upx;
		display: flex;
		.dot{
			width: 6upx;
			height: 6upx;
			border-radius: 50%;
			background-color: #c3c3c3;
			margin-left: 5upx;
		}
		.dot-active{
			width: 26upx;
			height: 6upx;
			border-radius: 3upx;
			background: #fd7600;
		}
		.dot:nth-of-type(1)
			{
				margin-left: 0;
			}
	}
</style>

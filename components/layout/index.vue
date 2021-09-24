<!--
* @Description: 全局布局文件 具体使用方法请参照demo.vue
* @Author: mahui
* @Date: 2020/10/26 9:42 PM
-->
<template>
  <view class="global-page-wrap">
      <uni-nav-bar
          v-if="showTitle"
          :title="title"
          :leftText="leftText"
          :rightText="rightText"
          :showBackGroundImg="showBackGroundImg"
          :showBcakImg="showBcakImg"
          :color="color"
          @clickLeft="clickLeft"
          :backgroundColor="backgroundColor"
          :navBarBackgroundImg="navBarBackgroundImg"
          :statusBar="statusBar"
          :border="border"
      >
        <view v-if="!title.length" slot="title" style="width:100%;height: 100%;">
          <slot name="title" v-if="!title.length"></slot>
        </view>
        <view v-if="!showBcakImg" slot="left" style="width:100%;height: 100%;">
          <slot name="leftTitle" />
        </view>
      </uni-nav-bar>
      <view class="global-content-wrap" :class="{'margin-footer': innerShowFooter}" :style="{paddingBottom: fh, backgroundColor: contentBackgroundColor }">
          <slot />
      </view>
      <view
          class="global-footer-wrap"
          :class="{'footer-shadow': shadow}"
          v-if="innerShowFooter"
          :style="{height: fh}"
      >
         <slot name="footer" />
        <view v-if="isIPX" class="deal-ipx-bottom"></view>
      </view>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";

export default {
    name: 'layout',
    components: {
        uniNavBar,
    },
    props: {
        title: { // 导航栏标题
            type: String,
            default: ""
        },
        leftText: { // 导航栏左侧文本
            type: String,
            default: ""
        },
        rightText: { // 导航栏右侧文本
            type: String,
            default: ""
        },
        showBackGroundImg: { // 是否展示导航栏背景图片
            type: [Boolean, String],
            default: false
        },
        showBcakImg: { // 是否展示左侧返回按钮
            type: [Boolean, String],
            default: true
        },
        color: { // 导航栏标题颜色
            type: String,
            default: "#343434"
        },
        backgroundColor: { //导航栏背景颜色
            type: String,
            default: "#FFFFFF"
        },
        contentBackgroundColor: { //导航栏背景颜色
            type: String,
            default: "#F8F8F8"
        },
        navBarBackgroundImg: { // 导航栏背景图片
            type: String,
            default: "" // 导航栏标题
        },
        statusBar: { // 是否预留出顶部状态栏的位置
            type: [Boolean, String],
            default: true
        },
        showFooter: { // 是否展示底部固定按钮区域
            type: [Boolean, String],
            default: true
        },
        footerHeight: { // 底部固定栏目的高度
            type: [Number, String],
            default: 80
        },
        clickLeft: { // 点击返回按钮的回调
            type: Function,
            default: () => {},
        },
        showTitle: { // 是否展示标题
            type: [Boolean, String],
            default: true
        },
        border: { // 是否展示标题
            type: [Boolean, String],
            default: false
        },
        shadow: { // 是否展示标题
            type: [Boolean],
            default: true
        },
    },
    watch: {
        showFooter: {
            handler(val) {
                let fh = val ? uni.upx2px(this.footerHeight) : 0;
                this.fh = `${fh + 10}px`;
                this.innerShowFooter = val;
            },
            immediate: true,
        }
    },
    data() {
        return {
            fh: '0px',
            innerShowFooter: false,
            isIPX: this.$isIPX,
        }
    }
};
</script>

<style lang="less">
  @import url('@/common/common.less');
  .global-page-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    background-color: @dajx-page-bg-color;
    color: @dajx-main-text-color;
    .margin-footer{
      margin-bottom: 98upx;
    }
    .global-content-wrap {
      flex: 1;
    }
    .global-footer-wrap {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 98upx;
      overflow-x: scroll;
      z-index: 99999;
      background-color: #FFFFFF;
      .deal-ipx-bottom{
        position: absolute;
        height: 20rpx;
        bottom: 0;
        left: 0;
        width: 100%;
      }
    }
    .deal-ipx-btn{
      margin-bottom: 20rpx;
    }
    .footer-shadow{
      box-shadow: 0 -4rpx 40rpx 0 rgba(154, 154, 154, 0.2);
    }
    .global-footer-wrap::-webkit-scrollbar {
      display: none;
    }
  }
</style>

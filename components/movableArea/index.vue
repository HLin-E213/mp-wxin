<!--
* @Description:
* @Author: mahui
* @Date: 2020/11/3 10:20 PM
-->
<template>
  <movable-area class="movableArea1">
    <movable-view
        class="movable-view"
        :direction="direction"
        :x="_offsetX"
        :y="_offsetY"
        :num="num"
        @click="gotoShoppingCart"
    >
      <p class="movable-num" v-if="num > 0">{{_num}}</p>
      <slot></slot>
    </movable-view>
  </movable-area>
</template>

<script>
import { includes } from '../../utils/includes';

const defaultConfig = {
    required: false,
    type: Number,
    default: 110,
    num: String,
};
export default {
    name: 'movablearea',
    props: {
        offsetX: { // 初始位置距离左侧的距离
            ...defaultConfig,
            default: 600,
        },
        offsetY: {  // 初始位置距离顶部的距离
            ...defaultConfig,
            default: 800,
        },
        num: {  // 初始位置距离顶部的距离
          ...defaultConfig,
          default: '0',
        },
        direction: {  // 可滑动方向
            required: false,
            type: String,
            default: 'all',
            validator(value) {
                const acceptableValues = ['all', 'horizontal', 'vertical'];
                return includes(acceptableValues, value);
            },
        }
    },
    computed: {
        _offsetX() {
            return `${this.offsetX}rpx`;
        },
        _offsetY() {
            return `${this.offsetY}rpx`;
        },
        _num() {
          if (this.num > 100) {
            return '99+'
          }
          return this.num;
        }
    },
    data() {
        return {};
    },
    methods: {
      to_xfj_gg() {
          console.log(123);
      },
      gotoShoppingCart: function () {
        return uni.navigateTo({
          url: '/pages/shop/shoppingCart/index'
        });
      },
    },
};
</script>

<style scoped lang="less">
  .movableArea1 {
    position: fixed;
    top: 100px;
    left: 0;
    width: 100%;
    height: calc(100% - 100px);
    pointer-events: none;
    z-index: 999;
    .movable-view {
      pointer-events: auto;
      background-image: url(https://admin.dajxyl.com/oss?path=img/ShoppingCart.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 110upx;
      height: 110upx;
    }
    .movable-num{
      color: #fd7600;
      text-align: center;
      line-height: 25.9upx;
      font-size: 22rpx;
      position: relative;
      top: 26upx;
      left: 48upx;
      width: 55upx;
      height: 25.9upx;
      background-color: #fff;
      border-radius: 12.95upx;
    }
  }

</style>

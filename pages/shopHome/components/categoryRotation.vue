<template>
  <view class="category-box">
    <view class="second-module-allicon">
      <scroll-view class="nav-bar" scroll-anchoring scroll-x @scroll="scroll">
        <!-- 使用flex布局实现横向滚动，在scroll-view里加一层容器包裹，才会出现滚动效果 -->
        <view class="nav-bar-wrap"
              :style="{'flex-flow': list.length>4 && list.length < 9?'wrap':list.length<4?'':'column wrap'}">
          <block v-for="(item, index) in list" :key="index">
            <view class="nav-bar-item" @click.stop="gotoInfo(item)">
              <view style="background-color: #eeeeee;border-radius: 50%;">
                <image mode="aspectFill" :src="item.product_category_image" />
              </view>
              <text>{{item.name}}</text>
            </view>
          </block>
        </view>
      </scroll-view>
      <!-- 模拟进度条 -->
      <view class="slider" v-if="list.length>8">
        <view class="slider-inside .slider-inside-location"
              :style="{left: left}"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'categoryRotation',
  props: {
    list: {
      type: Array,
      default: () => {
        [];
      }
    }
  },
  data() {
    return {
      left:0.625  // 初始化滑块位置
    };
  },
  watch: {
    list: {
      handler(arr) {
        this.list = arr;
      },
      immediate: true
    }
  },
  methods: {
    scroll(event){
      let scrollLeft = event.detail.scrollLeft + 375;
      let scrllWidth = event.detail.scrollWidth;
      let left;
      if(scrollLeft < 395){
        left = `65.625%`
      }else{
        left = `${(scrollLeft) / scrllWidth * 100}%`
      }
      this.left = left
    },
    gotoInfo(obj) {
      this.$emit('categoryClick', obj);
    }
  }
};
</script>
<style lang="scss" scoped>
scroll-view {
  white-space: nowrap;
}
/* 去除滚动条 */
::-webkit-scrollbar {
  display:none;
  width:0;
  height:0;
  color:transparent;
}
.category-box{
  padding-top: 30rpx;
}
.nav-bar-wrap {
  display: flex;
  height:400rpx;
}

.nav-bar-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 26rpx;
}

.nav-bar-item image {
  display: block;
  width: 120rpx;
  height: 120rpx;
  margin: 0;
  border-radius: 50%;
}

.nav-bar-item text {
  margin-top: 8rpx;
  line-height: 34rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 24rpx;
  width: 75%;
  text-align: center;
}

.slider {
  position: absolute;
  bottom: 18rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 46rpx;
  height: 6rpx;
  border-radius: 22rpx;
  background-color: rgba(253, 124, 9, 0.1);
}

.slider-inside {
  transform: translateX(-100%);
  width: 30rpx;
  height: 100%;
  border-radius: 3rpx;
  background: #fd7600;
}
/* 滑块滑动模拟 */
.slider-inside-location {
  position: absolute;
  left: 65.625%;
}

</style>

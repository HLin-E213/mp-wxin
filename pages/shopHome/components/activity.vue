<template>
  <view class="activity">
    <scroll-view class="nav-bar" scroll-x @scroll="scroll" @scrolltoupper="scrolltoupper" @scrolltolower="scrolltoupper">
      <!-- 使用flex布局实现横向滚动，在scroll-view里加一层容器包裹，才会出现滚动效果 -->
      <view class="nav-bar-wrap"
       style="flex-flow:column wrap">
        <block v-for="(item, index) in lists" :key="index">
            <view class="category-box" :class="[promotionList.length > 1?'boc':'', promotionList.length != 1? `item-${i}` : '']" v-for="(e, i) in item" :key="i" @click="gotoInfo(e)">
              <view class="act-title" >
                <view class="tit-right">
                  <view class="act-tit">{{ e.name }}</view>
                  <view class="price-intro">{{ e.subtitle }}</view>
                </view>
              </view>
              <view class="preview-img">
                <image
                    class="preview-img"
                    :src="e && e.product_promotion_category_image"
                    mode=""
                    v-if="e && e.product_promotion_category_image"
                ></image>
              </view>
            </view>
        </block>
      </view>
     </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'activity',
  props: {
    promotionList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      left: 0,
	  idx: 0,
    };
  },
  computed: {
    lists() {
      let arr = [];
      // 赋值给另一个数组
      let newarr = arr.concat(this.promotionList);
      // 处理新数组，原数组不变
      // 打印结果
      let len = newarr.length;
      let n = 2;
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
		scrolltoupper(){},
		scrolltolower(){},
    gotoInfo(obj) {
      this.$emit('toCategoty', obj);
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
.nav-bar-wrap {
  display: flex;
  height: 292rpx;
}

.nav-bar-item {
  
}
	
	
	
	
.activity {
  margin: 16rpx;
  padding: 26rpx;
  background-color: #ffecec;
  border-radius: 10rpx;

  .act-content {
    width: 100%;
    height: 100%;
  }
}
.item-0{
}
.category-box {
  width: 100%;
  height: 100%;
  margin-right: 13rpx;
  .act-title {
    .tit-right {
      display: flex;
      align-items: center;
      justify-content: start;
      margin-bottom: 20rpx;
      .act-tit{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 26rpx;
      }
      .price-intro {
        max-width: 270rpx;
        min-width: 100rpx;
		height: 38rpx;
		line-height: 38rpx;
        color: #ffffff;
        text-align: center;
        padding: 0 9rpx;
        background: #fd7c09;
        font-size: 24rpx;
        border-radius: 20rpx 0 20rpx 0;
        margin-left: 8rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

}
.boc {
  width: 50%;
}
.preview-img {
  width: 100%;
  height: 220rpx;
  border-radius: 10rpx;
}
</style>

<template>
  <view class="hot-product">
    <view class="tit-box"><text class="tit">热搜商品</text></view>
    <view class="pro-container">
      <view
          class="list-items"
          v-for="(item, index) in list"
          :key="index"
          @click="
					() => {
						this.$emit('clickHot', { value: item });
					}
				"
      >
        #{{ item }}#
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'hotProduct',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.hot-product {
  padding: 0 20rpx;
  .tit-box {
    display: flex;
    align-items: center;
    padding-bottom: 30rpx;
    .tit {
      font-size: 30rpx;
      color: #333333;
    }
  }
  .pro-container {
    background-color: #f8f8f8;
    padding: 30rpx 30rpx 10rpx 30rpx;
    border-radius: 10rpx;
    display: flex;
    flex-wrap: wrap;
    .list-items {
      width: calc(50% - 20rpx);
      font-size: 26rpx;
      color: #666666;
      line-height: 46rpx;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 20rpx;
      &:nth-child(2n + 1) {
        margin-right: 20rpx;
      }
    }
  }
}
</style>

<template>
  <view :class="{'history-content':true,'history-hide':!showMore}" v-if="historySearchList.length">
    <view class="tit-btn-box">
      <text class="tit">历史搜索</text>
      <view class="del-btn" @click="clearAll">
        <uni-icons type="trash" size="15" color="#666666"></uni-icons>
        <text>删除</text>
      </view>
    </view>
    <view class="van-ellipsis" v-for="(item, index) in historySearchList" :key="index" @click="toGoods(item)">
      {{item}}
    </view>
    <view class="icon-more" v-if="!showMore && hasMoreBtn" @click="toChange">
      <uni-icons type="arrowdown" size="12" color="#666666"></uni-icons>
    </view>
    <view class="icon-more" v-if="showMore && hasMoreBtn" @click="toChange">
      <uni-icons type="arrowup" size="12" color="#666666"></uni-icons>
    </view>
  </view>

</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue';

export default {
  name: 'history',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    uniIcons
  },
  data() {
    return {
      showMore: false,
      hasMoreBtn: false,
      historySearchList: []
    };
  },
  watch: {
    list: {
      handler(data) {
        this.historySearchList = data || [];
      },
      immediate: true
    }
  },
  mounted() {
    this.toggleItems()
  },
  methods: {
    toggleItems() {
      let count = 0;
      let idx = 0;
      const query = uni.createSelectorQuery().in(this);
      query.selectAll('.van-ellipsis').fields({
        rect: true,
        size: true
      }, data => {
        data.forEach((i, index) => {
          if (i.left === 10) {
            count++
            if (count === 4) {
              idx = index - 1
              this.hasMoreBtn = true
            }
          }


        })
        this.historySearchList = []
        if (idx > 0) {
          this.historySearchList = this.list.slice(0, idx)
        } else {
          this.historySearchList = this.list
        }
      }).exec();
    },
    toChange() {
      this.toggleItems()
      this.showMore = !this.showMore;
    },
    //清空历史记录
    clearAll() {
      this.$emit('clearAll');
    },
    toGoods(v) {
      this.$emit('toGoods', {value: v});
    }
  }
};
</script>

<style lang="scss" scoped>
.history-content {
  padding: 0 10px;
  transition: height 0.3s;
}

.tit-btn-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30rpx;

  .tit {
    font-size: 30rpx;
    color: #333333;
  }

  .del-btn {
    color: #666666;
    display: flex;
    align-items: center;

    text {
      font-size: 26rpx;
      margin-top: 10rpx;
    }
  }
}

.van-ellipsis {
  display: inline-block;
  align-items: center;
  border-radius: 26rpx;
  box-sizing: border-box;
  height: 52rpx;
  line-height: 52rpx;
  margin-bottom: 20rpx;
  text-align: center;
  padding: 0 20rpx;
  font-size: 24rpx;
  color: #666;
  background-color: #f8f8f8;
  margin-right: 20rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;

}

.icon-more {
  display: inline-block;
  align-items: center;
  border-radius: 26rpx;
  box-sizing: border-box;
  height: 52rpx;
  width: 52rpx;
  line-height: 52rpx;
  margin-bottom: 20rpx;
  text-align: center;
  padding: 0 10rpx;
  font-size: 24rpx;
  color: #666;
  background-color: #f8f8f8;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

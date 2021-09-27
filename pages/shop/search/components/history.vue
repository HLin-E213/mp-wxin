<template>
  <view class="history-main">
    <view class="tit-btn-box">
      <text class="tit">历史搜索</text>
      <view class="del-btn" @click="clearAll">
        <uni-icons type="trash" size="15" color="#666666"></uni-icons>
        <text>删除</text>
      </view>
    </view>
    <view class="items-container">
      <view class="on history-item">
        <view class="items-boxs" v-for="(item, index) in historySearchList" :key="index">
          <view class="h-item-list">
            <view class="con-btn" @click="toGoods(item)">{{ item }}</view>
          </view>
        </view>
        <view
            :style="!showMore ? 'position: absolute; right: 0; bottom: 0':''"
            class="more-btn"
            @tap="toChange"
            v-show="newHeight > 226"
        >
          <uni-icons type="arrowdown" size="12" color="#666666" v-if="!showMore"></uni-icons>
          <uni-icons type="arrowup" size="12" color="#666666" v-if="showMore"></uni-icons>
        </view>
      </view>
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
      count: 0,
      newHeight: 0,
      oldHeight: 0,
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
  onLoad(){

  },
  mounted() {
    let query = uni.createSelectorQuery().in(this);
    debugger
    // 获取所有文本在html中的高度
    let doms = query.selectAll('.items-boxs')
    console.log('*', doms)
  },
  methods: {
    getHeight(height) {
      console.log('height', height)
      this.newHeight = height
      // if (height > 130) {
      //   this.newHeight = 226;
      // } else {
      //   this.newHeight = height;
      // }
      // this.oldHeight = height;
      // console.log(this.newHeight, this.oldHeight)
    },
    toChange() {
      if (this.showMore) {
        this.newHeight = 226;
      } else {
        this.newHeight = 0;
      }
      this.showMore = !this.showMore;
    },
    //清空历史记录
    clearAll() {
      this.$emit('clearAll');
    },
    toGoods(v) {
      this.$emit('toGoods', { value: v });
    }
  }
};
</script>

<style lang="scss" scoped>
.history-main {
  padding: 0 20rpx;
  .tit-btn-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
}
.items-container {
  padding-top: 35rpx;
}
.history-item {
  display: flex;
  //justify-content: flex-start;
  //align-items: center;
  flex-wrap: wrap;
  overflow: hidden;
  position: relative;
}
.on {
  //height: auto;
}

.con-btn {
  font-size: 26rpx;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.h-item-list {
  height: 52rpx;
  line-height: 52rpx;
  margin-right: 20rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  margin-bottom: 32rpx;
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  overflow: hidden;
  word-break: break-all; /* break-all(允许在单词内换行。) */
  text-overflow: ellipsis; /* 超出部分省略号 */
  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 3; /** 显示的行数 **/
  background-color: #f8f8f8;
  border-radius: 26rpx;
  padding: 2rpx 20rpx;
}
.tl-mgs {
  display: flex;
  justify-content: center;
  align-content: center;
}
.tl-img-16 {
  width: 24rpx;
  height: 24rpx;
  vertical-align: middle;
}
.more-btn {
  width: 52rpx;
  height: 52rpx;
  line-height: 52rpx;
  text-align: center;
  border-radius: 50%;
  background-color: #f8f8f8;
}
</style>

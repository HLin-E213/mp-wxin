<template>
  <view style="display: none">
    <view class="comment-item" :class="{'children_item': ischild}">
      <img
          class="comment-item_pic"
          :class="{'children_pic': ischild}"
          :src="info.user && info.user.pic"
          alt=""
      />
      <view class="comment-item_content" :class="{'children_content': ischild}">
        <view style="flex:1">
          <view class="title">{{ info.user && info.user.nickname || '--' }}</view>
          <view class="desc" @click="doReplay()">
            {{info.content || ''}}
            <span class="time">{{ getTimeDifferenceByNow(info.time) }}前</span>
          </view>
        </view>
        <view class="comment-item-like">
          <img
              v-if="info.is_like"
              @click="toggleLike"
              class="comment-item-like_img"
              :class="{'comment-item-like_children-img': ischild}"
              src="../../../../../static/like-light.png"
              alt=""
          />
          <img
              v-else
              @click="toggleLike"
              class="comment-item-like_img"
              :class="{'comment-item-like_children-img': ischild}"
              src="../../../../../static/zan2@2x.png"
              alt=""
          />
          <view class="comment-item-like_text">{{ info.comment_like_cnt }}</view>
        </view>
      </view>
    </view>
    <slot></slot>
  </view>
</template>

<script>
import { getTimeDifferenceByNow } from "../../../../../utils/tools";

export default {
  name: "comment-item",
  props: {
    ischild: {
      type: Boolean,
      default: false,
    },
    index: {
      type: String,
      default: '',
    },
    info: {
      type: Object,
      default() {return {}},
    },
  },
  methods: {
    doReplay() {
      console.log('this.info, this.index doReplay')
      this.$emit('onReplay', this.info, this.index);
    },
    toggleLike() {
      console.log('this.info, this.index toggleLike')
      this.$emit('toggleLike', this.info, this.index);
    },
    getTimeDifferenceByNow
  }
}
</script>

<style scoped lang="less">
.comment-item{
  display: flex;
  align-items: flex-start;
  padding-top: 26rpx;
  .comment-item_pic{
    width: 62rpx;
    height: 62rpx;
    border-radius: 50%;
  }
  .children_pic {
    width: 40rpx;
    height: 40rpx;
  }
  .comment-item_content {
    display: flex;
    flex: 1;
    margin: 0 24rpx 14rpx 20rpx;
    .title {
      color: #999999;
      font-size: 26rpx;
      line-height: 36rpx;
    }
    .desc{
      padding-top: 18rpx;
      color: #FFFFFF;
      line-height: 36rpx;
      font-size: 26rpx;
      .time {
        color: #999999;
        font-size: 24rpx;
        margin-left: 10rpx;
      }
    }
  }
  .children_content {
    margin: 0 30rpx 28rpx 14rpx;
  }
  .comment-item-like {
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &_img{
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
    }
    &_text{
      color: #666666;
      line-height: 36rpx;
      font-size: 26rpx;
    }
    &_children-img{
      width: 34rpx;
      height: 34rpx;
    }
  }
}
.children_item{
  padding-top: 0;
  padding-left: 72rpx;
}

</style>

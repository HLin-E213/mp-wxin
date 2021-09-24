<template>
  <view>
    <view class="comment-modal-wrap" :class="{'show-popup': showPopup}">
    <view class="comment-title">
      <view class="comment-title-icon"/>
      <view class="comment-title-text">
        评论
      </view>
      <img
          class="comment-title_close"
          src="https://admin.dajxyl.com/oss?path=img/close_popup.png"
          alt="comment-title"
          @click="close()"
      />
    </view>
    <view class="comment-content-wrap">
      <view>
        <view class="comment-wrap">
          <view
              class="comment-item"
              v-for="(item, index) in commentList"
              :key="index"
          >
            <itemTitle
                :user="item.user"
                :time = "null"
                extraText="举报"
                @onClickExtra="doReport"
            >
            </itemTitle>
            <view class="comment-details-wrap">
              <view
                  class="comment-details-replay comment-details-replay-content"
                  @click="doReplay(item.id, item.id)"
              >
                {{ item.content || '' }}
              </view>
              <view class="comment-details-replay comment-details-time-wrap">
                <view>{{item.time || ''}}</view>
                <view @click="doReplay(item.id, item.id)">回复</view>
              </view>
              <div
                  v-if="item.children && item.children.length"
                  class="comment-details-replay-spec-wrap">
                <p
                    class="comment-details-replay comment-details-replay-spec"
                    v-for="(replay, replayIndex) in item.children"
                    @click="doReplay(item.id, replay.comment_id)"
                    :key="replayIndex"
                >
                  <span class="comment-details-replay__name in-block">
                    {{ replay.user.nickname || '--' }}
                  </span>
                  <span
                      class="comment-details-replay__text in-block"
                      v-if="replay.pid != 0"
                  >回复</span>
                  <span
                      class="comment-details-replay__name in-block"
                      v-if="replay.pid != 0"
                  >
                    {{ replay.ToUser.nickname || '--' }}：
                  </span>
                  <span class="comment-details-replay__content">
                    {{ replay.content || '' }}
                  </span>
                </p>
              </div>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="comment-footer-wrap" :class="{'ipx-btn-bottom': isIPX}">
      <input
          ref="inputComment"
          class="send-input real-input"
          v-model="comment"
          type="text"
          placeholder-style="color:#999999;font-size: 26rpx;"
          auto-blur
          :focus="autoFocus"
          @keyboardheightchange="hideKeyBord"
          placeholder="有爱评论，说点儿好听的~"
          :maxlength="100"
      />
      <img
          @click="sendComment()"
          class="send-icon"
          src="../../../../../static/trend-comment-send.png"
          alt=""
      />
    </view>
  </view>
  </view>
</template>

<script>
import { getVideoComments, videoCommentSend } from '@/api';
import CommentItem from '../commentItem';
import itemTitle from './itemTitle';

export default {
  name: "comment-modal",
  props: {
    vid: {
      type: String,
      default: '',
    },
  },
  components: {
    CommentItem,
    itemTitle,
  },
  data() {
    return {
      showPopup: false,
      isIPX: this.$isIPX,
      comment: '',
      autoFocus: false,
      commentList: [],
      pageConfig: {
        page: 1,
        pageSize: 1000,
      },
      replay: {
        cid: '0',
        rootID: '0',
      },
      style: {},
      totalPage: 1,
    };
  },
  methods: {
    open: function () {
      const vm = this;
      this.getComments(1);
      // 监听键盘高度变化，以便设置输入框的高度
      uni.onKeyboardHeightChange(res => {
        if (res.height === 0) {
          vm.autoFocus = false;
        }
      });
      this.$nextTick(() => {
        this.showPopup = true;
        // this.$refs.popup.open();
      });
    },
    hideKeyBord(data) {
      if (data.height == 0) {
        this.autoFocus = false;
      }
    },
    doReplay(cid, rootID) {
      this.replay = {
        cid,
        rootID,
      };
      this.$nextTick(() => {
        this.autoFocus = true;
        this.$refs && this.$refs.inputComment && this.$refs.inputComment.focus();
      }, 100);
    },
    clickInput() {
      this.$nextTick(() => {
        this.autoFocus = true;
      }, 100);
    },
    toggleLike(info, index) {
      console.log('toggleLike', info, index);
    },
    replayInputBlur() {
      this.autoFocus = false;
    },
    async getComments(page = this.pageConfig.page) {
      uni.showLoading({title: '数据加载中，请稍后'});;
      try {
        const res = await getVideoComments(page, this.pageConfig.pageSize, this.vid);
        this.$nextTick(() => {
          const { info, totalPage } = res.data.data;
          this.totalPage = totalPage;
          if (page === 1) {
            this.commentList = [...info];
          } else {
            this.commentList = [...this.commentList, ...info];
          }
          if (page < totalPage) {
            this.pageConfig.page = page + 1;
          }
        }, 100);
      } finally {
        uni.hideLoading();
      }
    },
    close() {
      this.showPopup = false;
      // this.$refs.popup.close();
    },
    reset() {
      this.commentList = [];
      this.comment = '';
      this.replay = {
        cid: '0',
        rootID: '0'
      };
      this.pageConfig = {
        page: 1,
        pageSize: 1000,
      };
    },
    doReport() {
      uni.showLoading({title: '数据加载中，请稍后'});;
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '举报成功',
          icon: 'none',
          duration: 2000
        })
      }, 2000);
    },
    changePopup(e) {
      const { show } = e;
      this.showPopup = show;
      if (!show) {
        this.reset();
      }
      this.$emit('changePopup', show);
    },
    async refresh({ complete }) {
      this.pageConfig.page = 1;
      await this.getComments();
      complete();
    },
    async sendComment() {
      if (this.comment.trim() === '') {
        uni.showToast({
          title: '请先输入要评论的内容',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      await videoCommentSend(this.vid, this.replay.cid, this.replay.rootID, this.comment);
      this.reset();
      this.getComments();
    },
  }
}
</script>

<style scoped lang="less">
.comment-modal-page-wrap {
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0, .1);
  z-index: 20;
}
.comment-modal-wrap {
  position: fixed;
  bottom: -2px;
  left: 0;
  width: 100vw;
  height: 832rpx;
  background-color: rgba(255,255,255,1);
  border-radius: 20rpx 20rpx 0 0;
  display: none;
  z-index: 99999;
  .comment-title {
    display: flex;
    position: relative;
    text-align: left;
    padding: 40rpx 0 40rpx 30rpx;
    font-size: 26rpx;
    align-items: center;
    .comment-title-icon{
      height: 36rpx;
      width: 7rpx;
      background-color: #FD7C09;
      z-index: 20;
      border-radius: 4rpx;
    }
    .comment-title-text{
      margin-left: 14rpx;
      font-size: 32rpx;
      color: #333333;
    }
    &_close{
      position: absolute;
      width: 30rpx;
      height: 30rpx;
      right: 28rpx;
      top: 44rpx;
      z-index: 9999;
    }
  }
}
.show-popup {
  display: block;
}
.comment-content-wrap{
  height: 608rpx;
  max-height: 608rpx;
  padding: 0 28rpx;
  overflow-y: scroll;
  z-index: 5;
}
.comment-footer-wrap {
  display: flex;
  height: 100rpx;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
  background-color: #FFFFFF;
  .send-input {
    flex: 1;
    height: 78rpx;
    line-height: 78rpx;
    background-color:rgba(253, 118, 0, .1);
    font-size: 26rpx;
    margin-left: 28rpx;
    padding-left: 17rpx;
    color: rgb(153, 153, 153);
    border-radius: 8rpx;
  }
  .send-icon{
    width: 50rpx;
    height: 50rpx;
    margin: 0 20rpx;
  }
}
.comment-wrap {
  margin: 20rpx 20rpx 0 20rpx;
  background-color: #FFFFFF;
  .comment-item{
    padding: 20rpx 0;
    border-bottom: 1px solid rgba(153, 153, 153, .2);
    .dianzan-wrap {
      z-index: 999;
      margin-right: 10rpx;
      display: flex;
      font-size: 28rpx;
      color: #333333;
      margin-top: 44rpx;
      .dianzan{
        width: 34rpx;
        height: 34rpx;
        margin-right: 12rpx;
      }
    }
    .comment-details-wrap {
      margin-left: 100rpx;
      margin-right: 10rpx;
      border-radius: 8rpx;
      .comment-details-replay-spec-wrap{
        padding: 17rpx 21rpx 21rpx;
        background: #F8F8F8;
        border-radius: 10rpx;
      }
      .comment-details-replay-spec{
        padding: 16rpx 0 0!important;
      }
      .comment-details-replay-spec:first-of-type{
        padding-top: 0!important;
      }
      .comment-details-replay{
        padding: 20rpx 0 20rpx 18rpx;
        font-size: 28rpx;
        color: #333333;
        &__name{
          color: #4B2300;
        }
        &__content{
          word-break: break-all;
        }
        &__text{
          padding: 0 5rpx;
        }
      }
      .comment-details-replay-content{
        padding-top: 0;
      }
      .comment-details-time-wrap{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        color: #333333;
      }
    }
  }
}

</style>

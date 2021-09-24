<!--
* @Description: 动态详情
* @Author: mahui
* @Date: 2021/1/18 9:13 PM
-->
<template>
  <layout
      title="正文"
      :showFooter="!showPopup"
      :footerHeight="isIPX ? 120 : 100"
  >
    <div class="detail-content">
      <item
          :info="article"
          @clickToogleLike="toogleLike(article.id, article.isLike)"
          @clickArticle="clickArticle"
      ></item>
      <div class="comment-wrap">
        <div
            class="comment-item"
            v-for="(item, index) in list"
            @longpress="openCommentDelPopup(item.user.uid, item.id, index)"
        >
          <itemTitle :user="item.user" :time="item.create_time">
            <div class="dianzan-wrap" slot="extra" >
              <img
                  @click="doCommentLike(item.id, item.isLike, index)"
                  v-if="item.isLike"
                  class="dianzan"
                  src="../../../static/dianzan-light.png"
                  alt=""
              >
              <img
                  v-else
                  @click="doCommentLike(item.id, item.isLike, index)"
                  class="dianzan"
                  src="../../../static/dianzan-grey.png"
                  alt=""
              >
              {{ item.like || '' }}
            </div>
          </itemTitle>
          <div class="comment-details-wrap">
            <p
                class="comment-details-replay"
                @click="doReplay(item.id, '0')"
            >
              {{ item.content || '' }}
            </p>
            <div v-if="item.expland == 1">
              <p
                  class="comment-details-replay"
                  v-for="(replay, replayIndex) in item.explandList"
                  @click="doReplay(item.id, replay.id)"
                  @longpress="openReplyDelPopup(replay.fromUser.uid, replay.id, index, replayIndex)"
              >
              <span class="comment-details-replay__name">
                {{ replay.fromUser.nickname || '--' }}：
              </span>
                <span
                    class="comment-details-replay__text"
                    v-if="replay.pid != 0"
                >回复</span>
                <span
                    class="comment-details-replay__name"
                    v-if="replay.pid != 0"
                >
                {{ replay.toUser.nickname || '--' }}：
              </span>
                <span>{{ replay.content || '' }}</span>
              </p>
            </div>
            <div v-if="item.expland == 2">
              <p
                  class="comment-details-replay"
                  v-for="(replay) in item.reply"
                  @click="doReplay(item.id, replay.id)"
                  @longpress="openReplyDelPopup(replay.fromUser.uid, replay.id, index, replayIndex)"
              >
              <span class="comment-details-replay__name">
                {{ getNickName(replay.fromUser) }}：
              </span>
                <span
                    class="comment-details-replay__text"
                    v-if="replay.pid != 0"
                >回复</span>
                <span
                    class="comment-details-replay__name"
                    v-if="replay.pid != 0"
                >
                {{ getNickName(replay.toUser) }}：
              </span>
                <span>{{ replay.content || '' }}</span>
              </p>
            </div>
            <div class="all-replay" v-if="(item.reply && item.reply.length > 3 && item.expland == 1)" @click="explandAllReplay(index)">
              全部回复
              <img
                  class="all-replay-icon"
                  src="../../../static/more-replay.png"
                  alt=""
              >
            </div>
          </div>

        </div>

        <!--<div class="comment-item">
          <itemTitle>
            <div class="dianzan-wrap" slot="extra">
              <img class="dianzan" src="../../../static/dianzan-light.png" alt="">
              1000
            </div>
          </itemTitle>
          <div class="comment-details-wrap">
            <p class="comment-details-replay">
              老年人高血压、中风的发病率明显增高，心血管疾病患者也容易产生心绞痛、 心梗、心力衰竭等需要加强防护保暖。</p>
            <p class="comment-details-replay">
              <span class="comment-details-replay__name">大爱金孝：</span>
              <span>您说的很对</span>
            </p>
            <p class="comment-details-replay">
              <span class="comment-details-replay__name">茶百道</span>
              <span class="comment-details-replay__text">回复</span>
              <span class="comment-details-replay__name">大爱金孝：</span>
              <span>您的文章写得很棒,对老年人的日常生活有很大的帮助！</span>
            </p>
            <p class="comment-details-replay" @longpress="open('data')">
              <span class="comment-details-replay__name">大爱金孝</span>
              <span class="comment-details-replay__text">回复</span>
              <span class="comment-details-replay__name">茶百道：</span>
              <span>感谢您的阅读，如果您有什么需要帮助的，请咨询客服400-036-0036！</span>
            </p>
            <div class="all-replay">
              全部回复
              <img
                  class="all-replay-icon"
                  src="../../../static/more-replay.png"
                  alt=""
              >
            </div>
          </div>

        </div>-->
        <view v-show="hasMore">
          <uni-load-more :status="loadStatus" ></uni-load-more>
        </view>
      </div>
    </div>
    <uni-popup ref="popup" type="bottom" @change="popupChange">
      <div class="dialog" v-if="delType==='comment'">
        <div class="dialog-text" @click="doCommentDel">删除该评论</div>
        <div class="dialog-text cancel" @click="close">取消</div>
      </div>
      <div class="dialog" v-if="delType==='reply'">
        <div class="dialog-text" @click="doReplyDel">删除该回复</div>
        <div class="dialog-text cancel" @click="close">取消</div>
      </div>
    </uni-popup>
    <div slot="footer" class="footer-send-wrap">
      <div class="footer-send" :class="{'ipx-btn-bottom': isIPX}">
        <input
            ref="inputComment"
            class="send-input"
            v-model="comment"
            type="text"
            auto-blur
            :focus="autoFocus"
            @keyboardheightchange="hideKeyBord"
            :placeholder="placeholder"
            :maxlength="100"
        >
        <img
            v-if="showType === 'replay'"
            @click="doReplyAdd()"
            class="send-icon"
            src="../../../static/trend-comment-send.png"
            alt=""
        >
        <img
            v-if="showType === 'comment'"
            @click="doCommentAdd"
            class="send-icon"
            src="../../../static/trend-comment-send.png"
            alt=""
        >
      </div>
    </div>
  </layout>

</template>

<script>
  import layout from '@/components/layout/index.vue';
    import item from '../../trendHome/components/trendItem';
    import itemTitle from '../../trendHome/components/itemTitle';
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
  import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
  import { commentList, articleLike, commentDel, replyAdd, commentAdd, commentLike, replyDel } from '../../../api/friends';

    export default {
        name: 'index',
        components: {
            item,
            layout,
            itemTitle,
            uniPopup,
            uniLoadMore,
        },
        data() {
            return {
                isIPX: this.$isIPX,
                delType: '',
                comment: '',
                showType: 'comment',
                replayContent: '',
                showPopup: false,
                hasMore: true,
                loadStatus: 'more', // loading nomre
                list: [],
                article_id: '',
                article: {},
                delete: {},
                replay: {},
                autoFocus: false,
                pageConfig: {
                    page: 1,
                    pageSize: 20,
                    totalPage: 0,
                },
            };
        },
        computed: {
            getNickName() {
               return function getName(userInfo) {
                   const getPhone = userInfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
                   return userInfo.nickname ? userInfo.nickname : getPhone;
                }
            },
            placeholder() {
                return this.showType === 'comment' ? '留下您的精彩评论吧 ~' : '请输入回复内容 ~';
            },
        },
        onLoad({ articleId = '' }) {
            const vm = this;
            this.article_id = articleId;
            this.getCommentList(articleId);
            // 监听键盘高度变化，以便设置输入框的高度
            uni.onKeyboardHeightChange(res => {
                if (res.height === 0) {
                    vm.autoFocus = false;
                }
            });
        },
        onReachBottom() {
            if (this.pageConfig.page < this.pageConfig.totalPage) {
                this.pageConfig.page++;
                this.getCommentList(this.article_id);
            }
        },
        async onPullDownRefresh() {
            this.reset();
            await this.getCommentList(this.article_id);
            uni.stopPullDownRefresh();
        },
        methods: {
            openCommentDelPopup(uid, id, index) {
                if (Number(uid) === Number(uni.getStorageSync('ownnerUid'))) {
                    this.delete = {
                        id,
                        uid,
                        index,
                    };
                    this.delType = 'comment';
                    this.open();
                }
            },
            hideKeyBord(data) {
                if (data.height == 0) {
                    this.autoFocus = false;
                }
            },
            openReplyDelPopup(uid, id, index, replayIndex) {
                if (Number(uid) === Number(uni.getStorageSync('ownnerUid'))) {
                    this.delete = {
                        id,
                        uid,
                        index,
                        replayIndex,
                    };
                    this.delType = 'reply';
                    this.open();
                }
            },
            explandAllReplay(index) {
                this.list[index].expland = 2;
                this.$forceUpdate();
            },
            async doCommentDel() {
                const { id } = this.delete;
                uni.showLoading({title: '数据加载中，请稍后'});;
                await commentDel(id);
                uni.hideLoading();
                uni.showToast({
                    title: '删除评论成功',
                    icon: 'none',
                    duration: 3000,
                });
                this.close();
                this.reset();
                await this.getCommentList(this.article_id);
            },
            async doReplyDel() {
                const { id } = this.delete;
                uni.showLoading({title: '数据加载中，请稍后'});;
                await replyDel(id);
                uni.hideLoading();
                uni.showToast({
                    title: '删除回复成功',
                    icon: 'none',
                    duration: 3000,
                });
                this.close();
                this.reset();
                await this.getCommentList(this.article_id);
            },
            async doCommentLike(id, isLike, index) {
                uni.showLoading({title: '数据加载中，请稍后'});;
                await commentLike(id, isLike ? 2: 1);
                uni.hideLoading();
                this.list[index].isLike = !isLike;
                const count = Number(this.list[index].like);
                this.list[index].like = isLike ? String(count - 1) : (count + 1);
            },
            async doCommentAdd() {
              if (this.comment.trim() === '') {
                  uni.showToast({
                      title: '请先输入要评论的内容',
                      icon: 'none',
                      duration: 3000
                  });
                  return false;
              }
              uni.showLoading({title: '数据加载中，请稍后'});;
              await commentAdd(this.article_id, this.comment);
                uni.hideLoading();
                uni.showToast({
                    title: '发表评论成功',
                    icon: 'none',
                    duration: 3000
                });
                this.comment = '';
                this.reset();
                await this.getCommentList(this.article_id);
            },
            doReplay(id, pid) {
                this.showType = 'replay';
                this.replay = {
                    id,
                    pid,
                };
                this.$nextTick(() => {
                    this.autoFocus = true;
                }, 100);

            },
            clickArticle() {
                this.showType = 'comment';
                this.replay = {};
                this.$nextTick(() => {
                    this.autoFocus = true;
                }, 100);
            },
            replayInputBlur() {
                this.showType = 'comment';
                this.replay = {};
                this.autoFocus = false;
            },
            async doReplyAdd() {
              const { id, pid } = this.replay;
              if (this.comment.trim() === '') {
                  uni.showToast({
                      title: '请先输入要回复的内容',
                      icon: 'none',
                      duration: 3000
                  });
                  return false;
              }
              uni.showLoading({title: '数据加载中，请稍后'});;
              await replyAdd(id, pid, this.comment);
                uni.hideLoading();
                uni.showToast({
                    title: '发表回复成功',
                    icon: 'none',
                    duration: 3000
                });
                this.comment = '';
                this.reset();
                this.replayInputBlur();
                await this.getCommentList(this.article_id);
            },
            reset() {
                this.pageConfig = {
                    page: 1,
                    pageSize: 20,
                    totalPage: 0,
                };
                this.list= [];
                this.loadStatus= 'more';
                this.hasMore= true;
                this.article= {};
                this.autoFocus = false;
            },
            async toogleLike(id, isLike) {
                // 1点赞 2取消赞
                const like = isLike ? 2: 1;
                uni.showLoading({title: '数据加载中，请稍后'});;
                try {
                    await articleLike(id, like);
                    this.article.isLike = !isLike;
                    this.article.like = isLike ? Number(this.article.like) - 1 : Number(this.article.like) + 1;
                    console.log(isLike, this.info.isLike);
                    uni.hideLoading();
                    this.$forceUpdate();

                } catch (e) {
                    uni.hideLoading();
                }


            },
            async getCommentList(article_id = '') {
                const { page, pageSize } = this.pageConfig;
                const temp =  this.loadStatus;
                try {
                    uni.showLoading({title: '数据加载中，请稍后'});;
                    this.loadStatus = 'loading';
                    const { data } = await commentList(article_id, page, pageSize);
                    const { comment, article} = data.data.info || {};
                    this.pageConfig.page += comment.currentPage + 1;
                    this.pageConfig.totalPage = comment.totalPage;
                    this.article = article;
                    this.list = [
                        ...this.list,
                        ...comment.list,
                    ];
                    this.list = this.list.map((item) => {
                        let expland = item.expland;
                        if (!expland) { // 1为不展开， 2为展开查看全部
                            expland = item.reply.length > 3 ? 1 : 2;
                        }
                        const explandList = expland === 1 ? item.reply.slice(0, 2) : item.reply;
                        return {
                            ...item,
                            expland,
                            explandList,
                        };
                    });
                    this.$forceUpdate();
                    this.hasMore = comment.totalPage > comment.currentPage;
                    this.loadStatus = comment.currentPage < comment.totalPage ? 'more' : 'noMore';         console.log(this.hasMore, this.loadStatus);
                } finally {
                    this.loadStatus = temp;
                    uni.hideLoading();
                }
            },
            open() {
                this.$nextTick(() => {
                    this.showPopup = true;
                    this.$refs.popup.open();
                });

            },
            deleteTrend() {

            },
            close() {
                this.showPopup = false;
                this.$refs.popup.close();
            },
            popupChange(e) {
                console.log(e);
                const { show } = e;
                this.showPopup = show;
            }
        },
    };
</script>

<style scoped lang="less">
  .detail-content {
    .comment-wrap {
      margin-top: 20rpx;
      padding: 0 20rpx;
      background-color: #FFFFFF;
      .comment-item{
        padding: 20rpx 0;
        border-bottom: 1px solid rgba(153, 153, 153, .2);
        .dianzan-wrap {
          display: flex;
          font-size: 24rpx;
          color: #333333;
          margin-top: 44rpx;
          .dianzan{
            width: 34rpx;
            height: 34rpx;
            margin-right: 12rpx;
          }
        }
        .comment-details-wrap{
          padding-left: 100rpx;
          .comment-details-replay{
            margin-top: 20rpx;
            font-size: 28rpx;
            color: #333333;
            margin-left: 18rpx;
            &__name{
              color: #4B2300;
            }
            &__text{
              padding: 0 5rpx;
            }
          }
          .all-replay{
            margin-top: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 158rpx;
            height: 42rpx;
            border: 1px solid #FD7600;
            background-color: #FFF1E4;
            color: #FD7600;
            font-size: 28rpx;
            border-radius: 21rpx;
            .all-replay-icon{
              margin-left: 8rpx;
              width: 20rpx;
              height: 20rpx;
            }
          }
        }
      }
    }
  }
  .footer-send-wrap{
    height: 100%;
  }
  .footer-send{
    display: flex;
    height: 100%;
    padding: 0 40rpx 0 20rpx;
    align-items: center;
    .send-input{
      flex: 1;
      height: 78rpx;
      background-color:rgba(253, 118, 0, .1);
      border-radius: 6px;
      font-size: 26rpx;
      padding-left: 17px;
    }
    .send-icon{
      width: 50rpx;
      height: 50rpx;
      margin-left: 20rpx;
    }
  }
  .ipx-btn-bottom{
    bottom: 20rpx;
    height: 90%;
  }
  .dialog{
    border-radius: 24rpx 24rpx 0 0;
    background-color: #FFFFFF;
    .dialog-text{
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
    }
    .cancel{
      border-top:1rpx solid rgba(153, 153, 153, .2);
    }
  }
</style>

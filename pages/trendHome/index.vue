<!--
* @Description:  动态首页
* @Author: mahui
* @Date: 2021/1/12 4:30 PM
-->
<template>
  <layout
      title="动态"
      :showBcakImg="false"
      :showFooter="false"
  >
    <div class="trend-content">
      <trendTop
          @clickHead="toPersonal"
          @clickMyTrend="toMyTrend"
          :userInfo="userInfo"
          :type="type"
      ></trendTop>
      <div
          class="trend-notify"
          v-if="newsCount > 0"
          @click="toMyTrend"
      >
        <p class="count">
          {{ newsCount }}
          <view
              class="count-icon"
              v-if="newsCount > 99"
          >+</view> </p>
        <span class="text">您有新动态未查看</span>
        <img
            class="icon"
            src="../../static/trend-arrow-right.png"
            alt=""
        >
      </div>
      <div class="trend-list">
        <div
            v-for="(item, index) in list"
            class="item"
            @click="toDetail(item.id)"
            @longpress="doDeleteTrend(item.id, item.uid, index)"
        >
          <item
              :info="item"
              :list="list"
              @clickTrendListItemHead="clickTrendListItemHead"
              @clickToogleLike="toogleLike(item.id, item.isLike, index)"
              @previewPic="previewImage"
              @playVideo="playVideo"
          >
          </item>
        </div>
        <view v-show="hasMore">
          <uni-load-more :status="loadStatus" ></uni-load-more>
        </view>
      </div>
    </div>
    <uni-popup ref="popup" type="bottom" @change="popupChange">
      <div class="dialog">
        <div class="dialog-text" @click="confirmDel">删除该动态</div>
        <div class="dialog-text cancel" @click="close">取消</div>
      </div>
    </uni-popup>
  </layout>
</template>
<script>
    import layout from "@/components/layout/index.vue";
    import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
    import item from './components/trendItem';
    import trendTop from './components/trendTop';
    import { getArticle, getNewsCount, articleLike, articleDel } from '../../api/friends';
    import uniPopup from '@/components/uni-popup/uni-popup.vue';

    const defaultBg = 'https://admin.dajxyl.com/oss?path=img/default-trend-bg.png';
    export default {
        name: 'index',
        components: {
            layout,
            item,
            trendTop,
            uniLoadMore,
            uniPopup,
        },
        data() {
            return {
                defaultBg,
                hasMore: true,
                loadStatus: 'more', // loading nomre
                list: [],
                userInfo: {},
                newsCount: 0,
                showPopup: false,
                delete: {},
                visitType: 'normal',
                pageConfig: {
                    page: 1,
                    pageSize: 20,
                    totalPage: 0,
                },
              playingVideo: null,
            };
        },
        computed: {
            type() {
                const isOwnner = Number(this.userInfo.uid) === Number(uni.getStorageSync('ownnerUid'));
                return isOwnner ? 'ownner' : 'others';
            },
        },
        onLoad() {
            this.reset();
            this.getArticleList();
            this.getNewsCount();
        },
        onShow() {
            if (this.visitType === 'normal') {
                this.getNewsCount();
                this.reset();
                this.getArticleList();
                this.setTimer();
            }
        },
        onHide() {
            this.clearTimer();
        },
        onReachBottom() {
            if ((this.pageConfig.page <= this.pageConfig.totalPage) && this.loadStatus !== 'loading') {
                this.getArticleList();
            }
        },
        async onPullDownRefresh() {
            this.reset();
            await this.getArticleList();
            uni.stopPullDownRefresh();
        },
        methods: {
            open() {
                this.$nextTick(() => {
                    this.showPopup = true;
                    this.$refs.popup.open();
                });
            },
            /**
             * 预览图片
             * */
            previewImage(image, imgArr) {
                const dealedImgArr = imgArr.map(img => (img.path));
                //预览图片
                uni.previewImage({
                    urls: dealedImgArr,
                    current: image
                });
                this.visitType = 'previewImage'
            },
            playVideo({ videoContext, id }) {
              if (!this.playingVideo) {
                videoContext.play();
                this.playingVideo = {
                  videoContext,
                  id,
                }
              } else {
                const { id: playingId } = this.playingVideo;
                if (playingId !== id) {
                  this.playingVideo.videoContext.pause();
                  this.playingVideo = {
                    videoContext,
                    id,
                  };
                  this.playingVideo.videoContext.play();
                }
              }
            },
            async doDeleteTrend(id, uid, index) {
                if (Number(uid) === Number(uni.getStorageSync('ownnerUid'))) {
                    this.delete = {
                        id,
                        uid,
                        index,
                    };
                    this.open();
                }
            },
            async confirmDel() {
                this.close();
                const { id, index } = this.delete;
                await articleDel(id);
                uni.showToast({
                    title: '删除成功',
                    icon: 'none',
                    duration: 3000
                });
                this.list.splice(index , 1);
                this.delete = {};
            },
            close() {
                this.showPopup = false;
                this.$refs.popup.close();
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
               this.visitType = 'normal'
            },
            clickTrendListItemHead(uid) {
                this.toPersonal(uid);
            },
            async toogleLike(id, isLike, index) {
                // 1点赞 2取消赞
                const like = isLike ? 2: 1;
                uni.showLoading({title: '数据加载中，请稍后'});;
                try {
                    await articleLike(id, like);
                    this.list[index].isLike = !isLike;
                    this.list[index].like = isLike ? Number(this.list[index].like) - 1 : Number(this.list[index].like) + 1;
                    console.log(isLike, this.info.isLike);
                    uni.hideLoading();
                    this.$forceUpdate();

                } catch (e) {
                    uni.hideLoading();
                }


            },
            toDetail(articleId) {
                this.visitType = 'previewImage';
                uni.navigateTo({
                    url: `/pages/trendPackage/detail/index?articleId=${articleId}`,
                });
            },
            async getArticleList() {
                this.visitType = 'normal';
                const { page, pageSize } = this.pageConfig;
                const temp =  this.loadStatus;
                try {
                    uni.showLoading({title: '数据加载中，请稍后'});;
                    this.loadStatus = 'loading';
                    const { data } = await getArticle('', page, pageSize);
                    const { user, article} = data.data.info || {};
                    this.pageConfig.page = article.currentPage + 1;
                    this.pageConfig.totalPage = article.totalPage;
                    this.list = [
                        ...this.list,
                        ...article.list,
                    ];
                    this.hasMore = article.totalPage > article.currentPage;
                    this.loadStatus = article.currentPage < article.totalPage ? 'more' : 'nomre';
                    this.userInfo = user;
                    uni.setStorageSync('ownnerUid', user.uid);
                } catch (e) {
                  this.loadStatus = temp;
                } finally {
                    uni.hideLoading();
                }
            },
            toPersonal(uid) {
                uni.navigateTo({
                    url:  `/pages/trendPackage/personal/index?uid=${uid}`
                });
            },
            async getNewsCount() {
                const news = await getNewsCount();
                this.newsCount = news.data.data.info.count;
            },
            // 开启轮询事件
            setTimer (timeSpread = 5 * 1000) {
                this.timer = setTimeout(() => {
                    this.getNewsCount();
                    this.setTimer();
                }, timeSpread);
            },
            clearTimer () {
                clearTimeout(this.timer);
                this.timer = null;
            },
            toMyTrend() {
                uni.navigateTo({
                    url: '/pages/trendPackage/my/index'
                });
            },
            popupChange(e) {
                const { show } = e;
                this.showPopup = show;
            }
        },
    };
</script>

<style scoped lang="less">
  .trend-content{
    .trend-notify{
      display: flex;
      padding: 44rpx 0 0 0;
      align-items: center;
      justify-content: center;
      background-color: #FFFFFF;
      .count{
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 45rpx;
        width: 45rpx;
        color: #FFFFFF;
        background-color: #FD7600;
        border-radius: 50%;
        font-size: 20rpx;
        .count-icon{
          display: inline-block;
          position: absolute;
          color: #FFFFFF;
          right: 4rpx;
          top: 0;
          font-size: 16rpx;
        }
      }
      .text{
        margin-left: 10rpx;
        font-size: 24rpx;
        color: #666666;
      }
      .icon{
        height: 20rpx;
        width: 20rpx;
        margin-left: 5rpx;
      }
    }
    .trend-list{
      .item{
        margin-top: 20rpx;
      }
      .item:first-of-type{
        margin-top: 0;
      }
    }
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

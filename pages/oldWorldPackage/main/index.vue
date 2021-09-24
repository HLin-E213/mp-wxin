<template>
  <Layout
      :title="title"
      :showFooter="false"
  >
    <view class="itemChoice">
      <view
          class="itemList"
          v-for="(i,k) in itemList"
          :key="k"
          @click="handleClickItem(i)"
          :class="{'item-list-active': i.code === activeCode }"
      >
        {{ i.label }}
      </view>
    </view>
    <view class="scroll-view-wrap">
      <CusScroll
          ref="videoListRef"
          v-show="activeCode === 1"
          refresher
          infiniting
          @on-refresh="refreshVideo"
          @on-infinite="infiniteScrollVideo"
      >
        <div class="video-list-wrap">
          <div
              class="video-list-item"
              @click="toPlayVideo(item, index)"
              v-for="(item, index) in videoList"
              :key="item.id"
          >
            <image
                class="video-list-item-img"
                 :src="item.thum" alt=""
                mode="aspectFill"
            />
            <p class="video-list-item-desc_title ellipsis">{{ item.title }}</p>
            <div class="video-list-item-desc">
              <div class="video-list-item-desc-user">
                <img class="pic" :src="item.pic" alt="">
                <p class="offical-recommand">官方推荐</p>
              </div>
              <div class="video-list-item-desc_action">
                <span class="like-wrap">
                  <img
                      class="like-icon"
                      @click.stop="loveVideo(item.id, item.is_like, index)"
                      v-if="item.is_like"
                      src="../../../static/like-dashed.png"
                      alt=""
                  >
                  <img
                      class="like-icon"
                      @click.stop="loveVideo(item.id, item.is_like, index)"
                      v-else
                      src="../../../static/like-grey.png"
                      alt=""
                  >
                  <span class="like-count">{{ item.like_num }}</span>
              </span>
              </div>
            </div>
          </div>
        </div>
      </CusScroll>
      <CusScroll
          ref="articleListRef"
          v-show="activeCode === 2"
          refresher
          infiniting
          @on-refresh="refreshArticle"
          @on-infinite="infiniteScrollArticle"
      >
        <div class="article-list-wrap">
            <div
                class="article-list-item"
                v-for="(item) in articleList"
                :key="item.aid"
                @click="toArticleDetail(item.aid)"
            >
              <img class="article-list-item_img" :src="item.thum" alt="">
              <div class="article-list-item_content">
                <p class="article-list-item_content_title">{{item.title}}</p>
                <p class="article-list-item_content_desc">{{item.abstract}}</p>
              </div>
            </div>
        </div>
      </CusScroll>
      <CusScroll
          ref="actListRef"
          v-show="activeCode === 3"
          refresher
          infiniting
          @on-refresh="refreshAct"
          @on-infinite="infiniteScrollAct"
      >
        <div class="act-list-wrap">
          <div
              class="act-list-item"
              v-for="(item) in actList"
              :key="item.aid"
              @click="toActiveDetail(item.aid)"
          >
            <image mode="aspectFill" class="act-list-item_img" :src="item.thum" alt=""></image>
            <p class="act-list-item_title">{{ item.title }}</p>
            <p class="act-list-item_desc">
              <span class="act-list-item_desc_label">报名截止时间：</span>
              <span class="act-list-item_desc_value">{{ showTime(item.registration_end_time, '-') }}</span>
            </p>
          </div>
        </div>
      </CusScroll>
    </view>
  </Layout>

</template>

<script>
import Layout from "@/components/layout/index.vue";
import CusScroll from '@/components/cusScroll';
import { videoLove, getVideoList, getArticleList, getActiveList } from '@/api';
import { showTime } from "../../../service";

export const TAB = [
  {
    label: '视频',
    code: 1,
    check: false,
  },
  {
    label: '文章',
    code: 2,
    check: false,
  },
  {
    label: '活动',
    code: 3,
    check: false,
  },
];

export default {
  name: "old-world-main",
  components: {
    Layout,
    CusScroll,
  },
  data() {
    return {
      title: '',
      itemList: TAB,
      activeCode: 1,
      videoList: [],
      articleList: [],
      actList: [],
      videoModelID: '',
      articleModelID: '',
      videoPageConfig: {
        page: 1,
        pageSize: 10,
        curPage: 1,
        totalPage: 0
      },
      articlePageConfig: {
        page: 1,
        pageSize: 10,
      },
      actPageConfig: {
        page: 1,
        pageSize: 10,
      }
    }
  },
  onLoad(options) {
    const { title = '', ids } = options;
    this.title = title;
    const [videoModelID, articleModelID] = ids.split(',');
    this.videoModelID = videoModelID;
    this.articleModelID = articleModelID;
    this.getVideoList(1);
  },
  methods: {
    showTime,
    handleClickItem({ code }) {
      this.activeCode = code;
      if (code === 1) {
        this.refreshVideo({});
      } else if (code === 2) {
        this.refreshArticle({});
      } else if (code === 3) {
        this.refreshAct({});
      }
    },
    async refreshVideo({ complete }) {
      this.videoPageConfig.page = 1;
      this.videoPageConfig.curPage = 1;
      try {
        await this.getVideoList()
      } finally {
        complete && complete();
      }
    },
    async loveVideo(vid, isLove, index) {
      try {
        uni.showLoading({title: '数据加载中，请稍后'});;
        await videoLove(vid);
        this.videoList[index].is_like = !isLove;
        const likeNum = this.videoList[index].like_num;
        if (isLove) {
          this.videoList[index].like_num = likeNum - 1;
        } else {
          this.videoList[index].like_num = likeNum + 1;
        }
      } finally {
        uni.hideLoading();
      }
    },
    toPlayVideo(videoInfo, index) {
      const { id } = videoInfo;
      const { page, totalPage } = this.videoPageConfig;
      uni.setStorageSync('videoList', JSON.stringify(this.videoList));
      setTimeout(() => {
        uni.navigateTo({
          url:
              `/pages/oldWorldPackage/playVideo/index?vid=${id}&page=${page}&index=${index}&totalPage=${totalPage}`,
        });
      }, 100)
    },
    toArticleDetail(aid) {
      uni.navigateTo({
        url: '/pages/oldWorldPackage/articleDetail?aid=' + aid,
      });
    },
    toActiveDetail(aid) {
      uni.navigateTo({
        url: '/pages/oldWorldPackage/activeDetail?aid=' + aid,
      });
    },
    async getVideoList(page = this.videoPageConfig.page) {
      uni.showLoading({title: '数据加载中，请稍后'});;
      try {
        const res = await getVideoList(page, this.videoPageConfig.pageSize, this.videoModelID);
        this.$nextTick(() => {
          const { info, totalPage } = res.data.data;
          if (page === 1) {
            this.videoList = [
                ...info,
            ];
          } else {
            this.videoList = [...this.videoList, ...info];
          }
          this.videoPageConfig.totalPage = totalPage;
          if (page < totalPage) {
            this.videoPageConfig.page = page + 1;
            this.videoPageConfig.curPage = page;
            this.$refs.videoListRef.setStatus('more', false);
          } else {
            this.$refs.videoListRef.setStatus('nomore', true);
          }
        });
      } finally {
        uni.hideLoading();
      }
    },
    async getArticleList(page=this.articlePageConfig.page) {
      uni.showLoading({title: '数据加载中，请稍后'});
      try {
        const res = await getArticleList(page, this.articlePageConfig.pageSize, this.articleModelID);
        this.$nextTick(() => {
          const { info, totalPage } = res.data.data;
          if (page === 1) {
            this.articleList = [...info];
          } else {
            this.articleList = [...this.articleList, ...info];
          }
          if (page < totalPage) {
            this.articlePageConfig.page = page + 1;
            this.$refs.articleListRef.setStatus('more', false);
          } else {
            this.$refs.articleListRef.setStatus('nomore', true);
          }
        });
      } finally {
        uni.hideLoading();
      }
    },
    infiniteScrollVideo() {
      this.getVideoList();
    },
    async refreshArticle({ complete }) {
      this.articlePageConfig.page = 1;
      try {
        await this.getArticleList()
      } finally {
        complete && complete();
      }
    },
    infiniteScrollArticle() {
      this.getArticleList();
    },
    async getActiveList(page = this.actPageConfig.page) {
      uni.showLoading({title: '数据加载中，请稍后'});;
      try {
        const res = await getActiveList(page, this.actPageConfig.pageSize, this.articleModelID, uni.getStorageSync('cityCode'));
        this.$nextTick(() => {
          const { info, totalPage } = res.data.data;
          if (page === 1) {
            this.actList = [...info];
          } else {
            this.actList = [...this.actList, ...info];
          }
          if (page < totalPage) {
            this.actPageConfig.page = page + 1;
            this.$refs.actListRef.setStatus('more', false);
          } else {
            this.$refs.actListRef.setStatus('nomore', true);
          }
        });
      } finally {
        uni.hideLoading();
      }
    },
    async refreshAct({ complete }) {
      this.actPageConfig.page = 1;
      try {
        await this.getActiveList();
      } finally {
        complete && complete();
      }
    },
    infiniteScrollAct() {
      this.getActiveList();
    },
  }
}
</script>

<style scoped lang="less">
@import url('@/common/common.less');
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}
.itemChoice {
  width: 100%;
  height: 98rpx;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  z-index: 10;

  .itemList {
    position: relative;
    flex:1;
    height: 100%;
    @item();
    flex-wrap: wrap;
    font-size: 28rpx;
    color: #666666;
  }
  .item-list-active{
    font-size: 30rpx;
    color: #333333;
  }
  .item-list-active:before {
    position: absolute;
    bottom: 12rpx;
    left: 50%;
    content: '';
    width: 42rpx;
    height: 6rpx;
    background: #fd7600;
    border-radius: 3rpx;
    transform: translateX(-50%);
  }
}
.scroll-view-wrap {
  height: calc(100vh - 216rpx - var(--status-bar-height));
}
.video-list-wrap{
  padding: 20rpx;
  .video-list-item {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 710rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10rpx;
    overflow: hidden;
    .video-list-item-img{
      width: 100%;
      height: 400rpx;
    }
    .video-list-item-desc_title{
      position: absolute;
      left: 19rpx;
      font-size: 32rpx;
      font-weight: 500;
      color: #F8F8F8;
      bottom: 138rpx;
      width: 690rpx;
    }
    .video-list-item-desc {
      padding: 0 28rpx 0 19rpx;
      display: flex;
      color: @sub-text-color;
      background-color: #FFFFFF;
      height: 114rpx;
      align-items: center;
      justify-content: space-between;
      .video-list-item-desc-user{
        display: flex;
        align-items: center;
        .pic{
          width: 68rpx;
          height: 68rpx;
          border-radius: 50%;
        }
        .offical-recommand{
          margin-left: 14rpx;
          color: #333333;
          font-size: 26rpx;
        }
      }
      &_action {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 32rpx;
        .recommend{
          font-size: 24rpx;
          color: #333333;
        }
        .like-wrap{
          display: inline-flex;
          align-items: center;
          font-size: 24rpx;
          .like-icon{
            width: 30rpx;
            height: 30rpx;
          }
          .like-count {
            color: @grey-text-color;
            margin-left: 8rpx;
          }
        }
      }
    }
  }
}
.article-list-wrap{
  padding: 20rpx;
  .article-list-item{
    display: flex;
    align-items: center;
    margin-bottom: 60rpx;
    &_img{
      width: 260rpx;
      height: 166rpx;
      border-radius: 10rpx;
    }
    &_content{
      flex: 1;
      margin-left: 24rpx;
      overflow: hidden;
      &_title{
        color:#333333;
        font-size: 30rpx;
        line-height: 36rpx;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      &_desc{
        padding-top: 24rpx;
        line-height: 24rpx;
        font-size: 24rpx;
        color: #999999;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }

}
.act-list-wrap{
  .act-list-item{
    margin-top: 20rpx;
    padding: 22rpx 20rpx 25rpx;
    background-color: #FFFFFF;
    &_img{
      width: 710rpx;
      height: 210rpx;
      border-radius: 10rpx;
    }
    &_title{
      padding-top: 26rpx;
      font-size: 30rpx;
      color: #333333;
      line-height: 36rpx;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
    &_desc{
      padding-top: 34rpx;
      display: flex;
      align-items: center;
      &_label{
        color:#666666;
        font-size: 24rpx;
      }
      &_value{
        font-size: 30rpx;
        color: #FD7C09;
        line-height: 37rpx;
      }
    }
  }
}
</style>

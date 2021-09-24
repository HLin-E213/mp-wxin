<template>
  <Layout
      title="文章详情"
      showFooter
  >
  <div class="article-detail-page-wrap">
    <div class="title">
      {{detail.title || ''}}
    </div>
    <div class="publish-info-wrap">
      <div class="user-info">
        <img class="publish-user-pic" :src="detail.author.pic" alt="">
        <div class="publish-info">
          <p class="publish-info-text">{{detail.author.nick  || ''}}</p>
          <p class="publish-info-text publish-info-time">{{detail.time  || ''}}</p>
        </div>
      </div>
      <div class="follow-btn" @click="doFollow(detail.author.id)" v-if="!detail.is_follow">关注</div>
      <div class="follow-btn" @click="doFollow(detail.author.id)" v-else>取消关注</div>
    </div>
    <div class="detail-rich">
      <rich-text :nodes="nodes"></rich-text>
    </div>

  </div>
  <div slot="footer" style="width: 100%; height: 100%;background-color: #ffffff">
    <div class="icon-wrap">
      <div class="icon-item">
        <img class="icon" @click="doLoveArticle" v-if="detail.is_like" src="../../static/like-dashed.png" alt="">
        <img class="icon" @click="doLoveArticle" v-else src="../../static/like-grey.png" alt="">
        <p class="value">{{ detail.love_cnt || '' }}</p>
      </div>
      <div class="icon-item">
        <img class="icon" @click="doCollectArticle" v-if="detail.is_collect" src="http://admin.dajxyl.com/oss?path=video/upload/202108/shoucang-active@2x.png" alt="">
        <img class="icon" @click="doCollectArticle" v-else src="../../static/shoucang-grey.png" alt="">
        <p class="value">{{ detail.collect_num || '' }}</p>
      </div>
    </div>
  </div>
  </Layout>

</template>

<script>
import Layout from "@/components/layout/index.vue";
import { ShareArticlePageUrl } from "../../utils/config";
import { getArticleDetail, articleLove, articleCollect, articleFollow } from '../../api';

export default {
  name: "articleDetail",
  components: {
    Layout
  },
  computed: {
    nodes() {
      return this.detail && this.detail.main && this.detail.main.replace(/\<img/gi,
          '<img style="max-width:100%;border-radius: 10px"')
    }
  },
  data() {
    return {
      aid: '',
      detail: {},
    }
  },
  onShareAppMessage() {
    return {
      title: '大爱金孝',
      path: `/pages/main/webView?url=${encodeURIComponent(ShareArticlePageUrl+this.aid)}`,
    }
  },
  onLoad(options) {
    const { aid } = options;
    this.aid = aid;
    this.getDetail();
  },
  methods: {
    async getDetail() {
      uni.showLoading({title: '数据加载中，请稍后'});;
      try {
        const res = await getArticleDetail(this.aid);
        this.detail = res.data.data.info;
      } finally {
        uni.hideLoading();
      }
    },
    async doLoveArticle() {
      uni.showLoading({title: '数据加载中，请稍后'});;
      try {
        await articleLove(this.aid);
        await this.getDetail();
      } finally {
        uni.hideLoading();
      }
    },
    async doCollectArticle() {
      uni.showLoading({title: '数据加载中，请稍后'});;
      try {
        await articleCollect(this.aid);
        await this.getDetail();
      } finally {
        uni.hideLoading();
      }
    },
    async doFollow(userID) {
      uni.showLoading({title: '数据加载中，请稍后'});;
      try {
        await articleFollow(userID);
        await this.getDetail();
      } finally {
        uni.hideLoading();
      }
    },
  }
}
</script>

<style scoped lang="less">
.article-detail-page-wrap{
  min-height: 100%;
  padding: 20rpx;
  background-color: #FFFFFF;
  .title{
    padding: 22rpx 19rpx 22rpx 1rpx;
    font-size: 40rpx;
    color:#333333;
    font-weight: bold;
  }
  .publish-info-wrap{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .user-info{
      flex: 1;
      display: flex;
      align-items: center;
    }
    .publish-user-pic{
      height: 60rpx;
      width: 60rpx;
      border-radius: 50%;
    }
    .publish-info{
      margin-left: 20rpx;
        .publish-info-text{
          color: #666666;
          line-height: 28rpx;
          font-size: 28rpx;
        }
      .publish-info-time{
        padding-top: 10rpx;
      }
    }
    .follow-btn{
      padding: 12rpx 28rpx;
      color: #FD7C09;
      font-size: 28rpx;
      line-height: 28rpx;
      border: 2rpx solid #FD7C09;
      border-radius: 26rpx;
    }
  }
  .detail-img{
    margin-top: 52rpx;
    width: 710rpx;
    height: 300rpx;
    border-radius: 10rpx;
  }
  .detail-rich{
    padding-top: 39rpx;
    rich-text {
      width: 100% !important;
      font-size: 16px;
      image {
        width: 94%;
      }
    }
  }
}
.icon-wrap{
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: flex-end;
  .icon-item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 40rpx;
    .icon{
      width: 46rpx;
      height: 46rpx
    }
    .value{
      margin-left: 10rpx;
      color: #333333;
      font-size: 24rpx;
      line-height: 24rpx;
    }
  }
}
</style>

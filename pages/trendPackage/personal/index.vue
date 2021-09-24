<!--
* @Description:
* @Author: mahui
* @Date: 2021/1/19 9:00 PM
-->
<template>
  <layout
      :showBcakImg="false"
      :showFooter="false"
      :showTitle="false"
  >
    <div class="personal-content">
      <trendTop
          fullScreen
          @clickMyTrend="toMyTrend"
          :userInfo="userInfo"
          :type="type"
      ></trendTop>
      <div class="trend-list">
        <div
            v-for="(item, index) in list"
            class="item"
            @click="toDetail(item.id)"
            @longpress="doDeleteTrend(item.id, item.uid)"
        >
          <item
              :info="item"
              @clickToogleLike="toogleLike(item.id, item.isLike, index)"
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
    import layout from '@/components/layout/index.vue';
    import item from '../../trendHome/components/trendItem';
    import trendTop from '../../trendHome/components/trendTop';
    import { getArticle, articleLike, articleDel } from '../../../api/friends';
    import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    export default {
        name: 'personal',
        components: {
            item,
            layout,
            trendTop,
            uniLoadMore,
            uniPopup,
        },
        data() {
            return {
                userInfo: {},
                newsCount: 0,
                hasMore: true,
                loadStatus: 'more', // loading nomre
                list: [],
                showPopup: false,
                delete: {},
                pageConfig: {
                    page: 1,
                    pageSize: 20,
                    totalPage: 0,
                },
                uid: '',
            };
        },
        computed: {
            type() {
                const isOwnner = Number(this.userInfo.uid) === Number(uni.getStorageSync('ownnerUid'));
                return isOwnner ? 'ownner' : 'others';
            },
        },
        onLoad({ uid }) {
            this.getArticleList(uid);
            this.uid = uid;
        },
        onReachBottom() {
            if (this.pageConfig.page < this.pageConfig.totalPage) {
                this.pageConfig.page++;
                this.getArticleList(this.uid);
            }
        },
        async onPullDownRefresh() {
            this.reset();
            await this.getArticleList(this.uid);
            uni.stopPullDownRefresh();
        },
        methods: {
            open() {
                this.$nextTick(() => {
                    this.showPopup = true;
                    this.$refs.popup.open();
                });
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
                this.list.splice(index, 1);
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
                uni.navigateTo({
                    url: `/pages/trendPackage/detail/index?articleId=${articleId}`,
                });
            },
            toMyTrend() {
                uni.navigateTo({
                    url: '/pages/trendPackage/my/index'
                });
            },
            async getArticleList(uid = '') {
                const { page, pageSize } = this.pageConfig;
                const temp =  this.loadStatus;
                try {
                    uni.showLoading({title: '数据加载中，请稍后'});;
                    this.loadStatus = 'loading';
                    const { data } = await getArticle(uid, page, pageSize);
                    const { user, article} = data.data.info || {};
                    this.pageConfig.page += article.currentPage + 1;
                    this.pageConfig.totalPage = article.totalPage;
                    this.list = [
                        ...this.list,
                        ...article.list,
                    ];
                    this.hasMore = article.totalPage > article.currentPage;
                    this.loadStatus = article.currentPage < article.totalPage ? 'more' : 'noMore';         console.log(this.hasMore, this.loadStatus);
                    this.userInfo = user;
                } finally {
                    this.loadStatus = temp;
                    uni.hideLoading();
                }
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
  .personal-content{
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
      font-size: 24rpx;
    }
    .cancel{
      border-top:1rpx solid rgba(153, 153, 153, .2);
    }
  }

</style>

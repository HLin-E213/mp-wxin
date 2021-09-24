<!--
* @Description:
* @Author: mahui
* @Date: 2021/1/20 2:09 PM
-->
<template>
  <layout
      :showFooter="false"
      contentBackgroundColor="#FFFFFF"
  >
    <div slot="title" class="title-wrap">
      <div class="title">
        <image class="title__search" mode="widthFix" src="https://admin.dajxyl.com/oss?path=video/upload/202108/trend-search@2x.png" alt="" />
        <input
            confirm-type="search"
            @confirm="doSearch"
            class="title__input"
            type="text"
            v-model="keywords"
            placeholder="请输入搜索内容"
        >
      </div>
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
            @clickTrendListItemHead="clickTrendListItemHead"
            @clickToogleLike="toogleLike(item.id, item.isLike, index)"
        >

        </item>
      </div>
      <view v-show="hasMore">
        <uni-load-more :status="loadStatus" ></uni-load-more>
      </view>
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
    import { articleSearch, articleLike, articleDel, } from '../../../api/friends';
    import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
    import uniPopup from '@/components/uni-popup/uni-popup.vue';

    export default {
        name: 'index',
        components: {
            layout,
            item,
            uniLoadMore,
            uniPopup,
        },
        onReachBottom() {
            if (this.pageConfig.page < this.pageConfig.totalPage) {
                this.pageConfig.page++;
                this.getSearchList();
            }
        },
        onLoad({ keywords = '' }) {
            this.keywords = keywords;
            this.doSearch();
        },
        async onPullDownRefresh() {
            this.reset();
            await this.getSearchList();
            uni.stopPullDownRefresh();
        },
        data() {
            return {
                hasMore: true,
                loadStatus: 'more', // loading nomre
                list: [],
                keywords: '',
                showPopup: false,
                delete: {},
                pageConfig: {
                    page: 1,
                    pageSize: 20,
                    totalPage: 0,
                },
            };
        },
        methods: {
            doSearch() {
                this.reset();
                this.getSearchList();
            },
            async getSearchList() {
                const { page, pageSize } = this.pageConfig;
                try {
                    uni.showLoading({title: '数据加载中，请稍后'});;
                    this.loadStatus = 'loading';
                    const res = await articleSearch(this.keywords, page, pageSize);
                    const currentPage = res.data.data.currentPage;
                    const totalPage = res.data.data.totalPage;
                    const list = res.data.data.info.list || [];
                    this.pageConfig.page += 1;
                    this.pageConfig.totalPage = totalPage;
                    this.list = [
                        ...this.list,
                        ...list,
                    ];
                    // 1,0
                    this.hasMore = totalPage < currentPage;
                    this.loadStatus = currentPage < totalPage ? 'more' : 'nomre';
                }
                finally {
                    uni.hideLoading();
                }
            },
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
                this.userInfo= {};
            },
            clickTrendListItemHead(uid) {
                this.toPersonal(uid);
            },
            toPersonal(uid) {
                uni.navigateTo({
                    url:  `/pages/trendPackage/personal/index?uid=${uid}`
                });
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
        },
    };
</script>

<style scoped lang="less">
  .title-wrap{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    .trend-list{
      .item{
        margin-top: 20rpx;
      }
      .item:first-of-type{
        margin-top: 0;
      }
    }
    .title{
      display: flex;
      padding: 0 32rpx;
      width: 492rpx;
      height: 64rpx;
      background: #F8F8F8;
      border-radius: 32rpx;
      align-items: center;
      &__search{
        width: 40rpx;
        height: 40rpx;
      }
      &__input{
        height: 100%;
        width: 492rpx;
        border: none;
        margin-left: 20rpx;
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

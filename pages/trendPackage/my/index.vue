<!--
* @Description:
* @Author: mahui
* @Date: 2021/1/19 9:35 PM
-->
<template>
  <layout
      title="我的动态"
      :showFooter="false"
      border
  >
    <div class="my-content">
      <div class="my-content-list">
        <div
            class="my-content-list-item"
            v-for="(item) in list"
            :key="item.id"
        >
          <img
              class="my-content-list-item-left"
              :src="item.fromUser.pic"
              alt=""
          >
          <div class="my-content-list-item-center">
            <p class="my-content-list-item-center__name">{{ item.fromUser.nickname || '--' }}</p>
            <img v-if="item.type == 1"
                class="my-content-list-item-center__like"
                src="../../../static/like-light.png"
                alt=""
            >
            <p class="my-content-list-item-center__text" v-if="item.type == 2">
              回复
              <span class="my-content-list-item-center__text-name">
                {{ item.user.nickname || '' }}：</span>
              {{ item.content || '--' }}
            </p>
            <p class="my-content-list-item-center__time">{{ formatTime(item.create_time) }}</p>
          </div>
          <img
              v-if="item.cover_img"
              class="my-content-list-item-right"
              :src="item.cover_img"
              alt=""
          >
        </div>
      </div>
      <view v-show="hasMore">
        <uni-load-more :status="loadStatus" ></uni-load-more>
      </view>
    </div>
  </layout>
</template>

<script>
    import { showTime } from '../../../service';
    import layout from '@/components/layout/index.vue';
    import { myTrend } from '../../../api/friends';
    import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";

    export default {
        name: 'index',
        components: {
            layout,
            uniLoadMore,
        },
        computed: {
            formatTime() {
                return function show(time) {
                    return showTime(Number(time));
                };
            },
        },
        data() {
            return {
                hasMore: true,
                loadStatus: 'more', // loading nomre
                list: [],
                pageConfig: {
                    page: 1,
                    pageSize: 20,
                    totalPage: 0,
                },
            };
        },
        onShow(){
            this.reset();
            this.getMyTrendList();
        },
        onReachBottom() {
            if (this.pageConfig.page < this.pageConfig.totalPage) {
                this.pageConfig.page++;
                this.getMyTrendList();
            }
        },
        async onPullDownRefresh() {
            this.reset();
            await this.getMyTrendList();
            uni.stopPullDownRefresh();
        },
        methods: {
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
            async getMyTrendList() {
                const { page, pageSize } = this.pageConfig;
                const temp =  this.loadStatus;
                try {
                    uni.showLoading({title: '数据加载中，请稍后'});;
                    this.loadStatus = 'loading';
                    const { data } = await myTrend(page, pageSize);
                    const { info = {}, currentPage, totalPage} = data.data || {};
                    this.pageConfig.page = currentPage;
                    this.pageConfig.totalPage = totalPage;
                    this.list = [
                        ...this.list,
                        ...info.list,
                    ];
                    this.hasMore = totalPage > currentPage;
                    this.loadStatus = currentPage < totalPage ? 'more' : 'nomre';
                } finally {
                    this.loadStatus = temp;
                    uni.hideLoading();
                }
            },
        },
    };
</script>

<style scoped lang="less">
  .my-content{
    .my-content-list{
      background-color: #FFFFFF;
      padding: 0 20rpx;
      &-item{
        padding: 35rpx 0 27rpx 0;
        display: flex;
        align-items: center;
        border-bottom: 1rpx solid rgba(153, 153, 153,.2);
        &-left{
          height: 98rpx;
          width: 98rpx;
          border-radius: 50%;
        }
        &-center{
          flex: 1;
          margin: 0 20rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          &__name{
            font-size: 32rpx;
            color: #333333;
          }
          &__like{
            margin-top: 17rpx;
            height: 34rpx;
            width: 34rpx;
          }
          &__text{
            margin-top: 17rpx;
            font-size: 26rpx;
            color: #333333;
            &-name{
              color:#4B2300;
              padding:0 5rpx;
            }
          }
          &__time{
            margin-top: 17rpx;
            font-size: 24rpx;
            color: #666666;
          }
        }
        &-right{
          height: 119rpx;
          width: 119rpx;
          border-radius: 6rpx;
        }
      }
      &-item:last-of-type{
        border-bottom: none;
      }
    }
  }

</style>

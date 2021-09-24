<template>
	<layout
  title="我的金币明细"
  :showFooter="false"
  >
		<div class="gold-detal-page">
      <div class="suc-wrap" >
        <div class="total-gold-wrap">
          <div class="harf">
            <p class="value">{{canUseGold}}</p>
            <p class="label">可用金币</p>
          </div>
          <div class="spread"></div>
          <div class="harf">
            <p class="value">{{totalGold}}</p>
            <p class="label">累计金币</p>
          </div>

        </div>
      </div>
      <div class="detail-scroll-area">
        <div class="title">
          <p class="month" @click="showPopup = !showPopup">
          {{month}}
          <img
           src="https://admin.dajxyl.com/oss?path=video/upload/202108/sign-arrow-down.png"
           alt=""
           class="down"
           :class="{up: showPopup}"
           >
         </p>
         <p class="desc">可用金币： <span class="amount">{{monthIntegral}}</span></p>
        </div>
        <div class="scroll-view-wrap" :style="{height: scrollHeight}">
          <CusScroll
          ref="listRef"
          refresher
          infiniting
          @on-refresh="refresh"
          @on-infinite="infiniteScroll"
          >
            <div class="list-wrap" v-if="list.length">
              <div
              class="list-item"
              v-for="(item, index) in list"
              :key=index
              >
                <div class="list-item-left">
                  <p class="list-item-left-desc">{{item.desc}}</p>
                  <p class="list-item-left-date">{{showDate(item.time)}}</p>
                </div>
                <p class="list-item-right">
                  <span class="add">{{ item.type == 1 ? '+' : '-' }}</span>
                  {{item.integral || ''}}
                </p>
              </div>
            </div>
            <div class="no-data-wrap" v-else-if="fetchError">
              <img class="no-data-img" src="https://admin.dajxyl.com/oss?path=video/upload/202108/no-network@2x.png"
                   alt="">
              <p class="no-data-text">数据加载失败，请检查网络</p>
              <button class="no-data-retry" @click="getDetailList()">重新加载</button>
            </div>
            <div class="no-data-wrap" v-else>
              <img class="no-data-img" src="https://admin.dajxyl.com/oss?path=video/upload/202108/no-data@2x.png"
                   alt="">
              <p class="no-data-text">暂无相关数据</p>
            </div>
          </CusScroll>
        </div>
      </div>
    </div>
    <WPicker
      :visible.sync="showPopup"
      :startYear="startYear"
      :endYear="endYear"
      :value="month"
      @confirm="change"
      @cancel="close"
      fields="month"
     />
	</layout>
</template>

<script>
  const statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'
  import layout from '@/components/layout/index.vue';
  import { showDate, TIME_TYPE } from '../../service.js';
  import { getUserIntegral, getUserIntegralLog } from '@/api/index.js';
  import WPicker from './components/w-picker/index';
  import CusScroll from '@/components/cusScroll';
	export default {
    name: 'task-center-home',
    components: {
      layout,
      WPicker,
      CusScroll,
    },
    onLoad() {
      this.getUserSignInData();
      this.refresh({})
    },
		data() {
      const RANGE = 10; // 年限范围 上下十年
      const curYearMonth = showDate(new Date().valueOf(),TIME_TYPE.MILLI_SECOND, '-', 'YYYYMM');
      const [year, month] = curYearMonth.split('-');
      const curYear=Number(year);
			return {
				month: curYearMonth,
        showPopup: false,
        startYear: curYear - RANGE,
        endYear: curYear + RANGE,
        calendars: [],
        canUseGold: '',
        fetchError: false,
        totalGold: '',
        scrollHeight: `calc(100vh - 460rpx - ${statusBarHeight})`,
        pageConfig: {
          page: 1,
          page_size: 10,
        },
        list: [],
        monthIntegral: '',
			}
		},
		methods: {
      async getUserSignInData() {
        try {
          uni.showLoading({title: '加载中'});
          const res = await getUserIntegral();
          const { integral_accumulated, integral } = res.data.data.info.user_integral || {};
          this.canUseGold = integral;
          this.totalGold = integral_accumulated;
        } finally{
          uni.hideLoading();
        }
      },
      close() {
        this.showPopup = false;
      },
      change(e) {
        this.month = e.value;
        this.refresh({});
      },
      async getDetailList(page = this.pageConfig.page) {
        uni.showLoading({title: '加载中'});
        try {
          const res = await getUserIntegralLog(this.month, page, this.pageConfig.page_size);
          this.$nextTick(() => {
            const { info, totalPage } = res.data.data;
            if (!info.length) {
              this.list = [];
              this.monthIntegral = 0;
              this.$refs.listRef.setStatus('nodata');
              return false;
            }
            const { list, month_integral } = info[0];
            this.monthIntegral = month_integral;
            if (page === 1) {
              this.list = [...list];
            } else {
              this.list = [...this.list, ...list];
            }
            if (page < totalPage) {
              this.pageConfig.page = page + 1;
              this.$refs.listRef.setStatus('more', false);
            } else {
              this.$refs.listRef.setStatus('nomore', true);
            }
          });
        } catch (e) {
          this.list = [];
          this.monthIntegral = 0;
          this.$refs.listRef.setStatus('nodata');
          this.fetchError = true;
          return false;
        } finally {
          uni.hideLoading();
        }
      },
      async refresh({ complete }) {
        try {
          await this.getDetailList();
        } finally {
          complete && complete();
        }
      },
      showDate,
      async infiniteScroll() {
        await this.getDetailList();
      },
		}
	}
</script>

<style lang="less" scoped>
  .scroll-view-wrap {
    background-color: #FFFFFF;
    .no-data-wrap{
      margin-top: 90rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .no-data-img{
        width: 500rpx;
        height: 400rpx;
      }
      .no-data-text{
        font-size: 26rpx;
        color: #999999;
        margin-top: 12rpx;
      }
      .no-data-retry{
        margin-top: 35rpx;
        width: 300rpx;
        height: 82rpx;
        background-color: #FFFFFF;
        border: 1px solid #DBD9D9;
        border-radius: 41rpx;
        font-size: 32rpx;
        color: #FD7C09;
        line-height: 82rpx;
        text-align: center;
      }
      .no-data-retry::after{
        border: none;
      }
    }
    .list-wrap{
      padding: 2rpx 18rpx;
      .list-item{
        padding: 29rpx 0 31rpx 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(153, 153, 153, .2);
        .list-item-left{
          color: #333333;
          .list-item-left-desc{
            font-size: 28rpx;
          }
          .list-item-left-date{
            padding-top: 35rpx;
            font-size: 24rpx;
          }
        }
        .list-item-right{
          display: flex;align-items: center;
          font-weight: bold;
          font-size: 44rpx;
          color: #FD7C09;
          .add{
            font-size: 39rpx;
            margin-right: 6rpx;
          }
        }
      }
    }
  }
  .gold-detal-page{
    position: relative;
    height: 100%;
    .suc-wrap{
      position: relative;
      width: 100vw;
      height: 180rpx;
      background-image: url("https://admin.dajxyl.com/oss?path=video/upload/202108/my-gold-detail.png");
      background-size: 100% 100%;
      margin-bottom: 90rpx;
      .total-gold-wrap{
        display: flex;
        align-items: center;
        margin: 0 auto;
        width: 660rpx;
        height: 150rpx;
        background-color: #FFFFFF;
        box-shadow: 0 2rpx 10rpx 0 rgba(204, 204, 204, 0.3);
        border-radius: 20rpx;
        z-index: 10;
        transform: translateY(84rpx);
        .harf{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          .value{
            font-size: 56rpx;
            color: #FD7C09;
            text-align: center;
            font-weight: bold;
          }
          .label{
            text-align: center;
            color: #666666;
            font-size: 26rpx;
          }
        }
        .spread{
          width: 1rpx;
          height: 45rpx;
          background-color: #CCCCCC;
          opacity: 0.5;
        }
      }
    }
    .detail-scroll-area{
      margin: 0 20rpx;
      border-radius: 20rpx 20rpx 0 0;
      overflow: hidden;
      background-color: #FFFFFF;
      .title{
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #FFF5ED;
        color:#333333;
        height: 80rpx;
        padding: 0 20rpx;
        .desc{
          display: flex;
          align-items: center;
          position: relative;
          font-size: 26rpx;
          padding-left: 20rpx;
          .amount{
            font-size: 30rpx;
            color: #FD7C09;
            font-weight: bold;
          }
        }
        .month{
          display: flex;
          align-items: center;
          font-size: 28rpx;
          .down{
            width: 24rpx;
            height: 24rpx;
            margin-left: 10rpx;
          }
          .up{
            transform: rotate(180deg);
          }
        }
      }
    }
   }

</style>

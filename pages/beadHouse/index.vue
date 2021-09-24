<template>
  <Layout
      title="康养中心"
      :showFooter="false"
  >
    <div class="bead-content">
      <img class="bead-banner" src="https://admin.dajxyl.com/oss?path=img/banner_beadhouse.png" alt="">
      <div class="house-wrap">
        <div
            class="house-item"
            v-for="(item) in beadList"
            :key="item.id"
        >
          <div class="house-img-wrap">
            <img class="house-img" :src="item.thum[0]" alt="">
          </div>
          <div class="house-intro">
            <p class="house-intro-title">{{item.title}}</p>
            <div class="house-move-intro">
              <p class="house-intro-desc">已入住{{ item.bed - item.remains }} / {{ item.bed }}</p>
              <div class="move-into" @click="toContact(item.tel)">入住咨询</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>

</template>

<script>
import Layout from "@/components/layout/index.vue";
import { CONTACT_TEL } from "@/config/constant";
import { getBeadhouse } from "../../api";

export default {
  components: {
    Layout,
  },
  name: "beadHouse",
  data() {
    return {
      page: 1,
      pageSize: 10,
      totalPage: 0,
      beadList: [],
      adCode: '',
    }
  },
  onShow() {
    this.adCode =  uni.getStorageSync('cityCode');
  },
  onReachBottom() {
    if (this.page < this.totalPage) {
      this.page++;
      this.getBeadList();
    }
  },
  onPullDownRefresh() {
    this.page = 1;
    this.pageSize = 10;
    this.beadList = []
    this.getBeadList();
  },
  mounted() {
    this.getBeadList(1);
  },
  methods: {
    getBeadList(page = this.page) {
      getBeadhouse(this.adCode, page, 10).then((res) => {
        const { info, totalPage } = res.data.data;
        this.beadList = [...this.beadList, ...info];
        this.totalPage = totalPage;
        console.log('res', info, totalPage);
      }).finally(function() {
        uni.stopPullDownRefresh();
      });
    },
    toContact(phoneNumber) {
      uni.makePhoneCall({
        phoneNumber: CONTACT_TEL,
      });
    }
  },
}
</script>

<style scoped lang="less">
.bead-content{
  padding: 22rpx 23rpx;
  background-color: #FFFFFF;
  .bead-banner{
    height: 312rpx;
    border-radius: 20rpx;
    width: 713rpx;
  }
  .house-wrap{
    .house-item{
      margin-top: 20rpx;
      position: relative;
      display: flex;
      align-items: center;
      .house-img-wrap{
        display: flex;
        align-items: center;
        justify-content: center;
        .house-img{
          width: 235rpx;
          height: 160rpx;
          border-radius: 10rpx;
        }
      }
      .house-intro{
        flex: 1;
        margin-left: 21rpx;
        .house-intro-title{
          font-size: 30rpx;
          color: #333333;
          font-weight: bold;
        }
        .house-move-intro{
          width: 100%;
          margin-top: 29rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .house-intro-desc{
          font-size: 24rpx;
          color: #666666;
        }
      }
      .move-into{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 161rpx;
        height: 59rpx;
        background-color: #FD7C09;
        color: #FFFFFF;
        font-size: 28rpx;
        border-radius: 30rpx;
      }
    }
  }
}

</style>

<template>
  <Layout
      title="活动详情"
      showFooter
      :footerHeight="136"
  >
    <div class="detail-active-page">
      <p class="title">{{detail.title}}</p>
      <div class="rich-wrap">
        <rich-text :nodes="nodes"></rich-text>
      </div>
    </div>
    <div slot="footer" class="button-wrap" style="width: 100%; height: 100%;background-color: #ffffff">
      <button
          v-if="isEnlist"
          type="primary"
          class="button"
          @click="toCheckReportInfo"
      >查看报名情况</button>
      <button
          v-else-if="isDead"
          type="primary"
          disabled
          class="button disabled"
      >报名已截止</button>

      <button
          v-else
          type="primary"
          class="button"
          @click="handleTapReport"
      >立即报名</button>
    </div>
  </Layout>
</template>

<script>
import Layout from "@/components/layout/index.vue";
import { getActiveDetail, getUserInfo } from '../../api';

export default {
  name: "activeDetail",
  components: {
    Layout,
  },
  data() {
    return {
      aid: '',
      detail: {},
    }
  },
  computed: {
    nodes() {
      return this.detail && this.detail.abstract && this.detail.abstract.replace(/\<img/gi,
          '<img style="max-width:100%; height: auto;border-radius: 10px"')
    },
    isDead() {
      const isOvertime = this.detail.registration_end_time && new Date().getTime() >
          this.detail.registration_end_time * 1000; // 是否已经过了截止时间
      const isOverNum = this.detail.NumberLimitPeople && this.detail.enlist >= this.detail.NumberLimitPeople;
      // 是否已经到了最大报名人数
      return isOvertime || isOverNum;
    },
    isEnlist() {
      return parseInt(this.detail.is_enlist) > 0; // 是否报名
    }
  },
  onLoad(options) {
    const { aid } = options;
    this.aid = aid;
    this.getDetail();
  },
  onShow() {
    if (this.aid) {
      this.getDetail();
    }
  },
  methods: {
    async getDetail() {
      uni.showLoading({title: '数据加载中，请稍后'});;
      try {
        const res = await getActiveDetail(this.aid);
        this.detail = res.data.data.info;
      } finally {
        uni.hideLoading();
      }
    },
    async handleTapReport() {
      await getUserInfo();
      uni.navigateTo({
        url: '/pages/oldWorldPackage/joinActive?aid=' + this.aid,
      });
    },
    toCheckReportInfo() {
      uni.navigateTo({
        url: `/pages/oldWorldPackage/joinActive?aid=${this.aid}&type=check`,
      });
    },
  },
}
</script>

<style scoped lang="less">
.detail-active-page{
  padding: 20rpx 20rpx;
  .title{
    padding-top: 22rpx;
    font-size: 40rpx;
    color: #333333;
    font-weight: bold;
    line-height: 52rpx;
  }
  .rich-wrap{
    padding-top: 42rpx;
    font-size: 16px;
  }
}
.button-wrap{
  display: flex;
  align-items: center;
  justify-content: center;
  .button{
    background: #fd7c09;
    border-radius: 46rpx;
    height: 92rpx;
    width: 664rpx;
    font-size: 36rpx;
    color: #FFFFFF;
  }
  .disabled{
    background: #CCCCCC;;
  }
}


</style>

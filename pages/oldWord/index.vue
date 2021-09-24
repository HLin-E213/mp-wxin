<template>
  <layout
      title="老年天地"
      :showFooter="false"
  >
    <!--轮播图-->
    <div v-if="img_list.length" class="rotation" :class="{'rotation-ns':  isNotchScreen}">
      <div class="banner">
        <Banner :ids="ids" height="268rpx" :img_list="img_list" />
      </div>
    </div>
    <div class="service-wrap">
      <div
          v-for="(item) in services"
          class="service-wrap-item"
          :key="item.id"
          @click="handleClickItem(item.payload, item.main)"
      >
        <img class="img" :src="item.icon[0]" alt="">
        <div class="content">
          <p class="title">{{item.main}}</p>
          <p class="subtitle">{{item.sub}}</p>
          <img
              class="icon"
              src="../../static/trend-arrow-right.png"
              alt=""
          >
        </div>
      </div>
    </div>
  </layout>

</template>

<script>
import Layout from "@/components/layout/index.vue";
import Banner from '@/components/banner.vue';
import { rotationPicture, getMenuServiceType } from "../../api";

export default {
  name: "old-world",
  components: {
    Layout,
    Banner
  },
  data() {
    const { isNotchScreen } = getApp().globalData;
    return {
      isNotchScreen,
      ids: 1,
      img_list: [],
      services: [],
    }
  },
  onLoad() {
    this.getRotation();
    this.getMenus();
  },
  methods: {
    async getRotation() {
      const { data } = await rotationPicture(20);
      this.img_list = data.data.info || [];
    },
    async getMenus() {
      let cityCode = uni.getStorageSync('cityCode');
      const adCode = cityCode ? cityCode.key : 510100;
      const { data } = await getMenuServiceType(adCode, 0, 7);
      this.services = (data.data.info || []).map((item) => {
        const { title, ...rest } = item;
        const [main, sub] = title.split('|');
        return {
          main,
          sub,
          ...rest,
        }
      });
    },
    handleClickItem(payload, title) {
      const { type, id } = payload;
      if (type === 35) {
        uni.switchTab({
          url: '/pages/trendHome/index'
        });
      } else {
        uni.navigateTo({
          url: `/pages/oldWorldPackage/main/index?title=${title}&ids=${id}`
        });
      }
    }
  },
}
</script>

<style scoped lang="less">
@import url('@/common/common.less');
.rotation{
  height: 268rpx;
   .banner {
    margin: 13rpx 21rpx 24rpx 19rpx;
    width: 710rpx;
    height: 268rpx;
    z-index: 10;
    border-radius: 10rpx;
  }
}
.service-wrap {
  width: 710rpx;
  margin: auto;
  .service-wrap-item {
    margin-bottom: 20rpx;
    position: relative;
    padding: 19rpx 83rpx 19rpx 22rpx;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    box-shadow: 0 1px 10rpx 0 rgba(153, 153, 153, 0.1);
    border-radius: 10rpx;
    .img{
      width: 162rpx;
      height: 162rpx;
      border-radius: 10rpx;
    }
    .content{
      flex: 1;
      margin-left: 22rpx;
      .title {
        position: relative;
        font-weight: bold;
        display: inline-block;
        color: @sub-text-color;
        font-size: 34rpx;
        line-height: 36rpx;
      }
      .title::after{
        content: '';
        position: absolute;
        bottom: -5rpx;
        left: 0;
        width: 100%;
        height: 14rpx;
        background: #FD7C09;
        opacity: 0.16;
        border-radius: 7rpx;
      }
      .subtitle {
        margin-top: 19rpx;
        font-size: 24rpx;
        font-weight: 400;
        color: #999999;
        line-height: 34rpx;
      }
      .icon{
        position: absolute;
        top: 50%;
        right: 19rpx;
        transform: translateY(-50%);
        width: 30rpx;
        height: 30rpx;
      }
    }
  }
  .service-wrap-item:first-of-type{
    margin-top: 34rpx;
  }
}

</style>

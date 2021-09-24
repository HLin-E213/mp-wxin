<!--服务页内容列表-->
<template>
  <view class="content_list">
    <view class="content_list_item" v-for="(i,k) in serviec_list" :key="k">
      <view class="title">
        <b></b>
        <p>{{ i.title }}</p>
      </view>
      <view class="list">
        <view class="serviec_list" v-for="(n,m) in i.childes" :key="m">
          <view @click="goDetailsProduct(n.payload)">
            <view class="service_top">
              <image :src="n.icon[0]" mode=""></image>
            </view>
            <view class="service_name">
              {{ n.title }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapMutations} from 'vuex';
import {getComboInfo, getServiceInfo} from "../../api/index";

export default {
  props: {
    serviec_list: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      service_list: [],
    }
  },
  methods: {
    ...mapMutations('serviceinfo', {
      'setData': 'setData',
    }),
    goDetailsProduct: function (payload) {
      let that = this, res;
      if (!payload.id) return false;
      if (payload.type === 34) {
        res = getComboInfo(payload.id);
        return res.then(function (e) {
          that.setData(e.data.data.info);
          return uni.navigateTo({
            url: '/pages/detailsProduct/comboProduct'
          });
        });
      } else {
        res = getServiceInfo(payload.id);
        return res.then(function (e) {
          that.setData(e.data.data.info);
          return uni.navigateTo({
            url: '/pages/detailsProduct/detailsProduct'
          });
        });
      }
    }
  }
}
</script>

<style lang="less" scoped>
	@import url('@/common/common.less');
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}

.content_list {
  width: 100%;
  height: 100%;
  background: #FFFFFF;

  .content_list_item {
    width: 100%;
    @item();
    margin-top: 31rpx;
    flex-wrap: wrap;
    background: #FFFFFF;

    .title {
      width: 100%;
      display: flex;
      align-items: center;

      b {
        width: 6upx;
        height: 32upx;
        background: #fd7600;
        border-radius: 3upx;
      }

      p {
        font-size: 36upx;
        font-family: PingFang SC;
        font-weight: blod;
        color: #333333;
        margin-left: 12upx;
      }
    }

    .list {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .serviec_list {
        margin-top: 31upx;
        display: flex;
        flex-wrap: wrap;
		    margin-left: 22upx;
        .service_top {
          display: flex;
          justify-content: flex-start;
          align-items: center;

          image {
            width: 222upx;
            height: 220upx;
            border-radius: 10upx;
          }
        }

        .service_name {
		  margin-top: 25upx;
          width: 100%;
          display: flex;
          justify-content: center;
          font-size: 26upx;
          font-family: PingFang SC;
          font-weight: 400;
          color: @main-text-color;
        }
      }
	  .serviec_list:nth-of-type(3n+1) {
		  margin-left: 0;
	  }
    }
  }
}
</style>

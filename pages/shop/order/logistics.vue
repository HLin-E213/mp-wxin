<template>
  <layout :title="title"
          :showFooter="false"
          footerHeight="100"
  >
    <view class="logistics-content-wrap">
      <view class="content">
        <view class="logistics-title">
<!--          <img class="logistics-icon" src="https://admin.dajxyl.com/oss?path=img/sf@2x.png" alt="">-->
          <p class="logistics-text">{{ logisticsInfo.express && logisticsInfo.express.express_company_name }}</p>
        </view>
        <view class="logistics-body">
          <view class="body-title">
            <p>{{ logisticsInfo.express && logisticsInfo.express.express_company_name }}<span class="logistics-no">{{ logisticsInfo.express_number }}</span></p>
          </view>
          <view class="body-content">
            <Timeline :info="logisticsData" />
          </view>
        </view>
      </view>
    </view>
  </layout>
</template>

<script>

import Layout from "@/components/layout/index.vue";
import Timeline from '../../shop/components/TimingLine/index.vue'
import {getExpressInfo} from '../../../api/shop/order';
import {showDateMD,showDateHI} from '../../../service';

export default {
  name: "logistics",
  components: {
      Layout,
      Timeline,
  },
  computed: {

  },
  onLoad(option){
    this.order_no = option.id;
    this.getExpressInfo();
  },
  data: function () {
    return {
        title: '物流信息',
        order_no: '',
        logisticsInfo: {},
        logisticsData: [],
    }
  },
  methods: {
    getExpressInfo() {
      const ret = getExpressInfo(this.order_no);
      ret.then((value) => {
        console.log(value);
        if (value.data.data.info.express.context.length === 0) {
          uni.showToast({
            title: '暂时没有物流信息！',
            icon: 'none',
            duration: 3000
          });
          // return uni.navigateBack({
          //   delta: 1
          // });
        }
        this.logisticsData = value.data.data.info.express.context;
        this.logisticsInfo = value.data.data.info;
        this.logisticsData.forEach((i, k) => {
          this.logisticsData[k].date = showDateMD(i.time);
          this.logisticsData[k].time = showDateHI(i.time);
          this.logisticsData[k].title = i.status;
          this.logisticsData[k].content = i.context;
        });
        console.log(this.logisticsInfo);
      });
    },
  },
}
</script>

<style scoped lang="less">
  .logistics-content-wrap{
    background: rgba(153, 153, 153, .2);
    min-height: 100%;
    overflow: hidden;
  }
.content {
  margin: 24upx 20upx 0 20upx;
  .logistics-title {
    display: flex;
    height: 120upx;
    padding: 0 24upx;
    background: #ffffff;
    align-items: center;
    border-radius: 10upx;
    .logistics-icon {
      width: 54upx;
      height: 54upx;
    }
    .logistics-text {
      margin-left: 38upx;
      font-size: 30upx;
      color: #333333;
    }
  }
  .logistics-body{
    margin-top: 24upx;
    .body-title{
      height: 68upx;
      background: #F8F8F8;
      border-radius: 10upx 10upx 0 0;
      line-height: 68upx;
      color: #666666;
      font-size: 26upx;
      padding-left: 48upx;
      .logistics-no{
        margin-left: 38upx;
      }
    }
    .body-content{
      padding-top: 45upx;
      background-color: #FFFFFF;
    }
  }

}
</style>

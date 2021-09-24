<!--修改预约时间结果页-->
<template>
  <view class="resultTimeModify">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="pagesImg">
      <image src="https://admin.dajxyl.com/oss?path=img/success_origin.png" mode=""></image>
    </view>
    <view class="description">
      <h4>{{ content }}</h4>
      <span class="modify-result">已修改预约时间：<span class="modify-time">{{ showTime }}</span></span>
    </view>
    <view class="downCount">
      <p><span>{{ time }}s</span> 后自动跳转订单详情</p>
    </view>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {showTime} from "../../service";

export default {
  components: {
    uniNavBar,
  },
  computed: {
    ...mapState('orders', {
      'orderData': 'orderData',
    })
  },
  data() {
    return {
      title: '',
      showTime: '',
      content: '预约时间已修改',
      time: 5,
    }
  },
  mounted() {
    console.log(this.orderData);
    this.showTime = showTime(this.orderData.appointment);
    this.downCountTime(5);
  },
  methods: {
    /*倒计时定时器*/
    downCountTime: function (time) {
      let that = this;
      let downCounts = setInterval(() => {
        time--;
        that.time = time;
        if (time <= 0) {
          clearInterval(downCounts);
          if (that.orderData.pid !== 0) {
            return uni.redirectTo({
              url: '/pages/detailsOrder/comboOrder?orderID=' + that.orderData.number,
            });
          }
          return uni.redirectTo({
            url: '/pages/detailsOrder/detailsOrder?orderID=' + that.orderData.number,
          });
        }
      }, 1000)
    },
  }
}
</script>

<style lang="less">
.resultTimeModify {
  width: 100%;
  height: 100%;
  background-color: #ffffff;

  .pagesImg {
	  margin-top: 83upx;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    image {
      width: 230upx;
      height: 197upx;
    }
  }

  .description {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: space-around;
    flex-wrap: wrap;
    margin-top: 33upx;

    h4 {
      font-size: 43upx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #333333;
    }

    span {
      font-size: 28upx;
      font-family: PingFang SC;
      color: #666666;
    }
	.modify-result{
		margin-top: 27upx;
	}
	.modify-time{
		color:#D30A0A;
	}
  }

  .downCount {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 61upx;

    p {
      font-size: 26upx;
      font-family: PingFang SC;
      color: #666666;
	 span{
		 color:#fd7600
	 }
    }
  }
}
</style>

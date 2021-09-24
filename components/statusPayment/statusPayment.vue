<!--支付状态页面组件-->
<template>
  <view class="statusPayment">
     <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="pagesImg">
      <image :src="imgUrl" mode=""></image>
    </view>
    <view class="description">
      <h4>{{ content }}</h4>
    </view>
    <view class="downCount">
      <p v-if="pageFrom=== 'active'"><span>{{ time }}s</span> 后自动回到活动页面</p>
      <p v-else><span>{{ time }}s</span> 后自动跳转订单详情</p>
    </view>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';

export default {
  components: {
    uniNavBar,
  },
  data() {
    return {
      title: '支付订单',
      content: '订单支付成功',
      time: 5,
      imgUrl: 'https://admin.dajxyl.com/oss?path=img/success_origin.png',
      //上一页面传递的订单状态值，0 支付成功  、1 支付失败 、2 申请退款成功、3 服务评价成功、4 订单申请退款
      state: 0,
      type: 0,
      pageFrom: ''
    }
  },
  computed: {
    ...mapState('orders', {
      'imgUrlList': 'imgUrlList',
      'orderData': 'orderData',
    })
  },
  onLoad(option) {
    let that = this;
    that.state = parseInt(option.state);
    if (option.type) {
      that.type = parseInt(option.type);
    }
    this.pageFrom = option.pageFrom || '';
  },
  mounted() {
    this.downCountTime(5);
    if (this.state == 0 || this.state == 2 || this.state == 3) {
      this.imgUrl = this.imgUrlList[0].url;
    } else {
      this.imgUrl = this.imgUrlList[1].url;
    }
    if (this.state == 2) {
      this.title = '订单退款';
      this.content = '订单退款成功';
    }
    if (this.state == 4) {
      this.title = '订单退款';
      this.content = '订单退款申请成功';
      this.imgUrl = this.imgUrlList[0].url;
    }
  },
  methods: {
    /*倒计时定时器*/
    downCountTime: function (time) {
      let that = this;
      this.downCounts = setInterval(() => {
        time--;
        that.time = time;
        if (time <= 0) {
          clearInterval(this.downCounts);
          if (this.pageFrom === 'active') {
            return uni.navigateBack({
              delta:1
            });
          }
          if (that.type === 1) {
            return uni.redirectTo({
              url: '/pages/orderList/orderList',
            });
          }
          if (that.state === 4) {
            return uni.redirectTo({
              url: '/pages/orderList/orderList',
            });
          }
          return uni.redirectTo({
            url: '/pages/detailsOrder/detailsOrder?orderID=' + that.orderData.number,
          });
        }
      }, 1000)
    },
  },
  beforeDestroy() {
    clearInterval(this.downCounts);
  }
}
</script>

<style lang="less" scoped>
.statusPayment {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  .pagesImg {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
	margin-top: 110upx;

    image {
      width: 230upx;
      height: 197upx;
    }
  }

  .description {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 27upx;

    h4 {
      font-size: 43upx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #333333;
    }
  }

  .downCount {
    width: 100%;
    display: flex;
    justify-content: center;

    p {
      font-size: 28upx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #666666;
	  span{
		  color: #fd7600;
	  }
    }
  }
}
</style>

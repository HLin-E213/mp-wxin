<!--免单界面-->
<template>
  <view class="chargeFree">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="chargeFree_img">
      <image src="https://admin.dajxyl.com/oss?path=img/freeOrder@2x.png" mode=""></image>
      <h4>恭喜您获得了</h4>
      <span>免单奖励</span>
    </view>
    <view class="chargeFree_description">
      <p>本次订单的金额将全部退还给您</p>
      <span>请注意查收</span>
    </view>
    <view class="downCount">
      <p><span>{{ time }}s</span> 后自动跳转订单详情</p>
    </view>
  </view>
</template>

<script>
import WhiteHead from '../../components/whiteHead/whiteHead.vue';
import {mapState, mapMutations} from 'vuex';
import {showTime} from "../../service";

export default {
  components: {
    WhiteHead,
  },
  data() {
    return {
      title: '支付订单',
      time: 5,
    }
  },
  computed: {
    ...mapState('orders', {
      'orderData': 'orderData',
    })
  },
  mounted() {
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
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}

page {
  background-color: #FFFFFF;
}

.chargeFree {
  width: 100%;
  min-height: 100%;
  background: #FFFFFF;

  .head {
    width: 100%;
    height: 5rem;
    display: flex;
    position: fixed;
    top: 0;
    z-index: 10;
  }

  .chargeFree_img {
    width: 100%;
    padding-top: 110upx;
    @item();
    flex-wrap: wrap;

    image {
      width: 230upx;
      height: 197upx;
    }

    h4 {
      width: 100%;
      font-size: 30upx;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(237, 149, 10, 1);
      @item();
      padding-top: 22upx;
    }

    span {
      font-size:26upx;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(237, 149, 10, 1);
      @item();
    }
  }

  .chargeFree_description {
    width: 100%;
    @item();upx
    flex-wrap: wrap;
    margin-top: 35upx;
    flex-direction: column;

    p {
      width: 100%;
      font-size: 26upx;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 1.25rem;
      @item();
    }

    span {
      width: 100%;
      font-size: 26upx;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      @item();
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

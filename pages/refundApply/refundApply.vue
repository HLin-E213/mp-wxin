<!--申请退款界面-->
<template>
  <view class="refundApply" :class="{'global-page': isIPX }">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <!--顶部广告-->
    <view class="orderSupplement_top">
      <view class="orderSupplement_top_left" v-if="orderData.type !== '3'">
        <image :src="orderData.thum[0]" mode=""></image>
      </view>
      <view class="orderSupplement_top_left" v-else>
        <image :src="orderData.combo_info.combo_banner" mode=""></image>
      </view>
      <view class="orderSupplement_top_right">
        <h4>{{ orderData.info.title || orderData.model.title }}</h4>
        <span>{{ orderData.info.subtitle || orderData.model.title }}</span>
      </view>
    </view>
    <!--退还金额-->
    <view class="refundApply_price">
      <view class="refundApply_price_title">
        <p>退还金额</p>
      </view>
      <view class="refundApply_price_rmb">
        <h4>金额：</h4>
        <span>{{ orderData.pay_amount / 100 }}元</span>
      </view>
    </view>
    <!--退还方式-->
    <view class="refundApply_price">
      <view class="refundApply_price_title">
        <p>金额退还方式</p>
      </view>
      <view class="refundApply_price_rmb">
        <h4>原路退还：</h4>
        <span>（1-2个工作日退款到原支付方）</span>
      </view>
    </view>
    <!--退还原因-->
    <view class="refundApply_reason">
      <view class="refundApply_reason_title">
        <p>退款原因（至少选择1项）</p>
      </view>
      <view class="refundApply_reason_content">
        <view class="refundApply_reason_content_list" v-for="(i,k) in reasonList" :key="k">
          <view class="refundApply_reason_content_list_left">
            <h4>{{ i.reason }}</h4>
          </view>
          <view class="refundApply_reason_content_list_right" @click="selectReason(k)">
            <checkbox value="" :checked="i.check"/>
          </view>
        </view>
      </view>
    </view>
    <view class="biglove">
      <button @tap="commitRefund">提交</button>
    </view>
    <!--底部空白撑高度-->
    <view class="bg"></view>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {OrderRefund} from '../../api/index';

export default {
  components: {
    uniNavBar,
  },
  data() {
      const { isIPX } = getApp().globalData;
    return {
      title: '申请退款',
        isIPX: isIPX,
      reasonList: [
        {
          id: 0,
          reason: '无理由退款',
          check: false,
        },
        {
          id: 1,
          reason: '计划时间安排有新变化',
          check: false,
        },
        {
          id: 2,
          reason: '信息填写错误，取消重新买',
          check: false,
        },
        {
          id: 3,
          reason: '订单付款后，没进一步响应',
          check: false,
        },
        {
          id: 4,
          reason: '其他原因',
          check: false,
        },
      ],
      reasonArr: [],
    }
  },
  computed: {
    ...mapState('orders', {
      'orderData': 'orderData',
    })
  },
  mounted() {
    console.log('e.data.data.info', this.orderData);
  },
  methods: {
    /*点击选中退款原因*/
    selectReason: function (k) {
      // console.log(k)
      this.reasonArr = [];
      this.reasonList[k].check = !this.reasonList[k].check;
      this.reasonList.map((item, index) => {
        if (item.check) {
          this.reasonArr.push(item.id)
        }
      })
    },
    commitRefund: function () {
      let orderID, reason = '', state = 2, that = this;
      orderID = this.orderData.number;
      if (this.reasonArr.length < 1) {
        return uni.showToast({
          title: '至少选择一个原因！',
          icon: 'none',
          duration: 3000
        })
      }
      this.reasonArr.forEach(function (i, k) {
        reason += that.reasonList[k].reason + '。';
      });
      if (that.orderData.type === '3') {
        state = 4;
      }
      let res = OrderRefund(orderID, reason);
      res.then(function (e) {
        // console.log(e);
        return uni.redirectTo({
          url: '/components/statusPayment/statusPayment?state=' + state
        });
      });
    }
  }
}
</script>

<style lang="less" scoped>


@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}

.refundApply {
  width: 100%;
  min-height: 100%;

  .head {
    width: 100%;
    height: 5rem;
    display: flex;
	position: fixed;
	top: 0;
	z-index: 10;
  }

  .orderSupplement_top {
    margin: 24upx 20upx 0 24upx;
    height: 178upx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 15upx 1upx rgba(169, 169, 169, 0.2);
    border-radius: 10upx;
    @item();
    flex-wrap: wrap;

    .orderSupplement_top_left {
      height: 100%;
      @item();

      image {
		  margin-left: 26upx;
        width: 170upx;
        height: 124upx;
        border-radius: 6upx;
      }
    }

    .orderSupplement_top_right {
      flex:1;
      height: 100%;
      // height: 3.5rem;
      @item();
      flex-wrap: wrap;

      h4 {
        width: 90%;
        // height:0.97rem;
        font-size: 32uox;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(52, 52, 52, 1);
      }

      span {
        // width:7rem;
        width: 90%;
        // height:1.91rem;
        font-size: 26upx;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        // line-height:1.065rem;
        margin-top: 16upx;
      }
    }
  }

  .refundApply_price {
	  margin: 0 20upx;

    .refundApply_price_title {
      width: 100%;
	  padding:24upx 0 ;
      p {
        font-size: 26upx;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
    }

    .refundApply_price_rmb {
      width: 100%;
      height: 82upx;
      background: rgba(255, 255, 255, 1);
      border-radius: 10upx;
      @item();
      justify-content: flex-start;

      h4 {
        // width:2rem;
        height: 0.815rem;
        font-size: 0.875rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(52, 52, 52, 1);
        line-height: 1.065rem;
        margin-left: 0.94rem;
      }

      span {
        // width:2.535rem;
        height: 0.875rem;
        font-size: 0.75rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #fd7600;
        line-height: 1.065rem;
      }
    }
  }

  .refundApply_reason {
    margin: 0 20upx;
    @item();
    flex-wrap: wrap;

    .refundApply_reason_title {
      width: 100%;
      padding: 24upx 0;

      p {
        font-size: 26upx;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
    }

    .refundApply_reason_content {
      width: 100%;
      background: rgba(255, 255, 255, 1);
      border-radius: 10upx;
      // @item();
      .refundApply_reason_content_list {
        width: 100%;
        height: 82upx;
        @item();
        flex-wrap: wrap;
        border-bottom: 1px solid rgba(154, 154, 154, .2);

        .refundApply_reason_content_list_left {
          width: 70%;
          height: 100%;
          @item();
          justify-content: flex-start;

          h4 {
            // width:4.315rem;
            height: 0.815rem;
            font-size: 0.875rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(52, 52, 52, 1);
            line-height: 1.065rem;
          }
        }

        .refundApply_reason_content_list_right {
          width: 24%;
          height: 100%;
          @item();
          justify-content: flex-end;
        }
      }
    }
  }
  .biglove{
	  width: 100%;
	  height: 3rem;
	  @item();
	  margin-top: 2rem;
	  position: fixed;
	  bottom: 1rem;
	  z-index: 10;
	button {
	    width: 88%;
	    height: 2.825rem;
	    font-size: 0.94rem;
	    border-radius: 1.5rem;
	    background: #fd7600;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    color: #fff;
	  }
  }
  .bg {
    width: 100%;
    height: 5rem;
  }
}

</style>

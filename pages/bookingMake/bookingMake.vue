<!--预约订单-->
<template>
  <view class="bookingMake" :class="{'global-page': isIPX }">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <!--订单详情-->
    <view class="bookingService_detail">
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>产品名称</h4>
        </view>
        <view class="bookingService_detail_list_right">
          <p>{{ orderData.title }}</p>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>项目规格</h4>
        </view>
        <view class="bookingService_detail_list_right">
          <p>服务时长{{ orderData.hours }}小时</p>
        </view>
      </view>
      <view class="bookingService_detail_first_col" @click="handelTime">
        <view class="bookingService_detail_list_left" style="width: 30%;">
          <h4>补单续时</h4>
        </view>
        <view class="bookingService_detail_list_right" style="width: 70%;">
          <view class="booking_img">
            <image class="userPicture" :src="i.pic" mode=""
                   v-for="(i,k) in orderSpec.spec_staff" :key="k"></image>
          </view>
          <p>{{ orderSpec.spec_time.time_service }}分钟</p>
          <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left" style="width: 30%;">
          <h4>补单金额</h4>
        </view>
        <view class="bookingService_detail_list_right" style="width: 70%;">
          <p style="color: #fd7600;font-size: 1rem;">
            ¥{{ orderSpec.spec_time.price / 100 * orderSpec.spec_staff.length }}</p>
          <span
              style="color: #9A9A9A;font-size: 0.8rem;">（{{
              orderSpec.spec_time.price / 100
            }}元*{{ orderSpec.spec_staff.length }}人）</span>
        </view>
      </view>
    </view>
    <!--支付方式-->
    <view class="bookingService_payType">
      <view class="bookingService_payType_wx">
        <view class="bookingService_payType_wx_left">
          <image src="https://admin.dajxyl.com/oss?path=img/weixin@2x.png" mode=""></image>
          <h4>微信支付</h4>
        </view>
        <view class="bookingService_payType_wx_right">
          <image src="https://admin.dajxyl.com/oss?path=img/onSelect@2x_origin.png" mode=""></image>
        </view>
      </view>
    </view>
    <!--底部按钮确认下单-->
    <view class="orderSupplement_footer" :style="isIPX? 'padding-bottom: 38rpx': ''">
      <view class="orderSupplement_footer_left">
        <p>价格：</p>
        <span>¥{{ orderSpec.spec_time.price / 100 * orderSpec.spec_staff.length }}</span>
      </view>
      <view class="orderSupplement_footer_right" @click="PayOrderSpec">
        <button type="primary">立即下单</button>
      </view>
    </view>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {PayOrderSpec,OrderInfo} from '../../api/index';

export default {
  components: {
    uniNavBar,
  },
  computed: {
    // timeStyle:false,
    ...mapState('orders', {
      'orderData': 'orderData',
      'orderSpec': 'orderSpec',
    })
  },
  data() {
    return {
        isIPX:this.$isIPX,
      title: '预约订单',
      detailService: {
        name: '家政保洁',
        serviceSpecifications: '2',
        time: '30分钟',
        count: 2,
        imgList: [{}]
      },
    }
  },
  methods: {
    /*点击跳转到订单补单界面选择续时*/
    handelTime: function () {
      uni.navigateTo({
        url: '/pages/orderSupplement/orderSupplement'
      })
    },
    PayOrderSpec: function () {
      let that = this;
      let res = PayOrderSpec(
          that.orderData.id,
          that.orderSpec.spec_staff_id,
          that.orderSpec.spec_time_id,
          that.orderSpec.spec_time.price * that.orderSpec.spec_staff.length
      );
      res.then(function(value){
        // console.log(value);
        let wxres = value.data.data.info.pay_info;
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: wxres.timeStamp,
          nonceStr: wxres.nonceStr,
          package: wxres.package,
          signType: wxres.signType,
          paySign: wxres.paySign,
          success: function (res) {
            uni.showToast({
              title: '支付成功！',
              duration: 2000
            });
            let ret_order_info = OrderInfo(that.orderData.number)
            ret_order_info.then(function (e) {
              that.$store.commit('orders/setOrderData', e.data.data.info);
            });
            return uni.redirectTo({
              url: '/components/statusPayment/statusPayment?state=0&type=1'
            });
          },
          fail: function (err) {
            console.log(err);
            return uni.showToast({
              title: '您取消了付款！',
              duration: 2000,
              icon: 'none',
              mask: true,
            });
          }
        });
      });
    }
  }
}
</script>

<style lang="less" scoped>
@item: {
  display: flex;
  align-items: center;
  justify-content: center;
}

@contentItem: {
  width: 100%;
  height: 14.69rem;
  background: rgba(255, 255, 255, 1);
  margin-top: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bookingMake {
  width: 100%;
  min-height: 100%;
  padding-bottom: 98upx;

  .bookingService_detail {
    @contentItem();
    flex-wrap: wrap;

    .bookingService_detail_first_col {
      width: 94%;
      height: 3.625rem;
      @item();
      border-bottom: 1px solid #EFEFF4;

      .bookingService_detail_list_left {
        width: 50%;
        height: 100%;
        @item();
        justify-content: flex-start;

        h4 {
          // width:3.69rem;
          // height:0.91rem;
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(52, 52, 52, 1);
        }
      }

      .bookingService_detail_list_right {
        width: 50%;
        height: 100%;
        @item();
        justify-content: flex-end;

        p {
          // width:3.91rem;
          // height:0.97rem;
          font-size: 1rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(52, 52, 52, 1);
        }

        image {
          width: 0.44rem;
          height: 0.75rem;
          margin: 0.1rem 0 0 0.5rem;
        }

        .firstImg {
          width: 1.97rem;
          height: 1.875rem;
          margin-right: 0.5rem;
        }

        .secondImg {
          width: 1.97rem;
          height: 1.875rem;
        }

        .booking_img {
          height: 100%;
          @item();
          justify-content: space-around;
          margin-right: 1.065rem;

          image {
            width: 1.815rem;
            height: 1.815rem;
            background: #fd7600;
            border-radius: 50%;
          }
        }

        // .userPicture{
        // 	width:1.815rem;
        // 	height:1.815rem;
        // 	background:rgba(64,140,255,1);
        // 	border-radius:50%;
        // }
      }
    }
  }

  .bookingService_payType {
    @contentItem();
    // height:7.345rem;
    height: 3.625rem;

    .bookingService_payType_wx {
      width: 94%;
      height: 3.625rem;
      display: flex;

      .bookingService_payType_wx_left {
        width: 50%;
        height: 100%;
        @item();
        justify-content: flex-start;

        image {
          width: 1.815rem;
          height: 1.815rem;
        }

        h4 {
          // width:4.625rem;
          // height:0.91rem;
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(52, 52, 52, 1);
          margin-left: 0.345rem;
        }
      }

      .bookingService_payType_wx_right {
        width: 50%;
        height: 100%;
        @item();
        justify-content: flex-end;

        image {
          width: 0.94rem;
          height: 0.94rem;
        }
      }
    }
  }

  .orderSupplement_footer {
    width: 100%;
    height: 98upx;
    background: rgba(255, 255, 255, 1);
    @item();
    position: fixed;
    bottom: 0;
	left: 0;

    .orderSupplement_footer_left {
      width: 47%;
      height: 100%;
      @item();
      justify-content: flex-start;

      p {
        // height:0.875rem;
        font-size: 0.815rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(52, 52, 52, 1);
      }

      span {
        // height:1.75rem;
        font-size: 1rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #fd7600;
      }
    }

    .orderSupplement_footer_right {
      width: 47%;
      height: 100%;
      @item();
      justify-content: flex-end;

      button {
        width: 88%;
        height: 2.315rem;
        background: #fd7600;
        border-radius: 1.15rem;
        line-height: 2.315rem;
      }
    }
  }
}
</style>

<!--服务预约界面-->
<template>
  <view class="bookingService" :style="isIPX? 'padding-bottom: 38rpx': ''">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <!--服务详情-->
    <view class="bookingService_detail">
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>产品名称</h4>
        </view>
        <view class="bookingService_detail_list_right">
          <p>{{ info.title }}</p>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>套餐内容</h4>
        </view>
        <view class="bookingService_detail_list_right">
          <p>{{ comboDesc }}</p>
        </view>
      </view>
    </view>
    <!--服务价格相关-->
    <view class="bookingService_price">
      <view class="bookingService_price_col">
        <view class="bookingService_price_left">
          <h4>订单金额</h4>
        </view>
<!--        <view class="bookingService_price_right">-->
<!--          <p>¥{{ info.combo_price / 100 }}</p>-->
<!--        </view>-->
        <view class="bookingService_price_right">
          <p>¥{{ payMoney }}</p>
        </view>
      </view>
<!--      <view class="bookingService_price_col" @click="selectCoupon">-->
<!--        <view class="bookingService_price_left">-->
<!--          <h4>优惠卡券</h4>-->
<!--        </view>-->
<!--        <view class="bookingService_price_right" v-if="couponUseData.code == undefined">-->
<!--          <p>{{ couponCount }}张</p>-->
<!--          <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>-->
<!--        </view>-->
<!--        <view class="bookingService_price_right" v-else>-->
<!--          <p>已选择优惠券</p>-->
<!--          <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>-->
<!--        </view>-->
<!--      </view>-->
      <view class="bookingService_price_col" @click="editOrderRemarks">
        <view class="bookingService_price_left">
          <h4>备注信息</h4>
        </view>
        <view class="bookingService_price_right">
          <p style="color: #9A9A9A;" class="OmitDisplay">{{ order.remarks }}</p>
          <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
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
    <!--底部菜单-->
    <view class="bookingService_bottomBtn" :style="isIPX? 'padding-bottom: 38rpx': ''">
      <view class="bookingService_bottomBtn_btn">
        <view class="bookingService_bottomBtn_btn_left">
          <h4>价格：</h4>
          <span>¥{{ payMoney }}</span>
        </view>
        <view class="bookingService_bottomBtn_btn_right" @click="cashier">
          <button type="primary">立即下单</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {couponList, comboCashier, wxpay, chekOrderFree, OrderInfo} from '../../api/index.js';
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {showTime, GetNowTimeIOS} from "../../service";

export default {
  components: {
    uniNavBar,
  },
  data() {
    const {isIPX} = getApp().globalData;
    return {
      isIPX,
      title: '套餐订单',
      couponCount: 0,
    }
  },
  onLoad() {
    this.order.appointmentTime = '';
    this.order.staffNum = 1;
    this.order.remarks = '';
    this.$store.commit('users/setCouponUseData', {});
    this.$store.commit('server/setProviderService', null);
  },
  computed: {
    ...mapState('serviceinfo', {
      'info': 'serviceInfo',
      'order': 'orderInfo'
    }),
    ...mapState('users', {
      'couponUseData': 'couponUseData',
      'setCouponUseData': 'setCouponUseData',
      'addressDataSingle': 'addressDataSingle',
    }),
    ...mapState('server', {
      'providerServiceList': 'providerServiceList',
    }),
    payMoney: function () {
      return this.info.combo_price / 100;
    },
    comboDesc: function () {
      let info = this.info.service_info;
      return info.title + info.service_spec + info.spec_unit + "(" + this.info.staff_num + "人)X" + this.info.combo_num;
    }
  },
  mounted: function () {
    let that = this;
    // 获取我的优惠券列表个数
    let resCouponList = couponList();
    resCouponList.then(function (e) {
      that.couponCount = e.data.data.info.not_used.length;
      that.setCouponList(e.data.data.info);
    });
  },
  methods: {
    ...mapMutations('serviceinfo', {
      'setOrderDataStaffNum': 'setOrderDataStaffNum',
      'setOrderInfo': 'setOrderInfo',
    }),
    ...mapMutations('users', {
      'setCouponList': 'setCouponList',
      'setEditorData': 'setEditorData',
      'setProviderService': 'setProviderService',
    }),
    ...mapMutations('server', {
      'setProviderService': 'setProviderService',
    }),
    ...mapMutations('orders', {
      'setOrderData': 'setOrderData',
    }),
    /*点击跳转【服务预约时间】选择页面*/
    selectAppointmentTime: function () {
      uni.navigateTo({
        url: '/pages/appointmentTime/appointmentTime?modifyTime=true'
      });
    },
    /**
     * 点击跳转订单备注
     */
    editOrderRemarks: function () {
      uni.navigateTo({
        url: '/pages/notesOrder/notesOrder'
      });
    },
    cashier: async function () {

      uni.showLoading({
        title: '下单中',
        mask: true,
      });

      let res, orderID,that=this;
      res = await comboCashier(
          this.info.id,
      );

      // 需要重新登录token失效
      if (res.data.code === 100003) {
        return uni.reLaunch({
          url: '/pages/login/index'
        });
      }

      if (res.data.code !== 1) {
        return uni.showToast({
          title: res.data.message,
          duration: 2000,
          icon: 'none',
          mask: true,
        });
      }

      orderID = res.data.data.info.order_number;

      if (res.data.data.pay_amount == 0) {
        let ret_order_info = OrderInfo(orderID);
        ret_order_info.then(function (e) {
          that.$store.commit('orders/setOrderData', e.data.data.info);
        });
        uni.hideLoading();
        uni.showToast({
          title: '支付成功！',
          duration: 2000
        });
        return uni.navigateTo({
          url: '/components/statusPayment/statusPayment?state=0'
        });
      }

      let wx_res = await wxpay(orderID)

      console.log(wx_res);
      let wxres = wx_res.data.data.info.info;
      console.log(wxres);

      uni.requestPayment({
        provider: 'wxpay',
        timeStamp: wxres.timeStamp,
        nonceStr: wxres.nonceStr,
        package: wxres.package,
        signType: wxres.signType,
        paySign: wxres.paySign,
        success: function (res) {
          uni.hideLoading();
          uni.showToast({
            title: '支付成功！',
            duration: 2000
          });
          // 查询是否免单跳转响应页面
          let isOrderFree = chekOrderFree(orderID);

          isOrderFree.then(function (value) {

            let ret_order_info = OrderInfo(orderID);
            ret_order_info.then(function (e) {
              that.$store.commit('orders/setOrderData', e.data.data.info);
            });

            let is_free = value.data.data.info.is_free;
            if (is_free) {
              return uni.navigateTo({
                url: '/pages/chargeFree/chargeFree'
              });
            } else {
              return uni.navigateTo({
                url: '/components/statusPayment/statusPayment?state=0'
              });
            }
          });
        },
        fail: function (err) {
          uni.hideLoading();
          console.log(err);
          return uni.showToast({
            title: '您取消了付款！',
            duration: 2000,
            icon: 'none',
            mask: true,
          });
        }
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

@contentItem: {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  margin-top: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.OmitDisplay {
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bookingService {
  width: 100%;
  min-height: 100%;


  .bookingService_detail {
    @contentItem();
    flex-wrap: wrap;

    .bookingService_detail_first_col {
      width: 94%;
      height: 3.625rem;
      @item();
      border-bottom: 1px solid rgba(239, 239, 244, 0.3);

      .bookingService_detail_list_left {
        width: 30%;
        height: 100%;
        @item();
        justify-content: flex-start;

        h4 {
          // width:3.69rem;
          height: 0.91rem;
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(52, 52, 52, 1);
        }
      }

      .bookingService_detail_list_right {
        width: 70%;
        height: 100%;
        @item();
        justify-content: flex-end;

        .system-dispatch {
          font-size: 32 upx;
          color: #333333;
        }

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

        .userPicture {
          width: 1.815rem;
          height: 1.815rem;
          background: #fd7600;
          border-radius: 50%;
        }
      }
    }
  }

  .bookingService_address {
    @contentItem();
    height: 5.815rem;
    flex-wrap: wrap;

    .bookingService_address_top {
      width: 94%;
      height: 2.9075rem;
      @item();

      .left {
        width: 80%;
        height: 100%;
        @item();
        justify-content: flex-start;

        h4 {
          // width:2.75rem;
          height: 0.91rem;
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(52, 52, 52, 1);
        }

        span {
          // width:5.44rem;
          height: 0.69rem;
          font-size: 0.875rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          margin-left: 0.785rem;
        }
      }

      .right {
        width: 20%;
        height: 100%;
        @item();
        justify-content: flex-end;

        p {
          // width:3.44rem;
          height: 0.845rem;
          font-size: 0.875rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(52, 52, 52, 1);
        }

        image {
          width: 0.44rem;
          height: 0.75rem;
        }
      }
    }
  }

  .bookingService_price {
    @contentItem();
    height: 11.035rem;
    flex-wrap: wrap;

    .bookingService_price_col {
      width: 94%;
      height: 3.625rem;
      border-bottom: 1px solid rgba(239, 239, 244, 0.3);
      display: flex;

      .bookingService_price_left {
        width: 30%;
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

      .bookingService_price_right {
        width: 70%;
        height: 100%;
        @item();
        justify-content: flex-end;

        p {
          // width:2.375rem;
          // height:0.785rem;
          font-size: 1rem;
          font-family: PingFang SC;
          // font-weight:500;
          color: #fd7600;
        }

        image {
          width: 0.44rem;
          height: 0.75rem;
          margin: 0.1rem 0 0 0.5rem;
        }
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

  .bookingService_bottomBtn {
    @contentItem();
    height: 3.065rem;
    margin-top: 1.88rem;
    position: fixed;
    bottom: 0;
    z-index: 10;

    .bookingService_bottomBtn_btn {
      width: 94%;
      height: 100%;
      display: flex;

      .bookingService_bottomBtn_btn_left {
        width: 50%;
        height: 100%;
        @item();
        justify-content: flex-start;

        h4 {
          font-size: 0.815rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(52, 52, 52, 1);
        }

        span {
          color: #fd7600;
        }
      }

      .bookingService_bottomBtn_btn_right {
        width: 50%;
        height: 100%;
        @item();
        justify-content: flex-end;

        button {
          width: 88%;
          height: 80%;
          border-radius: 1.5rem;
          background: #fd7600;
          @item();
        }
      }
    }
  }
}
</style>


<!--服务预约界面-->
<template>
  <view class="bookingService" :style="isIPX? 'padding-bottom: 38rpx': ''">
	  <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <!--服务详情-->
    <view class="bookingService_detail">
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>项目名称</h4>
        </view>
        <view class="bookingService_detail_list_right">
          <p>{{ info.title }}</p>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>项目规格</h4>
        </view>
        <view class="bookingService_detail_list_right">
          <image class="firstImg" @click="r_count" src="https://admin.dajxyl.com/oss?path=img/reduce@2x.png"
                 mode=""></image>
          <p>{{ spec + info.spec_unit }}</p>
          <image class="secondImg" @click="a_count" src="https://admin.dajxyl.com/oss?path=img/add@2x_origin.png"
                 mode=""></image>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>预约时间</h4>
        </view>
        <view class="bookingService_detail_list_right" @click="selectAppointmentTime">
          <p>{{ appointmentTime == '' ? '请选择服务时间' : appointmentTime }}</p>
          <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>预约人员数量</h4>
        </view>
        <view class="bookingService_detail_list_right">
          <image class="firstImg" @click="reduceCount" src="https://admin.dajxyl.com/oss?path=img/reduce@2x.png"
                 mode=""></image>
          <p>{{ order.staffNum }}</p>
          <image class="secondImg" @click="addCount" src="https://admin.dajxyl.com/oss?path=img/add@2x_origin.png"
                 mode=""></image>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left" style="width: 30%;">
          <h4>选择服务人员</h4>
        </view>
        <view class="bookingService_detail_list_right" style="width: 70%;" @click="selectStaff">
          <view class="system-dispatch" v-if="providerServiceList == null || providerServiceList.length == 0">系统自动分配</view>
          <image v-if="providerServiceList != null" class="userPicture" :src="i.pic" mode=""
                 v-for="(i,k) in providerServiceList" :key="k"></image>
          <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
        </view>
      </view>
    </view>
    <!--地址相关-->
    <view class="bookingService_address" @click="selectAddress">
      <view class="bookingService_address_top">
        <view class="left">
          <h4>{{ address.name }}</h4>
          <span>{{ address.tel }}</span>
        </view>
        <view class="right">
          <p>其他地址</p>
        </view>
      </view>
      <view class="bookingService_address_top">
        <view class="left">
          <h4>{{ addressDesc }}</h4>
        </view>
        <view class="right">
          <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
        </view>
      </view>
    </view>
    <!--服务价格相关-->
    <view class="bookingService_price">
      <view class="bookingService_price_col">
        <view class="bookingService_price_left">
          <h4>订单金额</h4>
        </view>
<!--        <view class="bookingService_price_right" v-if="!is_cu">-->
<!--          <p>¥{{ info.present_price / 100 }}</p>-->
<!--        </view>-->
<!--        <view class="bookingService_price_right" v-else>-->
<!--          <p>¥{{ info.service_promotion_info.price / 100 }}</p>-->
<!--        </view>-->
        <view class="bookingService_price_right">
          <p>{{ payMoney }}</p>
        </view>
      </view>
      <template v-if="info.service_promotion_info.length == 0 ? true : false">
        <view class="bookingService_price_col" @click="selectCoupon">
          <view class="bookingService_price_left">
            <h4>优惠卡券</h4>
          </view>
          <view class="bookingService_price_right" v-if="couponUseData.code == undefined">
            <p>{{ couponCount }}张</p>
            <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
          </view>
          <view class="bookingService_price_right" v-else>
            <p>已选择优惠券</p>
            <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="bookingService_price_col" >
          <view class="bookingService_price_left">
            <h4>优惠卡券</h4>
          </view>
          <view class="bookingService_price_right">
            <p style="color: #999;">不能使用优惠券</p>
            <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
          </view>
        </view>
      </template>
      <view class="bookingService_price_col" @click="editOrderRemarks">
        <view class="bookingService_price_left">
          <h4>备注信息</h4>
        </view>
        <view class="bookingService_price_right">
          <p style="color: #9A9A9A;" class="OmitDisplay">{{ remarks }}</p>
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
import {
  getDefaultAddress,
  couponList,
  serviceCashier,
  wxpay,
  chekOrderFree,
  OrderInfo,
  serviceServiceSpec, getServiceInfo
} from '../../api/index.js';
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {showTime,GetNowTimeIOS } from "../../service";

export default {
  components: {
    uniNavBar,
  },
  data() {
    const {isIPX} = getApp().globalData;
    return {
      isIPX,
      title: '服务预约',
      address: {
        name: '',
        desc: '',
        tel: '',
        province: '',
        city: '',
      },
      couponCount: 0,
      is_cu: false,
      spec_low: 0,
      spec: 0,
      amount: 0,
    }
  },
  onLoad() {
    this.order.appointmentTime = '';
    this.order.staffNum = 1;
    this.order.remarks = '';
    // 赋值价格
    if (this.info.service_promotion_info.price) {
      this.amount = this.info.service_promotion_info.price / 100;
    } else {
      this.amount = this.info.present_price / 100;
    }
    console.log(this.info);
    this.$store.commit('users/setCouponUseData',{});
    this.$store.commit('server/setProviderService',null);
  },
  computed: {
    ...mapState('serviceinfo', {
      'info': 'serviceInfo',
      'order': 'orderInfo'
    }),
    ...mapState('users', {
      'couponUseData': 'couponUseData',
      'setCouponUseData':'setCouponUseData',
      'addressDataSingle':'addressDataSingle',
    }),
    ...mapState('server', {
      'providerServiceList': 'providerServiceList',
    }),
    addressDesc: function () {
      let address;
      if (this.addressDataSingle) {
        address = this.addressDataSingle;
        this.address = this.addressDataSingle;
      } else {
        address = this.address;
      }
      if (address) {
        address = address.province + address.city + address.desc;
      }

      if (!address) {
        return '暂无地址请添加';
      }

      return address.length > 14 ? address.slice(0, 14) + '...' : address;
    },
    payMoney: function () {
      let money, curTime = Date.parse(new Date()) / 1000;
      if (this.info.service_promotion_info.length === 0) {
        money = (this.info.present_price / 100) * this.order.staffNum;
        this.is_cu = false;
      } else {
        if (this.info.service_promotion_info.start_time < curTime) {
          money = (this.info.service_promotion_info.price / 100) * this.order.staffNum;
          this.is_cu = true;
        } else {
          money = (this.info.present_price / 100) * this.order.staffNum;
          this.is_cu = false;
        }
      }
      // 优惠券计算
      if (this.couponUseData && this.couponUseData.code) {
        console.log(this.couponUseData);
        switch (this.couponUseData.type) {
          case '1':
            // 无门槛
            money = money - this.couponUseData.nature[0];
            break;
          case '2':
            if (money >= this.couponUseData.nature[0]) {
              money = money - this.couponUseData.nature[1];
            }
            // 满减
            break;
          case '3':
            // 折扣
            money = money * this.couponUseData.nature[0];
            break;
        }
      }

      if (money < 0 ) {
        money = 0;
      }
      const addMount = this.order.addMount ? this.order.addMount / 100 : 0;
      return (money + addMount).toFixed(2);
    },
    appointmentTime: function () {
      let timestamp = this.order.appointmentTime;
      if (timestamp === '') {
        return timestamp;
      }
      return showTime(timestamp);
    },
    remarks: function(){
      return this.order.remarks.length > 14 ? this.order.remarks.slice(0, 14) + '...' : this.order.remarks;
    }
  },
  mounted: function () {
    let that = this;
    // 获取地址数据
    let resDefaultAddress = getDefaultAddress();
    resDefaultAddress.then(function(e){
      that.address = e.data.data.info;
    });
    // 获取我的优惠券列表个数
    let resCouponList = couponList();
    resCouponList.then(function(e){
      that.couponCount = e.data.data.info.not_used.length;
      that.setCouponList(e.data.data.info);
    });
    // 初始化信息
    let res = getServiceInfo(this.info.id);
    res.then(function(e){
      that.setData(e.data.data.info);
    });
    // 存储最低规格
    this.setOrderDataSpec(this.info.spec_low);
    this.spec_low = this.info.spec_low;
    this.spec = this.info.spec_low;
  },
  onUnload() {
    this.setAppointmentTime({
      timestamp: '',
      addMount: '',
    });
  },
  methods: {
    ...mapMutations('serviceinfo', {
      'setOrderDataStaffNum': 'setOrderDataStaffNum',
      'setOrderInfo': 'setOrderInfo',
      'setOrderDataSpec': 'setOrderDataSpec',
      'setData': 'setData',
      'setAppointmentTime': 'setAppointmentTime',
    }),
    ...mapMutations('users', {
      'setCouponList': 'setCouponList',
      'setEditorData': 'setEditorData',
      'setProviderService': 'setProviderService',
    }),
    ...mapMutations('server', {
      'setProviderService': 'setProviderService',
    }),
    /*减少规格*/
    r_count: function(){
      let that = this;
      uni.showLoading({
        title: '加载中',
        mask: true,
      });
      console.log(this.spec_low,this.spec);
      if (this.spec_low >= this.spec){
        uni.hideLoading();
        uni.showToast({
          title: '已经是最低规格了',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      let res = serviceServiceSpec(this.info.id,this.spec,'-1');
      res.then(function(value){
        that.spec = value.data.data.info.spec.spec;
        that.info.service_promotion_info.price = value.data.data.info.spec.amount * 100;
        that.info.present_price = value.data.data.info.spec.amount * 100;
        that.setOrderDataSpec(value.data.data.info.spec.spec);
        that.amount = value.data.data.info.spec.amount;
        uni.hideLoading();
      });
    },
    /*增加规格*/
    a_count: function(){
      let that = this;
      uni.showLoading({
        title: '加载中',
        mask: true,
      });
      let res = serviceServiceSpec(this.info.id,this.spec,'+1');
      res.then(function(value){
        that.spec = value.data.data.info.spec.spec;
        that.info.service_promotion_info.price = value.data.data.info.spec.amount * 100;
        that.info.present_price = value.data.data.info.spec.amount * 100;
        that.setOrderDataSpec(value.data.data.info.spec.spec);
        that.amount = value.data.data.info.spec.amount;
        uni.hideLoading();
      });
    },
    /*点击增加按钮，增加预约人员的数量,最大5人*/
    addCount: function () {
      let that = this;
      if (this.order.staffNum >= 5) {
        uni.showToast({
          title: '最多五人',
          icon: 'none',
          duration: 3000
        })
        return
      }
      that.order.staffNum++
      that.setOrderDataStaffNum(that.order.staffNum);
    },
    /*点击减少按钮，减少预约数量，最小值为1*/
    reduceCount: function () {
      let that = this;
      if (this.order.staffNum < 2) {
        uni.showToast({
          title: '最少一人',
          icon: 'none',
          duration: 3000
        })
        return
      }
      that.order.staffNum--
      that.setOrderDataStaffNum(that.order.staffNum);
    },
    /*点击跳转【服务预约时间】选择页面*/
    selectAppointmentTime: function () {
      uni.navigateTo({
        url: '/pages/appointmentTime/appointmentTime?modifyTime=true'
      });
    },
    /*点击选择优惠券*/
    selectCoupon: function () {
      uni.navigateTo({
        url: '/pages/listCoupon/listCoupon?serviceID=' + this.info.id
      });
    },
    /*点击选择服务人员*/
    selectStaff: function () {
      // 验证预约时间是否选择
      let that = this;
      if (that.order.appointmentTime == '') {
        uni.showToast({
          title: '请选择预约时间',
          icon: 'none',
          duration: 3000
        })
        return false;
      }
      if (that.address == '') {
        uni.showToast({
          title: '请设置服务地址',
          icon: 'none',
          duration: 3000
        })
        return false;
      }
      let obj = this.order;
      Object.assign(obj, {hours: this.info.spec});
      Object.assign(obj, {address_id: this.address.id});
      this.setOrderInfo(obj);
      uni.navigateTo({
        url: '/pages/serviceSelect/serviceSelect',
      });
    },
    /*点击跳转到地址管理界面事件*/
    selectAddress: function () {
      uni.navigateTo({
        url: '/pages/managementAddress/managementAddress?type=cashier'
      })
    },
    /**
     * 点击跳转到地址编辑页面
     * @param {object}
     * 调用方法 setEditorData 改变vuex中的地址
     * **/
    editorAddress: function () {
      this.setEditorData(this.address);
      uni.navigateTo({
        url: '/pages/addAddress/addAddress'
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
console.log(this.order);
      let params = {
        serviceID: this.info.id,
        addressID: this.address.id,
        appointment: this.order.appointmentTime,
        hours: this.info.spec,
        staff_num: this.order.staffNum,
        remarks: this.order.remarks,
        is_wx_mini: "1",
      }, that = this;

      if (this.couponUseData && this.couponUseData.code) {
        params.coupon = this.couponUseData.code;
      }

      if (this.providerServiceList) {
        console.log(this.providerServiceList);
        if (params.staff_num < this.providerServiceList.length) {
          return uni.showToast({
            title: '服务人数超过了预约人数，请重新选择！',
            duration: 2000,
            icon: 'none',
            mask: true,
          });
        }
        let staff_ids = '';
        this.providerServiceList.forEach(function (i, k) {
          staff_ids += i.staff_id + ',';
        });
        params.staff_ids = staff_ids.slice(0, -1);
      } else {
        params.staff_ids = '';
      }

      if (!params.addressID) {
        return uni.showToast({
          title: '请设置服务地址',
          icon: 'none',
          duration: 3000
        });
      }
      if (params.appointment === '') {
        return uni.showToast({
          title: '请选择预约时间',
          icon: 'none',
          duration: 3000
        });
      }

      uni.showLoading({
        title: '下单中',
        mask: true,
      });

      // 赋值价格
      if (this.info.service_promotion_info.price) {
        this.amount = this.info.service_promotion_info.price / 100;
      } else {
        this.amount = this.info.present_price / 100;
      }

      let res, orderID;
      if (this.couponUseData && this.couponUseData.code) {
        res = await serviceCashier(
            this.info.id,
            this.address.id,
            this.order.appointmentTime,
            this.info.spec,
            this.order.staffNum,
            params.staff_ids,
            this.spec,
            this.amount,
            this.order.remarks,
            this.couponUseData.code,
            1,
            ''
        );
      } else {
        res = await serviceCashier(
            this.info.id,
            this.address.id,
            this.order.appointmentTime,
            this.info.spec,
            this.order.staffNum,
            params.staff_ids,
            this.spec,
            this.amount,
            this.order.remarks,
            null,
            1,
            '',
        );
      }

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

      orderID = res.data.data.order_id;

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
  height: 18.41rem;
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
		.system-dispatch{
			font-size: 32upx;
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
          //background: #fd7600;
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

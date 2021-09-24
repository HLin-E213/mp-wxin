<!--服务预约界面-->
<template>
  <view class="bookingService" :style="isIPX? 'padding-bottom: 38rpx': ''">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <!--服务内容-->
    <view class="ItemsService">
      <view class="ItemsService_top">
        <contentHeader :name="server_name"></contentHeader>
      </view>
      <view class="ItemsService_bottom">
        <p>{{ combo_title }}</p>
      </view>
    </view>
    <!-- 预约信息 -->
    <view class="bookingService_detail">
      <view class="ItemsService_top">
        <contentHeader :name="server_name"></contentHeader>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>项目名称</h4>
        </view>
        <view class="bookingService_detail_list_right">
          <p>{{ service_title }}</p>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>项目规格</h4>
        </view>
        <view class="bookingService_detail_list_right">
          <p>{{ spec }}</p>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>预约时间</h4>
        </view>
        <view class="bookingService_detail_list_right" @click="selectAppointmentTime">
          <p style="color: #9A9A9A">{{ appointmentTime == '' ? '请选择服务时间' : appointmentTime }}</p>
          <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>预约人员数量</h4>
        </view>
        <view class="bookingService_detail_list_right">
          <p>{{ staff_num }}</p>
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
      <!--地址相关-->
      <view class="bookingService_address" @click="selectAddress"
            v-if="addressDesc">
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
      <view v-else class="bookingService_detail_first_col" @click="selectAddress">
        <view class="bookingService_detail_list_left" style="width: 30%;">
          <h4>请添加地址</h4>
        </view>
        <view class="bookingService_detail_list_right" style="width: 70%;">
          <view class="system-dispatch"></view>
          <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
        </view>
      </view>
      <view class="bookingService_detail_first_col" style="border-bottom: none;">
        <view class="bookingService_detail_list_left" style="width: 30%;">
          <h4>备注信息</h4>
        </view>
        <view class="bookingService_detail_list_right" style="width: 70%;" @click="editOrderRemarks">
          <template v-if="order.remarks">
            <view class="system-dispatch" style="color: #9A9A9A">{{ remarks }}</view>
          </template>
          <template v-else>
            <view class="system-dispatch" style="color: #9A9A9A">有什么特殊交代留给我</view>
          </template>
          <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
        </view>
      </view>
    </view>
    <!--底部菜单-->
    <view class="bookingService_bottomBtn" :style="isIPX? 'padding-bottom: 38rpx': ''">
      <view class="bookingService_bottomBtn_btn" @click="cashier">
        <view class="bookingService_bottomBtn_btn_right">
          <button type="primary">提交</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import contentHeader from "../detailsOrder/detaileOrder";
import {showTime} from "../../service";
import {getDefaultAddress, serviceCashier} from "../../api";

export default {
  components: {
    uniNavBar,
    contentHeader,
  },
  data() {
    const {isIPX} = getApp().globalData;
    return {
      isIPX,
      title: '服务预约',
      server_name: '服务项目',
      make_name: '预约信息',
      address: {
        name: '',
        desc: '',
        tel: '',
        province: '',
        city: '',
      },
    }
  },
  onLoad() {
    this.order.appointmentTime = '';
    this.order.remarks = '';
    this.$store.commit('server/setProviderService',null);
  },
  computed: {
    ...mapState('serviceinfo', {
      'info': 'serviceInfo',
      'order': 'orderInfo'
    }),
    ...mapState('users', {
      'addressDataSingle':'addressDataSingle',
    }),
    ...mapState('server', {
      'providerServiceList': 'providerServiceList',
    }),
    combo_title: function(){
      return this.info.combo_info.combo_title;
    },
    service_title: function(){
      return this.info.combo_info.service_title;
    },
    spec: function(){
      return this.info.combo_info.service_spec + this.info.combo_info.spec_unit
    },
    staff_num: function(){
      return this.info.combo_info.staff_num;
    },
    appointmentTime: function () {
      let timestamp = this.order.appointmentTime;
      if (timestamp === '') {
        return timestamp;
      }
      return showTime(timestamp);
    },
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
      return address.length > 14 ? address.slice(0, 14) + '...' : address;
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
  },
  methods: {
    ...mapMutations('serviceinfo', {
      'setOrderDataStaffNum': 'setOrderDataStaffNum',
      'setOrderInfo': 'setOrderInfo',
    }),
    /*点击跳转【服务预约时间】选择页面*/
    selectAppointmentTime: function () {
      uni.navigateTo({
        url: '/pages/appointmentTime/appointmentTime?modifyTime=true'
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
      let obj = this.order;
      Object.assign(obj, {hours: this.info.combo_info.service_spec});
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
     * 点击跳转订单备注
     */
    editOrderRemarks: function () {
      uni.navigateTo({
        url: '/pages/notesOrder/notesOrder'
      });
    },
    /**
     * 提交套餐预约
     */
    cashier: async function(){
      let params = {
        serviceID: this.info.model_id,
        addressID: this.address.id,
        appointment: this.order.appointmentTime,
        hours: this.order.hours,
        staff_num: this.info.combo_info.staff_num,
        remarks: this.order.remarks,
        is_wx_mini: "1",
        pid: this.info.id
      }, that = this;

      if (this.providerServiceList) {
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
        params.staff_ids = null;
      }

      if (!params.addressID) {
        return uni.showToast({
          title: '未获取到地址！',
          icon: 'none',
          duration: 3000
        });
      }
      if (params.appointment === '') {
        return uni.showToast({
          title: '未获取到预约时间！',
          icon: 'none',
          duration: 3000
        });
      }

      uni.showLoading({
        title: '预约中',
        mask: true,
      });

      let res, orderID;
      res = await serviceCashier(
          params.serviceID,
          params.addressID,
          params.appointment,
          params.hours,
          params.staffNum,
          params.staff_ids,
          null,
          null,
          params.remarks,
          null,
          1,
          params.pid,
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

      orderID = res.data.data.order_id;

      uni.hideLoading();
      uni.showToast({
        title: '预约成功！',
        duration: 2000
      });

      return uni.navigateTo({
        url: '/pages/detailsOrder/comboOrder?orderID=' + orderID,
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
  margin-top: 17upx;
  width: 710rpx;
  background: rgba(255, 255, 255, 1);
  //box-shadow: 1px 1px 1px 1px rgba(169, 169, 169, 0.2);
  border-radius: 10upx;
  padding: 27upx;
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

  .ItemsService {
    @contentItem();
    @item();
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 24upx;

    .ItemsService_top {
      width: 100%;
      padding-bottom: 27rpx;
      border-bottom: 1px solid rgba(153,153,153, .2);
    }

    .ItemsService_bottom {
      @item();
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 32upx 0 30upx 0;

      p {
        height: 0.875rem;
        font-size: 0.875rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }
  }

  .bookingService_detail {
    @contentItem();
    flex-wrap: wrap;
    margin-top: 25rpx;
    margin-bottom: 236rpx;

    .ItemsService_top {
      width: 100%;
      padding-bottom: 27rpx;
      border-bottom: 1px solid rgba(153,153,153, .2);
    }

    .bookingService_detail_first_col {
      height: 3.625rem;
      @item();
      border-bottom: 1px solid rgba(153,153,153, .2);

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
    border-bottom: 1px solid rgba(153,153,153, .2);
    padding: 0;
    margin-top: 0;

    .bookingService_address_top {
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

  .bookingService_bottomBtn {
    @contentItem();
    height: 3.065rem;
    margin-top: 1.88rem;
    position: fixed;
    bottom: 0;
    z-index: 10;

    .bookingService_bottomBtn_btn {
      //width: 94%;
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
        width: 100%;
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

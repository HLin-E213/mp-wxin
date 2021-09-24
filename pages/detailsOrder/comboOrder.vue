<!--服务预约界面-->
<template>
  <view class="bookingService" :style="isIPX? 'padding-bottom: 38rpx': ''">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>

    <Modal
        ref="modal"
        title="号码隐私保护"
        confirmText="确认拨打"
        cancelText="关闭"
        @confirm="callTelByAxb"
        @cancel="close"
    >
      <view class="telAxb-body">
        <img class="img" src="https://admin.dajxyl.com/oss?path=img/tip@2x.png" alt="tip">
        <p>电话号码会使用虚拟号码</p>
      </view>
    </Modal>

    <!--服务内容-->
    <view class="ItemsService">
      <view class="ItemsService_top">
        <contentHeader :name="server_name"></contentHeader>
      </view>
      <view class="ItemsService_bottom">
        <p>{{ info.title + info.hours + info.spec_unit + '（' + info.staff_num + '人）' }}</p>
      </view>
    </view>
    <!-- 预约信息 -->
    <view class="bookingService_detail" :style="!info.is_add_sub_order && info.order_staff.length === 0 ? 'margin-bottom: 236rpx;':''">
      <view class="ItemsService_top">
        <contentHeader :name="make_name"></contentHeader>
      </view>
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
          <p>{{ info.hours + info.spec_unit }}</p>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>预约时间</h4>
        </view>
        <view class="bookingService_detail_list_right">
          <p>{{ info.appointment_date }}</p>
          <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left">
          <h4>预约人数</h4>
        </view>
        <view class="bookingService_detail_list_right">
          <p>{{ info.staff_num }}</p>
        </view>
      </view>
      <view class="bookingService_detail_first_col">
        <view class="bookingService_detail_list_left" style="width: 30%;">
          <h4>选择服务人员</h4>
        </view>
        <view class="bookingService_detail_list_right" style="width: 70%;">
          <template v-if="info.order_staff.length !== 0">
            <image v-for="(i,k) in info.order_staff" :key="k" class="userPicture" :src="i.pic" mode=""></image>
          </template>
        </view>
      </view>
      <!--地址相关-->
      <view class="bookingService_address">
        <view class="bookingService_address_top">
          <view class="left">
            <h4>{{ info.address.name }}</h4>
            <span>{{ info.address.tel }}</span>
          </view>
        </view>
        <view class="bookingService_address_top">
          <view class="left">
            <h4>{{ showAddressDesc }}</h4>
          </view>
        </view>
      </view>
      <view class="bookingService_detail_first_col" style="border-bottom: none;">
        <view class="bookingService_detail_list_left" style="width: 30%;">
          <h4>备注信息</h4>
        </view>
        <view class="bookingService_detail_list_right" style="width: 70%;">
          <view class="system-dispatch" style="color: #9A9A9A">{{ remarks }}</view>
          <image src="https://admin.dajxyl.com/oss?path=img/fanhui_yuyue3@2x(1).png" mode=""></image>
        </view>
      </view>
    </view>
    <!--服务信息-->
    <view class="info_server" v-if="info.order_staff.length !== 0"
    :style="!info.is_add_sub_order ? 'margin-bottom: 236rpx;':''">
      <view class="info_server_top">
        <contentHeader :name="info_server_name"></contentHeader>
      </view>
      <view class="info_server_center">
        <view v-for="(i,k) in info.order_staff" :key="k">
          <view class="first_col">
            <image :src="i.pic" mode=""></image>
            <h4>{{ i.nick }}({{ i.sexShow }})</h4>
            <p>{{ i.tel.substr(0, 3) + '****' +  i.tel.substr(7, 11) }}</p>
            <em @click="open(i.tel)" v-if="info.ShowStatus.status !== 8">联系Ta</em>
          </view>
          <view class="info_server_content">
            <h4>服务开始时间:</h4>
            <p>{{ i.startTime ? i.startTime : '服务未开始' }}</p>
          </view>
          <view class="info_server_content">
            <h4>服务结束时间:</h4>
            <p>{{ i.endTime ? i.endTime : '服务未结束' }}</p>
          </view>
        </view>
      </view>
    </view>
    <!--补单信息-->
    <view class="info_server" v-if="info.is_add_sub_order"
      style="margin-bottom: 236rpx;">
      <view class="info_server_top">
        <contentHeader :name="sub_server_name"></contentHeader>
      </view>
      <view class="info_server_center">
        <view class="info_server_content">
          <h4>补单规格：</h4>
          <p style="text-align: right">{{ parseInt(info.order_sub_info.time_service) / 60 }}小时</p>
        </view>
        <view class="info_server_content" style="margin-bottom: 0.2rem">
          <h4>补单人员:</h4>
        </view>
        <view class="list_col" v-for="(i,k) in info.order_sub_info.sub_staff" :key="k">
          <image :src="i.pic" mode=""></image>
          <h4>{{i.nick}}({{i.sex === 0 ? '女' : '男'}})</h4>
          <p>{{i.tel}}</p>
        </view>
        <view class="info_server_content">
          <h4>补单金额:</h4>
          <p style="text-align: right;color: #fd7600">￥{{info.order_sub_info.pay_amount / 100}}</p>
        </view>
      </view>
    </view>
    <!--底部菜单-->
    <template v-if="info.is_appointment && info.status_staff != 6">
      <view class="bookingService_bottomBtn" :style="isIPX? 'padding-bottom: 38rpx': ''">
        <view class="bookingService_bottomBtn_btn">
          <view class="bookingService_bottomBtn_btn_right" @click="updateAppointmentTime(info)">
            <button type="primary">修改预约时间</button>
          </view>
        </view>
      </view>
    </template>

    <template v-if="!info.is_add_sub_order && info.status_staff == 6">
      <view class="bookingService_bottomBtn" :style="isIPX? 'padding-bottom: 38rpx': ''">
        <view class="bookingService_bottomBtn_btn">
          <view class="bookingService_bottomBtn_btn_right" @click="subOrder(info)">
            <button type="primary">补单</button>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import contentHeader from "./detaileOrder";
import {getBingTel, OrderInfo} from "../../api";
import {dialPhone, showOrderStatus, showTime} from "../../service";
import Modal from '@/components/Modal/index.vue'

export default {
  components: {
    uniNavBar,
    contentHeader,
    Modal,
  },
  data() {
    const {isIPX} = getApp().globalData;
    return {
      isIPX,
      title: '服务详情',
      server_name: '服务项目',
      make_name: '预约信息',
      info_server_name: '服务信息',
      sub_server_name: '补单信息',
      info: {
        address:{
          city:'',
          area:'',
          desc:'',
        }
      },
      tel: '',
    }
  },
  onLoad(option) {
    console.log(option);
    let orderID = option.orderID, that = this;
    let res = OrderInfo(orderID);
    res.then(function (value) {
      console.log(value);
      let info = value.data.data.info;
      if (info.type !== '3' || info.status === '0' || info.status_money === '0' || info.status_money === '4') {
        info.ShowAppointment = showTime(info.appointment);
        info.ShowStatus = showOrderStatus(
            parseInt(info.status),
            parseInt(info.status_money),
            parseInt(info.status_staff)
        );
      } else {
        info.ShowStatus = {msg: '剩余' + info.combo_info.residue_number + '次'}
      }
      // 处理员工数据
      if (info.order_staff.length !== 0) {
        info.order_staff.forEach(function (i, k) {

          i.nick = i.nick.length > 8 ? i.nick.slice(0,8) + '...' : i.nick;

          if (i.sex == 1) {
            i.sexShow = '男';
          } else {
            i.sexShow = '女';
          }
          if (i.time_arrive != 0) {
            i.arriveTime = showTime(i.time_arrive);
          } else {
            i.arriveTime = ''
          }
          if (i.time_end != 0) {
            i.endTime = showTime(i.time_end);
          } else {
            i.endTime = '';
          }
          if (i.time_enter != 0) {
            i.enterTime = showTime(i.time_enter);
          } else {
            i.enterTime = '';
          }
          if (i.time_start != 0) {
            i.startTime = showTime(i.time_start);
          } else {
            i.startTime = '';
          }
        });
      }
      that.info = info;
      console.log(info);
    });
  },
  computed: {
    showAddressDesc: function(){
      let info = this.info;
      let desc = info.address.city + info.address.area + info.address.desc;
      return desc.length > 22 ? desc.slice(0, 22) + '...' : desc;
    },
    remarks: function(){
      if (this.info.remarks) {
        return this.info.remarks.length > 14 ? this.info.remarks.slice(0, 14) + '...' : this.info.remarks;
      }
      return '';
    }
  },
  mounted: function () {

  },
  methods: {
    /**
     * @desc 修改预约时间
     * @param order_obj
     */
    updateAppointmentTime: function (order_obj) {
      this.$store.commit('orders/setOrderData', order_obj);
      return uni.navigateTo({
        url: '/pages/appointmentTime/appointmentTime'
      });
    },
    callTelByAxb: function ()
    {
      let staffTel = this.tel,userTel = this.info.address.tel,orderNum = this.info.orderID,that = this;
      let ret = getBingTel(orderNum, userTel, staffTel);
      ret.then((value) => {
        dialPhone(value.data.data.info.x_phone);
      });
    },
    /**
     * 父组件调用子组件的方法
     * **/
    open: function (tel) {
      this.tel = tel;
      this.$refs.modal.open();
    },
    close() {
      this.$refs.modal.close();
    },
    /*预约信息中电话联系*/
    callTel: function (tel) {
      dialPhone(tel)
    },
    /*订单补单*/
    subOrder: function (order_obj){
      this.$store.commit('orders/setOrderData', order_obj);
      return uni.navigateTo({
        url: '/pages/orderSupplement/orderSupplement'
      });
    },
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

@content_style: {
  h4 {
    // width:2.56rem;
    width: 24%;
    font-size: 0.875rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }
  p {
    // width:5.125rem;
    width: 75%;
    font-size: 0.875rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(101, 101, 101, 1);
  }
}

@firstColStyle: {
  image {
    width: 1.655rem;
    height: 1.565rem;
    border-radius: 50%;
  }
  h4 {
    width: 25%;
    // height:0.875rem;
    font-size: 0.875rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-left: 0.655rem;
  }
  p {
    width: 32%;
    // height:0.69rem;
    font-size: 0.875rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    // margin-left: 1.22rem;
  }
  em {
    width: 115upx;
    height: 42upx;
    border: 1px solid #fd7600;
    border-radius: 20upx;
    color: #fd7600;
    text-align: center;
    font-size: 26upx;
  }
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
        width: 100%;
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

  .info_server {
    @contentItem();
    @item();
    flex-wrap: wrap;
    margin-top: 22rpx;

    .info_server_top {
      width: 100%;
      padding-bottom: 27rpx;
      border-bottom: 1px solid rgba(153, 153, 153, .2);
    }

    .info_server_center {
      width: 100%;

      .first_col {
        width: 100%;
        height: 1.565rem;
        @item();
        justify-content: flex-start;
        margin-top: 0.75rem;
        @firstColStyle();
      }

      .list_col {
        width: 100%;
        height: 1.565rem;
        @item();
        justify-content: flex-start;
        @firstColStyle();
      }

      .info_server_content {
        width: 100%;
        height: 0.84rem;
        @item();
        justify-content: flex-start;
        @content_style();
        margin-top: 0.625rem;

        h4 {
          width: 35%;
        }

        p {
          width: 65%;
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

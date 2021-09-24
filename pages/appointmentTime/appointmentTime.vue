<!--预约时间-->
<template>
  <view class="appointmentTime" :class="{'global-page': isIPX }">
	  <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="time_date">
      <time-selector @selectTime="selectTimeEvent" :type="!modifyTime? 'edit': 'add'" endTime="21:00" selectedTabColor="#fd7600"
                     selectedItemColor="#fd7600"></time-selector>
    </view>
    <view class="explain" v-if="modifyTime">
      <view class="explain_top">
        <image src="https://admin.dajxyl.com/oss?path=img/polygon_origin.png" mode=""></image>
        <h4>预约事项说明</h4>
        <image src="https://admin.dajxyl.com/oss?path=img/polygon_origin.png" mode=""></image>
      </view>
      <view class="explain_bottom">
        <p>
          1、平台服务时间为早08:00至晚21:00，请在服务时间内进行预约！
        </p>
        <p>
          2、服务人员实际到达时间可能会受交通影响晚30分钟内均属正常现象，感谢理解！
        </p>
        <p>
          3、因平台需要调配服务人员为您提供优质的服务，所以请务提前3小时进行预约，有疑问请拨打{{CONTACT_TEL}}。
        </p>
      </view>
    </view>
    <view class="appointmentTime_bottom" v-else="modifyTime">
      <button type="primary" @click="selectTime">确认提交</button>
    </view>
  </view>
</template>

<script>
import timeSelector from '../../components/xiujun-time-selector/index111.vue';
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {updateAppointmentTime} from "../../api/index";
import { CONTACT_TEL } from "@/config/constant";

export default {
  components: {
    uniNavBar,
    timeSelector,
  },
  data() {
    return {
      title: '修改预约时间',		//可以传递预约时间或者修改预约时间
      modifyTime: false,		//上一页面传递参数 true 预约时间  false修改预约时间
      appointmentTime: '',
      isIPX:this.$isIPX,
      CONTACT_TEL,
      addMount: '',
    }
  },
  onLoad(option) {
    this.modifyTime = option.modifyTime;
    if (option.modifyTime) {
      this.title = '预约时间';
    }
  },
  computed: {
    ...mapState('orders', {
      'orderData': 'orderData',
    })
  },
  methods: {
    ...mapMutations('serviceinfo', {
      'setAppointmentTime': 'setAppointmentTime',
    }),
    ...mapMutations('orders', {
      'setOrderData': 'setOrderData',
    }),
    /*预约时间选择组件点击事件*/
    selectTimeEvent: function (data) {
      const { time, addMount = '' } = data;
      this.appointmentTime = time;
      this.addMount = addMount;
      let that = this, curTime, timestamp;
      curTime = new Date();
      timestamp = Date.parse(new Date(curTime.getFullYear() + '/' + that.appointmentTime)) / 1000;
      that.setAppointmentTime({ timestamp, addMount });
    },
    selectTime: function () {
      let that = this, curTime, timestamp;
      curTime = new Date();
      timestamp = Date.parse(new Date(curTime.getFullYear() + '/' + that.appointmentTime)) / 1000;
      if (that.appointmentTime == '') {
        return uni.showToast({
          title: '请选择时间！',
          duration: 2000,
          icon: 'none',
          mask: true,
        });
      }

      this.orderData.appointment = timestamp
      this.$store.commit('orders/setOrderData', this.orderData);

      let res = updateAppointmentTime(that.orderData.orderID,timestamp);

      res.then(function (e) {
        if (e.data.data.info) {
          return uni.navigateTo({
            url: '/pages/resultTimeModify/resultTimeModify'
          });
        }
      });
    }
  }
}
</script>

<style lang="less">
@itme: {
  display: flex;
  justify-content: center;
  align-items: center;
}

.appointmentTime {
  width: 100%;
  min-height: 100%;

  .time_date {
    width: 100%;
  }

  .explain {
    width: 100%;
    height: 13.03rem;
    background: rgba(255, 255, 255, 1);
    @itme();
    flex-wrap: wrap;

    .explain_top {
      width: 100%;
      height: 3.375rem;
      @itme();

      image {
        width: 0.75rem;
        height: 0.75rem;
      }

      h4 {
		margin: 0 18rpx;
        @itme();
        height: 0.97rem;
        font-size: 1rem;
        line-height: 0.97rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
      }
    }

    .explain_bottom {
      width: 94%;
      height: 7.72rem;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 2rem;

      p {
        width: 100%;
        // height:7.72rem;
        font-size: 0.815rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 1.375rem;
      }
    }
  }

  .appointmentTime_bottom {
    width: 100%;
    height: 3.815rem;
    @itme();

    button {
      width: 88.8%;
      height: 2.875rem;
      background: #fd7600;
      border-radius: 1.5rem;
    }
  }
}
</style>

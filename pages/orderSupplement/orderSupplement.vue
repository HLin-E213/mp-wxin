<!--订单补单-->
<template>
  <view class="orderSupplement" :class="{'global-page': isIPX }">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>

    <view class="order-supplement-wrap">
      <!--顶部广告-->
      <view class="orderSupplement_top">
        <view class="orderSupplement_top_left">
          <image :src="info.service_info.thum[0]" mode=""></image>
        </view>
        <view class="orderSupplement_top_right">
          <h4>{{ info.service_info.title }}</h4>
          <span>{{ info.service_info.subtitle }}</span>
        </view>
      </view>
      <!--服务人员信息-->
      <view class="orderSupplement_center">
        <view class="orderSupplement_center_title">
          <b></b>
          <h4>服务人员</h4>
        </view>
        <view class="orderSupplement_center_content" @click="selectService(i,k)"
              v-for="(i,k) in info.staff_list" :key="k">
          <view class="orderSupplement_center_content_left">
            <image :src="i.pic" mode=""></image>
            <h4>{{ i.nick }}</h4>
            <p>({{ i.sex == 0 ? '女' : '男' }})</p>
            <span>{{ i.tel }}</span>
          </view>
          <view class="orderSupplement_center_content_right">
            <image src="https://admin.dajxyl.com/oss?path=img/notSelect@2x.png" mode="" v-if="i.check == false"></image>
            <image src="https://admin.dajxyl.com/oss?path=img/onSelect@2x_origin.png" mode="" v-else></image>
          </view>
        </view>
        <!--      <view class="orderSupplement_center_content" @click="selectService">-->
        <!--        <view class="orderSupplement_center_content_left">-->
        <!--          <image src="https://admin.dajxyl.com/oss?path=img/yunyanlao@2x.png" mode=""></image>-->
        <!--          <h4>王林</h4>-->
        <!--          <p>(男)</p>-->
        <!--          <span>139****9900</span>-->
        <!--        </view>-->
        <!--        <view class="orderSupplement_center_content_right">-->
        <!--          <image src="https://admin.dajxyl.com/oss?path=img/onSelect@2x_origin.png" mode=""></image>-->
        <!--        </view>-->
        <!--      </view>-->
      </view>
      <!--补单续时选择-->
      <view class="orderSupplement_time">
        <view class="orderSupplement_center_title">
          <b></b>
          <h4>补单续时</h4>
        </view>
        <view class="orderSupplement_time_content">
          <view class="orderSupplement_time_content_list" v-for="(i,k) in info.spec_list" :key="k" @click="selectTime(i,k)"
                :style="i.check?'background:#fd7600;border:none' :''">
            <p :style="i.check?'color:#FFFFFF':''">+{{ i.time_service }}分钟</p>
          </view>
        </view>
      </view>
      <!--补单说明-->
      <view class="orderSupplement_description">
        <p>相关说明：您可以选择1个或多个服务人员进行补单续时，补单金额根据选择的人数及续时单价计算。</p>
      </view>

    </view>
    <!--底部按钮确认下单-->
    <view class="orderSupplement_footer":style="isIPX? 'padding-bottom: 38rpx': ''"
    v-if="info.spec_list.length !== 0">
      <view class="orderSupplement_footer_left">
        <p>价格：</p>
        <span>¥{{ money }}</span>
      </view>
      <view class="orderSupplement_footer_right" @click="orderSupplement">
        <button type="primary">立即下单</button>
      </view>
    </view>
  </view>
</template>
<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {mapArr} from '../../service.js';
import {subOrder} from '../../api/index';

export default {
  components: {
    uniNavBar,
  },
  data() {
    const {isIPX} = getApp().globalData;
    return {
        isIPX,
      title: '订单补单',
      timeList: [{time: '+30分钟', check: false}, {time: '+30分钟', check: false}, {
        time: '+30分钟',
        check: false
      }, {time: '+30分钟', check: false}],
      info: {},
      money: 0,
      spec_time_id: '',
      spec_staff_id: '',
      spec_staff: [],
      spec_time: {},
        isIPX:this.$isIPX,
    }
  },
  computed: {
    // timeStyle:false,
    ...mapState('orders', {
      'orderData': 'orderData',
    })
  },
  onLoad() {
    this.getOrderInfo();
  },
  methods: {
    ...mapMutations('orders',{
      'setOrderSpec':'setOrderSpec'
    }),
    getOrderInfo: function () {
      let orderID = this.orderData.id, that = this;
      let res = subOrder(orderID);
      res.then(function (value) {
        value.data.data.info.spec_list.forEach(function(i,k){
          i.check = false;
        });
        value.data.data.info.staff_list.forEach(function(i,k){
          i.check = false;
        });
        that.info = value.data.data.info;
      });
    },
    /**
     * 点击选时间段 传k
     * @param {number}  k
     * **/
    selectTime: function (i,k) {
      // console.log(i,k);
      mapArr(this.info.spec_list);
      this.info.spec_list[k].check = !this.info.spec_list[k].check;
      this.money = i.price / 100;
      this.spec_time_id = i.id;
      this.spec_time = i;
    },
    /*选择服务人员*/
    selectService: function (i,k) {
      // console.log(i,k);
      let that = this;
      that.info.staff_list[k].check = !that.info.staff_list[k].check;
      that.spec_staff_id = '';
      that.spec_staff = [];
      that.info.staff_list.forEach(function(value){
        if (value.check == true) {
          that.spec_staff_id += value.id + ',';
          that.spec_staff.push(value);
        }
      });
      that.spec_staff_id = that.spec_staff_id.slice(0, -1);
    },
    orderSupplement: function (){
      if (this.spec_staff == '') {
        return uni.showToast({
          title: '请选择服务人员！',
          duration: 2000,
          icon: 'none',
          mask: true,
        });
      }
      if (this.spec_time == '') {
        return uni.showToast({
          title: '请选择补时规格！',
          duration: 2000,
          icon: 'none',
          mask: true,
        });
      }
      this.$store.commit('orders/setOrderSpec', {
        spec_staff_id: this.spec_staff_id,
        spec_time_id: this.spec_time_id,
        spec_staff: this.spec_staff,
        spec_time: this.spec_time,
      });
      return uni.redirectTo({
        url: '/pages/bookingMake/bookingMake'
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

@titleItem: {
  width: 94%;
  height: 2.565rem;
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: flex-start;
  b {
    width: 0.19rem;
    height: 1rem;
    background: #fd7600;
    border-radius: 0.5rem;
  }
  h4 {
    font-size: 1.125rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(52, 52, 52, 1);
    margin-left: 0.3rem;
  }
}
.orderSupplement {
  width: 100%;
  min-height: 100%;
  background: #F8F8F8;
  padding-bottom: 98upx;
  .order-supplement-wrap{
    padding: 24upx 20upx;
  }

  .orderSupplement_top {
    width: 100%;
    height: 178upx;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 15upx 0 rgba(169, 169, 169, 0.2);
    border-radius: 10upx;
    @item();
    flex-wrap: wrap;
	justify-content: flex-start;

    .orderSupplement_top_left {
	  padding-left: 26upx;
      height: 100%;
      @item();

      image {
        width: 170upx;
        height: 124upx;
        border-radius: 6upx;
      }
    }

    .orderSupplement_top_right {
      padding-left: 23upx;
      height: 100%;
      @item();
      flex-wrap: wrap;
	  flex-direction: column;
	  align-items: flex-start;

      h4 {
        font-size: 32upx;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(52, 52, 52, 1);
      }

      span {
        font-size: 26upx;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
		padding-top: 16upx;
      }
    }
  }

  .orderSupplement_center {
    width:100%;
    background: rgba(255, 255, 255, 1);
	box-shadow: 0 0 15upx 0 rgba(169, 169, 169, 0.2);
    border-radius: 10upx;
    @item();
    flex-wrap: wrap;
    margin-top: 24rpx;

    .orderSupplement_center_title {
      @titleItem();
    }

    .orderSupplement_center_content {
      width: 94%;
      height: 3.565rem;
      @item();
      border-bottom: 1px dashed rgba(153, 153, 153, .2);

      .orderSupplement_center_content_left {
        width: 80%;
        height: 100%;
        @item();
        justify-content: flex-start;

        image {
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 50%;
        }

        h4 {
          // width:3.75rem;
          // height:0.875rem;
          font-size: 0.875rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(52, 52, 52, 1);
          margin-left: 0.66rem;
        }

        span {
          // width:5.22rem;
          // height:0.69rem;
          font-size: 0.875rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          margin-left: 1.22rem;
        }

        p {
          // width:3.75rem;
          // height:0.875rem;
          font-size: 0.875rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(52, 52, 52, 1);
          margin-left: 0.3rem;
        }
      }

      .orderSupplement_center_content_right {
        width: 20%;
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
	.orderSupplement_center_content:last-child{
		border-bottom: none;
	}
  .orderSupplement_time {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0 15upx 0  rgba(169, 169, 169, 0.2);
    border-radius:10upx;
    @item();
    flex-wrap: wrap;
    margin-top: 24upx;

    .orderSupplement_center_title {
      @titleItem();
    }

    .orderSupplement_time_content {
      width: 94%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      margin-top: 0.5rem;

      .orderSupplement_time_content_list {
        width: 180upx;
        height: 60upx;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(154, 154, 154, 1);
        border-radius: 30upx;
        margin-left: 58upx;
        margin-bottom: 21upx;
        @item();

        p {
          font-size: 28upx;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }

        &:hover {
          border: none;
        }
      }
      .orderSupplement_time_content_list:nth-of-type(3n+1){
        margin-left: 0;
      }
    }
  }

  .orderSupplement_description {
    width: 94%;
    // height:3.57rem;
    margin-top: 0.75rem;
    @item();
    margin-bottom: 9.44rem;

    p {
      // height:1.785rem;
      font-size: 0.75rem;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(102, 102, 102, 1);
      line-height: 1.065rem;
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
    z-index: 10;

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
        color: #408CFF;
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

<!--订单详情页-->
<template>
  <view class="detailsOrder" :class="{'global-page': isIPX }">
     <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="stateServer">
      <view class="stateServer_img" v-if="info.type !== '3'">
        <image :src="info.thum[0]" mode=""></image>
      </view>
      <view class="stateServer_img" v-else>
        <image :src="info.combo_info.combo_banner" mode=""></image>
      </view>
      <view class="stateServer_detatle">
        <h4>{{ info.title }}</h4>
        <p v-if="info.type !== '3'">{{ info.model.subtitle }}</p>
        <p v-else>{{ info.combo_info.service_title + info.combo_info.service_spec + info.combo_info.spec_unit + "(" + info.combo_info.staff_num + "人)X" + info.combo_info.combo_num }}</p>
      </view>
      <view class="stateServer_right">
        <p>{{ info.ShowStatus.msg }}</p>
      </view>
    </view>
    <!--服务项目-->
    <view class="ItemsService">
      <view class="ItemsService_top">
        <contentHeader :name="server_name"></contentHeader>
      </view>
      <view class="ItemsService_bottom" v-if="info.type !== '3'">
        <p>{{ info.model.subtitle }}</p>
      </view>
      <view class="ItemsService_bottom" v-else>
        <p>{{ info.combo_info.service_title + info.combo_info.service_spec + info.combo_info.spec_unit + "(" + info.combo_info.staff_num + "人)X" + info.combo_info.combo_num }}</p>
      </view>
    </view>
    <!--预约信息-->
    <template v-if="info.type !== '3'">
      <view class="informationAppointment">
        <view class="informationAppointment_top">
          <contentHeader :name="info_name"></contentHeader>
        </view>
        <view class="informationAppointment_bottom">
          <view class="info_content">
            <h4>{{ info.address.name }}</h4>
            <p>{{ info.address.tel }}</p>
          </view>
          <view class="info_content">
            <h4>预约地址:</h4>
            <p>{{ info.address.city + info.address.area + info.address.desc }}</p>
          </view>
          <view class="info_content">
            <h4>预约时间:</h4>
            <p>{{ info.ShowAppointment }}</p>
          </view>
          <view class="info_content">
            <h4>预约规格:</h4>
            <p>{{ info.service_spec + info.spec_unit }}</p>
          </view>
          <view class="info_content">
            <h4>预约人数:</h4>
            <p>{{ info.staff_num }}</p>
          </view>
          <view class="info_content">
            <h4>备注信息:</h4>
            <p>{{ info.remarks }}</p>
          </view>
          <view class="bottom_empty"></view>
        </view>
      </view>
      <!--服务信息-->
      <view class="info_server" v-if="info.order_staff.length != 0">
        <view class="info_server_top">
          <contentHeader :name="info_server_name"></contentHeader>
        </view>
        <view class="info_server_center" v-for="(i,k) in info.order_staff" :key="k">
          <view class="first_col">
            <image :src="i.pic" mode=""></image>
            <h4>{{ i.nick }}({{ i.sexShow }})</h4>
            <p>{{ i.tel.substr(0, 3) + '****' +  i.tel.substr(7, 11) }}</p>
            <em @click="open(i.tel)" v-if="info.ShowStatus.status !== 8">联系Ta</em>
          </view>
          <view class="info_server_content">
            <h4>服务开始时间:</h4>
            <p>{{ i.startTime }}</p>
          </view>
          <view class="info_server_content">
            <h4>服务结束时间:</h4>
            <p>{{ i.endTime }}</p>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <!-- 服务内容 -->
      <view class="comboAppointment">
        <view class="comboAppointment_top">
          <contentHeader :name="info_combo_name"></contentHeader>
        </view>
        <view class="comboAppointment_bottom">
          <view class="info_content" v-for="(combo_item,k) of info.combo_order_service_list" :key="k"
          :style="combo_item.status_staff === '2' ? 'background-color:#f5f5f5;color:#fff;':''">
            <template v-if="info.status_money !== '4'">
              <p>
                {{ info.combo_info.service_title + info.combo_info.service_spec + info.combo_info.spec_unit + "(" + info.combo_info.staff_num + "人)X" + info.combo_info.combo_num }}
              </p>
              <view class="Btn" v-if="combo_item.status_staff === -1 && info.status_money == 1" @click="MakeComboService">
                <p>预约</p>
              </view>
              <view class="Btn" @click="comboOrder(combo_item.order_number)" v-else-if="combo_item.status_staff === '2' && info.status_money == 1" style="background-color:#c1c1c1;">
                <p style="background-color:#c1c1c1;">已完成</p>
              </view>
              <view class="Btn" @click="comboOrder(combo_item.order_number)" v-else-if="info.status_money == 1">
                <p v-if="combo_item.status_staff === '0'">待派单</p>
                <p v-else-if="combo_item.status_staff === '1'">已派单</p>
                <p v-else-if="combo_item.status_staff === '4'">已接单</p>
                <p v-else-if="combo_item.status_staff === '5'">已到达</p>
                <p v-else>服务中</p>
              </view>
            </template>
            <template v-else>
              <p style="background-color: #9A9A9A;margin: 5rpx 0;">{{ info.combo_info.service_title + info.combo_info.service_spec + info.combo_info.spec_unit + "(" + info.combo_info.staff_num + "人)X" + info.combo_info.combo_num }}</p>
            </template>
          </view>
        </view>
      </view>
    </template>
    <!--订单信息-->
    <view class="informationOrder" v-if="stateOrder">
      <view class="info_order_top">
        <contentHeader :name="info_order_name"></contentHeader>
      </view>
      <view class="info_order_bottom">
        <view class="number_order">
          <h4>订单编号：</h4>
          <p>{{ info.orderID }}</p>
          <em @click="copy">复制</em>
        </view>
        <view class="info_order_content">
          <h4>下单时间:</h4>
          <p>{{ info.time }}</p>
        </view>
        <view class="info_order_content">
          <h4>付款时间:</h4>
          <p>{{ info.order_pay.time }}</p>
        </view>
        <view class="info_order_content">
          <h4>订单金额:</h4>
          <p>{{ info.amount / 100 }}</p>
        </view>
        <view class="first_col">
          <image src="https://admin.dajxyl.com/oss?path=img/zhijiang.png" mode=""></image>
          <h4>优惠：</h4>
          <p>{{ (info.amount - info.pay_amount) / 100 }}元</p>
        </view>
        <view class="info_order_content">
          <h4>支付方式:</h4>
          <p>微信支付</p>
        </view>
        <view class="info_order_content" v-if="info.coupon">
          <h4>实付金额:</h4>
          <p style="color: #fd7600;">¥{{ info.pay_amount / 100 }}（<span>已优惠</span>{{ info.showCoupon }}）</p>
        </view>
        <view class="info_order_content" v-else>
          <h4>实付金额:</h4>
          <p style="color: #fd7600;">¥{{ info.pay_amount / 100 }}</p>
        </view>
      </view>
    </view>
    <view class="detailsOrder_bottom" :style="isIPX? 'padding-bottom: 38rpx': ''" v-if="info.type !== '3'">
      <view class="btn_left">
        <view class="customerContact" @click="callTel(info.model.tel)">
          <view class="customerContact_top">
            <image src="https://admin.dajxyl.com/oss?path=img/kefu1@2x_origin.png" mode=""></image>
          </view>
          <view class="customerContact_bottom">
            <p>联系客服</p>
          </view>
        </view>
      </view>
      <template v-if="info.ShowStatus.status === 1">
        <view class="btn_right" @click="cashier(info)">
          <button type="primary">去支付</button>
        </view>
      </template>

      <template v-if="info.ShowStatus.status === 8 || info.ShowStatus.status === 4 || info.ShowStatus.status === 5 || info.ShowStatus.status === 10 || info.ShowStatus.status === 2">
        <view class="btn_right" @click="againCashier">
          <button type="primary">再来一单</button>
        </view>
      </template>

      <template v-if="(info.ShowStatus.status === 6 || info.ShowStatus.status === 7) && info.type !== '4'">
        <view class="btn_right" @click="refund(info)">
          <button type="primary">申请退款</button>
        </view>
      </template>

      <template v-if="info.ShowStatus.status === 9 && info.type !== '4'">
        <view class="btn_right" @click="refund(info)">
          <button type="primary">申请退款</button>
        </view>
      </template>

    </view>

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

  </view>
</template>
<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import contentHeader from './detaileOrder.vue';
import {dialPhone, showOrderStatus, showTime} from '../../service.js';
import {OrderInfo, getServiceInfo, wxpay, chekOrderFree, getBingTel} from '../../api/index';
import {mapMutations} from 'vuex';
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
      title: '订单详情',
      stateServer: '服务完成',
      server_name: '服务项目',
      info_name: '预约信息',
      info_server_name: '服务信息',
      info_order_name: '订单信息',
      info_combo_name: '服务内容',
      stateOrder: true,
      infoServerList: [{}, {}],
      info: {},
      tel: '',
    };
  },
  onLoad(option) {
    let orderID = option.orderID, that = this;
    let res = OrderInfo(orderID);
    res.then(function (value) {
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
      // 处理优惠券显示
        if (info.coupon) {
          switch (info.coupon.type) {
            case '1':
              info.showCoupon = info.coupon.nature + '元';
              break;
            case '2':
              info.showCoupon = info.coupon.nature.split('|')[1] + '元';
              break;
            case '3':
              info.showCoupon = info.coupon.nature * 10 + '折';
              break;
          }
        }
        // 处理员工数据
        if (info.order_staff.length != 0) {
          info.order_staff.forEach(function (i, k) {
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
      }
    );
  },
  methods: {
    ...mapMutations('serviceinfo', {
      'setData': 'setData',
    }),
    /*(套餐)立即预约*/
    MakeComboService: function () {
      this.$store.commit('serviceinfo/setData',this.info);
      return uni.navigateTo({
        url: '/pages/bookingService/MakeComboService'
      });
    },
    comboOrder: function(orderID){
      return uni.navigateTo({
        url: '/pages/detailsOrder/comboOrder?orderID=' + orderID,
      });
    },
    /*点击复制订单号*/
    copy: function () {
      uni.setClipboardData({
        data: this.info.number,
        success: function () {
          console.log('success');
        }
      })
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
    cashier: function (order_obj) {
      let wx_res = wxpay(order_obj.orderID);
      wx_res.then(function(e){
        let wx_res = e.data.data.info.info;
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: wx_res.timeStamp,
          nonceStr: wx_res.nonceStr,
          package: wx_res.package,
          signType: wx_res.signType,
          paySign: wx_res.paySign,
          success: function (res) {
            uni.showToast({
              title: '支付成功！',
              duration: 2000
            });
            // 查询是否免单跳转响应页面
            let isOrderFree = chekOrderFree(order_obj.orderID);
            isOrderFree.then(function (value) {
              let is_free = value.data.data.info.is_free;
              if (is_free) {
                return uni.navigateTo({
                  url: '/pages/chargeFree/chargeFree'
                });
              } else {
                return uni.navigateTo({
                  url: '/components/statusPayment/statusPayment'
                });
              }
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
    },
    refund: function (order_obj) {
      this.$store.commit('orders/setOrderData', order_obj);
      return uni.navigateTo({
        url: '/pages/refundApply/refundApply'
      });
    },
    subOrder: function (order_obj){
      this.$store.commit('orders/setOrderData', order_obj);
      return uni.redirectTo({
        url: '/pages/orderSupplement/orderSupplement'
      });
    },
    againCashier: function () {
      let sid = this.info.model_id,that=this,res;
      res = getServiceInfo(sid)
      res.then(function(value){
        that.setData(value.data.data.info);
        return  uni.navigateTo({
            url: '/pages/detailsProduct/detailsProduct'
          });
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
  margin: 17upx 20rpx 0 20upx;
  width: 710rpx;
  background: rgba(255, 255, 255, 1);
  box-shadow: 1px 1px 1px 1px rgba(169, 169, 169, 0.2);
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

.detailsOrder {
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .stateServer {
	position: relative;
    @contentItem();
    @item();
    margin-top: 17upx;

    .stateServer_img {
      width: 124rpx;
      height: 100%;
      @item();
		justify-content: space-between;
      image {
        width: 3.875rem;
        height: 3.875rem;
        border-radius: 0.3rem;
      }
    }

    .stateServer_detatle {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
	  margin-left: 22upx;
      h4 {
       margin-top: 23upx;
        font-size: 32upx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #343434;
      }

      p {
        margin-top: 16upx;
        font-size: 26upx;
        font-family: PingFang SC;
        color: #666666;
      }
    }

    .stateServer_right {
		position: absolute;
		top: 0;
		right: 36rpx;
	  padding: 5rpx 39rpx;
      height: 44upx;
	  background-image: url(https://admin.dajxyl.com/oss?path=img/yuanjiaojuxing_origin.png);
	  background-size: 100% 100%;
	  background-repeat: no-repeat;
      display: flex;
      flex-wrap: wrap;
	  width: fit-content;

      image {
        width: 5.625rem;
        height: 1.375rem;
        z-index: 1;
      }
      p {
        font-size: 0.81rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        z-index: 2;
      }
    }
  }

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

  .informationAppointment {
    @contentItem();
    @item();
    flex-wrap: wrap;
	margin-top: 24upx;

    .informationAppointment_top {
      width: 100%;
      padding-bottom: 27rpx;
      border-bottom: 1px solid rgba(153, 153, 153, .2);
    }

    .informationAppointment_bottom {
      width: 100%;
      // @item();
      display: flex;
      // align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-top: 0.5rem;

      .info_content {
        width: 100%;
        @item();
        justify-content: flex-start;
        @content_style();
        padding-bottom: 30rpx;
        align-items: normal;
      }

      .bottom_empty {
        width: 94%;
        height: 10%;
        display: flex;
      }

      .Btn {
        padding: 6upx 17upx;
        min-width: 80upx;
        margin-left: 24upx;
        background-color: #fd7600;
        border-radius: 30upx;
        p {
          text-align: center;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }

  .comboAppointment {
    @contentItem();
    @item();
    flex-wrap: wrap;
    margin-top: 24upx;

    .comboAppointment_top {
      width: 100%;
      padding-bottom: 27rpx;
      border-bottom: 1px solid rgba(153, 153, 153, .2);
    }

    .comboAppointment_bottom {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding-top: 4px;

      .info_content {
        width: 100%;
        @item();
        justify-content: flex-start;
        @content_style();
        padding: 20rpx 15rpx 15rpx 15rpx;
        align-items: normal;
        margin: 0.3rem 0;
        background-color: rgba(253, 118, 0, 0.2);
        border-radius: 10rpx;
        p {
          padding-top: 5rpx;
        }
      }

      .bottom_empty {
        width: 94%;
        height: 10%;
        display: flex;
      }

      .Btn {
        padding: 7rpx 7rpx;
        min-width: 120rpx;
        margin-left: 24upx;
        background-color: #fd7600;
        border-radius: 30upx;
        p {
          padding: 0;
          margin-left: 8px;
          text-align: center;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }

  .info_server {
    @contentItem();
    @item();
    flex-wrap: wrap;

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

    // .info_server_bottom{
    // 	width: 	94%;
    // 	height: 40%;
    // 	.first_col{
    // 		width:100%;
    // 		height:1.565rem;
    // 		@item();
    // 		justify-content: flex-start;
    // 		margin-top: 0.75rem;
    // 		@firstColStyle();
    // 	}
    // 	.info_server_content{
    // 		width: 100%;
    // 		height: 0.84rem;
    // 		@item();
    // 		justify-content: flex-start;
    // 		@content_style();
    // 		margin-top: 0.625rem;
    // 		h4{
    // 			width: 35%;
    // 		}
    // 		p{
    // 			width: 65%;
    // 		}
    // 	}
    // }
  }

  .informationOrder {
    @contentItem();
    @item();
    flex-wrap: wrap;
	  margin-top: 24upx;
    margin-bottom: 136rpx;

    .info_order_top {
      width: 100%;
      padding-bottom: 27rpx;
      border-bottom: 1px solid rgba(153, 153, 153, .2);
    }

    .info_order_bottom {
      width: 100%;
      margin-top: 25rpx;
      .number_order {
        width: 100%;
        @item();
        @content_style();
        justify-content: flex-start;
		padding-bottom: 24upx;
        h4 {
          width: 25%;
        }

        p {
          width: 45%;
        }

        em {
          background: #fd7600;
		  padding: 4upx 14upx;
		  border-radius: 10upx;
		  font-size: 26upx;
		  color: #ffffff;
        }
      }

      .first_col {
        width: 100%;
        @item();
        justify-content: flex-start;
        @firstColStyle();
		padding-bottom: 29upx;

        image {
          width: 1.19rem;
          height: 1.065rem;
        }

        h4 {
          width: 16%;
          margin-left: 0.44rem;
        }

        p {
          color: #fd7600;
        }
      }

      .info_order_content {
        width: 100%;
        @item();
        justify-content: flex-start;
        @content_style();
		padding-bottom: 29upx;

        h4 {
          width: 25%;
        }

        p {
          width: 65%;
        }

        span {
          color: #333333;
          width: 6%;
        }
      }
    }
  }

  .detailsOrder_bottom {
    padding: 0 32upx;
    width: 100%;
    height: 98upx;
    background: rgba(255, 255, 255, 1);
    @item();
    position: fixed;
    bottom: 0;
    z-index: 10;
	left: 0;

    .btn_left {
      height: 100%;
      @item();

      .customerContact {
        height: 1005;
        @item();
		flex-direction: column;
		justify-content: flex-start;
        flex-wrap: wrap;

        .customerContact_top {
          padding-top: 10upx;
          width: 100%;
          @item();

          image {
           width: 32upx;
           height: 36upx;
          }
        }

        .customerContact_bottom {
			      padding-top: 7upx;
            width: 100%;
            @item();
            align-items: flex-start;

          p {
            font-size: 24upx;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
          }
        }
      }
    }

    .btn_right {
      flex: 1;
      @item();
      button {
        width: 520upx;
        height: 74upx;
        background: #fd7600;
        border-radius: 37upx;
        line-height: 2.2;
      }
    }
  }

  .telAxb-body {
    display: flex;
    align-items: center;
    text-align: center;
    .img {
      margin-left: 50upx;
      padding-top: 6upx;
      width: 34upx;
      height: 34upx;
      margin-right: 6upx;
    }
  }
}
</style>

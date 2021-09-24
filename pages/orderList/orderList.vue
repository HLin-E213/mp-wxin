<!--订单列表-->
<template>
  <!-- backgroundColor="linear-gradient(0deg, #fd7600, #fd7600)"-->
  <layout
      status-bar
      :showFooter="false"
  >
    <view slot="title" class="title-wrap">
      <view
          class="title-item"
          v-for="item in titleMap"
          :key="item.value"
          :class="{'title-item-active':currentTab === item.value}"
          @click="chooseTab(item)"
      >
        {{ item.label }}
      </view>
    </view>
    <view class="orderList" :class="{'global-page': isIPX }">

      <!--服务订单状态tab-->
      <view class="itemChoice" :class="{ none: currentTab !== 'service'}">
        <view
            class="itemList"
            v-for="(i,k) in itemList"
            :key="k"
            @click="handelItem(k, 'service')"
            :class="{'item-list-active': i.check }"
        >
          {{ i.title }}
        </view>
      </view>
      <!--商城订单状态tab-->
      <view class="itemChoice" :class="{ none: currentTab !== 'shop'}">
        <view
            class="itemList"
            v-for="(i,k) in SHOP_ORDER_TAB"
            :key="k"
            @click="handelItem(i.value, 'shop')"
            :class="{'item-list-active': currentShopOrderStatus === i.value }"
        >
          {{ i.label }}
        </view>
      </view>


      <view
          class="item_list"
          v-for="(i,k) in ordersAll"
          :key="k"
          :class="{ none: currentTab !== 'service'}"
      >
        <view class="item_list_top">
          <view class="top_left">
            {{ dealTitle(i.title) }}
          </view>
          <view class="top_right">
            {{ i.ShowStatus.msg }}
          </view>
        </view>
        <view class="item_list_center" @click="OrderInfo(i)">
          <view class="time" v-if="i.type !== '3'">
            <p>预约时间:</p>
            <span>{{ i.ShowAppointment }}</span>
          </view>
          <view class="time" v-else>
            <p>下单时间:</p>
            <span>{{ i.time }}</span>
          </view>
          <view class="address" v-if="i.type !== '3'">
            <p>服务地址:</p>
            <span>{{ i.order_address.city + i.order_address.area + i.order_address.desc }}</span>
          </view>
          <view class="address" v-else>
            <p>服务内容:</p>
            <span>{{ i.combo_info.service_title + i.combo_info.service_spec + i.combo_info.spec_unit +'('+ i.combo_info.staff_num + '人) X ' + i.combo_info.combo_num }}</span>
          </view>
          <view class="price">
            <p>实付金额:</p>
            <span v-if="i.coupon">{{ i.pay_amount / 100 }}元
            <h6>(已优惠{{ i.showCoupon }})</h6>
          </span>
            <span v-else>{{ i.pay_amount / 100 }}元</span>
          </view>
        </view>

        <view class="item_list_bottom" v-if="i.type === '3' && i.combo_info.combo_num == i.combo_info.residue_number && i.status_money == 1">
          <view class="thrirdBtn" @click="refund(i)">
            <p>退款</p>
          </view>
        </view>

        <view class="item_list_bottom" v-if="showBottomBtn(i.ShowStatus.status)">

          <template v-if="i.ShowStatus.status === 1">
            <view class="firstBtn" @click="cancel(i)">
              <p>取消</p>
            </view>
            <view class="secondBtn" @click="cashier(i)">
              <p>付款</p>
            </view>
          </template>
          <!--v-if="i.ShowStatus.msg === '服务完成'"-->
          <template v-if="i.ShowStatus.status === 8">
            <view class="secondBtn" @click="addComment(i)">
              <p v-if="i.order_evaluation">已评价</p>
              <p v-else>评价</p>
            </view>
          </template>

          <template v-if="i.ShowStatus.status === 9">
            <view class="secondBtn" v-if="i.is_appointment === true && i.status_staff != 6" @click="updateAppointmentTime(i)">
              <p>修改时间</p>
            </view>
            <view class="thrirdBtn" v-if="i.status_staff == 6 && i.is_add_sub_order == false" @click="subOrder(i)">
              <p>补单</p>
            </view>
            <view class="thrirdBtn" @click="refund(i)" v-if="i.type !== '4'">
              <p>退款</p>
            </view>
          </template>

          <template v-if="i.ShowStatus.status === 6 || i.ShowStatus.status === 7">
            <view class="secondBtn" v-if="i.is_appointment === true && i.status_staff != 6" @click="updateAppointmentTime(i)">
              <p>修改时间</p>
            </view>
            <view class="thrirdBtn" @click="refund(i)" v-if="i.type !== '4'">
              <p>退款</p>
            </view>
          </template>

        </view>
      </view>

      <shopOrderList
          @getShopOrderList="shopList"
          :list="ordersAllShop"
          :class="{ none: currentTab !== 'shop'}"
      ></shopOrderList>
    </view>
  </layout>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
import layout from "@/components/layout/index.vue"
import shopOrderList from './components/shopOrderList';
import {mapArr, showTime, showOrderStatus} from '../../service.js';
import {chekOrderFree, OrderList, wxpay, OrderCancel} from '../../api/index.js';
import { SHOP_ORDER_TAB } from '../../config/constant';
import { getOrderList } from '../../api/shop/order';

const SERVICE = 'service';
const SHOP = 'shop';
export default {
  components: {
      layout,
      shopOrderList,
  },
  data() {
    return {
      title: '订单中心',
      ordersAll: [],
      page: 1,
      pageSize: 10,
      totalPage: 0,
      type: 0,
      pageShop: 1,
      pageSizeShop: 10,
      totalPageShop: 0,
      typeShop: 0,
      ordersAllShop: [],
      isIPX:this.$isIPX,
      SHOP_ORDER_TAB,
      titleMap: [
        { value: SERVICE, label: '服务订单' },
        { value: SHOP, label: '商城订单' },
      ],
      currentTab: SERVICE,
      currentShopOrderStatus: 0,
    }
  },
    watch: {
        itemList: {
            handler: function change(val) {
                // console.log('itemList', val);
            },
            immediate: true,
        }
    },
  computed: {
    ...mapState('orders', {
      'itemList': 'itemList',
    }),
	dealTitle(){
		return function deal(title) {
			return title.length > 7 ? `${title.substring(0,8)}...` : title;
		}
	},
	showBottomBtn() {
		return function isSHow(status) {
			return [1,9,6,7,8].indexOf(parseInt(status, 10)) > -1;
		}
	}
  },
  onLoad(option) {
    if (option.type === 'shop') {
      this.currentTab = 'shop';
    }
    this.getOrderList();
    this.getShopOrderList();
  },
  onShow() {
    this.getOrderList();
    this.getShopOrderList();
  },
  onReachBottom() {
    if (this.page < this.totalPage) {
      this.page++;
      this.getOrderList(true);
    }
    if (this.pageShop < this.totalPageShop) {
      this.pageShop ++;
      this.getShopOrderList(true);
    }
  },
  onPullDownRefresh() {
    this.page = 1;
    this.pageSize = 10;
    this.totalPage = 0;
    this.pageShop = 1;
    this.pageSizeShop = 10;
    this.totalPageShop = 0;
    this.getOrderList();
    this.getShopOrderList();
  },
  methods: {
    ...mapMutations('orders', {
      'setOrderData': 'setOrderData',
    }),
    chooseTab({ value }) {
      this.currentTab = value;
    },
    /*点击切换订单中心订单状态*/
    handelItem: function (k, type) {
      this.page = 1;
      this.pageSize = 10;
      this.totalPage = 0;
      this.pageShop = 1;
      this.pageSizeShop = 10;
      this.totalPageShop = 0;
      if (type === SERVICE) {
        mapArr(this.itemList);
        this.itemList[k].check = !this.itemList[k].check;
        this.type = this.itemList[k].value;
        this.getOrderList();
      } else if (type === SHOP) {
        this.currentShopOrderStatus = k;
        this.typeShop = SHOP_ORDER_TAB[k].value;
        this.getShopOrderList();
      }

    },
    OrderInfo: function (order_obj) {
      return uni.navigateTo({
        url: '/pages/detailsOrder/detailsOrder?orderID=' + order_obj.number,
      });
    },
    subOrder: function (order_obj){
      this.$store.commit('orders/setOrderData', order_obj);
      return uni.navigateTo({
        url: '/pages/orderSupplement/orderSupplement'
      });
    },
    updateAppointmentTime: function (order_obj) {
      this.$store.commit('orders/setOrderData', order_obj);
      return uni.navigateTo({
        url: '/pages/appointmentTime/appointmentTime'
      });
    },
    addComment(info) {
      console.log('info------>', info);
      this.$store.commit('orders/setOrderData', info);
      return uni.navigateTo({
        url: '/pages/listComment/addComment?from=orderList'
      });
    },
    shopList() {
      this.getShopOrderList();
    },
    getOrderList: function (last = false) {
      let that = this;
      let res = OrderList(this.type, this.page, this.pageSize);
      res.then(function (value) {
        // console.log(value);
        let listAll = [];
        that.totalPage = value.data.data.totalPage;
        value.data.data.info.forEach(function (i, k) {
          if (i.type !== '3' || i.status === '0' || i.status_money !== '1') {
            i.ShowAppointment = showTime(i.appointment);
            i.ShowStatus = showOrderStatus(
                parseInt(i.status),
                parseInt(i.status_money),
                parseInt(i.status_staff)
            );
          } else {
            if (i.combo_info.residue_number !== 0) {
              i.ShowStatus = {msg: '剩余' + i.combo_info.residue_number + '次'}
            } else {
              i.ShowStatus = {msg: '服务完成'}
            }
          }
          if (i.coupon) {
            switch (i.coupon.type) {
              case '1':
                i.showCoupon = i.coupon.nature + '元';
                break;
              case '2':
                i.showCoupon = i.coupon.nature.split('|')[1] + '元';
                break;
              case '3':
                i.showCoupon = i.coupon.nature * 10 + '折';
                break;
            }
          }
          listAll.push(i);
        });
        if (last) {
          listAll.forEach(function (i, k) {
            that.ordersAll.push(i);
          });
        } else {
          that.ordersAll = listAll;
        }
      }).catch(function(e){
        console.error(e);
      }).finally(function() {
        uni.stopPullDownRefresh();
      });
    },
    cashier: function (order_obj) {
      let wx_res,isOrderFree;
      if (order_obj.type === '3') {
        wx_res = wxpay(order_obj.number);
      } else {
        wx_res = wxpay(order_obj.orderID);
      }
      wx_res.then(function(e){
        let wxRes = e.data.data.info.info;
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: wxRes.timeStamp,
          nonceStr: wxRes.nonceStr,
          package: wxRes.package,
          signType: wxRes.signType,
          paySign: wxRes.paySign,
          success: function (res) {
            uni.showToast({
              title: '支付成功！',
              duration: 2000
            });
            // 查询是否免单跳转响应页面
            if (order_obj.type === '3') {
              isOrderFree = chekOrderFree(order_obj.number);
            } else {
              isOrderFree = chekOrderFree(order_obj.orderID);
            }
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
    cancel: function (order_obj) {
      let that = this;
      uni.showModal({
        title: '提示',
        content: '确定取消订单么？',
        success: function (res) {
          if (res.confirm) {
            let res = OrderCancel(order_obj.number)
            res.then(function (value) {
              console.log(value);
              uni.showToast({
                title: '您取消了订单！',
                duration: 2000,
                icon: 'none',
                mask: true,
              });
              return that.getOrderList();
            });
          }
        }
      });
    },
    callTel: function (order_obj) {
      console.log(order_obj);
      let tel = order_obj.info.tel;
      return uni.makePhoneCall({
        phoneNumber: tel,
      });
    },
    refund: function (order_obj) {
      this.$store.commit('orders/setOrderData', order_obj);
      return uni.navigateTo({
        url: '/pages/refundApply/refundApply'
      });
    },
    // 商城定义的方法：
    getShopOrderList(last = false) {
      const ret = getOrderList(this.typeShop, this.pageShop, this.pageSizeShop);
      ret.then((value) => {
        this.pageShop = value.data.data.currentPage;
        this.totalPageShop = value.data.data.totalPage;
        const orderList = value.data.data.info;
        orderList.forEach((i, k) => {
          orderList[k].mallState = this.mallState(i);
        });
        if (last) {
          this.ordersAllShop.push(...orderList);
        } else {
          this.ordersAllShop = orderList;
        }
        this.ordersAllShop = this.ordersAllShop.map((order) => {
            const temp = { ...order };
            const refundInfoArr = temp.orderProduct.filter((item) =>(!!item.refund_order_product_info));
            return {
                ...temp,
                isShowRefunds: !!refundInfoArr.length,
            };
        });
      });
    },
    mallState(item) {
      const pay_status = item.pay_status;
      const status = item.status;
      if (pay_status === "0") {
        return {key: 1, value: "待付款"};
      } else if ((pay_status === "1" || pay_status === "2") && (status === "0" || status === "1")) {
        return {key: 2, value: "待收货"};
      } else if (status === "2") {
        return {key: 3, value: "已完成"};
      } else if (pay_status === "3" || pay_status === "4") {
        return {key: 4, value: "已取消"};
      }
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

@itemListTop: {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
}

@itemP: {
  font-size: 28upx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  display: flex;
}

@itemSpan: {
  flex: 1;
  margin-left: 15upx;
  font-size: 28upx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}

@itemBtns: {
  border: 1px solid #fd7600;
  background: #fd7600;
  border-radius: 26upx;
}

@itemBtn: {
  font-size: 28upx;
  font-family: PingFang SC;
  font-weight: 400;
  color: #fd7600;
}
.title-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .title-item{
    position: relative;
    font-size: 26upx;
    color: #666666;
    padding: 0 10upx;
  }
  .title-item:after{
    right: 0;
    top: 50%;
    content: '';
    position: absolute;
    width: 2upx;
    height:24upx;
    background-color: #666666;
    transform: translateY(-50%);
  }
  .title-item:last-of-type:after{
    width: 0;
  }
  .title-item-active{
    font-size: 34upx;
    color: #333333
  }
}
.orderList {
  width: 100%;
  min-height: 100%;
  .itemChoice {
    width: 100%;
    height: 98upx;
    margin-top: 24upx;
    background: rgba(255, 255, 255, 1);
    display: flex;
    align-items: center;
    z-index: 10;

    .itemList {
      position: relative;
      flex:1;
      height: 100%;
      @item();
      flex-wrap: wrap;
      font-size: 28upx;
      color: #666666;
    }
    .item-list-active{
      font-size: 30upx;
      color: #333333;
    }
    .item-list-active:before {
      position: absolute;
      bottom: 12upx;
      left: 50%;
      content: '';
      width: 42upx;
      height: 6upx;
        background: #fd7600;
      border-radius: 3upx;
      transform: translateX(-50%);
    }
  }
  .none{
    display: none;
  }
  .flex {
    display: flex;
  }

  .item_list {
    width: 710upx;
	margin: 24upx 20upx 0 20upx;
	background: #FAFAFA;
    box-shadow: 0 0 15upx 0 rgba(169, 169, 169, 0.2);
    border-radius: 10upx;
	height: fit-content;
    overflow: hidden;
    .item_list_top {
	  padding: 0 24rpx;
      height: 88upx;
      display: flex;
	  background-color: #FFFFFF;
	  justify-content: space-between;

      .top_left {
        flex: 1;
		display: inline-flex;
		align-items: center;
		color: #343434;
		font-size: 36upx;
		font-weight: blod;
		overflow: hidden;
		white-space:nowrap;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 1;
      }

      .top_right {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: flex-end;
        color: #fd7600;
        font-size: 26upx;
      }
    }

    .item_list_center {
	  padding: 0 24rpx;
      .time {
        width: 100%;
		padding-bottom: 27upx;
		padding-top: 24upx;
        @item();
		justify-content: flex-start;

        p {
          @itemP();
        }

        span {
          @itemSpan();
        }
      }

      .address {
        width: 100%;
		padding-bottom: 27upx;
        @item();
		align-items: normal;

        p {
          @itemP();
        }

        span {
          @itemSpan();
        }
      }

      .price {
        width: 100%;
        @item();
		padding-bottom: 30upx;
        p {
          @itemP();
        }

        span {
          @itemSpan();
          display: flex;
          justify-content: flex-start;

          h6 {
            font-size: 0.875rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: #fd7600;
          }
        }
      }
    }

    .item_list_bottom {
	  border-top: 1upx solid rgba(153, 153, 153, 0.2);
      height: 90upx;
      @item();
      justify-content: flex-end;
	  padding: 0 28rpx;
      .firstBtn {
		  padding: 6upx 17upx;
		  min-width: 110upx;
        @itemBtns();
        background: #FFFFFF;
        @item();
        p {
          @itemBtn();
        }
      }

      .secondBtn {
        padding: 6upx 17upx;
		min-width: 110upx;
        @itemBtns();
        @item();
        margin-left: 24upx;
        p {
          @itemBtn();
          color: rgba(255, 255, 255, 1);
        }
      }

      .thrirdBtn {
        padding: 6upx 17upx;
		min-width: 110upx;
        @itemBtns();
        @item();
        margin-left: 24upx;

        p {
          @itemBtn();
          color: rgba(255, 255, 255, 1);
        }
      }
    }
  }
  .item_list:last-of-type{
    margin-bottom: 38upx;
  }
}
</style>

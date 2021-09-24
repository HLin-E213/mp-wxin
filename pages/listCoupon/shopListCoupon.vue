<!--优惠券列表-->
<template>
  <view class="listCoupon" :class="{'global-page': isIPX }">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <!--内容页-->
    <view class="menuTab_content">
      <view class="menuTab_content_list" v-for="(i,k) in couponList" :key="k">
        <image :src="imgUrl" mode=""></image>
        <view class="menuTab_content_list_left">
          <h4 v-if="i.type === '3'">{{ i.coupon_amount }}折</h4>
          <h4 v-else>¥{{i.coupon_amount / 100}}</h4>
          <p>{{i.type == '2'?'满' + i.coupon_limit_amount / 100 + '使用':''}}</p>
        </view>
        <view class="menuTab_content_list_right">
          <h4>{{ typeName(i) }}</h4>
          <h5>{{i.remarks}}</h5>
          <span>{{ showTimeStart(i) }}-{{ showTimeEnd(i) }}</span>
          <button type="primary" @click="useCoupon(i)">使用</button>
        </view>
      </view>
    </view>

    <view class="btn">
      <button type="primary" @click="submitNoUse">不使用优惠券</button>
    </view>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {showDate, showTime} from "../../service";

export default {
  components: {
    uniNavBar,
  },
  data() {
    return {
      title: '优惠券列表',
      tabIdex: 0,
      couponLists: [],
      isIPX:this.$isIPX,
      product_id: 0,
    }
  },
  computed: {
    ...mapState('orders',{
      'couponList':'couponList',
      'activeShopCoupon':'activeShopCoupon',
    }),
    imgUrl() {
      return this.tabIdex === 0 ? 'https://admin.dajxyl.com/oss?path=img/yhqds.png' : 'https://admin.dajxyl.com/oss?path=img/yhqhuise.png'
    },
    typeName(){
      return function({ type }){
        if (type === '1') {
          return '无门槛优惠券';
        }
        if (type === '2') {
          return '满减优惠券';
        }
        if (type === '3') {
          return '折扣优惠券';
        }
      }
    },
    showTimeStart() {
      return function ({use_start_time}) {
        return showDate(use_start_time);
      }
    },
    showTimeEnd() {
      return function ({use_end_time}) {
        return showDate(use_end_time);
      }
    },
  },
  mounted() {
    // console.log(this.couponList);
    // console.log(this.activeShopCoupon);
  },
  onLoad(option){
    this.product_id = option.productId;
  },
  methods: {
    ...mapMutations('orders',{
      'setActiveCoupon':'setActiveCoupon',
    }),
    useCoupon(obj) {
      let bool = false,is_use = true,coupon_is_use = false;
      // 判断此商品是否能使用
      obj.coupon_product_ids.forEach((i,k)=>{
        if (i === this.product_id) {
          is_use = false;
        }
      });
      // 此商品已用过优惠券
      this.activeShopCoupon.forEach((i, k) => {
        if (Number(i.product_id) === Number(this.product_id)) {
          this.activeShopCoupon.forEach((i, k) => {
            if (Number(this.product_id) === Number(i.product_id)) {
              this.activeShopCoupon.splice(k,1);
            }
          });
        }
      });
      // 判断优惠券是否使用过
      this.activeShopCoupon.forEach((i, k) => {
        if (Number(i.coupon_id) === Number(obj.id)) {
          coupon_is_use = true;
        }
      });
      if (is_use) {
        return uni.showToast({
          title: '该商品，不能使用此优惠券！',
          icon: 'none',
          duration: 3000
        });
      }
      if (bool) {
        return uni.showToast({
          title: '该商品，已经使用了优惠券！',
          icon: 'none',
          duration: 3000
        });
      }
      if (coupon_is_use) {
        return uni.showToast({
          title: '此优惠券已经使用过了！',
          icon: 'none',
          duration: 3000
        });
      }
      this.activeShopCoupon.push({
        product_id: parseInt(this.product_id),
        coupon_id: parseInt(obj.id)
      });
      this.$store.commit('orders/setActiveCoupon', this.activeShopCoupon);
      console.log(this.activeShopCoupon);
      return uni.navigateBack({
        delta:1
      })
    },
    //不使用优惠券 点击触发事件 退出当前页 退出并清除记录栈中的缓存
    submitNoUse:function(){
      this.activeShopCoupon.forEach((i, k) => {
        if (Number(this.product_id) === Number(i.product_id)) {
          this.activeShopCoupon.splice(k,1);
        }
      });
      this.$store.commit('orders/setActiveCoupon', this.activeShopCoupon);
      return uni.navigateBack({
        delta:1
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

.listCoupon {
  width: 100%;
  height: 100%;

  .menuTab_content {
    width: 100%;
    // height: 15rem;
    @item();
    flex-wrap: wrap;

    .menuTab_content_list {
      width: 94%;
      height: 5.25rem;
      margin-top: 24upx;
      @item();
      flex-wrap: wrap;

      image {
        width: 94%;
        height: 5.25rem;
         //background:rgba(255,255,255,1);
        border-radius: 0rem 0.5rem 0.5rem 0rem;
        position: absolute;
        z-index: 0;
      }

      .menuTab_content_list_left {
        width: 28%;
        height: 80%;
        @item();
        flex-wrap: wrap;
        margin-left: 2%;
        z-index: 1;

        h4 {
          // width:3.72rem;
          height: 1.125rem;
          font-size: 1rem;
          font-family: PingFang SC;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
        }

        p {
          // width:4.75rem;
          height: 0.91rem;
          font-size: 0.75rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }

      .menuTab_content_list_right {
        width: 70%;
        height: 90%;
        @item();
        flex-wrap: wrap;
        justify-content: flex-start;
        z-index: 1;

        h4 {
          // width:5.25rem;
          height: 1.035rem;
          font-size: 1.065rem;
          font-family: PingFang SC;
          font-weight: 600;
          color: rgba(254, 124, 10, 1);
          margin-left: 5%;
        }

        h5 {
          width: 95%;
          height: 0.75rem;
          font-size: 0.75rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          margin-left: 5%;
          // overflow: hidden;
        }

        span {
          width: 65%;
          // height:0.595rem;
          font-size: 0.75rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(154, 154, 154, 1);
          margin-left: 5%;
        }

        button {
          width: 25%;
          height: 1.315rem;
          background: rgba(253, 124, 10, 1);
          border-radius: 1rem;
          font-size: 0.7rem;
          @item();
        }

        image {
          width: 3.16rem;
          height: 2.69rem;
          position: absolute;
          right: 3%;
          margin-top: -1.2rem;
        }
      }
    }
  }

  .btn {
    width: 100%;
    height: 3rem;
    @item();
    position: fixed;
    bottom: 2.595rem;

    button {
      width: 88%;
      height: 3rem;
      background: #fd7600;
      border-radius: 1.5rem;
      font-size: 1.125rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
    }
  }
}
</style>

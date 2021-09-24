<!--产品详情领取优惠券-->
<template>
  <view class="couponsGet">
    <view class="couponsGet_title">
      <em class="first_col"></em>
      <h4>领取优惠券</h4>
      <em class="second_col"></em>
    </view>
    <view class="coupons_content">
      <view class="coupons_content_list" v-for="(i,k) in list" :key="i.id">
        <image class="coupons-back-img"
            :src="i.is_pick || i.user_is_pick ? 'https://admin.dajxyl.com/oss?path=img/notreceive_bg@2x.png':'https://admin.dajxyl.com/oss?path=img/receive_bg@2x.png'"
            mode="">
			</image>
        <view class="content" @click="gitUpCoupon(k,i)">
          <h4 :style="i.is_pick || i.user_is_pick ? 'color:#999999':''">{{ couponTitle(i) }}</h4>
          <p :style="i.is_pick || i.user_is_pick ? 'color:#999999':''">{{ couponDesc(i) }}</p>
          <span>{{ i.time }}</span>
        </view>
      </view>
    </view>
    <view class="coupons_description">
      <view class="coupons_description_title">
        <em></em>
        <h4>{{ couponText.title }}</h4>
        <em></em>
      </view>
      <view class="coupons_description_bottom">
        <p v-for="(v,k) of couponText.text_list" :key="k">{{ v }}</p>
      </view>
    </view>
  </view>
</template>

<script>
import {couponShopPick,couponPick} from '../../api/index.js';

export default {
  props: {
    couponlist: {
      type: Array,
      default: () => ([])
    },
    couponText: {
      type: Object,
      default: () => ({})
    },
    isShop: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      couponList: this.couponlist,
    }
  },
  computed: {
    couponTitle(){
      return function ({ coupon_amount, coupon_limit_amount, type, remarks }) {
        // if (coupon_limit_amount === undefined) {
        //   return remarks;
        // }
        if (type === '1') {
          return '无门槛优惠券';
        }
        if (type === '2') {
          return '满减优惠券';
        }
        if (type === '3') {
          return '折优惠券';
        }
      }
    },
    couponDesc(){
      return function ({ coupon_amount, coupon_limit_amount, type, remarks, nature }){
        if (coupon_limit_amount === undefined) {
          const [origin, now] = nature;
          if (type === '1') {
            return '立减' + origin + '元';
          } else if (type === '2') {
            return '满' + origin + '减' +  now ;
          } else if (type === '3') {
            return origin * 10 + '折';
          }
        }
        if (type === '1') {
          return '立减' + coupon_amount / 100 + '元';
        }
        if (type === '2') {
          return '满' + coupon_limit_amount / 100 + '减' +  coupon_amount / 100 ;
        }
        if (type === '3') {
          return coupon_amount * 10 + '折';
        }
      }
    },
    list: {
      set: function () {
        return this.couponlist;
      },
      get: function () {
        let arr = [];
        var getTime = function (timestamp) {
          var date = new Date(timestamp * 1000);
          var Y = date.getFullYear() + '.';
          var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
          var D = date.getDate() + ' ';
          return Y + M + D;
        };
        this.couponlist.forEach(function (item) {
          item.time = getTime(item.use_start_time) + '- ' + getTime(item.use_end_time);
        });
        this.couponlist.map((ite, idx) => {
          if (ite.remarks.length > 10) {
            ite.remarks = ite.remarks.slice(0, 10) + '...';
          }
        })
        return this.couponlist;
      }
    }
  },
  methods: {
    /**
     * @desc 领取优惠券
     * @param {Object} k
     */
    gitUpCoupon: function (k, obj) {
      let that = this;
      if (this.isShop) {
        if (obj.user_is_pick) {
          return uni.showToast({
            title: '您已经领取了优惠券！',
            duration: 2000,
            icon: 'none',
            mask: true,
          });
        }
        let res = couponShopPick(obj.code);
        res.then(function (e) {
          obj.user_is_pick = true;
          that.couponlist.splice(k, 1, obj);
        });
      } else {
        let res = couponPick(obj.code);
        res.then(function (e) {
          obj.is_pick = true;
          that.couponlist.splice(k, 1, obj);
        });
      }
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

@emItem: {
  width: 70upx;
  height: 6upx;
  opacity: 0.8;
  border-radius: 3upx;
}

.couponsGet {
	position: relative;
	width: 100%;
  max-height: 900rpx;
	background: rgba(255, 255, 255, 1);
	border-radius: 45upx 45upx 0 0;
	overflow: scroll;

  .couponsGet_title {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 123upx;
		@item();
		z-index: 99999;
		background-color: #ffffff;
    .first_col {
		@emItem();
		background: linear-gradient(270deg, rgba(253, 123, 9, 1) 0%, rgba(255, 255, 255, 0) 100%);
    }

    h4 {
      font-size: 32upx;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      padding: 0 16upx;
    }

    .second_col {
      @emItem();
      background: linear-gradient(90deg, rgba(253, 123, 9, 1) 0%, rgba(255, 255, 255, 0) 100%);
    }
  }

  .coupons_content {
  max-height: 500rpx;
	margin: 0 31upx;
	padding-top: 123upx;
    overflow: scroll;
    .coupons_content_list {
		position: relative;
      width: 688upx;
      height: 168upx;
      @item();
      flex-wrap: wrap;
      margin-top: 26upx;
	  border-radius: 16upx 0 0  16upx;
		.coupons-back-img{
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	}

      .content {
        width: 100%;
        height: 90%;
        z-index: 10;
        @item();
        flex-wrap: wrap;
        justify-content: flex-start;

        h4 {
          width: 100%;
          font-size: 34upx;
          font-family: PingFang SC;
          font-weight: blod;
          color: rgba(253, 123, 9, 1);
          margin-left: 29upx;
		      margin-top: 10upx;
        }

        p {
          width: 100%;
          font-size: 24upx;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(101, 101, 101, 1);
          margin-left: 26upx;
		      margin-top: 5upx;
        }

        span {
          width: 100%;
          font-size: 24upx;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          margin-left: 26upx;
		      margin-top: 5upx;
        }
      }
    }
	.coupons_content_list:nth-of-type(1){
		margin-top: 0;
	}
  }

  .coupons_description {
    .coupons_description_title {
      padding: 59upx 0 31upx 0;
      @item();
      em {
		height:2upx;
		width: 60upx;
		background: #9A9A9A;
		border-radius: 3upx;
      }

      h4 {
        font-size: 30upx;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(101, 101, 101, 1);
        padding: 0 16upx;
      }
    }

    .coupons_description_bottom {
	  padding: 0 31upx;
	  padding-bottom: 49upx;
      p {
        font-size: 24upx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #9A9A9A;
		line-height: 40upx;
      }
    }
  }
}
</style>

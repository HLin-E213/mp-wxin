<!--优惠卡券-->
<template>
  <view class="userCoupon" :class="{'global-page': isIPX }">
    <!--头部组件使用-->
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="search-menu-wrap">
      <!--搜索框-->
      <view class="menuTab_content_exchange">
        <input type="text" value="" placeholder-style="color:#9A9A9A" v-model="codeConpon" placeholder="请输入兑换码"/>
        <view class="exchange-btn" @click="exchangeCode">兑换</view>
      </view>

      <!--菜单tab切换-->
      <view class="userCoupon-menu-wrap">
        <view
            class="userCoupon-menu-item"
            v-for="item in couponType"
            :key="item.value"
            :class="{'userCoupon-menu-item-active': item.value === activeCouponType}"
            @click="switchTab(item)"
        >
          {{ item.label }}
        </view>
      </view>
    </view>
    <!--优惠券使用情况-->
    <view class="menuTab">
      <view class="menuTab-list">
        <view
            class="menuTab-list-item"
            v-for="(i,k) in menuList"
            :key="k"
            @click="handelTab(k)"
            :class="{'menuTab-list-item-active': i.check}"
        >
          {{ i.name }}
        </view>
      </view>
    </view>
    <!--内容页-->
    <view v-if="activeCouponType === 'service'" class="menuTab_content">
      <view
          class="menuTab_content_list"
          v-for="(i,k) in couponLists"
          :key="k"
          :class="{'menuTab_content_list-unuse': tabIdex === 0}"
      >
        <view class="menuTab_content_list_left">
          <h4>¥{{i.money}}</h4>
          <p>{{i.type == 2?'满' + i.overMoney + '使用':''}}</p>
        </view>
        <view class="menuTab_content_list_right">
          <view class="coupon-info" :class="{'cannot-use': tabIdex !== 0}">
            <h4 :style="colorStyle">{{i.typeName}}</h4>
            <h5 :style="colorStyle">{{i.remarks}}</h5>
          </view>
          <view class="coupon-use">
            <span :style="colorStyle">{{i.use_start_date}}-{{i.use_end_date}}</span>
            <view class="use-button" v-if="tabIdex === 0"> 使用</view>
          </view>
          <image class="overdue" src="https://admin.dajxyl.com/oss?path=img/overdue.png" :style="overdue" mode=""></image>
        </view>
      </view>
    </view>
    <view v-if="activeCouponType === 'shop'" class="menuTab_content">
      <view
          class="menuTab_content_list"
          v-for="(i,k) in couponShopLists"
          :key="k"
          :class="{'menuTab_content_list-unuse': tabIdex === 0}"
      >
        <view class="menuTab_content_list_left">
          <h4>¥{{fenToYuan(i.coupon_amount)}}</h4>
          <p>{{i.type == 2?'满' + i.overMoney + '元使用':''}}</p>
        </view>
        <view class="menuTab_content_list_right">
          <view class="coupon-info" :class="{'cannot-use': tabIdex !== 0}">
            <h4 :style="colorStyle">{{i.typeName}}</h4>
            <h5 :style="colorStyle">{{i.remarks}}</h5>
          </view>
          <view class="coupon-use">
            <span :style="colorStyle">{{i.startDate}}-{{i.endDate}}</span>
<!--            <view class="use-button" v-if="tabIdex === 0"> 使用</view>-->
          </view>
          <image class="overdue" src="https://admin.dajxyl.com/oss?path=img/overdue.png" :style="overdue" mode=""></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {mapArr} from '../../service.js';
import { couponList,couponPick } from '../../api/index.js';
import { showDate } from '../../service.js';
import {getCouponShopList} from '../../api/shop/coupon';
import { fenToYuan} from '../../utils/money';
import { couponTypeMap } from '../../config/constant';

export default {
  components: {
    uniNavBar,
  },
  data() {
    return {
      title: '优惠卡券',
      tabIdex: 0,
      menuList: [{name: '未使用', type: 0, check: true}, {name: '已使用', type: 1, check: false}, { name: '已过期', type: 2, check: false }],
      couponLists: [],
      couponShopLists: [],
      shopCouponType: 1, // 类型 默认1:未使用 2:已使用 3:已过期
      page: 1,
      totalPage: 0,
	    codeConpon:'',
      isIPX:this.$isIPX,
      couponType: [
          {
              label: '服务优惠券', value: 'service', // value的内容后期根据接口做调整
          },
          {
              label: '商品优惠券', value: 'shop', // value的内容后期根据接口做调整
          }
      ],
        activeCouponType: 'service'
    }
  },
  computed: {
	...mapState('users',{
	  	'couponUseData':'couponUseData',
	}),
    colorStyle() {
      return this.tabIdex === 0 ? '' : 'color:#9A9A9A'
    },
    overdue() {
      return this.tabIdex === 2 ? '' : 'display:none'
    }
  },
  mounted() {
  	this.couponList();
  	this.couponShopList();
  },
  onPullDownRefresh() {
    this.couponList();
    this.couponShopList();
  },
  methods: {
    ...mapMutations('users',{
      'setCouponUseData':'setCouponUseData',
    }),
      fenToYuan,
	  //点击切换使用状态tab页
    handelTab: function (k) {
      mapArr(this.menuList);
      this.menuList[k].check = !this.menuList[k].check;
      this.tabIdex = this.menuList[k].type;
      this.shopCouponType = this.menuList[k].type + 1;
	    this.couponList();
	    this.couponShopList();
    },
    // 切换优惠券类型  商品 or 服务
    switchTab({ value }) {
      this.activeCouponType = value;
      if (value === 'shop') {
        this.couponShopList();
      }
      if (value === 'service') {
        this.couponList();
      }
    },
    //兑换优惠券
    exchangeCode: function(){
      let that = this;
      if(this.codeConpon !== ''){
        uni.showLoading({
          title:'领取中...'
        })
        let res = couponPick(this.codeConpon);
        res.then(function(){
          that.codeConpon = '';
          uni.hideLoading();
          that.couponList();
        });
        this.couponList();
      }
    },
    //获取全部优惠券数据信息
    couponList: function(){
      let that = this;
      let res = couponList();
      let arr = null;
      that.couponLists = null;
      res.then(function (res) {
        console.log(res);
        if (that.tabIdex === 0) {
          arr = res.data.data.info.not_used;
        }
        if (that.tabIdex === 1) {
          arr = res.data.data.info.used;
        }
        if (that.tabIdex === 2) {
          arr = res.data.data.info.expired;
        }
        // if (arr.length === 0) {
        //   uni.showToast({
        //     title: '暂无数据',
        //     icon: 'none',
        //     duration: 3000
        //   })
        // }
        arr.map((item, index) => {
          //时间戳格式化并重新设置字段保留时间戳以便后期使用时比较是否过期
          Object.assign(item, {use_start_date: showDate(item.use_start_time - 0)});
          Object.assign(item, {use_end_date: showDate(item.use_end_time - 0)});
          switch (item.type) {
            case '1': {
              Object.assign(item, {money: item.nature[0]});
              Object.assign(item, {typeName: '无门槛优惠券'});
              break;
            }
            case '2': {
              Object.assign(item, {money: item.nature[1]});
              Object.assign(item, {overMoney: item.nature[0]});
              Object.assign(item, {typeName: '满减优惠券'});
              break;
            }
            case '3': {
              Object.assign(item, {money: item.nature[0] + '折'});
              Object.assign(item, {typeName: '折扣优惠券'});
              break;
            }
            default:
              break;
          }
          return arr
        })
        that.couponLists = arr;
        uni.stopPullDownRefresh();
      });
    },
    //点击优惠券列表中的单条优惠券获取k值，优惠券数据存在vuex中
    useCoupon:function(k){
      console.log(k)
      this.setCouponUseData(this.couponLists)
    },
    couponShopList() {
      const ret = getCouponShopList(this.shopCouponType, 10, this.page);
      ret.then((value) => {
        console.log(value);
        this.couponShopLists = value.data.data.info.map((coupon) => ({
            ...coupon,
            typeName: couponTypeMap[coupon.type],
            startDate: showDate(coupon.use_start_time),
            endDate: showDate(coupon.use_end_time),
            overMoney: coupon.coupon_limit_amount / 100,
        }));
        this.page = value.data.data.currentPage;
        this.totalPage = value.data.data.totalPage;
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

.userCoupon {
  width: 100%;
  height: 100%;
  .search-menu-wrap{
    padding: 0 20upx;
    padding-top: 40upx;
    background-color: #FFFFFF;
    .menuTab_content_exchange {
      height: 68upx;
      @item();
      input {
        width: 520upx;
        height: 68upx;
        background: #F8F8F8;
        border-radius: 34upx;
        padding: 0 0 0 10px;
        font-size: 26upx;
        text-indent: 10upx;
      }

      .exchange-btn {
        margin-left: 20upx;
        width: 170upx;
        height: 68upx;
        background: #fd7600;
        border-radius: 34upx;
        color: #FFFFFF;
        font-size: 30upx;
        @item();
      }
    }
    .userCoupon-menu-wrap{
      display: flex;
      .userCoupon-menu-item{
        position: relative;
        flex: 1;
        padding-top: 48upx;
        padding-bottom: 33upx;
        font-size: 32upx;
        color: #666666;
        text-align: center;
      }
      .userCoupon-menu-item:before{
        position: absolute;
        content: '';
        top: 50%;
        left: 0;
        height: 30upx;
        width: 2upx;
        background-color: rgba(153, 153, 153, .2);
        transform: translate(-50%);
      }
      .userCoupon-menu-item:first-of-type:before{
        width: 0;
      }
      .userCoupon-menu-item-active{
        color: #FD7600;
      }
      .userCoupon-menu-item-active:after{
        position: absolute;
        content: '';
        bottom: -1upx;
        left: 50%;
        height: 6upx;
        width: 46upx;
        background-color: #fd7600;
        transform: translate(-50%, -50%);
      }
    }
  }

  .menuTab {
    background: #ffffff;
    margin-top: 24rpx;
    .menuTab-list {
      position: relative;
      display: flex;
      padding: 0 20upx ;
      .menuTab-list-item{
        padding: 25upx 0 44upx 0 ;
        flex: 1;
        font-size: 28upx;
        color: #666666;
        text-align: center;
        overflow: hidden;
      }
      .menuTab-list-item-active{
        position: relative;
        font-size: 30upx;
        color: #333333;
      }
      .menuTab-list-item-active:after{
        position: absolute;
        content: '';
        bottom: 0;
        left: 50%;
        width: 20upx;
        height: 20upx;
        border: 2upx solid #fd7600;
        transform: translate(-50%, 50%) rotate(45deg);
        background-color: #ffffff;
        z-index: 999;
      }
    }
    .menuTab-list:after {
      position: absolute;
      content: '';
      bottom: 1rpx;
      left: 0;
      width: 100%;
      height: 2upx;
      background-color: #fd7600;
    }
  }

  .menuTab_content {
    width: 100%;
    .menuTab_content_list {
      margin: 26upx 29upx 24upx 33upx;
      height: 168upx;
      width: 688upx;
      background-image: url("https://admin.dajxyl.com/oss?path=img/yhqhuise.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      @item();

      .menuTab_content_list_left {
        display: flex;
        width: 210upx;
        flex-direction: column;
        justify-content: center;
        font-family: PingFang SC;
        text-align: center;
        h4 {
          font-size: 48upx;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
        }
        p {
          font-size: 30upx;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
        }
      }

      .menuTab_content_list_right {
        position: relative;
        flex: 1;
        height: 100%;
        font-family: PingFang SC;
        .coupon-info{
          padding: 22upx 24upx 11upx 30upx;
          border-bottom: 1px dashed  rgba(253, 124, 9, .3);
          h4 {
            font-size: 34upx;
            font-weight: 600;
            color: rgba(254, 124, 10, 1);
            line-height: 33upx;
          }
          h5 {
            padding-top: 15upx;
            font-size: 24upx;
            line-height: 24upx;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
          }
        }
        .cannot-use{
          border-bottom: 1px solid rgba(153, 153, 153, .3);
        }
        .coupon-use{
          padding: 6upx 24upx 0 30upx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            font-size: 0.75rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(154, 154, 154, 1);
          }
          .use-button{
            display: flex;
            width: 100upx;
            height: 42upx;
            background: #FD7C09;
            border-radius: 21upx;
            justify-content: center;
            align-items: center;
            font-size: 24upx;
            font-weight: 500;
            color: #FFFFFF;
          }
        }
        .overdue{
          width: 3.16rem;
          height: 2.69rem;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
    .menuTab_content_list-unuse {
      background-image: url("https://admin.dajxyl.com/oss?path=img/yhqds.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
}
</style>

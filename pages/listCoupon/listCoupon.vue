<!--优惠券列表-->
<template>
  <view class="listCoupon" :class="{'global-page': isIPX }">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <!--内容页-->
    <view class="menuTab_content">
      <view class="menuTab_content_list" v-for="(i,k) in couponLists" :key="k">
        <image :src="imgUrl" mode=""></image>
        <view class="menuTab_content_list_left">
          <h4>¥{{i.money}}</h4>
          <p>{{i.type == 2?'满' + i.overMoney + '使用':''}}</p>
        </view>
        <view class="menuTab_content_list_right">
          <h4>{{i.typeName}}</h4>
          <h5>{{i.remarks}}</h5>
          <span>{{i.use_start_date}}-{{i.use_end_date}}</span>
          <button v-if="i.is_used" type="primary" :style="exchange" @click="useCoupon(k)">使用</button>
<!--          <button v-else="i.is_used" type="primary" :style="exchange" disabled>不可使用</button>-->
          <!-- <image src="https://admin.dajxyl.com/oss?path=img/overdue.png" :style="overdue" mode=""></image> -->
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
import { couponList } from '../../api/index.js';
import { showDate } from '../../service.js';

export default {
  components: {
    uniNavBar,
  },
  data() {
    return {
      title: '优惠券列表',
      tabIdex: 0,
      couponLists: [],
      serviceID:'',
        isIPX:this.$isIPX,
    }
  },
  computed: {
	  ...mapState('users',{
		  'couponUseData':'couponUseData',
	  }),
    // imgUrl(){ return this.tabIdex == 0?'https://admin.dajxyl.com/oss?path=img/youhuiquandise@2x.png':'https://admin.dajxyl.com/oss?path=img/youhuiquandise2@2x.png' },
    imgUrl() {
      return this.tabIdex == 0 ? 'https://admin.dajxyl.com/oss?path=img/yhqds.png' : 'https://admin.dajxyl.com/oss?path=img/yhqhuise.png'
    },
  },
  onLoad(option) {
    this.serviceID = option.serviceID;
  },
  onPullDownRefresh() {
    this.couponList();
    setTimeout(function () {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  mounted() {
  	this.couponList();
  },
  methods: {
	  ...mapMutations('users',{
		  'setCouponUseData':'setCouponUseData',
	  }),
	  //获取我的优惠券列表中未使用的优惠券数据
	  couponList: function(){
		  let res = couponList(),that=this;
		  res.then(function(res){
        let arr = res.data.data.info.not_used;
        arr.map((item,index)=>{
          // 无法使用的优惠券
          if (item.serviceIDs.indexOf(that.serviceID) !== -1) {
            console.log(item.serviceIDs,that.serviceID);
            console.log(item);
            Object.assign(item,{is_used:true});
          } else {
            Object.assign(item,{is_used:false});
          }
          //时间戳格式化并重新设置字段保留时间戳以便后期使用时比较是否过期
          Object.assign(item,{use_start_date:showDate(item.use_start_time-0)});
          Object.assign(item,{use_end_date:showDate(item.use_end_time-0)});
          switch (item.type){
            case '1':{
              Object.assign(item,{money:item.nature[0]});
              Object.assign(item,{typeName:'无门槛优惠券'});
              break;
            }
            case '2':{
              Object.assign(item, {money: item.nature[1]});
              Object.assign(item, {overMoney: item.nature[0]});
              Object.assign(item,{typeName:'满减优惠券'});
              break;
            }
            case '3':{
              Object.assign(item,{money: item.nature[0] + '折'});
              Object.assign(item,{typeName:'折扣优惠券'});
              break;
            }
            default:
              break;
          }
          that.couponLists = arr;
          return arr
        })
      });
	  },
	  //点击优惠券列表中的单条优惠券获取k值，优惠券数据存在vuex中
	  useCoupon:function(k){
		  this.setCouponUseData(this.couponLists[k]);
      return uni.navigateBack({
        delta:1
      })
	  },
	  //不使用优惠券 点击触发事件 退出当前页 退出并清除记录栈中的缓存
	  submitNoUse:function(){
      this.setCouponUseData(null);
		  return uni.navigateBack({
		  	delta:1
		  })
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
        // background:rgba(255,255,255,1);
        border-radius: 0rem 0.5rem 0.5rem 0rem;
        position: absolute;
        z-index: -1;
      }

      .menuTab_content_list_left {
        width: 28%;
        height: 80%;
        display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
        flex-wrap: wrap;
        margin-left: 2%;

        h4 {
          font-size: 48rpx;
          font-family: PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
        }

        p {
          font-size: 30rpx;
          font-family: PingFang SC;
          color: #FFFFFF;
        }
      }

      .menuTab_content_list_right {
        width: 70%;
        height: 90%;
        @item();
        flex-wrap: wrap;
        justify-content: flex-start;

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

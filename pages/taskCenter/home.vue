<template>
	<layout
  title="任务中心"
  :showFooter="false"
  contentBackgroundColor="#FFFFFF"
  >
		<div class="task-center-page">
      <div class="suc-wrap">
        <p class="suc-tip" v-if="signStatus === SIGN_STATUS.HAS_SUCCESS">
          今日已签到
        </p>
        <p class="suc-tip" v-if="signStatus === SIGN_STATUS.SUCCESS">
          签到成功<span class="suc-tip_sub">,恭喜您获得</span>
        </p>
        <p class="suc-tip" v-if="signStatus === SIGN_STATUS.FAILURE">
          签到失败
        </p>
        <div class="sign-failure" v-if="signStatus === SIGN_STATUS.FAILURE">
          <button class="sign-failure-btn" @click="sign()">立即签到</button>
        </div>
        <div class="sign-reward" v-else>
          <img
           class="sign-reward-icon"
           src="https://admin.dajxyl.com/oss?path=video/upload/202108/gold-icon.png"
           alt=""
           >
          <span class="sign-reward-add">+</span>
          <span class="sign-reward-text">{{signGold}}</span>
        </div>
        <p class="total-gold" @click=toDetail()>
          可使用金币
           <span class="amount">{{canUseGold}}</span>
           <span class="spread">|</span>
          可折现
           <span class="amount">{{canUseGoldMoney}}</span>
           元
        </p>
        <div class="rule" @click="openRule()">
          <img
           src="https://admin.dajxyl.com/oss?path=video/upload/202108/rule-word-icon.png"
           alt=""
           class="icon"
           >
           规则
        </div>
      </div>
     <div class="calendar-wrap">
       <div class="title">
         <p class="desc">签到日历</p>
         <p class="month" @click="showPopup = !showPopup">
         {{month}}
         <img
          src="https://admin.dajxyl.com/oss?path=video/upload/202108/sign-arrow-down.png"
          alt=""
          class="down"
          :class="{up: showPopup}"
          >
        </p>
       </div>
       <div class="calendars">
         <div
          v-for="(item) in calendars"
          :key="item.day"
          class="calendars-item"
         >
          <img class="calendars-item-img" v-if="item.integral" src="https://admin.dajxyl.com/oss?path=video/upload/202108/sign-reward-icon.png" alt="">
          <p
              class="calendars-item-text"
              :class="{'calendars-item-text-active': item.is_sign_in && today == item.day}"
              v-else>
            {{item.day}}
          </p>
          <img class="calendars-item-suc-img"  v-if="item.is_sign_in" src="https://admin.dajxyl.com/oss?path=video/upload/202108/sign-suc-icon.png" alt="">
        </div>
       </div>
     </div>
    </div>
    <WPicker
      :visible.sync="showPopup"
      :startYear="startYear"
      :endYear="endYear"
      :value="month"
     @confirm="change"
     @cancel="close"
     fields="month"
     />
     <uniPopup
         ref="ruleRef"
         :maskClick="mask"
         type="center"
     >
     <div class="rule-detail-wrap">
       <p class="rule-detail-title">活动规则</p>
       <img @click="closeRule()" class="rule-detail-wrap-icon" src="https://admin.dajxyl.com/oss?path=img/guanbi-2@2x.png" alt="">
       <p class="modal-tip-desc">
         <text class="rule-des">
           {{ruleDesc}}
         </text>
       </p>
       <button class="rule-detail-button" @click="closeRule()">知道了</button>
     </div>
     </uniPopup>
	</layout>
</template>

<script>
  import layout from '@/components/layout/index.vue';
  import { showDate, TIME_TYPE } from '../../service.js';
  import { signIn, getSingInCalenda, getUserSignInData } from '@/api/index.js';
  import { VOICE_SOURCE } from '@/config/constant';
  import WPicker from './components/w-picker/index';
  import uniPopup from '@/components/uni-popup/uni-popup.vue';

  const SIGN_STATUS = {
    SUCCESS: 'SUCCESS', // 成功
    FAILURE: 'FAILURE', // 失败
    HAS_SUCCESS: 'HAS_SUCCESS', // 已经签到成功了
  }
	export default {
    name: 'task-center-home',
    components: {
      layout,
      WPicker,
      uniPopup,
    },
    onLoad() {
      this.getUserSignInData();
    },
		data() {
      const RANGE = 10; // 年限范围 上下十年
      const curYearMonth = showDate(new Date().valueOf(),TIME_TYPE.MILLI_SECOND, '-', 'YYYYMM');
      const [year, month] = curYearMonth.split('-');
      const curYear=Number(year);
			return {
        SIGN_STATUS,
			  today: new Date().getDate(),
				month: curYearMonth,
        showPopup: false,
        startYear: curYear - RANGE,
        endYear: curYear + RANGE,
        calendars: [],
        userSignInData: {},
        signGold: '',
        canUseGold: '',
        canUseGoldMoney: '',
        ruleDesc: '',
        signStatus: '',
			}
		},
		methods: {
      async getUserSignInData(isFirst = true) {
        try {
          uni.showLoading({title: '加载中，请稍后'});
          const res = await getUserSignInData();
          this.userSignInData = res.data.data.info || {};
          const { sign_in_info, user_integral, rule_desc } = this.userSignInData;
          this.ruleDesc = rule_desc;
          const { integral, is_sign_in } = sign_in_info || {};
          if (isFirst && is_sign_in) {
            this.signStatus = SIGN_STATUS.HAS_SUCCESS;
          }
          this.signGold = integral;
         const { integral: canUseGold, integral_money: canUseGoldMoney } = user_integral || {};
         this.canUseGold = canUseGold;
         this.canUseGoldMoney = canUseGoldMoney;
          // 没有签到，进行签到处理
          if (!is_sign_in) {
            await this.sign();
          }
          this.getCalendar();

        } finally{
          uni.hideLoading();
        }
      },
      close() {
        this.showPopup = false;
      },
      change(e) {
        this.month = e.value;
        this.getCalendar();
      },
      async sign() {
        const innerAudioContext = uni.createInnerAudioContext();
        try {
          await signIn();
          innerAudioContext.src = VOICE_SOURCE.SUC;
          this.signStatus = SIGN_STATUS.SUCCESS;
          this.getUserSignInData(false);
        } catch (e) {
          innerAudioContext.src = VOICE_SOURCE.FAIL;
          this.signStatus = SIGN_STATUS.FAILURE;
        }
        innerAudioContext.play();
      },
      openRule() {
        this.$refs.ruleRef.open();
      },
      closeRule() {
        this.$refs.ruleRef.close();
      },
      toDetail() {
        uni.navigateTo({
          url: '/pages/taskCenter/detail',
        });
      },
			async getCalendar() {
       const res = await getSingInCalenda(this.month);
       this.calendars = res.data.data.info.sign_in_calendar || [];
      },
		}
	}
</script>

<style lang="less" scoped>
  .rule-detail-wrap{
    padding: 55rpx 0 60rpx 0;
    margin: 0 auto;
    width: 620rpx;
    height: auto;
    position: relative;
    background-color: #FFFFFF;
    border-radius: 10rpx;
    .rule-detail-title{
      padding: 0 0 52rpx 0;
      font-size: 40rpx;
      font-weight: bold;
      color:#292929;
      text-align: center;
    }
    .rule-detail-wrap-icon{
      position: absolute;
      top: 21rpx;
      right: 21rpx;
      width: 30rpx;
      height: 30rpx;
    }
    .modal-tip-desc{
      padding: 0 41rpx 52rpx;
      font-size: 28rpx;
      color: #666666;
      .rule-des{
        color: #666666;
        line-height: 48rpx;
      }
    }
    .rule-detail-button{
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px auto 0 auto;
      width: 466rpx;
      height: 72rpx;
      background: #FD7C09;
      border-radius: 36rpx;
      font-weight: 500;
      color: #FFFFFF;
      color:  30rpx;
    }
  }
  .task-center-page{
    position: relative;
    background-color: #FFFFFF;
    min-height: 100%;
    .suc-wrap{
      position: relative;
      width: 100vw;
      height: 362rpx;
      background-image: url("https://admin.dajxyl.com/oss?path=video/upload/202108/sign-suc-bg@.png");
      background-size: 100% 100%;
      .rule{
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        right: 0;
        top: 41rpx;
        width: 118rpx;
        height: 52rpx;
        background-color: #FFF;
        font-size: 24rpx;
        color: #FD7C09;
        border-radius: 25rpx 0px 0px 27rpx;
        .icon{
          width: 24rpx;
          height: 24rpx;
          margin-right: 7rpx;
        }
      }
      .suc-tip{
        padding-top: 78rpx;
        text-align: center;
        font-size: 40rpx;
        font-weight: bold;
        color: #FFF;
        .suc-tip_sub{
          font-size: 24rpx;
          font-weight: normal;
        }
      }
      .sign-reward{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 27rpx;
        color: #FFF;
        &-icon{
          width: 86rpx;
          height: 86rpx;
        }
        &-add {
          font-size: 42rpx;
        }
        &-text {
          font-size: 50rpx;
        }
      }
      .sign-failure{
        margin-top: 35rpx;
        .sign-failure-btn{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 220rpx;
          height: 72rpx;
          background-color: #FFFFFF;
          border-radius: 36rpx;
          font-size: 30rpx;
          font-weight: 500;
          color: #FD7C09;
        }
      }
      .total-gold{
        text-align: center;
        margin-top: 25rpx;
        font-size: 26rpx;
        color: #FFF;
        .amount{
          font-weight: bold;
        }
        .spread{
          padding: 0 10rpx;
        }
      }
    }
    .calendar-wrap{
      transform:translateY(-37rpx);
      .title{
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #FFF5ED;
        border-radius: 40rpx 40rpx 0 0;
        color:#333333;
        height: 110rpx;
        padding: 0 20rpx;
        .desc{
          position: relative;
          font-size: 34rpx;
          padding-left: 20rpx;
        }
        .desc::before{
          position: absolute;
          content: '';
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 6rpx;
          height: 32rpx;
          background: #FD7C09;
          border-radius: 3rpx;
        }
        .month{
          display: flex;
          align-items: center;
          font-size: 30rpx;
          .down{
            width: 24rpx;
            height: 24rpx;
            margin-left: 10rpx;
          }
          .up{
            transform: rotate(180deg);
          }
        }
      }
      .calendars {
        display: flex;
        flex-wrap: wrap;
        .calendars-item{
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 107rpx;
          height: 100rpx;
          &-img{
            width: 50rpx;
            height: 50rpx;
          }
          &-text{
            color: #333333;
            font-size: 34rpx;
            font-weight: bold;
          }
          &-text-active{
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 34rpx;
            font-weight: bold;
            width: 50rpx;
            height: 50rpx;
            background: linear-gradient(0deg, #FB2012 0%, #FC7B09 100%);
            border-radius: 50%;
          }
          &-suc-img{
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 20rpx;
            height: 20rpx;
          }
        }
      }
    }
   }

</style>

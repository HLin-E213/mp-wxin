<template>
  <Layout
      :title="title"
      :showFooter="!showPopup && !showRefundPopup"
      :footerHeight="136"
  >
    <div class="join-active-page-wrap">
      <img
          class="bill-bg-top"
          src="http://dev.admin.dajxyl.com/oss?path=img/9da7f4dff36b8b864f3743903e4c7f4.png"
          alt="">
      <div class="bill-content-wrap">
        <div class="active-rule-wrap">
          <div class="active-rule" @click="openRulePopup">
            <img class="active-rule_icon" src="../../static/rule-icon@2x.png" alt="">
            <p class="active-rule_text">活动规则</p>
          </div>
        </div>
        <div class="title-wrap">
          <div class="title">
            {{detail.title || ''}}
            <img class="hot-icon" src="https://admin.dajxyl.com/oss?path=video/upload/202108/hot@2x.png" alt="">
          </div>
        </div>
        <p class="dead-line-wrap" v-if="!isEnlist && remainTime">
          报名截止倒计时：
          <span class="time-block">{{ remainTime.d }}</span>天
          <span class="time-block">{{ remainTime.h }}</span>小时
          <span class="time-block">{{ remainTime.m }}</span>分
          <span class="time-block">{{ remainTime.s }}</span>秒
        </p>
        <div v-if="isEnlist">
          <p class="enlist-total">{{ detail.enlist || '' }}</p>
          <p class="enlist-desc">已报名(人)</p>
        </div>
        <div class="join-info">
          <JoinItem
              v-if="isCheck"
              label="报名截止日期"
              :val="registrationFormat"
          />
          <JoinItem
              label="活动开始时间"
              :val="startTimeFormat"
          />
          <JoinItem
              label="活动结束时间"
              :val="endTimeFormat"
          />
          <JoinItem
              label="活动地址"
          >
            <div class="active-address-wrap">
              <p>{{detail.place && detail.place[0]}}</p>
            </div>
          </JoinItem>
          <JoinItem
              v-if="isCheck"
              label="报名人数"
              :val="detail.more.participants + '人'"
              valueColor="#333333;"
          />
          <JoinItem
              v-if="isCheck"
              label="联系人姓名"
              :val="detail.more && detail.more.name"
              valueColor="#333333;"
          />
          <JoinItem
              v-if="isCheck"
              label="联系人电话"
              :val="detail.more.phone"
              valueColor="#333333;"
          />
          <JoinItem
              v-if="isCheck && orderStatusMoney == 1"
              label="总金额"
              :val="showCheckMoney"
              valueColor="#333333;"
          />
          <JoinItem
              v-if="isCheck && orderStatusMoney != 1"
              label="退款金额"
              :val="showCheckMoney"
              valueColor="#333333;"
          />
          <JoinItem
              v-if="isCheck && orderStatusMoney != 1"
              label="退款方式"
              val="微信"
              valueColor="#333333;"
          />
          <JoinItem
              v-if="isAdd"
              label="报名费"
              :val="money"
              unit="人"
          />
          <JoinItem
              v-if="isAdd"
              label="报名人数"
              :val="participants"
              :info="detail"
              valKey="participants"
              @onChange="onChange"
              @onVerify="onVerify"
              inputType="number"
              type="input"
              placeholder="请输入报名人数"
          />
          <JoinItem
              v-if="isAdd"
              label="联系人姓名"
              :val="name"
              valKey="name"
              type="input"
              maxlength="10"
              :showEditIcon="isAdd"
              @onChange="onChange"
              @onVerify="onVerify"
              placeholder="请输入联系人姓名"
          />
          <JoinItem
              v-if="isAdd"
              label="联系人电话"
              :val="phone"
              :showEditIcon="isAdd"
              @onChange="onChange"
              valKey="phone"
              maxlength="11"
              inputType="number"
              @onVerify="onVerify"
              type="input"
              placeholder="请输入联系人电话号码"
          />
          <JoinItem
              v-if="isAdd"
              label="支付方式"
              type="pay"
          />
        </div>
        <div
            class="remark-wrap"
            v-if="isAdd || (isCheck && orderStatusMoney == 1 && detail.more && detail.more.remark)">
          <p class="remark-title">备注</p>
          <div class="textarea-wrap">
            <textarea
                auto-height
                :disabled="isCheck"
                v-model="remark"
                :maxlength="50"
                placeholder="请输入备注信息（可不填）"
                placeholder-style	="color: #999999;font-size: 26rpx"
                class="textarea"
            ></textarea>
            <div class="count" v-if="isAdd">{{count}}/50</div>
          </div>
        </div>
        <div class="my-join-info-wrap refund-join-info-wrap">
          <JoinItem
              v-if="isCheck && orderStatusMoney != 1"
              label="退款原因"
              :val="detail.more.order_refund_message"
              valueColor="#333333;"
          >
            <div
                class="textarea-wrap"
                v-if="isCheck && orderStatusMoney != 1 && detail.more && detail.more.order_refund_remarks"
            >
            <textarea
                auto-height
                :disabled="isCheck"
                v-model="detail.more.order_refund_remarks"
                :maxlength="50"
                placeholder="请输入备注信息（可不填）"
                placeholder-style	="color: #999999;font-size: 26rpx"
                class="textarea"
            ></textarea>
            </div>
          </JoinItem>
        </div>
      </div>
    </div>
    <div slot="footer" class="button-wrap" style="width: 100%; height: 100%;background-color: #ffffff">
      <div class="footer-text-btn-wrap" v-if="isAdd">
        <p class="footer-text-btn-wrap-total">
          <span>总计：</span>
          <span
            class="footer-text-btn-wrap-total-amount"
          >￥{{ totalMoney }}</span>
        </p>
        <button
            type="primary"
            class="button submit-btn"
            :disabled="disabledJoinBtn"
            :class="{'disabled' : disabledJoinBtn}"
            @click="handleSubmit"
        >提交</button>
      </div>
      <div
          class="footer-text-btn-wrap"
          v-if="isCheck && orderStatusMoney == 1">
        <button
            class="button change-button"
            @click="toChangeOrder"
        >修改订单</button>
        <button
            type="primary"
            class="button refund-button"
            @click="openRefundPopup"
        >退款</button>
      </div>
      <button
          v-if="isCheck && orderStatusMoney == 2"
          type="primary"
          class="button disabled"
          @click="openRefundPopup"
      >退款中</button>
      <button
          v-if="isCheck && orderStatusMoney == 3"
          type="primary"
          class="button disabled"
          disabled
      >退款失败</button>
      <button
          v-if="isCheck && orderStatusMoney == 4"
          type="primary"
          class="button disabled"
          disabled
      >已退款</button>
    </div>
    <uni-popup ref="popup" type="bottom" @change='changePopup'>
      <view class="popupView">

        <view class="popupReason">
          <view class="popupClose">
            <img src="https://admin.dajxyl.com/oss?path=img/close_popup.png" alt="关闭">
          </view>
          <view class="popupReason-body">
            <view class="popupReason-body-title" @click="closePopup">
              <img class="title-img-left" src="https://admin.dajxyl.com/oss?path=img/14591@2x.png" alt="">
              <p class="title-p">活动规则</p>
              <img class="title-img-right" src="https://admin.dajxyl.com/oss?path=img/14592@2x.png" alt="">
            </view>
            <view class="popupReason-body-tip">
              <text class="tip-p">{{detail.text_1}}</text>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="refundPopupRef" type="bottom" @change='changeRefundPopup'>
      <view class="popupView">

        <view class="popupReason">
          <view class="popupClose">
            <img src="https://admin.dajxyl.com/oss?path=img/close_popup.png" alt="关闭">
          </view>
          <view class="popupReason-body">
            <view class="popupReason-body-title" @click="closeRefundPopup">
              <img class="title-img-left" src="https://admin.dajxyl.com/oss?path=img/14591@2x.png" alt="">
              <p class="title-p">退款</p>
              <img class="title-img-right" src="https://admin.dajxyl.com/oss?path=img/14592@2x.png" alt="">
            </view>
            <view class="popupReason-body-tip">
              <div class="refund-reason-wrap">
                <p class="refund-reason-title">退款原因</p>
                <div class="refund-reason-select" v-if="refundList.length">
                  <xfl-select
                      :list="refundList"
                      :clearable="false"
                      :showItemNum="5"
                      :listShow="false"
                      :disabled="order_refund_message"
                      :isCanInput="false"
                      :style_Container="'height: 80rpx; background: #F8F8F8; border-radius: 10rpx; font-size: 26rpx; border: none'"
                      placeholder="请选择退款原因"
                      :initValue="order_refund_message"
                      :selectHideType="'hideAll'"
                      @change="selectRefundReason"
                  >
                  </xfl-select>
                </div>
              </div>
              <p class="refund-textarea-remark" :class="{'require': isRequireRemark}">备注</p>
              <div class="textarea-wrap refund-textarea">
                  <textarea
                      auto-height
                      placeholder-class="refund-placeholder"
                      v-model="refundRemark"
                      :maxlength="50"
                      placeholder="请输入备注信息（可不填）"
                      placeholder-style	="color: #999999!important;font-size: 26rpx!important"
                      class="textarea"
                  ></textarea>
                <div class="count">{{refundCount}}/50</div>
              </div>
            </view>
          </view>
          <view class="popupReason-sub">
            <button
                class="popupReason-sub-btn"
                :disabled="disabledJRefundBtn"
                @click="submitReason"
                :class="{'disabled': disabledJRefundBtn}"
            >提交</button>
          </view>
        </view>
      </view>
    </uni-popup>
  </Layout>

</template>

<script>
import Layout from "@/components/layout/index.vue";
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import xflSelect from './components/xfl-select/xfl-select.vue';
import JoinItem from './join-item'
import { getActiveDetail, joinActive, OrderRefund, getUserInfo } from "../../api";
import { showTime } from "../../service";
import { fenToYuan } from '@/utils/money';
import countDown from '@/mixins/countDown.js';

export default {
  name: "joinActive",
  components: {
    Layout,
    JoinItem,
    uniPopup,
    xflSelect,
  },
  data() {
    return {
      detail: {},
      remark: '',
      refundList: [],
      refundRemark: '',
      isRequireRemark: false,
      name: '',
      age: '',
      phone: '',
      endTime: '',
      startTime: '',
      remainTime: false,
      verifyname: false,
      verifyparticipants: true,
      verifyphone: false,
      type: 'add',
      showPopup: false,
      showRefundPopup: false,
      order_refund_message: '',
      inputRefundMsg: '',
      participants: 1,
    };
  },
  mixins: [countDown],
  computed: {
    count() {
      return this.remark.length;
    },
    title() {
      const refundFlag = this.orderStatusMoney || ''
      let title = '活动报名';
      if (this.isAdd) {
        title = '活动报名';
      } else if (this.isCheck) {
        title = '报名详情';
        if (refundFlag == 2 || refundFlag == 3 || refundFlag == 4) {
          title = '退款详情';
        }
      }
      return title;
    },
    orderStatusMoney() {
      return this.detail.more && this.detail.more.order_status_money;
    },
    showCheckMoney() {
      let result = '';
      const { more = {} } = this.detail;
      if (more && more.order_amount) {
        result = '￥' + fenToYuan(Number(this.detail.more.order_amount));
      }
      return result;
    },
    totalMoney() {
      let total = 0
      if (this.detail.present_price && this.participants) {
        total = Number(this.detail.present_price) / 100 * Number(this.participants);
      }
      return total
    },
    refundCount() {
      return this.refundRemark.length;
    },
    isCheck() {
      return this.type === 'check';
    },
    isAdd() {
      return this.type === 'add';
    },
    isEnlist() {
      return parseInt(this.detail.is_enlist) > 0; // 是否报名
    },
    startTimeFormat() {
      return this.detail.start_time && showTime(this.detail.start_time, '-');
    },
    endTimeFormat() {
      return this.detail.end_time && showTime(this.detail.end_time, '-');
    },
    registrationFormat() {
      return this.detail.registration_end_time && showTime(this.detail.registration_end_time, '-');
    },
    money() {
      return this.detail.present_price && fenToYuan(this.detail.present_price);
    },
    disabledJoinBtn() {
      return !(this.verifyname && this.verifyparticipants && this.verifyphone);
    },
    disabledJRefundBtn() {
      let flag = true;
      const hasReason = this.inputRefundMsg.length > 0;
      const hasRemark = this.refundRemark.trim().length > 0;
      if (!this.isRequireRemark) {
        flag = !hasReason;
      } else {
        flag = !(hasReason && hasRemark);
      }
      return flag;
    }
  },
  onLoad(options) {
    const { aid, type = 'add' } = options;
    this.aid = aid;
    this.type = type;
    this.getDetail();
    this.getUserInfo();
  },
  onShow() {
    this.getDetail();
  },
  methods: {
    async getUserInfo(){
     const res = await getUserInfo();
     this.phone = res.data.data.info.phone;
     this.name = res.data.data.info.nickname;
    },
    async submitReason() {
      if (!this.detail.more.order_id) {
        return uni.showToast({
          title: '请选择退款原因！',
          duration: 2000
        });
      }
      if (this.isRequireRemark && !this.refundRemark) {
        return uni.showToast({
          title: '请输入备注！',
          duration: 2000
        });
      }
      try{
        uni.showLoading({title: '数据加载中，请稍后'});;
        await OrderRefund(this.detail.more.order_id, this.refundRemark, this.inputRefundMsg);
        uni.showToast({
          title: '退款申请成功！',
          duration: 2000
        });
        this.closeRefundPopup();
        this.closePopup();
        this.getDetail();
      } finally {
        uni.hideLoading();
      }
    },
    selectRefundReason({ newVal }){
      this.isRequireRemark = newVal.indexOf('其他') >= 0;
      this.inputRefundMsg = newVal;
    },
    back() {
      uni.navigateBack({
        delta:1
      });
    },
    async getDetail() {
      uni.showLoading({title: '数据加载中，请稍后'});;
      try {
        const res = await getActiveDetail(this.aid);
        this.detail = res.data.data.info;
        if (this.isCheck) {
          this.refundList = this.detail.more.activity_refund_text;
          this.order_refund_message = this.detail.more.order_refund_message;
          this.remark = this.detail.more.remark;
        }
        this.endTime = this.detail.end_time * 1000;
        this.startTime = this.detail.start_time * 1000;
        this.remainTime = this.countDown(this.detail.registration_end_time, new Date().valueOf() / 1000, 'customer');
        this.getCountDown();
      } finally {
        uni.hideLoading();
      }
    },
    async handleSubmit() {
      const vm = this;
      uni.showLoading({title: '数据加载中，请稍后'});;
      try {
        const res = await joinActive(this.aid, this.name, this.participants, this.phone, this.remark);
        uni.hideLoading();
        const pay_info = res.data.data.info.pay_info;
        uni.requestPayment({
          provider: 'wxpay',
          timeStamp: pay_info.timeStamp,
          nonceStr: pay_info.nonceStr,
          package: pay_info.package,
          signType: pay_info.signType,
          paySign: pay_info.paySign,
          success: function () {
            uni.showToast({
              title: '支付成功！',
              duration: 2000
            });
            vm.getDetail();
            vm.type = 'check';
            return uni.navigateTo({
              url: '/components/statusPayment/statusPayment?state=0&type=1&pageFrom=active'
            });
          },
          fail: function () {
            return uni.showToast({
              title: '支付失败，请重新提交并支付',
              duration: 2000,
              icon: 'none',
              mask: true,
            });
          }
        });
      } finally {
        uni.hideLoading();
      }
    },
    onVerify(key, isVerify) {
      this[`verify${key}`] = isVerify;
    },
    onChange(key, val) {
      this[key] = val;
    },
    changePopup({show}) {
      this.showPopup = show;
    },
    closePopup(){
      this.$refs.popup.close();
    },
    openRulePopup(){
      this.$refs.popup.open();
    },
    changeRefundPopup({show}) {
      this.showRefundPopup = show;
    },
    closeRefundPopup(){
      this.$refs.refundPopupRef.close();
    },
    openRefundPopup(){
      this.$refs.refundPopupRef.open();
      if (!this.refundRemark) {
        this.refundRemark='请输入备注信息（可不填）';
        let timeId=setTimeout(()=>{
          this.refundRemark='';
          clearTimeout(timeId);
        },100);
      }
    },
    toChangeOrder() {
      uni.navigateTo({
        url: '/pages/oldWorldPackage/changeActive?aid=' + this.aid,
      });
    },
    getCountDown() {
      this.setTimer(1, () => {
        this.remainTime = this.countDown(this.detail.registration_end_time, new Date().valueOf() / 1000, 'customer');
        this.getCountDown();
      })
    }
  },
}
</script>

<style scoped lang="less">
.join-active-page-wrap{
  position: relative;
  min-height: calc(100vh - 136rpx);
  .bill-bg-top{
    width: 100%;
    height: 345rpx;
  }
  .bill-content-wrap{
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 481rpx);
    background-image: url("http://dev.admin.dajxyl.com/oss?path=img/998850b73f14f6c878ae29c7c5782af.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin-top: -20rpx;
    padding-bottom: 15rpx;
  }
  .choose-wrap-back {
    position: fixed;
    top: calc(40rpx + var(--status-bar-height));
    left: 20rpx;
    width: 18rpx;
    height: 32rpx;
    padding: 20rpx;
    z-index: 10;
  }
  .active-rule-wrap {
    text-align: center;
    .active-rule{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1rpx solid #FD7C09;
      &_icon{
        width: 30rpx;
        height: 30rpx;
      }
      &_text{
        margin-left: 4rpx;
        color: #FD7C09;
        font-size: 24rpx;
      }
    }
  }
  .title-wrap{
    padding: 29rpx 35rpx;
    overflow: hidden;
    .title {
      position: relative;
      background-color: #FFFFFF;
      padding: 26rpx 71rpx 31rpx 34rpx;
      font-size: 34rpx;
      color: #FD7C09;
      font-weight: bold;
      border: 1rpx solid #FD7C09;
      border-radius: 10rpx;
      .hot-icon{
        position: absolute;
        right: 0;
        top: 0;
        width: 71rpx;
        height: 84rpx;
      }
    }
  }
  .dead-line-wrap{
    text-align: center;
    padding: 49rpx 0;
    color: #FD7C09;
    font-size: 28rpx;
    .time-block{
      margin: 0 10rpx;
      padding: 5rpx 9rpx;
      display: inline-flex;
      line-height: 26rpx;
      align-items: center;
      justify-content: center;
      background-color: #F21E00;
      border-radius: 4rpx;
      color: #FFFFFF;
    }
  }
  .enlist-total{
    text-align: center;
    margin-top: 61rpx;
    color: #F21E00;
    font-size: 68rpx;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 50rpx;
  }
  .enlist-desc{
    text-align: center;
    margin-top: 20rpx;
    font-size: 26rpx;
    color: #F21E00;
    line-height: 25rpx;
    margin-bottom: 62rpx;
  }
}
.button-wrap{
  display: flex;
  align-items: center;
  justify-content: center;
  .footer-text-btn-wrap{
    padding: 0 34rpx 0 21rpx;
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 26px;
    color: #333333;
    .footer-text-btn-wrap-total{
      font-size: 26rpx;
      color: #333333;
      .footer-text-btn-wrap-total-amount{
        font-size: 34rpx;
        color: #fd7c09;
        font-weight: bold
      }
    }
  }
  .button{
    background: #fd7c09;
    border-radius: 46rpx;
    height: 92rpx;
    width: 664rpx;
    font-size: 36rpx;
    color: #FFFFFF;
  }
  .submit-btn{
    width: 239rpx;
    margin: 0;
  }
  .change-button{
    width: 280rpx;
    border: 1px solid #FD7C09;
    color: #FD7C09;
    background-color: #FFFFFF;
  }
  .refund-button{
    width: 280rpx;
  }
}
.join-info{

}
.remark-wrap{
  padding: 14rpx 20rpx 20rpx 20rpx;
  .remark-title{
    margin-left: 33rpx;
    margin-bottom: 31rpx;
    position: relative;
    font-size: 32rpx;
    color: #333333;
  }
  .remark-title::before{
    position: absolute;
    content: '';
    left: -18rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 5rpx;
    height: 30rpx;
    background: #FD7C09;
    border-radius: 3rpx;
  }
}
.textarea-wrap{
  padding: 26rpx 23rpx;
  background-color: #FFFFFF;
  border-radius: 10rpx;
  box-shadow: -6rpx 0 11rpx 1rpx rgba(204, 204, 204, 0.25);
  .textarea{
    width: 100%;
    background-color: #FFFFF;
    font-size: 26rpx;
    color: #333333;
    min-height: 156rpx;
  }
  .count{
    text-align: right;
    font-size: 24rpx;
    color: #999999;
  }
}
.refund-textarea{
  background-color: #f8f8f8;
  height: 190rpx;
  .textarea{
    background-color: #f8f8f8;
  }
  /deep/.refund-placeholder{
    color: #999999;
    font-size: 26rpx;
  }
}
.my-join-info-wrap{
  .my-join-info{
    margin-bottom:10rpx ;
    display: flex;
    height: 73rpx;
    background: #FFF5ED;
    border-radius: 10rpx;
    align-items: center;
    justify-content: space-between;
    font-size: 30rpx;
    color: #333333;
    .name{margin-left: 31rpx}
    .phone{margin-right: 32rpx}
  }
  .refund-join-info{
    padding-left: 31rpx
  }
}
.refund-join-info-wrap{
  padding-bottom: 20rpx;
  .textarea-wrap{
    margin: 10px 0;
    background: #F8F8F8;
    border-radius: 10rpx;
  }
}
.popupView {
  width: 100%;
  border-radius: 45rpx 45rpx 0 0;
  max-height: 1100rpx;
  background-color: #fff;
  overflow: hidden;
  .popupReason {
    min-height: 420rpx;
    .popupClose {
      padding-right: 34rpx;
      padding-top: 34rpx;
      float: right;
      img {
        width: 46rpx;
        height: 46rpx;
      }
    }
    .popupReason-body {
      background-color: #FFF;
      .popupReason-body-title {
        padding-top: 50rpx;
        position: relative;
        .title-img-left {
          width: 70rpx;
          height: 6rpx;
          position: absolute;
          left: 220rpx;
          top: 70rpx;
        }
        .title-p {
          width: 165rpx;
          text-align: center;
          margin: 0 auto;
          font-size: 34rpx;
          color: #333;
        }
        .title-img-right {
          width: 70rpx;
          height: 6rpx;
          position: absolute;
          right: 220rpx;
          top: 70rpx;
        }
      }
      .popupReason-body-tip {
        border-radius: 10rpx;
        margin: 30rpx 20rpx;
        padding: 30rpx 0;
        .tip-p {
          font-size: 26rpx;
          line-height: 42rpx;
          color: #666;
        }
        .refund-reason-wrap{
          .refund-reason-title{
            position: relative;
            padding-left: 22rpx;
            font-size: 32rpx;
            color: #333333;
            margin-bottom: 31rpx;
          }
          .refund-reason-title::after{
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            content: "*";
            color: #FD7C09;
          }
          .refund-reason-select{
            margin-bottom: 33rpx;
          }
        }
        .refund-textarea-remark{
          margin-bottom: 31rpx;
          font-size: 32rpx;
          color: #333333;
        }
      }
      .popupReason-body-check {
        background-color: #fff;
        border-radius: 10rpx;
        margin: 0 20rpx;
        .popupReason-body-check-title {
          .title-p {
            font-size: 30rpx;
            color: #333;
            font-weight: 400;
            margin: 0 40rpx;
            padding-top: 40rpx;
            padding-bottom: 40rpx;
            border-bottom: 1rpx solid rgba(153, 153, 153, 0.2);
          }
        }
      }
    }
    .popupReason-sub {
      margin-top: 29rpx;
      width: 100%;
      .popupReason-sub-btn {
        width: 90%;
        border-radius: 46rpx;
        height: 92rpx;
        background-color: #fd7600;
        color: #fff;
        font-size: 35.64rpx;
        line-height: 95rpx;
        margin-bottom: 50rpx;
        margin-top: 25rpx;
      }
    }
  }
}
.disabled{
  background: #CCCCCC!important;
}
.active-address-wrap{
  margin-top: 14rpx;
  padding-top: 16rpx;
  padding-bottom: 10rpx;
  border-top: 1px solid rgba(153,153,153, .2);
  font-size: 26rpx;
  color: #333333;
  line-height: 38rpx;
}
.require{
  position: relative;
  padding-left: 22rpx;
}
.require::after{
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  content: "*";
  color: #FD7C09;
}
</style>

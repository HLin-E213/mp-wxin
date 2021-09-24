<!--套餐详情-->
<template>
  <view
      class="detail-product-wrap"
      :style="isIPX? 'padding-bottom: 38rpx': ''"
      :class="showPopup ? '.wos-scroll-no' : '.wos-scroll-yes'">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <view class="detailsProduct">
      <view class="activity">
        <view class="activity_img">
          <image :src="info.combo_banner[0]" mode=""></image>
        </view>
        <view class="activity_detail">
          <view class="activity_detail_top">
            <view class="activity_detail_top_left">
                <h4>¥ {{ info.combo_price / 100 }}</h4>
            </view>
            <view class="activity_detail_top_right">
              <span herf="#javascript"></span>
            </view>
          </view>
          <view class="activity_detail_center">
            <view class="description_word">
              <h4>{{ info.title }}</h4>
            </view>
          </view>
          <view class="activity_detail_bottom">
            <view class="services_tag">
              <view v-for="(tag,k) of info.combo_tags" :key="k" class="tag">
                <p>{{ tag }}</p>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!--      固定的图-->
      <view class="detailsService">
        <view class="detailsService_img">
          <rich-text :nodes="info.advantage"></rich-text>
        </view>
      </view>
      <!--      服务详情-->
      <view class="detailsService">
        <view class="detailsService_title">
          <image src="https://admin.dajxyl.com/oss?path=img/slash.png" mode=""></image>
          <h4>服务详情</h4>
          <image src="https://admin.dajxyl.com/oss?path=img/slash2.png" mode=""></image>
        </view>
        <view class="detailsService_img">
          <!-- <view class="content" v-html="info.describe"></view> -->
          <rich-text :nodes="info.combo_content"></rich-text>
        </view>
      </view>
      <!--      服务流程-->
      <view class="processService ">
        <view class="processService_title">
          <image src="https://admin.dajxyl.com/oss?path=img/slash.png" mode=""></image>
          <h4>服务流程</h4>
          <image src="https://admin.dajxyl.com/oss?path=img/slash2.png" mode=""></image>
        </view>
        <view class="processService_content">
          <view class="processService_content_list" v-for="(i,k) in processServiceList" :key="k">
            <view class="processService_content_list_top">
              <image :src="i.imgUrl" mode=""></image>
            </view>
            <view class="processService_content_list_bottom">
              <p>{{ i.name }}</p>
              <image src="https://admin.dajxyl.com/oss?path=img/fanhuixiangqing@2x.png" mode=""></image>
            </view>
          </view>
        </view>
      </view>
      <!--      注意事项-->
      <view class="instructionsService">
        <view class="instructionsService_title">
          <image src="https://admin.dajxyl.com/oss?path=img/slash.png" mode=""></image>
          <h4>{{ info.service_text.title }}</h4>
          <image src="https://admin.dajxyl.com/oss?path=img/slash2.png" mode=""></image>
        </view>
        <view class="instructionsService_bottom">
          <span v-for="(service_text,k) of info.service_text.text_list" :key="k">{{ service_text }}</span>
        </view>
      </view>
      <!--      用户评价-->
      <view class="evaluationUser" style="margin-bottom: 4.19rem;">
        <view class="evaluationUser_top">
          <view class="evaluationUser_top_left">
            <b></b>
            <h4>用户评价</h4>
          </view>
          <view class="evaluationUser_top_right" @click="showCommentList">
            <p>查看更多</p>
            <image src="https://admin.dajxyl.com/oss?path=img/fanhuixiangqing@2x.png" mode=""></image>
          </view>
        </view>
        <view class="evaluationUser_center" v-if="info.order_evaluation[0]">
          <image :src="info.order_evaluation[0].pic" mode=""></image>
          <span>{{ info.order_evaluation[0].nickname }}</span>
        </view>
        <view class="evaluationUser_bottom" v-if="info.order_evaluation[0]">
          <p>{{ info.order_evaluation[0].desc }}</p>
        </view>
        <view class="none_evaluate" v-else>
          <p>暂无评价</p>
        </view>
      </view>
<!--      底部按钮-->
      <view class="btn_bottom" :style="isIPX? 'padding-bottom: 38rpx': ''">
        <view class="btn_left" @click="makePhoneCall(info.tel)">
          <view class="customerContact">
            <view class="customerContact_top">
              <image src="https://admin.dajxyl.com/oss?path=img/kefu1@2x_origin.png" mode=""></image>
            </view>
            <view class="customerContact_bottom">
              <p>联系客服</p>
            </view>
          </view>
        </view>
        <view class="btn_right" @click="gotoServiceCashier">
          <button type="primary">立即预约</button>
        </view>
      </view>
    </view>
    <!--底部弹出层-->
    <uni-popup ref="popup" type="bottom" @change='changePopup'>
      <view class="getCoupon" style="width: 100%;max-height:941rpx;">
        <coupons-get
            :couponlist="info.coupons"
            :couponText="info.coupon_text"
        ></coupons-get>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import CouponsGet from '../../components/couponsGet/couponsGet.vue';
import {mapState, mapMutations} from 'vuex';
import uniPopup from '@/components/uni-popup/uni-popup.vue'
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
import {codeInvitation, getComboInfo, getUserInfo} from "../../api";

export default {
  components: {
    uniNavBar,
    CouponsGet,
    uniPopup,
    uniPopupMessage,
    uniPopupDialog
  },
  onLoad(option) {
    if (option.id) {
      console.log(option.id);
      let that = this;
      let res = getComboInfo(option.id);
      res.then(function (e) {
        that.setData(e.data.data.info);
        that.info = e.data.data.info;
      });
    }
  },
  data() {
    const {isIPX} = getApp().globalData;
    return {
      isIPX,
      title: '套餐详情',
      is_show_time: false,
      timer: null,
      countdown_type: false,
      showPopup: false,
    }
  },
  computed: {
    ...mapState('orders', {
      'processServiceList': 'processServiceList',
    }),
    ...mapState('serviceinfo', {
      'info': 'serviceInfo'
    }),
    ...mapState('users', {
      'userInfo':'userInfo'
    }),
  },
  mounted() {
    // 有token就更新用户数据
    const token = uni.getStorageSync('token');
    if (token) {
      this.getUserInfo();
    }
  },
  created() {
    // this.info.combo_content = this.info.combo_content.replace(/\<img/gi, '<img style="display:-webkit-box;width:355px !important;margin:10px auto !important;" ');
  },
  methods: {
    ...mapMutations('users', {
      'setUserInfoData': 'setUserInfoData',
    }),
    ...mapMutations('serviceinfo', {
      'setData': 'setData',
    }),
    /*存储用户信息*/
    getUserInfo: async function () {
      let res = await getUserInfo(),that = this;
      // console.log(res);
      return that.setUserInfoData(res.data.data.info);
    },
    onShareAppMessage: async function() {
      let code;
      if (this.userInfo.phone) {
        let res = await codeInvitation(this.userInfo.phone);
        code = res.data.data.info.code;
      } else {
        code = '';
      }
      console.log(code,this.info);
      return {
        title: '大爱金孝',
        path: '/pages/detailsProduct/comboProduct?id=' + this.info.id + '&code=' + code,
        success: (data) => {
          console.log(data)
        }
      }
    },
    onShareTimeline: async function(){
      let code;
      if (this.userInfo.phone) {
        let res = await codeInvitation(this.userInfo.phone);
        code = res.data.data.info.code;
      } else {
        code = '';
      }
      console.log(code,this.info);
      return {
        title: '大爱金孝',
        path: '/pages/detailsProduct/comboProduct?id=' + this.info.id + '&code=' + code,
        success: (data) => {
          console.log(data)
        }
      }
    },
    /**
     * 父组件调用子组件的方法
     * **/
    open: function () {
      this.$refs.popup.open()
    },
    changePopup({ show }) {
      this.showPopup = show;
    },
    /**
     * 打电话给客服
     */
    makePhoneCall: function (tel) {
      console.log(tel);
      return uni.makePhoneCall({
        phoneNumber: tel //仅为示例
      });
    },
    gotoServiceCashier: function () {
      return uni.navigateTo({
        url: '/pages/bookingService/comboService'
      });
    },
    showCommentList: function () {
      return uni.navigateTo({
        url: '/pages/listComment/listComboComment'
      });
    },
    openFail: function(){
      return uni.showToast({
        title: '当前暂无可领取的优惠券',
        icon: 'none',
        duration: 2000
      });
    }
  }
}
</script>
<style lang="less" scoped>
.wos-scroll-no{
  height:100vh;
  overflow-y: hidden;
  padding: 0!important;
  margin: 0!important;
}
.wos-scroll-yes{
  height:auto;
}
.detail-product-wrap{
  width: 100%;
}
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}

@activityItem: {
  width: 100%;
  height: 33.3%;
  display: flex;
  align-items: center;
}

@servicesTitle: {
  image {
    width: 1.25rem;
    height: 0.94rem;
  }
  h4 {
    font-size: 1.105rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    margin: 0 0.5rem 0 0.5rem;
  }
}

@description: {
  width: 94%;
  justify-content: flex-start;
  margin-top: 0.84rem;
  margin-bottom: 1.34rem;
  p {
    width: 100%;
    font-size: 0.81rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(101, 101, 101, 1);
    line-height: 1.215rem;
    word-break:break-all;
  }
  span {
    width: 100%;
    font-size: 0.81rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(101, 101, 101, 1);
  }
}

.detailsProduct {
  width: 100%;
  @item();
  flex-wrap: wrap;
  min-height: 100%;

  .head {
    width: 100%;
    height: 5rem;
    display: flex;
    position: fixed;
    top: 0;
  }

  .activity {
    position: relative;
    width: 100%;
    // height: 23.97rem;activity
    display: flex;
    flex-wrap: wrap;
    .activity_img {
      width: 100%;
      height: 467upx;
      @item();
      image {
        width: 100%;
        height: 100%;
      }
    }

    .activity_bg {
      position: absolute;
      top: 300upx;
      bottom: 0;
      width: 100%;
      height: 169upx;
      display: flex;
      background-image: url("https://admin.dajxyl.com/oss?path=img/activity_bg102@2x.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;

      .festvial {
        width: 146upx;
        height: 94upx;
        margin-top: 57upx;
        margin-left: 28upx;
      }

      .downCount {
        flex: 1;
        height: 100%;
        display: flex;
        color: #FFFFFF;

        .surplus_count {
          margin-top: 95upx;
          margin-left: 170upx;
          p {
            font-size: 28upx;
            font-family: YouSheBiaoTiHei;
            font-weight: 400;
            color: rgba(255, 254, 254, 1);
            height: 21upx;
          }

          span {
            font-size: 30upx;
            font-family: PingFang SC;
            font-weight: 500;
            color: #FFFEFE;
            height: 28upx;
          }
        }

        .surplus_time {
          padding-top: 95upx;
          flex: 1;
          display: flex;
          flex-direction: column;
          color: #FFFFFF;
          .surplus_time--title{
            p{
              text-align: center;
              height: 21upx;
              font-size: 28upx;
              font-family: YouSheBiaoTiHei;
              font-weight: 400;
              color: #FFFEFE;
            }

          }
          .surplus_time--content{
            display: flex;
            padding-top: 20rpx;
            justify-content: center;
          }

          b {
            height: 28upx;
            font-size: 26upx;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(255, 254, 254, 1);
            background: #E50101;
            margin-left: 6rpx;
            @item();
          }
        }

      }
    }

    .activity_detail {
      width: 100%;
      height: 7.375rem;
      background: #FFFFFF;

      .activity_detail_top {
        @activityItem();
        justify-content: center;

        .activity_detail_top_left {
          width: 60%;
          height: 100%;
          @item();
          justify-content: flex-start;
          .price{
            text-decoration: line-through;
          }

          h4 {
            font-size: 1.44rem;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(52, 52, 52, 1);
          }

          p {
            font-size: 0.75rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            line-height: 1.5rem;
            margin-left: 4%;
          }

          em {
            color: #999999;
            // margin: 0.3rem 0 0 3.2rem;
            margin: 1% 0 0 14%;
            position: absolute;
            // margin-left: 14%;
          }
        }

        .activity_detail_top_right {
          width: 34%;
          height: 100%;
          @item();
          justify-content: flex-end;

          span {
            font-size: 0.815rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: #fd7600;
            line-height: 1.5rem;
          }

          image {
            width: 0.625rem;
            height: 0.625rem;
            padding-left: 11upx;
          }
        }
      }

      .activity_detail_center {
        @activityItem();
        justify-content: center;

        .description_word {
          width: 94%;
          height: 100%;
          @item();
          justify-content: flex-start;
        }

        h4 {
          // width:10.935rem;
          height: 0.965rem;
          font-size: 1rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          // margin-left: 4%;
        }
      }

      .activity_detail_bottom {
        @activityItem();
        // justify-content: center;
        .services_tag {
          width: 94%;
          height: 100%;
          @item();
          justify-content: flex-start;
          // margin-left: 4%;
          .tag {
            width: 30%;
            @item();
            height: 1.56rem;
            background: rgba(253, 118, 0, 0.2);
            // opacity:0.2;
            border-radius: 0.5rem;
            margin-left: 0.456rem;

            p {
              // width:4.78rem;
              // height:0.78rem;
              font-size: 0.81rem;
              font-family: PingFang SC;
              font-weight: 300;
              color: rgba(51, 51, 51, 1);
            }
          }

        }
      }
    }
  }

  .evaluationUser {
    width: 100%;
    min-height: 10.53rem;
    background: rgba(255, 255, 255, 1);
    margin-top: 0.75rem;
    @item();
    flex-wrap: wrap;

    .evaluationUser_top {
      width: 94%;
      height: 3.185rem;
      display: flex;

      .evaluationUser_top_left {
        width: 50%;
        height: 100%;
        @item();
        justify-content: flex-start;

        b {
          width: 0.185rem;
          height: 1rem;
          background: #fd7600;
          border-radius: 0.5rem;
        }

        h4 {
          // width:4.435rem;
          // height:1.06rem;
          height: 1.6rem;
          margin-left: 0.345rem;
          font-size: 1.125rem;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
        }
      }

      .evaluationUser_top_right {
        width: 50%;
        height: 100%;
        @item();
        justify-content: flex-end;

        p {
          // width:3.155rem;
          // height:0.78rem;
          height: 1.1rem;
          font-size: 0.81rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
        }

        image {
          width: 0.625rem;
          height: 0.625rem;
          margin-left: 0.375rem;
        }
      }
    }

    .evaluationUser_center {
      width: 94%;
      height: 1.935rem;
      @item();
      justify-content: flex-start;

      image {
        width: 1.935rem;
        height: 1.935rem;
        border-radius: 50%;
      }

      span {
        // width:2.715rem;
        height: 0.905rem;
        font-size: 0.935rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin-left: 0.456rem;
      }
    }

    .evaluationUser_bottom {
      @item();
      @description();
    }

    .none_evaluate {
      width: 94%;
      height: 3.87rem;
      @item();

      p {
        // width:4.81rem;
        height: 0.78rem;
        font-size: 0.81rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(101, 101, 101, 1);
        line-height: 1.215rem;
      }
    }
  }

  .processService {
    width: 100%;
    height: 9.25rem;
    background: rgba(255, 255, 255, 1);
    margin-top: 0.75rem;
    @item();
    flex-wrap: wrap;

    .processService_title {
      width: 100%;
      height: 30%;
      @item();
      @servicesTitle();
    }

    .processService_content {
      width: 100%;
      height: 70%;
      @item();

      .processService_content_list {
        width: 25%;
        height: 100%;
        @item();
        flex-wrap: wrap;

        .processService_content_list_top {
          width: 100%;
          height: 60%;
          @item();

          image {
            width: 2.158rem;
            height: 2.158rem;
          }
        }

        .processService_content_list_bottom {
          width: 100%;
          height: 10%;
          @item();
          margin-bottom: 1.09rem;

          p {
            // width:3.185rem;
            // height:0.78rem;
            height: 1.1rem;
            font-size: 0.81rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
          }

          image {
            width: 0.625rem;
            height: 0.625rem;
          }
        }
      }
    }
  }

  .detailsService {
    width: 100%;
    // height:46.31rem;
    background: rgba(255, 255, 255, 1);
    margin-top: 0.75rem;
    @item();
    flex-wrap: wrap;

    .detailsService_title {
      width: 100%;
      height: 3.06rem;
      @item();
      @servicesTitle();
    }

    .detailsService_img {
      width: 94%;
      // height: 41.31rem;
      @item();

      // image {
      //   width: 94%;
      //   // height: 41.31rem;
      // }

      rich-text {
        width: 100% !important;
        @item();
        image {
          width: 94%;
          height: 41.31rem;
        }
      }

      .content {
        @item();
        width: 100%;
        // height: 41.31rem;
      }
    }
  }

  .instructionsService {
    width: 100%;
    height: 11.625rem;
    background: rgba(255, 255, 255, 1);
    margin-top: 0.75rem;
    @item();
    flex-wrap: wrap;
    .instructionsService_title {
      width: 100%;
      height: 3.06rem;
      @item();
      @servicesTitle();
    }

    .instructionsService_bottom {
      @item();
      @description();
      flex-wrap: wrap;
    }
  }

  .btn_bottom {
    width: 100%;
    height: 98upx;
    background: rgba(255, 255, 255, 1);
    @item();
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    .btn_left {
      height: 100%;
      @item();
      padding-left: 44upx;

      .customerContact {
        height: 100%;
        @item();
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: flex-start;

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
}
</style>

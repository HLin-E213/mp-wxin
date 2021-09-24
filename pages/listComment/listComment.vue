<!--评论列表-->
<template>
  <view class="listComment" :style="isIPX? 'padding-bottom: 150rpx': ''">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <!--评论长列表-->
    <view class="listComment_content">
        <view
          class="content_list" v-for="(i,k) in commentList"
          :key="k"
          @click="toDetailComent(i, k)"
          >
          <view class="content_list_title">
            <view class="content_list_title_left">
              <image :src="i.pic" mode=""></image>
              <h4>{{ i.nickname }}</h4>
            </view>
            <view class="content_list_title_right">
              <uni-rate v-model="i.number / 2" @change="onChange" :margin="5" :readonly="true" :isFill="false"/>
            </view>
          </view>
          <view class="content_list_text">
            <p>{{ i.desc }}</p>
          </view>
          <view class="content_list_img">
            <view class="imgList" v-for="(i,k) in i.images" :key="k">
              <image :src="i" mode=""></image>
            </view>
          </view>
          <view class="content_list_time_bottom">
            <view class="content_list_time_bottom_left">
              <span>{{ i.time }}</span>
              <p>发布</p>
            </view>
            <view class="content_list_time_bottom_right">
              <!--            <view class="content_list_time_bottom_fabulous" @click="addFabulous">-->
              <!--              <image src="https://admin.dajxyl.com/oss?path=img/dianzan@2x.png" mode=""></image>-->
              <!--              <span>999</span>-->
              <!--            </view>-->
              <!--            <view class="content_list_time_bottom_comment" @click="addComment">-->
              <!--              <image src="https://admin.dajxyl.com/oss?path=img/comment@2x.png" mode=""></image>-->
              <!--              <span>369</span>-->
              <!--            </view>-->
              <!--            <view class="content_list_time_bottom_more">-->
              <!--              <image src="https://admin.dajxyl.com/oss?path=img/sangedian@2x.png" mode=""></image>-->
              <!--            </view>-->
            </view>
          </view>
        </view>
    </view>
    <!--底部预约按钮-->
    <view class="detailsOrder_bottom" :style="isIPX? 'padding-bottom: 38rpx': ''">
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
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import uniRate from '../../components/uni-rate/uni-rate.vue';
import {mapState, mapMutations} from 'vuex';
import {getOrderCommentList} from '../../api/index';

export default {
  components: {
    uniNavBar,
    uniRate,
  },
  computed: {
    ...mapState('orders', {
      'processServiceList': 'processServiceList',
    }),
    ...mapState('serviceinfo', {
      'info': 'serviceInfo',
    }),
    imgStyle() {
      if (this.imgList.length == 1) {
        return this.imgList.length == 1 ? 'width:80%;height: 10rem;margin-left:10%' : '';
      }
      return this.imgList.length >= 3 ? 'margin:0.315rem 0 0 0.75rem;' : 'width:45%;height: 6.565rem;margin-left:0.75rem'
    }
  },
  data() {
      const {isIPX} = getApp().globalData;
      return {
          isIPX,
      title: '评论列表',
      imgList: [{}],
      commentList: [{}],
      page: 1,
      pageSize: 10,
      totalPage: 0,
    }
  },
  mounted() {
    this.OrderCommentList();
  },
  methods: {
    ...mapMutations('serviceinfo', {
      'setCommentDetail': 'setCommentDetail',
    }),
    /*点击加赞，小程序暂不支持点赞提示用户下载app*/
    addFabulous: function () {
      uni.showToast({
        title: '请下载app进行该操作',
        icon: 'none',
        duration: 3000
      })
    },
    toDetailComent(info, index) {
      this.setCommentDetail({
        comment: info,
        info: this.info,
      });
      const vm = this;
      uni.navigateTo({
        url: '/pages/listComment/commentDetail',
        events: {
          acceptDataFromCommentDetail(data) {
            vm.commentList[index] = {
              ...vm.commentList[index],
              ...data,
            };
          },
        },
      });
    },
    /*点击评论，小程序暂不支持点赞提示用户下载app*/
    addComment: function () {
      uni.showToast({
        title: '请下载app进行该操作',
        icon: 'none',
        duration: 3000
      })
    },
    /*获取评论列表*/
    OrderCommentList: function (last = false) {
      let res = getOrderCommentList(this.info.id, this.page, this.pageSize), that = this;
      res.then(function (e) {
        if (last) {
          e.data.data.info.forEach(function (i, k) {
            that.commentList.push(i);
          });
        } else {
          that.commentList = e.data.data.info;
        }
        that.totalPage = e.data.data.info.totalPage;
      }).catch(function (e) {
        console.error(e);
      });
    },
    onReachBottom() {
      if (this.page < this.totalPage) {
        this.page++;
        this.OrderCommentList(true);
      }
    },
    gotoServiceCashier: function () {
      return uni.navigateTo({
        url: '/pages/bookingService/bookingService'
      });
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
  }
}
</script>

<style lang="less" scoped>
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}

@commentListBottom: {
  width: 33%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  image {
    width: 0.845rem;
    height: 0.75rem;
  }
  span {
    // width:1.44rem;
    // height:0.625rem;
    font-size: 0.815rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(154, 154, 154, 1);
    // line-height:1.16rem;
  }
}

.listComment {
  width: 100%;
  min-height: 100%;

  .head {
    width: 100%;
    height: 5rem;
    display: flex;
    position: fixed;
    top: 0;
    z-index: 10;
  }

  .listComment_content {
    width: 100%;
    min-height: 100%;
    @item();
    flex-wrap: wrap;

    .content_list {
      width: 100%;
      // height:17.69rem;
      background: rgba(255, 255, 255, 1);
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      background: #FFFFFF;
      margin-top: 0.75rem;

      .content_list_title {
        width: 94%;
        height: 3.905rem;
        @item();
        justify-content: space-around;

        .content_list_title_left {
          width: 50%;
          height: 100%;
          @item();
          justify-content: flex-start;
          flex-wrap: wrap;

          image {
            width: 1.94rem;
            height: 1.94rem;
            border-radius: 50%;
          }

          h4 {
            // width:2.72rem;
            // height:0.905rem;
            font-size: 0.94rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            margin-left: 0.47rem;
          }
        }

        .content_list_title_right {
          width: 50%;
          height: 100%;
          @item();
          justify-content: flex-end;
        }
      }

      .content_list_text {
        width: 94%;
        min-height: 3.22rem;
        @item();
		text-align: flex-start;
		justify-content: flex-start;

        p {
          font-size: 0.815rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 1.22rem;
          word-break: break-all;
        }
      }

      .content_list_img {
        @item();
        justify-content: flex-start;
        width: 100%;
        flex-wrap: wrap;
        margin-top: 7upx;
		    padding-bottom: 20upx;
        margin-left: 20upx;

        .imgList {
          width: 210upx;
          height: 210upx;
          @item();
          margin-left: 40upx;
		  padding-top: 40upx;
          image {
            height: 100%;
			width: 100%;
            margin-top: 30upx;
          }
        }
		.imgList:nth-of-type(3n+1) {
			margin-left: 0;
		}
      }

      .content_list_time_bottom {
        width: 94%;
        height: 2.845rem;
        @item();
        flex-wrap: wrap;

        .content_list_time_bottom_left {
          width: 100%;
          height: 100%;
          @item();
          justify-content: flex-start;

          span {
            // width:4.815rem;
            // height:0.625rem;
            font-size: 0.815rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(154, 154, 154, 1);
          }

          p {
            // width:1.44rem;
            // height:0.72rem;
            font-size: 0.75rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(154, 154, 154, 1);
          }
        }

        .content_list_time_bottom_right {
          width: 50%;
          height: 100%;
          @item();

          .content_list_time_bottom_fabulous {
            @commentListBottom();
          }

          .content_list_time_bottom_comment {
            @commentListBottom();
          }

          .content_list_time_bottom_more {
            @commentListBottom();
            justify-content: center;
          }
        }
      }
    }
  }


  .detailsOrder_bottom {
    width: 100%;
    padding: 0 38upx 0 44upx;
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
      }
    }
  }
}
</style>

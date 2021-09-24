<template>
  <view class="check-servicer-wrap" :class="{'global-page': isIPX }">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <!-- 服务人员个人-公司-成交单量信息 -->
    <view class="head-sculpture-wrap">
       <image class="head-sculpture" :src="staff_info.pic"></image>
      <view class="user-info-wrap">
        <view class="user-wrap">
          <view class="user">
            <view class="name">{{ staff_info.nick }}</view>
            <view class="age">{{ staff_info.age + '岁' }}</view>
          </view>
          <view class="company">{{ staff_info.remarks }}</view>
        </view>
        <view class="deal-count-wrap">
          <view class="count">{{ staff_info.order_num }}</view>
          <view class="status">完成单量</view>
        </view>
      </view>
    </view>

    <!-- 服务人员个人标签以及用户评论内容区域 -->
    <view class="servicer-tag-comment-wrap">
      <!-- 个人标签 -->
      <view class="card tag-card">
        <view class="card-title">
          个人标签
        </view>
        <view class="tag-wrap">
          <view class="tag" v-for="item in staffInfo.tag" :key="item">{{ item }}</view>
        </view>
      </view>
      <!-- 用户评论 -->
      <view class="card comment-card">
        <view class="card-title">
          用户评论
        </view>
        <view class="comment-wrap">
          <view class="comment" v-for="(commentItem, index) in staffInfo.evaluation_list" :key="index">
            <view class="comment-title">
              <view class="title">{{ commentItem.title }}</view>
              <view class="time">{{ commentItem.time }}</view>
            </view>
            <view class="comment-content">
              <view class="text">{{ commentItem.desc }}</view>
              <view class="imgs" v-if="commentItem.images.length > 0">
                <image v-for="img in commentItem.images" class="img" :key="img" :src="img"></image>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 加载更多 -->
      <view class="load-more-wrap" v-if="showLoadMore">
        <view class="text">点击加载更多数据</view>
        <image class="icon" src="https://admin.dajxyl.com/oss?path=img/xiala@2x.png"></image>
      </view>
    </view>
  </view>
</template>

<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';

export default {
  components: {
    uniNavBar
  },
  data() {
    return {
      title: '查看服务人员',
      showLoadMore: false, // 是否展示加载更多数据
      tag: [], // 服务人员tag
      comment: [], // 评论列表数据
        isIPX:this.$isIPX,
    }
  },
  computed: {
    ...mapState('server', {
      'staffID': 'staffID',
      'staffInfo': 'staffInfo',
    }),
    staff_info: function(){
      return this.staffInfo.staff_info;
    }
  }
}
</script>

<style lang="less" scoped>
.check-servicer-wrap{
  width: 100%;
  min-height: 100%;
  background-color: #ffffff;
  .head-sculpture-wrap{
    position: relative;
    width: 100%;
    height: 511upx;
    background-color: #fd7600;
    .head-sculpture{
      width: 100%;
      height: 100%;
    }
    .user-info-wrap{
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      width: 100%;
      height: 120upx;
      background-image: url(https://admin.dajxyl.com/oss?path=img/user-intro@2x.png);
      background-size: 100%;
      background-repeat: no-repeat;
      .user-wrap{
        flex: 1;
        .user{
          width: 100%;
          display: flex;
          padding-top: 14upx;
          color: #343434;
          font-size: 30upx;
          justify-content: center;
          .age{
            margin-left: 40upx;
            font-size: 26upx;
          }
        }
        .company{
          padding-top: 16upx;
          text-align: center;
          font-size: 26upx;
        }
      }
      .deal-count-wrap{
        width: 187upx;
        color: #ffffff;
        .count{
          padding-top: 12upx;
          font-size: 42upx;
          font-weight: bold;
          text-align: center;
        }
        .status{
          padding-top: 3upx;
          font-size: 28upx;
          text-align: center;
        }

      }
    }
  }
  .servicer-tag-comment-wrap{
    padding: 14upx 20upx;
    .card{
      padding-top: 42upx;
      .card-title{
        position: relative;
        color: #343434;
        font-weight: blod;
        font-size: 36upx;
        padding-left: 20upx;
      }
      .card-title:before{
        position: absolute;
        content: '';
        top: 10upx;
        left: 0;
        width: 6upx;
        height: 32upx;
        background-color: #fd7600;
        border-radius: 3upx;
      }
    }
    .tag-card{
      .tag-wrap{
        display: flex;
        flex-wrap: wrap;
        .tag{
          width: 192upx;
          height: 56upx;
          margin-top: 23upx;
          border-radius: 10upx;
          background-color: rgba(64, 140, 255, .2);
          margin-left: 66upx;
          line-height: 56upx;
          text-align: center;
          color: #343434;
          font-size: 26upx;
        }
        .tag:nth-of-type(3n+1) {
          margin-left: 0;
        }
      }
    }
    .comment-card{
      .comment-wrap{
        .comment{
          margin-top: 20upx;
          padding: 0 31rpx 31rpx 31rpx;
          background-color: rgba(242, 242, 242, .5);
          border-radius: 10upx;
          .comment-title{
            display: flex;
            position: relative;
            height: 78upx;
            line-height: 78upx;
            justify-content: space-between;
            border-bottom: 1upx solid rgba(154, 154, 154, .5);
            .title{
              color: #343434;
              font-size: 30upx;
            }
            .time{
              color: #9A9A9A;
              font-size: 24upx;
            }
          }
          .comment-content{
            padding-top: 22upx;
            .text{
              color: #666666;
              font-size: 26upx;
            }
            .imgs{
              display: flex;
              flex-wrap: wrap;
              .img{
                margin-top: 30upx;
                width: 210upx;
                height: 210upx;
                margin-left: 11upx;
              }
              .img:nth-of-type(3n+1){
                margin-left: 0;
              }
            }

          }
        }
      }
    }
  }
  .load-more-wrap{
    margin: 40upx 0 106upx 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .text{
      color: #9A9A9A;
      font-size: 23upx;
    }
    .icon{
      margin-left: 9upx;
      width: 20upx;
      height: 20upx;
    }
  }
}
</style>

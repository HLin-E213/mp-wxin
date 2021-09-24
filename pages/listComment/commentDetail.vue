<!--
* @Description: 评价详情
* @Author: mahui
* @Date: 2021/6/9 11:57 PM
-->
<template>
  <layout
    title="产品详情"
    :showFooter="!showPopup"
    footerHeight="98"
    :shadow="false"
  >
  <div class="comment-detail-page-wrap">
    <div class="comment-detail-wrap">
      <div class="title-wrap">
        <div class="title-wrap-left">
          <img class="title-img" :src="detail.comment.pic" alt="">
          <p class="title-name">{{ detail.comment.nickname }}</p>
        </div>
        <div class="title-wrap-right">
          <uni-rate
              v-model="detail.comment.number / 2"
              :margin="5"
              :isFill="false"
              readonly
          />
        </div>
      </div>
      <div class="time-wrap">
        <p class="time">{{ getTime(detail.comment.time) }} 发布</p>
        <p v-if="detail.comment.count_useful" class="useful"><span class="count">{{ detail.comment.count_useful }}人</span>觉得有用</p>
      </div>
      <div class="comment-text">{{ detail.comment.desc }}</div>
      <div class="comment-images-wrap" v-if="detail.comment.images && detail.comment.images.length">
        <img
            class="comment-image"
            v-for="(item, index) in detail.comment.images"
            :src="item"
            alt=""
            :key="index"
        >
      </div>
    </div>
    <div class="service-info-wrap">
      <img class="service-img" :src="detail.info.icon" alt="">
      <div class="service-info">
        <p class="service-info-title">{{ detail.info.title }}</p>
        <p class="service-info-desc">{{ detail.info.subtitle }}</p>
      </div>
    </div>
    <div class="all-comments-wrap" v-if="subList.length">
      <div class="all-comments-title">全部评价</div>
      <div>
        <div
            class="all-comments-item-wrap"
            v-for="(subItem, index) in subList"
            :key="index"
        >
          <div class="all-comments-item-top">
            <div class="all-comments-item-top-left">
              <img class="all-comments-item-img" :src="subItem.pic" alt="">
              <p class="all-comments-item-name">{{ subItem.nickname }}</p>
            </div>
            <img @click="open" class="all-comments-item-diandian" src="../../static/sangedian.png" alt="">
          </div>
          <div class="all-comments-item-context">
            {{ subItem.desc }}
          </div>
          <div class="all-comments-item-time">{{getTime(subItem.time)}} 发表评论</div>
        </div>
      </div>
      <view v-show="hasMore">
        <uni-load-more :status="loadStatus" ></uni-load-more>
      </view>
    </div>
  </div>
    <div slot="footer" class="dianzan-btn-wrap">
      <div class="harf-btn">
        <img
            v-if="detail.comment.user_useful"
            @click="dianzanOrReport('2')"
            class="harf-btn-img"
            src="../../static/dianzaned.png"
            alt=""
        >
        <img
            v-else
            @click="dianzanOrReport('1')"
            class="harf-btn-img"
            src="../../static/undianzan.png"
            alt=""
        >
        <p class="harf-btn-img_desc">对我有用</p>
      </div>
      <div class="spread"></div>
      <div class="harf-btn" @click="toAddComment">
        <img class="harf-btn-img" src="../../static/daipingjia.png" alt="">
        <p class="harf-btn-img_desc">我要评价</p>
      </div>
    </div>
    <uni-popup ref="popup" type="bottom" @change="popupChange">
      <div class="dialog">
        <div class="dialog-text" @click="doReport">举报</div>
        <div class="dialog-text cancel" @click="close">取消</div>
      </div>
    </uni-popup>
  </layout>
</template>

<script>
  import {mapState, mapMutations} from 'vuex';
  import layout from '@/components/layout/index.vue';
  import uniRate from '@/components/uni-rate/uni-rate.vue';
  import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
  import { optionServiceComment, getSubCommentList } from '@/api/index.js';
  import uniPopup from '@/components/uni-popup/uni-popup.vue';

  export default {
    name: 'comment-detail',
    components: {
      layout,
      uniPopup,
      uniRate,
      uniLoadMore,
    },
    data() {
      return {
        pageSize: 20,
        page: 1,
        hasMore: true,
        loadStatus: 'more', // loading nomre
        subList: [],
        totalPage: 0,
        showPopup: false,
      }
    },
    onShow() {
      this.reset();
      this.getSubList(1);
    },
    onReachBottom() {
      if ((this.page <= this.totalPage) && this.loadStatus !== 'loading') {
        this.getSubList();
      }
    },
    computed: {
      ...mapState('serviceinfo', {
        'detail': 'commentDetail'
      }),
      getTime() {
        return function(timeStr) {
          return timeStr.split(' ')[0];
        };
      },
    },
    methods: {
      ...mapMutations('serviceinfo', {
        'setCommentDetail': 'setCommentDetail',
      }),
      reset() {
        this.page= 1;
        this.pageSize= 20;
        this.subList= [];
        this.loadStatus= 'more';
        this.hasMore= true;
        this.totalPage = 0;
      },
      open() {
        this.$nextTick(() => {
          this.showPopup = true;
          this.$refs.popup.open();
        });
      },
      popupChange(e) {
        const { show } = e;
        this.showPopup = show;
      },
      doReport() {
        uni.showLoading({title: '数据加载中，请稍后'});;
        setTimeout(() => {
          uni.hideLoading();
          this.close();
          uni.showToast({
            title: '举报成功',
            icon: 'none',
            duration: 3000
          })
        }, 300);
      },
      close() {
        this.showPopup = false;
        this.$refs.popup.close();
      },
      async dianzanOrReport(type) {
        const { count_useful = 0, user_useful, id } = this.detail.comment;
        uni.showLoading({title: '数据加载中，请稍后'});;
        try {
          await optionServiceComment(id, type, '1'); // 对我有用，暂时没得举报这个东西
          const eventChannel = this.getOpenerEventChannel();
          const tempUserUseful = type === '1';
          let tempCountUseful = count_useful;
          if (user_useful) {
            if (!tempUserUseful) {
              tempCountUseful -= 1;
            }
          } else {
            if (tempUserUseful) {
              tempCountUseful += 1;
            }
          }
          eventChannel.emit('acceptDataFromCommentDetail', {
            ...this.detail.comment,
            user_useful: tempUserUseful,
            count_useful: tempCountUseful
          });
          this.setCommentDetail({
            comment: {
              ...this.detail.comment,
              user_useful: tempUserUseful,
              count_useful: tempCountUseful,
            },
            info: this.detail.info,
          });
          uni.hideLoading();
        } catch (e) {
          uni.hideLoading();
        }
      },
      async getSubList(page = this.page) {
        const temp =  this.loadStatus;
        try {
          const { data } = await getSubCommentList(this.detail.comment.id, page, this.pageSize);
          const {currentPage, info = [], totalPage } = data.data || {};
          this.page = currentPage + 1;
          this.totalPage = totalPage;
          this.subList = [
            ...this.subList,
            ...info,
          ];
          this.hasMore = totalPage > currentPage;
          this.loadStatus = currentPage < totalPage ? 'more' : 'nomre';
        } catch (e) {
          console.log('get-sub-comment-failed', e)
          this.loadStatus = temp;
        } finally {
          uni.hideLoading();
        }
      },
      toAddComment() {
        uni.navigateTo({
          url: '/pages/listComment/addComment?from=commentDetail'
        });
      }
    },
    }
</script>
<style lang="less" scoped>
  .comment-detail-page-wrap{
    margin: 24rpx 0;
    .comment-detail-wrap {
      background-color: #FFFFFF;
      padding: 0 20rpx;
      .title-wrap{
        padding-top: 36rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title-wrap-left{
          display: flex;
          align-items: center;
          .title-img{
            width: 62rpx;
            height: 62rpx;
            border-radius: 50%;
          }
          .title-name{
            margin-left: 15rpx;
            color: #333333;
            font-size: 30rpx;
          }
        }
      }
      .time-wrap{
        margin-top: 16rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #999999;
        .time{
          font-size: 26rpx;
        }
        .useful{
          font-size: 24rpx;
          .count{
            color: #D30A0A;
          }
        }
      }
      .comment-text{
        padding: 42rpx 0 35rpx 0;
        color: #666666;
        font-size: 26rpx;
      }
      .comment-images-wrap{
        .comment-image{
          margin-bottom: 24rpx;
          width: 710rpx;
          height: 450rpx;
          border-radius: 10rpx;
        }
      }
    }
    .service-info-wrap{
      margin-top: 24rpx;
      display: flex;
      padding: 22rpx 20rpx 25rpx 20rpx;
      background-color: #FFFFFF;
      align-items: center;
      .service-img{
        width:210rpx;
        height: 140rpx;
        border-radius: 6rpx;
      }
      .service-info{
        flex: 1;
        margin-left: 16rpx;
        .service-info-title{
          color: #333333;
          font-size: 32rpx;
        }
        .service-info-desc{
          padding-top: 6rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 26rpx;
          color: #666666;
        }
      }
    }
    .all-comments-wrap{
      margin-top: 24rpx;
      padding: 25rpx 20rpx 0 20rpx;
      background-color: #FFFFFF;
      .all-comments-title{
        position: relative;
        padding: 10rpx 0 10rpx 20rpx;
        color: #333333;
        font-size: 36rpx;
        font-weight: bold;
        line-height: 34rpx;
      }
      .all-comments-title:after{
        content: '';
        position: absolute;
        left: 0;
        top: 12rpx;
        height: 32rpx;
        width: 6rpx;
        background-color: #FD7600;
        border-radius: 3rpx;
      }
      .all-comments-item-wrap{
        padding: 36rpx 0 31rpx 0;
        border-top: 1px solid rgba(153, 153, 153, .3);
        .all-comments-item-top{
          display: flex;
          align-items: center;
          justify-content: space-between;
          .all-comments-item-top-left{
            display: flex;
            .all-comments-item-img{
              width: 62rpx;
              height: 62rpx;
              border-radius: 50%;
            }
            .all-comments-item-name{
                margin-left: 15rpx;
              color: #333333;
              font-size: 30rpx;
            }
          }
          .all-comments-item-diandian{
            width: 30rpx;
            height: 31rpx;
            margin-right: 31rpx;
          }
        }
        .all-comments-item-context{
          padding: 27rpx 9rpx 22rpx 2rpx;
          font-size: 26rpx;
          color: #666666;
        }
        .all-comments-item-time{
          font-size: 24rpx;
          color: #666666;
        }
      }
      .all-comments-item-wrap:first-of-type{
        border-top: none;
      }
    }
  }
  .dianzan-btn-wrap{
    height: 100%;
    display: flex;
    align-items: center;
    .spread{
      width: 2rpx;
      height: 36rpx;
      background-color: #EEEEEE;
    }
    .harf-btn{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      .harf-btn-img{
        width: 35rpx;
        height: 35rpx;
      }
      .harf-btn-img_desc {
        margin-left: 13rpx;
        color: #FD7600;
        font-size: 32rpx;
      }
    }
  }
  .dialog{
    border-radius: 24rpx 24rpx 0 0;
    background-color: #FFFFFF;
    .dialog-text{
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
    }
    .cancel{
      border-top:1rpx solid rgba(153, 153, 153, .2);
    }
  }
</style>

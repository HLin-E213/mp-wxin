<!--
* @Description: 新建服务评价
* @Author: mahui
* @Date: 2021/6/5 11:57 AM
-->
<template>
  <layout
      title="服务评价"
      :showFooter="canEdit"
      footerHeight="142"
      :shadow="false"
  >
    <div class="add-comment-wrap">
      <div class="service-info-wrap">
        <img class="service-icon" :src="serviceInfo.icon" alt="">
        <div class="title-wrap">
          <p class="title">{{serviceInfo.title}}</p>
          <p class="sub-title">{{serviceInfo.subtitle}}</p>
        </div>
      </div>
      <div class="comment-detail-wrap">
        <div class="rate-wrap">
          <p class="rate-desc">服务评价</p>
          <div class="rate-detail-wrap">
            <uni-rate
              v-model="score"
               :margin="5"
               :isFill="false"
              :readonly="!canEdit"
            />
               <!-- <span class="score-desc">非常差</span> -->
               </div>
        </div>
        <div class="comment-text-wrap">
          <div class="textarea-wrap">
            <textarea
              auto-height
              v-model="commentText"
              :disabled="!canEdit"
              :maxlength="500"
              placeholder="请写下您的体验感受，我们下一次将做的更好。"
              placeholder-style	="color: #999999;font-size: 26rpx"
              class="textarea"
              ></textarea>
              <div class="count">{{count}}/500</div>
          </div>
          <div v-if="from === 'orderList'" class="resource-content-wrap">
            <div
                class="resource-wrap"
                v-for="(item, index) in resource"
                :key="item"
            >
              <img
                  mode="aspectFill"
                  class="resource-wrap__delete"
                  src="../../static/delete.png"
                  alt=""
                  v-if="canEdit"
                  @click="deleteResource(index)"
              >
              <img class="resource-wrap__img" :src="item.url" alt="">
            </div>
            <div
                class="resource-wrap"
                @click="uploadResource"
                v-if="showAddResource"
            >
              <img class="resource-wrap__icon" src="../../static/tianjia.png" alt="">
              <div class="resource-wrap__text">添加图片</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="publish-btn-wrap" v-if="canEdit">
      <div class="publish-btn" @click="doAddComment">
        发布
      </div>
    </div>

  </layout>
</template>

<script>
  import {mapState} from 'vuex';
  import layout from '@/components/layout/index.vue';
  import uniRate from '@/components/uni-rate/uni-rate.vue';
  import { updateUserImg, orderEvaluate, getOrderComment } from '@/api/index.js';
  export default {
    name: 'addComment',
    components: {
      layout,
      uniRate,
    },
    computed: {
      ...mapState('orders', {
        'orderData': 'orderData',
      }),
      ...mapState('serviceinfo', {
        'detail': 'commentDetail'
      }),
      count() {
        return this.commentText.length;
      },
      showAddResource() {
          return this.resource.length < 9;
      },
      hasEvaluated() {
        // 是否已经评论过了
        return this.orderData && this.orderData.order_evaluation;
      },
      canEdit() {
        let flag = true;
        if (this.from === 'commentDetail') {
          flag = true;
        } else if(this.from === 'orderList') {
          flag = !this.hasEvaluated;
        }
        return flag;
      },
    },
    data() {
      return {
        from: '',
        serviceInfo: {},
        score: 0,
        commentText: '',
        resource: [],
      };
    },
    onLoad({ from }) {
      // commentDetail、orderList 页面从哪里过来的；
      this.from = from;
      if (from === 'commentDetail') {
        this.serviceInfo = this.detail.info || {};
      } else if (from === 'orderList') {
        this.serviceInfo = this.orderData.info || {};
        this.getComment();
      }
    },
    methods: {
      onChange(rate) {
        this.score = rate.value || 0;
      },
      async getComment() {
        const { data } = await getOrderComment(this.orderData.orderID);
        const { desc, images, star } = data.data.info || {};
        this.commentText = desc;
        this.score = star / 2;
        this.resource = images
            .filter((url) => (!!url))
            .map((url) => ({url}));
      },
      async doAddComment() {
        uni.showLoading({title: '数据加载中，请稍后'});;
        try {
          if (this.from === 'orderList') {
            await orderEvaluate(this.orderData.orderID, this.score * 2, this.commentText, this.resource);
          } else if (this.from === 'commentDetail') {
            await orderEvaluate(this.detail.comment.order_id, this.score * 2, this.commentText, this.resource,
                this.detail.comment.id);
          }
          uni.hideLoading();
          uni.showToast({
            title: '评价成功！',
            icon: 'none',
            duration: 2000
          });
          return uni.navigateBack({
            delta: 1
          });
        } catch (e) {
          uni.hideLoading();
        }
      },
      deleteResource(index) {
        this.resource.splice(index, 1);
      },
      uploadResource() {
        if (!this.canEdit) return false;
          const length =  9 - this.resource.length, vm = this;
          uni.chooseImage({
              count: length, //默认9
              sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album','camera'], //相机或者相册
              success: function (res) {
                  // #ifdef MP-WEIXIN
                  if (res.tempFilePaths && res.tempFilePaths.length) {
                      res.tempFilePaths.forEach(async (filePath) => {
                          const file = await vm.getFileBase64(filePath);
                          const res = await updateUserImg(file);
                          vm.resource = [
                              ...vm.resource,
                              ...res.data.data.info,
                          ];
                      })
                  }
                  // #endif
              },
              fail: function(res){
                  return uni.showToast({
                      title: '选择照片时发生错误、请重新选择',
                      icon: 'none',
                      duration: 3000
                  })
              }
          });
      },
      getFileBase64 (tempFilePaths) {
          return new Promise((resolve, reject) => {
              uni.getFileSystemManager().readFile({
                  filePath: tempFilePaths, //选择图片返回的相对路径
                  encoding: 'base64', //编码格式
                  success: ({ data }) => {
                      resolve('data:image/jpeg;base64,' + data);
                  },fail: (e) => {
                      reject(e)
                  }
              })
          })
      },
    },
  };
</script>

<style scoped lang="less">
  .add-comment-wrap{
    padding: 24rpx 20rpx;
    .service-info-wrap{
      display: flex;
      padding: 27rpx 41rpx 27rpx 26rpx;
      box-shadow: 0px 0px 15rpx 0px rgba(169, 169, 169, 0.2);
      border-radius: 10rpx;
      align-items: center;
      background-color: #FFFFFF;
      .service-icon{
        width: 170rpx;
        height: 124rpx;
        border-radius: 6rpx;
      }
      .title-wrap{
        margin-left: 23rpx;
        .title{
          color: #333333;
          font-size: 32rpx;
          font-weight: bold;
        }
        .sub-title{
          padding-top: 20rpx;
          color: #666666;
          font-size: 26rpx;
        }
      }
    }
    .comment-detail-wrap{
      margin-top: 24rpx;
      background-color: #FFFFFF;
      padding: 26rpx;
      .rate-wrap{
        padding: 13rpx 0 39rpx 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .rate-desc{
          color: #333333;
          font-size: 28rpx;
        }
        .rate-detail-wrap{
          display: flex;
          align-items: center;
          .score-desc{
            margin-left: 29rpx;
            color: #FF9C2E;
            font-size: 26rpx;
          }
        }
      }
      .comment-text-wrap{
        .textarea-wrap{
          padding: 26rpx 23rpx;
          background-color: #FAFAFA;
          border-radius: 10rpx;
          .textarea{
            width: 100%;
            background-color: #FAFAFA;
            font-size: 26rpx;
            color: #333333;
            min-height: 250rpx;
          }
          .count{
            text-align: right;
            font-size: 24rpx;
            color: #999999;
          }
        }
        .resource-content-wrap{
          display: flex;
          flex-wrap: wrap;
          .resource-wrap{
            position: relative;
            display: flex;
            flex-direction: column;
            width: 182rpx;
            height: 182rpx;
            margin-left: 56rpx;
            margin-top: 24rpx;
            justify-content: center;
            align-items: center;
            background: #F8F8F8;
            border-radius: 10rpx;
            overflow: hidden;
            &__delete{
              position: absolute;
              top: 14rpx;
              right: 14rpx;
              width: 34rpx;
              height: 34rpx;
              z-index: 999;
            }
            &__icon{
              width: 36rpx;
              height: 36rpx;
            }
            &__text{
              font-size: 26rpx;
              color: #CCCCCC;
            }
            &__img{
              width: 100%;
              height: 100%;
            }
            &__video{
              width: 100%;
              height: 100%;
            }
          }
          .resource-wrap:nth-of-type(3n+1) {
            margin-left: 0;
          }
        }
      }
    }
  }
 .publish-btn-wrap{
   height: 100%;
   display: flex;
   justify-content: center;
   align-items: center;
   .publish-btn{
     display: flex;
     justify-content: center;
     align-items: center;
     width: 664rpx;
     height: 92rpx;
     color: #FFFFFF;
     background-color: #FD7C09;
     border-radius: 46rpx;
     font-size: 36rpx;
   }
 }

</style>

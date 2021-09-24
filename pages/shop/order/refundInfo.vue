<template>
  <layout :title="title"
          :showFooter="false"
  >
    <view class="content">
      <view class="goods-info">
        <view class="goods-info-title">
          退款商品
        </view>
        <view class="goods-info-body" v-for="goods in refundInfo" :key="goods.product_sku_id">
          <view class="img-wrap">
            <img class="goods-info-body-img" :src="goods.img" alt="">
          </view>
          <view class="desc-wrap">
            <p class="goods-info-body-p">
              <view>{{ goods.name }}</view>
              <view class="good-info-num">x{{ goods.mount }}</view>
            </p>
            <p class="money-int">￥{{ goods.yuan }}.<span class="money-float">{{ goods.jiao }}</span></p>
          </view>
        </view>
      </view>
      <view class="goods-list">
        <view class="goods-list-item" @click="openReason">
          <h1 class="item-left">退款原因</h1>
          <p class="item-right">{{ refund_reason || '请选择' }} <img class="next-page" src="https://admin.dajxyl.com/oss?path=img/next_page.png" alt=""></p>
        </view>
        <view class="goods-list-item">
          <h1 class="item-left">退款金额：</h1>
          <p class="item-right money-int">￥{{ refundTotal[0] }}.<span class="money-float">{{ refundTotal[1] }}</span></p>
        </view>
        <view class="goods-list-item">
          <h1 class="item-left">退还优惠券：</h1>
          <p class="item-right"></p>
        </view>
      </view>
      <view class="goods-remark">
        <view class="remark-item">
          <h1 class="item-left refund-explain">退款说明：<input v-model="refund_explain" class="refund-explain__input" placeholder="请输入退款说明" type="text"></h1>
          <p class="item-right">选填</p>
        </view>
        <view class="remark-item">
          <h1 class="item-h1">上传凭证：</h1>
          <view class="img-wrap">
            <img
                v-for="img in refund_images"
                class="item-img"
                :key="img.file_key"
                :src="img.url"
                alt=""
            >
            <img @click="uploadCertificate" v-if="refund_images.length < 3" class="item-img" src="https://admin.dajxyl.com/oss?path=img/onloadImg.png" alt="">

          </view>
        </view>
      </view>
      <view class="btn_button">
        <button type="primary" @click="doRefund">提交</button>
      </view>
    </view>

    <!--弹窗层-->
    <template>
      <view :class="showPopup ? '.wos-scroll-no' : '.wos-scroll-yes'">
        <uni-popup :maskClick="false" ref="popup" type="bottom" @change='changePopup'>
          <view class="popupView">

            <view class="popupReason">
              <view class="popupClose">
                <img src="https://admin.dajxyl.com/oss?path=img/close_popup.png" alt="关闭">
              </view>
              <view class="popupReason-body">
                <view class="popupReason-body-title" @click="closePopup">
                  <img class="title-img-left" src="https://admin.dajxyl.com/oss?path=img/14591@2x.png" alt="">
                  <p class="title-p">退款原因</p>
                  <img class="title-img-right" src="https://admin.dajxyl.com/oss?path=img/14592@2x.png" alt="">
                </view>
                <view class="popupReason-body-tip">
                  <p class="tip-p">温馨提示：</p>
                  <p class="tip-p">1、特价、打折等购买优惠可能一并取消；</p>
                  <p class="tip-p">2、订单一旦取消，不能恢复；</p>
                  <p class="tip-p">3、订单所使用的优惠券退回到账号中；</p>
                </view>
                <view class="popupReason-body-check">
                  <view class="popupReason-body-check-title">
                    <p class="title-p">请选择取消订单的原因（必选）：</p>
                  </view>
                  <view class="popupReason-body-check-list">
                    <view
                        class="popupReason-body-check-item"
                        v-for="(reason) in refundArr"
                        :key="reason"
                        @click="refund_reason = reason"
                    >
                      <img class="item-img" :src="reason === refund_reason ? 'https://admin.dajxyl.com/oss?path=img/shopping_cart_selected.png' : 'https://admin.dajxyl.com/oss?path=img/shopping_cart_unselect.png'" alt="">
                      <p class="item-p">{{ reason }}</p>
                    </view>
                  </view>
                </view>
              </view>
              <view class="popupReason-sub">
                <button class="popupReason-sub-btn" @click="confirmReason">确认</button>
              </view>
            </view>

          </view>
        </uni-popup>
      </view>
    </template>

  </layout>
</template>

<script>
import layout from "@/components/layout/index.vue";
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import { doRefund } from '../../../api/shop/order';
import { updateUserImg } from '../../../api/index.js';
import{ fenToYuan } from '../../../utils/money';

export default {
  name: "refundInfo",
  components: {
    layout,
    uniPopup,
    uniPopupMessage,
    uniPopupDialog
  },
    onLoad(option) {
        this.refundInfo = JSON.parse(decodeURIComponent(option.refundInfo));
        console.log('this.refundInfo', this.refundInfo);
    },
    computed: {
      refundTotal() {
         const totalAmount = this.refundInfo.reduce((total, {amount}) => (total += parseFloat(amount)), 0);
         return fenToYuan(totalAmount * 100).split('.');
      },
    },
  data() {
    return {
      showPopup: false,
      title: '商品退款',
      refundInfo: [],
      refund_explain: '',
      refund_reason: '',
      refundArr: [
            '不想要了',
            '商品信息填写错误',
            '地址信息填写错误',
            '商品降价',
            '其他',
      ],
      refund_images: [],
    }
  },
  methods: {
    changePopup({show}) {
      this.showPopup = show;
    },
    openReason() {
      this.$refs.popup.open();
    },
    closePopup(){
      this.$refs.popup.close();
    },
    confirmReason() {
        this.$refs.popup.close();
    },
      doRefund() {
        if (!this.refund_reason) {
            uni.showToast({
                title: '请选择退款原因',
                icon: 'none',
                duration: 3000
            });
            return false;
        }
        let order_no = ''
          const product_sku_id =this.refundInfo.map((item) => {
              order_no = item.order_no;
              return item.product_sku_id;
          });
        doRefund(order_no, product_sku_id, this.refund_reason, this.refund_explain, this.refund_images).then((res) => {
            console.log('res');
            uni.showToast({
                title: '退款提交成功',
                icon: 'success',
                duration: 3000
            });
            return uni.navigateTo({
              // url: '/pages/orderList/orderList?type=shop'
              url: '/pages/shop/orderStatusDetail/index?order_no=' + order_no,
            });
        })
      },
      uploadCertificate() {
        const length =  3 - this.refund_images.length, vm = this;
          uni.chooseImage({
              count: length, //默认9
              sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album','camera'], //相机或者相册
              success: function (res) {
                  console.log(JSON.stringify(res.tempFilePaths));
                  // #ifdef MP-WEIXIN
                  if (res.tempFilePaths && res.tempFilePaths.length) {
                      res.tempFilePaths.forEach(async (filePath) => {
                          const file = await vm.getFileBase64(filePath);
                          const res = await updateUserImg(file);
                          vm.refund_images = [
                              ...vm.refund_images,
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
}
</script>

<style scoped lang="less">
.content {
  .goods-info {
    margin-top: 24upx;
    margin-bottom: 24upx;
    background-color: #fff;
    padding-top: 29upx;
    .goods-info-title {
      margin-left: 20upx;
      margin-bottom: 35upx;
      padding-left: 10upx;
      border-left: #fd7600 6upx solid;
      font-weight: 400;
      font-size: 32upx;
      color: #333;
    }
    .goods-info-body {
      display: flex;
      height: 180upx;
      position: relative;
      padding: 0 20rpx;
      margin-top: 20rpx;
      .img-wrap{
        display: flex;
        height: 156rpx;
        width: 156rpx;
        overflow: hidden;
        //background-color: #F3F3F3;
        align-items: center;
        justify-content: center;
      }
      .desc-wrap{
        flex: 1;
        padding-left: 26rpx;
      }
      .goods-info-body-img {
        height: 156rpx;
        width: 156rpx;
        border-radius: 10rpx;
      }
      .goods-info-body-p {
        display: flex;
        justify-content: space-between;
        height: 62upx;
        padding-top: 20upx;
        font-size: 26upx;
        font-weight: 400;
        color: #666;
      }
      .money-int {
        padding-bottom: 20upx;
        font-weight: 400;
        font-size: 30upx;
        color: #FD7600;
      }
      .money-float {
        font-weight: 400;
        font-size: 26upx;
        color: #FD7600;
      }
      .good-info-num {
        font-size: 26upx;
        color: #999;
      }
    }
    .goods-info-body:first-of-type{
      margin-top: 0;
    }
  }
  .goods-list {
    margin: 20upx 0;
    background-color: #fff;
    .goods-list-item:last-child {
      border-bottom: none;
    }
    .goods-list-item {
      padding: 20upx 0;
      border-bottom: 1upx solid rgba(153, 153, 153, 0.2);
      margin: 0 20upx;
      .next-page{
        margin-left: 30rpx;
        width: 14rpx;
        height: 24rpx;
      }
      .item-left {
        font-size: 32upx;
        color: #333;
        display: inline;
      }
      .item-right {
        display: inline;
        float: right;
        font-size: 28upx;
        line-height: 60upx;
        color: #999;
      }
      .item-img {

      }
      .money-int {
        font-size: 30upx;
        color: #FD7600;
      }
      .money-float {
        font-size: 26upx;
        color: #fd7600;
      }
    }
  }
  .goods-remark {
    background-color: #fff;
    margin-bottom: 100upx;
    .remark-item {
      padding: 20upx 0;
      border-bottom: 1upx solid rgba(153, 153, 153, 0.2);
      margin: 0 20upx;
      .item-left {
        font-size: 32upx;
        color: #333;
        display: inline;
      }
      .refund-explain{
        display: inline-flex;
        align-items: center;
        &__input{
          color: #333333;
          font-size: 28rpx;
          font-weight: normal;
        }
      }
      .item-right {
        display: inline;
        float: right;
        font-size: 28upx;
        line-height: 60upx;
        color: #999;
      }
      .item-h1 {
        font-size: 32upx;
        color: #333;
        margin-bottom: 36upx;
      }
      .item-img {
        width: 270upx;
        height: 270upx;
      }
      .img-wrap{
        display: flex;
        flex-wrap: wrap;
        .item-img{
          margin-top: 20rpx;
          margin-left: 20rpx;
        }
        .item-img:nth-of-type(2n+1){
          margin-left: 0;
        }
      }
    }
  }
  .btn_button {
    button {
      line-height: 95upx;
      font-size: 35upx;
      width: 90%;
      height: 92upx;
      background: #fd7600;
      border-radius: 46upx;
    }
  }
}
.popupView {
  width: 100%;
  max-height: 1100rpx;
  background-color: #fff;
  border-radius: 20upx 20upx 0 0;
  .popupReason {
    height: 2000upx;
    .popupClose {
      padding-right: 34upx;
      padding-top: 34upx;
      float: right;
      img {
        width: 46upx;
        height: 46upx;
      }
    }
    .popupReason-body {
      background-color: #fafafa;
      .popupReason-body-title {
        padding-top: 50upx;
        position: relative;
        .title-img-left {
          width: 70upx;
          height: 6upx;
          position: absolute;
          left: 220upx;
          top: 70upx;
        }
        .title-p {
          width: 165upx;
          text-align: center;
          margin: 0 auto;
          font-size: 34upx;
          color: #333;
        }
        .title-img-right {
          width: 70upx;
          height: 6upx;
          position: absolute;
          right: 220upx;
          top: 70upx;
        }
      }
      .popupReason-body-tip {
        background-color: rgba(253, 118, 0, .2);
        border-radius: 10upx;
        margin: 30upx 20upx;
        padding: 30upx;
        .tip-p {
          font-size: 30upx;
          line-height: 50upx;
          color: #666;
        }
      }
      .popupReason-body-check {
        background-color: #fff;
        border-radius: 10upx;
        margin: 0 20upx;
        .popupReason-body-check-title {
          .title-p {
            font-size: 30upx;
            color: #333;
            font-weight: 400;
            margin: 0 40upx;
            padding-top: 40upx;
            padding-bottom: 40upx;
            border-bottom: 1upx solid rgba(153, 153, 153, 0.2);
          }
        }
        .popupReason-body-check-list {
          .popupReason-body-check-item {
            position: relative;
            .item-img {
              top: 5upx;
              left: 45upx;
              position: absolute;
              width: 30upx;
              height: 30upx;
            }
            .item-p {
              font-size: 26upx;
              color: #666;
              margin: 30upx 95upx;
            }
          }
        }
      }
    }
    .popupReason-sub {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #fafafa;
      box-shadow: 0upx 1upx 0upx 0upx rgba(153, 153, 153, 0.2);
      .popupReason-sub-btn {
        width: 90%;
        border-radius: 46upx;
        height: 92upx;
        background-color: #fd7600;
        color: #fff;
        font-size: 35.64upx;
        line-height: 95upx;
        margin-bottom: 25upx;
        margin-top: 25upx;
      }
    }
  }
}

</style>

<!--
* @Description: 选择的四大理由
* @Author: mahui
* @Date: 2021/4/14 10:27 PM
-->
<template>
  <div class="choose-wrap">
    <img @click="back" class="choose-wrap-back" src="https://admin.dajxyl.com/oss?path=img/fanhui@2x.png" alt="">
    <img class="top-img" :src="classifyConsult.top_img">
    <div class="top-title-wrap">
      <img class="top-title-img" :src="classifyConsult.body_img" alt="">
    </div>
    <div class="content-wrap">
      <div
          class="content-item"
          v-for="(item) in classifyConsult.list"
          @click="go(item)"
      >
        <div class="content-item-left">
          <img class="content-item-left-img" :src="item.icon" alt="">
        </div>
        <div class="content-item-right">
          <img class="content-item-right-title" :src="item.text_img" alt="">
          <p class="desc"> {{ item.remarks }}</p>
          <img @click="go(item)" class="item-go-btn" src="https://admin.dajxyl.com/oss?path=video/upload/202108/GO2@2x.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import { getClassifyConsult } from "../../api";

    export default {
        name: 'whyChoose',
        onShow() {
           const id = uni.getStorageSync('activeChooseId');
            getClassifyConsult(id).then(res => {
                this.classifyConsult = res.data.data.info;
            });
        },
        data() {
            return {
                classifyConsult: {},
            };
        },
        methods: {
            back() {
                uni.navigateBack({
                    delta:1
                });
            },
            go ({ payload = {}, id }) {
              if (id === '606') {
                uni.setStorageSync('active-tab', payload.id);
                // uni.navigateTo({ url: '/pages/service/service' });
                uni.switchTab({ url: '/pages/service/service' });
              } else if (id === '605') {
                uni.navigateTo({ url: '/pages/beadHouse/index' });
              }
            },
        },
    };
</script>

<style scoped lang="less">
  .choose-wrap {
    position: relative;
    min-height: 100vh;
    background-color: #FFFFFF;
    .choose-wrap-back{
      position: fixed;
      top: 60rpx;
      left: 20rpx;
      width: 18rpx;
      height: 32rpx;
      padding: 20rpx;
    }
    .top-img{
      width: 100%;
      height: 555rpx;
    }
    .top-title-wrap{
      padding: 27rpx 51rpx 0 51rpx;
      .top-title-img{
        height: 106rpx;
        width: 647rpx;
      }
    }
    .content-wrap{
      padding: 0 31rpx 0 28rpx;
      .content-item{
        margin-top: 32rpx;
        background: #FFEDE7;
        border-radius: 10rpx;
        padding: 26rpx 86rpx 26rpx 26rpx;
        display: flex;
        .content-item-left {
          .content-item-left-img{
            width: 240rpx;
            height: 240rpx;
          }
        }
        .content-item-right{
          padding-left: 48rpx;
          .content-item-right-title{
            margin-top: 5rpx;
            width: 181rpx;
            height: 44rpx;
          }
          .desc{
            margin-top: 18rpx;
            font-size: 32rpx;
            line-height: 46rpx;
            color: #666666
          }
          .item-go-btn{
            margin-top: 18rpx;
            width: 89rpx;
            height: 42rpx;
          }
        }
      }
      .content-item:last-of-type{
        margin-bottom: 32rpx;
      }
    }
  }

</style>
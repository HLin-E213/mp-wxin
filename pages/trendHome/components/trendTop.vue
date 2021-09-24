<!--
* @Description: 
* @Author: mahui
* @Date: 2021/1/19 9:09 PM
-->
<template>
  <div
      @longpress="changeBgPic"
      class="trend-back"
      :style="{backgroundImage: `url(${userInfo.background_img || defaultBg})`, paddingTop: `${fullScreen ? statusBarHeight : ''}`}"
  >
    <img
        v-if="fullScreen"
        src="https://admin.dajxyl.com/oss?path=img/fanhui@2x.png"
        class="trend-back__icon trend-back__back"
        alt=""
        @click="goBack"
    >
    <img
        v-else
        src="../../../static/search.png"
        class="trend-back__icon"
        alt=""
        @click.stop.prevent="toSearch"
    >
    <div class="trend-back-item">
      <div class="trend-back-item__user">
        <img
            @click.stop.prevent="clickHead(userInfo.uid)"
            class="trend-back-item__user-pic"
            :src="userInfo.pic"
            alt=""
        >
        <div class="trend-back-item__user-wrap">
          <p class="trend-back-item__user-wrap-name">{{ userInfo.nickname || '--' }}</p>
          <p v-if="showMyTrend && fullScreen"
              class="trend-back-item__user-wrap-label"
              @click="myTrend"
          >
            我的动态
          </p>
        </div>
      </div>
      <img
          v-if="showMyTrend"
          @click.stop="toPublishTrend"
          class="trend-back-item__camera"
          src="../../../static/publish.png"
          alt=""
      >
    </div>
    <uni-popup ref="popup" type="bottom">
      <div class="dialog">
        <div class="dialog-text" @click="toChoosePic">更换背景图片</div>
        <div class="dialog-text cancel" @click="close">取消</div>
      </div>
    </uni-popup>
  </div>
</template>

<script>
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import { changeBackground } from '../../../api/friends';

    const defaultBg = 'https://admin.dajxyl.com/oss?path=img/default-trend-bg.png';
    const statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px';
    export default {
        name: 'trendTop',
        components: {
            uniPopup,
        },
        props: {
            fullScreen: {
                type: [Boolean, String],
                default: false,

            },
            type: {
                type: [String],
                default: 'others',
            },
            userInfo: {
                type: Object,
                default:() => ({
                    nickname: '',
                    pic: '',
                    background_img: ''
                }),
            },
        },
        data() {
            return {
                defaultBg,
                statusBarHeight,
            };
        },
        computed: {
            showMyTrend() {
                const ownerUid = uni.getStorageSync('ownnerUid');
                return ownerUid === this.userInfo.uid;
            },
        },
        methods: {
            clickHead(uid) {
                this.$emit('clickHead', uid);
            },
            myTrend() {
                this.$emit('clickMyTrend');
            },
            toPublishTrend() {
                uni.navigateTo({
                    url: '/pages/trendPackage/publish/index',
                });
            },
            goBack() {
                uni.navigateBack({
                    delta: 1
                });
            },
            toSearch() {
                uni.navigateTo({
                    url: '/pages/trendPackage/search/index',
                });
            },
            changeBgPic() {
                if (this.type === 'ownner') {
                    this.$nextTick(() => {
                        this.$refs.popup.open();
                    });
                }
            },

            toChoosePic() {
                this.close();
                uni.navigateTo({
                    url: '/pages/trendPackage/components/tailorPic',
                    events: {
                        async accentPicFileFromTailorPic(data) {
                            const { url } = data;
                            await changeBackground(url);
                            console.log('accentPicFileFromTailorPic', data);
                        },
                    }
                });
            },
            close() {
                this.$refs.popup.close();
            },

        },
    };
</script>

<style scoped lang="less">
  .trend-back{
    position: relative;
    height: 380rpx;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    &__icon{
      position: absolute;
      left: 53rpx;
      bottom: 310rpx;
      width: 45rpx;
      height: 45rpx;
    }
    &__back{
      width: 18rpx;
      height: 32rpx;
    }
    &-item{
      position: absolute;
      width: 100%;
      bottom: 26rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &__user{
        display: flex;
        align-items: center;
        &-pic{
          margin-left: 35rpx;
          width: 128rpx;
          height: 128rpx;
          border-radius: 50%;
        }
        &-wrap{
          margin-left: 17rpx;
          &-name{
            font-size: 36rpx;
            color: #FFFFFF;
          }
          &-label{
            font-size: 28rpx;
            color: #FFFFFF;
            text-decoration: underline;
          }
        }
      }
      &__camera{
        width: 70rpx;
        height: 70rpx;
        margin-right: 21rpx;
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
      font-size: 24rpx;
    }
    .cancel{
      border-top:1rpx solid rgba(153, 153, 153, .2);
    }
  }

</style>
<!--
* @Description: 
* @Author: mahui
* @Date: 2021/1/18 8:00 PM
-->
<template>
  <div class="trend-list-item">
    <!--动态标题-->
    <itemTitle
        :user="info.user"
        :time="info.create_time"
        @clickTrendListItemHead="clickTrendListItemHead"
    ></itemTitle>
    <!--动态内容-->
    <div class="trend-list-item__content">

      <p
          class="trend-list-item__content-info"
          v-if="getContent(info.topic).type == 1"
          @click.stop.prevent="clickArticle"
      >
        {{ getContent(info.topic).value || '' }}
      </p>


      <p
          class="trend-list-item__content-info"
          v-if="getContent(info.topic).type == 2"
          @click.stop.prevent="clickArticle"
      >
        <span
            @click.stop.prevent="toSearchResult(info.topic)"
            class="trend-list-item__content-info__tag"
        >{{ getContent(info.topic).hot }}</span>
        {{ getContent(info.topic).value || '' }}
      </p>

      <p
          class="trend-list-item__content-info"
          v-if="getContent(info.topic).type == 3"
          @click.stop.prevent="clickArticle"
      >
        {{ getContent(info.topic).value || '' }}
        <span
            @click.stop.prevent="toSearchResult(info.topic)"
            class="trend-list-item__content-info__tag"
        >{{ getContent(info.topic).hot }}</span>
        {{ getContent(info.topic).value1 || '' }}
      </p>

      <p
          class="trend-list-item__content-info"
          v-if="getContent(info.topic).type == 4"
          @click.stop.prevent="clickArticle"
      >
        {{ getContent(info.topic).value || '' }}
        <span
            @click.stop.prevent="toSearchResult(info.topic)"
            class="trend-list-item__content-info__tag"
        >{{ getContent(info.topic).hot }}</span>
      </p>



      <!--纯图片形式-->
      <div class="trend-list-item__content-pics" v-if="info.type == 2">
        <img
            mode="aspectFill"
            v-for="(imgItem) in info.resource"
            class="trend-list-item__content-pics__pic"
            :key="imgItem.path"
            :src="imgItem.path"
            alt=""
            @click.stop.prevent="toPreview(imgItem.path, info.resource)"
        >
      </div>
      <!--视频+文本形式-->
      <div @click.stop="" class="trend-list-item__content-video" v-if="info.type == 3">
        <video
            class="video"
            :src="info.resource[0].path"
            @error="videoErrorCallback"
            controls
            :id="'videoId' + info.id"
            @play="playVideo(info)"
        ></video>
      </div>
    </div>
    <div class="trend-list-item__footer">
      <div class="trend-list-item__footer-item"
           @click.stop.prevent="toogleLike"
      >
        <img
            v-if="info.isLike"
            class="trend-list-item__footer-item-pic"
            src="../../../static/like-light.png"
            alt=""
        >
        <img
            v-else
            class="trend-list-item__footer-item-pic"
            src="../../../static/like-grey.png"
            alt=""
        >
        {{ info.like || '' }}
      </div>
      <div class="trend-list-item__footer-item">
        <img
            class="trend-list-item__footer-item-pic"
            src="../../../static/comment.png"
            alt=""
        >{{ info.comment_count || '' }}
      </div>
      <div
          class="trend-list-item__footer-item"
          @click.stop.prevent="toShare(info)"
      >
        <img
            class="trend-list-item__footer-item-pic"
            src="../../../static/share.png"
            alt=""
        >分享
      </div>
    </div>
  </div>
</template>

<script>
  import itemTitle from './itemTitle';

    export default {
        name: 'trendItem',
        components: {
            itemTitle,
        },
        props: {
            info: {},
            list: {
              type: Array,
              default: () => ([]),
            },
        },
        data() {
            return {};
        },
        methods: {
            getContent(topic) {
                if (!topic) {
                    return {
                        type: 1, // 1为没有热词 2为热词在前面 3为热词在中间 4为热词在末尾
                        value: topic,
                    };
                }
                const topicArr = topic.split('#');
                const hasHot = topicArr.length - 1 === 2;
                if (!hasHot) {
                    return {
                        type: 1, // 1为没有热词 2为热词在前面 3为热词在中间 4为热词在末尾
                        value: topic,
                    };
                } else {
                    if (topicArr[0] === '') {
                        return {
                            type: 2,
                            hot: `#${topicArr[1]}#`,
                            value: topicArr[2],
                        };
                    } else if (topicArr[2] === '') {
                        return {
                            type: 4,
                            hot: `#${topicArr[1]}#`,
                            value: topicArr[0],
                        };
                    } else {
                        return {
                            type: 3,
                            hot: `#${topicArr[1]}#`,
                            value: topicArr[0],
                            value1: topicArr[2],
                        };
                    }
                }
            },
            videoErrorCallback(e) {
                console.log('videoErrorCallback', e.target.errMsg);
                // uni.showModal({
                //     content: e.target.errMsg,
                //     showCancel: false,
                // });
            },
            // 点击播放video
            playVideo(info) {
              const videoContext = uni.createVideoContext(`videoId${info.id}`, this);
              this.$emit('playVideo', {
                videoContext,
                id: info.id,
              });
            },
            toSearchResult(topic) {
                const realHot = this.getContent(topic).hot;
                uni.navigateTo({
                    url: `/pages/trendPackage/searchResult/index?keywords=${realHot}`,
                });
            },
            clickTrendListItemHead(uid) {
                this.$emit('clickTrendListItemHead', uid)
            },
            async toogleLike() {
                this.$emit('clickToogleLike');

            },
            async clickArticle() {
                this.$emit('clickArticle');

            },
            toPreview(img, imgArr) {
                this.$emit('previewPic', img, imgArr);
            },
            toShare(info) {
                uni.setClipboardData({
                    data: info.share_url,
                });
                uni.showToast({
                    title: '链接已复制，可以粘贴发送给好友',
                    icon: 'none',
                    duration: 2000
                })
            }
        },
    };
</script>

<style scoped lang="less">
  .trend-list-item {
    padding: 42rpx 20rpx 20rpx 20rpx;
    background-color: #FFFFFF;
    &__content{
      padding-top: 20rpx;
      background-color: #FFFFFF;
      &-info{
        padding: 16rpx 0 28rpx 0;
        color: #333333;
        font-size: 28rpx;
        &__tag{
          margin-left: 4rpx;
          color: #FD7600;
        }
      }
      &-pics{
        display: flex;
        flex-wrap: wrap;
        &__pic{
          width: 228rpx;
          height: 228rpx;
          margin-bottom: 20rpx;
          margin-left: 13rpx;
          border-radius: 6rpx;
        }
        &__pic:nth-of-type(3n+1){
          margin-left: 0;
        }
      }
      &-info-tuwen{
        background: #F8F8F8;
        border-radius: 6rpx;
        margin-bottom: 20rpx;
        &-content{
          padding: 15rpx;
          display: flex;
          align-items: center;
          &-pic{
            width: 150rpx;
            height: 150rpx;
            border-radius: 6rpx;
          }
          &-text{
            flex: 1;
            margin-left: 20rpx;
            color: #333333;
            font-size: 28rpx;
          }
        }
      }
      &-video{
        display: flex;
        margin-bottom: 20rpx;
        border-radius: 6rpx;
        overflow: hidden;
        .video{
          flex: 1;

        }
      }
    }
    &__footer{
      display: flex;
      align-items: center;
      padding-top: 20rpx;
      font-size: 28rpx;
      color: #666666;
      border-top: 1rpx solid rgba(153, 153, 153, .2);
      &-item{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        &-pic{
          width: 34rpx;
          height: 34rpx;
          margin-right: 8rpx;
        }
      }
    }
  }
</style>
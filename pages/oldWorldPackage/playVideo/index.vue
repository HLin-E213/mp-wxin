<template>
  <view class="play-video-page-wrap">
    <img
        @click="back"
        class="choose-wrap-back"
        src="https://admin.dajxyl.com/oss?path=img/fanhui@2x.png"
        alt=""
    />
    <swiper
        class="swiper"
        :autoplay="false"
        vertical="true"
        :current="currentIndex"
        @change="changeVideo"
        @animationfinish="animationfinish"
    >
      <swiper-item
          v-for="(item ,index) in list"
          :key="index"
      >
        <view class="video-wrap">
          <video
              v-if="index === currentIndex || index === currentIndex -1 || index === currentIndex + 1"
              :src="item.src"
              style="object-fit: contain"
              loop="true"
              :show-play-btn="false"
              :enable-progress-gesture="false"
              :id="`videoId${item.id}`"
              :object-fit="'contain'"
              :play-btn-position="'center'"
              @click="clickVideo"
              @error="playError"
              class="video"
              :controls="false"
          >
          </video>
        </view>
      </swiper-item>
    </swiper>
    <view class="view-bottom">
      <view class="view-bottom-wrap">
        <view class="view-bottom-text ellipsis">{{ curVideo.title || '' }}</view>
        <view class="view-bottom-text-content">
          {{ curVideo.desc || '' }}
        </view>
      </view>
    </view>

    <view class="view-right">
      <img
          :src="curVideo.pic"
          class="avater img"
      />
      <view class="fixed-item">
        <img
            v-if="curVideo.is_like"
            class="fixed-item_img"
            src="https://admin.dajxyl.com/oss?path=video/upload/202108/zan1@2x.png"
            alt=""
            @click.stop="loveVideo(curVideo.id, curVideo.is_like, currentIndex)"
        />
        <img
            v-else
            class="fixed-item_img"
            @click.stop="loveVideo(curVideo.id, curVideo.is_like, currentIndex)"
            src="https://admin.dajxyl.com/oss?path=video/upload/202108/zan2@2x.png"
            alt=""

        />
        <view class="fixed-item_text">{{ curVideo.like_num || '' }}</view>
      </view>
      <view class="fixed-item" @click.stop="open()">
        <img class="fixed-item_img" src="../../../static/pinglun@2x.png" alt="" />
        <view class="fixed-item_text">{{ curVideo.comment_num || '' }}</view>
      </view>
      <button class="share-btn fixed-item" open-type="share">
        <img class="fixed-item_img" src="../../../static/share-fill@2x.png" alt="" />
        <view class="fixed-item_text">
          分享
        </view>
      </button>
      <view class=" fixed-item" @click.stop="downloadVideo(curVideo)">
        <img class="fixed-item_img" src="../../../static/download.png" alt="" />
        <view class="fixed-item_text">
          下载
        </view>
      </view>
    </view>
    <CommentPopup :vid="curVid" ref="commentsPopup" />
    <movable-area class="play-video-movable-area" v-if="download.showProgress">
      <movable-view
      class="movable-view"
      direction="all"
      x="500rpx"
      y="1100rpx"
      >
        <Progress :percent="download.progress" type="circle" :stroke-width="8"></Progress>
      </movable-view>
    </movable-area>
  </view>
</template>

<script>
import { getVideoInfo, videoLove } from '@/api';
import CommentPopup from './components/commentModal';
import Progress from './components/progress';
import { getName } from '../../../utils/tools';

const DOWNLOAD_STATUS = {
  DOWNLOADING: 'DOWNLOADING', // 下载中
  SUCCESS: 'SUCCESS', // 下载成功
  FAIL: 'FAIL', //  下载失败
};

export default {
  name: "play-video",
  components: {
    CommentPopup,
    Progress,
  },
  watch: {
    currentIndex(newVal) {
      const last = this.list.length - 1;
      if (newVal && newVal === last && this.videoPageConfig.page < this.totalPage) {
        this.videoPageConfig.page = this.videoPageConfig.page + 1;
        this.vid=this.list[last].id;
        this.getVideoDetail();
      } else if (newVal === last && this.videoPageConfig.page === this.totalPage) {
        uni.showToast({
          title: '已经是最后一个视频了',
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  data() {
    return {
      list: [],
      currentIndex: 0,
      showPopup: false,
      vid: '',
      totalPage: 1,
      videoPageConfig: {
        page: 1,
        pageSize: 10,
      },
      videoContext: null,
      isPlaying: false,
      download: {
        progress: 0,
        showProgress: false,
        status: DOWNLOAD_STATUS.SUCCESS // 默认为下载成功的状态
      }
    }
  },
  computed: {
    curVid() {
      const { id = '' } = this.list[this.currentIndex] || {};
      return id;
    },
    curVideo() {
      return this.list[this.currentIndex] || {}
    },
    curCommentNum() {
      const { comment_num = '' } = this.list[this.currentIndex] || {};
      return comment_num;
    }
  },
  onShareAppMessage() {
    return {
      title: '大爱金孝',
      path: '/pages/oldWorldPackage/playVideo/index?vid=' + this.curVid,
    };
  },
  async onLoad(options) {
    // 将视频列表页面带过来的相关ID和页面信息与视频播放页面进行绑定
    const { vid, page = 1, index = 0, totalPage = 0 } = options;
    this.vid = vid;
    this.totalPage = Number(totalPage);
    const videoList = uni.getStorageSync('videoList');
    this.videoPageConfig.page = Number(page);
    this.list = JSON.parse(videoList);
    this.currentIndex = Number(index);
    this.videoContext = uni.createVideoContext(`videoId${vid}`, this);
    this.videoContext.play();
    this.isPlaying = true;
    if (Number(page) < Number(totalPage)) {
      await this.getVideoDetail();
    }
  },
  methods: {
    back() {
      uni.navigateBack({
        delta:1
      });
    },
    clickVideo() {
      if (!this.showPopup) {
        if (this.isPlaying) {
          this.videoContext.pause();
          this.isPlaying = false;
        } else {
          this.videoContext.play();
          this.isPlaying = true;
        }
      } else {
        this.showPopup = false;
        this.close();
      }
    },
    playError(e) {
      console.log('playError', e);
      return uni.showToast({
        title: `视频播放出错「${e.detail.errMsg || 'error'}」`,
        duration: 2000,
        icon: 'none',
      });
    },
    changeVideo(e) {
      this.videoContext && this.videoContext.pause();
      const index = e.detail.current;
      const item = this.list[index];
      this.currentIndex = index;
      this.isPlaying = false;
      this.videoContext = uni.createVideoContext(`videoId${item.id}`, this);
      this.videoContext.play();
      this.isPlaying = true;
    },
    animationfinish() {
      this.clickVideo();
      this.$nextTick(() => {
        this.clickVideo();
      }, 100);
    },
    open() {
      this.$nextTick(() => {
        this.$refs.commentsPopup && this.$refs.commentsPopup.open();
        this.showPopup = true;
      }, 100);
    },
    close() {
      this.$nextTick(() => {
        this.$refs.commentsPopup && this.$refs.commentsPopup.close();
        this.showPopup = false;
      }, 100);
    },
    downloadVideo(video) {
      const vm  = this;
      if(vm.download.progress) {
        uni.showToast({
          title: '正在下载其他视频，请稍后',
          icon: 'none',
          duration: 2000
        });
        return false;
      }
      vm.download.showProgress = true;
      const { src, title } = video;
      const downloadTask = uni.downloadFile({
        url: src,
        success(res) {
          const { tempFilePath, statusCode } = res;
          if (statusCode === 200) {
            vm.download.progress = 0;
            vm.download.showProgress = false;
            uni.saveVideoToPhotosAlbum({
              filePath: tempFilePath,
              success() {
                uni.showToast({
                  title: `${getName(title)}视频下载成功`,
                  icon: 'none',
                  duration: 2000
                })
              }
            });
          }
        },
        fail(e) {
          console.log('fail', e);
          uni.showToast({
            title: JSON.stringify(e),
            icon: 'none',
            duration: 200000
          });
          vm.download.showProgress = false;
          vm.download.progress = 0;
        }
      });
      downloadTask.onProgressUpdate((res) => {
        this.download.progress = res.progress;
      });
      console.log('下载', video, this.download);
    },
    async loveVideo(vid, isLove, index) {
      try {
        uni.showLoading({title: '数据加载中，请稍后'});;
        await videoLove(vid);
        this.list[index].is_like = !isLove;
        const likeNum = this.list[index].like_num;
        if (isLove) {
          this.list[index].like_num = parseInt(likeNum) - 1;
        } else {
          this.list[index].like_num = parseInt(likeNum) + 1;
        }
      } finally {
        uni.hideLoading();
      }
    },
    changePopup(isShow) {
      this.showPopup = isShow;
    },
    async getVideoDetail(cb) {
      uni.showLoading({title: '数据加载中，请稍后'});;
      try {
        const res = await getVideoInfo(this.vid, this.videoPageConfig.page, this.videoPageConfig.pageSize);
        if (this.videoPageConfig.page === 1) {
          this.list = [...(res.data.data.info || [])];
        } else {
          this.list = [...this.list, ...(res.data.data.info || [])];
        }
        if (this.currentIndex === 0) {
          this.list.forEach((item, index) => {
            if (item.id === this.vid) {
              this.currentIndex = index;
            }
          })
        }
        this.totalPage = res.data.data.totalPage;
        cb && cb();
      } finally {
        uni.hideLoading();
      }
    },
  }
}
</script>
<style>
  page {
    background-color: #000000;
  }
</style>

<style lang="less" scoped>
  page{
    background-color: #000000;
  }
  .play-video-movable-area{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 999;
    .movable-view {
      pointer-events: auto;
      width: 128rpx;
      height: 128rpx;
    }
  }
  .play-video-page-wrap{
    position: relative;
    .view-right {
      position: fixed;
      bottom: 212rpx;
      right: 20rpx;
      z-index: 10;
      text-align: center;
      .fixed-item{
        display: flex;
        align-items: center;
        flex-direction: column;
        color: #FFF;
        &_img{
          width: 72rpx;
          height: 72rpx;
        }
        &_text{
          font-size: 30rpx;
          color: #FFF;
        }
      }
    }
    .view-bottom {
      box-sizing: border-box;
      position: fixed;
      width: 100%;
      height: 212rpx;
      bottom: 0;
      left: 0;
      //background-image: url("../../../static/play-bottom.png");
      font-size: 14px;
      color: #ffffff;
      .view-bottom-wrap{
        margin: 50rpx 41rpx 32rpx 21rpx;
      }
    }
  }
.swiper{
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
.video {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.video-wrap{
  position: relative;
}

.avater {
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  border-color: #ffffff;
}

.img {
  height: 108rpx;
  width: 108rpx;
}

@keyframes rotating {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
.view-bottom-text-content {
  margin-top: 15rpx;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.view-bottom-text {
  color: #ffffff;
  font-size: 34rpx;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-content-text {
  color: #ffffff;
  font-size: 16px;
  line-height: 50rpx;
  height: 100rpx;
  overflow: hidden;
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
.share-btn{
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
  color: #FFFFFF;
  font-size: 30rpx;
}
.share-btn::after{
  border: none;
  outline: none;
}
</style>

<!--
* @Description:
* @Author: mahui
* @Date: 2021/1/20 10:55 AM
-->
<template>
  <layout
      title="发布动态"
      contentBackgroundColor="#FFFFFF"
      :showFooter="!showPopup"
      footerHeight="186"
      :shadow="false"
  >
    <div class="publish-content">
      <div class="textarea-wrap">
        <textarea
            class="textarea"
            :maxlength="-1"
            v-model="topic"
            placeholder-class="textarea-placeholder"
            placeholder="分享您的快乐时光......"
        ></textarea>
      </div>
      <div class="resource-content-wrap">
        <div
            class="resource-wrap"
            v-for="(item, index) in resource"
            :key="item"
        >
          <img
              mode="aspectFill"
              class="resource-wrap__delete"
              src="../../../static/delete.png"
              alt=""
              @click="deleteResource(index)"
          >
          <img v-if="type == 2" class="resource-wrap__img" :src="item.url" alt="">
          <video
              v-if="type == 3"
              class="resource-wrap__video"
              :src="item.url"
              @error="videoErrorCallback"
              controls
              :poster="item.coverUrl"
          ></video>
        </div>
        <div
            class="resource-wrap"
            @click="open"
            v-if="showAddResource"
        >
          <img class="resource-wrap__icon" src="../../../static/tianjia.png" alt="">
          <div class="resource-wrap__text">照片或视频</div>
        </div>
      </div>
    </div>
    <div slot="footer" class="publish-btn-wrap">
      <div class="publish-btn" @click="doArticleAdd">
        发布
      </div>
    </div>
    <uni-popup ref="popup" type="bottom" @change="popupChange">
      <div class="dialog">
        <div class="dialog-text" @click="selectResource(2)">添加图片</div>
        <div class="dialog-text cancel" @click="selectResource(3)">添加视频</div>
        <div class="dialog-text close" @click="close()">取消</div>
      </div>
    </uni-popup>
  </layout>

</template>

<script>
    import layout from '@/components/layout/index.vue';
    import VODUpload from '../../../lib/aliyun-upload-sdk-1.0.1.min';
    import { uploadVideoauth, articleAdd } from '../../../api/friends';
    import uniPopup from '@/components/uni-popup/uni-popup.vue';
    import { updateUserImg } from '../../../api/index.js';

    export default {
        name: 'index',
        components: {
            layout,
            uniPopup,
        },
        data() {
            return {
                resource: [],
                videoId: '',
                type: 1, // 类型1=文本 2=图片 3=视频
                showPopup: false,
                topic: '',
                uploader: null,
            };
        },
        mounted() {
            console.log('VODUpload', VODUpload);
        },
        computed: {
            showAddResource() {
                const { type, resource } = this;
                return ((type == 1)
                        || (type == 2 && resource.length < 9)
                        || type == 3 && resource.length < 1);
            },
        },
        methods: {
            deleteResource(index) {
                this.resource.splice(index, 1);
            },
            popupChange(e) {
                console.log(e);
                const { show } = e;
                this.showPopup = show;
            },
            async doArticleAdd() {
                const resource = this.resource.map(({ url }) => (url));
                if (this.resource.length === 0 && !this.videoId) {
                    this.type = 1;
                }
                try {
                    uni.showLoading({title: '数据加载中，请稍后'});;
                    if (this.type == 2) {
                        await articleAdd(
                            this.topic,
                            this.type,
                            '',
                            resource
                        );
                    } else if (this.type == 3) {
                        await articleAdd(
                            this.topic,
                            this.type,
                            this.videoId,
                            []
                        );
                    } else if(this.type == 1) {
                        await articleAdd(
                            this.topic,
                            this.type,
                            '',
                            []
                        );
                    }

                    uni.showToast({
                        title: '发布动态成功',
                        icon: 'none',
                        duration: 3000
                    });
                    uni.navigateBack();
                } finally {
                    uni.hideLoading();
                }
            },
            uploadResource() {
                const length =  9 - this.resource.length, vm = this;
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
            open() {
                this.$nextTick(() => {
                    this.showPopup = true;
                    this.$refs.popup.open();
                });

            },
            selectResource(type) {
                this.close();
                if (this.resource.length && Number(type) === 3) return false;
                this.type = type;
                if (Number(type) === 2) {
                    this.uploadResource();
                } else if(Number(type) === 3) {
                    this.upLoadVideo();
                }
            },
            close() {
                this.showPopup = false;
                this.$refs.popup.close();
            },
            videoErrorCallback(e) {
                uni.showModal({
                    content: e.target.errMsg,
                    showCancel: false,
                });
            },
            upLoadVideo() {
                const vm = this;
                uni.chooseVideo({
                  compressed: false,
                    success: async function(res) {
                        console.log('upLoadVideo', res);
                        uni.showLoading({title: '数据加载中，请稍后'});;
                        var file = {url: res.tempFilePath, coverUrl: res.thumbTempFilePath};
                        vm.uploadVideoauth(res.tempFilePath, file);
                    },
                    fail: function(res) {
                        console.log('fail', res);
                    },
                    complete: function(res) {
                        console.log('complete', res);
                    },
                })
            },
            async uploadVideoauth (tempFilePaths, file) {
                const res = await uploadVideoauth(tempFilePaths);
                const { UploadAddress, UploadAuth, video_id: videoId} = res.data.data.info;
                const uploadAddress = UploadAddress;
                const uploadAuth = UploadAuth;
                this.videoId = videoId;
                const vm = this;
                this.uploader = await new VODUpload({
                    //阿里账号ID，必须有值
                    userId: 'LTAI4Fhkppt6hhyr8YKXYPSH',
                    //网络原因失败时，重新上传次数，默认为3
                    retryCount: 3,
                    //网络原因失败时，重新上传间隔时间，默认为2秒
                    retryDuration: 2,
                    // 添加文件成功
                    addFileSuccess: function (uploadInfo) {
                        console.log("addFileSuccess" + JSON.stringify(uploadInfo))
                    },
                    //开始上传
                    'onUploadstarted': function (uploadInfo) {
                        // console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
                        //上传方式1，需要根据uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
                        //从点播服务获取的uploadAuth、uploadAddress和videoId，设置SDK
                        vm.uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId);
                    },
                    //文件上传成功
                    'onUploadSucceed': function (uploadInfo) {
                        uni.hideLoading();
                        const { url, coverUrl } = uploadInfo;
                        vm.resource.push({
                          url,
                          coverUrl,
                        });
                        console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
                    },
                    'onUploadCanceled': function(e, t) {
                      uni.hideLoading();
                      console.log('onUploadCanceled file', e, t);
                    },
                    //文件上传失败
                    'onUploadFailed': function (uploadInfo, code, message) {
                        uni.hideLoading();
                        console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
                    },
                    //文件上传进度，单位：字节
                    'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
                        console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(loadedPercent * 100) + "%");
                    },
                    //上传凭证超时
                    'onUploadTokenExpired': function (uploadInfo) {
                        console.log("onUploadTokenExpired");
                        //实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
                        //从点播服务刷新的uploadAuth，设置到SDK里
                        vm.uploader.resumeUploadWithAuth(uploadAuth);
                    },
                    //全部文件上传结束
                    'onUploadEnd':function(uploadInfo){
                        console.log("onUploadEnd: uploaded all the files");
                    }
                });
                console.log('uploader', this.uploader);
                console.log('file', file);
                // var file = {url: res.tempFilePath, coverUrl: res.thumbTempFilePath};
                var userData = '{"Vod":{}}';
                this.uploader.addFile(file, null, null, null, userData);
                this.uploader.startUpload();
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
  .publish-content{
    height: 100%;
    background-color: #FFFFFF;
    .textarea-wrap{
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20rpx;
      .textarea{
        padding: 20rpx;
        width: 690rpx;
        height: 248rpx;
        background: #F8F8F8;
        border-radius: 10rpx;
        font-size: 28rpx;
        color: #333333;
      }
      .textarea-placeholder{
        color: #999999;
      }
    }
    .resource-content-wrap{
      padding: 20rpx;
      display: flex;
      flex-wrap: wrap;
      .resource-wrap{
        position: relative;
        display: flex;
        flex-direction: column;
        width: 228rpx;
        height: 228rpx;
        margin-left: 13rpx;
        margin-top: 13rpx;
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
  .dialog{
    border-radius: 24rpx 24rpx 0 0;
    background-color: #F8F8F8;
    .dialog-text{
      height: 100rpx;
      line-height: 100rpx;
      text-align: center;
      font-size: 24rpx;
      background-color: #FFFFFF;
    }
    .cancel{
      border-top:1rpx solid rgba(153, 153, 153, .2);
    }
    .close{
      margin-top: 20rpx;
    }
  }
</style>

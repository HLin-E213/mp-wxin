<!--实名认证-->
<template>
  <view class="authentication">
    <view class="head">
      <WhiteHead :title="title"></WhiteHead>
    </view>
    <!--顶部姓名身份证输入-->
    <view class="authentication_info">
      <view class="authentication_info_name">
        <view class="authentication_info_name_left">
          <h4>姓名</h4>
        </view>
        <view class="authentication_info_name_right">
          <input type="text" value="" placeholder="请输入本人姓名" v-model="name"/>
        </view>
      </view>
      <!--身份证-->
      <view class="authentication_info_name" style="margin-top: 0.75rem;">
        <view class="authentication_info_name_left">
          <h4>身份证号码</h4>
        </view>
        <view class="authentication_info_name_right">
          <input type="text" value="" placeholder="请输入身份证号码" v-model="identity"/>
        </view>
      </view>
    </view>
    <!--上传身份附件信息-->
    <view class="identity_upload">
      <view class="identity_upload_title">
        <b></b>
        <h4>上传附件信息</h4>
      </view>
      <view class="identity_upload_content">
        <!--上传身份证头像面-->
        <view class="identity_upload_content_list" @click="uploadIdentify">
          <view class="identity_upload_content_list_top">
            <image src="https://admin.dajxyl.com/oss?path=img/shenfenzhengzhengmian@2x.png" mode=""></image>
          </view>
          <view class="identity_upload_content_list_bottom">
            <p>上传身份证头像面</p>
          </view>
        </view>
        <!--上传身份证国徽面-->
        <view class="identity_upload_content_list" @click="uploadIdentifyOtherside">
          <view class="identity_upload_content_list_top">
            <image src="https://admin.dajxyl.com/oss?path=img/shenfenzhengfanmian@2x.png" mode=""></image>
          </view>
          <view class="identity_upload_content_list_bottom">
            <p>上传身份证国徽面</p>
          </view>
        </view>
        <!--上传手持身份证照片-->
        <view class="identity_upload_content_list" @click="uploadIdentifyHold">
          <view class="identity_upload_content_list_top">
            <image src="https://admin.dajxyl.com/oss?path=img/zhengjian@2x.png" mode=""></image>
          </view>
          <view class="identity_upload_content_list_bottom">
            <p>上传手持身份证照片</p>
          </view>
        </view>
      </view>
    </view>
    <!--提醒-->
    <view class="notice">
      <p>提醒:提交成功后,会在2个工作日内进行审核,请耐心等待。</p>
    </view>
    <!--提交按钮-->
    <view class="btn">
      <button type="primary">提交审核</button>
    </view>
  </view>
</template>

<script>
import WhiteHead from '../../components/whiteHead/whiteHead.vue';
import {mapState, mapMutations} from 'vuex';

export default {
  components: {
    WhiteHead,
  },
  data() {
    return {
      title: '实名认证',
      name: '',
      identity: '',
    }
  },
  methods: {
    /*上传身份证正面*/
    uploadIdentify: function () {
      uni.chooseImage({
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          uni.uploadFile({
            url: 'https://www.example.com/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: (uploadFileRes) => {
              console.log(uploadFileRes.data);
            }
          });
        }
      });
    },
    /*上传身份证反面*/
    uploadIdentifyOtherside: function () {
      uni.chooseImage({
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          uni.uploadFile({
            url: 'https://www.example.com/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: (uploadFileRes) => {
              console.log(uploadFileRes.data);
            }
          });
        }
      });
    },
    /*上传手持身份证照片*/
    uploadIdentifyHold: function () {
      uni.chooseImage({
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          uni.uploadFile({
            url: 'https://www.example.com/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              'user': 'test'
            },
            success: (uploadFileRes) => {
              console.log(uploadFileRes.data);
            }
          });
        }
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

.authentication {
  width: 100%;
  height: 100%;
  @item();
  flex-wrap: wrap;
  background: #FAFAFA;

  .head {
    width: 100%;
    height: 5rem;
    display: flex;
	position: fixed;
	top: 0;
	z-index: 10;
  }

  .authentication_info {
    width: 100%;
    height: 6.97rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 5.75rem;
    border-radius: 0.5rem;

    .authentication_info_name {
      width: 94%;
      height: 3.11rem;
      background: #FFFFFF;
      @item();
      border-radius: 0.5rem;

      .authentication_info_name_left {
        width: 47%;
        height: 100%;
        @item();
        justify-content: flex-start;

        h4 {
          // width:1.75rem;
          // height:0.875rem;
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(52, 52, 52, 1);
        }
      }

      .authentication_info_name_right {
        width: 47%;
        height: 100%;
        @item();
        justify-content: flex-end;

        input {
          // width:5.44rem;
          height: 0.785rem;
          font-size: 0.815rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(136, 136, 136, 1);
          text-align: end;
        }
      }
    }
  }

  .identity_upload {
    width: 100%;
    // height: 30.845rem;
    @item();
    flex-wrap: wrap;

    .identity_upload_title {
      width: 94%;
      height: 0.97rem;
      @item();
      justify-content: flex-start;
      margin-top: 1.345rem;

      b {
        width: 0.155rem;
        height: 0.94rem;
        background: rgba(69, 151, 244, 1);
        border-radius: 1rem;
      }

      h4 {
        // width:11.885.94rem;
        // height:0.97rem;
        font-size: 1rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        margin: -0.1rem 0 0 0.2rem;
      }
    }

    .identity_upload_content {
      // width: 85.34%;
      width: 90%;
      height: 22.5rem;
      @item();
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 1.095rem;

      .identity_upload_content_list {
        width: 8.5rem;
        // width: 38.4%;
        height: 10.375rem;
        background: rgba(255, 255, 255, 1);
        border-radius: 0.5rem;
        @item();
        flex-wrap: wrap;

        .identity_upload_content_list_top {
          width: 100%;
          height: 8.125rem;
          @item();

          image {
            width: 6.25rem;
            height: 4.25rem;
          }
        }

        .identity_upload_content_list_bottom {
          width: 100%;
          height: 2.25rem;
          @item();
          background: #4597F4;
          border-radius: 0 0 0.5rem 0.5rem;

          p {
            // width:6.845rem;
            // height:0.845rem;
            font-size: 0.875rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            color: #FFFFFF;
          }
        }
      }
    }
  }

  .notice {
    width: 94%;
    height: 1.5rem;
    @item();
    justify-content: flex-start;

    p {
      height: 0.75rem;
      font-size: 0.74rem;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(136, 136, 136, 1);
    }
  }

  .btn {
    width: 100%;
    height: 3.065rem;
    @item();
    margin: 1.875rem 0 1.625rem 0;

    button {
      width: 88%;
      height: 3.065rem;
      border-radius: 1.53rem;
      background: #4597F4;
      font-size: 1.125rem;
      font-family: PingFang SC;
      font-weight: 500;
      color: rgba(255, 255, 255, 1);
    }
  }
}
</style>

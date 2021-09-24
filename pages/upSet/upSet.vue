<!--设置页面-->
<template>
  <view class="upSet">
    <uni-nav-bar status-bar :title="title"></uni-nav-bar>
    <!--用户信息-->
    <view class="upSet_content">
      <view class="upSet_content_list" style="margin-top: 1.45rem;">
        <view class="upSet_content_list_left">
          <h4>头像</h4>
        </view>
        <view class="upSet_content_list_right" @click="upload">
          <image :src="imgUrl"></image>
        </view>
      </view>
      <view class="upSet_content_list" @click="goToModifyNick">
        <view class="upSet_content_list_left">
          <h4>昵称</h4>
        </view>
        <view class="upSet_content_list_right">
          <p>{{ nickName }}</p>
          <image class="img" src="https://admin.dajxyl.com/oss?path=img/fanhuixiangqing@2x.png" mode=""></image>
        </view>
      </view>
      <view class="upSet_content_list">
        <view class="upSet_content_list_left">
          <h4>性别</h4>
        </view>
        <picker class="upSet_content_list_right" @change="bindPickerChange" :value="sex_index" :range="sex_array">
          <p style="display: initial;">{{ sex_array[sex_index] }}</p>
          <image class="img" src="https://admin.dajxyl.com/oss?path=img/fanhuixiangqing@2x.png" mode=""></image>
        </picker>
      </view>
      <view class="upSet_content_list">
        <view class="upSet_content_list_left">
          <h4>生日</h4>
        </view>
        <picker class="upSet_content_list_right"
                mode="date"
                :value="birthDay" :start="startDate" :end="endDate"
                @change="bindDateChange">
          <p style="display: initial;">{{ birthDay }}</p>
          <image class="img" src="https://admin.dajxyl.com/oss?path=img/fanhuixiangqing@2x.png" mode=""></image>
        </picker>
      </view>
      <view class="upSet_content_list">
        <view class="upSet_content_list_left">
          <h4>手机号</h4>
        </view>
        <view class="upSet_content_list_right">
          <p>{{ userInfo.phone }}</p>
          <image class="img" src="https://admin.dajxyl.com/oss?path=img/fanhuixiangqing@2x.png" mode=""></image>
        </view>
      </view>
      <view class="upSet_content_list">
        <view class="upSet_content_list_left">
          <h4>版本号</h4>
        </view>
        <view class="upSet_content_list_right">
          <p>{{ numberVersion }}</p>
          <image class="img" src="https://admin.dajxyl.com/oss?path=img/fanhuixiangqing@2x.png" mode=""></image>
        </view>
      </view>
      <view class="upSet_content_list" @click="goLogOff">
        <view class="upSet_content_list_left">
          <h4>永久注销</h4>
        </view>
        <view class="upSet_content_list_right">
          <image class="img" src="https://admin.dajxyl.com/oss?path=img/fanhuixiangqing@2x.png" mode=""></image>
        </view>
      </view>
      <view class="upSet_content_list" style="border-bottom: none;" @click="goTolegal">
        <view class="upSet_content_list_left">
          <h4>用户协议及隐私政策</h4>
        </view>
        <view class="upSet_content_list_right">
          <image class="img" src="https://admin.dajxyl.com/oss?path=img/fanhuixiangqing@2x.png" mode=""></image>
        </view>
      </view>
      <view class="btn">
        <button type="primary" plain="true" @click="logout">退出登录</button>
      </view>
    </view>
  </view>
</template>
<script>
import ImageCropper from '../../components/uniapp-nice-cropper/uniapp-nice-cropper.vue';
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {WxMiniVersion} from "../../utils/config";
import {updateUserData} from '../../api/index.js';

export default {
  components: {
    uniNavBar,
    ImageCropper,
  },
  data() {
    return {
      title: '设置',
      numberVersion: '1.0.0',
      sex_array: ['女', '男'],
    }
  },
  mounted() {
    this.numberVersion = WxMiniVersion;
  },
  computed: {
    ...mapState('users', {
      'userInfo': 'userInfo',
    }),
    startDate() {
      return this.getDate('start');
    },
    endDate() {
      return this.getDate('end');
    },
    nickName(){
      return this.userInfo.nickname;
    },
    birthDay(){
      return this.userInfo.birthday;
    },
    imgUrl(){
      return this.userInfo.pic;
    },
    sex_index(){
      return this.userInfo.sex;
    },
  },
  methods: {
    ...mapMutations('users', {
      'setUserInfoData': 'setUserInfoData',
    }),
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === 'start') {
        year = year - 200;
      }

      month = month > 9 ? month : '0' + month;
      day = day > 9 ? day : '0' + day;
      return `${year}-${month}-${day}`;
    },
    bindDateChange: function (e) {
      this.userInfo.birthday = e.target.value;
      this.$store.commit('users/setUserInfoData',this.userInfo);
      this.submit(this.birthDay,'');
    },
    bindPickerChange: function (e) {
      this.userInfo.sex = e.target.value;
      this.$store.commit('users/setUserInfoData',this.userInfo);
      this.submit('',this.sex_index);
    },
    submit(birthday,sex) {
      let res = updateUserData(birthday,null,null,sex,null);
      res.then(function (e) {
        console.log(e);
        return uni.showToast({
          title: '修改成功',
          mask: true,
        });
      });
    },
    goTolegal: function () {
      uni.navigateTo({
        url: '/pages/documentsLegal/documentsLegal'
      })
    },
    goLogOff: function () {
      uni.navigateTo({
        url: '/pages/logOff/index'
      })
    },
    goToModifyNick: function () {
      return uni.navigateTo({
        url: '/components/modifyInfo/modifyInfo',
      })
    },
    upload: function () {
      uni.navigateTo({
        url: '/components/uploadPicture/uploadPicture'
      })
    },
    logout: function () {
      uni.clearStorageSync();
      this.$store.commit('users/setUserInfoData', {});
      return uni.reLaunch({
        url: '/pages/main/main'
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

.upSet {
  width: 100%;
  height: 100%;
  background: #FFFFFF;

  .head {
    width: 100%;
    height: 5rem;
    display: flex;
    position: absolute;
    z-index: 10;
    top: 0;
  }

  .upSet_content {
    width: 100%;
    // height: 35.8625rem;
    @item();
    flex-wrap: wrap;

    .upSet_content_list {
      width: 100%;
      // height: 4.3rem;
      height: 3.44rem;
      @item();
      border-bottom: 1px solid #e0e0e0;

      .upSet_content_list_left {
        width: 47%;
        height: 100%;
        @item();
        justify-content: flex-start;

        h4 {
          // width: 2.23125rem;
          // height: 1.1375rem;
          // font-size: 1.175rem;
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: #343434;
        }
      }

      .upSet_content_list_right {
        width: 47%;
        height: 100%;
        @item();
        justify-content: flex-end;

        image {
          width: 2.89375rem;
          height: 2.89375rem;
          border-radius: 50%;
        }

        p {
          // width: 4.3rem;
          // height: 0.815rem;
          font-size: 0.875rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: #9A9A9A;
        }

        .img {
          width: 0.69rem;
          height: 0.69rem;
          margin: 0.1rem 0 0 0.285rem;
        }
      }
    }

    .btn {
      width: 100%;
      // height: 9.005rem;
      height: 6.19rem;
      @item();
      // margin-top: 4.97rem;
      button {
        width: 86.67%;
        height: 2.815rem;
        border: 1px solid #fd7600;
        border-radius: 1.5rem;
        font-size: 0.94rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: #fd7600;
        line-height: 2.8;
      }
    }
  }
}
</style>

<!--我的页面-->
<template>
  <view class="user">
    <!--头部组件使用-->
    <uni-nav-bar
				status-bar
				:showBcakImg="false"
				showBackGroundImg
				:title="title"
				:navBarBackgroundImg="isNotchScreen ? 'https://admin.dajxyl.com/oss?path=img/wodebg1@2x_origin.png' : ''"
		></uni-nav-bar>
    <!--用户信息-->
    <template v-if="userInfo.phone">
    <view class="user_info" :class="{'user_info-ns':  isNotchScreen}">
      <view class="infos">
        <view class="info_left">
          <image :src="userInfo.pic"></image>
        </view>
        <view class="info_right">{{ userInfo.nickname ? userInfo.nickname : userInfo.phone }}</view>
      </view>
    </view>
    </template>
    <template v-else>
      <view class="user_info" @click="getUser" :class="{'user_info-ns':  isNotchScreen}">
        <view class="infos">
          <view class="info_left">
            <image :src="userInfo.pic"></image>
          </view>
          <view class="info_right">未登录</view>
        </view>
      </view>
    </template>
    <!--功能菜单框-->
	<view class="menu-wrap">
		<view class="selectionMenu">
		  <view class="menu_list" v-for="(i,k) in menu_list" :key="k" @click="handelMenu(k)">
		    <image class="menu-icon" :src="i.imgUrl" mode=""></image>
		    <p class="menu-text">{{ i.name }}</p>
		  </view>
		</view>
	</view>
    <!--列表菜单-->

    <view class="conent-wrap">
		<view class="user_content">
		  <button v-if="userInfo.phone" open-type="share" plain="true" style="border: none;padding-left: 0;padding-right: 0;">
		    <view class="content_list" v-for="(i,k) in shareBtn" :key="k"
		          @click="handelList(k)">
		      <view class="content_list_left">
		        <image :src="i.urlImg" mode=""></image>
		        <p>{{ i.title }}</p>
		      </view>
		      <view class="content_list_right">
		        <image src="https://admin.dajxyl.com/oss?path=img/next_page.png" mode=""></image>
		      </view>
		    </view>
		  </button>
      <button v-else plain="true" style="border: none;padding-left: 0;padding-right: 0;" @click="getUser">
        <view class="content_list" v-for="(i,k) in shareBtn" :key="k">
          <view class="content_list_left">
            <image :src="i.urlImg" mode=""></image>
            <p>{{ i.title }}</p>
          </view>
          <view class="content_list_right">
            <image src="https://admin.dajxyl.com/oss?path=img/next_page.png" mode=""></image>
          </view>
        </view>
      </button>
		  <view class="content_list" v-for="(i,k) in content_list" :key="k"
		        @click="handelList(k)">
		    <view class="content_list_left">
		      <image :src="i.urlImg" mode=""></image>
		      <p>{{ i.title }}</p>
		    </view>
		    <view class="content_list_right">
		      <image src="https://admin.dajxyl.com/oss?path=img/next_page.png" mode=""></image>
		    </view>
		  </view>
		</view>
	</view>
  </view>
</template>
<script>
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import {mapState, mapMutations} from 'vuex';
import {setPrePageUrl} from '@/service';
import {getUserInfo, codeInvitation} from '../../api/index.js';

export default {
  components: {
    uniNavBar,
  },
  data() {
    const {isNotchScreen} = getApp().globalData;
    return {
      isNotchScreen,
      title: '我的',
      userFlag: true,
      shareBtn: [
        {
          urlImg: 'https://admin.dajxyl.com/oss?path=img/fenxiang_origin.png',
          title: '分享给好友',
          message: false,
          num: 0,
          path: '',
        },
      ],
      code: 123456,
    }
  },
  mounted() {
    const token = uni.getStorageSync('token');
    if (token) {
      this.getUserInfo();
    }
  },
  computed: {
    ...mapState('users', {
      'menu_list': 'menu_list',
      'content_list': 'content_list',
      'userInfo': 'userInfo',
    }),
    ...mapState(['codeInvitation']),
  },
  onLoad() {
    // console.log(this.codeInvitation)
  },
  methods: {
    ...mapMutations('users', {
      'setUserInfoData': 'setUserInfoData',
      'setCode': 'setCode',
    }),
    /**
     * 获取用户信息
     */
    getUserInfo: function () {
      let that = this;
      let res = getUserInfo();
      res.then(function(e){
        that.setUserInfoData(e.data.data.info);
        that.getShareCode();
      });
    },
    getUser: function(){

      const value = uni.getStorageSync('token');
      if (value === '') {
        // 获取当前页面的path
        setPrePageUrl();
      }

      return uni.navigateTo({
        url: '/pages/login/index'
      });
    },
    getShareCode: function(){
      let that = this;
      let res = codeInvitation(this.userInfo.phone);
      res.then(function (e) {
        console.log(e);
        that.code = e.data.data.info.code;
        that.$store.commit('setCode', e.data.data.info.code);
      });
    },
    /**
     * 菜单框内菜单点击事件
     * @param {num} k
     * **/
    handelMenu: function (k) {
      // console.log(k)
      uni.navigateTo({
        url: this.menu_list[k].path
      })
    },
    /**
     * 列表菜单点击事件
     * **/
    handelList: function (k) {
      const value = uni.getStorageSync('token');
      if (k === 1) {
        return uni.makePhoneCall({
          phoneNumber: '4000360036' //仅为示例
        });
      }
      if (value === '') {
        // 获取当前页面的path
        setPrePageUrl();

        return uni.redirectTo({
          url: '/pages/loginAuthorized/loginAuthorized'
        });
      }
      return uni.navigateTo({
        url: this.content_list[k].path
      })
    },
  },
  onShareAppMessage: function() {
    return {
      title: '大爱金孝',
      // imageUrl:'',				分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4
      imageUrl:'https://admin.dajxyl.com/oss?path=img/minwx_share_origin.png',
      // bgImgUrl:'',				自定义分享二维码的背景图，建议大小750*950（网络图片路径）
      // desc: this.codeInvitation,
      path: '/pages/main/main?code=' + this.codeInvitation,
      success: (data) => {
        console.log(data)
      }
    }
  },
  onShareTimeline: function(){
    return {
      title: '大爱金孝',
      // imageUrl:'',				分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。支持PNG及JPG。显示图片长宽比是 5:4
      imageUrl:'https://admin.dajxyl.com/oss?path=img/minwx_share_origin.png',
      // bgImgUrl:'',				自定义分享二维码的背景图，建议大小750*950（网络图片路径）
      // desc: this.codeInvitation,
      query: '/pages/main/main?code=' + this.codeInvitation,
      success: (data) => {
        console.log(data)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('@/common/common.less');
@user: {
  width: 100%;
  height: 100%;
}

@userItem: {
  width: 50%;
  align-items: center;
  flex-wrap: nowrap;
}

@content_list_item: {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

@head_gobl: {
  width: 100%;
  height: 14rem;
}

@item: {
  width: 33.3%;
  height: 100%;
  display: flex;
  align-items: center;
}

.user {
  @user();
  flex-wrap: wrap;
  justify-content: center;

  .header {
    @head_gobl();
    display: flex;
    justify-content: center;
    position: absolute;

    image {
      @head_gobl();
    }

    .headContent {
      position: absolute;
      margin-top: 1.5rem;
      height: 2.69rem;
      width: 94%;
      display: flex;
      align-items: center;
      // background: #fd7600;
      .header_left {
        @item();
        // background: #4CD964;
        image {
          width: 0.565rem;
          height: 1rem;
        }
      }

      .header_center {
        @item();
        // background: #FFFFFF;
        justify-content: center;
        font-size: 1.065rem;
        font-family: PingFang SC;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
      }

      .header_right {
        @item();
        justify-content: flex-end;

        image {
          width: 1.095rem;
          height: 1.125rem;
        }

        // background: #333333;
      }
    }
  }

  .user_info {
	    display: flex;
		height: 301upx;
		width: 100%;
		margin-top: -2upx;
		background-image: url(https://admin.dajxyl.com/oss?path=img/top_bg@2x_origin.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		z-index: 10;

    .infos {
		margin-top: 24upx;
		display: flex;
		width: 100%;
		height: 128upx;
		align-items: center;
      .info_left {
		  margin-left: 35upx;
        image {
          width: 128rpx;
          height: 128rpx;
          border-radius: 50%;
          background: @white;
        }
      }

      .info_right {
        flex: 1;
		@flex-hor-center();
		padding-left: 18upx;
		font-size: 36upx;
		color: @white;
      }
    }

    image {
      width: 100%;
      height: 4.595rem;
      // height: 9.19rem;
    }
  }
	.user_info-ns{
		//background-image: url(https://admin.dajxyl.com/oss?path=img/wodebg2@2x_origin.png);
		//background-size: 100% 60%;
		//background-repeat: no-repeat;
	}
.menu-wrap{
	width: 100%;
	margin-top: -120rpx;
	height: 178upx;
	@flex-center();
}
.conent-wrap{
	width: 100%;
	@flex-center();
}
  .selectionMenu {
    z-index: 10;
    width: 710upx;
	height: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0rem 0rem 0.5rem 0rem rgba(153, 153, 153, 0.2);
    border-radius: 0.5rem;
    display: flex;
    flex-wrap: wrap;

    .menu_list {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
	  align-items: center;
	  flex-direction: column;
      .menu-icon {
		  height: 45upx;
		  width: 45upx;
      }
	  .menu-text{
		  padding-top: 14upx;
			font-size: 28upx;
			color: #666666;
	  }

      .menu_bottom {
        @user();
        height: 50%;
        justify-content: center;

        p {
          // width:3.69rem;
          height: 0.905rem;
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }
      }
    }
  }

  .user_content {
    width: 94%;
    // height:13.875rem;
    // height: 10.2rem;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0rem 0rem 0.5rem 0rem rgba(153, 153, 153, 0.2);
    border-radius: 0.5rem;
    margin-top: 0.75rem;
    // margin: 0.75rem 0 5.155rem 0;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;

    button {
      width: 94%;
      background: #FFFFFF;

      .content_list {
        width: 100%;
        height: 3.3rem;
        display: flex;
        border-bottom: 1px solid #F8F8F8;

        .content_list_left {
          @content_list_item();

          image {
            width: 1.125rem;
            height: 1.125rem;
          }

          p {
            // width:3.69rem;
            // height:0.905rem;
            margin-left: 0.345rem;
            font-size: 0.94rem;
            font-family: PingFang SC;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
          }

          b {
            width: 0.94rem;
            height: 0.94rem;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-left: 0.375rem;
            color: #FFFFFF;
            background: rgba(227, 47, 45, 1);
            border-radius: 50%;
          }
        }

        .content_list_right {
          @content_list_item();
          justify-content: flex-end;

          image {
            width: 0.565rem;
            height: 1rem;
          }
        }
      }
    }

    .content_list {
      width: 94%;
      height: 3.3rem;
      display: flex;
      border-bottom: 1px solid #F8F8F8;

      .content_list_left {
        @content_list_item();

        image {
          width: 1.125rem;
          height: 1.125rem;
        }

        p {
          // width:3.69rem;
          // height:0.905rem;
          margin-left: 0.345rem;
          font-size: 0.94rem;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
        }

        b {
          width: 0.94rem;
          height: 0.94rem;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 0.375rem;
          color: #FFFFFF;
          background: rgba(227, 47, 45, 1);
          border-radius: 50%;
        }
      }

      .content_list_right {
        @content_list_item();
        justify-content: flex-end;

        image {
          width: 0.565rem;
          height: 1rem;
        }
      }
    }
  }
}
</style>

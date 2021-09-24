<!--家庭服务页面-->
<template>
  <view class="service" :class="{'global-page': isIPX }">
    <!--头部组件使用-->
    <uni-nav-bar
        status-bar
        :showBcakImg="false"
        showBackGroundImg
        :title="title"
        :navBarBackgroundImg="isNotchScreen ? 'https://admin.dajxyl.com/oss?path=img/wodebg1@2x_origin.png' : ''"
    ></uni-nav-bar>
    <view class="fixed-intro">
        <scroll-view scroll-x="true" class="tab-bar-wrap" :scroll-into-view="viewId">
          <block v-for="(i,k) in menu_list"  :key="k">
            <view
                :class="['tab', activeTitleIndex === k ? 'active-tab': '']"
                @click="handleType(k)"
                :id="'menu'+k"
            >{{ i.title || '' }}</view>

          </block>
        </scroll-view>
    </view>
    <view class="service_content">
      <view class="content_img" v-if="img_src">
        <image :src="img_src" mode="" @click="gotoInfo(banner[0])"></image>
      </view>
      <view class="serviec_right">
        <view class="content_list1">
          <ContentList :serviec_list="title_chile"></ContentList>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import {mapState, mapMutations} from 'vuex';
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import ContentList from './content_list.vue';
import {codeInvitation, getMenuServiceType, getUserInfo, rotationPicture} from '../../api/index.js';
import {mapArr,gotoServiceInfo} from '../../service.js';

export default {
  components: {
    uniNavBar,
    ContentList
  },
  data() {
    const {isNotchScreen} = getApp().globalData;
    return {
      isNotchScreen,
      title: '家庭服务',
      title_domestic: '家庭保洁',
      title_washing: '洗涤服务',
      title_chile: [],
      activeTitleIndex: 0,
      banner: [],
      isIPX:this.$isIPX,
      activeID: null,
      viewId: 'menu0',
    }
  },
  computed: {
    ...mapState('server', {
      'menu_list': 'menu_list',
      'service_domestic': 'service_domestic',
      'service_washing': 'service_washing'
    }),
    ...mapState('users', {
      'userInfo':'userInfo'
    }),
    img_src() {
      return this.banner[0] && this.banner[0].img_src
    }
  },
  created() {

  },
  onLoad(option) {
    let id;
    try {
      id = uni.getStorageSync('active-tab');
    } catch (e) {
      console.log(e)
    }
    this.activeID = option.id || id;
    this.getMenuServiceType();
    this.getBanner();
  },
  onShow() {
    let id;
    try {
      id = uni.getStorageSync('active-tab');
      
    } catch (e) {
      console.log(e)
    }
    this.activeID = id;
    this.getMenuServiceType();
    this.getBanner();
  },
  onHide() {
    uni.removeStorageSync('active-tab');
  },
  mounted() {
    // 有token就更新用户数据
    const token = uni.getStorageSync('token');
    if (token) {
      this.getUserInfo();
    }
  },
  methods: {
    ...mapMutations('server', {
      'setMenuList': 'setMenuList'
    }),
    ...mapMutations('serviceinfo', {
      'setData': 'setData',
    }),
    ...mapMutations('users', {
      'setUserInfoData': 'setUserInfoData',
    }),
    /*存储用户信息*/
    getUserInfo: async function () {
      let res = await getUserInfo(),that = this;
      // console.log(res);
      return that.setUserInfoData(res.data.data.info);
    },
    onShareAppMessage: async function() {
      let code;
      if (this.userInfo.phone) {
        let res = await codeInvitation(this.userInfo.phone);
        code = res.data.data.info.code;
      } else {
        code = '';
      }
      console.log(code);
      return {
        title: '大爱金孝',
        path: '/pages/service/service?code=' + code,
        success: (data) => {
          console.log(data)
        }
      }
    },
    onShareTimeline: async function(){
      let code;
      if (this.userInfo.phone) {
        let res = await codeInvitation(this.userInfo.phone);
        code = res.data.data.info.code;
      } else {
        code = '';
      }
      console.log(code);
      return {
        title: '大爱金孝',
        path: '/pages/service/service?code=' + code,
        success: (data) => {
          console.log(data)
        }
      }
    },
    /*服务页左侧服务类型选择*/
    handleType(k) {
      this.activeTitleIndex = k;
      mapArr(this.menu_list);
      this.menu_list[k].check = !this.menu_list[k].check;
      let that = this;
      let cityCode = uni.getStorageSync('cityCode');
      let params;
      if (cityCode === '') {
        params = {"adCode": 510100};
      } else {
        params = {"adCode": cityCode.key};
      }
      let res = getMenuServiceType(params.adCode, this.menu_list[k].id);
      res.then(function(e){
        let data = e.data.data.info;
        //处理多条数据中的title长度
        data.map((ite, idx) => {
          if (ite.childes) {
            let arr = ite.childes;
            arr.map((item, index) => {
              if (item.title.length > 4) {
                item.title = item.title.slice(0, 4) + '...';
              }
            })
          }
        })
        that.title_chile = data;
      });
    },
    /*获取服务分类banner*/
    getBanner: function(){
      let that = this;
      let res = rotationPicture(15);
      res.then(function(e){
        that.banner = e.data.data.info
      });
    },
    /*获取服务类型列表*/
    getMenuServiceType: function () {
      let that = this,res;
      let cityCode = uni.getStorageSync('cityCode');
      if (cityCode === '') {
        res = getMenuServiceType(510100);
      } else {
        res = getMenuServiceType(cityCode.key);
      }
      res.then(function(e){
        let data = [...e.data.data.info];
        data.forEach((v, k) => {
          if (that.activeID) {
            if (v.id === that.activeID) {
              data[k].check = true;
              that.activeTitleIndex = k;
            } else {
              data[k].check = false;
            }
          } else {
            k === 0 ? data[k].check = true : data[k].check = false;
          }
          data[k].imgUrl = 'https://admin.dajxyl.com/oss?path=img/square2x.png';
        });
        console.log(that.activeTitleIndex);
        that.$store.commit('server/setMenuList', data);
        that.handleType(that.activeTitleIndex);
        that.viewId = `menu${that.activeTitleIndex}`;
      });
    },
    gotoInfo: function(obj){
      let that = this;
      return gotoServiceInfo(obj,function(e){
        that.setData(e);
      });
    }
  }

}
</script>

<style lang="less" scoped>
	@import url('@/common/common.less');
	.coutom-status-bar {
	      height: var(--status-bar-height);
	      width: 100%;
	}
@item: {
  display: flex;
  justify-content: center;
  align-items: center;
}
.service {
  position: relative;
  width: 100%;
  height: 100%;
  .status_bar {
          width: 100%;
		   background: #fd7600;
          position: relative;
  		.heda{
			position: absolute;
			margin: auto;
			bottom:15px;
			left:0;
			right:0;
			text-align: center;
			height: 24px;
  		    }
      }
  .fixed-intro{
    position: fixed;
    background-color: #FFFFFF;
    z-index: 10;
    width: 100%;
    .tab-bar-wrap{
      height: 88rpx;
      white-space: nowrap;
      .tab{
        height: 88rpx;
        position: relative;
        width: 120rpx;
        display: inline-block;
        align-items: center;
        justify-content: center;
        font-size: 30rpx;
        color: #666666;
        margin-left: 53rpx;
        line-height: 88rpx;
      }
      .active-tab{
        position: relative;
        color: #333333;
        font-weight: 500;
      }
      .active-tab:after{
        position: absolute;
        left: 0;
        bottom: 10rpx;
        content: '';
        width: 100%;
        height: 4rpx;
        border-radius: 5rpx;
        background-color: #fd7600;
      }
      .tab:last-of-type{
        margin-right: 21rpx;
      }
      .tab:first-of-type{
        margin-left: 21rpx;
      }
    }
    .tab-bar-wrap::-webkit-scrollbar {
      display: none;
    }
  }
  .service_content {
    padding-top: 88rpx;
    .content_img {
      height: 284rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F8F8F8;
      image {
        // width:15.94rem;
        width: 710rpx;
        height: 236rpx;
        border-radius: 10upx;
      }
    }
    width: 100%;
    min-height: calc(100vh - 128upx);
    background-color: #FFFFFF;
    .serviec_right {
      height: fit-content;
      background: #FFFFFF;
	    padding: 0 21rpx 23rpx 21rpx;
	    flex: 1;
	    min-height: 100%;

      .content_list1 {
        background: #FFFFFF;
      }
    }
  }
}
</style>

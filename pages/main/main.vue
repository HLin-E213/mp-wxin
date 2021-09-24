<!--云养老客户端-->
<template>
  <view class="home" :class="{'global-page': isIPX }">
    <!--头部导航栏-->
	<uni-nav-bar
			:showBcakImg="false"
			status-bar
			:showBackGroundImg="true"
			:navBarBackgroundImg="isNotchScreen ? 'https://admin.dajxyl.com/oss?path=img/topbg1@2x_origin.png' : ''">
		<view slot="left" class="left" @click="gotoCity">
		  <view class="city">
		    {{ city }}
		  </view>
		  <view class="action_row_down">
		    <image src="https://admin.dajxyl.com/oss?path=img/arrow_down_arrow.png" mode=""></image>
		  </view>
		</view>
		<view class="center" slot="title">
		  <image src="https://admin.dajxyl.com/oss?path=img/home_dajx.png" mode=""></image>
		</view>
	</uni-nav-bar>
	<view class="mainContent">
		<!--轮播图-->
		<view class="rotation" :class="{'rotation-ns':  isNotchScreen}">
		  <view class="banner">
		    <Banner :ids="ids" :img_list="img_list"></Banner>
		  </view>
		</view>

		<!-- 四个 btn 按钮组-->
		<view class="go-btn-wrap">
			<view
					v-for="(btn, i) in btns"
					class="btn"
					:key="i"
					:style="{backgroundImage:`url(${btn.bgImg})`}"
          @click="handleClickBtn(btn.payload)"
			>
				<view class="title" :style="{color: btn.color}">{{ btn.title }}</view>
				<view class="desc" :style="{color: btn.color}">{{ btn.desc }}</view>
				<image class="go" :src="btn.btnImg"></image>
				<image class="intro" :src="btn.introImg"></image>
			</view>
		</view>
		<!--限时抢购列表-->
		<view class="recommendation" v-if="sale_list.length > 0">
		  <view class="title">
		    <b></b>
		    <p>限时抢购</p>
		  </view>
			<view class="sale-wrap">
				<view class="content">
					<view class="recommend_list" v-for="(i,k) in sale_list" :key="i.id"
								@click="getServiceInfo(i)">
						<image class="top_content" :src="i.thum" mode=""></image>
						<view class="bottom_content">
							<h4>{{ i.title }}</h4>
							<view class="price-wrap">
								<h5 class="discount-price">¥{{ (i.service_promotion_info.price) / 100 }}</h5>
								<p class="price">指导价{{ i.present_price / 100 }}元</p>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
    <!-- 推荐服务 -->
    <view class="hot-service">
      <view class="hot-title">
        <b></b>
        <p>推荐服务</p>
      </view>
      <view class="hot-content">
        <view class="hot-service-list" v-for="(i,k) in recommend_list" :key="i.id"
              @click="getServiceInfo(i)">
          <image class="hot-top-content" :src="i.icon" mode=""></image>
          <view class="hot-bottom-content">
            <view class="hot-price-wrap">
              <h4>{{ i.title }}</h4>
              <span class="hot-discount-price-ss">￥</span>
              <span class="hot-discount-prices-sss">{{ (i.present_price) / 100 }}</span>
              <span class="hot-discount-price-s">起</span>
            </view>
            <p class="hot-price">{{ i.subtitle }}</p>
          </view>
        </view>
      </view>
    </view>
    <!-- 推荐商品 -->
    <shopSale :shopList="recommend_shop"></shopSale>
		<view class="bottom_bottom">
		  ———— 我也是有底线的 ————
		</view>
	</view>
		<uni-popup ref="popup" type="center">
			<div class="sign-wrap">
				<div class="sign-wrap-info"  :style="{backgroundImage: `url(${signImg})`, backgroundSize: '100% 100%'}">
					<button class="sign-button" @click="toSign()">立即签到</button>
				</div>
				<div class="sign-close-wrap">
					<img
							@click="close()"
							src="https://admin.dajxyl.com/oss?path=video/upload/202108/circle-close.png"
							alt=""
							class="sign-close"
					>
				</div>
			</div>
		</uni-popup>
  </view>
</template>

<script>
import AMapLoader from '../../lib/amap-wx.js';
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
import Banner from '../../components/banner.vue';
import shopSale from "@/components/shopSale/shopSale.vue";
import {setPrePageUrl} from '@/service';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import {
  getServicePromotion,
  getService,
  rotationPicture,
  getUserInfo,
  getServiceInfo,
  getComboInfo,
  miniScanSum,
  codeInvitation,
  userBindQR,
  menuSquare,
  getSignPopInfo,
  signPopLog,
} from '../../api/index.js';
import {mapState, mapMutations} from 'vuex';
import {getCityCode, getUrlParams, gotoServiceInfo, showDate,　TIME_TYPE} from '../../service';
import { getProductList } from '../../api/shop/product';

const POPUP_STATUS = {
  POP: 1,
	NO_POP: 0,
};

export default {
  components: {
    Banner,
		uniNavBar,
    shopSale,
    uniPopup,
  },
  data() {
    const {isNotchScreen} = getApp().globalData;
    return {
      isNotchScreen,
      img_list: [],
      //首页方格+菜单
      list_service: [],
      isIPX: this.$isIPX,
      //限时抢购
      sale_list: [],
			signInfo: {},
      //推荐服务
      recommend_list: [],
      //推荐商品
      recommend_shop: [{},{},{}],
      //判断是否有广告图片
      flag: true,
      //广告图片路径
      advertisement: 'https://admin.dajxyl.com/oss?path=img/img/guanggao2x.png',
      ids: 1,
      city: '',
      height: null,//获取的状态栏高度
      scope: false,
      code: '',
      signImg: '',
			btns: [
        {
          color: '#FF2400',
          bgImg: 'https://admin.dajxyl.com/oss?path=img/red-bg@2x.png',
          btnImg: 'https://admin.dajxyl.com/oss?path=img/go-red.png',
        },
        {
          color: '#0184FF',
          bgImg: 'https://admin.dajxyl.com/oss?path=img/blue-bg.png',
          btnImg: 'https://admin.dajxyl.com/oss?path=img/go-blue.png'
        },
        {
          color: '#17C13B',
          bgImg: 'https://admin.dajxyl.com/oss?path=img/green-bg.png',
          btnImg: 'https://admin.dajxyl.com/oss?path=img/go-green.png',
        },
        {
          color: '#FFA301',
          bgImg: 'https://admin.dajxyl.com/oss?path=img/orige-bg.png',
          btnImg: 'https://admin.dajxyl.com/oss?path=img/go-orige.png',
        },
			],
    }
  },
  computed: {
    advertisements() {
      return this.flag ? '' : 'marginTop:57.915rem'
    },
    ...mapState('users', {
      'current': 'current',
      'userInfo':'userInfo'
    }),
    ...mapState(['codeInvitation'])
  },
  mounted() {
    console.log(this.isIPX);
  },
  onLoad(option) {
    this.getSignPopInfo();
    setPrePageUrl();
    //通过分享码进入小程序获取邀请者的邀请码存在vuex中 登录后更新为自己的
    if (option.q) {
      let url = decodeURIComponent(option.q);
      let params = getUrlParams(url);
      this.setCode(params.invite_code);
      uni.setStorageSync('home_invite_code', params.invite_code);
      uni.setStorageSync('login_invite_code', params.invite_code);
      this.miniScanSum();
    }
    if (option.code) {
      this.setCode(option.code);
    }
    const _this = this;
    this.get_rotation();
    // this.getMenuSquare();
    this.getServiceList();
    this.getcenterPicture();
    this.getSaleHotList();
    this.getProductRecommend();
    this.menuSquare();
    uni.authorize && uni.authorize({
      scope: 'scope.userLocation',
      success() { //1.1 允许授权
        _this.getLie();
      },
      fail() {    //1.2 拒绝授权
        uni.openSetting({
          success(res) {
            console.log(res);
          },
          fail(e){
            console.log(e);
          },
          complete(){
            console.log('openSetting end');
          },
        });
      }
    });
    // 有token就更新用户数据
    const token = uni.getStorageSync('token');
    if (token) {
      this.getUserInfo();
      this.userBindQR();
    }
  },
  methods: {
    ...mapMutations('users', {
      'setUserInfoData': 'setUserInfoData',
      'setCity': 'setCity'
    }),
    ...mapMutations('serviceinfo', {
      'setData': 'setData',
    }),
    ...mapMutations(['setH5']),
    ...mapMutations(['setCode']),
		getSignPopInfo() {
      getSignPopInfo().then((res) => {
        const { pop_up_status, is_sign_in, thum = '' } = res.data.data.info || {};
        // 后台设置不弹窗则不进行弹窗展示
        if (pop_up_status == POPUP_STATUS.NO_POP) return false;
        this.signImg = thum;
        this.open();
			})
		},
    open() {
      this.$nextTick(() => {
        signPopLog();
        this.$refs.popup.open();
      });

    },
    close() {
      this.$refs.popup.close();
    },
    toSign() {
      this.close();
      uni.navigateTo({
        url: '/pages/taskCenter/home',
      });
    },
    getCode: function () {
      this.setCode(this.codeInvitation)
    },
    /*获取当前城市定位*/
    getLie: function () {
      let that = this;
      let myLocaltion = new AMapLoader.AMapWX({key: '928d7ec62845e85801e2ebea80a36194'});
      myLocaltion.getRegeo({
        // location: res.longitude + ',' + res.latitude,//location的格式为'经度,纬度'
        success: function (data) {
          // console.log(data)
          that.city = data[0].regeocodeData.addressComponent.city;
          that.setCity(that.city);
          getCityCode(that.current);
        },
        fail: function (info) {
          console.log(info)
        }
      })
    },
    menuSquare: function () {
      const ret = menuSquare();
      ret.then((value) => {
        console.log(value);
        let topMenuArr = value.data.data.info.top.slice(0,4);
        this.btns.forEach((i,k)=>{
          i.title = topMenuArr[k].title[0];
          i.desc = topMenuArr[k].title[1];
          i.introImg = topMenuArr[k].icon;
          i.payload = topMenuArr[k].payload;
        });
      });
    },
    handleClickBtn: function(payload){
        console.log('payload', payload);
      if (payload.type === 3) {
        this.setH5(payload.id);
        uni.navigateTo({
          url: '/pages/main/webView',
        });
      }
      if (payload.type === 20) {
        this.setH5(payload.id);
        uni.navigateTo({
          url: '/pages/main/webView',
        });
      }
      if (payload.type === 30) {
        uni.setStorageSync('setDefaultShopCategoryId', payload.id || 'none');
        return uni.switchTab({
          url: '/pages/shopHome/index'
        });
      }
      if (payload.type === 35) {
        return uni.switchTab({
          url: '/pages/trendHome/index'
        });
      }
      if (payload.type === 41) {
        return uni.navigateTo({
          url: '/pages/oldWord/index'
        });
      }
      let that = this;
      return gotoServiceInfo({payload},function(e){
        that.setData(e);
      });
    },
    /*存储用户信息*/
    getUserInfo: async function () {
      let res = await getUserInfo(),that = this;
      // console.log(res);
      return that.setUserInfoData(res.data.data.info);
    },
    /*点击跳转到城市页面*/
    gotoCity: function () {
      uni.navigateTo({
        url: '/pages/choiceCity/choiceCity',
        animationType: 'pop-in',
        animationDuration: 200
      })
    },
    /*获取首页轮播图列表数据*/
    get_rotation: function () {
      let that = this;
      let res = rotationPicture([1, 14]);
      res.then(function (e) {
        that.img_list = e.data.data.info;
      });
    },
    /**限时抢购**/
    getServiceList: function () {
      let that = this,res;
      let cityCode = uni.getStorageSync('cityCode');
      if (cityCode) {
        res = getServicePromotion(cityCode.key);
      } else {
        res = getServicePromotion();
      }
      res.then(function(e){
        // console.log(e);
        let arr = e.data.data.info;
        arr.map((item, index) => {
          if (item.title.length > 7) {
            item.title = (item.title).slice(0, 7) + '...';
          }
        });
        that.sale_list = [...arr];
      });
    },
    /**获取中部图片**/
    getcenterPicture: function () {
      let that = this;
      let res = rotationPicture(1);
      res.then(function (e) {
        const { img_src } = e.data.data.info[0] || {}
        that.advertisement = img_src;
        if (!img_src) {
          that.flag = !that.flag;
        }
      });
    },
    /**推荐服务**/
    getSaleHotList: function () {
      let that = this;
      let cityCode = uni.getStorageSync('cityCode');
      if (!cityCode) {
        cityCode = {key: '0'};
      }
      let res = getService(cityCode.key);
      // let res = getSaleHot(cityCode.key);
      res.then(function(e){
        let arr = e.data.data.info;
        that.recommend_list = arr.slice(0,4);
      });
    },
    // 跳转服务详情
    getServiceInfo: function (i) {
      let that = this,res;
      if ( i.type === 3 ) {
        res = getComboInfo(i.id);
        return res.then(function (e) {
          that.setData(e.data.data.info);
          return uni.navigateTo({
            url: '/pages/detailsProduct/comboProduct'
          });
        });
      }
      res = getServiceInfo(i.id);
      res.then(function(e){
        that.setData(e.data.data.info);
        return uni.navigateTo({
          url: '/pages/detailsProduct/detailsProduct'
        });
      });
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
        path: '/pages/main/main?code=' + code,
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
        path: '/pages/main/main?code=' + code,
        success: (data) => {
          console.log(data)
        }
      }
    },
    userBindQR: function() {
      const home_invite_code = uni.getStorageSync('home_invite_code');
      if (home_invite_code) {
        let res = userBindQR(home_invite_code);
        res.then(function(value){
          console.log(value);
        });
      }
    },
    miniScanSum: function() {
      const home_invite_code = uni.getStorageSync('home_invite_code');
      if (home_invite_code) {
        let res = miniScanSum(home_invite_code);
        res.then(function(value){
          console.log(value);
          uni.removeStorageSync('home_invite_code');
        });
      }
    },
    getProductRecommend: function() {
      const ret = getProductList(true);
      ret.then((value) => {
        this.recommend_shop = value.data.data.info;
      });
    },
  },
  onShow() {
    if (this.current && this.current.length > 3) {
      this.city = this.current.slice(0,2) + '…';
    } else {
      this.city = this.current;
    }
  }
}
</script>

<style lang="less">
	@import url('@/common/common.less');
	.coutom-status-bar {
	      height: var(--status-bar-height);
	      width: 100%;
	}
.home {
	position: relative;
	width: 100%;
	min-height: 100%;
	background-color: #f8f8f8;
}
.status_bar {
        width: 100%;
        position: relative;
    }
	.head-wrap{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: calc(88upx + var(--status-bar-height));
		background-image: url(https://admin.dajxyl.com/oss?path=img/home_titleBg_origin.png);
		background-size: 100% 100%;
		background-repeat: no-repeat;
		z-index: 9999;
	}
.head {
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  top:var(--status-bar-height);
  right:0;
  height: 88upx;
}

.head image {
  width: 100%;
  height: 88upx;
}

.left {
	height:100%;
	@flex-center();
}

.city {
  font-size: 32upx;
  font-family: PingFang SC;
  font-weight: blod;
  color: rgba(254, 254, 254, 1);
}

.action_row_down {
  display: flex;
  align-items: center;
  z-index: 999999;
}

.action_row_down image {
	margin-left: 3upx;
	width: 30upx;
	height: 30upx;
}

.center {
	height: 100%;
	width: 90%;
	@flex-center();
  z-index: 999999;
  img {
    width: 236upx;
    height: 40upx;
    z-index: 999999;
  }
}

.center image {
  /* width: 6.53rem; */
  /* height: 1.065rem; */
  width: 236upx;
  height: 40upx;
}

.right {
  width: 30%;
  height: 100%;
  @flex-center();
}

.right image {
  width: 1.155rem;
  height: 1.155rem;
}
.mainContent{
	width: 100%;
}

.rotation {
  background-image: url(https://admin.dajxyl.com/oss?path=img/lunbobg@2x_origin.png);
  width: 100%;
  height: 337upx;
  display: flex;
  justify-content: center;
  background-size: 100% 60%;
  background-repeat: no-repeat;
  background-color: @white;
  align-items: center;
}
.rotation-ns{
	background-image: url(https://admin.dajxyl.com/oss?path=img/topbg2@2x_origin.png);
	background-size: 100% 60%;
	background-repeat: no-repeat;
}

.rotation .banner {
  margin: 13upx, 21upx, 24upx, 19upx;
  width: 710upx;
  height: 285upx;
  z-index: 10;
  border-radius: 0.5rem;
}

// 限时抢购
  .recommendation {
    margin-top: 24upx;
    display: flex;
    width: 100%;
    background: @white;
    flex-flow: wrap;
  }
  .title {
    width: 100%;
    height: 1.815rem;
    display: flex;
    align-items: flex-end;
  /* background: #fd7600; */
  }
  .title b {
    width: 0.19rem;
    height: 1rem;
  background: #fd7600;
    border-radius: 0.095rem;
    margin-left: 0.625rem;
  }
  .title p {
    width: 8.88rem;
    /* height:1.065rem; */
    height: 1.3rem;
    font-size: 1.125rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    margin-left: 0.375rem;
  }
.sale-wrap{
	padding: 0 20rpx;
	overflow-x: scroll;
}
  .content {
    display: block;
  justify-content: space-between;
  flex-flow: wrap;
    background: @white;
    margin-top: 30upx;
    overflow-x: scroll;
    white-space: nowrap;
  }
	.content::-webkit-scrollbar {
		display: none;
	}
  .recommend_list {
    margin-right: 20upx;
    display: inline-block;
    width: 300upx;
    background: rgba(255, 255, 255, 1);
    margin-bottom: 30upx;
    box-shadow: 1upx 2upx 6upx 0 rgba(154, 154, 154, 0.15);
    border-radius:10upx;
    overflow: hidden;
	  flex-shrink: 0;
  }
.recommend_list:first-of-type{
	margin-left: 0;
}
  .recommend_list:last-of-type{
    margin-right: 0
  }
  .top_content {
    width: 100%;
  height: 180upx;
  }
  .bottom_content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-flow: wrap;
  }
  .price-wrap{
    display: flex;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    margin-left: 12upx;
  }
  .discount-price{
    font-size: 26upx;
  }
  .price{
    font-size: 23upx;
    text-decoration: line-through;
    margin-left: 23upx;
  }
  .bottom_content h4 {
    width: 100%;
    font-size: 30upx;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-left: 12upx;
  }
  .bottom_content h5 {
    font-family: PingFang SC;
    font-weight: 400;
    color: #FE7700;
  }
  .bottom_content p {
    font-family: PingFang SC;
    font-weight: 400;
    color: #9A9A9A;
  }

  .hot-service {
    margin-top: 24upx;
    display: flex;
    width: 100%;
    background: @white;
    justify-content: center;
    flex-flow: wrap;
  }
  .hot-title {
    width: 100%;
    height: 1.815rem;
    display: flex;
    align-items: flex-end;
    /* background: #fd7600; */
  }
  .hot-title b {
    width: 0.19rem;
    height: 1rem;
    background: #fd7600;
    border-radius: 0.095rem;
    margin-left: 0.625rem;
  }
  .hot-title p {
    width: 8.88rem;
    /* height:1.065rem; */
    height: 1.3rem;
    font-size: 1.125rem;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    margin-left: 0.375rem;
  }
  .hot-content {
    width: 94%;
    display: flex;
    justify-content: space-between;
    flex-flow: wrap;
    background: @white;
    margin-top: 30upx;
  }
  .hot-service-list {
    width: 340upx;
    background: rgba(255, 255, 255, 1);
    margin-bottom: 30upx;
    box-shadow: 1upx 2upx 6upx 0 rgba(154, 154, 154, 0.15);
    border-radius:10upx;
    overflow: hidden;
  }
  .hot-top-content {
    width: 100%;
    height: 190upx;
  }
  .hot-bottom-content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-flow: wrap;
  }
  .hot-price-wrap{
    display: flex;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
  }
  .hot-discount-price{
    font-size: 32upx;
  }
  .hot-discount-prices-sss{
    font-size: 36upx;
    font-weight: bold;
  }
  .hot-discount-price-ss{
    font-size: 24upx;
    padding-top: 6upx;
    font-weight: bold;
  }
  .hot-discount-price-s{
    font-size: 24upx;
    margin-right: 16upx;
    padding-top: 6upx;
    font-weight: bold;
  }
  .hot-price{
    font-size: 26upx;
    margin-left: 11.5upx;
    margin-bottom: 9upx;
  }
  .hot-bottom-content h4 {
    width: 100%;
    font-size: 30upx;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-left: 12upx;
    display: inline;
  }
  .hot-bottom-content span {
    font-family: PingFang SC;
    font-weight: 400;
    color: #FE7700;
  }
  .hot-bottom-content p {
    font-family: PingFang SC;
    font-weight: 400;
    color: #9A9A9A;
  }

.saleHot {
	margin-top: 24upx;
  display: flex;
  width: 100%;
  background: #FFFFFF;
  flex-flow: wrap;
  justify-content: center;
}

.saleContent {
  width: 94%;
  display: felx;
  .sale-price{
	  font-size: 32rpx;
	  font-weight: blod;
  }
}

.sale_list {
  width: 100%;
  /* height: 5.75rem; */
  height: 6rem;
  border-bottom: 1upx solid rgba(154, 154, 154, 0.3);
  display: flex;
  margin-top: 0.75rem;
}
.sale_list:last-of-type{
	border-bottom: none;
}

.sale_list image {
  width: 7.315rem;
  height: 5rem;
  border-radius: 0.5rem;
  margin-top: 2%;
}

.right_content {
  flex: 1;
  height: 5rem;
  margin-left: 2%;
}

.right_content h4 {
  /* width:7.47rem; */
  width: 80%;
  height: 0.875rem;
  font-size: 0.94rem;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-top: 0.315rem;
}

.right_content h5 {
  /* width:13.75rem; */
  width: 98%;
  height: 1.845rem;
  font-size: 0.815rem;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  line-height: 1.065rem;
  /* margin: 0.625rem 0 0 0.72rem; */
  margin-top: 0.625rem;
}
.sale-price{
	font-size: 30upx;
	font-weight: blod;
}
.right_content p {
  /* width:3.315rem; */
  width: 98%;
  height: 0.94rem;
  font-size: 0.815rem;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(253, 118, 0, 1);
  line-height: 1.065rem;
  margin-top: 0.065rem;
  display: flex;
  justify-content: flex-end;
}

  .shop_saleHot {
    margin-top: 24upx;
    display: flex;
    width: 100%;
    background: #FFFFFF;
    flex-flow: wrap;
    justify-content: center;
  }

  .shop_saleContent {
    width: 94%;
    display: felx;
    .sale-price{
      font-size: 32rpx;
      font-weight: blod;
    }
  }

  .shop_sale_list {
    width: 100%;
    /* height: 5.75rem; */
    height: 6rem;
    border-bottom: 1upx solid rgba(154, 154, 154, 0.3);
    display: flex;
    margin-top: 0.75rem;
  }
  .shop_sale_list:last-of-type{
    border-bottom: none;
  }

  .shop_sale_list image {
    width: 7.315rem;
    height: 5rem;
    border-radius: 0.5rem;
    margin-top: 2%;
  }

  .shop_right_content {
    flex: 1;
    height: 5rem;
    margin-left: 2%;
  }

  .shop_right_content h4 {
    /* width:7.47rem; */
    width: 80%;
    height: 0.875rem;
    font-size: 0.94rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    margin-top: 0.315rem;
  }

  .shop_right_content h5 {
    /* width:13.75rem; */
    width: 98%;
    height: 1.845rem;
    font-size: 0.815rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(102, 102, 102, 1);
    line-height: 1.065rem;
    /* margin: 0.625rem 0 0 0.72rem; */
    margin-top: 0.625rem;
  }
  .shop_sale-price{
    font-size: 30upx;
    font-weight: blod;
  }
  .shop_right_content p {
    width: 14%;
    padding-top: 0.5rem;
    font-size: 0.815rem;
    font-family: PingFang SC;
    font-weight: 400;
    color: rgba(253, 118, 0, 1);
    line-height: 1.065rem;
    margin-top: 0.065rem;
    display: flex;
    justify-content: flex-end;
  }

.bottom_bottom {
  display: flex;
  width: 100%;
  height: 3.5rem;
  justify-content: center;
  align-items: center;

  font-size: 0.815rem;
  font-family: PingFang;
  font-weight: 400;
  color: #343434;
  opacity: 0.2;
}

.tab_heigth {
  position: absolute;
  /* margin-top: 88.44rem; */
  margin-top: 82.625rem;
  width: 100%;
  height: 2.5rem;
}
</style>
<style lang="less" scoped>
	.sign-wrap{
		.sign-wrap-info{
			position: relative;
			width: 100vw;
			height: 686rpx;
			//background-image: url("https://admin.dajxyl.com/oss?path=video/upload/202108/sign-popup.png");
			background-size: 100% 100%;
			.sign-button{
        display: flex;
        align-items: center;
        justify-content: center;
				position: absolute;
				left: 216rpx;
				bottom: 54rpx;
				width: 317rpx;
				height: 82rpx;
				background: linear-gradient(0deg, #FB1E12 0%, #FD7C09 100%);
				border-radius: 41px;
				color: #FFF;
				font-size: 34rpx;
				font-weight: 500;
			}
		}
		.sign-close-wrap{
			margin-top: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
			.sign-close{
				width: 62rpx;
				height: 62rpx;
			}
		}
	}
	.go-btn-wrap{
		display: flex;
		flex-wrap: wrap;
		background-color: #FFFFFF;
		padding: 0 20rpx;
		.btn{
			position: relative;
			width: 345rpx;
			height: 178rpx;
			margin-left: 17rpx;
			margin-bottom: 17rpx;
			background-size: 100% 100%;
			background-repeat: no-repeat;
			.title{
				margin-left: 24rpx;
				font-size: 30rpx;
				color: #FF2400;
				line-height: 29rpx;
				font-weight: bold;
			}
			.desc{
				margin-top: 9rpx;
				margin-left: 24rpx;
				font-size: 24rpx;
				color: #FF2400;
				line-height: 23rpx;
			}
			.go{
				margin-top: 20rpx;
				margin-left: 24rpx;
				width: 65rpx;
				height: 38rpx;
			}
			.intro{
				position: absolute;
				right: 0;
				bottom: 0;
				width: 158rpx;
				height: 124rpx;
			}
		}
		.btn:nth-of-type(2n+1) {
			margin-left: 0;
		}
	}
</style>

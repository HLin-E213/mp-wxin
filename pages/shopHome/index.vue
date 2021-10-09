<template>
  <view class="show-home">
  <uni-nav-bar 
		:title="title" 
		:showBcakImg="showBcakImg" 
		:showFooter="false" 
		:isNoLeft="false" 
		footerHeight="0" 
		@clickLeft="clickLeft"
	>
	</uni-nav-bar>
    <view class="content">
		<!--  搜索栏    -->
      <view class="search-box"><searchBar :isCreate="isCreate"></searchBar></view>
      <view v-show="hasMore">
        <uni-load-more :status="loadStatus" ></uni-load-more>
      </view>
      <mescroll-body
          :sticky="true" ref="mescrollRef"
          @init="mescrollInit"
          @down="downCallback"
          @up="upCallback"
          :up="upOption"
          :style="{top:mescrollTop}">
      <view class="totation-box" v-if="!isCategory">
        <!--  轮播图  -->
        <view class="rotation" :class="{ 'rotation-ns': isNotchScreen }">
          <view class="banner"><Banner :ids="ids" :img_list="img_list"></Banner></view>
        </view>
        <!-- 分类轮播 -->
        <view><categoryRotation :list="category_list" @categoryClick="handleClickCategory"></categoryRotation></view>
      </view>
      <!--   活动   -->
      <view v-if="!isCategory && promotionList.length"><active :promotion-list="promotionList" @toCategoty="toActivity"></active></view>
      <view v-if="good_list.length" :class="{'mt-20': !promotionList.length}">
      <view class="goods-list-wrap">
        <good-list v-for="(i,k) of good_list" :key="k"
                   :goodID="i.id"
                   :goodImg="i.productImages.url"
                   :goodTitle="i.title"
                   :goodTitleDesc="i.description"
                   :money="price(i)"
                   :unit="i.unit"
                   :is-promotion="isPromotion(i)"
                   @openSku="openSku(i)"
        ></good-list>
      </view>
      <template>
        <view :class="showPopup ? '.wos-scroll-no' : '.wos-scroll-yes'">
          <uni-popup :maskClick="false" ref="popup" type="bottom" @change='changePopup'>
            <view class="popupView">
              <view>
                <view class="popupSkuView">
                  <view class="popupClose" @click="cancelSelectSpec">
                    <img src="https://admin.dajxyl.com/oss?path=img/close_popup.png" alt="关闭">
                  </view>
                  <view class="popupSkuView-good">
                    <view class="popupSkuView-good-img-view">
                      <img class="popupSkuView-good-img" :src="sku_img[0] && sku_img[0].img_src" alt="">
                    </view>
                    <view class="popupSkuView-good-desc">
                      <h1 class="popupSkuView-good-desc-title">{{ good_name.length > 10 ? good_name.slice(0,10) + '...' : good_name }}</h1>
                      <p class="popupSkuView-good-desc-money">￥{{ skuPrice[0] }}.<span class="popupSkuView-good-desc-money-s">{{ skuPrice[1] }}</span></p>
                    </view>
                  </view>
                  <view class="popupSkuView-list">
                    <view class="popupSkuView-list-item" v-for="sku in productSpecKey">
                      <h1 class="popupSkuView-list-item-h1">{{ sku.title }}</h1>
                      <view class="popupSkuView-list-item-button">
                        <template v-for="skuV in sku.productSpecValue">
                          <button @click="selectSpec(sku, skuV)" :class="{'active' :  select_spec_id.includes(Number(skuV.id))}">{{ skuV.value }}</button>
                        </template>
                      </view>
                    </view>
                  </view>
                  <view class="popupSkuView-num">
                    <h1 class="popupSkuView-list-item-h1-num">数量</h1>
                    <view class="popupSkuView-item-num">
                      <img class="num-button" @click="subGoodNum" src="https://admin.dajxyl.com/oss?path=img/reduce@2x.png" alt="-">
                      <p>{{ good_num }}</p>
                      <img class="num-button" @click="addGoodNum" src="https://admin.dajxyl.com/oss?path=img/add@2x.png" alt="+">
                    </view>
                  </view>
                  <view class="popupSkuView-sub">
                    <button class="popupSkuView-sub-btn" @click.stop="ensureSelectSpec">确认</button>
                  </view>
                </view>
              </view>
            </view>
          </uni-popup>
        </view>
      </template>

      <view class="bottom_bottom">
        ———— 我也是有底线的 ————
      </view>
      </view>
      <empty-data v-if="isCategory && !good_list.length && !hasMore"></empty-data>

      </mescroll-body>
    </view>

    <movable
        direction="all"
        :num="good_car_num"
    ></movable>
  </view>
</template>

<script>
// import dayjs from 'dayjs';
import movable from '@/components/movableArea/index.vue';
import goodList from "./components/good/goodList.vue";
import { getProductInfo, getProductList, getProductSKU, getPromotionProduct } from "../../api/shop/product";
import { addCart, getCartCount } from "../../api/shop/cart";
import { getCategoryList } from '../../api';
import { fenToYuan } from '@/utils/money';
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import searchBar from './components/searchBar';
import Banner from '../../components/banner.vue';
import categoryRotation from './components/categoryRotation';
import active from './components/activity';
import { rotationPicture } from '@/api/index.js';
import emptyData from './components/empty-data';
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";

// import { BASE_DATA_LIST } from './baseDataList'
import MescrollMixin from "@/components/mescroll-uni/components/mescroll-uni/mescroll-mixins.js"
import MescrollBody from "@/components/mescroll-uni/components/mescroll-body/mescroll-body.vue"

export default {
  name: 'shop',
  mixins:[MescrollMixin],
  components: {
    movable,
    goodList,
    uniNavBar,
    searchBar,
    Banner,
    categoryRotation,
    active,
    emptyData,
    uniLoadMore,
    MescrollBody
  },
  data() {
    const { isNotchScreen } = getApp().globalData;
    return {
      title: '养老商城',
      mescrollTop: '100px',
      showBcakImg: false,
      isEnd: false,
      isCreate: true,
      loadStatus: 'loading',
      hasMore: false,
      // 顶部背景图
      // showBackGroundImg: 'https://admin.dajxyl.com/oss?path=img/wodebg1@2x.png',
      // 商品列表
      viewId: 'menu0',
      page: 1,
      pageSize: 10,
      totalPage: 0,
      good_list: [],
      category_list: [],
      // 购物车商品数
      good_car_num: 0,
      // 弹层控制
      showPopup: false,
      sku_img: [{img_src: ''},{img_src: ''}],
      // 价格
      money: 0,
      // 原价
      original_price: 0,
      // 商品剩余
      surplus: 0,
      categoryId: '',
      // 商品单位
      good_unit: '',
      // 商品个数
      good_num: 1,
      // 倒计时
      time1: '',
      time2: '',
      time3: '',
      // 商品是否促销
      is_promotion: false,
      // 在选择规格时候该规格是否在促销活动中
      promotingSku: false,
      promotingMoney: '0.00',// 在选择规格时候该规格的促销价格
      // 商品名称
      good_name: '',
      // 商品描述
      good_name_title: '',
      // 商品属性
      coupon: '暂无优惠券', //暂无优惠券/领取优惠券
      address: '四川省成都市高新区环球中心E5-3-2-805号',
      // 推荐商品
      recommend_shop: [],
      // 零时商品详情数据
      desc_img: [],
      // 优惠券列表
      coupon_list: [],
      // 优惠券说明
      coupon_text: {},
      // 选中的sku
      selectSKU: {},
      select_sku_id: null,
      // 商品sku
      productSpecKey: [],
      productSku: [],
      // 用户地址
      addressList: [],
      // 默认选中的地址
      activeAddress: {},
      isPromotioning: false, // 是否正在促销中、为false代表促销活动还未开始
      isNotchScreen,
      ids: 1,
      img_list: [], // 首页轮播
      isFocus: false, // 是否获取焦点
      isCategory: false, // 是否是分类搜索
      keyword: '', // 关键词
      promotionList: [], // 活动列表
      product_promotion_category_id: '',
      upOption:{
        textNoMore:'没有更多了',
        noMoreSize:1,
        toTop:{
          // src:'https://shigongbang.oss-cn-hangzhou.aliyuncs.com/app/2021/09/1631589174461.png',
          radius:0,
          offset : 1,
        },
        empty:{
          use : true ,
          // icon : 'https://h5-zhaocai.gcw.net/static/img/noLength.e859d3a5.png' ,
          tip : "暂无数据",
          btnText : "",
          fixed: false,
          top: "200rpx",
          zIndex: 99
        }
      }
    }
  },
  computed: {
    skuPrice() {
      const { price = 0} = this.selectSKU;
      if (this.promotingSku) {
        return this.promotingMoney.split('.');
      }
      return fenToYuan(price).split('.');
    },
    select_spec_id() {
      const selectArr = [];
      const { product_spec = [] } = this.selectSKU;
      product_spec.forEach((spec) => {
        selectArr.push(spec.product_spec_value.id);
      });
      return selectArr;
    },
    price() {
      return function ({productSkuByMinPrice, productPromotion}) {
        if (productPromotion !== null) {
          let money = null;
          productPromotion.productPromotionSku.forEach((i) => {
            if (i.product_sku_id == productSkuByMinPrice.id) {
              let surplus = i.promotion_number - i.used_number;
              if (surplus === 0) {
                money = productSkuByMinPrice ? productSkuByMinPrice.price / 100 : 0;
              } else {
                money = i.promotion_price / 100;
              }
            }
          });
          if (money !== null) {
            return money;
          }
        }
        return productSkuByMinPrice ? productSkuByMinPrice.price / 100 : 0;
      };
    },
    isPromotion() {
      return function (obj) {
        if (obj.productPromotion !== null) {
            return true;
        }
        return false;
      };
    }
  },
  mounted() {
    this.getProductList();
    this.getCategoryLists();
    this.get_rotation();
  },
  onShow() {
    const categoryId =  uni.getStorageSync('setDefaultShopCategoryId');
    if (categoryId && categoryId !== 'none') {
      this.categoryId = categoryId;
      this.page = 1;
      this.pageSize = 10;
      this.good_list = [];
      this.getProductList();
      uni.removeStorageSync('setDefaultShopCategoryId');
    }
    this.clickLeft();
    this.getCartCount();
    this.getPromotionProduct();
    // 获取元素domHeight的高度，因为是局部滚动， mescroll-uni的top等于.domHeight的高度
    this.$nextTick(()=>{
      let domHeight = uni.createSelectorQuery().select(".domHeight");
      domHeight.boundingClientRect((data)=> {
        this.mescrollTop = 120 + 'px'
      }).exec()
    })
  },
  onReachBottom() {
    if (this.page < this.totalPage) {
      this.isEnd = false
      this.page++;
      // uni.showLoading({ title: '数据加载中，请稍后' });
      this.getProductList();
    }else{
      this.isEnd = true
    }
  },
  onPullDownRefresh() {
    this.page = 1;
    this.pageSize = 10;
    this.hasMore = true
    this.loadStatus = 'loading'
    this.getProductList();
  },
  methods: {
    /*上拉加载的回调*/
    upCallback(page) {
      // this.mixinRequestParams.pageIndex = page.num
      // this.getCurrentRequestDataList()
    },
    /*下拉刷新的回调 */
    downCallback() {
      this.mescroll.resetUpScroll()
      console.log('下拉')
    },
    // 获取活动商品列表
    getPromotionProduct: function() {
      let that = this;
      const res = getPromotionProduct();
      res.then(function(e) {
        that.promotionList = e.data.data.info;
      });
    },
    /*获取首页轮播图列表数据*/
    get_rotation: function() {
      let that = this;
      let res = rotationPicture(22);
      res.then(function(e) {
        that.img_list = e.data.data.info;
      });
    },
    handleClickCategory(category = {}) {
      this.showBcakImg = true;
      this.isCategory = true;
      this.product_promotion_category_id = ''
      this.categoryId = category.id;
      this.title = category.name;
      this.page = 1;
      this.pageSize = 10;
      this.good_list = [];
      // uni.showLoading({ title: '数据加载中，请稍后' });
      this.getProductList();
    },
    getCategoryLists() {
      getCategoryList(1, 1000).then((res) => {
        const { info } = res.data.data;
        this.category_list = info;
      })
    },
    getProductList: function() {
      let that = this
      const ret = getProductList(false, this.categoryId, this.keyword, this.product_promotion_category_id, this.pageSize, this.page);
      ret.then((value) => {
        this.totalPage = value.data.data.totalPage;
        if (this.page === 1) {
          this.good_list = value.data.data.info;
        } else {
          this.good_list.push(...value.data.data.info);
        }
      }).finally(function() {
        that.hasMore = false
        uni.hideLoading();
        uni.stopPullDownRefresh();
      });
    },
    getCartCount: function () {
      const token = uni.getStorageSync('token');
      if (token) {
        const ret = getCartCount();
        ret.then((value) => {
          this.good_car_num = value.data.data.info.quantity_count;
        });
      } else {
        this.good_car_num = 0;
      }
    },
    getProductInfo: function (id) {
      const ret = getProductInfo(id);
      ret.then((value) => {
        this.sku_img = [];
        this.good_name = value.data.data.info.title;
        this.good_name_title = value.data.data.info.description;
        this.good_unit = value.data.data.info.unit;
        // 轮播图 商品入户图 商品介绍图
        this.img_list = [];
        value.data.data.info.productImages.forEach((i,k) => {
          // sku 图
          if (i.type === '1') {
            this.sku_img.push({img_src:i.url});
          }
          // 轮播图
          if (i.type === '2') {
            this.img_list.push({img_src:i.url});
          }
          // 商品介绍图
          if (i.type === '3') {
            this.desc_img = [
              ...this.desc_img,
              {
                img_src: i.url,
              }
            ];
          }
        });
        console.log('this.desc_img', this.desc_img);
        // 优惠券
        if (value.data.data.info.coupon_list.length > 0) {
          this.coupon = '领取优惠券';
          this.coupon_list = value.data.data.info.coupon_list.map((item) => ({ ...item, code: item.id }));
          this.coupon_text = value.data.data.info.coupon_text;
        }
        // 默认选中最小的sku
        this.selectSKU = value.data.data.info.productSkuByMinPrice;
        // 判断当前sku是否是促销
        if (value.data.data.info.productPromotion !== null) {
          this.productPromotion = value.data.data.info.productPromotion;
          this.dealPromotionInfo();
        } else {
          this.is_promotion = false;
          this.money = fenToYuan(this.selectSKU.price);
        }
        // 规格显示
        const skuValue = getProductSKU(value.data.data.info.id);
        skuValue.then((skuValue) => {
          console.log(skuValue);
          this.productSku = skuValue.data.data.info.productSku;
          this.productSpecKey = skuValue.data.data.info.productSpecKey;
        });
      });
    },
    openSku: function (item) {
      this.$refs.popup.open();
      // 打开规格选择时候，记录住之前选中的sku以及数量,方便取消时候回填处理
      console.log(item);
      this.getProductInfo(item.id);
      this.beforeSelectSku = JSON.parse(JSON.stringify(this.selectSKU));
      this.beforeGoodNum = this.good_num;
      this.isPopupCoupon = false;
      this.isPopupAddress = false;
    },
    ensureSelectSpec() {
      this.dealPromotionInfo();
      this.addCartShop();
      this.closePopup()
    },
    addCartShop: function () {
      const cart = addCart(this.selectSKU.id, this.good_num);
      uni.showLoading({
        title: '正在添加到购物车...'
      });
      cart.then((value) => {
        this.getCartCount();
        uni.hideLoading();
        return uni.showToast({
          title: '添加成功！',
          duration: 2000,
          icon: 'success',
          mask: true,
        });
      });
    },
    dealPromotionInfo() {
      const { productPromotionSku = [] } = this.productPromotion || {};
      const promotingSku = productPromotionSku.find((sku) => (String(sku.product_sku_id) === String(this.selectSKU.id)));
      this.promotingSku = promotingSku ? true : false;
      if (promotingSku) {
        this.promotingMoney = fenToYuan(promotingSku.promotion_price);
        this.is_promotion = true;
        this.money = fenToYuan(promotingSku.promotion_price);
        this.original_price = fenToYuan(this.selectSKU.price);
        this.surplus = promotingSku.promotion_number - promotingSku.used_number;
        console.log(this.surplus);
        if (this.surplus === 0) {
          this.is_promotion = false;
          this.money = fenToYuan(this.selectSKU.price);
          this.promotingSku = false;
          this.innerRemainPayTime = '';
        }
        // this.dealPromotionTime();
      } else {
        // this.clearTimer();
        this.innerRemainPayTime = '';
        this.is_promotion = false;
        this.money = fenToYuan(this.selectSKU.price);
      }
    },
    subGoodNum() {
      this.good_num === 1 ? 0 : this.good_num -= 1;
    },
    addGoodNum() {
      this.good_num += 1;
    },
    cancelSelectSpec() {
      this.selectSKU = JSON.parse(JSON.stringify(this.beforeSelectSku));
      this.good_num = this.beforeGoodNum;
      this.beforeSelectSku = null;
      this.beforeGoodNum = null;
      this.closePopup()
    },
    changePopup({show}) {
      this.showPopup = show;
    },
    closePopup(){
      this.$refs.popup.close();
    },
    /**
     * 选择规格时候，来自动判断当前选择规格属于哪一个sku
     * 1.首先将已经选中的sku取出
     * 2.将sku中同样名称的规格与选中的规格做替换
     * 3.再去sku列表中遍历找到选中的sk并替换
     * */
    selectSpec(sku, skuv) {
      let bool = false;
      const { product_spec } = this.selectSKU;
      const { title } = sku;
      let speckeySpecv = '';
      product_spec.forEach((spec) => {
        let temp = { ...spec };
        if(temp.product_spec_key.title === title) {
          temp.product_spec_value = skuv;
        }
        //将规格名称id规格值id进行组合，与sku列表内的进行对比，以取出对应的sku；
        speckeySpecv += `${temp.product_spec_key.id}-${temp.product_spec_value.id}`;
      });
      this.productSku.forEach((product) => {
        const { product_spec } = product;
        let tempSpeckeySpecv = '';
        product_spec.forEach((spec) => {
          tempSpeckeySpecv += `${spec.product_spec_key.id}-${spec.product_spec_value.id}`
        });
        if (speckeySpecv === tempSpeckeySpecv) {
          if (product.status !== '2') {
            this.selectSKU = product;
            this.money = fenToYuan(this.selectSKU.price);
          } else {
            bool = true;
          }
        }
      });
      const { productPromotionSku = [] } = this.productPromotion || {};
      const promotingSku = productPromotionSku.find((sku) => (sku.product_sku_id === this.selectSKU.id));
      this.promotingSku = promotingSku ? true : false;
      if (promotingSku) {
        this.promotingMoney = fenToYuan(promotingSku.promotion_price);
        this.original_price = fenToYuan(this.selectSKU.price);
        this.surplus = promotingSku.promotion_number - promotingSku.used_number;
        console.log(this.surplus);
        if (this.surplus === 0) {
          this.is_promotion = false;
          this.money = fenToYuan(this.selectSKU.price);
          this.promotingSku = false;
        }
      }
      if (bool) {
        return uni.showToast({
          title: '该商品规格已下架！',
          duration: 2000,
          icon: 'none',
          mask: true,
        });
      }
    },
    // 分类后返回 初始化一些数据
    clickLeft() {
      this.isFocus = true;
      this.isCreate = false
      this.$nextTick(() => {
        this.isFocus = false;
        this.isCreate = true
      });
      this.showBcakImg = false;
      this.isCategory = false;
      this.categoryId = '';
      this.title = '养老商城';
      if(this.product_promotion_category_id){
        this.page = 1;
        this.pageSize = 10;
        this.product_promotion_category_id = ''
        this.good_list = [];
        this.getProductList();
      }
    },
    // 活动商品搜索
    toActivity(obj){
      this.showBcakImg = true;
      this.isCategory = true;
      this.product_promotion_category_id = obj.id;
      this.title = obj.name;
      this.page = 1;
      this.pageSize = 10;
      this.good_list = [];
      // uni.showLoading({ title: '数据加载中，请稍后' });
      this.getProductList();
    },
  }
};
</script>

<style scoped lang="less">
.show-home {
  position: relative;
  width: 100%;
  min-height: 100%;
}
.content {
  background-color: #f8f8f8;
  .search-box {
    background-color: #ffffff;
  }
  .totation-box {
    background-color: #ffffff;
    position: relative;
    border-radius: 0 0 60rpx 60rpx;
  }
  .goods-list-wrap {
    display: flex;
    flex-wrap: wrap;
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
}
scroll-view ::-webkit-scrollbar {
  width: 0;
  height: 0;
  background-color: transparent;
}
.bottom_bottom {
  width: 100%;
  height: 3.5rem;
  text-align: center;
  font-size: 0.815rem;
  font-weight: 400;
  color: #343434;
  opacity: 0.2;
  margin-top: 1.2rem;
}

.popupView {
  position: relative;
  width: 100%;
  max-height:990rpx;
  background-color: #fff;
  border-radius: 20upx 20upx 0 0;
  overflow-y: scroll;
  z-index: 999;

  .popupSkuView {
    min-height: 520rpx;
    .popupClose {
      position: fixed;
      right: 0;
      padding-right: 34upx;
      padding-top: 34upx;
      float: right;
      z-index: 99999;
      img {
        width: 46upx;
        height: 46upx;
      }
    }
    .popupSkuView-good {
      width: 300upx;
      background-color: #fff;
      .popupSkuView-good-img-view {
        background-color: #fff;
        position: fixed;
        z-index: 100;
        width: 160upx;
        height: 160upx;
        border-radius: 10upx;
        float: left;
        padding-top: 42upx;
        padding-left: 33upx;
        padding-right: 24upx;
        .popupSkuView-good-img {
          width: 160upx;
          height: 160upx;
          border-radius: 10upx;
        }
      }
      .popupSkuView-good-desc {
        position: fixed;
        margin-left: 210upx;
        padding-bottom: 25upx;
        width: 100%;
        z-index: 100;
        background-color: #fff;
        .popupSkuView-good-desc-title {
          color: #333;
          font-size: 30upx;
          padding-top: 64upx;
        }
        .popupSkuView-good-desc-money {
          color: #fd7600;
          font-size: 34upx;
          padding-top: 24upx;
          .popupSkuView-good-desc-money-s {
            font-size: 30upx;
          }
        }
      }
    }
    .popupSkuView-list {
      padding-top: 220upx;
      .popupSkuView-list-item {
        .popupSkuView-list-item-h1 {
          font-size: 28upx;
          margin-top: 37upx;
          margin-left: 32upx;
        }
        .popupSkuView-list-item-button {
          display: inline-block;
          text-align: center;
          font-size: 28upx;
          color: #666;
          .active {
            color: #fff;
            background-color: #fd7600;
            border: 1upx solid #fd7600;
          }
          button {
            float: left;
            padding-left: 28upx;
            background-color: #fff;
            font-weight: 300;
            line-height: 56upx;
            height: 60upx;
            border: 1upx solid #999;
            border-radius: 30upx;
            color: #666;
            margin-left: 33upx;
            margin-top: 22upx;
            font-size: 28upx;
          }
        }
      }
    }
    .popupSkuView-num {
      padding-bottom: 240upx;
      .popupSkuView-list-item-h1-num {
        font-size: 28upx;
        margin-top: 37upx;
        margin-left: 32upx;
        display: inline;
      }
      .popupSkuView-item-num {
        float: right;
        margin-top: 15upx;
        padding-right: 35upx;
        .num-button {
          float: left;
          width: 51.3upx;
          height: 48.4upx;
          margin-top: 3.5upx;
        }
        p {
          margin: 0 6upx;
          background-color: #fafafa;
          padding-top: 6upx;
          color: #333;
          font-size: 29.03upx;
          text-align: center;
          width: 61.8upx;
          height: 48.4upx;
          float: left;
        }
      }
    }
    .popupSkuView-sub {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #fff;
      .popupSkuView-sub-btn {
        width: 90%;
        border-radius: 46upx;
        height: 92upx;
        background-color: #fd7600;
        color: #fff;
        font-size: 35.64upx;
        line-height: 95upx;
        margin-bottom: 5upx;
        margin-top: 10upx;
      }
    }
  }
}
.rotation {
  //background-image: url(https://admin.dajxyl.com/oss?path=img/lunbobg@2x_origin.png);
  width: 100%;
  //height: 337upx;
  display: flex;
  justify-content: center;
  background-size: 100% 60%;
  background-repeat: no-repeat;
  background-color: #ffffff;
  align-items: center;
}
.rotation-ns {
  //background-image: url(https://admin.dajxyl.com/oss?path=img/topbg2@2x_origin.png);
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
.mt-20{
  margin-top: 20rpx;
}
</style>

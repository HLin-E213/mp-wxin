<template>
  <layout :title="title" :showFooter="!showPopup" footerHeight="100">
    <view class="content">
      <!--轮播图组件-->
      <shop-banner :img_list="img_list" @previewImage="previewImage"></shop-banner>
      <!--商品标题价格-->
      <view class="good-title">
        <view class="good-promotion" v-if="is_promotion">
          <view class="good-promotion-view-img"><img class="good-promotion-img" :src="good_promotion_img" alt="promotion_mark" /></view>
          <view class="good-promotion-view-list">
            <view class="good-promotion-view-money">
              <span class="good-promotion-money-unit">￥</span>
              <span class="good-promotion-money-s">{{ skuPrice[0] }}.{{ skuPrice[1] }}</span>
            </view>
            <view class="good-promotion-attribute">
              <span class="good-promotion-original-price">原价：￥{{ original_price }}</span>
              <span class="good-promotion-surplus">剩余：{{ surplus }}{{ good_unit }}</span>
            </view>
          </view>
          <view class="good-promotion-time">
            <view class="good-promotion-time__title">
              <img class="good-promotion-time-img" :src="time_circle" alt="time" />
              <p class="good-promotion-time-title">{{ isPromotioning ? activity_time_title : '活动倒计时' }}</p>
            </view>
            <view>
              <span class="time-hour">{{ time1 }}</span>
              <span class="blot">:</span>
              <span class="time-hour">{{ time2 }}</span>
              <span class="blot">:</span>
              <span class="time-hour">{{ time3 }}</span>
            </view>
          </view>
        </view>
        <view class="good-money" v-else>
          <span class="good-money-unit">￥</span>
          <span class="good-money-s">{{ skuPrice[0] }}.{{ skuPrice[1] }}</span>
        </view>
        <view class="good-title-list">
          <h1 class="good-title-item-h1">{{ good_name }}</h1>
          <p class="good-title-item-p">{{ good_name_title }}</p>
        </view>
      </view>
      <!--优惠券-->
      <view class="good-attribute">
        <view class="good-attribute-item" @click="openCoupon">
          <h1>优惠券</h1>
          <p class="good-attribute-none">{{ coupon }}</p>
          <img :src="more_img" alt="shopMore" v-if="coupon_list.length" />
        </view>
      </view>
      <!--规格-->
      <!--地址-->
      <view class="good-attribute">
        <view class="good-attribute-item border" @click="openSku">
          <h1>已选</h1>
          <p>{{ sku.length > 20 ? sku.slice(0, 20) + '...' : sku }}</p>
          <img :src="more_img" alt="shopMore" />
        </view>
        <view class="good-attribute-item" @click="openAddress">
          <h1>地址</h1>
          <p>{{ showAddress(activeAddress) }}</p>
          <img :src="more_img" alt="shopMore" />
        </view>
      </view>
      <!-- 商品介绍 -->
      <view class="good-desc">
        <view class="title">
          <b></b>
          <p>商品介绍</p>
        </view>
        <view class="cont">
          <view v-for="(item, index) in desc_img" @click="previewImage(item.img_src, desc_img)" :key="index">
            <img :src="item && item.img_src" mode="widthFix" alt="保洁详情.png" />
          </view>
        </view>
      </view>

      <shopSale :shopList="recommend_shop"></shopSale>

      <template>
        <view :class="showPopup ? '.wos-scroll-no' : '.wos-scroll-yes'">
          <uni-popup :maskClick="isMask" ref="popup" type="bottom" @change="changePopup">
            <view class="popupView">
              <!--弹出层-优惠券-->
              <view v-if="isPopupCoupon">
                <view class="popupCouponView">
                  <view class="popupClose" @click="closePopup"><img src="https://admin.dajxyl.com/oss?path=img/close_popup.png" alt="关闭" /></view>
                  <view class="popupCouponView-view"><coupons-get :couponlist="coupon_list" :couponText="coupon_text" :isShop="true"></coupons-get></view>
                </view>
              </view>
              <!-- 弹出层-规格 -->
              <view v-if="isPopupSku">
                <view class="popupSkuView">
                  <view class="popupClose" @click="cancelSelectSpec"><img src="https://admin.dajxyl.com/oss?path=img/close_popup.png" alt="关闭" /></view>
                  <view class="popupSkuView-good">
                    <view class="popupSkuView-good-img-view"><image class="popupSkuView-good-img" mode="aspectFill" :src="sku_img[0] && sku_img[0].img_src"></image></view>
                    <view class="popupSkuView-good-desc">
                      <h1 class="popupSkuView-good-desc-title">{{ good_name.length > 10 ? good_name.slice(0, 10) + '...' : good_name }}</h1>
                      <p class="popupSkuView-good-desc-money">
                        ￥{{ skuPrice[0] }}.
                        <span class="popupSkuView-good-desc-money-s">{{ skuPrice[1] }}</span>
                      </p>
                    </view>
                  </view>
                  <view class="popupSkuView-list">
                    <view class="popupSkuView-list-item" v-for="sku in productSpecKey">
                      <h1 class="popupSkuView-list-item-h1">{{ sku.title }}</h1>
                      <view class="popupSkuView-list-item-button">
                        <template v-for="skuV in sku.productSpecValue">
                          <button @click="selectSpec(sku, skuV)" :class="{ active: select_spec_id.includes(Number(skuV.id)) }">{{ skuV.value }}</button>
                        </template>
                      </view>
                    </view>
                  </view>
                  <view class="popupSkuView-num">
                    <h1 class="popupSkuView-list-item-h1-num">数量</h1>
                    <view class="popupSkuView-item-num">
                      <img class="num-button" @click="subGoodNum" src="https://admin.dajxyl.com/oss?path=img/reduce@2x.png" alt="-" />
                      <p>{{ good_num }}</p>
                      <img class="num-button" @click="addGoodNum" src="https://admin.dajxyl.com/oss?path=img/add@2x.png" alt="+" />
                    </view>
                  </view>
                  <view class="popupSkuView-sub"><button class="popupSkuView-sub-btn" @click.stop="ensureSelectSpec">确认</button></view>
                </view>
              </view>
              <!-- 弹出层-地址 -->
              <view v-if="isPopupAddress">
                <view class="popupAddressView">
                  <view class="popupClose" @click="closePopup"><img src="https://admin.dajxyl.com/oss?path=img/close_popup.png" alt="关闭" /></view>
                  <view class="popupAddressView-list">
                    <view class="popupAddressView-item" v-for="(address, index) in addressList" @click="selectAddress(index)">
                      <span class="popupAddressView-item-span active" v-if="address.id === activeAddress.id"></span>
                      <span class="popupAddressView-item-span" v-else></span>
                      <span class="popupAddressView-item-name">{{ address.name }}</span>
                      <span class="popupAddressView-item-tel">{{ address.tel }}</span>
                      <p class="popupAddressView-item-desc">{{ address.desc }}</p>
                    </view>
                  </view>
                  <view class="popupAddressView-sub"><button class="popupAddressView-sub-btn" @click="AddAddress">添加新地址</button></view>
                </view>
              </view>
            </view>
          </uni-popup>
        </view>
      </template>
    </view>
    <view slot="footer" id="footer" ref="footer">
      <!-- 下部菜单固定栏 -->
      <view class="btn_bottom" :class="{ 'ipx-btn-bottom': isIPX }">
        <view class="btn_left" @click="gotoShoppingCart">
          <view class="btn_shop_car">
            <view class="num">{{ good_car_num }}</view>
          </view>
        </view>
        <view class="btn_right"><button class="white" type="primary" @click="checkSelectSku(1)">加入购物车</button></view>
        <view class="btn_right" @click="checkSelectSku(2)"><button type="primary">立即购买</button></view>
      </view>
    </view>
  </layout>
</template>

<script>
import layout from '@/components/layout/index.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
import shopSale from '@/components/shopSale/shopSale.vue';
import shopBanner from './components/shopBanner';
import CouponsGet from '@/components/couponsGet/couponsGet.vue';
import { getProductInfo, getProductList, getProductSKU } from '../../../api/shop/product';
import { addCart, getCartCount } from '../../../api/shop/cart';
import { codeInvitation, getAddressList } from '../../../api/index';
import { mapMutations } from 'vuex';
import { fenToYuan } from '@/utils/money';
import countDown from '@/mixins/countDown.js';

export default {
  name: 'detailsGood',
  components: {
    layout,
    shopSale,
    shopBanner,
    uniPopup,
    uniPopupMessage,
    uniPopupDialog,
    CouponsGet
  },
  mixins: [countDown],
  watch: {
    innerRemainPayTime: {
      handler(val) {
        if (val) {
          const [time1, time2, time3] = val.split(':');
          this.time1 = time1;
          this.time2 = time2;
          this.time3 = time3;
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapMutations('orders', {
      setActiveCoupon: 'setActiveCoupon'
    }),
    showAddress() {
      return function({ desc }) {
        if (desc) {
          return desc.length > 20 ? desc.slice(0, 20) + '...' : desc;
        }
        return '';
      };
    },
    sku() {
      // '中老年益生菌，1kg，1件'
      let sku = this.good_name + '，';
      const { product_spec = [] } = this.selectSKU;
      product_spec.forEach(i => {
        sku += i.product_spec_value.value + '，';
      });
      sku += this.good_num + this.good_unit;
      return sku;
    },
    select_spec_id() {
      const selectArr = [];
      const { product_spec = [] } = this.selectSKU;
      product_spec.forEach(spec => {
        selectArr.push(spec.product_spec_value.id);
      });
      return selectArr;
    },
    skuPrice() {
      const { price = 0 } = this.selectSKU;
      if (this.promotingSku) {
        return this.promotingMoney.split('.');
      }
      return fenToYuan(price).split('.');
    },
    formatMoney() {
      const { price = 0 } = this.selectSKU;
      if (this.promotingSku) {
        return this.promotingMoney.split('.');
      }
      return fenToYuan(price).split('.');
    },
    shareImg(){
      let imgSrc = this.img_list.length?this.img_list[0].img_src:''
      return imgSrc
    },
  },
  onShareAppMessage: async function(options) {
    return {
      title: this.good_name,
      path: '/pages/shop/detailsGood/index?id=' + this.productID,
      imageUrl: this.shareImg,
      success: () => {
        console.log('分享商品详情成功');
      }
    }
},
  onLoad(option) {
    if (option.id) {
      this.productID = option.id;
      this.getProductInfo(option.id);
    } else {
      return uni.switchTab({
        url: '/pages/shopHome/index'
      });
    }
    this.getProductRecommend();
    this.$nextTick(() => {
      try {
        this.footerHeight = `${this.$refs.footer.$parent.$el.offsetHeight}px`;
      } catch (e) {
        console.log(e);
      }
    });
  },
  onShow() {
    if (this.productID) {
      this.getProductInfo(this.productID);
    }
    this.getAddressList();
    this.$store.commit('orders/setActiveCoupon', []);
    const SystemInfo = wx.getSystemInfoSync();
    this.statusBarHeight = SystemInfo.statusBarHeight
  },
  data() {
    return {
      statusBarHeight: 0,
      footerHeight: '82px',
      title: '商品详情',
      activity_time_title: '距开始还剩',
      // 商品属性更多的小点点
      more_img: 'https://admin.dajxyl.com/oss?path=img/shopMore.png',
      // 限时特惠图片
      good_promotion_img: 'https://admin.dajxyl.com/oss?path=img/promotion_mark.png',
      // 倒计时图标
      time_circle: 'https://admin.dajxyl.com/oss?path=img/time_circle.png',
      // 弹层控制
      showPopup: false,
      isPopupCoupon: false,
      isPopupSku: false,
      isPopupAddress: false,
      isMask: false,
      productID: null,
      // 轮播图
      img_list: [],
      // sku 图片
      sku_img: [],
      // 价格
      money: 0,
      // 原价
      original_price: 0,
      // 商品剩余
      surplus: 0,
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
      promotingMoney: '0.00', // 在选择规格时候该规格的促销价格
      // 商品名称
      good_name: '',
      // 商品描述
      good_name_title: '',
      // 商品属性
      coupon: '暂无优惠券', //暂无优惠券/领取优惠券
      address: '四川省成都市高新区环球中心E5-3-2-805号',
      // 购物车商品数
      good_car_num: 0,
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
      isIPX: this.$isIPX,
      isPromotioning: false, // 是否正在促销中、为false代表促销活动还未开始
      selectType: 0, // 当前操作类型 1 加入购物车 2 立即购买
      shareList: [
        {
          text: '微信好友',
          icon: 'icon-weixin1',
          name: 'friend'
        },
        {
          text: '朋友圈',
          icon: 'icon-pengyouquan',
          name: 'wx'
        }
      ]
    };
  },
  methods: {
    ...mapMutations('users', {
      setEditorData: 'setEditorData',
      setAddressData: 'setAddressData'
    }),
    ...mapMutations('orders', {
      setShopSelectSku: 'setShopSelectSku'
    }),
    onShareTimeline() {
      return {
        title: this.good_name,
        query: 'id=' + this.productID,
        imageUrl: this.shareImg,
        success: () => {
          console.log('分享商品详情成功');
        }
      };
    },
    /**
     * 验证是否弹出选择sku
     * type: 1-加入购物车，2-立即购买
     * */
    checkSelectSku(type) {
      if (!this.selectType) {
        this.selectType = type;
        this.openSku();
      }
    },
    /**
     * 预览图片
     * */
    previewImage(image, imgArr) {
      const dealedImgArr = imgArr.map(img => img && img.img_src);
      //预览图片
      uni.previewImage({
        urls: dealedImgArr,
        current: image
      });
    },
    /**
     * 选择规格时候，来自动判断当前选择规格属于哪一个sku
     * 1.首先将已经选中的sku取出
     * 2.将sku中同样名称的规格与选中的规格做替换
     * 3.再去sku列表中遍历找到选中的sk并替换
     * */
    selectSpec(sku, skuv) {
      const { product_spec } = this.selectSKU;
      const { title } = sku;
      let speckeySpecv = '',
          bool = false;
      product_spec.forEach(spec => {
        let temp = { ...spec };
        if (temp.product_spec_key.title === title) {
          temp.product_spec_value = skuv;
        }
        //将规格名称id规格值id进行组合，与sku列表内的进行对比，以取出对应的sku；
        speckeySpecv += `${temp.product_spec_key.id}-${temp.product_spec_value.id}`;
      });
      this.productSku.forEach(product => {
        const { product_spec } = product;
        let tempSpeckeySpecv = '';
        product_spec.forEach(spec => {
          tempSpeckeySpecv += `${spec.product_spec_key.id}-${spec.product_spec_value.id}`;
        });
        if (speckeySpecv === tempSpeckeySpecv) {
          if (product.status !== '2') {
            this.selectSKU = product;
            console.log(product);
            this.money = fenToYuan(this.selectSKU.price);
          } else {
            bool = true;
          }
        }
      });
      const { productPromotionSku = [] } = this.productPromotion || {};
      const promotingSku = productPromotionSku.find(sku => sku.product_sku_id === this.selectSKU.id);
      this.promotingSku = promotingSku ? true : false;
      if (promotingSku) {
        this.promotingMoney = fenToYuan(promotingSku.promotion_price);
        this.original_price = fenToYuan(this.selectSKU.price);
        // console.log(promotingSku);
        this.surplus = promotingSku.promotion_number - promotingSku.used_number;
        this.dealPromotionInfo();
        if (this.surplus === 0) {
          this.is_promotion = false;
          this.clearTimer();
          this.innerRemainPayTime = '';
          this.money = fenToYuan(this.selectSKU.price);
          this.promotingSku = false;
        }
      }
      if (bool) {
        return uni.showToast({
          title: '该商品规格已下架！',
          duration: 2000,
          icon: 'none',
          mask: true
        });
      }
    },
    cancelSelectSpec() {
      // this.selectSKU = JSON.parse(JSON.stringify(this.beforeSelectSku));
      // this.good_num = this.beforeGoodNum;
      // this.beforeSelectSku = null;
      // this.beforeGoodNum = null;
      this.closePopup();
    },
    ensureSelectSpec() {
      this.dealPromotionInfo();
      this.closePopup();
      switch (this.selectType) {
        case 1:
          this.addCartShop();
          break;
        case 2:
          this.enterOrder();
          break;
        default:
          break;
      }
    },
    subGoodNum() {
      this.good_num === 1 ? 0 : (this.good_num -= 1);
    },
    addGoodNum() {
      this.good_num += 1;
    },
    getProductRecommend: function() {
      const ret = getProductList(true);
      ret.then(value => {
        this.recommend_shop = value.data.data.info;
      });
    },
    dealPromotionTime() {
      const { end_time, start_time } = this.productPromotion;
      const Now = new Date().valueOf();
      this.endTime = end_time * 1000;
      this.startTime = start_time * 1000;
      if (this.startTime >= Now) {
        this.isPromotioning = false; // 促销未开始
        const res = this.countDown(this.startTime / 1000, new Date().valueOf() / 1000, 'hh:mm:ss');
        this.innerRemainPayTime = res;
        if (this.timer) {
          this.clearTimer();
        }
        if (!res) {
          this.isPromotioning = true;
          this.dealPendingTime('hh:mm:ss', 'activing');
          return false;
        } else {
          this.dealPendingTime('hh:mm:ss', 'pending');
        }
      } else if (this.startTime < Now && Now <= this.endTime) {
        // 促销活动已经开始
        this.activity_time_title = '活动仅剩';
        this.isPromotioning = true;
        const res = this.countDown(this.endTime / 1000, new Date().valueOf() / 1000, 'hh:mm:ss');
        this.innerRemainPayTime = res;
        if (this.timer) {
          this.clearTimer();
        }
        if (!res) {
          this.isPromotioning = true;
        }
        this.dealPendingTime('hh:mm:ss', 'activing');
      } else {
        this.is_promotion = false;
        this.innerRemainPayTime = '';
      }
    },
    getProductInfo: function(id) {
      this.getCartCount();
      const ret = getProductInfo(id);
      ret.then(value => {
        this.good_name = value.data.data.info.title;
        this.good_name_title = value.data.data.info.description;
        this.good_unit = value.data.data.info.unit;
        // 轮播图 商品入户图 商品介绍图
        this.img_list = [];
        this.desc_img = [];
        value.data.data.info.productImages.forEach((i, k) => {
          // sku 图
          if (i.type === '1') {
            this.sku_img.push({ img_src: i.url });
          }
          // 轮播图
          if (i.type === '2') {
            this.img_list.push({ img_src: i.url });
          }
          // 商品介绍图
          if (i.type === '3') {
            this.desc_img.push({ img_src: i.url });
          }
        });
        console.log('this.desc_img', this.desc_img);
        // 优惠券
        if (value.data.data.info.coupon_list.length > 0) {
          this.coupon = '领取优惠券';
          this.coupon_list = value.data.data.info.coupon_list.map(item => ({ ...item, code: item.id }));
          this.coupon_text = value.data.data.info.coupon_text;
        }
        // 默认选中最小的sku
        console.log(value.data.data.info);
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
        skuValue.then(skuValue => {
          console.log(skuValue);
          this.productSku = skuValue.data.data.info.productSku;
          this.productSpecKey = skuValue.data.data.info.productSpecKey;
        });
      });
    },
    dealPromotionInfo() {
      const { productPromotionSku = [] } = this.productPromotion || {};
      const promotingSku = productPromotionSku.find(sku => String(sku.product_sku_id) === String(this.selectSKU.id));
      this.promotingSku = promotingSku ? true : false;
      if (promotingSku) {
        this.promotingMoney = fenToYuan(promotingSku.promotion_price);
        this.is_promotion = true;
        this.money = fenToYuan(promotingSku.promotion_price);
        this.original_price = fenToYuan(this.selectSKU.price);
        // console.log(promotingSku);
        this.surplus = promotingSku.promotion_number - promotingSku.used_number;
        if (this.surplus === 0) {
          this.is_promotion = false;
          this.clearTimer();
          this.innerRemainPayTime = '';
          this.is_promotion = false;
          this.money = fenToYuan(this.selectSKU.price);
          this.promotingSku = false;
        }
        this.dealPromotionTime();
      } else {
        this.clearTimer();
        this.innerRemainPayTime = '';
        this.is_promotion = false;
        this.money = fenToYuan(this.selectSKU.price);
      }
    },
    addCartShop: function() {
      const cart = addCart(this.selectSKU.id, this.good_num);
      uni.showLoading({
        title: '正在添加到购物车...'
      });
      cart.then(value => {
        this.getCartCount();
        uni.hideLoading();
        return uni.showToast({
          title: '添加成功！',
          duration: 2000,
          icon: 'success',
          mask: true
        });
      });
      this.selectType = 0;
    },
    getCartCount: function() {
      const ret = getCartCount();
      ret.then(value => {
        this.good_car_num = value.data.data.info.quantity_count;
      });
    },
    getAddressList: function() {
      // 地址加载
      const addressListValue = getAddressList();
      addressListValue.then(value => {
        this.addressList = value.data.data.info;
        this.addressList.forEach((i, k) => {
          if (i.is_default === '1') {
            this.activeAddress = i;
          }
        });
      });
    },
    selectAddress: function(index) {
      this.activeAddress = this.addressList[index];
      this.closePopup();
    },
    AddAddress: function() {
      this.$store.commit('users/setEditorData', null);
      return uni.navigateTo({
        url: '/pages/addAddress/addAddress?type=add'
      });
    },
    gotoShoppingCart: function(e) {
      return uni.navigateTo({
        url: '/pages/shop/shoppingCart/index'
      });
    },
    enterOrder: function(e) {
      // 组织调用确认订单的数据接口
      // type 1 购物车 2 直接购买
      this.$store.commit('orders/setShopSelectSku', {
        sku_type: 2,
        sku_list: [
          {
            sku_id: parseInt(this.selectSKU.id, 10),
            quantity: this.good_num
          }
        ],
        activeAddress: this.activeAddress
      });
      this.selectType = 0;
      return uni.navigateTo({
        url: '/pages/shop/order/enter'
      });
    },
    openSku: function() {
      this.$refs.popup.open();
      this.isPopupSku = true;
      // 打开规格选择时候，记录住之前选中的sku以及数量,方便取消时候回填处理
      this.beforeSelectSku = JSON.parse(JSON.stringify(this.selectSKU));
      this.beforeGoodNum = this.good_num;
      this.isPopupCoupon = false;
      this.isPopupAddress = false;
      this.isMask = false;
    },
    openCoupon: function() {
      if (!this.coupon_list.length) return false;
      this.$refs.popup.open();
      this.isPopupCoupon = true;
      this.isPopupSku = false;
      this.isPopupAddress = false;
      this.isMask = false;
    },
    openAddress: function() {
      this.$refs.popup.open();
      this.isPopupAddress = true;
      this.isPopupSku = false;
      this.isPopupCoupon = false;
      this.isMask = false;
    },
    openShare: function() {
      this.$refs.popup.open();
      this.isPopupAddress = false;
      this.isPopupSku = false;
      this.isPopupCoupon = false;
      this.isMask = true;
    },
    changePopup({ show }) {
      this.showPopup = show;
      this.selectType = show ? this.selectType : 0;
    },
    closePopup() {
      this.$refs.popup.close();
    }
  }
};
</script>

<style scoped lang="less">
.content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  shop-banner {
    width: 100%;
  }
  .good-title {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    .good-promotion {
      height: 112.2upx;
      background-image: url(https://admin.dajxyl.com/oss?path=img/bg_good_promotion.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      position: relative;
      margin-bottom: 40upx;
      top: -1.85upx;
      .good-promotion-view-img {
        display: inline;
        position: absolute;
        top: 13upx;
        left: 49upx;
        .good-promotion-img {
          width: 79upx;
          height: 86upx;
        }
      }
      .good-promotion-view-list {
        display: inline-block;
        margin-left: 145upx;
        .good-promotion-view-money {
          display: block;
          padding-top: 5upx;
          .good-promotion-money-unit {
            font-size: 32upx;
            color: #fff;
          }
          .good-promotion-money-s {
            font-size: 46upx;
            color: #fff;
          }
        }
        .good-promotion-attribute {
          display: block;
          margin-top: -21upx;
          .good-promotion-original-price {
            text-decoration: line-through;
            font-size: 24upx;
            color: #fff;
          }
          .good-promotion-surplus {
            padding-left: 29upx;
            font-size: 24upx;
            color: #fff;
          }
        }
      }
      .good-promotion-time {
        display: inline;
        position: absolute;
        right: 11.5rpx;
        top: 50%;
        width: 172rpx;
        transform: translateY(-50%);
        &__title {
          display: flex;
          align-items: center;
        }
        .good-promotion-time-img {
          display: inline;
          margin-top: 15upx;
          width: 26upx;
          height: 26upx;
        }
        .good-promotion-time-title {
          display: inline;
          left: 30upx;
          margin-top: 10upx;
          font-size: 24upx;
          color: #333;
        }
        .blot {
          font-size: 24upx;
          font-weight: 400;
          color: #fd7600;
          background-color: rgba(255, 255, 255, 0);
          position: relative;
          top: -10upx;
        }
        .time-hour {
          display: inline-block;
          text-align: center;
          position: relative;
          top: -10upx;
          width: 36upx;
          height: 36upx;
          margin: 0 7upx;
          padding: 2upx;
          border-radius: 11upx;
          background-color: #fd7600;
          font-size: 24upx;
          color: #fff;
        }
      }
    }
    .good-money {
      margin-top: 20upx;
      margin-left: 20upx;
      .good-money-unit {
        font-size: 32upx;
        color: #fd7600;
      }
      .good-money-s {
        font-size: 46upx;
        color: #fd7600;
      }
    }
    .good-title-list {
      margin-left: 20upx;
      margin-bottom: 31upx;
      padding-right: 24upx;
      .good-title-item-h1 {
        font-size: 32upx;
        color: #333;
        margin-top: 10upx;
        margin-bottom: 18upx;
      }
      .good-title-item-p {
        font-size: 28upx;
        color: #666;
      }
    }
  }
  .good-attribute {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    margin-top: 24upx;
    .border {
      border-bottom: 1upx solid rgba(153, 153, 153, 0.3);
    }
    .good-attribute-item {
      height: 98upx;
      line-height: 98upx;
      .good-attribute-none {
        color: #999;
      }
      h1 {
        display: inline;
        font-size: 30upx;
        margin-left: 22upx;
        width: 48upx;
      }
      p {
        display: inline;
        font-size: 26upx;
        margin-left: 55upx;
      }
      img {
        display: inline;
        width: 40upx;
        height: 40upx;
        float: right;
        padding-top: 35upx;
        padding-right: 23upx;
      }
    }
  }
  .good-desc {
    margin-top: 24upx;
    display: flex;
    width: 100%;
    background: #ffffff;
    flex-flow: wrap;
    justify-content: center;
    .title {
      width: 100%;
      height: 106upx;
      display: flex;
      align-items: center;
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
      height: 1.3rem;
      font-size: 1.125rem;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      margin-left: 0.375rem;
    }
    .cont {
      width: 100%;
      padding: 0;
      view {
        width: 100%;
        margin-bottom: -15upx;
        padding: 0;
        img {
          width: 100%;
          height: auto;
        }
      }
    }
  }
}
.btn_bottom {
  width: 100%;
  height: 98upx;
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999999999;
  .btn_left {
    .btn_shop_car {
      margin-left: 45upx;
      background-image: url(https://admin.dajxyl.com/oss?path=img/btn_shop_car.png);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      width: 56upx;
      height: 49upx;
    }
    .num {
      color: #fd7600;
      text-align: center;
      line-height: 25.9upx;
      font-size: 26upx;
      position: relative;
      left: 28upx;
      top: -10upx;
      width: 47upx;
      height: 25.9upx;
      background-color: #fff;
      border-radius: 12.95upx;
      border: 1px solid #fd7600;
    }
  }
  .btn_right {
    margin: 0 17upx;
    .white {
      margin-left: 120upx;
      border: 1px solid #fd7600;
      background-color: #fff;
      color: #fd7600;
    }
    button {
      width: 220upx;
      height: 70upx;
      background: #fd7600;
      border-radius: 37upx;
      font-size: 30upx;
      line-height: 2.4 !important;
    }
  }
}
.ipx-btn-bottom {
  bottom: 20rpx;
}

.popupView {
  position: relative;
  width: 100%;
  max-height: 941rpx;
  background-color: #fff;
  border-radius: 20upx 20upx 0 0;
  overflow-y: scroll;
  z-index: 999;

  .popupSkuView {
    min-height: 120rpx;
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
      padding-bottom: 160upx;
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
        margin-bottom: 25upx;
        margin-top: 25upx;
      }
    }
  }

  .popupAddressView {
    position: relative;
    overflow-y: auto;
    min-height: 120rpx;
    padding-bottom: 165upx;
    .popupClose {
      position: absolute;
      top: 33upx;
      left: 90%;
      background-color: #ffffff;
      z-index: 999999;
      img {
        width: 46upx;
        height: 46upx;
      }
    }
    .popupAddressView-list {
      max-height: 800upx;
      padding-bottom: 200px;
      .popupAddressView-item {
        margin-top: 36upx;
        padding-left: 87upx;
        position: relative;
        .popupAddressView-item-span {
          display: block;
          background-image: url(https://admin.dajxyl.com/oss?path=img/dizhi.png);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          width: 36upx;
          height: 45upx;
          position: absolute;
          left: 20upx;
          top: 35upx;
        }
        .active {
          display: block;
          background-image: url(https://admin.dajxyl.com/oss?path=img/shopping_cart_selected.png);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          width: 40upx;
          height: 40upx;
          position: absolute;
          left: 20upx;
          top: 35upx;
        }
        .popupAddressView-item-name {
          font-size: 30upx;
          color: #333;
        }
        .popupAddressView-item-tel {
          font-size: 28upx;
          color: #666;
          margin-left: 36upx;
        }
        .popupAddressView-item-desc {
          font-size: 28upx;
          color: #333;
          margin-top: 12upx;
        }
      }
    }
    .popupAddressView-sub {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #fff;
      .popupAddressView-sub-btn {
        width: 90%;
        border-radius: 46upx;
        height: 92upx;
        background-color: #fd7600;
        color: #fff;
        font-size: 35.64upx;
        line-height: 95upx;
        margin-bottom: 45upx;
        margin-top: 25upx;
      }
    }
  }
  .popupCouponView {
    position: relative;
    .popupClose {
      position: absolute;
      top: 33upx;
      left: 90%;
      background-color: #ffffff;
      z-index: 999999;
      img {
        width: 46upx;
        height: 46upx;
      }
    }
    .popupCouponView-view {
      .couponsGet {
        margin-top: 30upx;
      }
    }
  }
}
.wos-scroll-no {
  height: 98vh;
  overflow-y: hidden;
}
.wos-scroll-yes {
  height: auto;
  overflow-y: auto;
}
.wx-share {
  width: 119rpx;
  height: 47rpx;
  font-family: PingFang SC;
  position: absolute;
  right: 30rpx;
  z-index: 9999;
  .iconfont {
    margin-right: 10rpx;
  }
}
@font-face {
  font-family: "iconfont"; /* Project id 2787414 */
  src: url('//at.alicdn.com/t/font_2787414_fx7qwcsbcve.woff2?t=1632470449916') format('woff2'),
  url('//at.alicdn.com/t/font_2787414_fx7qwcsbcve.woff?t=1632470449916') format('woff'),
  url('//at.alicdn.com/t/font_2787414_fx7qwcsbcve.ttf?t=1632470449916') format('truetype');
}
.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  fill: currentColor;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.icon-fenxiangshangpin:before {
  content: '\e655';
}
/deep/ .uni-searchbar__box {
  border-radius: 36rpx !important;
}
.share-btn{
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fd7600;
  border: none;
  background: rgba(253, 118, 0, 0.1);
  border-radius: 23rpx;
  font-size: 26rpx;
  &:after{
    border: none;
  }
}
</style>

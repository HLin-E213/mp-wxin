<!--
* @Description:  购物车
* @Author: mahui
* @Date: 2020/11/6 2:32 PM
-->
<template>
  <layout
      title="购物车"
      :showFooter="true"
      :footerHeight="98"
  >
    <view class="shop-cart-wrap">
      <view
          class="card-item-wrap"
          v-for="(item, index) in cartList"
          :key="index"
      >
        <card
            :title="item.product.title.length > 12 ? item.product.title.slice(0, 12) + '...' : item.product.title"
            showSelect
            :selectImg="item.checked ? checkImg : unCheckImg"
            @clickTitle="selectProduct(1,index)"
            :class="item.product.status === '2' ? 'off-the-shelf' : ''"
        >
          <view slot="content" class="goods-list-wrap">
            <view class="off-the-shelf-img" v-if="item.product.status === '2'">
              <img src="https://admin.dajxyl.com/oss?path=img/off_the_shelf.png" alt="">
            </view>
            <view
                class="goods-list-item"
                v-for="(goodItem, goodIndex) in item.product_sku_list"
                :key="goodIndex"
                @click="selectProduct(2,index,goodIndex,goodItem.status)"
            >
              <view class="off-the-shelf-img-item" v-if="goodItem.status === '2'">
                <img src="https://admin.dajxyl.com/oss?path=img/off_the_shelf.png" alt="">
              </view>
              <img
                  class="goods-list-item__check-box"
                  :src="selectedSkuId.includes(goodItem.id) ?  checkImg : unCheckImg"
                  alt="">
              <view class="goods-list-item__img-wrap">
                <img
                    class="goods-list-item__img-wrap__img"
                    :src="item.productImages.url" alt="">
              </view>
              <view class="goods-list-item__text">
                <view class="goods-list-item__text__name-wrap">
                  <view class="name">{{ skuTitle(goodItem) }}</view>
                  <view
                      class="del"
                      @click.stop="deleteGoods(goodItem,goodIndex,index)"><img class="icon" src="https://admin.dajxyl.com/oss?path=img/shopping_cart_del.png" alt="">删除</view>
                </view>
                <view class="amount">￥{{ price(goodItem.price,index,goodIndex,item) / 100 }}</view>
                <view class="mount-wrap">
                  <view>数量</view>
                  <view class="sub-add">
                    <img @click.stop="cartReduce(index,goodIndex,item)" class="sub" :src="getSubImg(goodItem.cart_sku_quantity,item.product.status)" alt="">
                    <view class="mount">{{ goodItem.cart_sku_quantity }}</view>
                    <img @click.stop="cartAdd(index,goodIndex,item)" class="sub" src="https://admin.dajxyl.com/oss?path=img/shopping_cart_add.png" alt="">
                  </view>
                </view>
              </view>
            </view>
          </view>
        </card>
      </view>
    </view>
    <view slot="footer" class="footer-wrap">
      <view class="check-box">
        <img @click.stop="selectAllCart" class="check-box-img" :src="isAllCartChecked ? checkImg : unCheckImg" alt="">
        全选
      </view>
      <view class="total-wrap">共{{ getTotalMount }}件，<view class="total-label">合计：</view><view class="total-amount">￥{{ getTotalPrice }}</view></view>
      <view @click.stop="toPay" class="to-pay">去结算</view>
    </view>
    <Modal
        ref="Modal"
        :showTitle="false"
        content="确认从购物车里删除该商品？"
        @confirm="confirm"
        @cancel="close"
    ></Modal>
  </layout>

</template>

<script>
import layout from "@/components/layout/index.vue";
import card from '@/components/Card';
import Modal from '@/components/Modal';
import {addCart, GetCartList, DelCartItem} from '../../../api/shop/cart';
import {mapState, mapMutations} from 'vuex';

const subIMg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_sub.png';
const unSubIMg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_un_sub.png';
const unCheckImg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_unselect.png';
const checkImg = 'https://admin.dajxyl.com/oss?path=img/shopping_cart_selected.png';
const undercarriage = '2'; // 商品处于下架状态

export default {
    name: 'shopping-cart',
    components: {
        layout,
        card,
        Modal,
    },
    data() {
        return {
            carData: [],
            cartList: [],
            checkImg,
            unCheckImg,
            delCartItem: {},
            delCartIndex: {},
            page: 1,
            currentPage: 0,
            totalPage: 0,
            selectedSku: [],
        };
    },
    computed: {
      getSubImg() {
          return function(mount,status){
              if (status == '2') {
                return unSubIMg;
              }
              return mount <= 1 ? unSubIMg: subIMg
          }
      },
        selectedSkuId() {
          return this.selectedSku.map(item => item.id);
        },
        getTotalMount() { // 获取总件数
          return this.selectedSku.reduce((total, sku) => (total += Number(sku.cart_sku_quantity)), 0) || 0;
        },
        getTotalPrice() { // 获取总金额数
          let price = 0;
          this.selectedSku.forEach((sku) => {
            if (sku.promotion_price) {
              price += sku.cart_sku_quantity * sku.promotion_price
            } else {
              price += sku.cart_sku_quantity * sku.price
            }
          });
          return price / 100;
        },
      skuTitle() {
        return function ({product_spec}) {
          let title = '';
          product_spec.forEach((i, k) => {
            title += i.product_spec_value.value + '，';
          });
          title = title.substr(0, title.length - 1);
          return title.length > 8 ? title.slice(0, 8) + '...' : title;
        }
      },
        canUseProduct() {
          return this.cartList.filter(cart => (cart.product.status !== undercarriage)); // 未下架的商品才可使用
        },
        isAllCartChecked() {
          return this.canUseProduct.every((cart) => (cart.checked === true));
        },
      price(){
        return function(price,index,goodIndex,good){
          let obj = this.cartList[index].product_sku_list[goodIndex],goodNum = 0,promotion_price = null;
          this.cartList[index].product_sku_list.forEach((i, k) => {
             goodNum += Number(i.cart_sku_quantity);
          });
          if (good.productPromotion) {
            if (Number(goodNum) + Number(good.productPromotion.used_number) <= Number(good.productPromotion.limit_number)) {
              good.productPromotion.productPromotionSku.forEach((j, n) => {
                if (obj.id === j.product_sku_id) {
                   if (Number(j.promotion_number - j.used_number) >= Number(obj.cart_sku_quantity)) {
                     promotion_price = j.promotion_price;
                   }
                }
              });
            }
          }
          if (promotion_price !== null) {
            obj.promotion_price = promotion_price;
            return promotion_price;
          } else {
            obj.promotion_price = null;
          }
          return price;
        };
      },
    },
    mounted() {
    },
    onShow(){
      this.cartList = [];
      this.selectedSku = [];
      this.getCartList();
      this.$store.commit('orders/setActiveCoupon', []);
    },
    onReachBottom() {
      if (this.page < this.totalPage) {
        this.page++;
        this.getCartList();
      }
    },
    onPullDownRefresh() {
      this.page = 1;
      this.cartList = [];
      this.refreshing = true;
      this.getCartList(1);
    },
    methods: {
      ...mapMutations('orders',{
        'setShopCouponList':'setShopCouponList',
        'setActiveCoupon': 'setActiveCoupon',
      }),
        async getCartList(page = this.page){
          let cartList = [];
          const cartListValue = GetCartList(page);
          cartListValue.then((value) => {
            this.currentPage = value.data.data.currentPage;
            this.totalPage = value.data.data.totalPage;
            if (this.refreshing) {
                this.$nextTick(() => uni.stopPullDownRefresh());
            }
            if (value.data.data.info.length > 0) {
                 cartList = value.data.data.info.map((item) => ({
                    ...item,
                    checked: false,
                }));
              this.cartList.push(...cartList);
              console.log(this.cartList);
            }
          });
        },
        toPay() {
            // 组织调用确认订单的数据接口
            // type 1 购物车 2 直接购买
            const sku_list = this.selectedSku.map((sku) => ({ sku_id: Number(sku.id), quantity: Number(sku.cart_sku_quantity) }));
            if (!sku_list.length) {
                uni.showToast({
                    title: '请先选择需要去结算的订单!',
                    icon: 'none',
                    duration: 2000
                });
                return false;
            }
            this.$store.commit('orders/setShopSelectSku', {
                sku_type: 1,
                sku_list,
                activeAddress: this.activeAddress,
            });
            return uni.navigateTo({
                url: '/pages/shop/order/enter'
            });
        },
        deleteGoods(obj,index,itemIndex) {
            this.delCartItem = obj;
            this.delCartIndex = {
              index,
              itemIndex
            };
            this.$refs.Modal.open();
        },
        isUndercarriage(product) { // 选择商品的时候，该商品已经下架不允许购买，且不允许选中
            if (!product) return false;
            if (String(product.status) === undercarriage) {
                uni.showToast({
                    title: '该商品已下架!',
                    icon: 'none',
                    duration: 3000
                });
                throw new Error('商品已下架，不允许选择');
            }
        },
        selectAllCart() {
            const isAllCartSelected = this.canUseProduct.every(cart => (cart.checked === true)); // 是否已经全部选中购物车
            if (isAllCartSelected) { // 如果全部选中购物车，就取消全部选中，
                this.cartList = this.cartList.map((cart) => {
                    const temp = {...cart };
                    if (temp.product.status !== undercarriage) {
                        temp.checked = false;
                        temp.product_sku_list.map((sku) => this.toogleSku(sku, 'unselect'));
                    }
                    return temp;
                });
            } else { // 操作全部选中
                this.cartList = this.cartList.map((cart) => {
                    const temp = {...cart };
                    if (temp.product.status !== undercarriage) {
                        temp.checked = true;
                        temp.product_sku_list.map((sku) => this.toogleSku(sku, 'select'));
                    }
                    return temp;
                });
            }
        },
        /**
         * 购物车商品选择
         * @params
         * type： 选择类型 1代表选择该skulist，2代表选择单个的sku
         * cartIndex 代表购物车下标，
         * skuIndex 代表当前选择中的商品下标，
         * */
        selectProduct(type = 1, cartIndex, skuIndex, status) {
            const cart =  this.cartList[cartIndex]; // 第几个购物车
            const skus = cart.product_sku_list;
            if (status === '2') {
              return uni.showToast({
                title: '该商品sku已经下架！',
                duration: 2000,
                icon: 'none',
                mask: true,
              });
            }
            switch (type) {
                case 1: {
                    this.isUndercarriage(cart.product);
                    const isAllSkusSelected = skus.every(item => this.selectedSkuId.includes(item.id));
                    if (isAllSkusSelected) {
                        skus.map(item => this.toogleSku(item, 'unselect'));
                    } else {
                        skus.map(item => this.toogleSku(item, 'select'));
                    }
                    cart.checked = !isAllSkusSelected;
                    break;
                }
                case 2: {
                    this.isUndercarriage(cart.product);
                    this.toogleSku(skus[skuIndex]);
                    this.$nextTick(() => {
                        const isAllSkusSelected = skus.every(item => this.selectedSkuId.includes(item.id));
                        cart.checked = isAllSkusSelected;
                    }, 300);
                    break;
                }
                default: {
                    break;
                }
            }
        },
        toogleSku(sku, isSelect) {
            // 对选中sku的操作，有就删除，没有就添加；isSelect 指定删除还是添加 true为添加
            let index;
            this.selectedSku.forEach((item, i) => {
                if (item.id === sku.id) {
                    index = i;
                }
            });
           if (index > -1) { // 选中的sku已经在选中的sku数组中
               if (!(isSelect === 'select')) { // 当指定该sku不是选中时，删除选中的内容
                   this.selectedSku.splice(index, 1);
               }
           } else {
               if (!(isSelect === 'unselect')) { // 当指定该sku不是取消选中的时，选中该sku内容
                   this.selectedSku.push(sku);
               }
           }
        },
        close() {
            this.$refs.Modal.close();
        },
        confirm() {
            if (this.delCartItem) {
              this.$refs.Modal.close();
              const ret = DelCartItem(this.delCartItem.id);
              ret.then((value)=>{
                this.cartList[this.delCartIndex.itemIndex].product_sku_list.splice(this.delCartIndex.index, 1);
                if (this.cartList[this.delCartIndex.itemIndex].product_sku_list.length === 0) {
                  this.cartList.splice(this.delCartIndex.itemIndex, 1);
                }
                this.selectedSku.forEach((i,k)=>{
                  if (i.id === this.delCartItem.id) {
                    this.selectedSku.splice(k, 1);
                  }
                });
                this.$refs.Modal.close();
              });
            }
        },
        cartAdd(index,goodIndex,good) {
          let obj = this.cartList[index].product_sku_list[goodIndex];
          if (good.product.status == '2') {
            uni.showToast({
              title: '该商品已下架!',
              icon: 'none',
              duration: 3000
            });
            return false;
          }
          const ret = addCart(obj.id,1);
          uni.showLoading({
            title: '正在添加到购物车...'
          });
          ret.then((value)=>{
            obj.cart_sku_quantity ++;
            this.cartList[index].product_sku_list[goodIndex];
            return uni.showToast({
              title: '添加成功！',
              duration: 2000,
              icon: 'success',
              mask: true,
            });
          });
        },
        cartReduce(index,goodIndex,good) {
          let obj = this.cartList[index].product_sku_list[goodIndex];
          if (good.product.status == '2') {
            uni.showToast({
                title: '该商品已下架!',
                icon: 'none',
                duration: 3000
            });
            return false;
          }
          if (obj.cart_sku_quantity <= 1) {
            return false;
          }
          const ret = DelCartItem(obj.id,1);
          uni.showLoading({
            title: '正在从购物车移除商品...'
          });
          ret.then((value)=>{
            obj.cart_sku_quantity --;
            return uni.showToast({
              title: '移除成功！',
              duration: 2000,
              icon: 'success',
              mask: true,
            });
          });
        },
    },
};
</script>

<style scoped lang="less">
  .off-the-shelf {
    background-color: rgba(51, 51, 51, 0.1);
  }
  .off-the-shelf-img {
    img {
      position: absolute;
      width: 125upx;
      height: 125upx;
      left: 420upx;
    }
  }
  .off-the-shelf-img-item{
    position: relative;
    img {
      position: absolute;
      width: 125upx;
      height: 125upx;
      left: 380upx;
      top: -50upx;
    }
  }
  .shop-cart-wrap{
    font-family: PingFang SC;
    margin: 24upx 20upx 0 20upx;
    .card-item-wrap{
      margin-bottom: 24upx;
    }
    .goods-list-wrap{
      padding: 31upx 0;
      .goods-list-item{
        display: flex;
        align-items: center;
        margin-bottom: 38upx;
        &__check-box{
          height: 30upx;
          width: 30upx;
        }
        &__img-wrap {
          display: flex;
          height: 180upx;
          width: 180upx;
          margin-left: 16upx;
          align-items: center;
          justify-content: center;
          //background: #F3F3F3;
          &__img{
            height: 180upx;
            width: 180upx;
            border-radius: 10px;
          }
        }
        &__text{
          flex: 1;
          color: #666666;
          margin-left: 26upx;
          &__name-wrap{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .name{
              font-size: 26upx;
              color: #666666;
            }
            .del{
              display: flex;
              align-items: center;
              padding: 4upx 15upx;
              background-color: rgba(253, 118, 0, .1);
              border-radius: 18px;
              font-size: 26upx;
              .icon{
                width:24upx;
                height:26upx;
              }
            }
          }
          .amount{
            font-size: 30upx;
            font-weight: 500;
            color: #FD7600;
          }
          .mount-wrap{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 26upx;
            .sub-add{
              display: flex;
              align-items: center;
              .sub{
                width: 51upx;
                height: 48upx;
              }
              .mount{
                font-size: 29upx;
                padding: 0 20upx;
              }
            }
          }

        }
      }
      .goods-list-item:last-of-type{
        margin-bottom: 0;
      }
    }
  }
  .footer-wrap{
    height: 100%;
    padding: 0 38upx;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color:#999999;
    font-size: 24upx;
    .check-box{
      display: flex;
      .check-box-img{
        width: 30upx;
        height: 30upx;
        margin-right: 9upx;
      }
    }
    .total-wrap{
      display: flex;
      .total-label{
        font-size: 26upx;
        color: #333333;
      }
      .total-amount{
        color: #FD7600;
      }

    }
    .to-pay{
      width:200upx;
      height: 70upx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 35upx;
      color: #ffffff;
      background: #fd7600;
    }
  }

</style>

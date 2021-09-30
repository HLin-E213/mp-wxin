<template>
  <view class="shop_saleHot" v-if="shopList.length > 0">
    <view class="title">
      <b></b>
      <p>推荐商品</p>
    </view>
    <view class="shop_saleContent">
      <view class="shop_sale_list" v-for="(i,k) in shopList" :key="k" @click="gotoInfo(i)">
        <img class="shop_left_content" mode="aspectFill" :src="i.productImages && i.productImages.url || ''" alt="">
        <view class="shop_right_content">
          <h4>{{ i.title && i.title.length > 8 ? i.title.slice(0,8) + '...' : i.title }}</h4>
          <h5>{{ i.description && i.description.length > 24 ? i.description.slice(0,24) + '...' : i.description }}</h5>
          <p class="shop_sale-price">￥{{ price(i) }}</p>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
    export default {
        name: "shopSale",
        props: {
            shopList: {
                type: Array,
                default: [],
            }
        },
      computed: {
        price() {
          return function ({productSkuByMinPrice, productPromotion}) {
            if (productPromotion) {
              let money = 0;
              productPromotion.productPromotionSku.forEach((i)=>{
                if (i.product_sku_id == productSkuByMinPrice.id) {
                  money = i.promotion_price / 100;
                }
              });
              return money;
            }
            return productSkuByMinPrice ? productSkuByMinPrice.price / 100 : 0;
          };
        },
      },
        methods: {
          // 跳转商品详情
          gotoInfo: function (obj) {
            return uni.navigateTo({
              url: '/pages/shop/detailsGood/index?id=' + obj.id,
            });
          }
        }
    }
</script>

<style scoped lang="less">
  // 推荐商品
  .shop_saleHot {
    margin-top: 24upx;
    display: flex;
    width: 100%;
    background: #FFFFFF;
    flex-flow: wrap;
    justify-content: center;
    .title {
      width: 100%;
      height: 1.815rem;
      display: flex;
      align-items: flex-end;
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
    .shop_saleContent {
      width: 94%;
      display: felx;
      margin-bottom: 10upx;
      .sale-price{
        font-size: 32rpx;
        font-weight: blod;
      }
      .shop_sale_list {
        width: 100%;
        height: 6rem;
        border-bottom: 1upx solid rgba(154, 154, 154, 0.3);
        display: flex;
        margin-top: 10upx;

        .shop_right_content h4 {
          width: 80%;
          height: 0.875rem;
          font-size: 0.94rem;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          margin-top: 0.315rem;
        }
        .shop_right_content h5 {
          width: 98%;
          height: 1.845rem;
          font-size: 0.815rem;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 1.065rem;
          margin-top: 0.625rem;
        }
        .shop_right_content {
          flex: 1;
          height: 5rem;
          margin-left: 2%;
        }
        .shop_sale-price {
          display: block;
          font-size: 30upx;
          font-weight: blod;
          padding-top: 0.5rem;
          color: rgba(253, 118, 0, 1);
          line-height: 1.065rem;
          margin-top: 0.065rem;
        }
      }
      .shop_sale_list:last-of-type{
        border-bottom: none;
      }
      .shop_sale_list img {
        width: 7.315rem;
        height: 5rem;
        border-radius: 0.5rem;
        margin-top: 2%;
      }
    }
  }
</style>

<!--
* @Description:
* @Author: mahui
* @Date: 2020/11/12 10:45 PM
-->
<template>
  <view
      class="shop-order-btns"
      :class="[`shop-order-btns-${align}`]"
  >
    <view
        class="btn"
        v-for="item in SHOP_ORDER_BTN"
        :key="item.label"
        @click="clickBtn(item)"
        :class="{'none': !item.isShow(type,status,pay_status,isShowRefund), 'btn-important': item.important}"
        :style="[btnStyle]"
    >
      {{ item.label }}
    </view>

  </view>
</template>

<script>
  import { SHOP_ORDER_BTN } from '../../config/constant';
  import { includes } from '../../utils/includes';

  export default {
        name: 'shopOrderBtn',
        props: {
            status: {  // 订单状态，根据订单状态去判断需要展示那些按钮
                required: true,
                default: 1,
            },
            type: {
              required: true,
              default: 1,
            },
            pay_status: {
              required: true,
              default: 1,
            },
            isShowRefund: {
              required: false,
              default: false,
            },
            orderInfo: {
                // 订单信息、其实可以传入订单唯一标识，然后根据订单唯一标识去vuex里面捞订单信息，这样更合理
                required: false,
                type: Object,
                default: () => {},
            },
            btnStyle: {
                // 按钮自定义样式
                required: false,
                type: Object,
                default: () => {},
            },
            align: { // 对齐方式
                required: false,
                type: String,
                default: 'right',
                validator(value) {
                    const acceptableValues = ['right', 'center', 'left'];
                    return includes(acceptableValues, value);
                },
            }
        },
        data() {
            return {
                SHOP_ORDER_BTN,
            };
        },
        methods: {
            clickBtn(item) {
              this.$emit(`click-${item.value}`,this.orderInfo) // 对每一个按钮进行绑定事件监听
            }
        },
    };
</script>

<style scoped lang="less">
  .shop-order-btns{
    display: flex;
    width: 100%;
    flex-flow: row;
    .btn{
      display: flex;
      width: 146upx;
      height: 52upx;
      border: 1px solid #fd7600;
      border-radius: 26upx;
      font-size: 28upx;
      color: #fd7600;
      background-color: #ffffff;
      justify-content: center;
      align-items: center;
    }
    .btn-important{
      border: none;
      background-color: #fd7600;
      color: #ffffff;
    }
    .none {
      display: none;
    }
  }
  .shop-order-btns-right{
    justify-content: flex-end;
    .btn{
      margin-left: 24upx;
    }
  }
  .shop-order-btns-left{
    justify-content: flex-start;
    margin-right: 24upx;
  }
  .shop-order-btns-center{
    justify-content: center;
    margin-left: 24upx;
  }

</style>

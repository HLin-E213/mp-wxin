export default {
    setOrderData(state, payload) {
        state.orderData = payload;
    },
    setOrderSpec(state, payload){
        state.orderSpec = payload;
    },
    setShopSelectSku(state, payload){
        state.sku_list = payload.sku_list;
        state.sku_type = payload.sku_type;
        state.activeAddress = payload.activeAddress;
    },
    setShopSelectAddress(state, payload) {
        state.activeAddress = payload;
    },
    setShopCouponList(state, payload){
        state.couponList = payload;
    },
    setActiveCoupon(state, payload){
        state.activeShopCoupon = payload;
    }
}

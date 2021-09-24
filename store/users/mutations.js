export default {
    setCity(state, payload) {
        // console.log(state.current,payload)
        state.current = payload;
    },
    setEditorData(state, payload) {
        state.editorData = payload;
    },
    setUserInfoData(state, payload) {
        state.userInfo = payload;
    },
    //存储优惠券列表
    setCouponList(state, payload) {
        state.couponList = payload;
    },
    //存储优惠券列表
    setAddressData(state, payload) {
        state.addressDataSingle = payload;
    },
	//点击记录选中的优惠券信息
	setCouponUseData(state,payload){
		state.couponUseData = payload;
	},
    // 修改昵称的状态
    upSet(state, payload) {
        state.upSet = payload;
    }
}

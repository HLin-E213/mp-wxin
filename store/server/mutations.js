export default {
    setImgurl(state, payload) {
        state.imgUrl = null;
        state.imgUrl = payload;
    },
    setMenuList(state, playload) {
        state.menu_list = playload;
    },
	setProviderService(state,payload){
		state.providerServiceList = payload;
	},
    setStaffID(state, payload) {
        state.staffID = payload;
    },
    setStaffInfo(state, payload) {
        state.staffInfo = payload;
    },
}

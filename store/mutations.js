export default {
    //存储token
    setToken(state, payload) {
        state.token = payload;
    },
    //设置邀请码
    setCode(state, payload) {
        state.codeInvitation = payload;
    },
    // 设置页面状态
    setAddressType(state, payload){
        state.addressType = payload;
    },
    setH5(state, payload){
        state.h5 = payload;
    },
}

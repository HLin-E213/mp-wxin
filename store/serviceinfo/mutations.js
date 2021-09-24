export default {
    setData(state, payload) {
        // homeTitle
        let arr = payload;
        if (arr.homeTitle) {
            arr.homeTitle.map((item, index) => {
                if (item.length > 5) {
                    item = item.slice(0, 5) + '...';
                    payload.homeTitle[index] = item;
                }
                return arr
            })
        }
        if (arr.describe) {
            arr.describe = arr.describe.replace(/\<img/gi, '<img style="display:block;max-width: 100%!important;margin:0 !important;" ');
        }
        if (arr.combo_content) {
            arr.combo_content = arr.combo_content.replace(/\<img/gi, '<img style="display:block;max-width: 100%!important;margin:0 !important;" ');
        }
        if (arr.advantage) {
            arr.advantage = arr.advantage.replace(/\<p/gi, '<p style="font-size: 0;height: fit-content"');
            arr.advantage = arr.advantage.replace(/\<img/gi, '<img style="display:block;max-width: 100%!important;margin:0 !important;" ');
        }
        state.serviceInfo = arr;
    },
    setOrderDataStaffNum(state, payload) {
        state.orderInfo.staffNum = payload;
    },
    setAppointmentTime(state, payload) {
        const { timestamp, addMount } = payload;
        state.orderInfo.appointmentTime = timestamp;
        state.orderInfo.addMount = addMount;
    },
    setOrderRemarks(state, payload) {
        state.orderInfo.remarks = payload;
    },
	setOrderInfo(state, payload) {
	    state.orderInfo = payload;
	},
    setOrderDataSpec(state,payload){
        state.orderInfo.spec = payload;
    },
    setCommentDetail(state, payload) {
      state.commentDetail = payload;
      console.log('commentDetail', payload);
    },
}

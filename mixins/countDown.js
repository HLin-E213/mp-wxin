/**
 * @Description: 专用来处理倒计时的mixins
 * @Author: mahui
 * @Date: 2020/12/24 10:18 AM
 */
export default{
    data() {
        return {
            innerRemainPayTime: '', // 倒计时展示
        };
    },
    methods: {
        dealPendingTime(format = 'mm:ss', type = 'activing') { //type activing 代表正在进行中，pending 代表等待进行中
            this.setTimer(1, () => {
                let res;
                if (type === 'activing') {
                    res = this.countDown(this.endTime / 1000, new Date().valueOf() / 1000, format);
                } else if(type === 'pending') {
                    res = this.countDown(this.startTime / 1000, new Date().valueOf() / 1000,  format);
                }
                if (!res) return;
                this.innerRemainPayTime = res;
                this.dealPendingTime(format, type);
            });
        },
        countDown(endTime, baseTime = new Date(), format = 'mm:ss') {
            let result = false;
            const diff = endTime - baseTime;
            let h = 0;
            let m = 0;
            let s = 0;
            let d = 0;
            if (diff < 0) return false;
            d = parseInt(diff / 86400, 10);
            h = parseInt((diff / 60 / 60) % 24, 10);
            m = parseInt((diff / 60) % 60, 10);
            s = parseInt(diff % 60, 10);
            switch (format) {
                case 'mm:ss': {
                    result = `${m}分${s}秒`;
                    break;
                }
                case 'dd:hh:mm:ss': {
                    result = `${d}天${h}小时${m}分${s}秒`;
                    break;
                }
                case 'hh:mm:ss': {
                    result = `${h}:${m}:${s}`;
                    break;
                }
                case 'customer': {
                    result = {
                        d,
                        h,
                        m,
                        s,
                    };
                    break;
                }
                default: {
                    break;
                }
            }
            return result;
        },
        // 开启定时查询事件
        setTimer(timeSpread = 1, cb) {
            this.timer = setTimeout(() => {
                cb && typeof cb === 'function' && cb();
            }, timeSpread * 1000);
        },
        clearTimer() {
            clearTimeout(this.timer);
            this.timer = null;
        },
    },
}

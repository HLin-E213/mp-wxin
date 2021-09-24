/**
 * @Description: 对金额的处理
 * @Author: mahui
 * @Date: 2020/12/20 12:40 AM
 */
const toDecimal2 = (x) => {
    let f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
     f = Math.round(x * 100) / 100;
    let s = f.toString();
    let rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
};
export const fenToYuan = (fen) =>{
    let num = fen;
    num = fen * 0.01;
    num += '';
    const reg = num.indexOf('.') >-1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;
    num = num.replace(reg,'$1');
    num = toDecimal2(num);
    return num;
};
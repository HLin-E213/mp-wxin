/**
 * 返回 13 位时间戳.
 *
 * @param datestr
 * @returns {number}
 */
export const getTimestamp = (datestr) => {
  datestr = datestr.replace(/-/g, "/");
  let date = new Date(datestr);
  return parseInt(date.getTime());
};
/**
 * 获取当前时间差.
 *
 * @param datestr
 * @param now 时间差基准时间戳，秒
 * @returns {*}
 */
export const getTimeDifferenceByNow = (datestr, now= new Date().getTime())  => {
  if (!datestr) return ''
  let ms = now- getTimestamp(datestr);
  
  let m = ms / 1000 / 60 + 0.0001; // 最小1分钟，+ 0.0001 避免出现 0
  if (m < 60) {
    return Math.ceil(m) + '分钟';
  }
  
  let h = m / 60;
  if (h < 24) {
    return parseInt(h) + '小时';
  }
  
  let d = h / 24;
  if (d < 30) {
    return parseInt(d) + "天";
  }
  
  let M = d / 30;
  if (M < 12) {
    return parseInt(M) + "月"
  }
  
  return parseInt(M / 12) + "年";
};

export const CHINESE_REGEX = /[\u4e00-\u9fa5]/g;
/**
 * 按照字符最大长度截取字符串
 * 一个中文两个字符 其他的为一个字符
 * @params
 * name string required
 * maxLen number 需要截取的字符长度，如果name的总长度不超过maxLen则返回原字符串，否则进行截取
 * @return string
 * */
export const getName = (name, maxLen) => {
  let len = 0,
    result = [];
  const nameCodes = name.split('');
  nameCodes.some((item) => {
    if (CHINESE_REGEX.test(item)) {
      len += 2;
    } else {
      len += 1;
    }
    result = [...result, item];
    return len >= maxLen;
  });
  return result.join('');
};
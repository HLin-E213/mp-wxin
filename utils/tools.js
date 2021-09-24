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

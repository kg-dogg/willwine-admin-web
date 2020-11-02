/**
 * 公共的filter方法
 *
 * @author 黄硕 <kg_dogg@126.com>"
 */
import Vue from 'vue';

export default (function () {
  // 转化图片地址为cdn绝对路径
  Vue.filter('cdn_img', (value) => {
    if (typeof value === 'undefined' || value === '' || value === null) {
      return '';
    }
    return value.startsWith('http') ? value : (CDN_URL + value);
  });

  /**
     * 获取时间字符串的date
     */
  Vue.filter('time_get_date', (value) => {
    if (!value || value === null) {
      return '0000-00-00';
    }
    return moment(value).format('YYYY-MM-DD');
  });

  /**
     * 获取时间字符串的time
     */
  Vue.filter('time_get_time', (value) => {
    if (!value || value === null) return '-';
    return moment(value).format('HH:mm');
  });


  // 转化为2位float数字现实
  Vue.filter('number2float', value => Number(value).toFixed(2));


  // 显示字数控制, 超过则用...显示
  Vue.filter('more', (value, num) => (value.length > num ? `${value.slice(0, num)}...` : value));
}());

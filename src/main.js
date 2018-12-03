import Vue from 'vue';
import axios from 'axios';
import lockr from 'lockr';
import lodash from 'lodash';



// A modern alternative to CSS resets
// import 'normalize.css/normalize.css'

// elementUI
import ElementUI from 'element-ui';

// global css
import '@/assets/styles/index.scss'

import App from './App';
import router from './router';
import store from './store';

import '@/icons';
import i18n from './lang' // Internationalization
import helper from './services/helper';
import * as filter from './utils/filter';


window._ = lodash;
window.lockr = lockr;

Vue.use( ElementUI, {
  size: 'medium', // set element-ui default size
  i18n: ( key, value ) => i18n.t( key, value )
} );
// window.Message = ElementUI.Message
window.toastr = ElementUI.Message;
window.Notification = ElementUI.Notification;


Vue.config.productionTip = false;



window.axios = axios;
window.router = router;
window.helper = helper;
Vue.prototype.trans = ( string, args ) => {
  let value = _.get( window.i18n, string );

  _.eachRight( args, ( paramVal, paramKey ) => {
    value = _.replace( value, `:${paramKey}`, paramVal );
  } );
  return value;
};

/*=======================================================
 *   此处为后期优化合并与删除
 * =====================================================*/
import VTooltip from 'v-tooltip';




window.CDN_URL = CDN_URL;
window.API_URL = API_URL; // 后期删除
window.FRONT_URL = FRONT_URL;
window.axios.defaults.baseURL = API_URL;
window.axios.defaults.headers.common[ 'X-Requested-With' ] = 'XMLHttpRequest';
axios.defaults.headers[ 'Content-Type' ] = 'application/json';
axios.defaults.responseType = 'json';
window.axios.defaults.headers.common.Authorization = `Bearer ${lockr.get('auth_token')}`;


// 本地环境mock服务: 根据开发情况自行开关
// import Mock from '@/services/mock'; // 引入mock模块
// if ( process.env.NODE_ENV === 'development' ) {
//   Mock.start(); //并且执行初始化函数
// }
if ( process.env.VER === 'release' || process.env.VER === 'prod' ) {
  // bugsnag 集成
  const bugsnag = require( 'bugsnag-js' )
  const bugsnagVue = require( 'bugsnag-vue' )

  const bugsnagClient = bugsnag( '2c6b0cdfeb4982eba6eab57b4a62eec3' )
  bugsnagClient.use( bugsnagVue( Vue ) )
}

// Vue 全局混入对象
Vue.mixin( {
    computed: {
      isAdmin() {
        return this.$store.getters.hasRole( 'admin' );
      }
      , isProvider() {
        return this.$store.getters.hasRole( 'provider' );
      }
    , }
  } )
  /* eslint-disable no-new */
new Vue( {
  el: '#app'
  , filters: filter
  , router
  , template: '<App/>'
  , store
  , i18n
  , components: {
    App
  }
, } );
// Vue.config.devtools = false
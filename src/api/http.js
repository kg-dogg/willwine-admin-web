import axios from 'axios';
import Lockr from 'lockr';
import store from '../store';


// 配置全局axios属性
axios.defaults.baseURL = API_URL;
axios.defaults.timeout = 1000 * 30; // 10s请求超时时间
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.headers['Content-Type'] = 'application/json'
axios.defaults.responseType = 'json';
// axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('auth_token');

// axios.defaults.headers.common['Authorization'] = 'Bearer ' + Lockr.get('auth_token');

// axios拦截器
axios.interceptors.request.use(
  ( config ) => {
    const param = config;
    // Indicator.open();   //显示loading
    if ( config.method === 'post' ) {
      // 扩展使用
    }
    if ( Lockr.get( 'auth_token' ) ) {
      param.headers.common[ 'X-Requested-With' ] = 'XMLHttpRequest';
      param.headers[ 'Content-Type' ] = 'application/json';
      param.headers.common.Authorization = `Bearer ${Lockr.get('auth_token')}`;
    }
    return param;
  }, ( error ) => {
    // Indicator.close();
    helper.message( 'error', '错误的传参' );
    return Promise.reject( error );
  }
, );
/**
 * 检查api后端返回的json中的code: 公用的错误返回码，直接在这里处理
 * @param {*res} res:ajax返回的json值
 */
function checkCode( res ) {
  if ( res && ( res.status === 200 || res.status === 304 || res.status === 400 ) ) {
    return Promise.resolve( res );
  }
  helper.message( 'error', '网络错误' );
  return undefined;
}

axios.interceptors.response.use(
  response =>
  // Indicator.close()
  checkCode( response )
  , ( err ) => {
    if ( err.response.status === 401 ) {
      helper.message( 'error', '用户登录凭证已失效,请重新登录' );

      store.dispatch( 'resetAuthUserDetail' ).then( () => {
        console.log(this.$route, router);
          router.push( { path: '/login' } );
      } );
      return Promise.reject( err );
    } else if ( err.response.status === 422 && err.response.data.errors ) {
      let fieldName = Object.keys( err.response.data.errors )[ 0 ];
      helper.message( 'error', err.response.data.errors[ fieldName ][ 0 ] );
      return Promise.reject( err );
    }
    helper.message( 'error', err.response.data.message );
    return Promise.reject( err );
  }
, );

/**
 * 对外提供的方法：apiGet/apiPost/apiDelete/apiPut
 */
const apiMethods = {
  apiGet( url, data ) {
    return new Promise( ( resolve, reject ) => {
      axios.get( url, { params: data } ).then(
        ( response ) => {
          if ( _.has( response, 'data' ) ) {
            resolve( response.data );
          } else {
            resolve( response );
          }
        }, ( error ) => {
          reject( error );
        }
      , );
    } );
  },

  apiPost( url, data ) {
    return new Promise( ( resolve, reject ) => {
      axios.post( url, data ).then(
        ( response ) => {
          if ( _.has( response, 'data' ) ) {
            resolve( response.data );
          } else {
            resolve( response );
          }
        }, ( error ) => {
          reject( error );
        }
      , );
    } );
  },

  apiPut( url, data ) {
    return new Promise( ( resolve, reject ) => {
      axios.put( url, data ).then(
        ( response ) => {
          if ( _.has( response, 'data' ) ) {
            resolve( response.data );
          } else {
            resolve( response );
          }
        }, ( error ) => {
          reject( error );
        }
      , );
    } );
  },

  apiPatch( url, data ) {
    return new Promise( ( resolve, reject ) => {
      axios.patch( url, data ).then(
        ( response ) => {
          if ( _.has( response, 'data' ) ) {
            resolve( response.data );
          } else {
            resolve( response );
          }
        }, ( error ) => {
          reject( error );
        }
      , );
    } );
  },

  apiDelete( url, data ) {
    return new Promise( ( resolve, reject ) => {
      axios.delete( url, data ).then(
        ( response ) => {
          if ( _.has( response, 'data' ) ) {
            resolve( response.data );
          } else {
            resolve( response );
          }
        }, ( error ) => {
          reject( error );
        }
      , );
    } );
  }
, };

window.axios = axios;

export default apiMethods;

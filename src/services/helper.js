import { Message } from 'element-ui';
import jwtDecode from 'jwt-decode';
import store from '../store';
import router from '../router';
import { refresh } from '@/api/api';

export default {
  // to check for authenticated user
  check() {
    /**
     *  check方法优化:
     *  1. 监测jwt token 过期
     *  2. 监测localstorage存储
     *  以上情况更新到vuex中,用于调用者后续处理与判断
     * */
    // 有登录jwt,则检查下
    return new Promise( ( resolve, reject ) => {
      const jwt = lockr.get( 'auth_token' );
      if ( !jwt ) {
        // 本地不存在jwt
        store.dispatch( 'resetAuthUserDetail' );
        return resolve();
      }

      // 存在,验证jwt是否过期
      const jwtData = jwtDecode( jwt );
      if ( moment( jwtData.exp * 1000 ) <= moment() ) {
        store.dispatch( 'resetAuthUserDetail' );
        Message.error( '用户登录信息已过期,请重新登录' );
        return resolve();
      }

      if ( moment( jwtData.exp * 1000 ) <= moment().add( 10, 'm' ) ) {
        refresh().then( res => {
          store.commit( 'setToken', res.data.jwt );
          store.dispatch( 'setAuthStatus', true )
          return resolve();

        } )
      } else {
        store.dispatch( 'setAuthStatus', true )
        return resolve();
      }

    } );
  },

  // to set notification position
  notification() {
    // const notificationPosition = this.getConfig( 'notification_position' ) || 'toast-top-right';
    // toastr.options = {
    //   positionClass: notificationPosition
    // , };
    this.setLastActivity();

    // $( '[data-toastr]' ).on( 'click', function () {
    //   const type = $( this ).data( 'toastr' );
    //   const message = $( this ).data( 'message' );
    //   const title = $( this ).data( 'title' );
    //   toastr[ type ]( message, title );
    // } );
  },

  setLastActivity() {
    if ( !this.isScreenLocked() ) { store.dispatch( 'setLastActivity' ); }
  },

  // to check for last activity time and lock/unlock screen
  isScreenLocked() {
    const lastActivity = this.getLastActivity();
    const lockScreenTimeout = this.getConfig( 'lock_screen_timeout' );
    const lastActivityAfterTimeout = moment( lastActivity ).add( lockScreenTimeout, 'minutes' ).format( 'LLL' );
    return ( moment().format( 'LLL' ) > lastActivityAfterTimeout );
  },

  // to append filter variables in the URL
  getFilterURL( data ) {
    let url = '';
    $.each( data, ( key, value ) => {
      url += ( value ) ? `&${key}=${encodeURI(value)}` : '';
    } );
    return url;
  },

  getTwoFactorCode() {
    return store.getters.getTwoFactorCode;
  },

  getLastActivity() {
    return store.getters.getLastActivity;
  },

  // to get Auth Status
  isAuth() {
    return store.getters.getAuthStatus;
  },

  // to get Auth user detail
  getAuthUser( name ) {
    if ( name === 'full_name' ) { return `${store.getters.getAuthUser('first_name')} ${store.getters.getAuthUser('last_name')}`; } else if ( name === 'avatar' ) {
      if ( store.getters.getAuthUser( 'avatar' ) ) { return `/${store.getters.getAuthUser('avatar')}`; }
      return '/images/avatar.png';
    }
    return store.getters.getAuthUser( name );
  },



  // to get config
  getConfig( config ) {
    return store.getters.getConfig( config );
  },

  // to get default role name of system
  getDefaultRole( role ) {
    return store.getters.getDefaultRole( role );
  },

  // to check role of authenticated user
  hasRole( role ) {
    return store.getters.hasRole( this.getDefaultRole( role ) );
  },

  // 检查当前登录用户是否具有某个权限
  hasPermission( permission ) {
    return store.getters.hasPermission( permission );
  },

  // to check Admin role
  hasAdminRole() {
    if ( this.hasRole( 'admin' ) ) { return 1; }
    return 0;
  },

  // to check whether a given user has given role
  userHasRole( user, roleName ) {
    if ( !user.roles ) { return false; }

    const userRole = user.roles.filter( role => role.name === this.getDefaultRole( roleName ) );
    if ( userRole.length ) { return true; }
    return false;
  },

  // to check feature is available or not
  featureAvailable( feature ) {
    return this.getConfig( feature );
  },

  // returns not accessible message if permission is denied
  notAccessibleMsg() {
    toastr.error( i18n.permission.permission_denied );
  },

  // returns feature not available message if permission is denied
  featureNotAvailableMsg() {
    toastr.error( i18n.general.feature_not_available );
  },

  // returns user status
  getUserStatus( user ) {
    const status = [];

    if ( user.status === 'activated' ) { status.push( { color: 'success', label: i18n.user.status_activated } ); } else if ( user.status === 'pending_activation' ) { status.push( { color: 'warning', label: i18n.user.status_pending_activation } ); } else if ( user.status === 'pending_approval' ) { status.push( { color: 'warning', label: i18n.user.status_pending_approval } ); } else if ( user.status === 'banned' ) { status.push( { color: 'danger', label: i18n.user.status_banned } ); } else if ( user.status === 'disapproved' ) { status.push( { color: 'danger', label: i18n.user.status_disapproved } ); }

    return status;
  },

  // to mass assign one object in another object
  formAssign( form, data ) {
    Object.keys( form ).forEach( ( key ) => {
      if ( key !== 'originalData' && key !== 'errors' && key !== 'autoReset' && key !== 'providers' ) {
        form[ key ] = data[ key ] || '';
      }
    } );
    // for (const key of Object.keys(form)) {
    //   if (key !== 'originalData' && key !== 'errors' && key !== 'autoReset' && key !== 'providers') {
    //     form[key] = data[key] || '';
    //   }
    // }
    return form;
  },

  // to get date in desired format
  formatDate( date ) {
    if ( !date ) { return null; }

    return moment( date ).format( this.getConfig( 'date_format' ) );
  },

  // to get date time in desired format
  formatDateTime( date ) {
    if ( !date ) { return null; }

    const dateFormat = this.getConfig( 'date_format' );
    const timeFormat = this.getConfig( 'time_format' );

    return moment( date ).format( `${dateFormat} ${timeFormat}` );
  },

  // to get time from now
  formatDateTimeFromNow( datetime ) {
    if ( !datetime ) { return null; }

    return moment( datetime ).fromNow();
  },

  // to change first character of every word to upper case
  ucword( value ) {
    if ( !value ) { return null; }

    return value.toLowerCase().replace( /\b[a-z]/g, value.toUpperCase() );
  },

  // to change string into human readable format
  toWord( value ) {
    if ( !value ) { return null; }
    let newValue = value.replace( /-/g, ' ' );
    newValue = value.replace( /_/g, ' ' );
    return newValue.toLowerCase().replace( /\b[a-z]/g, newValue.toUpperCase() );
  },

  // shows toastr notification for axios request
  showDataErrorMsg( error ) {
    this.setLastActivity();

    if ( error.error ) {
      toastr.error( i18n.general[ error.error ] );

      if ( error.error === 'token_expired' ) { router.push( '/login' ); }
    } else if ( error.response && error.response.status === 403 ) {
      toastr.error( i18n.general.permission_denied );
    } else if ( error.response && error.response.status === 404 ) {
      toastr.error( i18n.general.invalid_link );
    } else if ( error.response.data.errors.message ) { toastr.error( error.response.data.errors.message[ 0 ] ); }
  },

  // returns error message for axios request
  fetchDataErrorMsg( error ) {
    return error.response.data.errors.message[ 0 ];
  },

  // shows toastr notification for axios form request
  showErrorMsg( error ) {
    this.setLastActivity();

    if ( error.error ) {
      toastr.error( i18n.general[ error.error ] );

      if ( error.error === 'token_expired' ) { router.push( '/login' ); }
    } else if ( error.response && error.response.status === 403 ) {
      toastr.error( i18n.general.permission_denied );
    } else if ( error.response && error.response.status === 404 ) {
      toastr.error( i18n.general.invalid_link );
    } else if ( error.errors.message ) { toastr.error( error.errors.message[ 0 ] ); }
  },

  // returns error message for axios form request
  fetchErrorMsg( error ) {
    return error.errors.message[ 0 ];
  },

  // round numbers as given precision
  roundNumber( number, precision ) {
    const newPrecision = Math.abs( parseInt( precision, 10 ) ) || 0;
    const multiplier = 10 ** newPrecision;
    return ( Math.round( number * multiplier ) / multiplier );
  },

  // round numbers as given precision
  formatNumber( number, decimalPlace ) {
    let demical = decimalPlace;
    if ( demical === undefined ) { demical = 2; }
    return this.roundNumber( number, demical );
  },

  // fill number with padding
  formatWithPadding( n, width, z ) {
    const newZ = z || '0';
    const newN = `${n}`;
    return newN.length >= width ? newN : new Array( ( width - newN.length ) + 1 ).join( newZ ) + newN;
  },

  // generates random string of certain length
  randomString( length ) {
    let lgth = length;
    if ( lgth === undefined ) { lgth = 40; }
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for ( let i = lgth; i > 0; i -= 1 ) result += chars[ Math.floor( Math.random() * chars.length ) ];
    return result;
  },


  // wzx add
  // 提示框，后期根据不同类型显示不同图标或样式
  message( type, msg ) {
    switch ( type ) {
    case 'normal':
      Message.info( msg );
      break;
    case 'success':
      Message.success( msg );
      break;
    case 'warning':
      Message.warning( msg );
      break;
    case 'error':
      Message.error( msg );
      break;
    default:
      Message.info( msg );
      break;
    }
  },

};
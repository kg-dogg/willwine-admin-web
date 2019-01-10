import Lockr from 'lockr';
// import { loginByUsername, logout, getUserInfo, check } from '@/api/api'
import { user } from '@/api';


const system = {
  state: {
    auth: Lockr.get( 'user_detail' ) ? Lockr.get( 'user_detail' ) : { name: '', roles: [] }
    , token: ''
    , is_auth: false, // to store auth status
    config: {}, // to store all configuration variables
    permissions: [], // to store all permissions of authenticated user
    last_activity: null, // to store last activity time of user
    default_role: Lockr.get( 'user_detail' ) ? Lockr.get( 'user_detail' ).default_role : { admin: '', user: '' }
  , },

  mutations: {
    setAuthUserDetail: ( state, user ) => {
      const roles = [{name: 'admin'}];
      state.user = { ...user, roles };
      Lockr.set( 'user_detail', user );
      Lockr.set( 'roles', roles );
      state.is_auth = true;
      state.auth.roles = roles;
    },

    // 重置vuex中的用户数据状态
    resetAuthUserDetail: ( state ) => {
      state.is_auth = false;
      state.auth = {};
      state.auth.roles = [];
      state.last_activity = null;
      Lockr.rm( 'roles' );
      Lockr.rm( 'auth_token' );
      Lockr.rm( 'user_detail' );
      axios.defaults.headers.common.Authorization = null;
    },

    // 设置config
    setConfig( state, config ) {
      Object.keys( config ).forEach( ( key ) => {
        state.config[ key ] = config[ key ];
      } );
    },

    // 重置config
    resetConfig( state ) {
      Object.keys( state.config ).forEach( ( key ) => {
        state.config[ key ] = '';
      } );
    },

    // 设置permission
    setPermission( state, data ) {
      state.permissions = [];
      if ( data ) data.forEach( permission => state.permissions.push( permission.name ) );
    },

    // 设置最后路由操作时间
    setLastActivity( state ) {
      state.last_activity = moment().format();
    },

    // 设置当前用户角色
    setDefaultRole( state, data ) {
      state.default_role = data;
    },

    // 设置当前用户登录态
    setAuthStatus: ( state ) => {
      state.is_auth = state;
    },

    // 设置JWTtoken
    setToken: ( state, token ) => {
      state.token = token;
      Lockr.set( 'auth_token', token );
      console.log( '设置token为:', token );
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

  },

  actions: {
    setAuthStatus( { commit } ) {
      commit( 'setAuthStatus' );
    }
    , setAuthUserDetail( { commit }, auth ) {
      commit( 'setAuthUserDetail', auth );
    }
    , resetAuthUserDetail( { commit } ) {
      commit( 'resetAuthUserDetail' );
    }
    , setConfig( { commit }, data ) {
      commit( 'setConfig', data );
    }
    , resetConfig( { commit } ) {
      commit( 'resetConfig', data );
    }
    , setLastActivity( { commit } ) {
      commit( 'setLastActivity' );
    }
    , setDefaultRole( { commit }, data ) {
      commit( 'setDefaultRole', data );
    },

    // 用户名登录
    LoginByUsername( { commit }, userInfo ) {
      const username = userInfo.username.trim()
      return new Promise( ( resolve, reject ) => {
        user.loginByUsername( username, userInfo.password ).then( data => {
          console.log('LoginByUsername', data.result.data);
          commit( 'setToken', data.result.data.token )
          commit( 'setAuthUserDetail', data.result.data );
          //setToken( data.token )
          axios.defaults.headers.common.Authorization = `Bearer ${data.result.data.token}`;
          resolve( data )
        } ).catch( error => {
          reject( error )
        } )
      } )
    },

    // 登出
    LogOut( { commit } ) {
      // 加快登出的前端速度，用户不需要等待服务端结果，其实直接清除前端的状态就可以
      // 登出接口需要依赖token，接口发出后立即清除前端状态，跳转登录页
      return new Promise( ( resolve, reject ) => {
        user.logout().then( () => {
          resolve()
        } ).catch( error => {
          reject( error )
        } )
        commit( 'resetAuthUserDetail' )
        commit( 'setToken', '' )
      } )
    },

    // check全局监测
    systemCheck( { commit } ) {
      return new Promise( ( resolve, reject ) => {
        // check().then( res => {
        //   commit( 'setPermission', res.permissions );
        //   commit( 'setDefaultRole', res.user_roles );
        //   resolve()
        // } ).catch( e => reject( e ) )
        resolve();
      } )
    }
  },

  getters: {
    getAuthUser: state => name => state.auth
    , getAuthUserFullName: state => ''
    , hasRole: state => name => state.auth.roles.findIndex( item => item.name === name ) > -1
    , getConfig: state => name => state.config[ name ]
    , hasPermission: state => name => ( ( state.permissions.indexOf( name ) > -1 ) )
    , getTwoFactorCode: state => state.two_factor_code
    , getLastActivity: state => state.last_activity
    , getDefaultRole: state => name => state.default_role[ name ]
    , getAuthStatus: state => state.is_auth
  , }
, };

export default system;
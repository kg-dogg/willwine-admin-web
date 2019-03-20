// import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import Lockr from 'lockr';

import StaticRouterMap from './static';
import { GoodsRoutes, GoodsAttribute } from './liquor';
import SupplierRoutes from './supplier';
// import AttributeRoutes from './attribute';
// import RiseRouterMap from './rise';

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

// Vue.use(VueRouter);

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 * */
export const asyncRouterMap = [
  // 红酒管理
  GoodsRoutes,
  GoodsAttribute,
  SupplierRoutes,
  // AttributeRoutes,
  // ...RiseRouterMap,
  // 其他路径
  {
    path: '*'
    , redirect: '/404'
    , hidden: true
  },
]


const router = new VueRouter({
  routes: StaticRouterMap,
  linkActiveClass: 'active',
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return {
      x: 0,
      y: 0,
    };
  },
});

router.beforeEach((to, from, next) => {
  // 刷新时重新请求全局数据
  if (Object.keys(store.state.global.param).length <= 0) {
    store.dispatch('Courseglobaldata');
    store.dispatch('systemCheck');
    store.dispatch('UploadAllowedType');
  }
  // For force logout
  // store.dispatch('resetAuthUserDetail');
  helper.check()
    .then(() => {
      // Initialize toastr notification
      helper.notification();
      // Check for IP Restriction; If restricted IP found, redirect to "/ip-restricted" route
      if (helper.getConfig('ip_filter') && localStorage.getItem('ip_restricted') && to.fullPath !== '/ip-restricted') {
        return next({ path: '/ip-restricted' });
      }
      if (to.matched.length === 0 && !helper.isAuth()) {
        toastr.error('该页面需要登录用户才能访问!');
        return next({ path: '/login' });
      }
      if (to.matched.some(m => m.meta.validate)) {
        const m = to.matched.find(item => item.meta.validate);

        // 需要验证的页面
        if (m.meta.validate.indexOf('auth') > -1) {
          if (!helper.isAuth()) {
            Lockr.rm('roles');
            store.dispatch('ResetRoutes');
            toastr.error('该页面需要登录用户才能访问!');
            return next({
              path: '/login'
            });
          }
        }

        // 不需要验证的页面
        // if (m.meta.validate.indexOf('guest') > -1) {
        //   if (helper.isAuth()) {
        //     toastr.error('该页面需要游客身份才能访问!');
        //     return next({
        //       path: '/dashboard'
        //     });
        //   }
        // }
      }
      // 生成路由
      let roles = Lockr.get('roles');
      roles = roles ? roles : [];
      if (!store.getters.hasRouter && roles && roles.length > 0) {
        store.dispatch('GenerateRoutes', {
          roles
        }).then(() => { // 生成可访问的路由表
          router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          store.dispatch('SetRoutes');
        })
      }
      return next();
    })
    .catch((e) => {
      console.log(e)
      console.log('路由check异常,转到login...');
      store.dispatch('resetAuthUserDetail');
      store.dispatch('ResetRoutes');
      if (to.path === '/login') {
        return next();
      }
      return next({
        path: '/login'
      });
    });
});

export default router;
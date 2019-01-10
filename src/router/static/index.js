import Layout from '../../views/layout/Layout';

const StaticRouterMap = [{
  path: '/404',
  component: () => import ( '@/views/errorPage/404' ),
  hidden: true,
}, {
  path: '/401',
  component: () =>import ( '@/views/errorPage/401' ),
  hidden: true,
}, {
  path: '/', // all the routes which can be access without authentication
  component: () => import ( '@/views/layout/guest-page' ),
  meta: {
    validate: [ 'guest' ],
  },
  hidden: true,
  children: [{
    path: '/',
    component: () => import ( '@/views/login/index' ),
  }, {
    path: '/login',
    component: () =>import ( '@/views/login/index' ),
    meta: {
      title: '登陆',
      icon: 'Is_course',
    },
  }, {
    path: '/flogin',
    component: () => import ( '@/views/login/flogin' ),
    meta: {
      title: '第三方登陆',
      icon: 'Is_course',
    },
  }],
}, {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  name: 'Dashboard',
  hidden: true,
  meta: {
    validate: [ 'auth' ],
  },
  children: [{
    path: 'dashboard',
    component: () => import ( '@/views/dashboard/index' ),
  }, {
    path: 'home',
    component: () => import ( '@/views/dashboard/index' ),
  }],
}];

export default StaticRouterMap;

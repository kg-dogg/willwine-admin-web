import Layout from '../../views/layout/Layout';

const GoodsRoutes = {
  path: '/liquor',
  component: Layout,
  redirect: '/liquor/index',
  name: 'liquor',
  meta: {
    title: '商品管理',
    icon: 'partner',
    validate: [ 'auth', 'two_factor', 'lock_screen' ],
    role: ['admin']
  },
  children: [{
    path: 'brand',
    name: 'brandList',
    component: () => import ( '@/views/brand/index' ),
    meta: {
      icon: 'list',
      title: '品牌列表'
    },
  }, {
    path: 'index',
    name: 'liquorList',
    component: () => import('@/views/liquor/index'),
    meta: {
      title: '商品列表',
      icon: 'list',
    },
  }, {
    path: 'add',
    name: 'addLiquor',
    component: () => import ( '@/views/liquor/add/index' ),
    meta: {
      title: '添加商品 - 商品信息'
    },
    hidden: true,
  }],
};

export default GoodsRoutes;

import Layout from '../../views/layout/Layout';

const LiquorRoutes = {
  path: '/liquor',
  component: Layout,
  redirect: '/liquor/index',
  name: 'liquor',
  meta: {
    title: '红酒管理',
    icon: 'partner',
    validate: [ 'auth', 'two_factor', 'lock_screen' ],
    role: ['admin']
  },
  children: [{
    path: 'index',
    name: 'liquorList',
    component: () => import('@/views/liquor/index'),
    meta: {
      title: '列表',
      icon: 'list',
    },
  }, {
    path: 'add',
    name: 'addLiquor',
    component: () => import ( '@/views/liquor/add' ),
    meta: {
      icon: 'list',
      title: '添加红酒'
    },
    hidden: true,
  }],
};

export default LiquorRoutes;

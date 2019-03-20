import Layout from '../../views/layout/Layout';

const SupplierRoutes = {
  path: '/supplier',
  component: Layout,
  redirect: '/supplier/index',
  name: 'supplier',
  meta: {
    title: '商户管理',
    icon: 'partner',
    validate: [ 'auth', 'two_factor', 'lock_screen' ],
    role: ['admin']
  },
  children: [{
    path: 'index',
    name: 'supplierList',
    component: () => import('@/views/supplier/index'),
    meta: {
      title: '列表',
      icon: 'list',
    },
  }, {
    path: 'add',
    name: 'addSupplier',
    component: () => import ( '@/views/supplier/add' ),
    meta: {
      icon: 'partner',
      title: '添加商户'
    },
    hidden: true,
  }],
};

export default SupplierRoutes;

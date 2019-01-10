import Layout from '../../views/layout/Layout';

const AttributeRoutes = {
  path: '/attribute',
  component: Layout,
  redirect: '/attribute/index',
  name: 'attribute',
  meta: {
    title: '属性管理',
    icon: 'partner',
    validate: [ 'auth', 'two_factor', 'lock_screen' ],
    role: ['admin']
  },
  children: [{
    path: 'index',
    name: 'attributeList',
    component: () => import('@/views/attribute/index'),
    meta: {
      title: '列表',
      icon: 'list',
    },
  }, {
    path: 'product/category',
    name: 'productCategory',
    component: () => import('@/views/attribute/product/category'),
    meta: {
      icon: 'list',
      title: '产品分类'
    },
  }, {
    path: 'product/category/add',
    name: 'addProductCategory',
    component: () => import('@/views/attribute/product/category/add'),
    hidden: true,
  }, {
    path: 'product/:id',
    name: 'productList',
    component: () => import('@/views/attribute/product'),
    hidden: true,
  }, {
    path: 'product/:id/add',
    name: 'addProduct',
    component: () => import('@/views/attribute/product/add'),
    hidden: true,
  }],
};

export default AttributeRoutes;

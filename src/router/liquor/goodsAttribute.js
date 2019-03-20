import Layout from '../../views/layout/Layout';

const GoodsAttributeRoutes = {
  path: '/liquor/goods/attribute',
  component: Layout,
  redirect: '/liquor/goods/attribute/category',
  name: 'goodsAttribute',
  meta: {
    title: '属性管理',
    icon: 'partner',
    validate: [ 'auth', 'two_factor', 'lock_screen' ],
    role: ['admin']
  },
  children: [{
    path: 'category',
    name: 'goodsAttributeCategoryList',
    component: () => import('@/views/liquor/attribute/category'),
    meta: {
      title: '属性类别',
      icon: 'list',
    },
  }, {
    path: ':id/key',
    name: 'goodsAttributeKeyList',
    component: () => import ( '@/views/liquor/attribute/key' ),
    meta: {
      icon: 'list',
      title: '属性管理'
    },
    hidden: true,
  }, {
    path: ':keyId/value/:id',
    name: 'goodsAttributeValueList',
    component: () => import ( '@/views/liquor/attribute/value' ),
    meta: {
      icon: 'list',
      title: '属性值管理'
    },
    hidden: true,
  }],
};

export default GoodsAttributeRoutes;

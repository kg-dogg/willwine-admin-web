import Layout from '../../views/layout/Layout';

const RiseRouterMap = [{
  path: '/resources',
  component: Layout,
  redirect: '/resources/index',
  name: 'resources',
  meta: {
    title: '渠道管理',
    icon: 'partner',
    validate: [ 'auth', 'two_factor', 'lock_screen' ],
    role: [ 'teacher_manager', 'online_manager' ]
  }
  , children: [ {
    path: 'index'
    , name: 'resourcesIndex'
    , component: () =>
      import ('@/views/resources/index')
    , meta: {
      title: '渠道'
      , icon: 'list'
    }
  , }, {
    path: 'add'
    , name: 'addResources'
    , component: () =>
      import ('@/views/resources/add')
    , meta: {
      title: '新建渠道'
      , icon: 'Is_course'
    }
    , hidden: true
  , }, {
    path: 'modify/:id'
    , name: 'modifyResources'
    , component: () =>
      import ('@/views/resources/add')
    , meta: {
      title: '编辑渠道'
      , icon: 'Is_course'
    }
    , hidden: true
  , }]
},
// 消息管理
{
  path: '/notification'
  , redirect: '/notification'
  , component: Layout
  , name: 'notification'
  , meta: {
    title: '消息管理'
    , icon: 'message'
    , validate: [ 'auth', 'two_factor', 'lock_screen' ]
    , role: [ 'admin' ]
  }
  , children: [ {
    path: ''
    , name: 'notificationList'
    , component: () =>
      import ('@/views/notification/index')
    , meta: {
      title: '消息模板'
      , icon: 'template'
    }
  , }, {
    path: 'add'
    , name: 'addNotification'
    , component: () =>
      import ('@/views/notification/add')
    , meta: {
      title: '创建消息模板'
    }
    , hidden: true
  , }, {
    path: 'modify/:id'
    , name: 'modifyNotification'
    , component: () =>
      import ('@/views/notification/add')
    , meta: {
      title: '编辑消息模板'
    }
    , hidden: true
  , }, ],

},
// 版本管理
{
  path: '/versions'
  , component: Layout
  , redirect: '/versions/index'
  , name: 'versions'
  , meta: {
    title: '版本管理'
    , icon: 'version'
    , validate: [ 'auth', 'two_factor', 'lock_screen' ]
    , role: [ 'admin' ]
  }
  , children: [ {
    path: 'index'
    , name: 'versionsIndex'
    , component: () =>
      import ('@/views/versions/index')
    , meta: {
      title: '查看版本'
      , icon: 'list'
    }
  , }, {
    path: 'create'
    , name: 'versionsCreate'
    , component: () =>
      import ('@/views/versions/create')
    , meta: {
      title: '创建版本'
      , icon: 'order-add'
    }
    , hidden: true
  , }, {
    path: 'check'
    , name: 'versionsCheck'
    , component: () =>
      import ('@/views/versions/modify')
    , meta: {
      title: '版本查看'
    }
    , hidden: true
  , }, {
    path: 'modify'
    , name: 'versionsModify'
    , component: () =>
      import ('@/views/versions/modify')
    , meta: {
      title: '版本编辑'
    }
    , hidden: true
  , }, {
    path: 'status'
    , name: 'versionsStatus'
    , component: () =>
      import ('@/views/versions/status')
    , meta: {
      title: '状态编辑'
    }
    , hidden: true
  , }, ]
},
// 用户管理
{
  path: '/user'
  , component: Layout
  , name: 'user'
  , redirect: '/user/index'
  , meta: {
    validate: [ 'auth', 'two_factor', 'lock_screen' ]
    , title: '用户管理'
    , icon: 'usermanage'
    , role: [ 'admin' ]
  }
  , children: [ {
    path: 'index'
    , name: 'userLists'
    , component: () =>
      import ('@/views/user/list')
    , meta: {
      title: '用户列表'
      , icon: 'list'
    }
  }, {
    path: 'org'
    , name: 'orginazations'
    , component: () =>
      import ('@/views/user/orginazation/index')
    , meta: {
      title: '组织结构'
      , icon: 'zuzhi'
    }
  }, {
    path: '/user/employee/:id'
    , name: 'employeeBasic'
    , component: () =>
      import ('@/views/user/employee/frame')
    , hidden: true
    , meta: {
      title: '员工信息'
    }
  }, 
  {
    path: '/user/(student|parent)/:id'
    , name: 'userDetail'
    , component: () =>
      import ('@/views/user/student/detail')
    , hidden: true
    , meta: {
      title: '用户信息'
    }
  }]
},
// 日志管理
{
  path: '/activity-log'
  , component: Layout
  , redirect: 'noredirect'
  , name: 'activity'
  , meta: {
    validate: [ 'auth', 'two_factor', 'lock_screen' ]
    , title: '系统日志'
    , icon: 'notepad'
    , role: [ 'admin' ]
  }
  , children: [ {
      path: 'index'
      , name: 'operationLog'
      , component: () =>
        import ('@/views/audit/index')
      , meta: {
        title: '数据变更日志'
        , icon: 'list'
      }
    , }, {
      path: 'data'
      , name: 'activityLog'
      , component: () =>
        import ('@/views/activity-log/index')
      , meta: {
        title: '后台操作日志'
        , icon: 'list'
      }
    , }

  ]
},
// 系统配置
{
  path: '/configuration'
  , component: Layout
  , name: 'configuration'
  , redirect: 'noredirect', // name: 'Coursemanagement',
  meta: {
    title: '系统配置'
    , icon: 'setting'
    , validate: [ 'auth', 'two_factor', 'lock_screen' ]
    , role: [ 'admin' ]
  }
  , children: [ {
    path: 'basic'
    , name: 'configurationIndex'
    , component: () =>
      import ('@/views/configuration/basic/index')
    , meta: {
      title: '基础'
      , icon: 'notepad'
    }
  , }, {
    path: 'mail'
    , name: 'configurationMail'
    , component: () =>
      import ('@/views/email-template/index')
    , meta: {
      title: '邮件模板'
      , icon: 'message'
    }
  , }, {
    path: 'mail/:id/edit'
    , name: 'configurationMailEdit'
    , component: () =>
      import ('@/views/email-template/edit')
    , meta: {
      title: '编辑邮件模板'
    }
    , hidden: true
  }, {
    path: 'mail/create'
    , name: 'configurationMailCreate'
    , component: () =>
      import ('@/views/email-template/edit')
    , meta: {
      title: '新增邮件模板'
    }
    , hidden: true
  }, {
    path: 'role'
    , name: 'configurationRole'
    , component: () =>
      import ('@/views/configuration/role/index')
    , meta: {
      title: '角色信息'
      , icon: 'usermanage'
    }
  , }, {
    path: 'permission'
    , name: 'configurationPermission'
    , component: () =>
      import ('@/views/configuration/permission/assign')
    , meta: {
      title: '权限分配'
      , icon: 'authority'
    }
  , }, {
    path: '/configuration/permission/assign'
    , name: 'configurationPermissionAssign'
    , component: () =>
      import ('@/views/configuration/permission/index')
    , meta: {
      title: '权限管理'
    }
    , hidden: true
  , }, ]
},
// 系统工具
{
  path: '/manage-tools'
  , redirect: '/manage-tools/list'
  , component: Layout
  , name: 'tools'
  , meta: {
    title: '系统工具'
    , icon: 'eye'
    , validate: [ 'auth', 'two_factor', 'lock_screen' ]
    , role: [ 'admin' ]
  }
  , children: [ {
    path: 'cosApiTools'
    , name: 'viewCosApiDetail'
    , component: () =>
      import ('@/views/manage-tools/cos_api_tool')
    , meta: {
      title: 'COS接口工具'
      , icon: 'classlist'
    }
  , }, {
    path: ''
    , hidden: true
  }, ],
}];

export default RiseRouterMap;

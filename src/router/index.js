import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import Lockr from 'lockr';

/* Layout */
import Layout from '../views/layout/Layout';

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

// Vue.use( VueRouter );

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
export const constantRouterMap = [
  // { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  {
    path: '/404'
    , component: () =>
      import ( '@/views/errorPage/404' )
    , hidden: true
  }, {
    path: '/401'
    , component: () =>
      import ( '@/views/errorPage/401' )
    , hidden: true
  }, // 登录注册验证相关
  {
    path: '/', // all the routes which can be access without authentication
    component: () =>
      import ( '@/views/layout/guest-page' )
    , meta: {
      validate: [ 'guest' ]
    }
    , hidden: true
    , children: [ {
        path: '/'
        , component: () =>
          import ( '@/views/login/index' )
      }, {
        path: '/login'
        , component: () =>
          import ( '@/views/login/index' )
        , meta: {
          title: '登陆'
          , icon: 'Is_course'
        }
      }, {
        path: '/flogin'
        , component: () =>
          import ( '@/views/login/flogin' )
        , meta: {
          title: '第三方登陆'
          , icon: 'Is_course'
        }
      },

    ]
  , },

  {
    path: '/'
    , component: Layout
    , redirect: '/dashboard'
    , name: 'Dashboard'
    , hidden: true
    , meta: {
      validate: [ 'auth' ]
    }
    , children: [ {
      path: 'dashboard'
      , component: () =>
        import ( '@/views/dashboard/index' )
    }, {
      path: 'home'
      , component: () =>
        import ( '@/views/dashboard/index' )
    } ]

  }
]

export const asyncRouterMap = [
  // 新课程
  {
    path: '/curriculum'
    , component: Layout
    , redirect: '/curriculum/index'
    , name: 'curriculum'
    , meta: {
      title: '课程管理'
      , icon: 'curriculum'
      , validate: [ 'auth', 'two_factor', 'lock_screen' ]
      , role: [ 'course_manager', 'job_manager' ]
    }
    , children: [ {
      path: 'index'
      , name: 'curriculumIndex'
      , component: () =>
        import ( '@/views/curriculum/index' )
      , meta: {
        title: '班型列表'
        , icon: 'classlist'
      }
    , }, {
      path: 'course/:id'
      , name: 'editCourseBase'
      , component: () =>
        import ( '@/views/curriculum/course' )
      , hidden: true
    , }, {
      path: 'course_res/:id'
      , name: 'editCourseRes'
      , component: () =>
        import ( '@/views/curriculum/course_edit' )
      , hidden: true
    , }, {
      path: 'homework/:id'
      , name: 'homeworkList'
      , component: () =>
        import ( '@/views/curriculum/homework' )
      , hidden: true
      , meta: {
        title: '作业管理'
        , icon: 'coursemanagement'
        , validate: [ 'auth', 'two_factor', 'lock_screen' ]
      }
    , }, {
      path: 'homework/:id/add'
      , name: 'addHomework'
      , component: () =>
        import ( '@/views/curriculum/homework/add/index' )
      , meta: {
        title: '创建作业'
        , icon: 'coursemanagement'
        , validate: [ 'auth', 'two_factor', 'lock_screen' ]
      }
      , hidden: true
    , }, {
      path: 'homework/:id/modify'
      , name: 'modifyHomework'
      , component: () =>
        import ( '@/views/curriculum/homework/add' )
      , meta: {
        title: '编辑作业'
        , icon: 'coursemanagement'
        , validate: [ 'auth', 'two_factor', 'lock_screen' ]
      }
      , hidden: true
    , }, {
      path: 'homework/:id/view'
      , name: 'viewHomework'
      , component: () =>
        import ( '@/views/curriculum/homework/view' )
      , meta: {
        title: '查看作业'
        , icon: 'coursemanagement'
        , validate: [ 'auth', 'two_factor', 'lock_screen' ]
      }
      , hidden: true
    , }, ]
  , },

  // 排课管理
  {
    path: '/lesson'
    , component: Layout
    , redirect: 'noredirect'
    , name: 'lesson'
    , meta: {
      validate: [ 'auth', 'two_factor', 'lock_screen' ]
      , title: '排课管理'
      , icon: 'calendar'
      , role: [ 'supervisor_manager', 'supervisor', 'trail_manager', 'online_manager' ]
    }
    , children: [ {
        path: 'index'
        , name: 'lessonIndex'
        , component: () =>
          import ( '@/views/lesson/index' )
        , meta: {
          title: '试听课'
          , icon: 'experiencecourse'
          , role: [ 'trail_manager', 'online_manager' ]
        }
      , }, {
        path: 'add'
        , name: 'lessonAdd'
        , component: () =>
          import ( '@/views/lesson/add' )
        , meta: {
          title: '新建试听课'
          , icon: 'new_curriculum'
        , }
        , hidden: true
      , }, {
        path: 'choose_teacher'
        , name: 'chooseTeacher'
        , hidden: true
        , component: () =>
          import ( '@/views/lesson/choose_teacher_trial' )
        , meta: {
          title: '选择外教'
          , icon: 'new_curriculum'
        }
      , }, {
        path: 'index_normal'
        , name: 'lessonIndexNormal'
        , component: () =>
          import ( '@/views/lesson/index_normal' )
        , meta: {
          title: '正式课'
          , icon: 'officialcourse'
          , role: [ 'supervisor_manager', 'supervisor', 'online_manager' ]
        }
      , }, {
        path: 'add_normal'
        , name: 'lessonAddNormal'
        , hidden: true
        , component: () =>
          import ( '@/views/lesson/add_normal' )
        , meta: {
          title: '新建正式课排课'
          , icon: 'new_curriculum'
        }
      , }, {
        path: 'add_left_normal'
        , name: 'lessonAddLeftNormal'
        , hidden: true
        , component: () =>
          import ( '@/views/lesson/add_left_normal' )
        , meta: {
          title: '补加正式课排课'
          , icon: 'new_curriculum'
        }
      , }
      // , {
      //   path: 'schedule'
      //   , name: 'lessonSchedule'
      //   , component: () =>
      //     import ( '@/views/lesson/schedule' )
      //   , meta: { title: '课表', icon: 'new_curriculum' }
      // , }
      , {
        path: 'timetable_list'
        , name: 'timetableList'
        , hidden: true
        , component: () =>
          import ( '@/views/lesson/timetable_list' )
        , meta: {
          title: '学生课表'
          , icon: 'new_curriculum'
        }
      , }, {
        path: 'makeup_lesson'
        , name: 'makeupLesson'
        , hidden: true
        , component: () =>
          import ( '@/views/lesson/makeup_lesson' )
        , meta: {
          title: '补课'
          , icon: 'new_curriculum'
        }
      , }
    , ]
  , },

  // 课表管理
  {
    path: '/lessonSchedule'
    , component: Layout
    , redirect: '/lessonSchedule/index'
    , meta: {
      validate: [ 'auth', 'two_factor', 'lock_screen' ]
      , title: '课表管理'
      , role: [ 'supervisor_manager', 'supervisor', 'trail_manager', 'teacher_manager', 'online_manager' ]
    }
    , children: [ {
      path: 'index'
      , name: 'lessonSchedule'
      , component: () =>
        import ( '@/views/lesson/schedule' )
      , meta: {
        title: '课表'
        , icon: 'timetable'
      , }
    } ]

  },

  // 监课管理
  {
    path: '/monitor'
    , redirect: '/monitor/list'
    , component: Layout
    , name: 'monitor'
    , meta: {
      title: '监课管理'
      , icon: 'eye'
      , validate: [ 'auth', 'two_factor', 'lock_screen' ]
      , role: [ 'supervisor_manager', 'supervisor', 'online_manager' ]
    }
    , children: [ {
      path: 'list'
      , name: 'monitorList'
      , component: () =>
        import ( '@/views/monitor/index' )
      , meta: {
        title: '教室列表'
        , icon: 'classlist'
      }
    , }, {
      path: ''
      , hidden: true
    }, ],

  },

  // 督导管理
  {
    path: '/supervise'
    , component: Layout
    , redirect: '/supervise/index'
    , name: 'supervise'
    , meta: {
      validate: [ 'auth', 'two_factor', 'lock_screen' ]
      , title: '督导管理'
      , icon: 'usermanage'
      , role: [ 'supervisor_manager', 'online_manager' ]
    }
    , children: [
      // {
      //     path: 'index',
      //     name: 'superviseIndex',
      //     component: () => import('@/views/supervise/index'),
      //     meta: {title: '督导建班', icon: 'system'}
      // },
      {
        path: 'assgin'
        , name: 'superviseAssgin'
        , component: () =>
          import ( '@/views/supervise/assgin' )
        , meta: {
          title: '督导分配'
          , icon: 'manage'
        }
      , }, {
        path: 'user'
        , name: 'superviseUser'
        , component: () =>
          import ( '@/views/supervise/user' )
        , meta: {
          title: '督导列表'
          , icon: 'list'
        }
      , }
    , ]
  , }, // 外教管理
  {
    path: '/teacher'
    , redirect: '/teacher/index'
    , component: Layout
    , name: 'teacher'
    , meta: {
      title: '老师管理'
      , icon: 'usermanage'
      , validate: [ 'auth', 'two_factor', 'lock_screen' ]
      , role: [ 'supervisor_manager', 'supervisor', 'trail_manager', 'teacher_manager', 'online_manager','provider' ]
    }
    , children: [ {
      path: 'index'
      , name: 'teacherList'
      , component: () =>
        import ( '@/views/teacher' )
      , meta: {
        title: '外教列表'
        , icon: 'list'
      }
    }, {
      path: 'add'
      , name: 'addTeacher'
      , component: () =>
        import ( '@/views/teacher/add' )
      , meta: {
        title: '新建外教'
        , icon: 'Is_course'
        , role: [ 'admin', 'provider' ]
      }
      , hidden: true
    , }, {
      path: 'modify/:id'
      , name: 'modifyTeacher'
      , component: () =>
        import ( '@/views/teacher/add' )
      , meta: {
        title: '编辑外教'
        , icon: 'Is_course'
        , role: [ 'admin', 'provider' ]
      }
      , hidden: true
    }, {
      path: 'timetable/:id'
      , name: 'teacherTimeTable'
      , component: () =>
        import ( '@/views/teacher/timetable' )
      , meta: {
        title: '外教课表'
        , icon: 'Is_course'
      }
      , hidden: true
    }, {
      path: 'course'
      , name: 'courseCheck'
      , component: () =>
        import ( '@/views/teacher/course/index' )
      , meta: {
        title: '课时结算'
        , icon: 'settlement'
      }
    , } ]
  }, // 渠道管理
  , {
    path: '/resources'
    , component: Layout
    , redirect: '/resources/index'
    , name: 'resources'
    , meta: {
      title: '渠道管理'
      , icon: 'partner'
      , validate: [ 'auth', 'two_factor', 'lock_screen' ]
      , role: [ 'teacher_manager', 'online_manager' ]
    }
    , children: [ {
      path: 'index'
      , name: 'resourcesIndex'
      , component: () =>
        import ( '@/views/resources/index' )
      , meta: {
        title: '渠道'
        , icon: 'list'
      }
    , }, {
      path: 'add'
      , name: 'addResources'
      , component: () =>
        import ( '@/views/resources/add' )
      , meta: {
        title: '新建渠道'
        , icon: 'Is_course'
      }
      , hidden: true
    , }, {
      path: 'modify/:id'
      , name: 'modifyResources'
      , component: () =>
        import ( '@/views/resources/add' )
      , meta: {
        title: '编辑渠道'
        , icon: 'Is_course'
      }
      , hidden: true
    , }, {
      path: 'course'
      , name: 'privoderCourseCheck'
      , component: () =>
        import ( '@/views/teacher/course/index' )
      , meta: {
        title: '课时结算'
        , icon: 'settlement'
      }
    } ]
  , }, // 消息管理
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
        import ( '@/views/notification/index' )
      , meta: {
        title: '消息模板'
        , icon: 'template'
      }
    , }, {
      path: 'add'
      , name: 'addNotification'
      , component: () =>
        import ( '@/views/notification/add' )
      , meta: {
        title: '创建消息模板'
      }
      , hidden: true
    , }, {
      path: 'modify/:id'
      , name: 'modifyNotification'
      , component: () =>
        import ( '@/views/notification/add' )
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
        import ( '@/views/versions/index' )
      , meta: {
        title: '查看版本'
        , icon: 'list'
      }
    , }, {
      path: 'create'
      , name: 'versionsCreate'
      , component: () =>
        import ( '@/views/versions/create' )
      , meta: {
        title: '创建版本'
        , icon: 'order-add'
      }
      , hidden: true
    , }, {
      path: 'check'
      , name: 'versionsCheck'
      , component: () =>
        import ( '@/views/versions/modify' )
      , meta: {
        title: '版本查看'
      }
      , hidden: true
    , }, {
      path: 'modify'
      , name: 'versionsModify'
      , component: () =>
        import ( '@/views/versions/modify' )
      , meta: {
        title: '版本编辑'
      }
      , hidden: true
    , }, {
      path: 'status'
      , name: 'versionsStatus'
      , component: () =>
        import ( '@/views/versions/status' )
      , meta: {
        title: '状态编辑'
      }
      , hidden: true
    , }, ]
  , },

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
        import ( '@/views/user/list' )
      , meta: {
        title: '用户列表'
        , icon: 'list'
      }
    }, {
      path: 'org'
      , name: 'orginazations'
      , component: () =>
        import ( '@/views/user/orginazation/index' )
      , meta: {
        title: '组织结构'
        , icon: 'zuzhi'
      }
    }, {
      path: '/user/employee/:id'
      , name: 'employeeBasic'
      , component: () =>
        import ( '@/views/user/employee/frame' )
      , hidden: true
      , meta: {
        title: '员工信息'
      }
    }, 
    {
      path: '/user/(student|parent)/:id'
      , name: 'userDetail'
      , component: () =>
        import ( '@/views/user/student/detail' )
      , hidden: true
      , meta: {
        title: '用户信息'
      }
    }]
  , }, // 日志管理
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
          import ( '@/views/audit/index' )
        , meta: {
          title: '数据变更日志'
          , icon: 'list'
        }
      , }, {
        path: 'data'
        , name: 'activityLog'
        , component: () =>
          import ( '@/views/activity-log/index' )
        , meta: {
          title: '后台操作日志'
          , icon: 'list'
        }
      , }

    ]
  , }, // 系统配置
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
        import ( '@/views/configuration/basic/index' )
      , meta: {
        title: '基础'
        , icon: 'notepad'
      }
    , }, {
      path: 'mail'
      , name: 'configurationMail'
      , component: () =>
        import ( '@/views/email-template/index' )
      , meta: {
        title: '邮件模板'
        , icon: 'message'
      }
    , }, {
      path: 'mail/:id/edit'
      , name: 'configurationMailEdit'
      , component: () =>
        import ( '@/views/email-template/edit' )
      , meta: {
        title: '编辑邮件模板'
      }
      , hidden: true
    }, {
      path: 'mail/create'
      , name: 'configurationMailCreate'
      , component: () =>
        import ( '@/views/email-template/edit' )
      , meta: {
        title: '新增邮件模板'
      }
      , hidden: true
    }, {
      path: 'role'
      , name: 'configurationRole'
      , component: () =>
        import ( '@/views/configuration/role/index' )
      , meta: {
        title: '角色信息'
        , icon: 'usermanage'
      }
    , }, {
      path: 'permission'
      , name: 'configurationPermission'
      , component: () =>
        import ( '@/views/configuration/permission/assign' )
      , meta: {
        title: '权限分配'
        , icon: 'authority'
      }
    , }, {
      path: '/configuration/permission/assign'
      , name: 'configurationPermissionAssign'
      , component: () =>
        import ( '@/views/configuration/permission/index' )
      , meta: {
        title: '权限管理'
      }
      , hidden: true
    , }, ]
  , },
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
        import ( '@/views/manage-tools/cos_api_tool' )
      , meta: {
        title: 'COS接口工具'
        , icon: 'classlist'
      }
    , }, {
      path: ''
      , hidden: true
    }, ],

  },


  // 其他路径
  , {
    path: '*'
    , redirect: '/404'
    , hidden: true
  },

]


const router = new VueRouter( {
  routes: constantRouterMap
  , linkActiveClass: 'active'
  , mode: 'history'
  , scrollBehavior( to, from, savedPosition ) {
    if ( savedPosition ) {
      return savedPosition;
    }
    return {
      x: 0
      , y: 0
    };
  }
, } );

router.beforeEach( ( to, from, next ) => {
  // 刷新时重新请求全局数据
  if ( Object.keys( store.state.global.param ).length <= 0 ) {
    store.dispatch( 'Courseglobaldata' );
    store.dispatch( 'systemCheck' );
    store.dispatch( 'UploadAllowedType' );
  }
  // For force logout
  // store.dispatch('resetAuthUserDetail');
  helper.check()
    .then( () => {
      // Initialize toastr notification
      helper.notification();
      // Check for IP Restriction; If restricted IP found, redirect to "/ip-restricted" route
      if ( helper.getConfig( 'ip_filter' ) && localStorage.getItem( 'ip_restricted' ) && to.fullPath !== '/ip-restricted' ) {
        return next( {
          path: '/ip-restricted'
        } );
      }
      if ( to.matched.length === 0 && !helper.isAuth() ) {
        toastr.error( '该页面需要登录用户才能访问!' );
        return next( {
          path: '/login'
        } );
      }
      if ( to.matched.some( m => m.meta.validate ) ) {
        const m = to.matched.find( item => item.meta.validate );

        // 需要验证的页面
        if ( m.meta.validate.indexOf( 'auth' ) > -1 ) {
          if ( !helper.isAuth() ) {
            Lockr.rm( 'roles' );
            store.dispatch( 'ResetRoutes' );
            toastr.error( '该页面需要登录用户才能访问!' );
            return next( {
              path: '/login'
            } );
          }
        }

        // 不需要验证的页面
        // if ( m.meta.validate.indexOf( 'guest' ) > -1 ) {
        //   if ( helper.isAuth() ) {
        //     toastr.error( '该页面需要游客身份才能访问!' );
        //     return next( {
        //       path: '/dashboard'
        //     } );
        //   }
        // }
      }
      // 生成路由
      let roles = Lockr.get( 'roles' );
      roles = roles ? roles : [];
      if ( !store.getters.hasRouter && roles && roles.length > 0 ) {
        store.dispatch( 'GenerateRoutes', {
          roles
        } ).then( () => { // 生成可访问的路由表
          router.addRoutes( store.getters.addRouters ) // 动态添加可访问路由表
          store.dispatch( 'SetRoutes' );
        } )
      }
      return next();
    } )
    .catch( ( e ) => {
      console.log( e )
      console.log( '路由check异常,转到login...' );
      store.dispatch( 'resetAuthUserDetail' );
      store.dispatch( 'ResetRoutes' );
      if ( to.path === '/login' ) {
        return next();
      }
      return next( {
        path: '/login'
      } );
    } );
} );

export default router;
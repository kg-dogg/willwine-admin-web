const getters = {
  sidebar: state => state.app.sidebar
  , curriculum: state => state.global.curriculum
  , param: state => state.global.param
  , addRouters: state => state.permission.addRouters
  , routers: state => state.permission.routers
  , hasRouter: state => state.permission.hasRouter
};
export default getters;
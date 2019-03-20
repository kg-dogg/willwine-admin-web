import Vuex from 'vuex';
import goods from './modules/goods';
import app from './modules/app';
import system from './modules/system';
import getters from './getters';
import global from './modules/global';
import permission from './modules/permission';

// Vue.config.devtools = true;
const store = new Vuex.Store({
  modules: {
    goods,
    app,
    system,
    global,
    permission,
  },
  getters,
});
export default store;

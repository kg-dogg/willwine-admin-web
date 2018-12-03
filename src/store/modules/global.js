import { globalResourse, getAllowedType } from '../../api/api';

const global = {
  state: {
    curriculum: {},
    param: {},
    type: {},


  },
  mutations: {
    SET__curriculum(state, curriculum) {
      state.curriculum = curriculum;
    },

    SET__param(state, param) {
      state.param = param;
    },
    SET__type(state, type) {
      state.type = type;
    }


  },
  actions: {

    Courseglobaldata({ commit }) {
      // globalResourse().then((res) => {
      //   const curriculum = res.data.curriculum;
      //   commit('SET__curriculum', curriculum);

      //   commit('SET__param', res.data);
      // }).catch();
    },
    UploadAllowedType({ commit }) {
      // getAllowedType().then((res) => {
      //   commit('SET__type', res.data[0]);
      // }).catch();
    }


  },


};


export default global;

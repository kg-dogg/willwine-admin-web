const goods = {
  state: {
    current: 0,
    info: {},
    sku: {},
  },
  mutations: {
    SAVE_INFO: (state, info) => {
      state.info = info;
      state.current = 1;
    },
    SAVE_SKU: (state, sku) => {
      state.sku = sku;
    },
  },
  actions: {
    saveInfo: ({ commit }, info) => {
      commit('SAVE_INFO', info);
    },
    saveSku({ commit }, sku) {
      commit('SAVE_SKU', sku)
    },
  },
};

export default goods;
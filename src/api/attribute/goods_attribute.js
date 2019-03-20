import http from '../http';

const create = form => http.apiPost('/liquor/goods/attribute', form);
const list = goodsId => http.apiGet(`/liquor/goods/attribute/${goodsId}`);
const put = data => http.apiPut('/liquor/goods/attribute', data);
const del = data => http.apiDelete('/liquor/goods/attribute', data);

export default {
  create,
  list,
  put,
  del,
};

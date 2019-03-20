import http from './http';

const create = data => http.apiPost('/liquor/goods/brand', data);
const list = () => http.apiGet('/liquor/goods/brand');
const get = id => http.apiGet(`/liquor/goods/brand/${id}`);
const put = data => http.apiPut('/liquor/goods/brand', data);
const del = data => http.apiDelete('/liquor/goods/brand', data);

export default {
  create,
  list,
  get,
  put,
  del,
};

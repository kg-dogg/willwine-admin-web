import http from '../http';

const create = data => http.apiPost('/liquor/goods/attribute/category', data);
const list = () => http.apiGet('/liquor/goods/attribute/category');
const put = data => http.apiPut('/liquor/goods/attribute/category', data);
const del = data => http.apiDelete('/liquor/goods/attribute/category', data);
const get = id => http.apiGet(`/liquor/goods/attribute/category/${id}`);

export default {
  create,
  list,
  put,
  del,
  get,
};

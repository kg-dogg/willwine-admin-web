import http from '../http';

const create = data => http.apiPost('/liquor/goods/attribute/key', data);
const list = id => http.apiGet(`/liquor/goods/attribute/key/list/${id}`);
const put = data => http.apiPut('/liquor/goods/attribute/key', data);
const del = data => http.apiDelete('/liquor/goods/attribute/key', data);
const get = id => http.apiGet(`/liquor/goods/attribute/key/name/${id}`);

export default {
  create,
  list,
  put,
  del,
  get,
};

import http from '../http';

const create = (form) => http.apiPost('/liquor/goods/attribute/value', form);
const list = id => http.apiGet(`/liquor/goods/attribute/value/${id}`);
const put = data => http.apiPut('/liquor/goods/attribute/value', data);
const del = data => http.apiDelete('/liquor/goods/attribute/value', data);
const listByCategoryId = id => http.apiGet(`/liquor/goods/attribute/aggreation/${id}`);

export default {
  create,
  list,
  listByCategoryId,
  put,
  del,
};

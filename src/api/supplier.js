import http from './http';

const create = data => http.apiPost('/supplier', data);
const list = () => http.apiGet('/supplier');
const put = data => http.apiPut('/supplier', data);
const del = data => http.apiDelete('/supplier', data);

export default {
  create,
  list,
  put,
  del,
};

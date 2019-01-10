import http from '../http';

const create = (form) => http.apiPost('/liquor/product', form);
const get = () => http.apiGet('/liquor/product');

export default {
  create,
  get,
};

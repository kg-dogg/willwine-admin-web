import http from '../http';

const create = (form) => http.apiPost('/liquor/product/category', form);
const get = () => http.apiGet('/liquor/product/category');

export default {
  create,
  get,
};

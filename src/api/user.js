import http from './http';

// 用户登录
const loginByUsername = (username, password) => http.apiPost('/auth/login', {
  username,
  password,
});

// 用户登出
const logout = () => http.apiPost('/auth/logout', {});

export default {
  loginByUsername,
  logout,
};

'use strict'
const merge = require( 'webpack-merge' )
const prodEnv = require( './prod.env' )

module.exports = merge(prodEnv, {
  NODE_ENV: '"production"',

  // CDN URL
  CDN_URL: '"//cdn-dev.riselinkedu.com/"',

  // API接口地址
  API_URL: '"https://dev.adminapi.riselinkedu.com/"',

  // 前端域名
  FRONT_URL: '"//cdn-dev.riselinkedu.com/"',
  // 前台地址
  WEB_URL:'"https://dev.web.riselinkedu.com:3000"'
} )
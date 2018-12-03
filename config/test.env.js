'use strict'
const merge = require( 'webpack-merge' )
const prodEnv = require( './prod.env' )

module.exports = merge( prodEnv, {
  NODE_ENV: '"production"',

  // CDN URL
  CDN_URL: '"//cdn-test.riselinkedu.com/"',

  // API接口地址
  API_URL: '"//test.adminapi.riselinkedu.com/"',

  FRONT_URL: '"//cdn-test.riselinkedu.com/"', // 前台地址
  WEB_URL: '"https://test.web.riselinkedu.com:3000"'
} )
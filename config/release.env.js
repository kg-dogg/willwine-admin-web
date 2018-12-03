'use strict'
const merge = require( 'webpack-merge' )
const prodEnv = require( './prod.env' )

module.exports = merge( prodEnv, {
  NODE_ENV: '"production"',

  // API接口地址
  API_URL: '"//stage.adminapi.riselinkedu.com/"',

  FRONT_URL: '"//cdn-stage.riselinkedu.com/"',

  CDN_URL: '"//cdn-stage.riselinkedu.com/"', // 前台地址
  WEB_URL: '"https://stage.web.riselinkedu.com:3000"'
} )
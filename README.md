# riseon-admin-web

> riseonline 后台管理系统前端项目

相关技术栈:

- `vue` 全家桶
- `asios`
- `elementUI`
- `moment`
- `lodash`
- `...`

## 本地环境搭建

``` bash
# install dependencies - 安装项目依赖, 或使用yarn安装: yarn
npm install


# 配置本地环境ajax请求的目标域名
cp .env.example .env
#编辑API_URL为本地或者其他服务端接口地址
vim .env


# serve with hot reload at localhost:8080  - 本地运行与开发预览
npm run local


#=========================================
# 以下为可选或线上环境构建相关
#=========================================

# build for production with minification - 线上产品构建打包 (本地x)
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


import Mock from 'mockjs'; // 导入mockjs 模块

var data = Mock.mock( {
  'resource_path': () => Mock.Random.url( 'http' )
  , 'relative_resources_path': () => Mock.Random.url( 'http' )
} )


export default {
  "status_code": 200
  , "message": ''
  , "data": data
}
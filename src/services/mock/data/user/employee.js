import Mock from 'mockjs'; // 导入mockjs 模块
import sampleSize from 'lodash/sampleSize';
import sample from 'lodash/sample';

var employeeData = Mock.mock( {
  'data|10-20': [ {
    'id|+1': 1000
    , 'name': () => Mock.Random.cname(),

    'profile': {
      'employee_id': () => Mock.Random.natural( 100, 999999 )
      , 'brand': () => Mock.Random.pick( [ '总部', 'cantalk', 'riseup' ] )
    , }
    , 'roles|1-1': [ {
      'id': () => Mock.Random.natural( 10, 9999 )
      , 'name': () => Mock.Random.pick( [ '督导', '课程主管', '老师', '' ] )
    } ]
    , 'created_at': () => Mock.Random.datetime( 'yyyy-MM-dd HH:mm:ss' )
    , 'status': () => Mock.Random.pick( [ 'activited', 'banned' ] )
    , 'org_name': () => Mock.Random.name()
    , 'position_name': () => Mock.Random.pick( [ '人力资源部经理', '运营顾问主管', '展厅督导', '英语教师', '网管', '人事专员' ] )
  , } ]
} );

export default {
  ...employeeData
  , "status_code": 200
  , "message": ''
  , "meta": {
    "pagination": {
      "total": 100
      , "count": 0
      , "per_page": 20
      , "current_page": 0
      , "total_pages": 0
      , "links": {
        "previous": "string"
        , "next": "string"
      }
    }
  }
}
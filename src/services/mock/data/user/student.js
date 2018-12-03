import Mock from 'mockjs'; // 导入mockjs 模块
import sampleSize from 'lodash/sampleSize';
import sample from 'lodash/sample';

var studentData = Mock.mock( {
  'data|10-20': [ {
    'id|+1': 1000
    , 'name': () => Mock.Random.cname()
    , 'name_en': () => Mock.Random.name(),

    'profile': {
      'brand': () => Mock.Random.pick( [ '总部', 'cantalk', 'riseup' ] )
      , 'student_no': () => `S${Mock.Random.natural(100, 999999)}`
    }
    , 'parent': {
      'name': () => Mock.Random.cname()
      , 'mobile': () => `13${Mock.Random.natural(100000000, 999999999)}`
    , }
    , 'department': () => Mock.Random.pick( [ '直营', '合作', '加盟' ] )
    , 'created_at': () => Mock.Random.datetime( 'yyyy-MM-dd HH:mm:ss' )
    , 'status': () => Mock.Random.pick( [ 'activited', 'banned' ] )

  , } ]
} );

export default {
  ...studentData
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
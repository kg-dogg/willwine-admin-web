import Mock from 'mockjs'; // 导入mockjs 模块

var data = Mock.mock( {
  'data|3-10': [ {
    'teacher_id|+1': 1000
    , 'teacher_name': () => Mock.Random.name()
    , 'provider_name': () => Mock.Random.name()
    , 'pay_method': () => Mock.Random.pick( [ '买断', '临时'] )
    , 'actual_hours': () => Mock.Random.natural( 10, 100 )
    , 'course_duration': 30
    , 'course_price': () => Mock.Random.pick( [ 140,160,180,200] )
    , 'bought_hours': 100
    , 'leave_hours': Mock.Random.natural( 1, 50 )
    , 'pay_hours': () => Mock.Random.natural( 10, 20 )
  , } ]
} );

export default {
  ...data
  , "status_code": 200
  , "message": ''
  , "meta": {
    "activated_total": Mock.Random.natural( 1, 1000 )
    , "banned_total": Mock.Random.natural( 1, 1000 )
    , "pagination": {
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
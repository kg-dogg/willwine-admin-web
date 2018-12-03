import Mock from 'mockjs'; // 导入mockjs 模块
import sampleSize from 'lodash/sampleSize';

var teacherData = Mock.mock( {
  'data|3-10': [ {
    'user_id|+1': 1000
    , 'full_name': () => Mock.Random.name()
    , 'name_en': () => Mock.Random.name()
    , 'c_country': () => Mock.Random.pick( [ '中国', '美国', '英国', '德国', '意大利', '法国', '印度', '日本', '冰岛' ] )
    , 'student_total': () => Mock.Random.natural( 1, 1000 )
    , 'lesson_total': () => Mock.Random.natural( 1, 100 )
    , 'week_status': () => Mock.Random.pick( [ 'activated', 'will_ban', 'initial', 'will_activate', 'banned' ] )
    , 'brand': () => sampleSize( [ 'cantalk', 'riseup' ], Mock.Random.natural( 1, 2 ) )
    , 'introduce': () => Mock.Random.cparagraph( 0, 300 )
    , 'img_introduce': () => Mock.Random.image( '300x250' )
    , 'video_map': () => Mock.Random.image( '300x250' )
    , 'video_introduce': () => Mock.Random.url( 'http' )

  , } ]
} );

export default {
  ...teacherData
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
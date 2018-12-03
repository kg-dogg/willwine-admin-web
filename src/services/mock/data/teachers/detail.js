import Mock from 'mockjs'; // 导入mockjs 模块

var data = Mock.mock( {
  'user_id|+1': 1000
  , 'full_name': () => Mock.Random.name()
  , 'short_name': () => Mock.Random.name()
  , 'c_country': () => Mock.Random.pick( [ '中国', '美国', '英国', '德国', '意大利', '法国', '印度', '日本', '冰岛' ] )
  , 'student_total': () => Mock.Random.natural( 1, 1000 )
  , 'lesson_total': () => Mock.Random.natural( 1, 100 )
  , 'week_status': () => Mock.Random.pick( [ 'activated', 'will_ban', 'initial', 'will_activate', 'banned' ] )
  , 'introduce': () => Mock.Random.cparagraph( 0, 300 )
  , 'img_introduce': () => Mock.Random.image( '300x250' )
  , 'video_map': () => Mock.Random.image( '300x250' )
  , 'video_introduce': () => Mock.Random.url( 'http' )
  , 'lessons': {
    'data|10-30': [ {
      '_id': () => Mock.Random.string( 'lower', 16, 16 )
      , 'scheduled_at': () => '2018-' + Mock.Random.datetime( 'MM-dd HH:mm:ss' )
      , 'scheduled_end_at': () => '2018-' + Mock.Random.datetime( 'MM-dd HH:mm:ss' )
      , 'is_leave': () => Mock.Random.natural( 0, 1 )
      , 'full_name': () => Mock.Random.name()
      , 'week_status': () => Mock.Random.pick( [ 'activated', 'will_ban', 'initial', 'will_activate', 'banned' ] )
    } ]
  }
} )

export default {
  "status_code": 200
  , "message": ''
  , "data": data
}
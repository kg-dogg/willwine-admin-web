import Mock from 'mockjs'; // 导入mockjs 模块
import sampleSize from 'lodash/sampleSize';

var studentsOnData = Mock.mock( {
  'data|3-10': [ {
    'user_id|+1': 1000
    , 'created_at': () => Mock.Random.datetime( 'yyyy-MM-dd HH:mm:ss' )
    , 'id': () => Mock.Random.string( 'string|number', 16, 16 )
    , 'not_course': () => Mock.Random.natural( 1, 10 )
    , 'curriculum': {
      'data': {
        'id': () => Mock.Random.string( 'string|number', 16, 16 )
        , 'periods': () => Mock.Random.natural( 11, 20 )
        , 'title': () => Mock.Random.string()
      }
    }
  , } ]
} );

export const studentsOn = {
  ...studentsOnData
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
};

// export default {
//   studentsOn: studentsOn
// }
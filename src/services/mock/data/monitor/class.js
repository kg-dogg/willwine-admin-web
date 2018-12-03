import Mock from 'mockjs'; // 导入mockjs 模块

const data = Mock.mock({
  'data|3-10': [{
    'id|+1': 1000,
    'scheduled_at': () => moment().format('YYYY-MM-DD ') + Mock.Random.datetime('08:mm:ss'),
    'scheduled_end_at': () => moment().format('YYYY-MM-DD ') + Mock.Random.datetime('20:mm:ss'),
    'teacherStatus': () => Mock.Random.pick(['on_line', 'off_line']),
    'studentStatus': () => Mock.Random.pick(['on_line', 'off_line']),
    'note': () => Mock.Random.pick(['中国', '美国', '英国', '德国', '意大利', '法国', '印度', '日本', '冰岛']),
    'teacher': () => {
      return {
        data: {
          name: Mock.Random.pick(['tony', 'kaven', 'tom', 'jack', 'sanly', 'candy'])
        }
      }
    },
    'student': {
      'data': [{
        name: () => Mock.Random.pick(['小明', '小强', '小张', '小丽', '小红', '小花']),
        name_en: () => Mock.Random.pick(['tony', 'kaven', 'tom', 'jack', 'sanly', 'candy']),
        mobile: '18888888888'
      }]
    },
    'teacherHelpStatus': () => Mock.Random.pick([true, false]),
    'studentHelpStatus': () => Mock.Random.pick([true, false]),
  }]
});

export default {
  ...data,
  "status_code": 200,
  "message": '',
  "meta": {
    "activated_total": Mock.Random.natural(1, 1000),
    "banned_total": Mock.Random.natural(1, 1000),
    "pagination": {
      "total": 100,
      "count": 0,
      "per_page": 20,
      "current_page": 0,
      "total_pages": 0,
      "links": {
        "previous": "string",
        "next": "string"
      }
    }
  }
}

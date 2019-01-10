/**
 * ajax 接口请求统一放在这里管理
 *
 * @description 所有ajax请求抽象为方法,方便统一管理与统一调用
 * @author wzx
 */
import http from './http';

//= =========================================================
// 建课功能
//= =========================================================
/**
 * 获取课程列表
 */
// export const getCurriculums = (params) => http.apiGet('/curriculum', params)
// 课程首页获取课程列表
// export const getCurriculums = () => http.apiGet('/curriculum')
// 课程首页发布
export const Release = (sendurl, sta) => http.apiPatch(sendurl, sta);
// 课程首页冻结
export const Freeze = (sendurl, sta) => http.apiPatch(sendurl, sta);
// // 课程首页查看
export const CourseLook = sendurl => http.apiGet(sendurl);
// TODO 课程首页修改
// 课程创建第一步提交
export const Stepfirst = ruleForm => http.apiPost('/curriculum', ruleForm);
// 课程创建第二步提交
export const Stepsecond = (sendurl, myflatten) => http.apiPut(sendurl, myflatten);

//  ==========================================================
// 课程功能
//  ==========================================================
/**
 * 获取课程/班型列表
 */
export const getCurriculums = params => http.apiGet('/curriculum/classtype', params);

/**
 * 获取某个课程/班型的详细信息: cid: 课程id
 */
export const getCurriculumByID = (cid, include) => http.apiGet(`/curriculum/${cid}`, include);

/**
 * 保存课时结构
 */
export const setCourseLevel = (id, params) => http.apiPatch(`/curriculum/${id}/course`, params);

/**
 * 保存单个课时资源数据
 */
export const saveCourseRes = (id, params) => http.apiPatch(`/courses/${id}`, params);

//= =========================================================
// 排课功能
//= =========================================================

/**
 * 新增排课 - 试听课
 * http://admin.api.117.50.12.51.xip.io/docs/#/Lessons/post_lessons
 */
export const addLesson = (curriculumId, lessonsTime) => http.apiPost('/lessons/trial', {
  curriculum_id: curriculumId,
  lessons_time: lessonsTime
});

/**
 * 新增排课 - 常规课
 */
export const addLessonNormal = (curriculumId, lessonsTime) => http.apiPost('/lessons/normal', {
  curriculum_id: curriculumId,
  lessons_time: lessonsTime
});

/**
 * 获取试听课列表
 */
export const getTrialLessons = (params, curriculum = false) => {
  if (curriculum) {
    params.include = 'curriculum,product';
  }
  return http.apiGet('/lessons/trial', params);
};

/**
 * 单个排课的详细信息
 */
export const getLessonDetail = id => http.apiGet(`/lessons/${id}`, {});

/**
 * 删除单个试听课排课信息
 */
export const deleteLessonTrial = id => http.apiDelete(`/lessons/${id}`, {});

/**
 * 试听课选择可排课老师列表
 */
export const listTeachersTrial = tid => http.apiGet(`/lessons/trial/${tid}/teacher`, {});

/**
 * 给某个试听课排课数据 选择外教老师 -- 创建直播教室
 */
export const chooseTeachersTrial = (id, teachers) => http.apiPut(`/lessons/trial/${id}`, {
  teacher_ids: teachers
});

/**
 * 正式课列表: 未排课学生
 */
export const getNormalLessonsUnlessoned = params => http.apiGet('/lessons/normal/student/notyet', params);

/**
 * 正式课列表: 已排课学生
 */
export const getNormalLessonsLessoned = params => http.apiGet('/lessons/normal/student/lessonsed', params);

/**
 * 正式课: 查询符合条件的教室
 */
export const getLessonTeathers = (orderId, lessonsTimes) => http.apiPost('/lessons/normal/teacher', {
  id: orderId,
  lessons_times: lessonsTimes
});

/**
 * 获取子订单相关数据
 */
export const getSuborderDetail = (oid, include) => http.apiGet(`/lessons/order/${oid}`, include);

/**
 * 正式课: 添加最终排课信息
 */
export const addLessonsNormal = (id, teacherId, lessonsTimes) => http.apiPost('/lessons/normal', {
  id,
  teacher_id: teacherId,
  lessons_times: lessonsTimes
});

/**
 * 正式课: 补加课时
 */
export const addLeftLessonsNormal = (id, teacherId, lessonsTimes) => http.apiPost('/lessons/normal/missed', {
  id,
  teacher_id: teacherId,
  lessons_times: lessonsTimes
});

/**
 * 大课表
 */
export const getLessonTable = (start = '', end = '',include) => http.apiGet('/lessons/timetable', {
  start_at: start,
  end_at: end,
  include: include
});

/**
 * 学生课表
 */
export const getStudentSchedule = (student_id, curriculum_id) => http.apiGet(`/lessons/timetable/${student_id}`, {
  curriculum_id: curriculum_id
})

/**
 * 给老师留言
 */
export const addMessageToTeacher = (message, sid, cid) => http.apiPost('/lessons/leavemessage', {
  content: message,
  student_id: Number(sid),
  curriculum_id: cid
})

/**
 * 获取补课时基本信息
 */
export const getMakeupLesson = (curriculum_id, student_id) => http.apiGet('/lessons/makeup', {
  curriculum_id: curriculum_id,
  student_id: student_id
})

/**
 * 新增补课
 */
export const addMakeupLesson = form => http.apiPost('/lessons/makeup', form)


/**
 * 获取产品包列表
 */
export const getProducts = include => http.apiGet('/lessons/product', include);


//= =========================================================
// 作业功能
//= =========================================================
/**
 * 获取单个作业相关数据
 */
export const getJobDetail = (id, include) => http.apiGet(`/jobs/${id}`, include);
/*
 * 新建作业
 */
export const addJobs = form => http.apiPost('/jobs', form);
/*
 * 编辑作业
 */
export const patchJobs = (id, form) => http.apiPatch(`/jobs/${id}`, form);
/**
 * 获取作业列表
 */
export const getHomeworks = (page, include, form) => http.apiGet('/jobs', $.extend({
  page,
  include
}, form));

/**
 获取对应课时信息
 */
export const getJobCourse = (stage, class_) => http.apiPost('/jobs/course', {
  stage,
  class: class_
});

/**
 作业启用停用
 */
export const jobEnable = (id, status) => http.apiPatch(`/jobs/${id}/enable`, {
  status
});
/**
 作业审核状态
 */
export const jobStatus = id => http.apiPatch(`/jobs/${id}/status`);

/**
 复制作业
 */
export const copyJop = jobIds => http.apiPost('/jobs/copy', {
  job_ids: jobIds
});

//= =========================================================
// 公共功能
//= =========================================================

/**
 * 上传接口 - URL
 */
export const globalUploadUrl = `${API_URL}/files`;
export const globalAvatarUrl = id => `${API_URL}user/profile/avatar/${id}`;

// 展示图片-URL
export const globalViewUrl = CDN_URL;
// 全局资源获取
export const globalResourse = () => http.apiGet('/configuration/params');

// 班级督导相关接口
export const classroom = () => http.apiGet('/classroom');
export const classSupervisor = () => http.apiGet('/classroom/supervisor');
export const classCurriculum = () => http.apiGet('/classroom/curriculum');
export const classUpdate = (id, datas) => http.apiPut(`/classroom/${id}`, datas);
export const classMultAssign = datas => http.apiPatch('/classroom/mult-assign', datas);

// 版本管理接口
export const getVersions = (page, platform,project) => http.apiGet('/versions', {
  page,
  platform,
  project
});
export const getOneVersions = id => http.apiGet(`/versions/${id}`);
export const addVersions = form => http.apiPost('/versions', form);
export const updateVersions = (id, form) => http.apiPatch(`/versions/${id}`, form);
export const statusVersions = (id,form) => http.apiPut(`/versions/status/${id}`, form);
export const updateVersionsCurrent = (id, form) => http.apiPut(`/versions/${id}/current`);
export const destoryVersions = id => http.apiDelete(`/versions/${id}`);

//= =========================================================
// 用户相关接口
//= =========================================================

// check基本周边数据获取
export const check = () => http.apiPost('/auth/check', {});

export const refresh = () => http.apiPut('/auth/refresh', {});

// 获取所有用户列表
export const getUsers = (page, page_length = 20) => http.apiGet('/user', {
  page: page,
  page_length: page_length
});

// 获取所有角色等其他信息
export const preRequests = () => http.apiGet('/user/pre-requisite', {});

// 新增用户
export const addUser = (form) => http.apiPost('/user', form);

// 删除用户
export const deleteUser = (id) => http.apiDelete(`/user/${id}`, {});

// 用户登录
export const loginByUsername = (username, password) => http.apiPost('/auth/login', {
  username,
  password,
});

// 用户登出
export const logout = () => http.apiPost('/auth/logout', {});

// 获取某个id的用户信息
export const getUserInfo = id => http.apiGet(`/user/${id}`);

// 更新用户基本信息
export const updateUserBaseInfo = (id, form) => http.apiPatch(`/user/${id}`, { ...form
});

// 更新用户附属信息
export const updateProfile = (id, form) => http.apiPatch(`/user/${id}/profile`, { ...form
});

// 更新用户密码
export const updateUserPassword = (id, form) => http.apiPatch(`/user/${id}/force-reset-password`, { ...form
});

// 权限分配关系数据
export const getPermissionPre = guard => http.apiGet('/permission/assign/pre-requisite', {
  guard: guard
});

// 获取当前用户所有权限
export const getPermissions = () => http.apiGet('/permission', {});

// 获取所有组织结构数据
export const getCosOrginazations = () => http.apiGet('/user/cos/orginazation', {});
// 获取岗位分页数据
export const getPositions = page => http.apiGet('/user/cos/position', {
  page: page
});

// 获取员工列表
export const getUsersEmployee = (page, search) => http.apiGet('/user/employees', {
  page: page,
  ...search
});
// 获取学生列表
export const getUsersStudent = (page,search) => http.apiGet('/user/students', {
  page: page,
  ...search
});
// 获取家长列表
export const getUsersParent = (page,search) => http.apiGet('/user/parents', {
  page: page,
  ...search
});




// 监课管理
export const getMonitorStatics = () => http.apiGet('/superviseclass/statics');
export const getMonitorList = data => http.apiGet('/superviseclass', data);

// 获取上传组件允许的文件类型
export const getAllowedType = () => http.apiGet('/resources/allow/type');

// 消息管理接口
export const getTemplateList = search => http.apiGet('/template/message', search);
export const addTemplate = data => http.apiPost('/template/message', data);
export const getTemplate = id => http.apiGet(`/template/message/${id}`);
export const modifyTemplate = (data, id) => http.apiPatch(`/template/message/${id}`, data);
export const deleteTemplate = id => http.apiDelete(`/template/message/${id}`);

// 获取后台操作日志
export const getAudit = page => http.apiGet('/audit', page);
export const getAuditType = () => http.apiGet('/audit/type');

//= =========================================================
// 外教功能
//= =========================================================

// 新增/修改外教
export const addTeacher = form => http.apiPost('/foreign/teachers/teacher', form);
export const editTeacher = (id, form) => http.apiPatch(`/foreign/teachers/teacher/${id}`, form);

// 编辑外教官方介绍信息
export const editTeacherIntroduce = (id, {
  introduce,
  img_introduce,
  video_introduce
}) => http.apiPut(`/foreign/teachers/teacher/${id}/introduce`, {
  introduce: introduce,
  img_introduce: img_introduce,
  video_introduce: video_introduce
})

// 获取外教列表
export const getTeachers = (page, {
  name,
  provider_id
}) => http.apiGet('/foreign/teachers/teacher', {
  page: page,
  full_name: name,
  provider_id: provider_id
});

// 获取某个外教的详细信息
export const getTeacherDetail = (id, include = '', start = '', end = '') => http.apiGet(`/foreign/teachers/teacher/${id}`, {
  include: include,
  start: start,
  end: end
});

// 停用/启用 外教
export const stopTeacher = (id, day) => http.apiPut(`/foreign/teachers/teacher/${id}/switch`, {
  week_at: day,
  week_status: 'will_ban'
});
export const startTeacher = (id) => http.apiPut(`/foreign/teachers/teacher/${id}/switch`, {
  week_status: 'activated'
});

// 外教请假提交
export const addTeacherLeaving = (id, lesson_ids, cause) => http.apiPut(`/foreign/teachers/teacher/${id}/leave`, {
  lesson_ids: lesson_ids,
  cause: cause
})

// 获取国籍列表
export const getCountry = () => http.apiGet('/foreign/teachers/teacher/country', {});

// 获取外教的课时汇总
export const getTeachersCourses = form => http.apiGet('/foreign/teachers/course', form)


//= =========================================================
// 系统配置
//= =========================================================

// 保存基本配置
export const saveConfiguration = (form) => http.apiPost('/configuration', form);

// 获取邮件模板列表
export const emailTemplates = (page = 0) => http.apiGet('/email-template', {
  page: page
});

// 编辑邮件模板
export const editEmailTemplate = (id, form) => http.apiPatch(`/email-template/${id}`, form);

// 新增邮件模板
export const addEmailTemplate = (form) => http.apiPost('/email-template', form);

// 删除邮件模板
export const deleteEmailTemplate = (id) => http.apiDelete(`/email-template/${id}`, {});

// 角色列表
export const roleList = () => http.apiGet('/role', {});

// 新增角色
export const addRole = ({
  guard,
  name,
  description
}) => http.apiPost('/role', {
  guard: guard,
  name: name,
  description: description
});

// 新增权限
export const addPermission = ({
  guard,
  name,
  description
}) => http.apiPost('/permission', {
  guard: guard,
  name: name,
  description: description
});

//= =========================================================
// 作业管理
//= =========================================================

// 作业版本接口
export const getVersionList = id => http.apiGet('/job/version', {
  curriculum_id: id
});
export const addVersion = (hwId, userId) => http.apiPost('/job/version', {
  curriculum_id: hwId,
  user_id: userId
});
export const deleteVersion = versionId => http.apiDelete(`/job/version/${versionId}`);
export const launchVersion = (versionId, data) => http.apiPatch(`/job/version/${versionId}`, data);

// 作业接口
export const getJobList = ({
  page,
  id,
  tag,
  course_id,
  status,
  type
}) => http.apiGet('/jobs', {
  tag,
  page,
  status,
  type,
  course_id,
  curriculum_id: id
});
export const addJob = data => http.apiPost('/jobs', data);
export const getJob = (id, tag) => http.apiGet(`/jobs/${id}/${tag}`);
export const modifyJob = (id, data) => http.apiPut(`/jobs/${id}`, data);
export const checkJob = (id, tag) => http.apiPatch(`/jobs/status/${id}/${tag}`);
export const deleteJob = (id, tag) => http.apiDelete(`/jobs/${id}/${tag}`);
// 复制作业
export const copyUploadJobUrl = `${API_URL}copy/verfiy`;
export const copyConfirmJob = data => http.apiPost('/copy/add', data);


export const uploadVideo = data => http.apiPost('/resources/reserve/video', data);
// 阿里云视频上传 STS 凭证 获取
export const uploadVideoSTS = data => http.apiPost('/resources/reserve/stsrole', data);
export const getCourseInfo = id => http.apiGet(`/courses/${id}`);

// 渠道管理接口
export const getProviders = page => http.apiGet('/foreign/teachers/provider', {
  page
});
export const getProvider = id => http.apiGet(`/foreign/teachers/provider/${id}`);
export const deleteProvider = id => http.apiDelete(`/foreign/teachers/provider/${id}`);
export const switchProvider = (id, body) => http.apiPut(`/foreign/teachers/provider/${id}/switch`, body);
export const addProvider = body => http.apiPost(`/foreign/teachers/provider`, body);
export const modifyProvider = (id, body) => http.apiPatch(`/foreign/teachers/provider/${id}`, body);

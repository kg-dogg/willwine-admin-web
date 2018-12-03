import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Mock from 'mockjs';

import loginData from './data/auth/login';
import checkData from './data/auth/check';
import uploadData from './data/configuration/upload'
import paramsData from './data/configuration/params';
import teachersData from './data/teachers/teachers';
import teacherData from './data/teachers/detail';
import teacherCourseData from "./data/teachers/course";
import { studentsOn } from "./data/lessons/students";


import orgData from './data/org/orgs'
import positionsData from './data/org/posotionsData'
import employeeData from './data/user/employee'
import studentData from './data/user/student'

import monitorClassData from './data/monitor/class'



export default {
  /**
   * mock start: mock启动
   */
  start() { // 初始化函数
    let mock = new MockAdapter( axios ); // 创建 MockAdapter 实例


    // 开始各个mock

    mock.onGet( 'configuration/params' ).reply( ( config ) => new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, paramsData ] ) }, 200 ) ) );
    mock.onPost( 'auth/check' ).reply( ( config ) => new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, checkData ] ) }, 200 ) ) );
    mock.onPost( 'auth/login' ).reply( ( config ) => new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, loginData ] ) }, 200 ) ) );

    // 获取外教列表
    mock.onGet( '/foreign/teachers/teacher' ).reply( ( config ) => new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, teachersData ] ) }, 200 ) ) );
    // 获取外教详情
    mock.onGet( /\/foreign\/teachers\/teacher\/\d+/ ).reply( ( config ) => {
      return new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, teacherData ] ) }, 200 ) )
    } );

    // 外教请假
    mock.onPut( /\/foreign\/teachers\/teacher\/\d+\/leave/ ).reply( ( config ) => {
      return new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, { status_code: 200, message: "good" } ] ) }, 200 ) )
    } );

    // 排课 - 未排课学生列表
    mock.onGet( '/lessons/normal/student/notyet' ).reply( ( config ) => {
        return new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, studentsOn ] ) }, 200 ) )
      } )
      // 更新外教介绍
    mock.onPut( /\/foreign\/teachers\/teacher\/\d+\/introduce/ ).reply( ( config ) => {
      return new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, { status_code: 200, message: "good" } ] ) }, 200 ) )
    } );
    // 获取外教的课时信息
    mock.onGet(/\/foreign\/teachers\/course/).reply(config=>{
      return new Promise((resolve,reject)=>{
        setTimeout(() => {
          resolve([200,teacherCourseData])
        }, 200);
      })
    })



    // 上传单独
    Mock.mock( /\/resources/, 'post', {...uploadData } )


    // 获取组织结构
    mock.onGet( '/user/cos/orginazation' ).reply( ( config ) => new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, orgData ] ) }, 200 ) ) );
    // 获取岗位数据
    mock.onGet( '/user/cos/position' ).reply( ( config ) => new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, positionsData ] ) }, 200 ) ) );

    // 获取员工列表
    mock.onGet( '/user/employees' ).reply( ( config ) => new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, employeeData ] ) }, 200 ) ) );

    // 获取学生列表
    mock.onGet( '/user/students' ).reply( ( config ) => new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, studentData ] ) }, 200 ) ) );

    // 监课数据
    mock.onGet( '/superviseclass' ).reply( ( config ) => new Promise( ( resolve, reject ) => setTimeout( () => { resolve( [ 200, monitorClassData ] ) }, 200 ) ) );
  }
};
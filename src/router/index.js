import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/master',
    component: () => import('../views/Master/ManageMaster.vue'),
    redirect: '/master/delete',
    children: [
      { path: 'today', name: '今日管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/TodayMaster.vue') },
      { path: 'class', name: '班级管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/ClassMaster.vue')},
      { path: 'student', name: '学生管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/StudentMaster.vue') },
      { path: 'teacher', name: '教师管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/TeacherMaster.vue') },
      { path: 'delete', name: '校长消课管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/DeleteMaster.vue')},
      { path: 'finance', name: '财务管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/FinanceMaster.vue')},
      { path: 'user', name: '账号管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/UserMaster.vue')},
      { path: 'month', name: '本月管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/MonthMaster.vue')},
      { path: 'classstudent', name: '课程学生详情', component: () => import(/* webpackChunkName: "about" */ '../views/Master/ClassStudent.vue')},
      { path: 'deleteClass', name: '消课管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/DeleteClass.vue')},
      { path: 'latent', name: '校长邀约管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/LatentMaster.vue')},
      { path: 'kaoqin', name: '校长考勤管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/KaoqinMaster.vue')},
      { path: 'shouzhi', name: '校长收支管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/ShouzhiMaster.vue')},
      { path: 'salary', name: '校长老师工资管理', component: () => import(/* webpackChunkName: "about" */ '../views/Master/SalaryMaster.vue')},
    ]
  }, {
    path: '/teacher',
    component: () => import('../views/Teacher/ManageTeacher.vue'),
    redirect: '/teacher/delete',
    children: [
      { path: 'delete', name: '老师消课管理', component: () => import(/* webpackChunkName: "about" */ '../views/Teacher/DeleteTeacher.vue') },
      { path: 'deleteClass', name: '课堂消课管理', component: () => import(/* webpackChunkName: "about" */ '../views/Teacher/DeleteClass.vue')},
      { path: 'student', name: '老师学生管理', component: () => import(/* webpackChunkName: "about" */ '../views/Teacher/StudentTeacher.vue')},
      { path: 'record', name: '消课记录', component: () => import(/* webpackChunkName: "about" */ '../views/Teacher/DeleteRecord.vue')},
      { path: 'finance', name: '账单管理', component: () => import(/* webpackChunkName: "about" */ '../views/Teacher/FinanceTeacher.vue')},
      { path: 'latent', name: '邀约管理', component: () => import(/* webpackChunkName: "about" */ '../views/Teacher/LatentTeacher.vue')},
      { path: 'kaoqin', name: '考勤管理', component: () => import(/* webpackChunkName: "about" */ '../views/Teacher/KaoqinTeacher.vue')},
      { path: 'salary', name: '薪资管理', component: () => import(/* webpackChunkName: "about" */ '../views/Teacher/SalaryTeacher.vue')},
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router

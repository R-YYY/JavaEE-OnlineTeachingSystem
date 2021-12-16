import Vue from 'vue'
import VueRouter from 'vue-router'
import LogIn from '../components/Login.vue'
import Register from '../components/Register.vue'
import CourseHome from "@/components/teacherPages/CourseHome";
import ManageStudent from "@/components/teacherPages/student/ManageStudent";
import ManageTask from "@/components/teacherPages/task/ManageTask";
import ManageCourse from "@/components/teacherPages/course/ManageCourse";
import ManageGrade from "@/components/teacherPages/grade/ManageGrade";
import ManageFile from "@/components/teacherPages/file/ManageFile";
import EditCourseInfo from "@/components/teacherPages/course/EditCourseInfo";
import TeacherList from "@/components/teacherPages/course/TeacherList";
import TAList from "@/components/teacherPages/course/TAList";
import ProjectList from "@/components/teacherPages/task/ProjectList";
import AttendanceList from "@/components/teacherPages/task/AttendanceList";
import PartGrade from "@/components/teacherPages/grade/PartGrade";
import StudentCourseHome from "@/components/studentPages/StudentCourseHome";
import StudentTask from "@/components/studentPages/task/StudentTask";
import StudentFile from "@/components/studentPages/file/StudentFile";
import Student from "@/components/studentPages/student/Student";
import StudentGrade from "@/components/studentPages/grade/StudentGrade";
import StudentAttendance from "@/components/studentPages/task/StudentAttendance";
import StudentProjectInfo from "@/components/studentPages/task/StudentProjectInfo";

import AdminHome from "@/components/home/AdminHome";
import StudentHome from "@/components/home/StudentHome";
import TeacherHome from "@/components/home/TeacherHome";

import StudentProject from "../components/studentPages/task/StudentProject";

// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect: {name: 'LogIn'},
  },
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path:'/adminhome',
    name:'AdminHome',
    component:AdminHome,
    children:[{
      path:'/teacherlist',
      component:()=>import('@/components/adminPages/teacherlist.vue'),
    },
    {
      path:'/stulist',
      component:()=>import('@/components/adminPages/stulist.vue'),
    }]
  },
  {
    path:'/teachempty',
    component:()=>import('@/components/adminPages/teachEmpty.vue'),
  },
  {
    path:'/stuempty',
    component:()=>import('@/components/adminPages/stuEmpty.vue'),
  },
  {
    path:'/studenthome',
    name:'StudentHome',
    component:StudentHome
  },
  {
    path:'/teacherhome',
    name:'TeacherHome',
    component:TeacherHome
  },
  {
    path:'/register',
    name:'Register',
    component:Register
  },
  {
    path:'/stuinfoset',
    name:'StudentInfoSet',
    component:()=>import('@/components/studentPages/StudentInfoSet.vue'),
  },
  {
    path:'/teainfoset',
    name:'TeacherInfoSet',
    component:()=>import('@/components/teacherPages/TeacherInfoSet.vue'),
  },
  {
    path: '/courses/:course_id',
    name: 'CourseHome',
    redirect:'/courses/:course_id/info',
    component: CourseHome,
    children:[
      {
        path: '',
        component: ManageCourse,
      },
      {
        path: 'info',
        name: 'info',
        component: ManageCourse,
      },
      {
        path: 'edit',
        name: 'edit',
        component: EditCourseInfo
      },
      {
        path: 'teachers',
        name: 'teachers',
        component: TeacherList
      },
      {
        path: 'tas',
        name: 'tas',
        component: TAList
      },
      {
        path: 'students',
        name: 'students',
        component: ManageStudent
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: ManageTask
      },
      {
        path: 'projects',
        name: 'projects',
        component: ProjectList
      },
      {
        path: 'attendances',
        name: 'attendances',
        component: AttendanceList
      },
      {
        path: 'totalGrades',
        name: 'totalGrades',
        component: ManageGrade
      },
      {
        path: 'partGrades',
        name: 'partGrades',
        component: PartGrade
      },
      // {
      //   path: 'setGrades',
      //   name: 'setGrades',
      //   component: SetGrade
      // },
      {
        path: 'files',
        name: 'files',
        component: ManageFile
      },
      // {
      //   path: 'feedbacks',
      //   name: 'feedbacks',
      //   component: Feedback
      // },
    ],
  },
  {
    path: '/stu/courseInfo/:course_id',
    name: 'StudentCourseHome',
    component: StudentCourseHome,
    redirect:'/stu/courseInfo/:course_id/stuTasks',
    children: [
      {
        path: 'stuTasks',
        name: 'stuTasks',
        component: StudentTask,
        // redirect:'/'
        children:[
          {
            path:'',
            component:StudentProject,
          },
          {
            path:'stuProject',
            name:'stuProject',
            component:StudentProject,
            children:[

            ]
          },
          {
            path:'stuAttendance',
            name:'stuAttendance',
            component: StudentAttendance,
          }
        ]
      },
      {
        path: 'stuFiles',
        name: 'stuFiles',
        component: StudentFile
      },
      {
        path: 'stuStudents',
        name: 'stuStudents',
        component: Student
      },
      {
        path: 'stuGrades',
        name: 'stuGrades',
        component: StudentGrade
      },
    ]
  },
  {
    path: '/stuProjectInfo',
    name:'stuProjectInfo',
    component: StudentProjectInfo
  },
]

const router = new VueRouter({
  routes
})

export default router

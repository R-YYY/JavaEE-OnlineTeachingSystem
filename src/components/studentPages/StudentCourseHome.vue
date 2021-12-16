<template>
  <el-container class="pageContainer">
    <el-header class="pageHeader">
      <h1 class="title">Online Teaching System</h1>
    </el-header>

    <div class="pageMiddle">
      <el-container>
        <img class="courseImg" src="../../../src/assets/course.png" alt="加载失败">
        <span class="courseTitle">
          {{course.name}}<br>Course ID：{{courseID}}
        </span>
        <el-container class="timeArea">
          <el-card class="time">{{ parseInt(date.getHours()/10) }}</el-card>
          <el-card class="time">{{ date.getHours()%10 }}</el-card>
          <span class="colon">:</span>
          <el-card class="time">{{ parseInt(date.getMinutes()/10)}}</el-card>
          <el-card class="time">{{ date.getMinutes()%10}}</el-card>
        </el-container>
      </el-container>
    </div>

    <el-menu class="menu" :default-active="activeIndex" mode="horizontal" background-color="#746ec9" text-color="#fff" active-text-color="#fff">

      <el-menu-item index="1" class="stuOption" @click="toTask">
        <span>Task</span>
      </el-menu-item>

      <el-menu-item index="2" class="stuOption" @click="toFile">
        <span>Course Material</span>
      </el-menu-item>

      <el-menu-item index="3" class="stuOption" @click="toStudent">
        <span>Student List</span>
      </el-menu-item>

      <el-menu-item index="4" class="stuOption" @click="toGrade">
        <span>Grade</span>
      </el-menu-item>

    </el-menu>

    <el-container>
      <div class="courseShow-box">
        <div class="courseShow" >
          <router-view></router-view>
        </div>
      </div>

      <div class="courseInfoArea">
        <el-card class="courseInfo" shadow="never">
          <div slot="header">
            <span style="font-size: 20px">Teacher</span>
          </div>

          <el-card shadow="hover" v-for="info in teacher_list" style="margin-bottom: 14px">
            <p>Name：{{info.name}}</p>
            <p>E-mail: {{info.email}}</p>
          </el-card>
        </el-card>


        <el-card class="courseInfo" shadow="never">
          <div slot="header">
            <span style="font-size: 20px">Course Information</span>
          </div>
          <div>
            <p>{{course.description}}</p>
          </div>
        </el-card>
      </div>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "StudentCourseHome",
  data(){
    return {
      date:new Date(),
      courseID: '420244',
      student_ID:window.sessionStorage.getItem("account_ID"),
      activeIndex: '',
      teacher_list:[],
      course : {},
    }
  },
  methods:{
    toTask(){
      this.$router.push({name:'stuTasks'})
    },
    toFile(){
      this.$router.push({name:'stuFiles'})
    },
    toGrade(){
      this.$router.push({name:'stuGrades'})
    },
    toStudent(){
      this.$router.push({name:'stuStudents'})
    },
  },
  mounted() {
    console.log('begin')
    // console.log(this.$route.params.data)
    console.log(this.$refs)
    console.log('end')
    //刷新时保持侧边栏选中
    if (
        this.$route.name === "stuTasks"
    ) {
      this.activeIndex = "1";
    }
    else if (this.$route.name === "stuFiles") {
      this.activeIndex = "2";
    }
    else if (
        this.$route.name === "stuStudents"
    ) {
      this.activeIndex = "3";
    }
    else if (
        this.$route.name === "stuGrades"
    ) {
      this.activeIndex = "4";
    }

    let _this = this;
    // this.$router.push({
    //   name:'stuTasks',
    //   params:{
    //     course_id: this.courseID,
    //   }
    // })
    //创建定时器更新最新时间
    this.timer = setInterval(() => {
      this.date = new Date(); // 修改日期数据
    }, 1000);
    // 获取课程的授课教师列表
    let id=this.courseID;
    console.log(id)
    this.$axios.get(
        '/teach/getTeacherInfoList',{
          params:{
            course_ID:id,
          },
          headers:{
            token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
          }
        }
    ).then(
        (response)=>{
          this.teacher_list=response.data;
          console.log('teacher_list')
          console.log(response.data)
        }
    )
    this.$axios.get(
        '/course/get',{
          params:{
            course_ID:id,
          },
          headers:{
            token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
          }
        }
    ).then((response)=>{
      this.course=response.data;
    })
  },
  beforeDestroy() {
    //清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
</script>

<style scoped>
.pageContainer{
  background-color: whitesmoke;
  /*background-color: white;*/
  height:100%;
  overflow:auto
}

.pageHeader{
  height: 9%;
  background-color: white
}

.pageMiddle{
  width: 100%;
  height: 28%;
  /*background-color: #9189fd*/
  background-image: linear-gradient(to bottom right, rgba(238,130,248,1), rgba(255,255,130,1));
}

.title {
  padding-left: 40px;
  font-size: 35px;
  line-height: 10px;
  text-align: left;
  font-family: "Microsoft YaHei UI Light";
}

.courseImg{
  width: 150px;
  margin-left: 180px;
  margin-top: 15px;
  margin-bottom: 10px;
}

.courseTitle{
  width: 400px;
  color: white;
  font-size: 20px;
  margin-top: 30px;
  margin-left: 50px;
  line-height: 70px;
}

.menu{
  padding-left: 220px;
}

.stuOption{
  font-size: 18px;
  width: 190px;
  text-align: center;
}

.courseInfoArea{
  height: 100%;
  width: 30%
}
.courseShow-box{
  width: 70%;
  /*width: 850px;*/
  /*height: 690px;*/
  /*border:1px solid black;*/
  /*margin-left: 150px;*/
  /*overflow: hidden;*/
}
.courseShow{
  /*width: 850px;*/
  /*height: 650px;*/
  /*overflow: auto;*/
  /*margin-left: 20px;*/
  /*border:1px solid black;*/
}

.courseInfo{
  margin: 30px 120px 20px 20px;
}

.timeArea{
  margin-top: 10px;
  margin-left: 50px;
  margin-bottom: 10px;
}

.time{
  margin-top: 10px;
  margin-left: 10px;
  font-size: 80px;
}

.colon{
  font-size: 90px;
  margin-top: 17px;
  margin-left: 10px;
  margin-right: 0;
  border-width: 0;
  background-color: rgba(0,0,0,0%)
}
.teacher_info{
  /*background: rgba(0,200,0,0.3);*/
  padding: 0 5px;
  border-radius: 5px;
  border: 1px solid rgba(125,125,125,0.5);
  margin:5px 1px;
  font-size: medium;
  font-weight: normal;
}
</style>

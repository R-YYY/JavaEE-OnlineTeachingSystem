<template>
  <div id="StudentProject">
    <div class="box">
      <div class="inner">
        <div class="projectCard" v-for="project in project_list">
          <el-descriptions :title="project.name" :column="2">
            <template slot="extra">
              <router-link :to="{path:`/stuProjectInfo`,query:{course_ID: course_id,name: project.name}}" target="_blank">
                <el-button type="primary" icon="el-icon-edit" plain id="checkButton" size="medium">去完成</el-button>
              </router-link>
            </template>
            <el-descriptions-item label="开始时间">{{project.start_time}}</el-descriptions-item>
            <el-descriptions-item label="截止时间" id="redEndTime">{{project.end_time}}</el-descriptions-item>
            <el-descriptions-item label="发布老师">{{project.teacher_name}}</el-descriptions-item>
          </el-descriptions>
          <el-divider></el-divider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import router from "@/router";

export default {
  data(){
    return{
      project_list:[],
      course_id:this.$route.params.course_id,
    }
  },
  methods:{
  },
  mounted() {
    let id = this.course_id
    // window.alert(id);
    this.$axios.get(
        '/project/getProjectInfoListByCourseId',{
          params: {
            course_ID: id,
          },
          headers:{
            token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
          }
        })
        .then((response)=>{
          this.project_list=response.data
        })
  }
}
</script>

<style scoped>
#StudentProject{
  /*border:2px solid black;*/
  /*height: 400px;*/
  overflow: hidden;
}
.box{
  width: 800px;
  height: 400px;
  /*border: 2px solid red;*/
  overflow: hidden;
}
.inner{
  width: 815px;
  height: 380px;
  overflow: auto;
  padding-right: 10px;
}
.projectCard{
  margin-top: 30px;
  margin-left: 50px;
  margin-right: 50px;
  cursor: context-menu;
}
#redEndTime{
  color: tomato;
}
a{
  text-decoration: none;
  color: #16beb8;
}
a:hover{
  color: white;
}
</style>
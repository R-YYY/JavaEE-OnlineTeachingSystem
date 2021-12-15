<template>
  <div id="StudentGrade">
    <el-tabs class="stuGradeTab" v-model="activeName" @tab-click="handleClick">

      <el-tab-pane name="total">
        <span slot="label" class="paneName"><i class="el-icon-user-solid"></i> 成绩权重</span>
        <TotalGrade v-bind:course_id="course_id"></TotalGrade>
      </el-tab-pane>

      <el-tab-pane name="project">
        <span slot="label" class="paneName"><i class="el-icon-edit-outline"></i> 实验项目成绩</span>
        <ProjectGrade v-bind:course_id="course_id"></ProjectGrade>
      </el-tab-pane>

      <el-tab-pane name="attendance">
        <span slot="label" class="paneName"><i class="el-icon-date"></i> 总成绩</span>
        <AttendanceGrade v-bind:course_id="course_id"></AttendanceGrade>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TotalGrade from "./GradeWeight";
import ProjectGrade from "./ProjectGrade";
import AttendanceGrade from "./TotalGrade";
export default {
  name: "StudentGrade",
  components: {AttendanceGrade, ProjectGrade, TotalGrade},
  data(){
    return{
      activeName:'total',
      course_id: this.$route.params.course_id,
    }
  },
  methods:{
    handleClick(tab, event){
      console.log(tab, event);
    },
  }
}
</script>

<style scoped>
#StudentGrade{
  height: 100%;
  margin-top: 30px;
  margin-left: 250px;
  margin-right: 20px;
  background-color:white;
  cursor: context-menu;
}
.stuGradeTab{
  height: 100%;
  margin:30px 20px;
}
.paneName{
  height: 100%;
  margin: auto 55px;
  font-size: 17px;
}
</style>
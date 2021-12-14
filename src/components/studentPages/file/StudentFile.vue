<template>
  <div id="File">
    <el-tabs class="stuFileTab" v-model="activeName" @tab-click="handleClick">

      <el-tab-pane name="courseFile">
        <span slot="label" class="paneName"><i class="el-icon-document"></i> 课程参考资料</span>
        <CourseFile v-bind:course_id="course_ID"></CourseFile>
      </el-tab-pane>

      <el-tab-pane name="projectFile">
        <span slot="label" class="paneName"><i class="el-icon-notebook-2"></i> 项目参考资料</span>
        <ProjectFile v-bind:course_id="course_ID"></ProjectFile>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CourseFile from "@/components/studentPages/file/CourseFile";
import ProjectFile from "@/components/studentPages/file/ProjectFile";
export default {
  name: "StudentFile",
  components: {ProjectFile, CourseFile},
  data(){
    return{
      activeName:'courseFile',
      course_ID: this.$route.params.course_id,
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
#File{
  height: 100%;
  margin-top: 30px;
  margin-left: 250px;
  margin-right: 20px;
  background-color:white;
}
.stuFileTab{
  height: 100%;
  margin:30px 20px;
}
.paneName{
  height: 100%;
  margin: auto 120px;
  font-size: medium;
}
</style>
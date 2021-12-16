<template>
  <div id="Task">
    <el-tabs class="stuTaskTab" v-model="activeName">

      <el-tab-pane name="project">
        <span slot="label" class="paneName"><i class="el-icon-date"></i> Project</span>
        <StudentProject></StudentProject>
      </el-tab-pane>

      <el-tab-pane name="attendance">
        <span slot="label" class="paneName"><i class="el-icon-location-outline"></i> Attendance</span>
        <StudentAttendance></StudentAttendance>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import StudentProject from "@/components/studentPages/task/StudentProject";
import StudentAttendance from "@/components/studentPages/task/StudentAttendance";
export default {
  name: "StudentTask",
  components:{
    StudentProject,
    StudentAttendance,
  },
  data(){
    return{
      activeName: 'project',
    }
  },
  mounted() {
    // console.log(this.$route.params.course_id+"----stuTask");
  }
}
</script>

<style scoped>
#Task{
  height: 100%;
  margin-top: 30px;
  margin-left: 250px;
  margin-right: 20px;
  background-color:white;
  cursor: context-menu;
}
.stuTaskTab{
  height: 100%;
  margin:30px 20px;
}

.paneName{
  height: 100%;
  margin: auto 120px;
  font-size: 17px;
}
</style>
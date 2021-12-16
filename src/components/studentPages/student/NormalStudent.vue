<template>
  <div id="StudentList">
    <el-table
        :data="student_list"
        stripe style="width: 100%;font-size: 16px">
      <el-table-column
          prop="student_ID"
          label="ID"
          width="200">
      </el-table-column>
      <el-table-column
          prop="name"
          label="Name"
          width="200">
      </el-table-column>
      <el-table-column
          prop="email"
          label="E-mail">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "NormalStudent",
  props:{
    course_id:{
      type: String,
      default: '',
    },
  },
  data(){
    return{
      student_list:[],
    }
  },
  mounted() {
    let that=this
    let id = that.course_id
    // window.alert(id);
    this.$axios.get(
        '/take/getStudentInfoList',{
          params: {
            course_ID: id,
            is_student: 1,
          },
        })
        .then((response)=>{
          that.student_list=response.data
        })
  }
}
</script>

<style scoped>
#StudentList{
  height: 100%;
  margin-left: 30px;
  margin-right: 20px;
  background-color: white;
}
</style>
<template>
  <div id="TAList">
    <el-table
        :data="ta_list"
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
  name: "TA",
  data(){
    return{
      ta_list:[],
    }
  },
  mounted() {
    let that=this
    let id = this.$route.params.course_id;
    this.$axios.get(
        '/take/getStudentInfoList',{
          params: {
            course_ID: id,
            is_student: 0,
          },
          headers:{
            token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
          },
        })
        .then((response)=>{
          that.ta_list=response.data
        })
  }
}
</script>

<style scoped>
#TAList{
  height: 100%;
  margin-left: 30px;
  margin-right: 20px;
  background-color: white;
}
</style>
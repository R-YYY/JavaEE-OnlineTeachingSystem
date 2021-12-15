<template>
  <div id="stuAttendance">
    <el-table
        :data="attendance_list"
        style="width: 100%;padding-left: 50px;font-size: 17px"
        :default-sort = "{prop: 'start_time', order: 'descending'}"
    >
      <el-table-column style="padding-left: 20px;font-size: 17px" prop="start_time"
          label="时间"
          sortable
          width="500">
        <template slot-scope="scope">
          <span class="time">{{ scope.row.start_time }}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <div :class="[{'success':(scope.row.attend_type === '出勤')},
                {'danger':(scope.row.attend_type === '缺勤')},
                {'normal':(scope.row.attend_type === '待考勤')}
                ]"
              @click="btnClick(scope.row.attend_type,scope.row.start_time)">{{ scope.row.attend_type }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "StudentAttendance",
  inject: ['reload'],     //注入依赖
  data(){
    return {
      attendance_list:[],
    }
  },
  mounted(){
    let that=this;
    let id=this.$route.params.course_id;
    let student_id='1951014';
    this.$axios.get('/attend/getAttendInfoList',
        {
          params:{
            course_ID:id,
            student_ID:student_id,
          },
          headers:{
            token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
          }
        }
    ).then(
        (response)=>{
          console.log(response.data);
          that.attendance_list=response.data;
        }
    )
  },
  methods:{
    btnClick(type,start_time) {
      if(type==='出勤'||type==='缺勤'){

      }
      else{
        let data = new FormData();
        let id=this.course_ID;
        let student_id='1951014';
        data.append("course_ID",id);
        console.log(id);
        console.log(start_time);
        console.log(student_id);
        data.append("start_time",start_time);
        data.append("student_ID",student_id);
        this.$axios({
          url:'/attend/addAttend',
          method:"POST",
          data:data,
        })
            .then((response) => {
              console.log(response.data);
              if (response.data === 1) {
                this.$alert('考勤成功！', '', {
                  confirmButtonText: '确定',
                  type: 'success'
                });
                this.reload();    //调用刷新
              } else {
                this.$message({
                  type: "error",
                  message: "已考勤！",
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "考勤失败！请重试！",
              });
            });
      }
    }
  }
}
</script>

<style scoped>
#stuAttendance{
  width: 90%;
  margin-left: 15px;
  margin-bottom: 50px;
}
.time{
  height: 40px;
  margin-top: 8px;
  font-size: 18px;
}
.success{
  float: right;
  margin-right: 120px;
  font-size: 17px;
  color: rgba(50,180,0,0.9);
  border: 1px solid rgba(0,255,0,0.1);
  border-radius: 5px;
  padding: 6px 8px;
  background: rgba(0,200,0,0.08);
}

.danger{
  float: right;
  margin-right: 120px;
  font-size: 17px;
  color: red;
  border: 1px solid rgba(255,0,0,0.1);
  border-radius: 5px;
  padding: 6px 8px;
  background: rgba(255,0,0,0.06);
}
.normal{
  float: right;
  margin-right: 120px;
  font-size: 17px;
  color: rgba(24,207,201,1);
  border: 1px solid rgba(24,207,201,0.1);
  border-radius: 5px;
  padding: 6px 8px;
  background: rgba(24,207,201,0.06);
}

</style>
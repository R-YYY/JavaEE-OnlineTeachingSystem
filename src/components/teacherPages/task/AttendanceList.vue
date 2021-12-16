<template>
  <div>
    <div style="height: 40px"></div>
    <div>
      <el-tabs
        class="attendanceTab"
        type="border-card"
        @tab-click="handleClick"
        value="attendance"
      >
        <el-tab-pane label="发布任务" name="task"> </el-tab-pane>
        <el-tab-pane label="实验项目" name="project"> </el-tab-pane>
        <el-tab-pane label="课程考勤" name="attendance">
          <div style="height: 480px">
            <el-table
              class="attendTable"
              :data="attendList"
              height="480px"
            >
              <el-table-column label="序号" type="index" width="200px">
              </el-table-column>
              <el-table-column
                prop="start_time"
                label="开始时间"
                width="250px"
                sortable
              >
              </el-table-column>
              <el-table-column
                prop="end_time"
                label="结束时间"
                width="250px"
                sortable
              >
              </el-table-column>
              <el-table-column
                  prop="number"
                  label="考勤人数"
                  width="200px"
              ></el-table-column>
              <el-table-column width="150px">
                <template slot-scope="scope">
                <el-button type="text" @click="attendInfo(scope.row)"
                  >查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div>
              <el-drawer
                :title="'考勤开始时间：'+ this.start_time"
                :visible.sync="drawer"
                :direction="direction"
                size="30%"
              >
                <el-table
                    class="attendStuTable"
                    :data="attendStuList"
                    :row-style="{ height: '50px' }"
                    :cell-style="{ padding: '0' }"
                >
                  <el-table-column
                      label="学号"
                      prop="student_ID"
                      width="130px"
                      sortable
                  ></el-table-column>
                  <el-table-column
                      label="姓名"
                      prop="name"
                      width="150px"
                      sortable
                  ></el-table-column>
                  <el-table-column
                      label="考勤状态"
                      prop="attend_state"
                      align="center"
                      width="120px"
                      :filters="[
                  { text: '出勤', value: '出勤' },
                  { text: '缺勤', value: '缺勤' },]"
                      :filter-method="filterAttend">
                    <template slot-scope="scope">
                      <el-tag
                          :type="scope.row.attend_state === '出勤' ? 'success' : 'danger' "
                          disable-transitions>
                        {{ scope.row.attend_state }}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </el-drawer>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "AttendanceList",
  data() {
    return {
      drawer: false,
      direction: "ltr",
      start_time:"",
      attendList: [],
      attendStuList:[],
    };
  },
  methods: {
    handleClick(tab, event) {
      if (tab.index == 0) this.$router.push({ name: "tasks" });
      else if (tab.index == 1) this.$router.push({ name: "projects" });
      else if (tab.index == 2) this.$router.push({ name: "attendances" });
    },

    filterAttend(value, row) {
      return row.attend_state === value;
    },

    attendInfo(row){
      this.start_time = row.start_time
      this.attendStuList = []
      this.$axios({
        url:"/attend/getStuAttendList",
        method:"get",
        params:{
          course_ID:this.$route.params.course_id,
          start_time:this.start_time
        },
        headers: {
          token:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      }).then((response)=>{
        for (let i = 0; i < response.data.length; i++) {
          this.attendStuList.push({
            "student_ID":response.data[i].student_ID,
            "name":response.data[i].name,
            "attend_state":response.data[i].attend_type===null?"缺勤":"出勤"
          })
        }
      }).catch()
      this.drawer=true
    }
  },
  mounted() {
    //调用api加载考勤列表
    this.$axios({
      url: "/attend/getAttendanceInfoList",
      method: "get",
      params: {
        course_ID: this.$route.params.course_id,
      },
      headers: {
        token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
      },
    }).then((response)=>{
      // this.attendList = response.data
      for (let i = 0; i < response.data.length; i++) {
        this.attendList.push({
          start_time: response.data[i].start_time,
          end_time: response.data[i].end_time,
          number: response.data[i].number + "/" + response.data[i].total,
        });
      }
    });
  },
};
</script>

<style scoped>
.attendanceTab {
  height: 100%;
  margin-top: 20px;
  margin-right: 50px;
  margin-left: 40px;
  background-color: white;
}

.attendTable {
  width: 90%;
  margin-left: 80px;
}

.attendStuTable{
  margin-left: 20px;
  width: 400px;
}
</style>

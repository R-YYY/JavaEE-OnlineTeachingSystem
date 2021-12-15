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
              :row-style="{ height: '50px' }"
              :cell-style="{ padding: '0' }"
            >
              <el-table-column label="序号" type="index" width="200px">
              </el-table-column>
              <el-table-column
                prop="start_time"
                label="开始时间"
                width="350px"
                sortable
              >
              </el-table-column>
              <el-table-column
                prop="end_time"
                label="结束时间"
                width="350px"
                sortable
              >
              </el-table-column>
              <el-table-column width="150px">
                <el-button type="text" @click="drawer = true"
                  >查看详情</el-button
                >
              </el-table-column>
            </el-table>
            <div>
              <el-drawer
                title="考勤详情"
                :visible.sync="drawer"
                :direction="direction"
              >
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
      attendList: [],
    };
  },
  methods: {
    handleClick(tab, event) {
      if (tab.index == 0) this.$router.push({ name: "tasks" });
      else if (tab.index == 1) this.$router.push({ name: "projects" });
      else if (tab.index == 2) this.$router.push({ name: "attendances" });
    },
  },
  mounted() {
    //调用api加载考勤列表
    this.$axios({
      url: "/attend/getAttendanceListByCourseId",
      method: "get",
      params: {
        course_ID: this.$route.params.course_id,
      },
      headers: {
        token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
      },
    }).then((response) => {
      this.attendList = response.data;
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
</style>

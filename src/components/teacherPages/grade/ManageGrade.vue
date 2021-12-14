<template>
  <div>
    <div>
      <el-input class="inputProject" placeholder="请输入学生姓名"></el-input>
      <el-button>搜索</el-button>
      <el-button>导出成绩</el-button>
    </div>
    <div>
      <el-tabs
        class="gradeTab"
        active-name="total"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="总成绩" name="total">
          <div style="height: 480px">
            <el-table
              :data="totalGradeList"
              class="totalGradeTable"
              height="470px"
              :row-style="{ height: '50px' }"
              :cell-style="{ padding: '0' }"
            >
              <el-table-column
                prop="student_ID"
                label="学号"
                width="180px"
                sortable
              ></el-table-column>
              <el-table-column
                prop="name"
                label="姓名"
                width="180px"
                sortable
              ></el-table-column>
              <el-table-column
                prop="project_score"
                label="实验成绩"
                width="190px"
                sortable
              ></el-table-column>
              <el-table-column
                prop="attend_score"
                label="考勤成绩"
                width="190px"
                sortable
              ></el-table-column>
              <el-table-column
                prop="total_score"
                label="总成绩"
                width="190px"
                sortable
              ></el-table-column>
              <el-table-column width="140px">
                <el-button type="text">查看详情</el-button>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="单项成绩" name="part"></el-tab-pane>
        <el-tab-pane label="设置成绩权重" name="set"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "ManageGrade",
  data() {
    return {
      totalGradeList: [],
    };
  },
  methods: {
    handleClick(tab) {
      if (tab.index == 0) this.$router.push({ name: "totalGrades" });
      else if (tab.index == 1) this.$router.push({ name: "partGrades" });
      else if (tab.index == 2) this.$router.push({ name: "setGrades" });
    },
  },
  mounted() {
    this.$axios({
      url: "/score/getTotalScore",
      method: "get",
      params: {
        course_ID: this.$route.params.course_id,
      },
    })
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          this.totalGradeList.push({
            student_ID: response.data[i].student_ID,
            name: response.data[i].name,
            project_score: response.data[i].project_score,
            attend_score: response.data[i].attend_score,
            total_score:
              response.data[i].project_score + response.data[i].attend_score,
          });
        }
      })
      .catch();
  },
};
</script>

<style scoped>
.gradeTab {
  height: 100%;
  margin-top: 20px;
  margin-right: 50px;
  margin-left: 40px;
  background-color: white;
}

.inputProject {
  width: 300px;
  margin-left: 40px;
}

.totalGradeTable {
  width: 90%;
  margin-left: 70px;
}
</style>

<template>
  <div>
    <div>
      <el-input class="inputProject" placeholder="Please enter the project's name"></el-input>
      <el-button>Search</el-button>
    </div>
    <div>
      <el-tabs
        class="gradeTab"
        active-name="part"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="Total Grade" name="total"></el-tab-pane>
        <el-tab-pane label="Single Grade" name="part" style="overflow: auto">
          <div class="gradeShow">
            <el-collapse>
              <el-card class="gradeCard">
                <el-collapse-item>
                  <template slot="title">
                    <span style="font-size: 20px"><b>Experiment</b></span>
                  </template>
                  <el-table
                    :data="projectInfoList"
                    border
                    :row-style="{ height: '50px' }"
                    :cell-style="{ padding: '0' }"
                  >
                    <el-table-column
                      label="Name"
                      prop="project_name"
                      width="400px"
                    ></el-table-column>
                    <el-table-column
                      label="Average Grade"
                      prop="avg_score"
                      width="150px"
                      sortable
                    ></el-table-column>
                    <el-table-column
                      label="Lowest Grade"
                      prop="min_score"
                      width="150px"
                      sortable
                    ></el-table-column>
                    <el-table-column
                      label="Highest Grade"
                      prop="max_score"
                      width="150px"
                      sortable
                    ></el-table-column>
                    <el-table-column align="center">
                      <el-button type="text">Details</el-button>
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-card>
              <el-card class="gradeCard">
                <el-collapse-item>
                  <template slot="title">
                    <span style="font-size: 20px"><b>Attendance</b></span>
                  </template>
                  <el-table
                      :data="attendanceInfoList"
                      border
                      :row-style="{ height: '50px' }"
                      :cell-style="{ padding: '0' }">
                    <el-table-column
                      type="index"
                      label="Index"
                      width="150px"
                    ></el-table-column>
                    <el-table-column
                      prop="start_time"
                      label="Start Time"
                      width="250px"
                      sortable
                    ></el-table-column>
                    <el-table-column
                      prop="end_time"
                      label="End Time"
                      width="250px"
                    ></el-table-column>
                    <el-table-column
                      prop="number"
                      label="Attended Num"
                      width="200px"
                    ></el-table-column>
                    <el-table-column align="center">
                      <el-button type="text">Details</el-button>
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-card>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Set Grade Weighting" name="set"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "PartGrade",
  data() {
    return {
      projectInfoList: [],
      attendanceInfoList: [],
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
    //实验成绩
    this.$axios({
      url: "/score/getProjectScoreInfoList",
      method: "get",
      params: {
        course_ID: this.$route.params.course_id,
      },
      headers: {
        token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
      },
    })
      .then((response) => {
        this.projectInfoList = response.data;
      })
      .catch();
    //考勤信息
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
    }).then((response) => {
      console.log(response.data);
      for (let i = 0; i < response.data.length; i++) {
        this.attendanceInfoList.push({
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

.gradeShow {
  margin-left: 50px;
  margin-right: 50px;
  margin-top: 30px;
  height: 450px;
}

.gradeCard {
  margin-bottom: 20px;
}
</style>

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
                      label="Lowest"
                      prop="min_score"
                      width="150px"
                      sortable
                    ></el-table-column>
                    <el-table-column
                      label="Highest"
                      prop="max_score"
                      width="150px"
                      sortable
                    ></el-table-column>
                    <el-table-column align="center">
                      <template slot-scope="scope">
                        <el-button type="text" @click="checkProject(scope.row)">Details</el-button>
                      </template>
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
                      label="Attendance Number"
                      width="200px"
                    ></el-table-column>
                    <el-table-column align="center">
                      <template slot-scope="scope">
                        <el-button type="text" @click="attendInfo(scope.row)">Details</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-card>
            </el-collapse>
          </div>
        </el-tab-pane>

        <!--实验分数-->
        <el-drawer
            :title="'Project Name：' + projectName"
            :visible.sync="scoreVisible"
            :direction="direction"
            size="25%"
        >
          <el-table
              class="projectScoreTable"
              :data="scoreList"
              :row-style="{ height: '50px' }"
              :cell-style="{ padding: '0' }"
          >
            <el-table-column
                label="ID"
                prop="student_ID"
                width="100px"
                sortable
            ></el-table-column>
            <el-table-column
                label="Name"
                prop="name"
                width="120px"
                sortable
            ></el-table-column>
            <el-table-column
                label="Grade"
                prop="score"
                width="100px"
                sortable
            ></el-table-column>
          </el-table>
        </el-drawer>

        <!--考勤信息-->
        <el-drawer
            :title="'Attendance start time：'+ this.start_time"
            :visible.sync="attendVisible"
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
                label="ID"
                prop="student_ID"
                width="130px"
                sortable
            ></el-table-column>
            <el-table-column
                label="Name"
                prop="name"
                width="150px"
                sortable
            ></el-table-column>
            <el-table-column
                label="Status"
                prop="attend_state"
                align="center"
                width="120px"
                :filters="[
                  { text: 'Attended', value: 'Attended' },
                  { text: 'Absent', value: 'Absent' },]"
                :filter-method="filterAttend">
              <template slot-scope="scope">
                <el-tag
                    :type="scope.row.attend_state === 'Attended' ? 'success' : 'danger' "
                    disable-transitions>
                  {{ scope.row.attend_state }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-drawer>
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
      attendStuList:[],
      scoreVisible:false,
      attendVisible:false,
      direction:"ltr",
      projectName:"",
      scoreList:[]
    };
  },
  methods: {
    handleClick(tab) {
      if (tab.index == 0) this.$router.push({ name: "totalGrades" });
      else if (tab.index == 1) this.$router.push({ name: "partGrades" });
    },

    checkProject(row){
      this.projectName = row.project_name
      this.scoreList = [];
      this.$axios({
        url: "/report/getTotalReport",
        method: "get",
        params: {
          course_ID: this.$route.params.course_id,
          project_name: row.project_name,
        },
        headers: {
          token:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
          .then((response) => {
            console.log(response.data);
            for (let i = 0; i < response.data.length; i++) {
              this.scoreList.push({
                student_ID: response.data[i].student_ID,
                name: response.data[i].name,
                score: response.data[i].score === null? 0:response.data[i].score,
              });
            }
            // this.reportList = response.data;
          })
          .catch();
      this.scoreVisible = true;
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
            "attend_state":response.data[i].attend_type===null?"Absent":"Absent"
          })
        }
      }).catch()
      this.attendVisible=true
    }
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

.projectScoreTable{
  margin-left: 30px;
  width: 320px;
}

.attendStuTable{
  margin-left: 20px;
  width: 400px;
}
</style>

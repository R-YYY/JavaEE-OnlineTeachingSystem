<template>
  <div>
    <div>
      <el-input class="inputProject" placeholder="Please enter the student's name"></el-input>
      <el-button>Search</el-button>
    </div>
    <div>
      <el-tabs
        class="gradeTab"
        active-name="total"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="Total Grade" name="total">
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
                label="ID"
                width="180px"
                sortable
              ></el-table-column>
              <el-table-column
                prop="name"
                label="Name"
                width="180px"
                sortable
              ></el-table-column>
              <el-table-column
                prop="project_score"
                label="Project Grade"
                width="190px"
                sortable
              ></el-table-column>
              <el-table-column
                prop="attend_score"
                label="Attendance Grade"
                width="190px"
                sortable
              ></el-table-column>
              <el-table-column
                prop="total_score"
                label="Total Grade"
                width="190px"
                sortable
              ></el-table-column>
              <el-table-column width="140px">
                <template slot-scope="scope">
                  <el-button type="text" @click="scoreInfo(scope.row)">Details</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Single Grade" name="part"></el-tab-pane>
        <el-dialog
            :title="stuName + ' Score Information'"
            :visible.sync="scoreVisible">
          <el-table class="totalTable"
                    :data="stuScore[0]"
                    border
                    show-summary
                    :summary-method="totalScore1">
            <el-table-column label="Project Name" prop="name"></el-table-column>
            <el-table-column label="Grade" align="center">
              <template slot-scope="scope"><span>{{scope.row.score === null?'0/100':scope.row.score+'/100'}}</span></template>
            </el-table-column>
          </el-table>
          <el-table class="totalTable"
                    :data="stuScore[1]"
                    border
                    show-summary
                    :summary-method="totalScore2">
            <el-table-column label="Attendance start time" prop="name"></el-table-column>
            <el-table-column label="Grade" align="center">
              <template slot-scope="scope"><span>{{scope.row.score === null?'0/1':'1/1'}}</span></template>
            </el-table-column>
          </el-table>
        </el-dialog>
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
      scoreVisible:false,
      stuScore:[{
        name:"",
        score:""
      },{
        name:"",
        score:""
      }],
      stuName:"",
    };
  },
  methods: {
    handleClick(tab) {
      if (tab.index == 0) this.$router.push({ name: "totalGrades" });
      else if (tab.index == 1) this.$router.push({ name: "partGrades" });
    },

    totalScore1(param){
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'Total Score';
        }
        else{
          let total = 0
          for (let i = 0; i < this.stuScore[0].length; i++) {
            total += this.stuScore[0][i].score === null?0:parseInt(this.stuScore[0][i].score)
          }
          sums[index] = total
        }
      });
      return sums;
    },

    totalScore2(param){
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总分';
        }
        else{
          let total = 0
          for (let i = 0; i < this.stuScore[1].length; i++) {
            total += this.stuScore[1][i].score === null?0:1
          }
          sums[index] = total
        }
      });
      return sums;
    },

    scoreInfo(row){
      this.stuName = row.name
      this.scoreVisible=true
      this.$axios({
        url:"/score/getStuTotalScore",
        method:"get",
        params:{
          course_ID:this.$route.params.course_id,
          student_ID:row.student_ID
        },
        headers: {
          token:window.sessionStorage.getItem("token"),
        },
      }).then((response)=>{
        console.log(response.data)
        this.stuScore = response.data
      })
    }
  },
  mounted() {
    this.$axios({
      url: "/score/getTotalScore",
      method: "get",
      params: {
        course_ID: this.$route.params.course_id,
      },
      headers: {
        token:window.sessionStorage.getItem("token"),
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

.totalTable{
  width: 600px;
  margin-left: 50px;
  margin-bottom: 50px;
}
</style>

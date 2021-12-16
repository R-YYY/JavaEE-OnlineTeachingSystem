<template>
  <div>
    <div>
      <el-input
        class="searchProject"
        v-model="input"
        placeholder="Please enter the project's name"
        @input="searchProject"
      >
      </el-input>
      <el-button type="primary" @click="searchProject">
        <span>Search</span>
      </el-button>
    </div>
    <div>
      <el-tabs
        class="projectTab"
        type="border-card"
        @tab-click="handleClick"
        value="project"
      >
        <el-tab-pane label="Release Task" name="task"> </el-tab-pane>
        <el-tab-pane label="Project" name="project">
          <!--实验信息卡片列表-->
          <div class="projectArea">
            <el-row>
              <el-col
                :span="7.5"
                v-for="item in tmpList"
                :key="item.project_ID"
                :offest="1"
              >
                <div class="eachProject">
                  <el-card class="projectCard">
                    <div slot="header" class="projectName">
                      <span>Name：{{ item.name }}</span>
                    </div>
                    <div class="projectDes">
                      <p>Releaser：{{ item.teacher_name }}</p>
                      <p>Released Time：{{ item.start_time }}</p>
                      <p>Deadline：{{ item.end_time }}</p>
                      <p>实验说明：{{ item.description }}</p>
                    </div>
                    <div>
                      <el-button class="btn" @click="checkReport(item.name)">
                        <span>Submissions</span>
                      </el-button>
                    </div>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </div>

          <!--实验提交情况-->
          <el-drawer
            :visible.sync="reportDialogVisible"
            :direction="direction"
            :with-header="false"
            size="55%"
          >
            <div>
              <el-input
                class="searchReport"
                v-model="input"
                placeholder="Please enter ID/student name/report name"
              >
              </el-input>
              <el-button type="primary">
                <span>Search</span>
              </el-button>
            </div>
            <el-table
              class="reportTable"
              :data="reportList"
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
                label="Status"
                prop="submit_state"
                align="center"
                width="100px"
                :filters="[
                  { text: 'Submitted', value: 'Submitted' },
                  { text: 'Unsubmitted', value: 'Unsubmitted' },
                ]"
                :filter-method="filterSubmit"
              >
                <template slot-scope="scope">
                  <el-tag
                    :type="
                      scope.row.submit_state === 'Submitted' ? 'success' : 'danger'
                    "
                    disable-transitions
                    >{{ scope.row.submit_state }}</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label="Submit Content" sortable width="230px" align="center"
                ><template slot-scope="scope">
                  <el-tooltip content="Click to download" placement="top">
                    <a class="reportSrc" @click="downloadReport(scope.row)">
                      {{ scope.row.report_name }}</a>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                label="Correction Status"
                prop="correct_state"
                align="center"
                width="90px"
                :filters="[
                  { text: 'Marked', value: 'Marked' },
                  { text: 'Unmarked', value: 'Unmarked' },
                ]"
                :filter-method="filterCorrect"
              >
                <template slot-scope="scope">
                  <el-tag
                    :type="
                      scope.row.correct_state === 'Marked'
                        ? 'success'
                        : 'danger'
                    "
                    v-if="scope.row.submit_state === 'Submitted'"
                    disable-transitions
                    >{{ scope.row.correct_state }}</el-tag
                  >
                </template>
              </el-table-column>
              <el-table-column label="Grade" width="85px" align="center">
                <template slot-scope="scope">
                  <span
                    v-if="
                      scope.row.is_correct === false &&
                      scope.row.submit_state === 'Submitted'
                    "
                    >{{ scope.row.score + " / 100" }}</span>
                  <input
                      v-model="inputScore"
                      class="inputScore"
                      v-if="scope.row.is_correct === true">
                  </input>
                </template>
              </el-table-column>
              <el-table-column label="Operation" width="90px" align="right">
                <template
                  slot-scope="scope"
                  v-if="scope.row.submit_state === 'Submitted'"
                >
                  <el-button
                    class="checkReport"
                    type="text"
                    v-if="scope.row.is_correct === false"
                    @click="scope.row.is_correct = true"
                    >Mark
                  </el-button>
                  <el-button
                    class="checkReport"
                    type="text"
                    v-if="scope.row.is_correct === true"
                    @click="correctReport(scope.row)"
                    >Confirm
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-drawer>
        </el-tab-pane>
        <el-tab-pane label="Attendance" name="attendance"> </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectList",
  data() {
    return {
      input: "",
      projectList: [],
      tmpList: [],
      reportList: [],
      projectInfo:{
        name:"",
        start_time:"",
        end_time:"",
        description:""
      },
      projectName: "",
      direction: "ltr",
      inputScore: "",
      reportDialogVisible: false,
      infoDialogVisible: false,
    };
  },
  methods: {
    handleClick(tab, event) {
      if (tab.index == 0) this.$router.push({ name: "tasks" });
      else if (tab.index == 1) this.$router.push({ name: "projects" });
      else if (tab.index == 2) this.$router.push({ name: "attendances" });
    },

    //根据输入名称在卡片列表中搜索
    searchProject() {
      if (this.input === "") this.tmpList = this.projectList;
      else {
        this.tmpList = [];
        for (let t in this.projectList) {
          if (this.projectList[t].name.indexOf(this.input) !== -1) {
            this.tmpList.push(this.projectList[t]);
          }
        }
      }
    },

    //查看实验报告
    checkReport(data) {
      this.projectName = data;
      this.reportList = [];
      this.$axios({
        url: "/report/getTotalReport",
        method: "get",
        params: {
          course_ID: this.$route.params.course_id,
          project_name: data,
        },
        headers: {
          token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
        .then((response) => {
          console.log(response.data);
          for (let i = 0; i < response.data.length; i++) {
            this.reportList.push({
              student_ID: response.data[i].student_ID,
              name: response.data[i].name,
              submit_state:
                response.data[i].submit_time === null ? "Unsubmitted" : "Submitted",
              report_name: response.data[i].report_name,
              correct_state:
                response.data[i].correct_time === null ? "Unmarked" : "Marked",
              score: response.data[i].score,
              is_correct: false,
            });
          }
          // this.reportList = response.data;
        })
        .catch();
      this.reportDialogVisible = true;
    },

    filterCorrect(value, row) {
      return row.correct_state === value;
    },

    filterSubmit(value, row) {
      return row.submit_state === value;
    },

    async correctReport(row) {
      if (
        this.inputScore < 0 ||
        this.inputScore > 100 ||
        this.inputScore.split(".").length > 1
      ) {
        this.$message({
          type: "error",
          message: "Please enter an integer(0~100)",
        });
        return;
      }
      let data = new FormData();
      data.append("course_ID", this.$route.params.course_id);
      data.append("project_name", this.projectName);
      data.append("student_ID", row.student_ID);
      data.append("score", this.inputScore);
      await this.$axios({
        url: "/report/correct",
        method: "post",
        data: data,
        headers: {
          token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
        .then((response) => {
          if (response.data === 1) {
            row.score = this.inputScore;
            this.inputScore = "";
            this.$message({
              type: "success",
              message: "Successful！",
            });
          } else {
            this.$message({
              type: "error",
              message: "Fail to mark! Please try again!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "Fail to mark! Please try again!",
          });
        });
      row.is_correct = false;
    },

    downloadReport(row){
      let data = new FormData()
      data.append("course_ID",this.$route.params.course_id)
      data.append("project_name",this.projectName)
      data.append("report_name",row.report_name)
      this.$axios({
        url:"/file/downloadReport",
        method:"post",
        data:data,
        headers: {
          token:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      }).then((response)=>{
        let blob = new Blob([response.data]);
        const disposition = response.headers["content-disposition"];
        //获得文件名
        let fileName = disposition.substring(
            disposition.indexOf("filename=") + 9,
            disposition.length
        );
        //解码
        fileName = decodeURI(fileName);
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          //释放内存
          window.URL.revokeObjectURL(link.href);
        }
      }).catch(()=>{
        this.$message({
          type: "error",
          message: "Fail to download! Please try again！",
        });
      })
    }
  },

  mounted() {
    //调用api加载实验列表
    this.$axios({
      url: "/project/getProjectInfoListByCourseId",
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
        this.projectList = response.data;
        this.tmpList = this.projectList;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped>
.projectTab {
  height: 100%;
  margin-top: 20px;
  margin-right: 50px;
  margin-left: 40px;
  background-color: white;
}

.searchProject {
  width: 300px;
  margin-left: 40px;
}

.projectCard {
  height: 350px;
  width: 460px;
}

.btn {
  margin-top: 40px;
  margin-left: 130px;
  margin-right: 50px;
}

.projectArea {
  height: 480px;
  overflow: auto;
}

.eachProject {
  margin: 30px 30px 20px 70px;
}

.projectDes {
  margin-left: 30px;
  font-size: 16px;
}

.projectName {
  margin-left: 30px;
  font-size: 18px;
}

.searchReport {
  width: 300px;
  margin-top: 30px;
  margin-bottom: 30px;
  margin-left: 30px;
}

.reportTable {
  margin-left: 20px;
  width: 800px;
}

.reportSrc {
  text-decoration: underline;
  cursor: pointer;
}

.checkReport {
  margin-left: 20px;
}

.inputScore {
  height: 25px;
  width: 60px;
}

.projectInfo{
  /*margin-left: 50px;*/
}
</style>

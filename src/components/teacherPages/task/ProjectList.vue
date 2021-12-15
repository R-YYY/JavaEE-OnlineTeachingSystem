<template>
  <div>
    <div>
      <el-input
        class="searchProject"
        v-model="input"
        placeholder="请输入项目名称"
        @input="searchProject"
      >
      </el-input>
      <el-button type="primary" @click="searchProject">
        <span>搜索</span>
      </el-button>
    </div>
    <div>
      <el-tabs
        class="projectTab"
        type="border-card"
        @tab-click="handleClick"
        value="project"
      >
        <el-tab-pane label="发布任务" name="task"> </el-tab-pane>
        <el-tab-pane label="实验项目" name="project">
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
                      <span>实验名称：{{ item.name }}</span>
                    </div>
                    <div class="projectDes">
                      <p>发布人：{{ item.teacher_name }}</p>
                      <p>发布时间：{{ item.start_time }}</p>
                      <p>截至时间：{{ item.end_time }}</p>
                    </div>
                    <div>
                      <el-button class="btn" @click="checkProject(item.name)">
                        <span>查看实验信息</span>
                      </el-button>
                      <el-button class="btn" @click="checkReport(item.name)">
                        <span>查看提交情况</span>
                      </el-button>
                    </div>
                  </el-card>
                </div>
              </el-col>
            </el-row>
          </div>

          <!--实验详细信息-->
          <el-dialog :visible.sync="infoDialogVisible"> </el-dialog>

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
                placeholder="请输入学生学号或姓名或报告名称"
              >
              </el-input>
              <el-button type="primary">
                <span>搜索</span>
              </el-button>
            </div>
            <el-table
                class="reportTable"
                :data="reportList"
                :row-style="{ height: '50px' }"
                :cell-style="{ padding: '0' }">
              <el-table-column
                label="学号"
                prop="student_ID"
                width="80px"
                sortable
              ></el-table-column>
              <el-table-column
                label="姓名"
                prop="name"
                width="80px"
                sortable
              ></el-table-column>
              <el-table-column
                label="提交时间"
                prop="submit_time"
                sortable
                width="150px"
              ></el-table-column>
              <el-table-column label="提交报告" sortable width="230px"
                ><template slot-scope="scope">
                <el-tooltip content="点击下载" placement="top">
                  <a class="reportSrc">{{ scope.row.report_name }}</a>
                </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                label="批改状态"
                prop="correct_state"
                align="center"
                width="90px"
                :filters="[
                  { text: '已批改', value: '已批改' },
                  { text: '未批改', value: '未批改' },
                ]"
                :filter-method="filterState"
              >
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.correct_state === '已批改'? 'success':'danger'"
                    disable-transitions
                    >{{ scope.row.correct_state }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="评分" width="85px" align="center" sortable>
                <template slot-scope="scope">
                  <span v-if="scope.row.is_correct===false">{{scope.row.score+" / 100"}}</span>
                  <input v-model="inputScore" class="inputScore" v-if="scope.row.is_correct === true">
                  </input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="70px" align="right">
                <template slot-scope="scope">
                  <el-button
                      class="checkReport"
                      type="text"
                      v-if="scope.row.is_correct===false"
                      @click="scope.row.is_correct=true"
                  >评分
                  </el-button>
                  <el-button
                      class="checkReport"
                      type="text"
                      v-if="scope.row.is_correct===true"
                      @click="correctReport(scope.row)"
                  >确定
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-drawer>
        </el-tab-pane>
        <el-tab-pane label="课程考勤" name="attendance"> </el-tab-pane>
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
      direction: "ltr",
      inputScore:"",
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
              submit_time: response.data[i].submit_time,
              report_name: response.data[i].report_name,
              correct_state:
                response.data[i].correct_time === null ? "未批改" : "已批改",
              score:response.data[i].score,
              is_correct:false
            });
          }
          // this.reportList = response.data;
        })
        .catch();
      this.reportDialogVisible = true;
    },

    //查看实验信息
    checkProject(data) {
      this.infoDialogVisible = true;
    },

    filterState(value, row) {
      return row.correct_state === value;
    },

    correctReport(row){
      if(this.inputScore < 0 || this.inputScore > 100 || this.inputScore%1 !== 0)
        return
      row.is_correct=false
      let data = new FormData()
      data.append("course_ID",this.$route.params.course_id)
      data.append("project_name",this.$route.params)
      this.$axios({
        url:"/report/correct",
        method:"post",
        data:
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
  height: 300px;
  width: 460px;
}

.btn {
  margin-top: 20px;
  margin-left: 50px;
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

.checkReport{
  margin-left: 20px;
}

.inputScore{
  height:25px;
  width: 60px
}
</style>

<template>
  <div>
    <div>
      <el-button class="addStudentBtn" @click="writeStudentID">
        <span>添加学生</span>
      </el-button>
      <el-button>
        <span>导出名单</span>
      </el-button>
    </div>
    <div>
      <el-tabs class="studentTab" type="border-card">
        <el-tab-pane label="课程学生">
          <div style="height: 480px">
            <el-table
              class="memberTable"
              :data="studentList"
              height="470px"
              :row-style="{ height: '50px' }"
              :cell-style="{ padding: '0' }"
            >
              <el-table-column prop="student_ID" label="学号" width="250px">
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="250px">
              </el-table-column>
              <el-table-column prop="email" label="邮箱" width="400px">
              </el-table-column>
              <el-table-column width="120px">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="open(scope.row)"
                  >删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "ManageStudent",
  data() {
    return {
      studentList: [],
      dialogVisible: false,
      addStudentID: "",
    };
  },
  methods: {
    //删除学生的提示，确认后调用api删除学生
    open(row) {
      this.$confirm("此操作将从课程中删除该学生, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteStudent(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //调用api向后端发送删除学生的id
    deleteStudent(data) {
      let studentInfo = new FormData();
      studentInfo.append("student_ID", data.student_ID);
      studentInfo.append("course_ID", this.$route.params.course_id);
      studentInfo.append("is_student", "1");
      this.$axios({
        url: "take/deleteTakeCourse",
        method: "post",
        data: studentInfo,
      })
        .then(() => {
          this.studentList.splice(data, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "删除失败!请重试！",
          });
        });
    },

    //填写添加学生的id并检验
    writeStudentID() {
      this.$prompt("请输入添加学生的学号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\d\d\d\d\d\d\d$/,
        inputErrorMessage: "学号格式不正确",
      })
        .then(({ value }) => {
          this.addStudent(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消添加",
          });
        });
    },

    //调用api，像后端发送添加学生的id
    addStudent(data) {
      let studentInfo = new FormData();
      studentInfo.append("student_ID", data);
      studentInfo.append("course_ID", this.$route.params.course_id);
      studentInfo.append("is_student", "1");
      this.$axios({
        url: "/take/addTakeCourse",
        method: "post",
        data: studentInfo,
      })
        .then((response) => {
          if (response.data === 1) {
            this.loadData();
            this.$message({
              type: "success",
              message: "添加成功！",
            });
          } else if (response.data === -1) {
            this.$message({
              type: "error",
              message: "添加失败！输入学生不存在！",
            });
          } else if (response.data === -3) {
            this.$message({
              type: "error",
              message: "添加失败！该学生已在课程中！",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            type: "error",
            message: "添加失败！请重试!",
          });
        });
    },

    //调用api，加载学生列表
    loadData() {
      this.$axios({
        url: "/take/getStudentInfoList",
        method: "get",
        params: {
          course_ID: this.$route.params.course_id,
          is_student: 1,
        },
      })
        .then((response) => {
          this.studentList = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style scoped>
.studentTab {
  height: 100%;
  margin-top: 20px;
  margin-right: 50px;
  margin-left: 40px;
  background-color: white;
}

.addStudentBtn {
  position: relative;
  margin-left: 40px;
  margin-right: 20px;
}

.memberTable {
  width: 90%;
  margin-left: 60px;
}
</style>

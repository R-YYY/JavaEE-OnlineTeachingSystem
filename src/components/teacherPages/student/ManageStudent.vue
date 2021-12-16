<template>
  <div>
    <div>
      <el-button class="addStudentBtn" @click="writeStudentID">
        <span>Add</span>
      </el-button>
      <el-button>
        <span>Export</span>
      </el-button>
    </div>
    <div>
      <el-tabs class="studentTab" type="border-card">
        <el-tab-pane label="Student List">
          <div style="height: 480px">
            <el-table
              class="memberTable"
              :data="studentList"
              height="470px"
              :row-style="{ height: '50px' }"
              :cell-style="{ padding: '0' }"
            >
              <el-table-column prop="student_ID" label="ID" width="250px">
              </el-table-column>
              <el-table-column prop="name" label="Name" width="250px">
              </el-table-column>
              <el-table-column prop="email" label="E-mail" width="400px">
              </el-table-column>
              <el-table-column width="120px">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="open(scope.row)"
                  >Delete
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
      this.$confirm("You are going to delete this student from the course. Sure to continue?", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          this.deleteStudent(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Deletion cancelled",
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
        headers: {
          token:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
        .then(() => {
          this.studentList.splice(data, 1);
          this.$message({
            type: "success",
            message: "Deleted successfully!",
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "Fail to delete! Please try again!",
          });
        });
    },

    //填写添加学生的id并检验
    writeStudentID() {
      this.$prompt("Please enter the ID", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        inputPattern: /^\d\d\d\d\d\d\d$/,
        inputErrorMessage: "Wrong ID!",
      })
        .then(({ value }) => {
          this.addStudent(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Addition cancelled",
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
        headers: {
          token:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
        .then((response) => {
          if (response.data === 1) {
            this.loadData();
            this.$message({
              type: "success",
              message: "Added successfully!",
            });
          } else if (response.data === -1) {
            this.$message({
              type: "error",
              message: "Fail to add! This student does not exist!",
            });
          } else if (response.data === -3) {
            this.$message({
              type: "error",
              message: "Fail to add! This student has already been in this course!",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            type: "error",
            message: "Fail to add! Please try again!",
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
        headers: {
          token:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
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

<template>
  <div>
    <div>
      <el-button class="btn" @click="writeTeacherID" :disabled="!judge()">
        <span>Add</span>
      </el-button>
    </div>
    <div>
      <el-tabs
        class="teacherTab"
        v-model="activeIndex"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="Course Setting"> </el-tab-pane>
        <el-tab-pane label="Teachers">
          <div>
            <el-table
                class="memberTab"
                :data="teacherList"
                height="480px"
                :row-style="{ height: '50px' }"
                :cell-style="{ padding: '0' }">
              <el-table-column
                class="teacherID"
                prop="teacher_ID"
                label="ID"
                width="250px"
              >
              </el-table-column>
              <el-table-column
                class="name"
                prop="name"
                label="Name"
                width="250px"
              >
              </el-table-column>
              <el-table-column
                class="email"
                prop="email"
                label="E-mail"
                width="400px"
              >
              </el-table-column>
              <el-table-column width="120px">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="open(scope.row)"
                    :disabled="!judge()"
                  >Delete
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Teaching Assistants"> </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "TeacherList",
  data() {
    return {
      activeIndex: "1",
      teacherList: [],
      dialogVisible: false,
      addTeacherID: "",
    };
  },
  methods: {
    handleClick(tab) {
      if (tab.index == 0) this.$router.push({ name: "info" });
      else if (tab.index == 1) this.$router.push({ name: "teachers" });
      else if (tab.index == 2) this.$router.push({ name: "tas" });
    },

    //删除老师的提示，确认后调用api从课程中删除老师
    open(row) {
      this.$confirm("You are going to delete this teacher. Sure to continue?", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          this.deleteTeacher(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Deletion cancelled",
          });
        });
    },

    judge(){
      return window.sessionStorage.getItem("account_ID").length === 5 && window.sessionStorage.getItem("Responsible")
    },

    //调用api向后端传输删除老师的id
    deleteTeacher(data) {
      let teacherInfo = new FormData()
      teacherInfo.append("teacher_ID",data.teacher_ID)
      teacherInfo.append("course_ID",this.$route.params.course_id)
      this.$axios({
        url:"/teach/deleteTeachCourse",
        method:"post",
        data:teacherInfo,
        headers: {
          token:window.sessionStorage.getItem("token"),
        },
      })
        .then((response) => {
          if(response.data === -2){
            this.$message({
              type: "error",
              message: "责任教师不能删除！",
            })
            return
          }
          this.teacherList.splice(data, 1);
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

    //填写老师id并检验
    writeTeacherID() {
      this.$prompt("Please enter the ID", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        inputPattern: /^\d\d\d\d\d\d\d$/,
        inputErrorMessage: "Wrong ID!",
      })
        .then(({ value }) => {
          this.addTeacher(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Addition cancelled",
          });
        });
    },

    //调用api向后端传输添加老师的id
    addTeacher(data) {
      let teacherInfo = new FormData()
      teacherInfo.append("teacher_ID",data)
      teacherInfo.append("course_ID",this.$route.params.course_id)
      this.$axios({
        url:"/teach/addTeachCourse",
        method:"post",
        data:teacherInfo,
        headers: {
          token:window.sessionStorage.getItem("token"),
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
              message: "Fail to add! This teacher does not exist!",
            });
          } else if (response.data === -3) {
            this.$message({
              type: "error",
              message: "Fail to add! This teacher has already been in this course!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "Fail to add! Please try again!",
          });
        });
    },

    //加载老师列表数据
    loadData() {
      this.$axios({
        url:"/teach/getTeacherInfoList",
        method:"get",
        params:{
          course_ID: this.$route.params.course_id,
        },
        headers: {
          token:window.sessionStorage.getItem("token"),
        },
      })
        .then((response) => {
          this.teacherList = response.data;
        })
        .catch();
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style scoped>
.teacherTab {
  height: 100%;
  margin-top: 20px;
  margin-right: 50px;
  margin-left: 40px;
  background-color: white;
}

.btn {
  margin-left: 40px;
  margin-right: 20px;
}

.memberTab {
  width: 90%;
  margin-left: 60px;
  margin-top: 0;
}
</style>

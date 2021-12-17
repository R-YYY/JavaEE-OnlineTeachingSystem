<template>
  <div>
    <div>
      <el-button class="btn" @click="writerTaID" :disabled="!judge()">
        <span>Add</span>
      </el-button>
    </div>
    <div>
      <el-tabs
        class="taTab"
        v-model="activeIndex"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="Course Setting"> </el-tab-pane>
        <el-tab-pane label="Teachers"> </el-tab-pane>
        <el-tab-pane label="Teaching Assistants">
          <div>
            <el-table class="memberTab" :data="taList" height="480px"
                      :row-style="{ height: '50px' }"
                      :cell-style="{ padding: '0' }">
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
                    :disabled="!judge()"
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
  name: "TAList",
  data() {
    return {
      activeIndex: "2",
      taList: [],
      dialogVisible: false,
      addTaID: "",
    };
  },
  methods: {
    handleClick(tab) {
      if (tab.index == 0) this.$router.push({ name: "info" });
      else if (tab.index == 1) this.$router.push({ name: "teachers" });
      else if (tab.index == 2) this.$router.push({ name: "tas" });
    },

    //删除助教的提示，确认后调用api删除助教
    open(row) {
      this.$confirm("You are going to delete this teaching assistant. Sure to continue?", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          this.deleteTa(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Deletion cancelled",
          });
        });
    },

    //调用api向后端发送删除助教的id
    deleteTa(data) {
      let taInfo = new FormData()
      taInfo.append("student_ID",data.student_ID)
      taInfo.append("course_ID",this.$route.params.course_id)
      taInfo.append("is_student","0")
      this.$axios({
        url:"/take/deleteTakeCourse",
        method:"post",
        data:taInfo,
        headers: {
          token:window.sessionStorage.getItem("token"),
        },
      })
        .then(() => {
          this.taList.splice(data, 1);
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

    //填写添加助教的id并检验
    writerTaID() {
      this.$prompt("Please enter the ID", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        inputPattern: /^\d\d\d\d\d\d\d$/,
        inputErrorMessage: "Wrong ID!",
      })
        .then(({ value }) => {
          this.addTa(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Addition cancelled",
          });
        });
    },

    //调用api，向后端发送添加助教的id
    addTa(data) {
      let taInfo = new FormData()
      taInfo.append("student_ID",data)
      taInfo.append("course_ID",this.$route.params.course_id)
      taInfo.append("is_student","0")
      this.$axios({
        url:"/take/addTakeCourse",
        method:"post",
        data:taInfo,
        headers: {
          token:window.sessionStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (response.data === 1) {
            this.loadDate();
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
        .catch(() => {
          this.$message({
            type: "error",
            message: "Fail to add! Please try again!",
          });
        });
    },

    judge(){
      return window.sessionStorage.getItem("account_ID").length === 5 && window.sessionStorage.getItem("Responsible")
    },

    //加载助教列表数据
    loadDate() {
      this.$axios({
        url:"/take/getStudentInfoList",
        method:"get",
        params:{
          course_ID: this.$route.params.course_id,
          is_student: 0,
        },
        headers: {
          token:window.sessionStorage.getItem("token"),
        },
      })
        .then((response) => {
          this.taList = response.data;
        })
        .catch();
    },
  },
  mounted() {
    this.loadDate();
  },
};
</script>

<style scoped>
.taTab {
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

<template>
  <div>
    <div>
      <el-button class="btn" @click="writeTeacherID">
        <span>添加老师</span>
      </el-button>
    </div>
    <div>
      <el-tabs
        class="teacherTab"
        v-model="activeIndex"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="课程设置"> </el-tab-pane>
        <el-tab-pane label="教师团队">
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
                label="工号"
                width="250px"
              >
              </el-table-column>
              <el-table-column
                class="name"
                prop="name"
                label="姓名"
                width="250px"
              >
              </el-table-column>
              <el-table-column
                class="email"
                prop="email"
                label="邮箱"
                width="400px"
              >
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
        <el-tab-pane label="助教团队"> </el-tab-pane>
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
      this.$confirm("此操作将从课程中删除该老师, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteTeacher(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //调用api向后端传输删除老师的id
    deleteTeacher(data) {
      let teacherInfo = new FormData()
      teacherInfo.append("teacher_ID",data.teacher_ID)
      teacherInfo.append("course_ID",this.$route.params.course_id)
      this.$axios({
        url:"/teach/deleteTeachCourse",
        method:"post",
        data:teacherInfo
      })
        .then(() => {
          this.teacherList.splice(data, 1);
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

    //填写老师id并检验
    writeTeacherID() {
      this.$prompt("请输入添加老师的工号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\d\d\d\d\d$/,
        inputErrorMessage: "工号格式不正确",
      })
        .then(({ value }) => {
          this.addTeacher(value);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消添加",
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
        data:teacherInfo
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
              message: "添加失败！输入老师不存在！",
            });
          } else if (response.data === -3) {
            this.$message({
              type: "error",
              message: "添加失败！该老师已在课程中！",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "添加失败！请重试!",
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
        }
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

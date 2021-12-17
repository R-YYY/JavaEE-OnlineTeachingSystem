<template>
  <div>
    <div style="height: 40px"></div>
    <div>
      <el-tabs
        class="taskTab"
        type="border-card"
        @tab-click="handleClick"
        value="task"
      >
        <!--中间的大框框-->
        <el-tab-pane label="Release Task" name="task">
          <el-container style="height: 480px">
            <div class="typeCard" v-if="judge()">
              <!--发布实验卡片-->
              <el-card
                shadow="hover"
                @click.native="projectDialogVisible = true"
                style="cursor: pointer"
              >
                <i class="el-icon-s-cooperation"></i><br />
                <div class="choice1">
                  <p>Release Project</p>
                </div>
              </el-card>
            </div>
            <div class="typeCard">
              <!--发布考勤卡片-->
              <el-card
                shadow="hover"
                @click.native="attendanceDialogVisible = true"
                style="cursor: pointer"
              >
                <i class="el-icon-user-solid"></i><br />
                <div class="choice2">
                  <p>Release Attendance Survey</p>
                </div>
              </el-card>
            </div>
          </el-container>
        </el-tab-pane>
        <el-tab-pane label="Project" name="project"> </el-tab-pane>
        <el-tab-pane label="Attendance" name="attendance"> </el-tab-pane>
      </el-tabs>

      <!--填写实验项目信息-->
      <el-dialog
        title="Release Project"
        :visible.sync="projectDialogVisible"
        width="680px"
      >
        <!--实验信息表单-->
        <el-form
          ref="ProjectInfo"
          :rules="projectRules"
          :model="projectInfo"
          label-width="100px"
        >
          <el-form-item label="Name" prop="name">
            <el-input
              v-model="projectInfo.name"
              autocomplete="off"
              style="width: 530px"
            ></el-input>
          </el-form-item>
          <el-form-item label="Time" required prop="time">
            <el-date-picker
              v-model="projectInfo.time"
              type="datetimerange"
              align="right"
              start-placeholder="Start Time"
              end-placeholder="End Time"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 530px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="Description" prop="description">
            <el-input
              v-model="projectInfo.description"
              autocomplete="off"
              type="textarea"
              :rows="10"
              style="width: 530px"
            ></el-input>
          </el-form-item>
          <el-form-item label="Add File">
            <!--上传文件区域-->
            <el-upload
              ref="projectUploadFile"
              action="#"
              multiple
              :limit="3"
              :auto-upload="false"
              :file-list="projectInfo.fileList"
              :on-change="handleChange"
              :on-exceed="handleExceed"
              :http-request="uploadProjectFile"
            >
              <el-button slot="trigger" size="mini" type="primary"
                >Choose</el-button
              >
              <div slot="tip" class="el-upload__tip">
                Maximum file number:3; maximum file size: 5MB
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="btn_dialog" @click="resetProject">Reset</el-button>
          <el-button class="btn_dialog" @click="projectDialogVisible = false"
            >Save</el-button
          >
          <el-button class="btn_dialog" type="primary" @click="submitProject"
            >Release</el-button
          >
        </div>
      </el-dialog>

      <!--填写考勤信息-->
      <el-dialog
        title="Release Attendance Survey"
        :visible.sync="attendanceDialogVisible"
        width="520px"
        style="margin-top: 100px"
      >
        <div>
          <!--开始时间到结束时间，控件自动检测时间先后-->
          <span style="margin-left: 20px; margin-right: 30px">Time</span>
          <el-time-picker
            is-range
            v-model="attendanceTime"
            range-separator="to"
            start-placeholder="Start Time"
            end-placeholder="End Time"
            placeholder="Choose duration"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-time-picker>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attendanceDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submitAttendance">Confirm</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "ManageTask",
  data() {
    return {
      //实验项目对话框信息
      projectDialogVisible: false, //对话框是否可见
      projectData: new FormData(), //表单提交的数据
      projectInfo: {
        name: "",
        description: "",
        time: "",
        path_number: 0,
        fileList: [],
      },
      projectRules: {
        //实验项目表单验证规则
        name: [{ required: true, message: "Please enter the project's name", trigger: "blur" }],
        time: [
          { required: true, message: "Please enter the project's validation time", trigger: "blur" },
        ],
        description: [
          { required: true, message: "Please enter the description", trigger: "blur" },
        ],
      },

      //考勤对话框信息
      attendanceDialogVisible: false,
      attendanceTime: null,
    };
  },
  methods: {
    handleClick(tab) {
      if (tab.index == 0) this.$router.push({ name: "tasks" });
      else if (tab.index == 1) this.$router.push({ name: "projects" });
      else if (tab.index == 2) this.$router.push({ name: "attendances" });
    },

    judge(){
      return window.sessionStorage.getItem("account_ID").length === 5
    },

    //文件列表改变
    handleChange(file, fileList) {
      this.projectInfo.fileList = fileList;
    },

    //文件列表移除文件
    handleRemove(file, fileList) {
      this.projectInfo.fileList = fileList;
    },

    //文件超出可选范围
    handleExceed(files, fileList) {
      this.$message.warning(
        `File number limit:3; you have selected ${files.length} files，${
          files.length + fileList.length
        } in total`
      );
    },

    //重写el-upload的上传文件方法，将文件添加到FormData中，待上传
    uploadProjectFile(file) {
      this.projectData.append("file", file.file);
    },

    //重置表单
    resetProject() {
      this.$refs.ProjectInfo.resetFields();
      this.projectInfo.fileList = [];
    },

    //提交实验项目信息
    submitProject() {
      this.$refs.ProjectInfo.validate((valid) => {
        if (valid) {
          //添加文件列表
          this.$refs["projectUploadFile"].submit();
          //添加项目描述信息
          this.projectData.append("course_ID", this.$route.params.course_id);
          this.projectData.append("name", this.projectInfo.name);
          this.projectData.append("description", this.projectInfo.description);
          this.projectData.append("start_time", this.projectInfo.time[0]);
          this.projectData.append("end_time", this.projectInfo.time[1]);
          this.projectData.append(
            "path_number",
            this.projectInfo.fileList.length.toString()
          );
          this.projectData.append("teacher_ID", this.store.id);
          //文件和项目信息一起提交
          this.$axios({
            url: "/project/add",
            method: "post",
            data: this.projectData,
            headers: {
              token:window.sessionStorage.getItem("token"),
            },
          })
            .then((response) => {
              //后端更新成功
              if (response.data === 1) {
                this.$message({
                  type: "success",
                  message: "Successful！",
                });
                //重置表单
                this.resetProject();
                this.projectDialogVisible = false;
              }
              //后端更新失败
              else if (response.data === -1) {
                this.$message({
                  type: "error",
                  message: "Fail to release! Please check if the project's name is identical to previous ones!",
                });
              } else if (response.data === -2) {
                this.$message({
                  type: "error",
                  message: "Fail to upload! Please try again!",
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "Fail to release! Please try again!",
              });
            });
        }
      });
      this.projectData = new FormData();
    },

    //调用api提交填写的考勤信息
    submitAttendance() {
      let data = new FormData();
      data.append("course_ID", this.$route.params.course_id);
      data.append("start_time", this.attendanceTime[0]);
      data.append("end_time", this.attendanceTime[1]);
      this.$axios({
        url: "/attend/addAttendance",
        method: "post",
        data: data,
        headers: {
          token:window.sessionStorage.getItem("token"),
        },
      })
        .then((response) => {
          if (response.data === 1) {
            this.attendanceTime = null;
            this.attendanceDialogVisible = false;
            this.$message({
              type: "success",
              message: "Successful",
            });
          } else {
            this.$message({
              type: "error",
              message: "Attendance survey was released before!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "Fail to release! Please try again!",
          });
        });
    },
  },
};
</script>

<style scoped>
.taskTab {
  height: 100%;
  margin-top: 20px;
  margin-right: 50px;
  margin-left: 40px;
  background-color: white;
}

.el-icon-user-solid,
.el-icon-s-cooperation {
  font-size: 180px;
  margin-left: 40px;
}

.choice2 {
  font-size: 20px;
  margin-left: 10px;
}

.choice1 {
  font-size: 20px;
  margin-left: 55px;
}

.typeCard {
  width: 300px;
  border-width: 2px;
  margin-top: 90px;
  margin-left: 170px;
  margin-right: 30px;
}

.btn_dialog {
  margin-right: 5px;
}
</style>

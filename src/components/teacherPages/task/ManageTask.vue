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
        <el-tab-pane label="发布任务" name="task">
          <el-container style="height: 480px">
            <div class="typeCard">
              <!--发布实验卡片-->
              <el-card
                shadow="hover"
                @click.native="projectDialogVisible = true"
                style="cursor: pointer"
              >
                <i class="el-icon-s-cooperation"></i><br />
                <div class="choice">
                  <p>发布实验项目</p>
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
                <div class="choice">
                  <p>发布课程考勤</p>
                </div>
              </el-card>
            </div>
          </el-container>
        </el-tab-pane>
        <el-tab-pane label="实验项目" name="project"> </el-tab-pane>
        <el-tab-pane label="课程考勤" name="attendance"> </el-tab-pane>
      </el-tabs>

      <!--填写实验项目信息-->
      <el-dialog
        title="发布实验项目信息"
        :visible.sync="projectDialogVisible"
        width="680px"
      >
        <!--实验信息表单-->
        <el-form
          ref="ProjectInfo"
          :rules="projectRules"
          :model="projectInfo"
          label-width="80px"
        >
          <el-form-item label="项目名称" prop="name">
            <el-input
              v-model="projectInfo.name"
              autocomplete="off"
              style="width: 550px"
            ></el-input>
          </el-form-item>
          <el-form-item label="有效时间" required prop="time">
            <el-date-picker
              v-model="projectInfo.time"
              type="datetimerange"
              align="right"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 550px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目描述" prop="description">
            <el-input
              v-model="projectInfo.description"
              autocomplete="off"
              type="textarea"
              :rows="10"
              style="width: 550px"
            ></el-input>
          </el-form-item>
          <el-form-item label="附加文件">
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
                >选取文件</el-button
              >
              <div slot="tip" class="el-upload__tip">
                最多上传3个文件，且每个文件大小不超过5MB
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="btn_dialog" @click="resetProject">重置</el-button>
          <el-button class="btn_dialog" @click="projectDialogVisible = false"
            >暂存</el-button
          >
          <el-button class="btn_dialog" type="primary" @click="submitProject"
            >发布</el-button
          >
        </div>
      </el-dialog>

      <!--填写考勤信息-->
      <el-dialog
        title="发布考勤信息"
        :visible.sync="attendanceDialogVisible"
        width="520px"
        style="margin-top: 100px"
      >
        <div>
          <!--开始时间到结束时间，控件自动检测时间先后-->
          <span style="margin-left: 20px; margin-right: 30px">考勤时间</span>
          <el-time-picker
            is-range
            v-model="attendanceTime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-time-picker>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="attendanceDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAttendance">确 定</el-button>
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
        name: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
        time: [
          { required: true, message: "请选择项目有效时间", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请填写项目描述", trigger: "blur" },
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
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
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
          this.projectData.append("teacher_ID", "10100");
          //文件和项目信息一起提交
          this.$axios({
            url: "/project/add",
            method: "post",
            data: this.projectData,
            headers: {
              token:
                "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
            },
          })
            .then((response) => {
              //后端更新成功
              if (response.data === 1) {
                this.$message({
                  type: "success",
                  message: "发布成功！",
                });
                //重置表单
                this.resetProject();
                this.projectDialogVisible = false;
              }
              //后端更新失败
              else if (response.data === -1) {
                this.$message({
                  type: "error",
                  message: "发布失败！请检查实验名是否与往期实验名有重复！",
                });
              } else if (response.data === -2) {
                this.$message({
                  type: "error",
                  message: "文件上传失败！请重试！",
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "发布失败！请重试！",
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
          token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
        .then((response) => {
          if (response.data === 1) {
            this.attendanceTime = null;
            this.attendanceDialogVisible = false;
            this.$message({
              type: "success",
              message: "发布成功！",
            });
          } else {
            this.$message({
              type: "error",
              message: "已发布过此考勤！",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "发布失败！请重试！",
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

.choice {
  font-size: 25px;
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

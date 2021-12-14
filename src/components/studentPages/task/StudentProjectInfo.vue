<template>
  <div id="projectInfo">
    <div class="title">{{project.name}}</div>
    <div class="backButton">
      <el-button type="primary" @click="goBack">返回</el-button>
    </div>
    <div class="end_time">截止时间 : {{project.end_time}}</div>

    <div class="contents">
      <el-card class="description" shadow="never">
        <div slot="header" class="clearfix">
          <span style="font-weight: bolder">实验项目说明 ：</span>
        </div>
        <div class="text item">
          {{project.description}}
        </div>
      </el-card>

      <el-card class="description" shadow="never">
        <div slot="header" class="clearfix">
          <span style="font-weight: bolder">文件 ： </span>
        </div>
        <div class="text item" v-for="i in 4">
          文件{{i}}
        </div>
      </el-card>

      <el-card class="description" shadow="never">
        <div slot="header" class="clearfix">
          <span style="font-weight: bolder">实验报告 ： </span>
        </div>
        <el-button type="primary" icon="el-icon-upload2" plain size="medium" style="float: right">上传</el-button>
        <el-upload
            class="upload-demo"
            action="#"
            ref="upload"
            :auto-upload="false"
            :show-file-list="true"
            :http-request="handleUpload"
            :multiple="false"
            :file-list="fileList"
            :limit="1"
            >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>

          <div slot="tip" class="el-upload__tip">只能上传docx/doc文件，且不超过10Mb</div>
        </el-upload>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentProjectInfo",
  data(){
    return{
      course_ID: this.$route.query.course_ID,
      name: this.$route.query.name,
      project : null,
      fileList: [],
    };
  },
  methods:{
    handleUpload(file) {
      let data = new FormData();
      console.log(this.course_ID);
      console.log(this.project.name);
      data.append("course_ID", this.course_ID);
      data.append("student_ID", '1951014');
      data.append("project_name", this.project.name);
      data.append("file", file.file);
      this.$axios({
        url: "report/add",
        method: "post",
        data: data,
      })
          .then((response) => {
            if (response.data === 1) {
              this.$message({
                type: "success",
                message: file.file.name + " 上传成功！",
              });
              this.fileList.push({
                file_name: file.file.name,
                submit_time: this.getDateYYYYMMddHHMMSS(),
                file_size: Math.ceil((file.file.size * 10) / 1024) / 10 + " KB",
              });
            }
            else {
              this.$message({
                type: "error",
                message: "上传失败！请重试！",
              });
            }
          })
          // .catch(() => {
          //   this.$message({
          //     type: "error",
          //     message: "上传失败！请重试！",
          //   });
          // });
    },
    goBack(){
      this.$router.go(-1);
    },
  },
  mounted() {
    let _this = this
    this.$axios.get(
        'project/get',{
          params:{
            course_ID: this.course_ID,
            name: this.name,
          },
        })
    .then((response => _this.project = response.data))
  }
}
</script>

<style scoped>
#projectInfo{
  width: 1150px;
  height: 700px;
  overflow: hidden;
  margin-top: 25px;
  margin-left: 210px;
  margin-right: 20px;
  padding:5px 10px;
  /*border: 2px solid rgba(0,0,0,0.5);*/
  border-radius: 5px;
}
.contents{
  width: 1200px;
  height: 600px;
  overflow: auto;
}
.backButton{
  margin-left: 60px;
  margin-top: 15px;
  float: left;
}
.title{
  text-align: center;
  font-size: 27px;
  font-weight: bold;
  margin-top: 10px;
}
.end_time{
  float: right;
  margin-right: 75px;
  margin-top: 20px;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: bold;
  font-family: "Microsoft YaHei UI Light";
}
.info{
  margin-top: 20px;
  padding-left: 30px;
  font-size: medium;
}
.file{
  margin-top: 20px;
}
.description{
  width: 90%;
  margin: 40px auto;
}
</style>
<template>
  <div id="projectInfo">
    <div class="title">{{project.name}}</div>
    <div class="backButton">
<!--      <el-button type="primary" @click="goBack">返回</el-button>-->
    </div>
    <div class="end_time">Deadline : {{project.end_time}}</div>

    <div class="contents">
      <el-card class="description" shadow="never">
        <div slot="header" class="clearfix">
          <span style="font-weight: bolder">Description ：</span>
        </div>
        <div class="text item">
          {{project.description}}
        </div>
      </el-card>

      <el-card class="description" shadow="never">
        <div slot="header" class="clearfix">
          <span style="font-weight: bolder">File ： </span>
        </div>
        <div class="text item" v-for="i in 4">
          File{{i}}
        </div>
      </el-card>

      <el-card class="description" shadow="never">
        <div slot="header" class="clearfix">
          <span style="font-weight: bolder">Report ： </span>
        </div>
        <el-upload
            class="upload-demo"
            action="#"
            ref="projectUploadFile"
            :auto-upload="false"
            :show-file-list="true"
            :http-request="handleUpload"
            :multiple="false"
            :file-list="fileList"
            :limit="2"
            >
          <el-button slot="trigger" size="medium" type="primary">Add File</el-button>
          <div slot="tip" class="el-upload__tip">docx/doc/pdf files only (no larger than 10Mb)</div>
          <el-button type="primary" icon="el-icon-upload2"
                     plain size="medium" style="float: right;margin-right: 100px"
                     @click="submit">Submit</el-button>
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
      project : {},
      fileList: [],
    };
  },
  methods:{
    submit(){
      this.$refs["projectUploadFile"].submit();
    },
    handleUpload(file) {
      let data = new FormData();
      // console.log(this.course_ID);
      // console.log(this.project.name);
      data.append("course_ID", this.course_ID);
      data.append("student_ID", '1951014');
      data.append("project_name", this.project.name);
      data.append("file", file.file);
      console.log(file.file);
      if(this.fileList.length>0){
        this.$axios({
          url: "report/update",
          method: "post",
          data: data,
        }).then((response)=>{
          console.log(response.data);
          if (response.data === 1) {
            this.$message({
              type: "success",
              message: file.file.name + " is uploaded successfully!",
            });
            this.fileList[0].file_name=file.file_name;
            this.fileList[0].submit_time=this.getDateYYYYMMddHHMMSS();
            this.fileList[0].file_size=Math.ceil((file.file.size * 10) / 1024) / 10 + " KB";
          }
          else {
            this.$message({
              type: "error",
              message: "Fail to upload! Please try again!",
            });
          }
        }).catch(() => {
              this.$message({
                type: "error",
                message: "Fail to upload! Please try again!",
              });
            });
      }
      else{
        // 第一次上传报告

        this.$axios({
          url: "report/add",
          method: "post",
          data: data,
        }).then((response) => {
              console.log(response.data);
              if (response.data === 1) {
                this.$message({
                  type: "success",
                  message: file.file.name + " is uploaded successfully!",
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
                  message: "Fail to upload! Please try again!",
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "Fail to upload! Please try again!",
              });
            });
      }
    },
    getDateYYYYMMddHHMMSS() {
      const date = new Date();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const strDate = date.getDate().toString().padStart(2, "0");
      const starHours = date.getHours().toString().padStart(2, "0");
      const starMinutes = date.getMinutes().toString().padStart(2, "0");
      const starSeconds = date.getSeconds().toString().padStart(2, "0");
      return `${date.getFullYear()}-${month}-${strDate} ${starHours}:${starMinutes}:${starSeconds}`;
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
          headers:{
            token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
          }
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
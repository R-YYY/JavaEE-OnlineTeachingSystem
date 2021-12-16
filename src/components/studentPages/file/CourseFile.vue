<template>
  <div id="CourseFile">
    <div class="FolderCard" v-for="info in course_files" v-if="show_folderName(info.fileName)">
      <div class="projectName" style="font-size: 18px;">【{{info.folderName}}】</div>
      <div v-for="file in info.fileName" class="fileName" @click="handleDownload(info.folderName,file)">
        {{file}}
      </div>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>

export default {
  name: "CourseFile",
  data(){
    return{
      course_files: [],
    }
  },
    mounted() {
    var id=this.$route.params.course_id;
    this.$axios.get('/file/getDirectoryFiles',{
      params:{
        course_ID:id,
        isProject:0,
      },
      headers:{
        token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
      }
    }).then((response)=>{
      this.course_files=response.data;
    });
  },
  methods: {
    show_folderName(fileName_list){
      if(fileName_list.length>0){
        return true;
      }
      else{
        return false;
      }
    },
    handleChange(val) {
      console.log(val);
    },
    handleDownload(folderName,fileName) {
      var path='/Course Material/'+folderName;
      var id=this.$route.params.course_id;
      let data = new FormData();
      data.append("course_ID", id);
      data.append("path", path);
      data.append("file_name", fileName);
      this.downloadFile(data, fileName);
    },
    downloadFile(data) {
      this.$axios({
        url: "/file/downloadFile",
        method: "post",
        data: data,
        headers:{
          token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
        responseType: "blob",
      }).then((response) => {
        console.log(response.data);
        let blob = new Blob([response.data]);
        console.log(blob);
        var disposition = response.headers["content-disposition"];
        console.log(disposition)
        console.log('hello')
        //获得文件名

        let fileName = disposition.substring(
            disposition.indexOf("filename=") + 9,
            disposition.length
        );
        // console.log(fileName)
        //解码
        fileName = decodeURI(fileName);
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, fileName);
        } else {
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          //释放内存
          window.URL.revokeObjectURL(link.href);
        }
      });
    },
  }
}
</script>

<style scoped>
.FolderCard{
  margin-top: 30px;
  margin-left: 50px;
  margin-right: 50px;
}
.fileName{
  margin-top: 15px;
  margin-left: 30px;
  color: rgba(11,159,250,1);
  cursor: context-menu;
}
.fileName:hover{
  color: rgba(0,0,250,0.6);
}
a:hover{
  text-decoration: none;
}

</style>
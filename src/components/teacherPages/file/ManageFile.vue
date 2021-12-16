<template>
  <div>
    <div>
      <el-container>
        <el-input
          class="inputFileName"
          v-model="input"
          placeholder="Please enter the file name"
        >
        </el-input>
        <el-button>Search</el-button>
        <el-tooltip
          class="item"
          effect="dark"
          content="You can only upload files in the secondary catalogue"
          placement="right"
        >
          <el-upload
            class="uploadFile"
            action="#"
            multiple
            :show-file-list="false"
            :disabled="!showOperation()"
            :http-request="handleUpload"
          >
            <el-button :disabled="!showOperation()">Upload</el-button>

          </el-upload>
        </el-tooltip>
      </el-container>
    </div>
    <div>
      <el-tabs class="fileTab" type="border-card">
        <el-tab-pane label="Course Materials">
          <el-container style="height: 480px">
            <div>
              <div class="pathArea">
                <el-breadcrumb class="filePath" separator="/">
                  <el-breadcrumb-item>{{ courseName }}</el-breadcrumb-item>
                  <el-breadcrumb-item v-for="item in pathArray()">{{item }}</el-breadcrumb-item>
                </el-breadcrumb>
              </div>
              <div>
                <!--文件树区域-->
                <el-card class="fileTree" shadow="never">
                  <el-tree
                    :data="totalFiles"
                    default-expand-all
                    :expand-on-click-node="false"
                    @node-click="handleNodeClick"
                  >
                    <!--树节点-->
                    <span class="treeNode" slot-scope="{ node, data }">
                      <span class="fileName"
                        ><i class="el-icon-folder-opened"></i
                        >{{ node.label }}</span
                      >
                    </span>
                  </el-tree>
                </el-card>
              </div>
            </div>
            <!--文件列表-->
            <div class="fileList">
              <el-table
                :data="fileList"
                height="450px"
                :row-style="{ height: '50px' }"
                :cell-style="{ padding: '0' }"
              >
                <el-table-column
                  prop="file_name"
                  sortable
                  label="Name"
                  width="300px"
                >
                </el-table-column>
                <el-table-column
                  prop="submit_time"
                  label="Upload Time"
                  width="180px"
                  sortable
                >
                </el-table-column>
                <el-table-column
                  prop="file_size"
                  label="Size"
                  width="100px"
                  sortable
                >
                </el-table-column>
                <el-table-column width="180px" label="Operation" align="center">
                  <template slot-scope="scope">
                    <el-button
                        type="text"
                        v-if="!showOperation()"
                        @click="showFiles(scope.row)"
                    >
                      Open
                    </el-button>
                    <el-button
                        type="text"
                        v-if="showOperation()"
                        style="margin-right: 20px"
                        @click="handleDownload(scope.row)"
                    >
                      Download
                    </el-button>
                    <el-button
                        type="text"
                        v-if="showOperation()"
                        @click="handleDelete(scope.row)"
                    >Delete
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "ManageFile",
  data() {
    return {
      input: "",
      courseName: "",
      filePath: "/Course Materials",
      fileList: [],
      totalFiles: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    pathArray() {
      return this.filePath.split("/").slice(1);
    },

    handleNodeClick(data, node) {
      let route = [];
      while (node.parent !== null) {
        route.push(node.label);
        node = node.parent;
      }
      this.filePath = "";
      for (let i = route.length - 1; i >= 0; i--) {
        this.filePath = this.filePath + "/" + route[i];
      }
    },

    showFiles(row) {
      this.filePath = this.filePath + "/" + row.file_name;
    },

    showOperation() {
      return this.filePath.split("/").length >= 3;
    },

    childrenFiles(data) {
      let result = [];
      for (let i = 0; i < data.length; i++) {
        result.push({
          label: data[i],
        });
      }
      return result;
    },

    handleUpload(file) {
      this.$message({
        type: "danger",
        message: file.file.name + " Upload？",
      });
      let data = new FormData();
      data.append("course_ID", this.$route.params.course_id);
      data.append("path", this.filePath);
      data.append("file", file.file);
      this.$axios({
        url: "file/uploadFile",
        method: "post",
        data: data,
        headers: {
          token:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
        .then((response) => {
          console.log(response.data);
          if (response.data === 1) {
            this.$message({
              type: "success",
              message: file.file.name + " Successful！",
            });
            this.fileList.push({
              file_name: file.file.name,
              submit_time: this.getDateYYYYMMddHHMMSS(),
              file_size: Math.ceil((file.file.size * 10) / 1024) / 10 + " KB",
            });
          } else {
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

    handleDelete(row) {
      let data = new FormData();
      data.append("course_ID", this.$route.params.course_id);
      data.append("path", this.filePath);
      data.append("file_name", row.file_name);
      this.deleteFile(data);
    },

    deleteFile(data) {
      this.$axios({
        url: "/file/deleteFile",
        method: "post",
        data: data,
        headers: {
          token:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
        .then((response) => {
          if (response.data === 1) {
            this.fileList.splice(data, 1);
            this.$message({
              type: "success",
              message: "Successful!",
            });
          } else {
            this.$message({
              type: "error",
              message: "Fail to delete! Please try again!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "Fail to delete! Please try again!",
          });
        });
    },

    handleDownload(row) {
      let data = new FormData();
      data.append("course_ID", this.$route.params.course_id);
      data.append("path", this.filePath);
      data.append("file_name", row.file_name);
      this.downloadFile(data, row.file_name);
    },

    downloadFile(data) {
      this.$axios({
        url: "/file/downloadFile",
        method: "post",
        data: data,
        headers: {
          token:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
        responseType: "blob",
      }).then((response) => {
        console.log(response);
        let blob = new Blob([response.data]);
        console.log(blob);
        const disposition = response.headers["content-disposition"];
        //获得文件名
        let fileName = disposition.substring(
          disposition.indexOf("filename=") + 9,
          disposition.length
        );
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
  },
  mounted() {
    //加载课程名
    this.$axios({
      url: "/course/get",
      method: "get",
      params: {
        course_ID: this.$route.params.course_id,
      },
      headers: {
        token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
      },
    })
      .then((response) => {
        this.courseName = response.data.name;
      })
      .catch();

    //加载所有二级文件
    //暂定资料库分为三级，course（projects）-> ×××（实验项目名）文件夹 -> ×××.×××
    this.$axios({
      url: "/file/getTotalFolders",
      method: "get",
      params: {
        course_ID: this.$route.params.course_id,
      },
      headers: {
        token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
      },
    })
      .then((response) => {
        this.totalFiles.push(
          {
            label: "Course Materials",
            children: this.childrenFiles(response.data[0]),
          },
          {
            label: "Experiment Materials",
            children: this.childrenFiles(response.data[1]),
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });

    //默认选中节点
    this.$axios({
      url: "/file/getFileList",
      method: "get",
      params: {
        course_ID: this.$route.params.course_id,
        path: this.filePath,
      },
      headers: {
        token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
      },
    }).then((response) => {
      this.fileList = response.data;
    });
  },
  watch: {
    filePath: function (newVal) {
      this.fileList = [];
      this.$axios({
        url: "/file/getFileList",
        method: "get",
        params: {
          course_ID: this.$route.params.course_id,
          path: newVal,
        },
        headers: {
          token:
              "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
        .then((response) => {
          this.fileList = response.data;
        })
        .catch();
    },
  },
};
</script>

<style scoped>
.fileTab {
  height: 100%;
  margin-top: 20px;
  margin-right: 50px;
  margin-left: 40px;
  background-color: white;
}

.pathArea {
  margin-left: 30px;
  margin-top: 10px;
}

.filePath {
  font-size: 17px;
}

.inputFileName {
  margin-left: 40px;
  width: 300px;
}

.fileTree {
  margin-top: 20px;
  margin-left: 25px;
  margin-right: 50px;
  width: 350px;
  height: 420px;
}

.fileList {
  margin-top: 30px;
  height: 430px;
}

.treeNode {
  font-size: 15px;
}

.uploadFile {
  margin-left: 20px;
}
</style>

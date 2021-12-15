<template>
  <div>
    <div>
      <el-container>
        <el-input
          class="inputFileName"
          v-model="input"
          placeholder="请输入查找文件名称"
        >
        </el-input>
        <el-button>搜索</el-button>
        <el-tooltip
          class="item"
          effect="dark"
          content="仅可在二级目录内上传文件"
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
            <el-button :disabled="!showOperation()">上传文件</el-button>

          </el-upload>
        </el-tooltip>
      </el-container>
    </div>
    <div>
      <el-tabs class="fileTab" type="border-card">
        <el-tab-pane label="课程资料">
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
                  label="文件名"
                  width="300px"
                >
                </el-table-column>
                <el-table-column
                  prop="submit_time"
                  label="上传时间"
                  width="180px"
                  sortable
                >
                </el-table-column>
                <el-table-column
                  prop="file_size"
                  label="文件大小"
                  width="100px"
                  sortable
                >
                </el-table-column>
                <el-table-column width="180px" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                        type="text"
                        v-if="!showOperation()"
                        @click="showFiles(scope.row)"
                    >
                      打开文件夹
                    </el-button>
                    <el-button
                        type="text"
                        v-if="showOperation()"
                        style="margin-right: 20px"
                        @click="handleDownload(scope.row)"
                    >
                      下载文件
                    </el-button>
                    <el-button
                        type="text"
                        v-if="showOperation()"
                        @click="handleDelete(scope.row)"
                    >删除文件
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
      filePath: "/课程资料",
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
        message: file.file.name + " 上传？",
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
              message: file.file.name + " 上传成功！",
            });
            this.fileList.push({
              file_name: file.file.name,
              submit_time: this.getDateYYYYMMddHHMMSS(),
              file_size: Math.ceil((file.file.size * 10) / 1024) / 10 + " KB",
            });
          } else {
            this.$message({
              type: "error",
              message: "上传失败！请重试！",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "上传失败！请重试！",
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
              message: "删除成功!",
            });
          } else {
            this.$message({
              type: "error",
              message: "删除失败!请重试！",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "删除失败!请重试！",
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
            label: "课程资料",
            children: this.childrenFiles(response.data[0]),
          },
          {
            label: "实验资料",
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

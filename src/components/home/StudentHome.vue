<template>
  <div>
    <div class="headStu">
      <div
          class="headDiv"
          style="color: white; font-size: 30px; font-family: 宋体"
      >
        <div class="headLeft">
          <!-- 头像部分 -->
          <div>
            <el-menu
                class="port_box"
                mode="horizontal"
                @select="handleSelect"
                :router="true"
            >
              <el-submenu index="1">
                <template slot="title" class="subtitle">
                  <img src="@/assets/port.png" />
                </template>
                <el-menu-item index="/login">
                  <el-button
                      type="text"
                      icon="el-icon-switch-button"
                      @click="logout()"
                  >
                    Log out
                  </el-button>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
          <!-- 信息 -->
          <div>Hi! {{ name }}</div>
        </div>
        <div class="headRight">
          <div class="headbox1">
            <div style="font-size: 60px">
              {{ courseData.length }}
            </div>
            <div style="font-size: 20px">Courses</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mainStu">
      <div class="mainDiv">
        <el-card class="mainLeft">
          <div class="ing">
            <h2>Current Courses</h2>
            <div class="content">
              <cardList ref="listItem" :dataList="courseData">
                <!-- <el-button @click="formore">查看</el-button> -->
              </cardList>
            </div>
          </div>
          <div class="finish">
            <h2>Courses Finished</h2>
            <div class="content">
              <cardList ref="listItem" :dataList="endCourseData">
                <!-- <el-button @click="formore">查看</el-button> -->
              </cardList>
            </div>
          </div>
        </el-card>
        <!-- 公告板 -->
        <!-- <el-card class="mainRight">????</el-card> -->
      </div>
    </div>
  </div>
</template>

<script>
import cardList from "@/components/cardList.vue";
export default {
  // props: {
  //   cardList: {
  //     type: Array,
  //     default: function () {
  //       return [
  //         {
  //           course_ID: "42024401",
  //           course_name: "rjgc",
  //           teacher_name: "fdfd",
  //           is_student: "0",
  //         },
  //         {
  //           course_ID: "42024401",
  //           course_name: "rjgc",
  //           teacher_name: "fdfd",
  //           is_student: "0",
  //         },
  //       ];
  //     },
  //   },
  // },
  components: {
    cardList,
  },
  data() {
    return {
      account_ID: window.sessionStorage.getItem("account_ID"),
      name: "",
      count: "0",
      currentPage: 1,
      pagesize: 8,
      store: {
        id: "",
      },
      courseData: [],
      endCourseData: [],
    };
  },
  methods: {
    showForm(mes) {
      this.$refs.listItem.recordLocation(mes); //告知卡片列表子组件 要求对本页面的点击事件mes进行定位
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSizeChange(page_size) {
      this.pagesize = page_size;
    },
    handleCurrentChange(current_page) {
      this.currentPage = current_page;
    },
    getName() {
      this.store.id = window.sessionStorage.getItem("account_ID");
      console.log("id:" + this.store.id);
      console.log("token:" + window.sessionStorage.getItem("token"));
      let _this = this;
      this.$axios({
        url: "/student/get",
        method: "get",
        params: {
          student_ID: this.store.id,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      })
          .then(function (res) {
            console.log(res.data);
            _this.name = res.data.name;
          })
          .catch(function (error) {
            console.log("Get Nothing!" + error);
          });
    },
    getCourse() {
      this.store.id = window.sessionStorage.getItem("account_ID");
      let _this = this;
      this.$axios({
        url: "/course/getTotalCourse",
        method: "get",
        params: {
          account_ID: this.store.id,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      })
          .then(function (res) {
            console.log("res.data[0].length:");
            console.log(res.data[0].length);
            _this.courseData = res.data;
          })
          .catch(function (error) {
            console.log("Get Nothing!" + error);
          });
    },
    getEndCourse() {
      this.store.id = window.sessionStorage.getItem("account_ID");
      let _this = this;
      this.$axios({
        url: "/course/getTotalEndCourse",
        method: "get",
        params: {
          account_ID: this.store.id,
        },
        headers: {
          token: window.sessionStorage.getItem("token"),
        },
      })
          .then(function (res) {
            console.log("res.data[0].length:");
            console.log(res.data[0].length);
            _this.endCourseData = res.data;
          })
          .catch(function (error) {
            console.log("Get Nothing!" + error);
          });
    },
    logout() {
      sessionStorage.clear();
      this.$router.push("/login");
      location.reload();
    },
  },
  created() {
    this.getName();
    this.getCourse();
    this.getEndCourse();
  },
  mounted() {
  },
};
</script>

<style scoped>
.headStu {
  height: 260px;
  background-color: #369575;
  display: flex;
  justify-content: center;
  align-items: center;
}
.headDiv {
  width: 80%;
  display: flex;
  justify-content: space-between;
}
.headLeft {
  display: flex;
  align-items: center;
}
.port_box {
  height: 100px;
  width: 150px;
  position: relative;
  background-color: transparent;
}
.port_box.el-menu--horizontal.el-menu {
  /* 去下划线 */
  border-bottom: none;
}
.el-menu--horizontal > .el-submenu /deep/ .el-submenu__title {
  /* 去子菜单标题颜色 */
  height: 100px;
  display: flex;
  align-items: center;
  background-color: transparent !important;
}
.port_box img {
  height: 90px;
  width: 90px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  position: relative;
}
.headRight {
  display: flex;
  align-items: center;
}
.headbox1 {
  text-align: center;
}

.mainStu {
  position: absolute;
  display: flex;
  justify-content: center;
  top: 200px;
  height: 600px;
  width: 100%;
  /* z-index: 2; */
}
.mainDiv {
  width: 80%;
  display: flex;
  justify-content: center;
}
.content {
  width: 1000px;
}
.block {
  margin: 80px;
}
</style>
<template>
  <el-container style="height: 100%">
    <el-header style="height: 10%">
      <h1 class="title">Online Teaching System</h1>
    </el-header>
    <el-container>
      <!--主页侧边栏-->
      <el-aside class="mainAside" width="170px">
        <!--主页侧边栏课程头像-->
        <img
          id="courseImg"
          src="../../../src/assets/course.png"
          alt="加载失败"
        />
        <div>
          <!--主页侧边栏选项卡-->
          <el-menu
            :default-active="activeIndex"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
          >
            <el-menu-item class="option" index="1" @click="toCourse">
              <i class="el-icon-reading"></i>
              <span>COURSE</span>
            </el-menu-item>
            <el-menu-item class="option" index="2" @click="toStudent">
              <i class="el-icon-user"></i>
              <span>STUDENT</span>
            </el-menu-item>
            <el-menu-item class="option" index="3" @click="toTask">
              <i class="el-icon-document-copy"></i>
              <span>TASK</span>
            </el-menu-item>
            <el-menu-item class="option" index="4" @click="toGrade">
              <i class="el-icon-finished"></i>
              <span>GRADE</span>
            </el-menu-item>
            <el-menu-item class="option" index="5" @click="toFile">
              <i class="el-icon-folder-opened"></i>
              <span>FILE</span>
            </el-menu-item>
            <el-menu-item class="option" index="6" @click="toFeedback">
              <i class="el-icon-edit-outline"></i>
              <span>FEEDBACK</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-main style="background-color: #f5f5f5">
        <router-view style="height: 100%"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "CourseHome",
  data() {
    return {
      activeIndex: "",
    };
  },
  methods: {
    toCourse() {
      this.$router.push({ name: "info" });
    },
    toStudent() {
      this.$router.push({ name: "students" });
    },
    toTask() {
      this.$router.push({ name: "tasks" });
    },
    toGrade() {
      this.$router.push({ name: "totalGrades" });
    },
    toFile() {
      this.$router.push({ name: "files" });
    },
    toFeedback() {
      this.$router.push({ name: "feedbacks" });
    },
  },
  mounted() {
    //刷新时保持侧边栏选中
    if (
      this.$route.name === "info" ||
      this.$route.name === "tas" ||
      this.$route.name === "teachers"
    ) {
      this.activeIndex = "1";
    } else if (this.$route.name === "students") {
      this.activeIndex = "2";
    } else if (
      this.$route.name === "tasks" ||
      this.$route.name === "projects" ||
      this.$route.name === "attendances"
    ) {
      this.activeIndex = "3";
    } else if (
      this.$route.name === "totalGrades" ||
      this.$route.name === "partGrades" ||
      this.$route.name === "setGrades"
    ) {
      this.activeIndex = "4";
    } else if (this.$route.name === "files") {
      this.activeIndex = "5";
    } else if (this.$route.name === "feedbacks") {
      this.activeIndex = "6";
    }
  },
};
</script>

<style scoped>
.option {
  width: 170px;
  height: 70px;
  font-size: 17px;
}

#courseImg {
  margin-top: 5px;
  width: 170px;
}

.mainAside {
  text-align: center;
  background-color: #545c64;
}

.title {
  font-size: 35px;
  line-height: 10px;
  text-align: left;
}
</style>

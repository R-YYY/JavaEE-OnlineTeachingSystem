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
              :default-active="activeIndex"
              class="port_box"
              mode="horizontal"
            >
<!--              @select="handleSelect"-->
              <el-submenu class="sub" index="1">
                <template slot="title" class="subtitle">
                  <img src="@/assets/port.png" />
                </template>
                <el-menu-item>
                  <el-button type="text" @click="toset" icon="el-icon-s-tools">
                    账号设置
                  </el-button>
                </el-menu-item>
                <el-menu-item>
                  <el-button
                    type="text"
                    @click="logout"
                    icon="el-icon-switch-button"
                  >
                    安全退出
                  </el-button>
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </div>
          <!-- 信息 -->
          <div>Hi!{{ name }}同学</div>
        </div>
        <div class="headRight">
          <div class="headbox1">
            <div style="font-size: 60px">
              {{ count }}
            </div>
            <div style="font-size: 20px">实验课程/门</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mainStu">
      <div class="mainDiv">
        <el-card class="mainLeft">
          <div class="ing">
            <div class="title">
              <h2>进行中的课程</h2>
            </div>
            <div class="content">
              <div class="course1">课程1</div>
              <div class="course2">课程2</div>
              <div class="course3">课程3</div>
              <div class="course4">课程4</div>
            </div>
          </div>
          <div class="finish"></div>
        </el-card>
        <el-card class="mainRight">????</el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      student_id:window.sessionStorage.getItem("account_ID"),
      name: "刘",
      count: "0",
      activeIndex:'1',
    };
  },
  methods: {
    logout() {
      this.$router.push("/login");
    },
    toset() {
      this.$router.push("/stuinfoset");
    },
  },
  mounted() {
    // console.log(window.sessionStorage.getItem("account_ID"))
    // console.log(window.sessionStorage.getItem("token"))
  }
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
  width: 70%;
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
  /* 去子菜单颜色 */
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
  display: flex;
  justify-content: center;
  top:220px;
  z-index: 2;
}
.mainDiv{
  width: 70%;
  display: flex;
  justify-content: space-between;
}
.mainleft {
  width: 50%;
}
</style>
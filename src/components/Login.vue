<template>
  <div class="login_container">
    <div class="background">
      <img src="../assets/ga.jpg" width="100%" height="100%" alt="" />
    </div>
    <div class="login_box">
      <!-- 头像区 -->
      <!-- <div class="avatar_box">
        <img src="../assets/logo.png" alt="avatar" />
      </div> -->
      <div class="Title">
        <h3>Online Teaching System</h3>
      </div>
      <!-- 登录表单 -->
      <div>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          label-width="75px"
          class="login_form"
        >
          <el-form-item label="Account" prop="id" class="white_Item">
            <el-input
              v-model="loginForm.id"
              placeholder="Please enter your account"
              prefix-icon="iconfont icon-user"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="Password" prop="password" class="white_Item">
            <el-input
              v-model="loginForm.password"
              placeholder="Please enter your password"
              type="password"
              prefix-icon="iconfont icon-3702mima"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="buttons">
            <el-button type="primary" @click="login" class="button1"
              >Login</el-button
            >
            <el-button type="info" @click="resetLoginForm">Reset</el-button>
            <el-button type="register" @click="register">Register</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- <vue-particles
      color="#fff"
      :particleOpacity="0.7"
      :particlesNumver="100"
      shapeType="circle"
      :particleSize="4"
      linesColor="#fff"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :lineDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="false"
      clickMode="push"
      class="lizi"
    >
    </vue-particles> -->
  </div>
</template>

<script>
import Qs from "qs";
export default {
  data() {
    return {
      res: null,
      loginForm: {
        id: "",
        password: "",
      },
      // 表单验证
      loginFormRules: {
        id: [
          { required: true, message: "Please enter your account", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "Length requirement: 2~10 digits",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "Please enter your password", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "Length requirement: 6~18 digits",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 表单重置按钮
    resetLoginForm() {
      // console.log(this)
      // resetFields：element-ui提供的表单方法
      this.$refs.loginFormRef.resetFields();
    },
    register() {
      this.$router.push("/register");
    },
    async login() {
      // 表单预验证
      // valid：bool类型
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return false;
        else this.getloginInfo();
      });
    },
    getloginInfo() {
      let data = new FormData();
      data.append("account_ID", this.loginForm.id);
      data.append("password", this.loginForm.password);
      console.log("传入的" + data);
      this.$axios({
        url: "/account/login",
        method: "post",
        data: data,
      })
        .then((response) => {
          // console.log("传出的" + response.data);
          console.log('register')
          console.log(response.data)
          if (response.data !== "")
            this.$message({
              type: "success",
              message: "Login Successfully !",
            });
          else
            this.$message({
              type: "error",
              message: "Login Failed !",
            });
          window.sessionStorage.setItem("account_ID", response.data[0]);
          window.sessionStorage.setItem("token", response.data[1]);
          if (window.sessionStorage.getItem("account_ID").length == 5)
            this.$router.push("/teacherhome");
          else if (window.sessionStorage.getItem("account_ID").length == 7)
            this.$router.push("/studenthome");
          else if (window.sessionStorage.getItem("account_ID").length == 6)
            this.$router.push("/adminhome");
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    // async getloginInfo() {
    //   const getData = (data1) => {
    //     this.res = data1;
    //   };

    //   await fetch("http://1.117.164.153:8888/account/idMatchPassword", {
    //     method: "POST",
    //     body: JSON.stringify(this.loginForm),
    //     headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((data1) => getData(data1));

    //   console.log(this.res);
    //   if (this.res.code !== 200) return this.$message.error("登录失败");
    //   this.$message.success("登录成功");
    //   console.log(this.res);
    //   // 1、将登陆成功之后的token, 保存到客户端的sessionStorage中; l中ocalStorage是持久化的保存
    //   //   1.1 项目中出现了登录之外的其他API接口，必须在登陆之后才能访问
    //   //   1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
    //   window.sessionStorage.setItem("token", this.res.data.token);
    //   window.sessionStorage.setItem("id", this.res.data.id);1
    //   console.log(window.sessionStorage.setItem + "***");

    //   console.log(window.sessionStorage.getItem("id").length);
    //   if (window.sessionStorage.getItem("id").length == 5)
    //     this.$router.push("/teacherhome");
    //   else if (window.sessionStorage.getItem("id").length == 6)
    //     this.$router.push("/studenthome");
    // },
  },
};
</script>

<style>
/* <style lang="less" scoped> */
/* // lang="less" 支持less格式
    // scoped vue的指令，只在当前组件生效 */
body {
  margin: 0px;
  padding: 0px;
}

.background {
  width: 100%;
  height: 100%; /**宽高100%是为了图片铺满屏幕 */
  z-index: -1;
  position: absolute;
}

.login_box {
  width: 450px;
  height: 360px;
  opacity: 0.9;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  border: 1px solid #d8d2d2;
  box-shadow: 5px 5px 5px #000000;
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  background-color: #414749;

  /* .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  } 貌似又不能嵌套了？？？
  */
}

.Title {
  height: 130px;
  text-align: center;
  line-height: 65px;
  font-size: 30px;
  font-family: SimSun;
  color: white;
}

.login_form {
  position: absolute;
  bottom: 60px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.buttons {
  display: flex;
  justify-content: right;
}

/* .info {
  font-size: 13px;
  margin: 10px 15px;
} */

.white_Item .el-form-item__label {
  color: white;
}
</style>

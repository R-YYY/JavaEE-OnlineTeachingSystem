<template>
  <div>
    <div class="register_background">
      <img
        :src="imgSrc"
        style="width: 100%; height: 100%; display: block"
        alt=""
      />
    </div>
    <div style="height: 120px"></div>
    <el-card>
      <div class="register_box">
        <el-form
          ref="registerForm"
          :model="registerForm"
          :rules="registerFormRules"
          label-width="80px"
          size="medium"
          class="register_form"
        >
          <!-- 账号 -->
          <el-form-item prop="userid" label="Account">
            <el-input
              v-model="registerForm.userid"
              prefix-icon="el-icon-user"
              placeholder="Please enter your account"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password" label="Password">
            <el-input
              v-model="registerForm.password"
              prefix-icon="el-icon-lock"
              type="password"
              show-password
              placeholder="Please enter a password with 6~15 digits, including numbers and characters"
            ></el-input>
          </el-form-item>
          <!-- 确认密码 -->
          <el-form-item prop="rePassword" label="Confirm password">
            <el-input
              v-model="registerForm.rePassword"
              prefix-icon="el-icon-lock"
              type="password"
              class="length"
              show-password
              placeholder="Please enter your password again"
            ></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item
            prop="email"
            label="E-mail"
            style="width: 100%; white-space: nowrap"
            :inline="false"
          >
            <el-input
              v-model="registerForm.email"
              prefix-icon="el-icon-message"
              style="width: 55%"
              placeholder="Please enter your e-mail"
            ></el-input>
            <!-- 发送验证码 -->
            <el-button
              @click="getCode('registerForm')"
              style="width: 40%; float: right"
            >
              <!-- <el-button
                  @click="getCode()"
                  :disabled="!show"
                  style="width: 40%; float: right"
                > -->
              <span>send code</span>
              <!-- <span v-show="show">发送邮箱验证码</span> -->
              <!-- <span v-show="!show" class="count"
                    >{{ count }} s后可点击重发</span
                  > -->
            </el-button>
          </el-form-item>
          <!-- 校验验证码 -->
          <el-form-item prop="code" label="Verification Code">
            <el-input
              v-model="registerForm.code"
              prefix-icon="el-icon-chat-round"
              placeholder="Please enter the verification code"
            ></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item style="margin-right:0;width:100%" align="right">
            <!-- class="btns" -->
            <el-button type="text" @click="toregister"
              >Already have an account? Go logging in!</el-button
            >
            <el-button type="primary" @click="register('registerForm')"
              >Register</el-button
            >
            <el-button type="info" @click="resetregisterForm">Reset</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div style="height: 100px"></div>
  </div>
</template>

<script>
const TIME_COUNT = 60; // 设置一个全局的倒计时的时间
export default {
  data() {
    //在data里面定义两个校验器,检验两次密码是否一致
    var validatePass = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error("The two passwords do not match!"));
      } else {
        callback();
      }
    };
    return {
      count: 0,
      //这是注册表单的数据绑定对象
      registerForm: {
        userid: "",
        password: "",
        rePassword: "",
        email: "",
        code: "",
      },
      //这是表单的验证规则对象
      registerFormRules: {
        //验证账号是否合法
        userid: [
          { required: true, message: "Please enter the account", trigger: "blur" },
          {
            min: 5,
            max: 7,
            message: "Length requirement: 5~7 digits",
            trigger: "blur",
          },
          {
            validator: function (rule, value, callback) {
              if (/(^\d{5,7}$)/.test(value) == false) {
                callback(new Error("Please enter a correct account"));
              } else {
                //校验通过
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        //验证验证码是否合法
        code: [{ required: true, message: "Please enter the verification code", trigger: "blur" }],
        //验证邮箱是否合法
        email: [
          { required: true, message: "Please enter the e-mail", trigger: "blur" },
          {
            min: 1,
            max: 25,
            message: "Length requirement: 1~25 digits",
            trigger: "blur",
          },
          {
            validator: function (rule, value, callback) {
              //校验数字的正则：^[0-9]*$
              if (
                /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(
                  value
                ) == false
              ) {
                callback(new Error("Please enter a correct e-mail"));
              } else {
                //校验通过
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "Please enter the password", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "Length requirement: 6~15 digits",
            trigger: "blur",
          },
          {
            validator: function (rule, value, callback) {
              //校验密码的正则: ^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,15}$
              if (
                /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/.test(value) ==
                false
              ) {
                callback(
                  new Error("Please enter a correct password according to the rule")
                );
              } else {
                //校验通过
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        //确认密码是否正确
        rePassword: [
          { required: true, message: "Confirm the password", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "Length requirement: 6~15 digits",
            trigger: "blur",
          },
          { validator: validatePass, trigger: "blur" },
        ],
      },
      passwordType: "password",
      imgSrc: require("../assets/ga.jpg"),
      radio: "1",
      show: true,
    };
  },
  methods: {
    //跳转到登录界面
    toregister() {
      this.$router.push("/");
    },
    //点击重置按钮，重置登录
    resetregisterForm() {
      this.$refs.registerForm.resetFields();
    },
    //向邮箱发送验证码
    getCode(registerForm) {
      // console.log("eess6@163.com");
      this.$refs[registerForm].validateField("email", (email_check) => {
        if (email_check) return;
        console.log("Verified sucessfully");
        let data = new FormData();
        data.append("account_ID", this.registerForm.userid);
        data.append("email", this.registerForm.email);
        this.$axios({
          url: "/account/sendEmail",
          method: "post",
          data: data,
        })
          .then((response) => {
            console.log(response.data);
            if (response.data === 1) {
              this.$message({
                type: "success",
                message: "Send successfully！",
              });
            } else if (response.data === -1) {
              this.$message({
                type: "error",
                message: "Already registered! Please try again!",
              });
            } else if (response.data === -2) {
              this.$message({
                type: "error",
                message: "Account does not exist! Please try again!",
              });
            } else {
              this.$message({
                type: "error",
                message: "Fail to send! Please try again!",
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: "Fail to send! Please try again!",
            });
          });
      });
      console.log("55555"); //执行
      // 验证码倒计时
      if (!this.timer) {
        this.count = TIME_COUNT;
        this.show = false;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    //注册功能
    register(registerForm) {
      this.$refs[registerForm].validate((valid, wrongstring) => {
        // 获取registerForm的实例（el-form），找到validate方法，根据验证规则rules校验是否valid
        if (valid) {
          let data = new FormData();
          data.append("account_ID", this.registerForm.userid);
          data.append("password", this.registerForm.password);
          data.append("email", this.registerForm.email);
          data.append("code", this.registerForm.code);
          this.$axios({
            url: "/account/register",
            method: "post",
            data: data,
          })
            .then((response) => {
              if (response.data === 1) {
                this.$message({
                  type: "success",
                  message: "Registered successfully！",
                });
                this.$router.push("/");
              } else {
                this.$message({
                  type: "error",
                  message: "Wrong information! Please try again!",
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "Fail to register! Please try again!",
              });
            });
        } else {
          console.log(valid, wrongstring);
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style>
.register_background {
  /* width: 100%; */
  /* height: 100%; */
  z-index: -1;
  /* position: absolute; */
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
}

.register_box {
  background-color: #414749;
  opacity: 0.9;
  border-radius: 5px;
  width: 50%;
  margin-left: 25%;
}
.register_form {
  background-color: #ffffff;
  width: 100%;
  padding: 10px 10px;
  padding-top: 30px;
  margin-bottom: 10px;
  border-radius: 5px;
  align-self: center;
  box-sizing: border-box;
}
.pos {
  position: absolute;
  padding: 10px;
}
</style>
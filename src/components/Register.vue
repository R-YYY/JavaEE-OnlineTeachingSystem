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
          <el-form-item prop="userid" label="账号">
            <el-input
              v-model="registerForm.userid"
              prefix-icon="el-icon-user"
              placeholder="请输入工号/学号"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password" label="密码">
            <el-input
              v-model="registerForm.password"
              prefix-icon="el-icon-lock"
              type="password"
              show-password
              placeholder="请输入6-15位包含字母和数字的密码"
            ></el-input>
          </el-form-item>
          <!-- 确认密码 -->
          <el-form-item prop="rePassword" label="确认密码">
            <el-input
              v-model="registerForm.rePassword"
              prefix-icon="el-icon-lock"
              type="password"
              class="length"
              show-password
              placeholder="请再次输入密码"
            ></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item
            prop="email"
            label="邮箱"
            style="width: 100%; white-space: nowrap"
            :inline="false"
          >
            <el-input
              v-model="registerForm.email"
              prefix-icon="el-icon-message"
              style="width: 55%"
              placeholder="请输入邮箱"
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
              <span>发送邮箱验证码</span>
              <!-- <span v-show="show">发送邮箱验证码</span> -->
              <!-- <span v-show="!show" class="count"
                    >{{ count }} s后可点击重发</span
                  > -->
            </el-button>
          </el-form-item>
          <!-- 校验验证码 -->
          <el-form-item prop="code" label="验证码">
            <el-input
              v-model="registerForm.code"
              prefix-icon="el-icon-chat-round"
              placeholder="请输入验证码"
            ></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item style="margin-right=0;width:100%" align="right">
            <!-- class="btns" -->
            <el-button type="text" @click="toregister"
              >已有账号，去登录</el-button
            >
            <el-button type="primary" @click="register('registerForm')"
              >注册</el-button
            >
            <el-button type="info" @click="resetregisterForm">重置</el-button>
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
        callback(new Error("两次输入密码不一致!"));
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
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 5,
            max: 7,
            message: "长度在 5 到 7 个字符",
            trigger: "blur",
          },
          {
            validator: function (rule, value, callback) {
              if (/(^\d{5,7}$)/.test(value) == false) {
                callback(new Error("请输入正确的账号"));
              } else {
                //校验通过
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        //验证验证码是否合法
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        //验证邮箱是否合法
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 1,
            max: 25,
            message: "长度在 1 到 25 个字符",
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
                callback(new Error("请输入正确的邮箱"));
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
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
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
                  new Error("请输入包含字母和数字的组合，不能使用特殊字符")
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
          { required: true, message: "请再次确认密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
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
        console.log("邮箱验证通过");
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
                message: "发送成功！",
              });
            } else if (response.data === -1) {
              this.$message({
                type: "error",
                message: "学号或工号已注册！请重试",
              });
            } else if (response.data === -2) {
              this.$message({
                type: "error",
                message: "学号或工号不存在！请重试",
              });
            } else {
              this.$message({
                type: "error",
                message: "发送失败！请重试",
              });
            }
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: "发送失败！请重试",
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
                  message: "注册成功！",
                });
                this.$router.push("/");
              } else {
                this.$message({
                  type: "error",
                  message: "填写信息错误！请重试",
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "注册失败！请重试",
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
<template>
  <div class="stulistform">
    <div class="form" style="margin-top: 15px">
      <el-table
        ref="filterTable"
        :data="
          tableData.filter(
            (data) =>
              !search ||
              data.account_ID.toLowerCase().includes(search.toLowerCase())
          ) ||
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        style="width: 100%"
      >
        <!-- 账户id -->
        <el-table-column
          prop="account_ID"
          label="Account ID"
          sortable
          width="150"
          column-key="id"
        >
        </el-table-column>
        <!-- 姓名 -->
        <el-table-column prop="name" label="Name" width="150" column-key="name">
        </el-table-column>
        <!-- 邮箱 -->
        <el-table-column
          prop="email"
          label="E-mail"
          width="200"
          column-key="email"
        >
        </el-table-column>
        <!-- 账户状态 -->
        <el-table-column
          prop="is_active"
          label="Status"
          width="200"
          :filters="[
            { text: 'Activated', value: '0' },
            { text: 'Inactivated', value: '1' },
          ]"
          :filter-method="filterStatus"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.is_active === '0' ? 'primary' : 'success'"
              disable-transitions
            >
              <div v-if="scope.row.is_active != '0'">Activated</div>
              <div v-else>Inactivated</div>
            </el-tag>
          </template>
        </el-table-column>
        <!-- 封禁or激活 -->
        <el-table-column label="Operation" width="150">
          <div slot-scope="scope" v-if="scope.row.is_active != '0'">
            <el-button size="mini" type="danger" @click="ban(scope.row)"
              >Block</el-button
            >
          </div>
          <div v-else>
            <el-button size="mini" type="success" @click="activation(scope.row)"
              >Activate</el-button
            >
          </div>
        </el-table-column>
        <!-- 重置密码 -->
        <el-table-column label="Reset">
          <el-button
            size="mini"
            type="danger"
            @click="startreset(scope.row)"
            slot-scope="scope"
            >Reset Password</el-button
          >
        </el-table-column>
        <!-- 删除账户 -->
        <el-table-column>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            slot-scope="scope"
            @click="startdeleteu(scope.row)"
          ></el-button>
        </el-table-column>
        <!-- 搜索 -->
        <el-table-column align="right">
          <template slot="header" slot-scope="scope">
            <el-input
              @click="handleSearch(scope.row)"
              v-model="search"
              size="mini"
              placeholder="Enter account ID to search"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        align="center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.length"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      currentPage: 1, // 当前页码
      total: 20, // 总条数
      pageSize: 20, // 每页的数据条数
      form: {
        reason: "",
        region: 0,
        delivery: false,
      },
      formLabelWidth: "120px",
      search: "",
    };
  },
  methods: {
    //封禁，封禁接口
    ban(data) {
      console.log(data.account_ID);
      let taInfo = new FormData();
      taInfo.append("account_ID", data.account_ID);
      this.$axios({
        url: "/account/ban",
        method: "post",
        data: taInfo,
        headers: {
          token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
        .then((res) => {
          console.log(res.data);
          if (res.data !== 1)
            this.$message({
              type: "error",
              message: "Fail to block! Please try again!",
            });
          else {
            this.$message({
              type: "success",
              message: "Blocked successfully!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "error!",
          });
        });
      //刷新页面
      this.$router.push({
        path: "/stuempty",
      });
    },
    //激活，激活接口
    activation(data) {
      console.log(data.account_ID);
      let taInfo1 = new FormData();
      taInfo1.append("account_ID", data.account_ID);
      this.$axios({
        url: "/account/active",
        method: "post",
        data: taInfo1,
        headers: {
          token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
        .then((res) => {
          console.log("传出的" + res.data);
          if (res.data !== 1)
            this.$message({
              type: "error",
              message: "Fail to activate! Please try again!",
            });
          else
            this.$message({
              type: "success",
              message: "Activated successfully!",
            });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "error!",
          });
        });
      //刷新页面
      this.$router.push({
        path: "/stuempty",
      });
    },
    //重置密码确认
    startreset(row) {
      this.$confirm("You are going to reset the password of this account as 111111. Sure to continue?", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          this.resetPsd(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Cancelled",
          });
        });
    },
    //重置密码的接口
    resetPsd(data) {
      console.log(data.account_ID);
      let taInfo = new FormData();
      taInfo.append("account_ID", data.account_ID);
      this.$axios({
        url: "/account/resetPassword",
        method: "post",
        data: taInfo,
        headers: {
          token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
        .then((res) => {
          console.log("传出的" + res.data);
          if (res.data !== 1)
            this.$message({
              type: "error",
              message: "Fail to reset! Please try again!",
            });
          else
            this.$message({
              type: "success",
              message: "Resetted successfully!",
            });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "error!",
          });
        });
      //刷新页面
      this.$router.push({
        path: "/stuempty",
      });
    },
    //删除账户确认
    startdeleteu(row) {
      this.$confirm("You are going to delete this account. Sure to continue?", "Tip", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          this.deleteu(row);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Cancelled",
          });
        });
    },
    //删除账户接口
    deleteu(data) {
      console.log(data.account_ID);
      let taInfo = new FormData();
      taInfo.append("account_ID", data.account_ID);
      this.$axios({
        url: "/account/delete",
        method: "post",
        data: taInfo,
        headers: {
          token:
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
        },
      })
        .then((res) => {
          console.log("传出的" + res.data);
          if (res.data !== 1)
            this.$message({
              type: "error",
              message: "Fail to delete! Please try again!",
            });
          else
            this.$message({
              type: "success",
              message: "Deleted successfully!",
            });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "error!",
          });
        });
      //刷新页面
      this.$router.push({
        path: "/stuempty",
      });
    },

    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    filterStatus(value, row) {
      return row.is_active === value;
    },
    //每页条数改变时触发 选择一页显示多少行
    handleSizeChange(val) {
      console.log(`${val} per page`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      console.log(`Current page: ${val}`);
      this.currentPage = val;
    },
    handleSearch(row) {
      console.log("为了让scope不报错的函数" + row);
    },
  },
  mounted() {
    let _this = this;
    this.$axios({
      url: "/account/getAllStudentAccount",
      method: "get",
      headers: {
        token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
      },
    })
      .then(function (response) {
        _this.tableData = response.data;
      })
      .catch(function (error) {
        console.log("Get Nothing!" + error);
      });
  },
};
</script>

<style scoped>
.stulistform {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.form {
  float: left;
  width: 100%;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.block {
  float: left;
  width: 100%;
  position: fixed;
  bottom: 75px;
}
</style>

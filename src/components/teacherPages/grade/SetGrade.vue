<template>
  <div>
    <div>
      <el-button class="btn">保存</el-button>
    </div>
    <div>
      <el-tabs
        class="setGradeTab"
        active-name="set"
        type="border-card"
        @tab-click="handleClick"
      >
        <el-tab-pane label="总成绩" name="total"></el-tab-pane>
        <el-tab-pane label="单项成绩" name="part"></el-tab-pane>
        <el-tab-pane label="设置成绩权重" name="set">
          <div style="height: 480px"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: "SetGrade",
  data() {
    return {};
  },
  methods: {
    handleClick(tab) {
      if (tab.index == 0) this.$router.push({ name: "totalGrades" });
      else if (tab.index == 1) this.$router.push({ name: "partGrades" });
      else if (tab.index == 2) this.$router.push({ name: "setGrades" });
    },
  },
};
</script>

<style scoped>
.setGradeTab {
  height: 100%;
  margin-top: 20px;
  margin-right: 50px;
  margin-left: 40px;
  background-color: white;
}

.btn {
  margin-left: 40px;
}
</style>

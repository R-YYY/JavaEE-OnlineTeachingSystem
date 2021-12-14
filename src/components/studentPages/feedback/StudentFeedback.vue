<template class="homeMain">
  <el-tabs class="stuFeedbackTab"  v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="全部" name="total" style="width: 200px">
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "StudentFeedback",
  data(){
    return{
      activeName:'total'
    }
  },
  methods:{
    handleClick(){

    }
  }
}
</script>

<style scoped>
.stuFeedbackTab{
  height: 100%;
  margin-top: 30px;
  margin-left: 170px;
  margin-right: 20px;
  background-color: white;
}
</style>
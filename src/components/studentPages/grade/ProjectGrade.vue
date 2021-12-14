<template>
  <div>
    <div class="projectCard" v-for="item in project_list">
      <div>{{item.name}}</div>
      <div>{{item.percentage}}</div>
      <el-divider></el-divider>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectGrade",
  props:{
    course_id:{
      type: String,
      default: '',
    },
  },
  data(){
    return{
      project_list:[
        {
          name:'实验一',
          percentage:0.1,
          score:99,
        },
        {
          name:'实验二',
          percentage:0.1,
          score:85,
        }
      ],
    }
  },
}
</script>

<style scoped>
.projectCard{
  margin-top: 30px;
  margin-left: 50px;
  margin-right: 50px;
  cursor: context-menu;
}

#redEndTime{
  color: tomato;
}
</style>
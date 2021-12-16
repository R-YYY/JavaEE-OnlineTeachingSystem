<template>
  <div>
    <div id="shape2">

    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "ProjectGrade",
  mounted() {
    let id=this.$route.params.course_id;
    let student_id='1951014';
    this.$axios.get('/score/getStuProScoreList',{
      params:{
        course_ID:id,
        student_ID:student_id,
      },
      headers:{
        token:"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjM0NTY3In0.rrlord8uupqmlJXvDW6Ha1sGfp5te8ICtSrlaDe1f6o",
      },
    }).then((response)=>{
      console.log('begin');
      console.log(response.data);
      var list=response.data;
      console.log(list);
      var name_list=[];
      var score_list=[];
      for(var i=0; i<list.length; i++){
        console.log(i);
        name_list.push(list[i].name);
        if(list[i].score==null){
          score_list.push(0);
        }
        else{
          score_list.push(list[i].score);
        }
      }
      // console.log(name_list);
      // console.log(score_list);
      // 基于准备好的dom，初始化echarts实例
      var projectChart = echarts.init(document.getElementById('shape2'),'infographic');
      window.onresize = function() {
        projectChart.resize();
      };
      projectChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: name_list,
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: score_list,
            name: 'Grade',
            type: 'bar',
            barWidth: '60%',
            itemStyle:{
              color:'rgba(195, 172, 250, 1)',
            }
          }
        ],
      })
    })
    // var projects=['实验一', '实验二', '实验三', '实验四', '实验五', '实验六', '实验七',
    //   '实验一', '实验二', '实验三', '实验四', '实验五'];
    // var scores=[60, 98, 90, 86, 100, 89, 92, 60, 98, 90, 86, 100];

  }
}
</script>

<style scoped>
#shape2{
  width: 550px;
  height: 440px;
  /*border: 1px solid black;*/
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.15), 0 6px 15px 0 rgba(0, 0, 0, 0.14);
  border-radius: 10px;
  margin:5px auto;
}
</style>
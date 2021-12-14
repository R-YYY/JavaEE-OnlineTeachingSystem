<template>
  <div id="TotalGrade">
    <div id="shape">
      
    </div>
    <div id="shape2">

    </div>

  </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "TotalGrade",
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('shape'));
    window.onresize = function() {
      myChart.resize();
    };
    myChart.setOption({
      title: {
        text: '课程成绩比例',
        // subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '比例（%）',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 10, name: '考勤' },
            { value: 90, name: '实验' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    })
  }
}
</script>

<style scoped>
#TotalGrade{
  height: 100%;
  margin-left: 30px;
  margin-right: 20px;
  background-color: white;
}
#shape{
  width: 500px;
  height: 410px;
  border: 1px solid black;
}
#shape2{
  width: 500px;
  height: 410px;
  border: 1px solid black;
}
</style>
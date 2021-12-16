<template class="homeMain">
  <div id="feedback">
    <div>
      <el-input
          class="writeArea"
          type="textarea"
          :rows="2"
          placeholder="Input the feedback"
          v-model="textarea">
      </el-input>
      <el-button type="primary" class="feedbackButton">Submit</el-button>
      <el-divider></el-divider>
    </div>

<!--    <el-card style="width: 400px;height: 600px" shadow="hover">-->
<!--      -->
<!--    </el-card>-->
    <div class="feedbackArea">
      <div class="feedbackText">
        <div v-for="item in feedback_list">
          <el-card :body-style="{ padding: '0px' }" class="man">
            <div style="padding: 14px;text-align: center">
              <div>{{item.name}}</div>
              <span>{{item.student_ID}}</span>
            </div>
          </el-card>
          <div>{{item.student_ID}}</div>
          <div>{{item.name}}</div>
          <div>{{item.submit_time}}</div>
          <div>{{item.content}}</div>
        </div>
      </div>
    </div>
  </div>
<!--  <el-tabs class="stuFeedbackTab"  v-model="activeName" @tab-click="handleClick">-->
<!--    <el-tab-pane label="全部" name="total" style="width: 200px">-->
<!--    </el-tab-pane>-->
<!--  </el-tabs>-->
</template>

<script>
export default {
  name: "StudentFeedback",
  data(){
    return{
      activeName:'total',
      textarea: '',
      feedback_list:[
        {
          student_ID:'1951014',
          name:'Little chicken',
          submit_time:'2021-12-13 22:10:14',
          content:'What is the assignment?',
        },
        {
          student_ID:'1951014',
          name:'Little chicken',
          submit_time:'2021-12-13 22:10:14',
          content:'What is the assignment??',
        },
        {
          student_ID:'1951014',
          name:'Little chicken',
          submit_time:'2021-12-13 22:10:14',
          content:'What is the assignment???',
        },
        {
          student_ID:'1951014',
          name:'Little chicken',
          submit_time:'2021-12-13 22:10:14',
          content:'What is the assignment????',
        }
      ],
    }
  },
  methods:{
    handleClick(){

    }
  }
}
</script>

<style scoped>
#feedback{
  height: 100%;
  margin-top: 30px;
  margin-left: 170px;
  margin-right: 20px;
  background-color: white;
  padding: 0px 38px;
}
.stuFeedbackTab{
  height: 100%;
  margin-top: 30px;
  margin-left: 170px;
  margin-right: 20px;
  background-color: white;
}
.writeArea{
  margin-top: 30px;
  width: 530px;
  margin-left: 50px;
  font-size: 18px;
  /*border-color: turquoise;*/
  /*font-family: "Microsoft Yi Baiti";*/
}
.feedbackButton{
  margin-left: 33px;
  height: 64px;
  font-size: 20px;
}
.feedbackArea{
  width: 750px;
  height: 600px;
  border:1px solid rgba(0,0,0,1);
  border-radius: 8px;
  margin:0px auto;
  overflow: hidden;
}
.feedbackText{
  width: 780px;
  height: 550px;
  margin-left: 20px;
  margin-top: 10px;
  overflow: auto;
}
.man{
  width: 100px;
}
</style>
<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>消课管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="height: 60px"></div>
    <div class="class" v-for="(item,index) in this.classfrom" :key="index" @click="tiao(item.classId)">
      <span>{{item.className}}</span>
    </div>

  </div>
</template>

<script>
export default {
  name: "DeleteTeacher",
  data () {
    return {
      classfrom:[],
    }
  },
  created () {
    if (localStorage.getItem("teacherId")==null){
      this.$router.push('/login')
    }
    this.load()
  },
  methods: {
    load () {
      this.request.get('class/classByTeacher', {
        params: {
          teacherId: localStorage.getItem("teacherId"),
        }
      }).then(res => {
        if (res.really) {
          this.classfrom = res.data
        }
      })
    },
    tiao(classId) {
      localStorage.removeItem('classId')
      localStorage.setItem('classId',classId)
      this.$router.push('/teacher/deleteClass')
    }
  },
  components: {
  }
}
</script>

<style>
.class{
  width: 30%;
  height: 200px;
  background-color: lightpink;
  float: left;
  margin-right: 10px;
  margin-bottom: 15px;
  text-align: center;
  border-radius: 20px;
  color: #ffffff;
  font-size: 50px;
  font-family:"华文彩云";/*设置字体*/
  font-weight:bolder; /*设置字体粗细*/
  text-shadow: 0 8px 10px #cccccc;
  line-height: 150px;
}
.class:hover{
  background-color: pink;
  cursor: pointer;
  box-shadow: 8px 5px 3px rgba(0,0,0,0.2);
}
</style>

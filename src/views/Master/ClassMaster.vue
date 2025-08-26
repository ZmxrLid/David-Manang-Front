<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>班级管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="padding: 10px 0;margin-bottom: 40px" >
      <el-button class="ml-5" type="success" style="float: right" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i></el-button>
    </div>

    <!--        新增弹窗-->
    <el-dialog title="班级信息" :visible.sync="addWindows" width="30%">
      <el-form label-width="80px" size="big">
        <el-form-item label="班级名">
          <el-input v-model="from.className" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择老师">
          <el-select v-model="from.classTeacherid" placeholder="请选择老师" style="width: 180px;float: right">
            <el-option
              v-for="item in optionsadd"
              :key="item.valueAdd"
              :label="item.labelAdd"
              :value="item.valueAdd">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addWindows = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <div class="classs" v-for="(item,index) in this.classfrom" :key="index" @click="tiaozhuan(item.classId)">
      <span>{{item.className}}</span>
    </div>

  </div>
</template>

<script>
export default {
  name: "ClasseMaster",
  data () {
    return {
      teacherfrom:[],
      classfrom:[],
      addWindows:false,
      from: {},
      optionsadd: [],
      valueAdd: ''
    }
  },
  created () {
    if (localStorage.getItem("masterId")==null){
      this.$router.push('/login')
    }
    this.fandteacher()
    this.load()
  },
  methods: {
    fandteacher () {
      this.request.get('teacher/teaForClass', {
        params: {
          masterId: localStorage.getItem("masterId")
        }
      }).then(res => {
        if (res.really) {
          this.teacherfrom = res.data
          for (let i = 0; i < this.teacherfrom.length; i++) {
            this.optionsadd.push({
              valueAdd: this.teacherfrom[i].teacherId,
              labelAdd: this.teacherfrom[i].teacherName
            })
          }
        }
      })
    },
    load () {
      this.request.get('class/classByMaster', {
        params: {
          masterId: localStorage.getItem("masterId"),
        }
      }).then(res => {
        if (res.really) {
          this.classfrom = res.data
        }
      })
    },
    handleAdd () {
      this.addWindows = true;
      this.from = {}
    },
    add () {
      this.from.classMasterid = localStorage.getItem("masterId")
      if (this.from.className === '' || this.from.className === null || this.from.className === undefined || this.from.classTeacherid === '' || this.from.classTeacherid === null || this.from.classTeacherid === undefined) {
        this.$message.error('请填写完整信息！')
        return
      }
      this.request.post('/class/add', this.from).then(res => {
        if (res.really) {
          this.$message.success('添加成功！')
          this.addWindows = false
          this.load()
        } else {
          this.$message.error('添加失败！')
        }
      })
    },
    tiaozhuan (classId) {
      localStorage.removeItem('classId')
      localStorage.setItem('classId',classId)
      this.$router.push('/master/classstudent')
    }
  },
  components: {
  }
}
</script>

<style>
.classs{
  width: 30%;
  height: 200px;
  background-color: beige;
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
.classs:hover{
  background-color: bisque;
  cursor: pointer;
  box-shadow: 8px 5px 3px rgba(0,0,0,0.2);
}
</style>

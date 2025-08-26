<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/master/class' }">班级管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{className}}</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="padding: 10px 0;margin-bottom: 40px" >
      <span style="line-height: 30px;font-size: 30px;color: #cccccc">班级：<span style="font-weight: bolder;color: #edd4dc">{{className}}</span>&nbsp;老师：<span style="font-weight: bolder;color: #edd4dc">{{teacherName}}</span></span>
      <el-button class="ml-5" type="danger" style="float: right" @click="xgbjls">更改<i class="el-icon-remove-outline"></i></el-button>
      <el-button class="ml-5" type="primary" style="float: right" @click="begin">搜索</el-button>
      <el-input placeholder="请输入" style="width: 200px;float: right" suffix-icon="el-icon-search" v-model="studentName"></el-input>
    </div>

    <el-table :data="classStudent" border stripe :header-cell-class-name="'headerBG'">
      <el-table-column prop="studentName" label="学生姓名" min-width="100" width="250">
      </el-table-column>
      <el-table-column prop="studentHours" label="所剩课时">
      </el-table-column>
    </el-table>

    <div style="padding: 10px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[6, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!--        修改弹窗-->
    <el-dialog title="更换老师" :visible.sync="xgbj" width="30%">
      <el-form label-width="80px" size="big">
        <el-form-item label="ID" style="display: none">
          <el-input v-model="formteacher.classId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级名">
          <el-input v-model="formteacher.className" autocomplete="off"></el-input>
        </el-form-item>
      <el-form-item label="选择老师">
        <el-select v-model="formteacher.classTeacherid" placeholder="请选择老师" style="width: 180px;float: right">
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
        <el-button @click="xgbj = false">取 消</el-button>
        <el-button type="primary" @click="xiugaibanjilaoshi">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "ClassStudent",
  data () {
    return {
      classId: '',
      class:{},
      className: '',
      classStudent: [],
      pageNum: 1,
      pageSize: 6,
      total: 0,
      studentName: '',
      teacherName: '',
      form: {},
      xgbj: false,
      optionsadd: [],
      valueAdd: '',
      formteacher: {},
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      this.classId = localStorage.getItem('classId')
      if (this.classId=== null||this.classId===''||this.classId=== undefined){
        this.$router.push('/master/class')
      }
      this.request.get('/class/getClassName', {
        params: {
          classId: this.classId
        }
      }).then(res => {
        this.class=res.data
        this.className = res.data.className
        this.request.get('/teacher/getByteacherId', {
          params: {
            teacherId: res.data.classTeacherid
          }
        }).then(res => {
          this.teacherName = res.data.teacherName
        })
      })
      this.begin()
    },
    begin () {
      this.request.get('/student/getClassStudentPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          classId: this.classId,
          studentName: this.studentName
        }
      }).then(res => {
        this.classStudent = res.records
        this.total = res.total
      })
    },
    xgbjls () {
      this.xgbj = true
      this.formteacher = this.class
      console.log(this.formteacher)
      this.request.get('teacher/teaForClass', {
        params: {
          masterId: localStorage.getItem("masterId")
        }
      }).then(res => {
        if (res.really) {
          this.teacherfrom = res.data
          this.optionsadd = []
          for (let i = 0; i < this.teacherfrom.length; i++) {
            this.optionsadd.push({
              valueAdd: this.teacherfrom[i].teacherId,
              labelAdd: this.teacherfrom[i].teacherName
            })
          }
        }
      })
    },
    xiugaibanjilaoshi () {
      console.log(this.formteacher)
      this.request.post('/class/updateClassTeacher', this.formteacher).then(res => {
        if (res.really) {
          this.$message.success('修改成功！')
          this.xgbj = false
          this.load()
        } else {
          this.$message.error('修改失败！')
        }
      })
    },
    handleSizeChange(pageSize){//点击下方分页，请求查询
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum){//点击下方分页，请求查询
      this.pageNum = pageNum
      this.load()
    }
  },
  components: {
  }
}
</script>

<style scoped>

</style>

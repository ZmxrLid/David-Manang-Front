<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="padding: 10px 0;margin-bottom: 40px">
      <el-button class="ml-5" type="primary" style="float: right" @click="load">搜索</el-button>
      <el-input placeholder="请输入" style="width: 200px;float: right" suffix-icon="el-icon-search"
                v-model="studentName"></el-input>
    </div>

    <!--        主要内容-->
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBG'">
      <el-table-column prop="studentName" label="学生姓名" min-width="100" width="100">
      </el-table-column>
      <el-table-column prop="studentSex" label="性别" width="50">
      </el-table-column>
      <el-table-column prop="studentAge" label="年龄" width="50">
      </el-table-column>
      <el-table-column prop="studentMatel" label="母亲电话" width="110">
      </el-table-column>
      <el-table-column prop="studentClassname" label="课程名称">
      </el-table-column>
      <el-table-column prop="studentTeachername" label="老师" width="110">
      </el-table-column>
      <el-table-column prop="studentHours" label="剩余课时" width="110">
        <template slot-scope="scope">
          <span :style="{color: scope.row.studentHours <= 2 ? 'red' : '',fontWeight: scope.row.studentHours <= 2 ? 'bold' : ''}">
            {{ scope.row.studentHours }}
          </span>
          <span v-if="scope.row.studentHours <= 2" style="color: red; font-weight: bold; margin-left: 5px;">
            (请及时续费)
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="studentState" label="状态" width="50">
        <template slot-scope="scope">
          <span :style="{ color: scope.row.studentState === 1 ? 'green' : 'red' }">
            {{ scope.row.studentState === 1 ? '在读' : '离校' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="studentTime" label="入校时间" width="100" :formatter="formatTime">
      </el-table-column>
      <el-table-column prop="studentMa" label="母亲姓名" width="100">
      </el-table-column>
      <el-table-column label="缴费" width="90">
        <template slot-scope="scope">
          <el-button type="success" @click="collw(scope.row)">缴费<i class="el-icon-edit"></i></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="studentFatel" label="父亲电话" width="110">
      </el-table-column>
      <el-table-column prop="studentOther" label="其他亲属">
      </el-table-column>
      <el-table-column prop="studentOthertel" label="其他亲属电话" width="130">
      </el-table-column>
    </el-table>

    <!--        分页栏-->
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

    <!--        学费弹窗-->
    <el-dialog title="缴费信息" :visible.sync="jiaofeiw" width="30%">
      <el-form label-width="80px" size="big">
        <el-form-item label="缴费详情">
          <span>缴费课程：{{collform.collClassname}}</span><br>
          <span>缴费学员：{{collform.collStuname}}</span>
        </el-form-item>
        <el-form-item label="缴费金额">
          <el-input v-model="collform.collNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="缴费人">
          <el-input v-model="collform.collFromname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="增加课时">
          <el-input v-model="collform.collHours" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="jiaofeiw = false">取 消</el-button>
        <el-button type="primary" @click="jiaofeif">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StudentTeacher',
  data () {
    return {
      pageNum: 1,
      pageSize: 6,
      total: 0,
      tableData: [],
      studentName: '',
      form: {},
      collform: {},
      jiaofeiw: false,
    }
  },
  created () {
    if (localStorage.getItem('teacherId') == null) {
      this.$router.push('/login')
    }
    this.load()
  },
  methods: {
    load () {
      this.request.get('student/pageteacher', {
        params: {
          teacherId: localStorage.getItem('teacherId'),
          studentName: this.studentName,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        if (res) {
          this.tableData = res.records
          this.total = res.total
        }
      })
    },
    formatTime (row, column, cellValue) {
      if (!cellValue) return ''
      // 如果是时间戳
      if (typeof cellValue === 'number') {
        return new Date(cellValue).toLocaleDateString('zh-CN')
      }
      // 如果是日期字符串
      if (typeof cellValue === 'string') {
        const date = new Date(cellValue)
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      }
      return cellValue
    },
    handleSizeChange(pageSize){//点击下方分页，请求查询
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum){//点击下方分页，请求查询
      this.pageNum = pageNum
      this.load()
    },
    collw (row) {
      this.collform = {}
      this.collform.collStuname = row.studentName
      this.collform.collStuid = row.studentId
      this.collform.collCollid = localStorage.getItem('teacherId')
      this.collform.collClassid = row.studentClassid
      this.collform.collClassname = row.studentClassname
      this.request.get('/class/getbyteacherid?classId='+row.studentClassid).then(res=>{
        if (res.really == true){
          this.collform.collMasterid = res.data.classMasterid
        }
      })
      this.request.get('/teacher/getByteacherId?teacherId='+localStorage.getItem('teacherId')).then(res=>{
        if (res.really == true){
          this.collform.collCollname = res.data.teacherName
        }
      })
      this.jiaofeiw= true
    },
    jiaofeif () {
      console.log(this.collform)
      this.request.post('/coll/addteacher', this.collform).then(res => {
        if (res.really) {
          this.$message.success("缴费成功")
          this.jiaofeiw = false
          this.load()
        } else {
          this.$message.error("缴费失败")
        }
      })
    },
  },
  components: {}
}
</script>

<style scoped>

</style>

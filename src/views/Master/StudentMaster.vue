<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>学生管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="padding: 10px 0;margin-bottom: 40px">
      <el-button class="ml-5" type="success" style="float: right" @click="add">新增<i
        class="el-icon-circle-plus-outline"></i></el-button>
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

      <el-table-column prop="studentZhours" label="总课时" width="110">
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
      <el-table-column label="操作" width="168">
        <template slot-scope="scope">
          <el-button type="warning" @click="upload(scope.row)">编辑<i class="el-icon-edit"></i></el-button>
          <el-button type="danger" @click="deleteStudent(scope.row.studentId,scope.row.studentState)">结课<i
            class="el-icon-remove-outline"></i></el-button>
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

    <!--        插入弹窗-->
    <el-dialog title="学生信息" :visible.sync="addwindows" width="30%">
      <el-form label-width="80px" size="big">
        <el-form-item label="学生姓名">
          <el-input v-model="form.studentName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生性别">
          <el-input v-model="form.studentSex" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生年龄">
          <el-input v-model="form.studentAge" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="母亲姓名">
          <el-input v-model="form.studentMa" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="母亲电话">
          <el-input v-model="form.studentMatel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择班级">
          <el-select v-model="form.studentClassid" placeholder="请选择班级" style="width: 180px;float: right">
            <el-option
              v-for="item in optionsadd"
              :key="item.valueAdd"
              :label="item.labelAdd"
              :value="item.valueAdd">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父亲姓名">
          <el-input v-model="form.studentFa" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父亲电话">
          <el-input v-model="form.studentFatel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="其他亲属">
          <el-input v-model="form.studentOther" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="亲属电话">
          <el-input v-model="form.studentOthertel" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addwindows = false">取 消</el-button>
        <el-button type="primary" @click="addfasong">确 定</el-button>
      </div>
    </el-dialog>

    <!--        修改弹窗-->
    <el-dialog title="学生信息" :visible.sync="xiuwindows" width="30%">
      <el-form label-width="80px" size="big">
        <el-form-item label="ID" style="display: none">
          <el-input v-model="form.studentId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-input v-model="form.studentName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生性别">
          <el-input v-model="form.studentSex" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生年龄">
          <el-input v-model="form.studentAge" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="母亲姓名">
          <el-input v-model="form.studentMa" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="母亲电话">
          <el-input v-model="form.studentMatel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择班级">
          <el-select v-model="form.studentClassid" placeholder="请选择班级" style="width: 180px;float: right">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父亲姓名">
          <el-input v-model="form.studentFa" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父亲电话">
          <el-input v-model="form.studentFatel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="其他亲属">
          <el-input v-model="form.studentOther" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="亲属电话">
          <el-input v-model="form.studentOthertel" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="xiuwindows = false">取 消</el-button>
        <el-button type="primary" @click="savexiugai">确 定</el-button>
      </div>
    </el-dialog>

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

    <!--        学费课时错误弹窗-->
    <el-dialog title="缴费信息" :visible.sync="jiaofeiwerror" width="30%">
      本次缴费于往期不同，建议点击取消并新建一位同名学生，否则将影响老师的课时统计（如果是首次缴费请忽略，点击确认）
      <div slot="footer" class="dialog-footer">
        <el-button @click="jiaofeiwerror = false">取 消</el-button>
        <el-button type="primary" @click="jiaofeiftrun">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StudentMaster',
  data () {
    return {
      pageNum: 1,
      pageSize: 6,
      total: 0,
      tableData: [],
      studentName: '',
      addwindows: false,
      xiuwindows: false,
      form: {},
      classfrom: [],
      optionsadd: [],
      valueAdd: '',
      options: [],
      value: '',
      collform: {},
      jiaofeiw: false,
      jiaofeiwerror: false
    }
  },
  created () {
    if (localStorage.getItem('masterId') == null) {
      this.$router.push('/login')
    }
    this.load()
  },
  methods: {
    load () {
      this.request.get('student/page', {
        params: {
          masterId: localStorage.getItem('masterId'),
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
    add () {
      this.addwindows = true
      this.form = {}
      this.request.get('class/classByMaster', {
        params: {
          masterId: localStorage.getItem('masterId'),
        }
      }).then(res => {
        if (res.really) {
          this.classfrom = res.data
          this.optionsadd = []
          for (let i = 0; i < this.classfrom.length; i++) {
            this.optionsadd.push({
              valueAdd: this.classfrom[i].classId,
              labelAdd: this.classfrom[i].className
            })
          }
        }
      })
    },
    addfasong () {
      console.log(this.form)
      this.form.studentMasterid = localStorage.getItem('masterId')
      this.request.post('/student/add', this.form).then(res => {
        if (res.really) {
          this.$message.success('保存成功')
          this.addwindows = false
          this.load()
        } else {
          this.$message.error('保存失败')
        }
      })
    },
    upload (row) {
      this.form = row
      this.xiuwindows = true
      this.request.get('class/classByMaster', {
        params: {
          masterId: localStorage.getItem('masterId'),
        }
      }).then(res => {
        if (res.really) {
          this.classfrom = res.data
          this.options =  []
          for (let i = 0; i < this.classfrom.length; i++) {
            this.options.push({
              value: this.classfrom[i].classId,
              label: this.classfrom[i].className
            })
          }
        }
      })
    },
    savexiugai(){
      this.request.post('/student/update',this.form).then(res => {
        if(res){
          this.$message.success("保存成功")
          this.xiuwindows = false
          this.load()
        }else{
          this.$message.error("保存失败")
        }
      })
    },
    deleteStudent(id,state){
      if (state===0){
        this.$message.error("已经退课")
      }else {
        this.$confirm('此操作将不可撤销, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.request.post("/student/delect?studentId="+id).then(res =>{
            if (res){
              this.load()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }else {
              this.$message({
                type:"error",
                message:"删除失败"
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
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
      this.collform.collCollid = localStorage.getItem('masterId')
      this.collform.collClassid = row.studentClassid
      this.collform.collClassname = row.studentClassname
      this.collform.collMasterid = localStorage.getItem('masterId')
      this.request.get('/master/get?masterId='+localStorage.getItem('masterId')).then(res=>{
        if (res.really == true){
          this.collform.collCollname = res.data.masterName
        }
      })
      this.jiaofeiw= true
    },
    jiaofeif () {
      console.log(this.collform.collStuid)
      this.request.post('student/stuclasscollbyid?studentId='+this.collform.collStuid).then(res => {
        const intValue = Number(res); // 假设res是int类型
        const bigDecimalValue = Number(this.collform.collNum); // 假设collNum是BigDecimal对应的值
        const collHoursValue = Number(this.collform.collHours)
        const result = parseFloat((bigDecimalValue / collHoursValue).toFixed(2));
        console.log(result, intValue, bigDecimalValue, collHoursValue)
        if (intValue === result){
          this.request.post('/coll/add', this.collform).then(res => {
            if (res.really) {
              this.$message.success("缴费成功")
              this.jiaofeiw = false
              this.load()
            } else {
              this.$message.error("缴费失败")
            }
          })
        }else{
          this.jiaofeiwerror = true
        }
      })
    },
    jiaofeiftrun () {
      this.request.post('/coll/add', this.collform).then(res => {
        if (res.really) {
          this.$message.success("缴费成功")
          this.jiaofeiwerror = false
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

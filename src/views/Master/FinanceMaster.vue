<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>缴费记录</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="padding: 10px 0;margin-bottom: 40px" >
      <el-button class="ml-5" type="primary" style="float: right" @click="load">搜索</el-button>
      <el-input placeholder="请输入" style="width: 200px;float: right" suffix-icon="el-icon-search" v-model="studentName"></el-input>
    </div>

    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBG'">
      <el-table-column prop="collStuname" label="学生姓名">
      </el-table-column>
      <el-table-column prop="collTime" label="缴费时间" :formatTime="formatTime">
      </el-table-column>
      <el-table-column prop="collCollname" label="收费人">
      </el-table-column>
      <el-table-column prop="collNum" label="缴费金额">
      </el-table-column>
      <el-table-column prop="collClassname" label="为缴班级">
      </el-table-column>
      <el-table-column prop="collFromname" label="缴费人">
      </el-table-column>
      <el-table-column prop="collHours" label="增加课时">
      </el-table-column>
      <el-table-column prop="collState" label="状态" width="100">
        <template slot-scope="scope">
          <span :style="getStateStyle(scope.row.collState)">
            {{ getStateText(scope.row.collState) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="168">
        <template slot-scope="scope">
          <div v-if="scope.row.collState === 0">
            <!-- 未批准状态：显示批准和驳回按钮 -->
            <el-button type="primary" @click="approve(scope.row)">批准</el-button>
            <el-button type="danger" @click="reject(scope.row.collId)">驳回</el-button>
          </div>
          <div v-else-if="scope.row.collState === 1">
            <!-- 已批准状态：禁用两个按钮 -->
            <el-button type="primary" size="mini" disabled>批准</el-button>
            <el-button type="danger" size="mini" disabled>驳回</el-button>
          </div>
          <div v-else-if="scope.row.collState === 2">
            <!-- 已驳回状态：显示批准和撤销按钮 -->
            <el-button type="primary" size="mini" @click="approve(scope.row)">批准</el-button>
            <el-button type="warning" size="mini" @click="cancelReject(scope.row.collId)">撤销</el-button>
          </div>
          <div v-else>
            <!-- 其他状态：默认显示禁用按钮 -->
            <el-button type="primary" size="mini" disabled>批准</el-button>
            <el-button type="danger" size="mini" disabled>驳回</el-button>
          </div>
        </template>
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
  name: "teachermaster",
  data(){
    return{
      tableData: [],
      total: 0,
      pageNum:1,
      pageSize:6,
      visible: false,
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse:false,
      sideWidth: 200,
      studentName:"",
      jiaofeiwerror :false
    }
  },
  created() {
    //请求分页查询数据
    this.load()
  },
  methods:{
    load(){
      this.request.get('/coll/pageMaster',{
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          masterId:localStorage.getItem("masterId"),
          studentName:this.studentName
        }
      }).then(res =>{
        console.log(res)
        this.tableData = res.records
        this.total = res.total
      })
    },
    handleSizeChange(pageSize){//点击下方分页，请求查询
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum){//点击下方分页，请求查询
      this.pageNum = pageNum
      this.load()
    },
    getStateText (state) {
      switch (state) {
        case 0:
          return '未批准'
        case 1:
          return '已批准'
        case 2:
          return '已驳回'
        default:
          return '未知状态'
      }
    },
    // 获取状态样式
    getStateStyle (state) {
      const baseStyle = 'font-weight: bold;'
      switch (state) {
        case 0:
          return baseStyle + 'color: red;'   // 未批准 - 红色
        case 1:
          return baseStyle + 'color: green;' // 已批准 - 绿色
        case 2:
          return baseStyle + 'color: orange;'   // 已驳回 - 红色
        default:
          return baseStyle + 'color: gray;' // 默认 - 灰色
      }
    },
    approve (coll) {
      this.$confirm('此操作将不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post('student/stuclasscollbyid?studentId='+coll.collStuid).then(res => {
          const intValue = Number(res); // 假设res是int类型
          const bigDecimalValue = Number(coll.collNum); // 假设collNum是BigDecimal对应的值
          const collHoursValue = Number(coll.collHours)
          const result = parseFloat((bigDecimalValue / collHoursValue).toFixed(2));
          if (intValue === result){
            this.request.post("/coll/approve?collId="+coll.collId).then(res =>{
              if (res){ // 更新表格中对应行的状态
                const targetRow = this.tableData.find(item => item.collId === collId);
                if (targetRow) {
                  targetRow.collState = 1; // 设置为已批准状态
                }
                this.load()
                this.$message({
                  type: 'success',
                  message: '批准成功!'
                })
              }else {
                this.$message({
                  type:"error",
                  message:"批准失败"
                })
              }
            })
          }else{
            this.$confirm('交费金额与往期不同，可能会影响老师考勤，建议取消并新建一位同名学生(新学员请忽略), 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.request.post("/coll/approve?collId="+coll.collId).then(res =>{
                if (res){ // 更新表格中对应行的状态
                  const targetRow = this.tableData.find(item => item.collId === coll.collId);
                  if (targetRow) {
                    targetRow.collState = 1; // 设置为已批准状态
                  }
                  this.load()
                  this.$message({
                    type: 'success',
                    message: '批准成功!'
                  })
                }else {
                  this.$message({
                    type:"error",
                    message:"批准失败"
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
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消批准'
          });
        });
    },
    reject (collId) {
      this.$confirm('此操作将不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/coll/reject?collId="+collId).then(res =>{
          if (res){
            // 更新表格中对应行的状态
            const targetRow = this.tableData.find(item => item.collId === collId);
            if (targetRow) {
              targetRow.collState = 2; // 设置为已驳回状态
            }
            this.load()
            this.$message({
              type: 'success',
              message: '驳回成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消驳回'
        });
      });
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
    cancelReject (collId) {
      this.$confirm('此操作将不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/coll/cancelReject?collId="+collId).then(res =>{
          if (res){// 更新表格中对应行的状态
            const targetRow = this.tableData.find(item => item.collId === collId);
            if (targetRow) {
              targetRow.collState = 0; // 设置为未批准状态
            }
            this.load()
            this.$message({
              type: 'success',
              message: '撤销驳回成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤销驳回'
        });
      });
    }
  }
}
</script>

<style>
</style>

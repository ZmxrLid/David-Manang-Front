<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>消课记录</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="padding: 10px 0;margin-bottom: 40px">
      <!--      <el-button class="ml-5" type="primary" style="float: right" @click="load">搜索</el-button>-->
      <!--      <el-input placeholder="请输入" style="width: 200px;float: right" suffix-icon="el-icon-search"-->
      <!--                v-model="studentName"></el-input>-->
    </div>

    <!--        主要内容-->
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBG'">
      <el-table-column prop="collTime" label="缴费时间" min-width="100" width="150" :formatTime="formatTime">
      </el-table-column>
      <el-table-column prop="collStuname" label="缴费学生">
      </el-table-column>
      <el-table-column prop="collCollname" label="收费人">
      </el-table-column>
      <el-table-column prop="collNum" label="收款金额" width="100">
      </el-table-column>
      <el-table-column prop="collClassname" label="为缴班级">
      </el-table-column>
      <el-table-column prop="collFromname" label="缴费人">
      </el-table-column>
      <el-table-column prop="collHours" label="增加课时">
      </el-table-column>
      <el-table-column prop="collState" label="状态">
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
            <el-button type="primary" disabled>未批准</el-button>
          </div>
          <div v-else-if="scope.row.collState === 1">
            <!-- 已批准状态：禁用两个按钮 -->
            <el-button type="danger" size="mini" disabled>已批准</el-button>
          </div>
          <div v-else-if="scope.row.collState === 2">
            <!-- 已驳回状态：显示批准和撤销按钮 -->
            <el-button type="warning" size="mini" @click="cancelReject(scope.row.collId)">再次提交</el-button>
          </div>
          <div v-else>
            <!-- 其他状态：默认显示禁用按钮 -->
            <el-button type="primary" size="mini" disabled>批准</el-button>
          </div>
        </template>
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
      form: {},
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
      this.request.get('coll/collpageteacher', {
        params: {
          teacherId: localStorage.getItem('teacherId'),
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
    cancelReject(collId){
      this.request.post('coll/cancelrejectteacher?collId='+collId).then(res=>{
        if(res){
          this.$message.success('提交成功')
          this.load()
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
  }
}
</script>

<style scoped>

</style>

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
      <el-table-column prop="taxesTime" label="申请时间" min-width="100" width="150">
      </el-table-column>
      <el-table-column prop="taxesDatetime" label="上课日期" min-width="100" width="150" :formatTime="formatTime">
      </el-table-column>
      <el-table-column prop="taxesRemark" label="申请课时段" width="100">
      </el-table-column>
      <el-table-column prop="taxesTeachername" label="申请老师" min-width="100" width="100">
      </el-table-column>
      <el-table-column prop="taxesClassname" label="申请班级" width="100">
      </el-table-column>
      <el-table-column prop="taxesStunamelist" label="学生名字" max-width="500">
        <template slot-scope="scope">
          <div style="display: flex; align-items: center;">
            <div
              :style="{
          overflow: scope.row.showFullText ? 'visible' : 'hidden',
          textOverflow: scope.row.showFullText ? 'clip' : 'ellipsis',
          whiteSpace: scope.row.showFullText ? 'normal' : 'nowrap',
          flex: 1
        }"
            >
              {{ scope.row.taxesStunamelist }}
            </div>
            <el-button
              v-if="!scope.row.showFullText && isTextOverflow(scope.row.taxesStunamelist)"
              type="text"
              size="mini"
              @click="toggleText(scope.row)"        style="margin-left: 5px;"
            >
              全部
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="taxesState" label="状态" width="100">
        <template slot-scope="scope">
          <span :style="getStateStyle(scope.row.taxesState)">
            {{ getStateText(scope.row.taxesState) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="168">
        <template slot-scope="scope">
          <div v-if="scope.row.taxesState === 0">
            <!-- 未批准状态：显示批准和驳回按钮 -->
            <el-button type="primary" disabled>未批准</el-button>
          </div>
          <div v-else-if="scope.row.taxesState === 1">
            <!-- 已批准状态：禁用两个按钮 -->
            <el-button type="danger" size="mini" disabled>已批准</el-button>
          </div>
          <div v-else-if="scope.row.taxesState === 2">
            <!-- 已驳回状态：显示批准和撤销按钮 -->
            <el-button type="warning" size="mini" @click="cancelReject(scope.row.taxesId)">再次提交</el-button>
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
      xiuwindows: false,
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
      this.request.get('taxes/deletepageteacher', {
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
    cancelReject(taxesId){
      this.request.post('taxes/cancelrejectteacher?taxesId='+taxesId).then(res=>{
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
    // 切换文本显示状态
    toggleText(row) {
      row.showFullText = !row.showFullText;
    },
    // 简单判断文本是否溢出（可以根据实际需要调整）
    isTextOverflow(text) {
      // 这里可以添加更复杂的逻辑来判断文本是否溢出
      // 简单起见，我们假设文本长度超过一定字符就认为会溢出
      return text && text.length > 20;
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

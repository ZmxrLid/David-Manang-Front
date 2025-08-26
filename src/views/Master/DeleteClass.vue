<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/master/delete' }">消课管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ className }}</el-breadcrumb-item>
    </el-breadcrumb>

        <div style="padding: 10px 0;margin-bottom: 40px">
<!--          <el-button class="ml-5" type="success" style="float: right" @click="add">新增<i-->
<!--            class="el-icon-circle-plus-outline"></i></el-button>-->
          <el-button class="ml-5" type="primary" style="float: right" @click="load">搜索</el-button>
          <el-input placeholder="请输入" style="width: 200px;float: right" suffix-icon="el-icon-search"
                    v-model="studentName"></el-input>
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
            <el-button type="primary" @click="approve(scope.row.taxesId)">批准</el-button>
            <el-button type="danger" @click="reject(scope.row.taxesId)">驳回</el-button>
          </div>
          <div v-else-if="scope.row.taxesState === 1">
            <!-- 已批准状态：禁用两个按钮 -->
            <el-button type="primary" size="mini" disabled>批准</el-button>
            <el-button type="danger" size="mini" disabled>驳回</el-button>
          </div>
          <div v-else-if="scope.row.taxesState === 2">
            <!-- 已驳回状态：显示批准和撤销按钮 -->
            <el-button type="primary" size="mini" @click="approve(scope.row.taxesId)">批准</el-button>
            <el-button type="warning" size="mini" @click="cancelReject(scope.row.taxesId)">撤销</el-button>
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

  </div>
</template>

<script>
export default {
  data () {
    return {
      classId: localStorage.getItem('classId'),
      className: '',
      tableData: [],
      pageNum: 1,
      pageSize: 6,
      total: 0,
    }
  },
  created () {
    if (localStorage.getItem('masterId') == null) {
      this.$router.push('/master/delete')
    }
    this.request.get('/class/getClassName', {
      params: {
        classId: this.classId
      }
    }).then(res => {
      this.className = res.data.className
    })
    this.load()
  },
  computed: {},
  methods: {
    load () {
      if (this.classId === null || this.classId === '' || this.classId === undefined) {
        this.$router.push('/master/delete')
      }
      this.request.get('/taxes/getDeleteStudent', {
        params: {
          classId: this.classId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.tableData = res.records.map(item => ({
          ...item,
          showFullText: false
        }));
        this.total = res.total
      })
    },
    handleSizeChange (pageSize) {//点击下方分页，请求查询
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange (pageNum) {//点击下方分页，请求查询
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
    approve (taxesId) {
      this.$confirm('此操作将不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/taxes/approve?taxesId="+taxesId).then(res =>{
          if (res){ // 更新表格中对应行的状态
            const targetRow = this.tableData.find(item => item.taxesId === taxesId);
            if (targetRow) {
              targetRow.taxesState = 1; // 设置为已批准状态
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
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消批准'
          });
        });
    },
    reject (taxesId) {
      this.$confirm('此操作将不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/taxes/reject?taxesId="+taxesId).then(res =>{
          if (res){
            // 更新表格中对应行的状态
            const targetRow = this.tableData.find(item => item.taxesId === taxesId);
            if (targetRow) {
              targetRow.taxesState = 2; // 设置为已驳回状态
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
    cancelReject (taxesId) {
      this.$confirm('此操作将不可撤销, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/taxes/cancelReject?taxesId="+taxesId).then(res =>{
          if (res){// 更新表格中对应行的状态
            const targetRow = this.tableData.find(item => item.taxesId === taxesId);
            if (targetRow) {
              targetRow.taxesState = 0; // 设置为未批准状态
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

<style scoped>
</style>

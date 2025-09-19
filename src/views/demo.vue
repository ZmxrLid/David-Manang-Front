<template>
  <div class="student-hours-management">
    <h2>学生课时管理</h2>

    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="班级ID">
          <el-input v-model.number="searchForm.classId" placeholder="请输入班级ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchStudents" :loading="loading">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="studentList" v-loading="loading" border stripe>
      <el-table-column prop="studentId" label="学生ID" width="80"></el-table-column>
      <el-table-column prop="studentName" label="学生姓名" width="120"></el-table-column>
      <el-table-column prop="studentClassname" label="课程名称" width="150"></el-table-column>
      <el-table-column prop="studentHours" label="剩余课时">
        <template #default="scope">
          <el-input-number v-model="scope.row.studentHours" :min="0" size="small"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="studentClasscoll" label="课时费">
        <template #default="scope">
          <el-input-number v-model="scope.row.studentClasscoll" :min="0" :precision="2" size="small"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button type="primary" size="small" @click="submitUpdate(scope.row)">提交</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

// 配置基础URL为5555端口
const apiClient = axios.create({
  baseURL: 'http://localhost:5555'
})

export default {
  name: 'StudentHoursManagement',
  data() {
    return {
      searchForm: {
        classId: null
      },
      studentList: [],
      loading: false,
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  methods: {
    searchStudents () {
      if (!this.searchForm.classId) {
        this.$message.warning('请输入班级ID')
        return
      }

      this.loading = true
      apiClient.get('/student/page', {
        params: {
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize,
          classId: this.searchForm.classId
        }
      }).then(response => {
        const {
          records,
          total
        } = response.data
        this.studentList = records
        this.pageInfo.total = total
      }).catch(error => {
        this.$message.error('查询失败: ' + error.message)
      }).finally(() => {
        this.loading = false
      })
    },

    submitUpdate (student) {
      this.loading = true
      apiClient.post('/student/upload', student)
        .then(response => {
          if (response.data === '上传成功') {
            this.$message.success('更新成功')
          } else {
            this.$message.error('更新失败')
          }
        })
        .catch(error => {
          this.$message.error('更新失败: ' + error.message)
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleSizeChange (val) {
      this.pageInfo.pageSize = val
      this.searchStudents()
    },

    handleCurrentChange (val) {
      this.pageInfo.pageNum = val
      this.searchStudents()
    }
  }
}
</script>

<style scoped>
.student-hours-management {
  padding: 20px;
}

.search-section {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.search-form {
  display: flex;
  align-items: center;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>

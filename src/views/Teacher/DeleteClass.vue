<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/teacher/delete' }">消课管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{className}}</el-breadcrumb-item>
    </el-breadcrumb>


    <div class="attendance-container">
      <div class="controls">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索学生姓名..."
          class="search-input"
        >
        <button class="select-all-btn" @click="toggleSelectAll">
          {{ isAllSelected ? '取消全选' : '全选' }}
        </button>
        <div class="summary">
          已选: {{ selectedStudents.length }} / 总人数: {{ students.length }}
        </div>
      </div>
      <div class="student-list">
        <div
          v-for="student in filteredStudents"
          :key="student.studentId"
          class="student-card"
          :class="{ 'selected': isSelected(student.studentId) }"
          @click="toggleStudent(student.studentId)"
        >
          {{ student.studentName }}
        </div>
      </div>

      <button class="submit-btn" @click="submitAttendance">
        提交考勤
      </button>
    </div>

<!--    时间选择-->
    <el-dialog title="请选择时间段" :visible.sync="time" width="30%">

      <el-date-picker
        v-model="value2"
        align="right"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
        :picker-options="pickerOptions">
      </el-date-picker>

      <el-time-select
        v-model="startTime"
        :picker-options="{
    start: '08:30',
    step: '00:30',
    end: '21:30'
  }"
        placeholder="选择上课时间">
      </el-time-select>
      <el-time-select
        v-model="endTime"
        :picker-options="{
    start: '08:30',
    step: '00:30',
    end: '21:30'
  }"
        placeholder="选择下课时间">
      </el-time-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="time = false">取 消</el-button>
        <el-button type="primary" @click="updated">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classId: localStorage.getItem("classId"),
      className: '',
      studentName: '',
      searchQuery: '',
      selectedStudents: [], // 只存储选中学生的ID
      // 假数据 - 学生列表
      students: [],
      time: false,
      startTime: '',
      endTime: '',
      remark: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      value2: '',
    }
  },
  created () {
    this.request.get('/class/getClassName', {
      params: {
        classId: this.classId
      }
    }).then(res => {
      this.className = res.data.className
    })
    this.load()
  },
  computed: {
    // 筛选学生
    filteredStudents () {
      return this.students.filter(student =>
        student.studentName.includes(this.searchQuery)
      );
    },
    // 检查是否全部选中
    isAllSelected () {
      const visibleIds = this.filteredStudents.map(s => s.studentId);
      return visibleIds.length > 0 &&
        visibleIds.every(studentId => this.selectedStudents.includes(studentId));
    }
  },
  methods: {
    load () {
      if (this.classId === null || this.classId === '' || this.classId === undefined) {
        this.$router.push('/teacher/delete')
      }
      this.request.get('/student/getStudentFromDelet', {
        params: {
          classId: this.classId
        }
      }).then(res => {
        this.students = res
      })
    },
    // 检查单个学生是否被选中
    isSelected (studentId) {
      return this.selectedStudents.includes(studentId);
    },

    // 切换单个学生选中状态
    toggleStudent (studentId) {
      const index = this.selectedStudents.indexOf(studentId);
      if (index === -1) {
        this.selectedStudents.push(studentId);
      } else {
        this.selectedStudents.splice(index, 1);
      }
    },

    // 切换全选状态
    toggleSelectAll () {
      const visibleIds = this.filteredStudents.map(s => s.studentId);
      const allSelected = this.isAllSelected;

      if (allSelected) {
        // 取消全选 - 移除所有可见ID
        this.selectedStudents = this.selectedStudents.filter(
          studentId => !visibleIds.includes(studentId)
        );
      } else {
        // 全选 - 添加所有未选的可见ID
        const newSelected = [...this.selectedStudents];
        visibleIds.forEach(studentId => {
          if (!newSelected.includes(studentId)) {
            newSelected.push(studentId);
          }
        });
        this.selectedStudents = newSelected;
      }
    },

    // 提交考勤记录
    submitAttendance () {
      console.log('选中学生的ID:', this.selectedStudents);
      // 这里可以添加实际提交逻辑
      this.time = true
    },
    updated(){
      this.remark = this.startTime + '--' + this.endTime
      console.log(this.remark)
      if (this.startTime==='' || this.endTime==='' || this.value2===''){
        this.$message.error('请选择时间段')
      }else {
        console.log(this.value2)
        this.request.post('/taxes/add',{
          studentId: this.selectedStudents,
          classId: this.classId,
          teacherId: localStorage.getItem('teacherId'),
          remark: this.remark,
          className: this.className,
          datatime: this.value2
        }).then(res => {
          if (res.really){
            this.$message.success('考勤成功')
            this.time = false
            this.load()
          }else {
            this.$message.error('考勤失败')
          }
        })
      }
    }
  }
}
</script>

<style scoped>
/* 样式保持不变，只需将.present改为.selected */
.student-card.selected {
  background-color: pink;
  color: dimgray;
}

/* 其他样式与之前相同 */
.attendance-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
  font-family: 'Arial', sans-serif;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.search-input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 250px;
  font-size: 14px;
  flex-grow: 1;
}

.select-all-btn {
  padding: 8px 15px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.select-all-btn:hover {
  background-color: #e0e0e0;
}

.summary {
  font-weight: bold;
  color: #555;
  white-space: nowrap;
}

.student-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.student-card {
  padding: 15px 10px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  user-select: none;
}

.student-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.submit-btn {
  display: block;
  width: 200px;
  margin: 20px auto;
  padding: 12px;
  background-color: pink;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: lightpink;
}

@media (max-width: 600px) {
  .student-list {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
  }
}
</style>

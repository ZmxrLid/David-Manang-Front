<template>
  <div class="salary-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>薪资管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 查询区域 -->
    <div class="query-section">
      <el-date-picker
        value-format="yyyy-MM"
        v-model="month"
        type="month"
        placeholder="选择月份"
        class="month-picker"
      ></el-date-picker>
      <el-button type="primary" @click="get" icon="el-icon-search">查询</el-button>
    </div>

    <!-- 薪资卡片展示 -->
    <div class="card-container">
      <el-card class="salary-card" v-if="salary.salaryId">
        <div slot="header" class="clearfix">
          <span>{{ salary.salaryTeachername || '教师' }} {{ month }} 薪资明细</span>
        </div>

        <div class="card-content">
          <div class="content-grid">
            <!-- 左侧：基本薪资信息和备注 -->
            <div class="left-section">
              <div class="section-title">基本薪资</div>
              <div class="data-row">
                <span class="label">教师底薪:</span>
                <span class="value">{{ formatMoney(salary.salaryDixin) }}</span>
              </div>
              <div class="data-row">
                <span class="label">考勤薪资:</span>
                <span class="value">{{ formatMoney(salary.salaryKaoqin) }}</span>
              </div>
              <div class="data-row">
                <span class="label">绩效奖金:</span>
                <span class="value">{{ formatMoney(salary.salaryJixiaonum) }}</span>
              </div>
              <div class="data-row">
                <span class="label">邀约提成:</span>
                <span class="value">{{ formatMoney(salary.salaryTicheng) }}</span>
              </div>

              <div class="section-title divider">工龄信息</div>
              <div class="data-row">
                <span class="label">工龄:</span>
                <span class="value">{{ salary.salaryGongling || 0 }} 年</span>
              </div>
              <div class="data-row">
                <span class="label">工龄奖金:</span>
                <span class="value">{{ formatMoney(salary.salaryGongsalary) }}</span>
              </div>

              <div class="section-title divider">备注信息</div>
              <div class="remarks">
                {{ salary.salaryRemark || '无备注信息' }}
              </div>
            </div>

            <!-- 右侧：其他薪资信息和汇总 -->
            <div class="right-section">
              <div class="section-title">其他项目</div>
              <div class="data-row">
                <span class="label">股份分红:</span>
                <span class="value">{{ formatMoney(salary.salaryGufen) }}</span>
              </div>
              <div class="data-row">
                <span class="label">保险扣除:</span>
                <span class="value">{{ formatMoney(salary.salaryBaoxian) }}</span>
              </div>
              <div class="data-row">
                <span class="label">其他奖罚:</span>
                <span class="value">{{ formatMoney(salary.salaryExtra) }}</span>
              </div>

              <div class="section-title divider">薪资汇总</div>
              <div class="data-row highlight">
                <span class="label">应发工资:</span>
                <span class="value">{{ formatMoney(salary.salaryNum) }}</span>
              </div>
              <div class="data-row highlight">
                <span class="label">实发工资:</span>
                <span class="value" style="color: #67C23A; font-weight: bold">
                  {{ formatMoney(salary.salaryEndnum) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <div class="empty-card" v-if="!salary.salaryId">
        <el-empty description="暂无薪资数据"></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalaryView",
  data() {
    return {
      salary: {},
      teacherId: localStorage.getItem("teacherId"),
      month: this.getCurrentMonth(),
    };
  },
  created() {
    this.get();
  },
  methods: {
    getCurrentMonth() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}`;
    },
    get() {
      this.request.get("/salary/getteacher", {
        params: {
          teacherId: this.teacherId,
          date: this.month,
        },
      })
        .then((res) => {
          this.salary = res.data;
        });
    },
    formatMoney(value) {
      if (value === null || value === undefined) return "0.00";
      return parseFloat(value).toFixed(2);
    },
  },
};
</script>

<style scoped>
.salary-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 20px;
}

.query-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.month-picker {
  margin-right: 15px;
  width: 200px;
}

.card-container {
  display: flex;
  justify-content: center;
}

.salary-card {
  width: 100%;
  max-width: 900px;
}

.empty-card {
  width: 100%;
  padding: 40px 0;
}

.card-content {
  padding: 10px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.left-section,
.right-section {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-weight: bold;
  color: #409EFF;
  margin: 15px 0 10px 0;
  font-size: 15px;
}

.section-title.divider {
  border-top: 1px dashed #e0e0e0;
  padding-top: 15px;
  margin-top: 15px;
}

.data-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.data-row.highlight {
  background-color: #f9f9f9;
  padding: 10px;
  margin: 5px -10px;
  border-radius: 4px;
  font-weight: bold;
}

.label {
  color: #606266;
  min-width: 120px;
  text-align: left;
}

.value {
  color: #303133;
  text-align: right;
  flex: 1;
  padding-right: 10px;
}

.remarks {
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 4px;
  margin-top: 10px;
  color: #666;
}

@media (max-width: 768px) {
  .query-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .month-picker {
    width: 100%;
    margin-right: 0;
    margin-bottom: 10px;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .label {
    min-width: 100px;
  }
}
</style>

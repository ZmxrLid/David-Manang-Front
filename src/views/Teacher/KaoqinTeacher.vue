<template>
  <div class="kaoqin-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>考勤管理</el-breadcrumb-item>
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
      <el-button @click="flushed" icon="el-icon-refresh">刷新</el-button>
    </div>

    <!-- 考勤卡片展示 -->
    <div class="card-container">
      <el-card class="kaoqin-card" v-if="kaoqin.kaoqinId">
        <div slot="header" class="clearfix">
          <span>{{ kaoqin.kaoqinTeachername || '教师' }} {{ month }} 考勤记录</span>
        </div>

        <div class="card-content">
          <div class="content-grid">
            <!-- 左侧：考勤信息 -->
            <div class="left-section">
              <div class="section-title">考勤天数</div>
              <div class="data-row">
                <span class="label">应上班天数:</span>
                <span class="value">{{ kaoqin.kaoqinYing || 0 }} 天</span>
              </div>
              <div class="data-row">
                <span class="label">实际上班天数:</span>
                <span class="value">{{ kaoqin.kaoqinDays || 0 }} 天</span>
              </div>

              <div class="section-title divider">考勤明细</div>
              <div class="data-row">
                <span class="label">迟到早退10分钟内:</span>
                <span class="value">{{ kaoqin.kaoqinTentime || 0 }} 次</span>
              </div>
              <div class="data-row">
                <span class="label">迟到早退1小时内:</span>
                <span class="value">{{ kaoqin.kaoqinOnehours || 0 }} 次</span>
              </div>
              <div class="data-row">
                <span class="label">迟到早退2小时内:</span>
                <span class="value">{{ kaoqin.kaoqinTwohours || 0 }} 次</span>
              </div>
              <div class="data-row">
                <span class="label">迟到早退3小时内:</span>
                <span class="value">{{ kaoqin.kaoqinThreehours || 0 }} 次</span>
              </div>
              <div class="data-row">
                <span class="label">请假半天:</span>
                <span class="value">{{ kaoqin.kaoqinBantian || 0 }} 次</span>
              </div>
              <div class="data-row">
                <span class="label">请假一天:</span>
                <span class="value">{{ kaoqin.kaoqinQingjia || 0 }} 天</span>
              </div>
            </div>

            <!-- 右侧：薪资信息 -->
            <div class="right-section">
              <div class="section-title">薪资信息</div>
              <div class="data-row">
                <span class="label">教师底薪:</span>
                <span class="value">{{ formatMoney(kaoqin.kaoqinTeachernum) }}</span>
              </div>
              <div class="data-row">
                <span class="label">全勤奖:</span>
                <span class="value">{{ formatMoney(kaoqin.kaoqinKaoqinnum) }}</span>
              </div>
              <div class="data-row highlight">
                <span class="label">考勤应发金额:</span>
                <span class="value" style="color: #67C23A; font-weight: bold">
                  {{ formatMoney(kaoqin.kaoqinKaoqinnum) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <div class="empty-card" v-if="!kaoqin.kaoqinId">
        <el-empty description="暂无考勤数据"></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "KaoqinTeacher",
  data() {
    return {
      kaoqin: {},
      teacherId: localStorage.getItem("teacherId"),
      month: this.getCurrentMonth(),
    };
  },
  created() {
    this.get();
  },
  methods: {
    getCurrentMonth () {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      return `${year}-${month}`;
    },
    get () {
      this.request.get("/kaoqin/getteacher", {
        params: {
          teacherId: this.teacherId,
          date: this.month,
        },
        })
        .then((res) => {
          this.kaoqin = res.data;
        });
    },
    flushed () {
      this.get();
      this.$message.success("数据已刷新");
    },
    formatMoney (value) {
      if (value === null || value === undefined) return "0.00";
      return parseFloat(value).toFixed(2);
    },
  },
};
</script>

<style scoped>
.kaoqin-container {
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

.kaoqin-card {
  width: 100%;
  max-width: 900px; /* 稍微加宽卡片 */
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

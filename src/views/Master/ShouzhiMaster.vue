<template>
  <div class="shouzhi-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>收支管理</el-breadcrumb-item>
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
      <el-button style="float: right" @click="add" icon="el-icon-plus">保存</el-button>
    </div>

    <!-- 收支卡片展示 -->
    <div class="card-container">
      <el-card class="shouzhi-card" v-if="ShouzhiData">
        <div slot="header" class="clearfix">
          <span>{{ month }} 收支明细</span>
          <el-button
            style="float: right; padding: 3px 0"
            type="text"
            @click="editDialogVisible = true"
            icon="el-icon-edit"
          >编辑</el-button>
        </div>

        <div class="card-content">
          <div class="section-title">收入项</div>
          <div class="data-row">
            <span class="label">绩效收入:</span>
            <span class="value">{{ formatMoney(ShouzhiData.shouzhiJixiao) }}</span>
          </div>
          <div class="data-row">
            <span class="label">其他收入:</span>
            <span class="value">{{ formatMoney(ShouzhiData.shouzhiShou) }}</span>
          </div>

          <div class="section-title divider">支出项</div>
          <div class="data-row">
            <span class="label">工资支出:</span>
            <span class="value">{{ formatMoney(ShouzhiData.shouzhiGongzi) }}</span>
          </div>
          <div class="data-row">
            <span class="label">房租支出:</span>
            <span class="value">{{ formatMoney(ShouzhiData.shouzhiFangzu) }}</span>
          </div>
          <div class="data-row">
            <span class="label">物业支出:</span>
            <span class="value">{{ formatMoney(ShouzhiData.shouzhiWuye) }}</span>
          </div>
          <div class="data-row">
            <span class="label">水电支出:</span>
            <span class="value">
              水: {{ formatMoney(ShouzhiData.shouzhiShui) }} /
              电: {{ formatMoney(ShouzhiData.shouzhiDian) }}
            </span>
          </div>
          <div class="data-row">
            <span class="label">其他支出:</span>
            <span class="value">{{ formatMoney(ShouzhiData.shouzhiZhi) }}</span>
          </div>

          <div class="section-title divider">汇总</div>
          <div class="data-row highlight">
            <span class="label">总收入:</span>
            <span class="value">{{ formatMoney(calculateTotalIncome()) }}</span>
          </div>
          <div class="data-row highlight">
            <span class="label">总支出:</span>
            <span class="value">{{ formatMoney(calculateTotalExpense()) }}</span>
          </div>
          <div class="data-row highlight">
            <span class="label">纯利润:</span>
            <span class="value" :style="{color: calculateBalance() >= 0 ? '#67C23A' : '#F56C6C'}">
              {{ formatMoney(ShouzhiData.shouzhiNum || calculateBalance()) }}
            </span>
          </div>


        </div>
      </el-card>

      <el-card class="summary-card" v-if="ShouzhiData">
        <div slot="header" class="clearfix">
          <span>收支分析</span>
        </div>
        <div class="summary-content">
          <el-progress
            type="dashboard"
            :percentage="calculatePercentage()"
            :color="percentageColor"
            :format="formatPercentage"
          ></el-progress>
          <div class="summary-text">
            <p><i class="el-icon-money"></i> 总收入: {{ formatMoney(calculateTotalIncome()) }}</p>
            <p><i class="el-icon-sold-out"></i> 总支出: {{ formatMoney(calculateTotalExpense()) }}</p>
            <p><i class="el-icon-data-line"></i> 结余:
              <span :style="{color: calculateBalance() >= 0 ? '#67C23A' : '#F56C6C'}">
                {{ formatMoney(calculateBalance()) }}
              </span>
            </p>
          </div>
        </div>
        <div class="section-title divider">备注</div>
        <div class="remarks">
          {{ ShouzhiData.shouzhiRemake || '无备注信息' }}
        </div>
      </el-card>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑收支信息" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="ShouzhiData" label-width="120px">
        <el-divider content-position="left">收入项</el-divider>
        <el-form-item label="其他收入">
          <el-input-number
            v-model="ShouzhiData.shouzhiShou"
            :precision="2"
            :step="100"
            :min="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>

        <el-divider content-position="left">支出项</el-divider>
        <el-form-item label="房租支出">
          <el-input-number
            v-model="ShouzhiData.shouzhiFangzu"
            :precision="2"
            :step="100"
            :min="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="物业支出">
          <el-input-number
            v-model="ShouzhiData.shouzhiWuye"
            :precision="2"
            :step="100"
            :min="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="水费支出">
          <el-input-number
            v-model="ShouzhiData.shouzhiShui"
            :precision="2"
            :step="10"
            :min="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="电费支出">
          <el-input-number
            v-model="ShouzhiData.shouzhiDian"
            :precision="2"
            :step="10"
            :min="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="其他支出">
          <el-input-number
            v-model="ShouzhiData.shouzhiZhi"
            :precision="2"
            :step="100"
            :min="0"
            controls-position="right"
          ></el-input-number>
        </el-form-item>

        <el-divider content-position="left">其他信息</el-divider>
        <el-form-item label="备注信息">
          <el-input
            v-model="ShouzhiData.shouzhiRemake"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="update">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ShouzhiMaster",
  data () {
    return {
      ShouzhiData: {},
      masterId: localStorage.getItem("masterId"),
      month: this.getCurrentMonth(),
      editDialogVisible: false
    }
  },
  computed: {
    percentageColor() {
      const percentage = this.calculatePercentage();
      if (percentage > 80) return '#F56C6C'; // 支出占比高显示红色
      if (percentage > 50) return '#E6A23C'; // 中等显示黄色
      return '#67C23A'; // 低占比显示绿色
    }
  },
  created () {
    this.get()
  },
  methods: {
    getCurrentMonth () {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    },
    get () {
      this.request.get("/shouzhi/createmaster", {
        params: {
          masterId: this.masterId,
          date: this.month
        }
      }).then(res=> {
        this.ShouzhiData = res.data;
      })
      this.request.get("/shouzhi/get", {
        params: {
          masterId: this.masterId,
          date: this.month
        }
      }).then(res => {
        this.ShouzhiData = res.data;
      })
    },
    flushed () {
      this.request.get("/shouzhi/flushedmaster", {
        params: {
          masterId: this.masterId,
          date: this.month
        }
      }).then(res => {
        console.log(res);
        this.$message.success('数据已刷新');
        this.get();
      })
    },
    update () {
      // 更新前重新计算纯利润
      this.ShouzhiData.shouzhiNum = this.calculateBalance();

      console.log(this.ShouzhiData);
      this.request.post("/shouzhi/update", this.ShouzhiData
      ).then(res => {
        this.$message.success('更新成功');
        this.editDialogVisible = false;
        this.get();
      }).catch(() => {
        this.$message.error('更新失败');
      });
    },
    calculateTotalIncome () {
      const jixiao = this.ShouzhiData.shouzhiJixiao || 0;
      const shou = this.ShouzhiData.shouzhiShou || 0;
      return jixiao + shou;
    },
    calculateTotalExpense () {
      const gongzi = this.ShouzhiData.shouzhiGongzi || 0;
      const fangzu = this.ShouzhiData.shouzhiFangzu || 0;
      const wuye = this.ShouzhiData.shouzhiWuye || 0;
      const shui = this.ShouzhiData.shouzhiShui || 0;
      const dian = this.ShouzhiData.shouzhiDian || 0;
      const zhi = this.ShouzhiData.shouzhiZhi || 0;
      return gongzi + fangzu + wuye + shui + dian + zhi;
    },
    calculateBalance () {
      return this.calculateTotalIncome() - this.calculateTotalExpense();
    },
    calculatePercentage () {
      const income = this.calculateTotalIncome();
      const expense = this.calculateTotalExpense();
      if (income === 0) return 0;
      const percentage = Math.round((expense / income) * 100);
      return Math.min(percentage, 100); // 不超过100%
    },
    formatPercentage (percentage) {
      return `支出占比: ${percentage}%`;
    },
    formatMoney (value) {
      if (value === null || value === undefined) return '0.00';
      return parseFloat(value).toFixed(2);
    },
    add(){
      this.request.post('/shouzhi/ctrls',this.ShouzhiData).then(res => {
        if(res.really){
          this.$message.success("保存成功")
          this.get()
        }else{
          this.$message.error(res.data)
        }
      })
    }
  }
}
</script>

<style scoped>
/* 样式部分保持不变，与之前相同 */
.shouzhi-container {
  padding: 0;
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
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.month-picker {
  margin-right: 15px;
  width: 200px;
}

.card-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.shouzhi-card {
  flex: 1;
  min-width: 450px;
}

.summary-card {
  width: 350px;
}

.card-content {
  padding: 10px;
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
  min-width: 100px;
}

.value {
  color: #303133;
  text-align: right;
  flex: 1;
}

.remarks {
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 4px;
  margin-top: 10px;
  color: #666;
}

.summary-content {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px;
}

.summary-text {
  margin-left: 20px;
}

.summary-text p {
  margin: 15px 0;
  font-size: 16px;
}

.summary-text i {
  margin-right: 8px;
  color: #409EFF;
}

@media (max-width: 768px) {
  .card-container {
    flex-direction: column;
  }

  .shouzhi-card, .summary-card {
    min-width: 100%;
  }

  .summary-content {
    flex-direction: column;
  }

  .summary-text {
    margin-left: 0;
    margin-top: 20px;
  }
}
</style>

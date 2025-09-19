<template>
  <div class="othercoll-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>其他工资管理</el-breadcrumb-item>
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
      <el-button type="primary" @click="getData" icon="el-icon-search">查询</el-button>
      <el-button @click="initData" icon="el-icon-plus">初始化</el-button>
      <el-button
        type="success"
        @click="saveData"
        icon="el-icon-check"
        :disabled="tableData.othercollState === 1"
      >保存确认</el-button>
    </div>

    <!-- 其他工资卡片展示 -->
    <div class="card-container">
      <el-card class="othercoll-card" v-if="tableData.othercollId">
        <div slot="header" class="clearfix">
          <span>{{ month }} 其他工资明细</span>
          <el-tag
            :type="tableData.othercollState === 1 ? 'success' : 'warning'"
            size="small"
          >
            {{ tableData.othercollState === 1 ? '已确认' : '未确认' }}
          </el-tag>
        </div>

        <div class="card-content">
          <div class="content-grid">
            <!-- 左侧：工资信息 -->
            <div class="left-section">
              <div class="section-title">工资信息</div>
              <div class="data-row">
                <span class="label">校长工资:</span>
                <span class="value">{{ formatMoney(tableData.othercollMastercoll) }}</span>
              </div>
              <div class="data-row">
                <span class="label">其他工资:</span>
                <span class="value">{{ formatMoney(tableData.othercollOthercoll) }}</span>
              </div>
              <div class="data-row highlight">
                <span class="label">工资总额:</span>
                <span class="value" style="color: #67C23A; font-weight: bold">
                  {{ formatMoney(calculateTotal()) }}
                </span>
              </div>
            </div>

            <!-- 右侧：状态和备注信息 -->
            <div class="right-section">
              <div class="section-title">状态信息</div>
              <div class="data-row">
                <span class="label">当前状态:</span>
                <span class="value">
                  <el-tag
                    :type="tableData.othercollState === 1 ? 'success' : 'warning'"
                    size="small"
                  >
                    {{ tableData.othercollState === 1 ? '已确认' : '未确认' }}
                  </el-tag>
                </span>
              </div>

              <div class="section-title divider">备注信息</div>
              <div class="remarks">
                {{ tableData.othercollRemake || '无备注信息' }}
              </div>
            </div>
          </div>

          <!-- 编辑区域（仅未确认状态可编辑） -->
          <div v-if="tableData.othercollState !== 1" class="edit-section">
            <el-divider content-position="left">编辑信息</el-divider>
            <el-form :model="form" label-width="120px">
              <el-form-item label="校长工资">
                <el-input-number
                  v-model="form.othercollMastercoll"
                  :precision="2"
                  :step="1000"
                  :min="0"
                  controls-position="right"
                  style="width: 200px"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="其他工资">
                <el-input-number
                  v-model="form.othercollOthercoll"
                  :precision="2"
                  :step="1000"
                  :min="0"
                  controls-position="right"
                  style="width: 200px"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="备注信息">
                <el-input
                  v-model="form.othercollRemake"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入备注信息"
                  style="width: 300px"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateData">更新数据</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>

      <div class="empty-card" v-if="!tableData.othercollId">
        <el-empty description="暂无其他工资数据">
          <el-button type="primary" @click="initData">初始化数据</el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OthercollManager",
  data() {
    return {
      tableData: {},
      month: this.getCurrentMonth(),
      form: {
        othercollMastercoll: 0,
        othercollOthercoll: 0,
        othercollRemake: ''
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getCurrentMonth() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    },

    // 获取数据
    getData() {
      this.request.get('/othercoll/selectmaster', {
        params: {
          masterId: localStorage.getItem("masterId"),
          date: this.month
        }
      }).then(res => {
        if (res.data) {
          this.tableData = res.data;
          this.form = {
            othercollMastercoll: res.data.othercollMastercoll || 0,
            othercollOthercoll: res.data.othercollOthercoll || 0,
            othercollRemake: res.data.othercollRemake || ''
          };
        }
      });
    },

    // 初始化数据
    initData() {
      this.request.get('/othercoll/begin', {
        params: {
          masterId: localStorage.getItem("masterId"),
          date: this.month
        }
      }).then(res => {
        if (res.really) {
          this.$message.success('初始化成功');
          this.getData();
        } else {
          this.$message.info(res.data);
        }
      });
    },

    // 更新数据
    updateData() {
      const updateData = {
        ...this.tableData,
        ...this.form
      };

      this.request.post('/othercoll/uploadmaster', updateData)
        .then(res => {
          if (res.really) {
            this.$message.success('更新成功');
            this.getData();
          } else {
            this.$message.error(res.data);
          }
        });
    },

    // 保存确认
    saveData() {
      this.request.get('/othercoll/ctrls', {
        params: {
          masterId: localStorage.getItem("masterId"),
          date: this.month
        }
      }).then(res => {
        if (res.really) {
          this.$message.success('保存确认成功');
          this.getData();
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 计算总额
    calculateTotal() {
      const master = this.tableData.othercollMastercoll || 0;
      const other = this.tableData.othercollOthercoll || 0;
      return master + other;
    },

    formatMoney(value) {
      if (value === null || value === undefined) return "0.00";
      return parseFloat(value).toFixed(2);
    }
  }
};
</script>

<style scoped>
.othercoll-container {
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
  gap: 10px;
}

.month-picker {
  width: 200px;
}

.card-container {
  display: flex;
  justify-content: center;
}

.othercoll-card {
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
  margin-bottom: 20px;
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

.edit-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .query-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .month-picker {
    width: 100%;
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

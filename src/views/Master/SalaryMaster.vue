<template>
  <div>
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
      <el-button @click="add" icon="el-icon-refresh">保存</el-button>
    </div>

    <el-table :data="SalaryData" border stripe :header-cell-class-name="'headerBG'">
      <el-table-column prop="salaryTeachername" label="老师姓名"></el-table-column>
      <el-table-column prop="salaryDixin" label="底薪"></el-table-column>
      <el-table-column prop="salaryKaoqin" label="考勤"></el-table-column>
      <el-table-column prop="salaryJixiao" label="绩效"></el-table-column>
      <el-table-column prop="salaryJixiaonum" label="绩效奖金"></el-table-column>
      <el-table-column prop="salaryTicheng" label="邀约提成"></el-table-column>
      <el-table-column prop="salaryBaoxian" label="保险扣除"></el-table-column>
      <el-table-column prop="salaryGongling" label="工龄"></el-table-column>
      <el-table-column prop="salaryGongsalary" label="工龄奖金"></el-table-column>
      <el-table-column prop="salaryGufen" label="股份分红"></el-table-column>
      <el-table-column prop="salaryExtra" label="其他奖罚"></el-table-column>
      <el-table-column prop="salaryNum" label="薪资"></el-table-column>
      <el-table-column prop="salaryEndnum" label="实发薪资"></el-table-column>
      <el-table-column prop="salaryRemake" label="备注"></el-table-column>
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button type="warning" @click="upload(scope.row)">编辑<i class="el-icon-edit"></i></el-button>
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

    <!--        修改弹窗-->
    <el-dialog title="学生信息" :visible.sync="xiuwindows" width="30%">
      <el-form label-width="80px" size="big">
        <el-form-item label="ID" style="display: none">
          <el-input v-model="form.salaryId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="其他奖罚">
          <el-input v-model="form.salaryExtra" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.salaryRemake" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="xiuwindows = false">取 消</el-button>
        <el-button type="primary" @click="savexiugai">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SalaryMaster",
  data () {
    return {
      pageNum: 1,
      pageSize: 6,
      total: 0,
      masterId: localStorage.getItem("masterId"),
      month: this.getCurrentMonth(),
      SalaryData: [],
      form: {},
      xiuwindows: false
    }
  },
  created () {
    this.flushed()
    this.get()
  },
  methods: {
    getCurrentMonth () {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    },
    handleSizeChange(pageSize){//点击下方分页，请求查询
      this.pageSize = pageSize
      this.get()
    },
    handleCurrentChange(pageNum){//点击下方分页，请求查询
      this.pageNum = pageNum
      this.get()
    },
    get(){
      this.request.get("salary/pagemaster", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          masterId: this.masterId,
          date: this.month,
        }
      }).then(res => {
        this.SalaryData = res.records
        this.total = res.total
      })
    },
    upload(row){
      this.form = row
      this.xiuwindows = true
    },
    savexiugai(){
      this.request.post("salary/updata", this.form).then(res => {
        this.xiuwindows = false
        this.flushed()
      })
    },
    flushed(){
      console.log(this.month)
      console.log(this.masterId)
      this.request.get("salary/flushedmaster", {
        params:{
          masterId: this.masterId,
          date: this.month
        }
      }).then(res => {
        if (res.really){
          this.$message.success('数据已刷新');
          this.get()
        }
      })
    },
    add(){
      this.request.get("salary/ctrls", {
        params:{
          masterId: this.masterId,
          date: this.month
        }
      }).then(res => {
        if (res.really){
          this.$message.success('数据已保存');
          this.get()
        }
      })
    }
  },
  components: {
  }
}
</script>

<style scoped>
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
</style>

<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>考勤管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="padding: 10px 0;margin-bottom: 40px" >
      <el-date-picker
        value-format="yyyy-MM"
        v-model="month"
        type="month"
        placeholder="选择月">
      </el-date-picker>
      <el-button type="primary" @click="load">查询</el-button>
    </div>

    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBG'">
      <el-table-column prop="kaoqinTeachername" label="老师姓名"></el-table-column>
      <el-table-column prop="kaoqinYing" label="应上天数"></el-table-column>
      <el-table-column prop="kaoqinDays" label="考勤天数"></el-table-column>
      <el-table-column prop="kaoqinQingjia" label="请假次数"></el-table-column>
      <el-table-column prop="kaoqinTentime" label="迟到早退10分钟内次数"></el-table-column>
      <el-table-column prop="kaoqinOnehours" label="迟到早退1小时内次数"></el-table-column>
      <el-table-column prop="kaoqinTwohours" label="迟到早退2小时内次数"></el-table-column>
      <el-table-column prop="kaoqinThreehours" label="迟到早退3小时内次数"></el-table-column>
      <el-table-column prop="kaoqinBantian" label="请假半天次数"></el-table-column>
      <el-table-column prop="kaoqinTeachernum" label="底薪"></el-table-column>
      <el-table-column prop="kaoqinKaoqinnum" label="全勤奖"></el-table-column>
      <el-table-column prop="kaoqinNum" label="共计"></el-table-column>
      <el-table-column label="操作" width="168">
        <template slot-scope="scope">
          <el-button
            type="warning"
            @click="userhandleEdit(scope.row)"
            :disabled="scope.row.kaoqinState === 1">
            编辑<i class="el-icon-edit"></i>
          </el-button>
          <el-button
            type="danger"
            @click="userdelzq(scope.row)"
            :disabled="scope.row.kaoqinState === 1">
            保存
          </el-button>
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

    <!--        修改弹窗-->
    <el-dialog title="考勤信息" :visible.sync="dialogFormVisiblexiugai" width="30%">
      {{this.form.kaoqinTeachername}}
      <el-form label-width="80px" size="big">
        <el-form-item label="ID" style="display: none"><el-input v-model="form.kaoqinId" autocomplete="off"></el-input></el-form-item>
        <el-form-item label="应上天数"><el-input v-model="form.kaoqinYing" autocomplete="off"></el-input></el-form-item>
        <el-form-item label="考勤天数"><el-input v-model="form.kaoqinDays" autocomplete="off"></el-input></el-form-item>
        <el-form-item label="请假次数"><el-input v-model="form.kaoqinQingjia" autocomplete="off"></el-input></el-form-item>
        <el-form-item label="迟到早退10分钟内次数"><el-input v-model="form.kaoqinTentime" autocomplete="off"></el-input></el-form-item>
        <el-form-item label="迟到早退1小时内次数"><el-input v-model="form.kaoqinOnehours" autocomplete="off"></el-input></el-form-item>
        <el-form-item label="迟到早退2小时内次数"><el-input v-model="form.kaoqinTwohours" autocomplete="off"></el-input></el-form-item>
        <el-form-item label="迟到早退3小时内次数"><el-input v-model="form.kaoqinThreehours" autocomplete="off"></el-input></el-form-item>
        <el-form-item label="请假半天次数"><el-input v-model="form.kaoqinBantian" autocomplete="off"></el-input></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblexiugai = false">取 消</el-button>
        <el-button type="primary" @click="savexiugai">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "teachermaster",
  data(){
    return{
      tableData: [],
      total: 0,
      pageNum:1,
      pageSize:6,
      month:this.getCurrentMonth(),
      dialogFormVisiblexiugai: false,
      form:{}
    }
  },
  created() {
    //请求分页查询数据
    this.load()
  },
  methods:{
    getCurrentMonth() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    },
    load(){
      this.request.get('/kaoqin/pagemaster',{
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          masterId:localStorage.getItem("masterId"),
          date:this.month
        }
      }).then(res =>{
        console.log(res)
        this.tableData = res.records
        this.total = res.total
      })
    },
    //修改

    savexiugai(){
      this.request.post('/kaoqin/uploadmaster',this.form).then(res => {
        if(res.really){
          this.$message.success("保存成功")
          this.dialogFormVisiblexiugai = false
          this.load()
        }else{
          this.$message.error(res.data)
        }
      })
    },

    //编辑，传参
    userhandleEdit(row){
      this.form = row
      console.log(this.form)
      this.dialogFormVisiblexiugai = true
    },
    handleSizeChange(pageSize){//点击下方分页，请求查询
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum){//点击下方分页，请求查询
      this.pageNum = pageNum
      this.load()
    },
    userdelzq(row){
      this.request.post('/kaoqin/ctrls',row).then(res => {
        if(res.really){
          this.$message.success("保存成功")
          this.load()
        }else{
          this.$message.error(res.data)
        }
      })
    }
  }
}
</script>

<style>
.headerBG{
  background: #ccc;
}
</style>

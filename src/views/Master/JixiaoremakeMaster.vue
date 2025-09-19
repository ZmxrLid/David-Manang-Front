<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>绩效管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="padding: 10px 0;margin-bottom: 40px" >
      <el-date-picker
        value-format="yyyy-MM"
        v-model="month"
        type="month"
        placeholder="选择月">
      </el-date-picker>
      <el-button type="primary" @click="begin">查询</el-button>
      <el-button @click="flushed" icon="el-icon-refresh">刷新</el-button>
    </div>

    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBG'">
      <el-table-column prop="jixiaoremakeTeachername" label="老师姓名"></el-table-column>
      <el-table-column prop="jixiaoremakeClassnum" label="本月上课数"></el-table-column>
      <el-table-column prop="jixiaoremakeStudentnum" label="本月所教学生数"></el-table-column>
      <el-table-column prop="jixiaoremakeKouchu" label="扣除绩效"></el-table-column>
      <el-table-column prop="jixiaoremakeJixiao" label="产生绩效"></el-table-column>
      <el-table-column prop="jixiaoremakeRemake" label="备注"></el-table-column>
      <el-table-column label="操作" width="168">
        <template slot-scope="scope">
          <el-button
            type="warning"
            @click="userhandleEdit(scope.row)"
            :disabled="scope.row.jixiaoremakeState === 1">
            编辑<i class="el-icon-edit"></i>
          </el-button>
          <el-button
            type="danger"
            @click="userdelzq(scope.row)"
            :disabled="scope.row.jixiaoremakeState === 1">
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
      {{this.form.jixiaoremakeTeachername}}
      <el-form label-width="80px" size="big">
        <el-form-item label="ID" style="display: none"><el-input v-model="form.jixiaoremakeId" autocomplete="off"></el-input></el-form-item>
        <el-form-item label="扣除绩效"><el-input v-model="form.jixiaoremakeKouchu" autocomplete="off"></el-input></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.jixiaoremakeRemake" autocomplete="off"></el-input></el-form-item>
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
    this.begin()
  },
  methods:{
    getCurrentMonth() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      return `${year}-${month}`;
    },
    begin(){
      this.request.get('/jixiaoremake/begin',{
        params:{
          masterId:localStorage.getItem("masterId"),
          date:this.month
        }
      }).then(res =>{
        if (res.really){
          this.load()
        }else {
          this.$message.error(res.data)
        }
      })
    },
    load(){
      this.request.get('/jixiaoremake/pagemaster',{
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
      this.request.post('/jixiaoremake/uploadmaster',this.form).then(res => {
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
      this.request.post('/jixiaoremake/ctrls',row).then(res => {
        if(res.really){
          this.$message.success("保存成功")
          this.load()
        }else{
          this.$message.error(res.data)
        }
      })
    },
    flushed(){
      this.request.get('/jixiaoremake/flushedmaster',{
        params:{
          masterId:localStorage.getItem("masterId"),
          date:this.month
        }
      }).then(res =>{
        this.load()
      })
    }
  }
}
</script>

<style>

</style>

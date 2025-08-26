<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>老师管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="padding: 10px 0;margin-bottom: 40px" >
      <el-button class="ml-5" type="success" style="float: right" @click="handleAdd">新增<i class="el-icon-circle-plus-outline"></i></el-button>
      <el-button class="ml-5" type="primary" style="float: right" @click="load">搜索</el-button>
      <el-input placeholder="请输入" style="width: 200px;float: right" suffix-icon="el-icon-search" v-model="teacherName"></el-input>
    </div>

    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBG'">
      <el-table-column prop="teacherName" label="老师名">
      </el-table-column>
      <el-table-column prop="teacherTel" label="电话">
      </el-table-column>
      <el-table-column prop="teacherTime" label="入职时间">
      </el-table-column>
      <el-table-column prop="teacherNum" label="底薪">
      </el-table-column>
      <el-table-column prop="teacherBaostate" label="保险状态">
        <template slot-scope="scope">
    <span :style="{ color: scope.row.teacherBaostate === 1 ? 'green' : 'red' }">
      {{ scope.row.teacherBaostate === 1 ? '有' : '无' }}
    </span>
        </template>
      </el-table-column>
      <el-table-column prop="teacherBaonum" label="保险金额">
      </el-table-column>
      <el-table-column prop="teacherBaogong" label="公司承担">
      </el-table-column>
      <el-table-column prop="teacherJixiao" label="绩效区间">
      </el-table-column>
      <el-table-column prop="teacherKaoqin" label="全勤奖">
      </el-table-column>
      <el-table-column prop="teacherGu" label="持有股份">
      </el-table-column>
      <el-table-column label="操作" width="168">
        <template slot-scope="scope">
          <el-button type="warning" @click="userhandleEdit(scope.row)">编辑<i class="el-icon-edit"></i></el-button>
          <el-button type="danger" @click="userdelzq(scope.row.teacherId)">离职<i class="el-icon-remove-outline"></i></el-button>
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

    <!--        插入弹窗-->
    <el-dialog title="老师信息" :visible.sync="dialogFormVisible" width="40%">
      <el-form label-width="80px" size="big">
        <el-form-item label="老师名">
          <el-input v-model="form.teacherName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="老师电话">
          <el-input v-model="form.teacherTel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="form.teacherTime"
            type="date"
            placeholder="入职时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="底薪">
          <el-input v-model="form.teacherNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保险状态">
          <el-select v-model="form.teacherBaostate" placeholder="请选择保险状态">
            <el-option label="无" :value="0"></el-option>
            <el-option label="有" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保险金额">
          <el-input v-model="form.teacherBaonum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司承担">
          <el-input v-model="form.teacherBaogong" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="绩效区间">
          <el-input v-model="form.teacherJixiao" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="全勤奖">
          <el-input v-model="form.teacherKaoqin" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="持有股份">
          <el-input v-model="form.teacherGu" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="初始密码">
          <el-input v-model="form.teacherPassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>


    <!--        修改弹窗-->
    <el-dialog title="老师信息" :visible.sync="dialogFormVisiblexiugai" width="30%">
      <el-form label-width="80px" size="big">
        <el-form-item label="ID" style="display: none">
          <el-input v-model="form.teacherId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="老师名">
          <el-input v-model="form.teacherName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="老师电话">
          <el-input v-model="form.teacherTel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="form.teacherTime"
            type="date"
            placeholder="入职时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="底薪">
          <el-input v-model="form.teacherNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="保险状态">
          <el-select v-model="form.teacherBaostate" placeholder="请选择保险状态">
            <el-option label="无" :value="0"></el-option>
            <el-option label="有" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保险金额">
          <el-input v-model="form.teacherBaonum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="公司承担">
          <el-input v-model="form.teacherBaogong" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="绩效区间">
          <el-input v-model="form.teacherJixiao" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="全勤奖">
          <el-input v-model="form.teacherKaoqin" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="持有股份">
          <el-input v-model="form.teacherGu" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.teacherPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="password" autocomplete="off"></el-input>
        </el-form-item>
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
      visible: false,
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse:false,
      sideWidth: 200,
      logo:true,
      logo_s:false,
      teacherName:"",

      // 新增用户相关
      // 默认不展示，弹窗
      dialogFormVisible:false,

      //修改用户相关
      dialogFormVisiblexiugai:false,
      form:{},
      password:"",
    }
  },
  created() {
    //请求分页查询数据
    this.load()
  },
  methods:{
    load(){
      this.request.get('/teacher/teacherByMaster',{
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          masterId:localStorage.getItem("masterId"),
          teacherName:this.teacherName
        }
      }).then(res =>{
        console.log(res)
        this.tableData = res.records
        for (let i = 0; i < this.tableData.length; i++){
          if (this.tableData.teacherState === 0){
            delete this.tableData[i]
          }
        }
        this.total = res.total
      })
    },

    // 保存用户信息
    save(){
      this.form.teacherMasterid = localStorage.getItem("masterId")
      this.form.teacherState = 1
      console.log(this.form)
      this.request.post('/teacher/add',this.form).then(res => {
        if(res){
          this.$message.success("保存成功")
          this.dialogFormVisible = false
          this.load()
        }else{
          this.$message.error("保存失败")
        }
      })
    },

    //修改

    savexiugai(){
      if (this.password !== this.form.teacherPassword){
        this.$message.error("密码错误")
        return
      }else{
        console.log(this.form)
        this.request.post('/teacher/update',this.form).then(res => {
          if(res){
            this.$message.success("保存成功")
            this.dialogFormVisiblexiugai = false
            this.load()
          }else{
            this.$message.error("保存失败")
          }
        })
      }
    },

    //编辑，传参
    userhandleEdit(row){
      this.form = row
      console.log(this.form)
      this.dialogFormVisiblexiugai = true
    },

    //删除
    // usersq(){
    //   this.visibless = true
    // },

    userdelzq(id) {
      console.log(id)
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post("/teacher/delect?teacherId="+id).then(res =>{
          if (res){
            this.load()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }else {
            this.$message({
              type:"error",
              message:"删除失败"
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    handleAdd(){
      this.dialogFormVisible  = true;
      this.form = {};
    },
    handleSizeChange(pageSize){//点击下方分页，请求查询
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum){//点击下方分页，请求查询
      this.pageNum = pageNum
      this.load()
    }
  }
}
</script>

<style>
.headerBG{
  background: #ccc;
}
</style>

<template>
  <div class="main">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 10%"></div>
    <p class="pp">其用户名：{{masterName}}</p>
    <p class="pp" style="padding-left: 60%"><button @click="dialog = true">修改信息</button></p>
    <el-drawer
      title="请修改信息!"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
    >
      <div class="demo-drawer__content">
        <el-form :model="masterForm">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="masterForm.masterName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="masterForm.masterPassword" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="masterGenPassword" type="password" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer" style="margin-left: 35%;bottom: 20%">
          <el-button @click="cancelForm()">取 消</el-button>
          <el-button type="primary" @click="closeDrawer()">确 定</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Usermaster",
  data () {
    return {
      masterName: "",
      masterPassword: "",
      masterTime: "",
      masterState: "",
      masterId: "",
      masterForm: {
        masterName: "",
        masterPassword: "",
        masterId: ""
      },
      masterGenPassword: "",
      dialog: false,
      formLabelWidth: '80px',
    }
  },
  mounted () {
    this.kaishi()
  },
  methods: {
    kaishi () {
      this.request.get('/master/get?masterId=' + localStorage.getItem("masterId")).then(res => {
        if (res.really == true) {
          this.masterName = res.data.masterName
          this.masterPassword = res.data.masterPassword
          this.masterId = res.data.masterId
        }
      })
    },
    cancelForm () {
      this.dialog = false;
    },
    closeDrawer () {
      if (this.masterForm.masterPassword == "") {
        this.$message({
          type: 'error',
          message: '密码不能为空'
        })
        this.dialog = false;
      } else if (this.masterForm.masterPassword != this.masterGenPassword) {
        this.$message({
          type: 'error',
          message: '两次密码不一致'
        })
        this.dialog = false;
      } else {
        this.masterForm.masterId = this.masterId
        this.request.post('/master/update', this.masterForm).then(res => {
          if (res.really == true) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.kaishi()
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      }
      this.dialog = false;
    }
  }
}
</script>

<style>
.pp {
  margin: 10px;
  font-size: 20px;
  font-weight: bold;
  color: #606266;
  text-align: left;
  line-height: 50px;
  border-bottom: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
  padding-left: 10%;
}

.pp > button {
  margin-left: 10%;
  width: 100px;
  height: 40px;
  background-color: #409eff;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.5s;
  outline: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #66b1ff;
  }

  &:active {
    transform: scale(0.9);
  }

  &:focus {
    outline: none;
  }
}
</style>

<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>邀约记录</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="padding: 10px 0;margin-bottom: 40px">
      <el-button class="ml-5" type="success" style="float: right" @click="add">新增<i
        class="el-icon-circle-plus-outline"></i></el-button>
      <el-button class="ml-5" type="primary" style="float: right" @click="load">搜索</el-button>
      <el-input placeholder="输入名字" style="width: 150px;float: right" suffix-icon="el-icon-search"
                v-model="stuname"></el-input>
      <el-input placeholder="输入来源" style="width: 150px;float: right" suffix-icon="el-icon-search"
                v-model="from"></el-input>
      <el-input placeholder="输入邀约人" style="width: 150px;float: right" suffix-icon="el-icon-search"
                v-model="fromname"></el-input>
      <el-input placeholder="输入班级" style="width: 150px;float: right" suffix-icon="el-icon-search"
                v-model="classname"></el-input>
    </div>

    <!--        主要内容-->
    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBG'">
      <el-table-column prop="latentStuname" label="学生姓名" width="70">
      </el-table-column>
      <el-table-column prop="latentContact" label="家长姓名" width="100">
      </el-table-column>
      <el-table-column prop="latentTel" label="联系电话" width="120">
      </el-table-column>
      <el-table-column prop="latentStusex" label="性别" width="50">
      </el-table-column>
      <el-table-column prop="latentAge" label="年龄" width="50">
      </el-table-column>
      <el-table-column prop="latentClass" label="邀约班级" width="70">
      </el-table-column>
      <el-table-column prop="latentFrom" label="邀约来源" width="100">
      </el-table-column>
      <el-table-column label="状态" width="70">
        <template #default="scope">
          <div @click="editState(scope.row)" style="cursor: pointer;">
      <span :style="{...getStateStyle(scope.row.latentState), fontWeight: 'bold'}">
        {{ getStateText(scope.row.latentState) }}
      </span>
          </div>
        </template>
      </el-table-column>
      <!-- 备注列 -->
      <el-table-column label="备注" min-width="155">
        <template #default="scope">
          <div @click="editCell(scope.row, 'latentRemark')" style="cursor: pointer;">
      <span v-if="scope.row.editingField !== 'latentRemark'">
        {{ scope.row.latentRemark || '点击编辑' }}
      </span>
            <el-input
              v-else
              v-model="scope.row.latentRemark"
              @blur="saveEdit(scope.row, 'latentRemark')"
              @keyup.enter="saveEdit(scope.row, 'latentRemark')"
              size="mini"        style="width: 100%"
              autofocus
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="168">
        <template slot-scope="scope">
          <el-button type="primary" @click="collw(scope.row)">修改<i class="el-icon-edit"></i></el-button>
          <el-button type="danger" @click="deleteStudent(scope.row.latentId)">删除<i
            class="el-icon-remove-outline"></i></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="latentEndpeoplename" label="最后操作人" width="90">
      </el-table-column>
      <el-table-column prop="latentTime" label="最后操作时间"  width="150">
      </el-table-column>
      <!-- 邀约老师列 -->
      <el-table-column label="邀约老师" width="70">
        <template #default="scope">
          <div @click="editCell(scope.row, 'latentFromname')" style="cursor: pointer;">
      <span v-if="scope.row.editingField !== 'latentFromname'">
        {{ scope.row.latentFromname || '点击编辑' }}
      </span>
            <el-input
              v-else
              v-model="scope.row.latentFromname"
              @blur="saveEdit(scope.row, 'latentFromname')"
              @keyup.enter="saveEdit(scope.row, 'latentFromname')"
              size="mini"        style="width: 100%"
              autofocus
            />
          </div>
        </template>
      </el-table-column>

      <!-- 电话联系老师列 -->
      <el-table-column label="电话联系老师" width="100">
        <template #default="scope">
          <div @click="editCell(scope.row, 'latentTelname')" style="cursor: pointer;">
      <span v-if="scope.row.editingField !== 'latentTelname'">
        {{ scope.row.latentTelname || '点击编辑' }}
      </span>
            <el-input
              v-else
              v-model="scope.row.latentTelname"
              @blur="saveEdit(scope.row, 'latentTelname')"
              @keyup.enter="saveEdit(scope.row, 'latentTelname')"
              size="mini"        style="width: 100%"
              autofocus
            />
          </div>
        </template>
      </el-table-column>

      <!-- 试听课老师列 -->
      <el-table-column label="试听课老师" width="100">
        <template #default="scope">
          <div @click="editCell(scope.row, 'latentTeachername')" style="cursor: pointer;">
      <span v-if="scope.row.editingField !== 'latentTeachername'">
        {{ scope.row.latentTeachername || '点击编辑' }}
      </span>
            <el-input
              v-else
              v-model="scope.row.latentTeachername"
              @blur="saveEdit(scope.row, 'latentTeachername')"
              @keyup.enter="saveEdit(scope.row, 'latentTeachername')"
              size="mini"        style="width: 100%"
              autofocus
            />
          </div>
        </template>
      </el-table-column>

      <!-- 成交老师列 -->
      <el-table-column label="成交老师" width="70">
        <template #default="scope">
          <div @click="editCell(scope.row, 'latentTalkname')" style="cursor: pointer;">
      <span v-if="scope.row.editingField !== 'latentTalkname'">
        {{ scope.row.latentTalkname || '点击编辑' }}
      </span>
            <el-input
              v-else
              v-model="scope.row.latentTalkname"
              @blur="saveEdit(scope.row, 'latentTalkname')"
              @keyup.enter="saveEdit(scope.row, 'latentTalkname')"
              size="mini"        style="width: 100%"
              autofocus
            />
          </div>
        </template>
      </el-table-column>

      <!-- 宣讲课老师列 -->
      <el-table-column label="宣讲课老师" width="100">
        <template #default="scope">
          <div @click="editCell(scope.row, 'latentSpeech')" style="cursor: pointer;">
      <span v-if="scope.row.editingField !== 'latentSpeech'">
        {{ scope.row.latentSpeech || '点击编辑' }}
      </span>
            <el-input
              v-else
              v-model="scope.row.latentSpeech"
              @blur="saveEdit(scope.row, 'latentSpeech')"
              @keyup.enter="saveEdit(scope.row, 'latentSpeech')"
              size="mini"        style="width: 100%"
              autofocus
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="latentYtime" label="创建时间"  width="150">
      </el-table-column>
      <el-table-column prop="latentCtime" label="成交时间"  width="150">
      </el-table-column>
      <el-table-column prop="latentNum" label="邀约分成" width="100">
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

    <!--    修改弹窗-->
    <el-dialog title="学生信息" :visible.sync="dialogVisible" width="30%">
      <el-form label-width="80px" size="big">
        <el-form-item label="ID" style="display: none">
          <el-input v-model="form.latentId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-input v-model="form.latentStuname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生性别">
          <el-input v-model="form.latentStusex" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生年龄">
          <el-input v-model="form.latentAge" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="家长姓名">
          <el-input v-model="form.latentContact" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="家长电话">
          <el-input v-model="form.latentTel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="form.latentClass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邀约来源">
          <el-input v-model="form.latentFrom" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邀约分成">
          <el-input v-model="form.latentNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savexiugai">确 定</el-button>
      </div>
    </el-dialog>

    <!--    新增学生-->
    <el-dialog title="学生信息" :visible.sync="dialogadd" width="30%">
      <el-form label-width="80px" size="big">
        <el-form-item label="学生姓名">
          <el-input v-model="form.latentStuname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生性别">
          <el-input v-model="form.latentStusex" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生年龄">
          <el-input v-model="form.latentAge" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="家长姓名">
          <el-input v-model="form.latentContact" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="家长电话">
          <el-input v-model="form.latentTel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="form.latentClass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邀约老师">
          <el-input v-model="form.latentFromname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邀约来源">
          <el-input v-model="form.latentFrom" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邀约分成">
          <el-input v-model="form.latentNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogadd = false">取 消</el-button>
        <el-button type="primary" @click="saveadd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StudentTeacher',
  data () {
    return {
      pageNum: 1,
      pageSize: 6,
      total: 0,
      tableData: [],
      form: {},
      stuname : '',
      from : '',
      fromname : '',
      classname : '',
      dialogVisible : false,
      dialogadd : false,
    }
  },
  created () {
    this.load()
  },
  methods: {
    load () {
      this.request.get('latent/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          stuname: this.stuname,
          from: this.from,
          fromname: this.fromname,
          classname: this.classname,
          masterid: localStorage.getItem('masterId')
        }
      }).then(res => {
        if (res) {
          this.tableData = res.records
          this.total = res.total
        }
      })
    },
    formatTime (row, column, cellValue) {
      if (!cellValue) return ''
      // 如果是时间戳
      if (typeof cellValue === 'number') {
        return new Date(cellValue).toLocaleDateString('zh-CN')
      }
      // 如果是日期字符串
      if (typeof cellValue === 'string') {
        const date = new Date(cellValue)
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
      }
      return cellValue
    },
    handleSizeChange(pageSize){//点击下方分页，请求查询
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum){//点击下方分页，请求查询
      this.pageNum = pageNum
      this.load()
    },
    getStateText(state) {
      const stateMap = {
        0: '未邀约',
        1: '邀约成功',
        2: '邀约失败',
        3: '已转会员'
      };
      return stateMap[state] || '未知状态';
    },

    getStateStyle(state) {
      const styleMap = {
        0: { color: '#FFA500' }, // 黄色
        1: { color: '#008000' }, // 绿色
        2: { color: '#FF0000' }, // 红色
        3: { color: '#CCCCCC' }  // 灰色
      };
      return styleMap[state] || { color: '#000000' }; // 默认黑色
    },
    editCell(row, field) {
      // 设置当前编辑的字段
      this.$set(row, 'editingField', field);
    },

    saveEdit(row, field) {
      // 清除编辑状态
      this.$delete(row, 'editingField');

      row.latentEndpeoplename = localStorage.getItem('masterName')
      row.latentEndpeopleid = localStorage.getItem('masterId')
      // 发送更新请求到后端
      this.request.post('/latent/update', row).then(res => {
        if (res.really) {
          this.$message.success('更新成功');
          // 如果需要重新加载数据可以调用 this.load()
        } else {
          this.$message.error('更新失败');
        }
      }).catch(() => {
        this.$message.error('更新失败');
      });
    },
    deleteStudent(id) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.request.post('/latent/delete?latentId='+  id).then(res => {
          if (res.really) {
            this.$message.success('删除成功');
            this.load();
          } else {
            this.$message.error('删除失败');
          }
        }).catch(() => {
          this.$message.error('删除失败');
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    collw (row) {
      this.form = {}
      this.dialogVisible = true
      this.form = row
    },
    add () {
      this.form = {}
      this.dialogadd = true
      this.form.latentState = 0
      this.form.latentDelete = 0
      this.form.latentMasterid = localStorage.getItem('masterId')
    },
    savexiugai() {
      this.request.post('/latent/update', this.form).then(res => {
        if (res.really) {
          this.dialogVisible = false
          this.$message.success('更新成功');
          this.load();
        } else {
          this.dialogVisible = false
          this.$message.error('更新失败');
        }
      }).catch(() => {
        this.dialogVisible = false
        this.$message.error('更新失败');
      });
    },
    saveadd() {
      if (this.form.latentFromname=== ''){
        return
      }
      this.request.post('/latent/add', this.form).then(res => {
        if (res.really) {
          this.dialogadd = false
          this.$message.success('添加成功');
          this.load();
        } else {
          this.dialogadd = false
          this.$message.error('添加失败');
        }
      }).catch(() => {
        this.dialogadd = false
        this.$message.error('添加失败');
      });
    },
    editState(row) {
      // 已转会员（状态3）不可编辑
      if (row.latentState === 3) {
        return;
      }

      // 创建可选状态选项
      let options = [];
      switch (row.latentState) {
        case 0: // 未邀约
          options = [
            { value: 0, label: '未邀约' },
            { value: 1, label: '邀约成功' },
            { value: 2, label: '邀约失败' },
            { value: 3, label: '已转会员' }
          ];
          break;
        case 1: // 邀约成功
          options = [
            { value: 1, label: '邀约成功' },
            { value: 3, label: '已转会员' }
          ];
          break;
        case 2: // 邀约失败
          options = [
            { value: 2, label: '邀约失败' },
            { value: 1, label: '邀约成功' },
            { value: 3, label: '已转会员' }
          ];
          break;
        default:
          return;
      }

      // 使用自定义内容的弹窗
      this.$msgbox({
        title: '修改状态',
        message: `<div style="text-align: center;">
                <label for="state-select" style="display: block; margin-bottom: 10px;">请选择新的状态：</label>
                <select id="state-select" style="width: 100%; padding: 5px; border-radius: 4px; border: 1px solid #dcdfe6;">
                  ${options.map(option =>
          `<option value="${option.value}" ${row.latentState === option.value ? 'selected' : ''}>${option.label}</option>`
        ).join('')}
                </select>
              </div>`,
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const selectElement = document.getElementById('state-select');
            if (selectElement) {
              const newValue = parseInt(selectElement.value);
              if (newValue !== row.latentState) {
                // 更新状态
                row.latentState = newValue;

                // 更新最后操作人信息
                row.latentEndpeoplename = localStorage.getItem('teacherName');
                row.latentEndpeopleId = localStorage.getItem('teacherId');

                // 发送更新请求到后端
                this.request.post('/latent/update', row).then(res => {
                  if (res.really) {
                    this.$message.success('状态更新成功');
                    this.load(); // 重新加载数据以确保显示正确
                    done();
                  } else {
                    this.$message.error('状态更新失败');
                    done();
                  }
                }).catch(() => {
                  this.$message.error('状态更新失败');
                  done();
                });
              } else {
                done(); // 没有变化，直接关闭
              }
            } else {
              done();
            }
          } else {
            done();
          }
        }
      }).catch(() => {
        // 取消操作
      });
    }

  },
  components: {}
}
</script>

<style scoped>

</style>

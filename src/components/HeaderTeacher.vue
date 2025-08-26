<template>
  <div style="font-size: 12px; line-height: 60px; display: flex">

    <div style="flex: 1;font-size: 26px;">
      <span :class="collapseBtnClass" style="cursor: pointer" @click="collapse"></span>
    </div>

    <el-dropdown style="width: 100px;text-align: right; cursor: pointer">
      <span>{{teacherName}}</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <span style="text-decoration: none;" @click="logout">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    collapseBtnClass: String,
    collapse: Boolean,
    pathsName: String
  },
  data () {
    return {
      paths: [
      ],
      teacherName: localStorage.getItem('teacherName')
    }
  },
  methods: {
    logout () {
      this.$router.push('/')
      localStorage.removeItem('teacherId')
      localStorage.removeItem('userLv')
      localStorage.removeItem('teacherName')
      this.$message.success('退出成功')
    }
  }

}
</script>

<style scoped>

</style>

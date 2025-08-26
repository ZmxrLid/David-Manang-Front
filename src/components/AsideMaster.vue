<template>
  <el-menu :default-openeds="['0', '0']" style="height: 100%; overflow-x: hidden"
           background-color="#e58998"
           text-color="#fff"
           active-text-color="#837881"
           :collapse-transition="false"
           :collapse="isCollapse"
           router>
    <div style="height: 60px; line-height: 60px; text-align: center" class="logo_t">
      <img class="logo_t" src="../assets/Logo.png" style="height: 60px" v-show="logo">
      <img class="logo_t" src="../assets/Logo-s.png" style="height: 60px" v-show="logo_s">
    </div>
    <el-submenu index="1">
      <template slot="title"><i class="el-icon-s-promotion"></i>
        <span slot="title">销课管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/master/delete">消课管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="2">
      <template slot="title"><i class="el-icon-user-solid"></i>
        <span slot="title">人员管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/master/student">学生管理</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
        <el-menu-item index="/master/teacher">老师管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
<!--    <el-submenu index="3">-->
<!--      <template slot="title"><i class="el-icon-s-claim"></i>-->
<!--        <span slot="title">今日工作</span>-->
<!--      </template>-->
<!--      <el-menu-item-group>-->
<!--        <el-menu-item index="/master/today">今日工作</el-menu-item>-->
<!--      </el-menu-item-group>-->
<!--    </el-submenu>-->
<!--    <el-submenu index="4">-->
<!--      <template slot="title"><i class="el-icon-s-marketing"></i>-->
<!--        <span slot="title">本月工作</span>-->
<!--      </template>-->
<!--      <el-menu-item-group>-->
<!--        <el-menu-item index="/master/month">本月工作</el-menu-item>-->
<!--      </el-menu-item-group>-->
<!--    </el-submenu>-->
    <el-submenu index="5">
      <template slot="title"><i class="el-icon-s-finance"></i>
        <span slot="title">缴费记录</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/master/finance">缴费记录</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="9">
      <template slot="title"><i class="el-icon-s-shop"></i>
        <span slot="title">考勤记录</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/master/kaoqin">考勤记录</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="10">
      <template slot="title"><i class="el-icon-s-data"></i>
        <span slot="title">资金管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/master/shouzhi">收支情况</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
        <el-menu-item index="/master/salary">老师工资</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="6">
      <template slot="title"><i class="el-icon-s-management"></i>
        <span slot="title">课堂管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/master/class">课堂管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="8">
      <template slot="title"><i class="el-icon-phone"></i>
        <span slot="title">邀约记录</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/master/latent">邀约记录</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="7">
      <template slot="title"><i class="el-icon-s-tools"></i>
        <span slot="title">账号管理</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="/master/user">账号管理</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'AsideMaster',
  props: {
    isCollapse: Boolean,
    logo: true,
    logo_s: false
  }
}
</script>

<style scoped>

</style>

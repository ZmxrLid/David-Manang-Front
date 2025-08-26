<template>
  <el-container style="height: 100vh;">
    <el-aside :width="sideWidth+'px'" style="background-color: rgb(238, 241, 246); height: 100%; box-shadow: 2px 0 6px rgb(0 21 41/35%)" >
      <Aside :isCollapse="isCollapse" :logo="logo" :logo_s="logo_s"/>
    </el-aside>

    <el-container>
      <el-header style="border: 1px solid #ccc;" >
        <Header :collapseBtnClass="collapseBtnClass" :collapse="collapse"/>
      </el-header>
      <el-main>
        <!--        表示当前页面的子路由会在router-view里面展示-->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
// import {Axios, request} from "axios";
import Aside from '@/components/AsideMaster.vue'
import Header from '@/components/HeaderMaster.vue'
export default {
  name: 'ManageLeader',
  data () {
    return {
      collapseBtnClass: 'el-icon-s-unfold',
      isCollapse: true,
      sideWidth: 65,
      logo: false,
      logo_s: true
    }
  },
  components: {
    Aside,
    Header
  },
  methods: {
    collapse () {
      // 点击收缩按钮触发
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) { // 收缩
        this.sideWidth = 65
        this.collapseBtnClass = 'el-icon-s-unfold'
        this.logo = false
        this.logo_s = true
      } else { // 展开
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'
        this.logo = true
        this.logo_s = false
      }
    }
  }
}

</script>

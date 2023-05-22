<template>
  <div style="line-height: 60px; display: flex">
    <div style="flex: 1; ">
      <span :class="collapseBtnClass" style="cursor: pointer; font-size: 18px" @click="asideCollapse"></span>
<!--      页签-->
      <el-breadcrumb separator="/" style="display: inline-block; margin-left: 10px" >
        <el-breadcrumb-item :to="'/'">首页</el-breadcrumb-item>
        <el-breadcrumb-item >{{ currentPathName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-dropdown style="width: 100px; cursor: pointer; text-align: right">
      <div style="display: inline-block">
        <img :src="user.avatarUrl" alt=""
             style="width: 30px; border-radius: 50%; position: relative; top: 10px; right: 5px">
        <span>{{ user.nickname }}</span><i class="el-icon-arrow-down" style="margin-left: 5px"></i>
      </div>
      <el-dropdown-menu slot="dropdown" style="width: 100px; text-align: center">
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
<!--          text-decoration添加下划线-->
          <router-link to="/person" style="text-decoration: none">个人信息</router-link>
        </el-dropdown-item>
        <el-dropdown-item style="font-size: 14px; padding: 5px 0">
<!--          <router-link to="/login" style="text-decoration: none">退出</router-link>-->
          <span style="text-decoration: none" @click="logout">退出</span>
        </el-dropdown-item>

      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "Header",
  props:{
    // 变量，调用Header组件会将值传输过来
    collapseBtnClass: String,
    asideCollapse: Boolean,
    user: Object
  },
  computed: {
    currentPathName(){
      return this.$store.state.currentPathName;   // 需要监听的数据
    }
  },
  data(){
    return{
    }
  },
  watch:{ // 监听路由变化
    currentPathName(newVal, oldVal){
      console.log(newVal)
    }
  },
  methods:{
    logout(){
      this.$store.commit("logout")
      this.$message.success("退出成功")
    },
  }


}


</script>

<style scoped>

</style>
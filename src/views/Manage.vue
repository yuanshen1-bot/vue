<template>
    <el-container style="min-height: 100vh; ">
        <!--侧边栏设置-->
        <el-aside width="sideWidth + 'px'" style="background-color: rgb(238, 241, 246); height: 100%; overflow: hidden;
               box-shadow: 2px 0 6px rgb(0 21 41 / 35%);">
            <!--菜单栏-->
            <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow"></Aside>
        </el-aside>

        <el-container>
            <!--头部-->
            <el-header style="border-bottom: 1px solid #ccc;">
                <Header :collapseBtnClass="collapseBtnClass" @asideCollapse="collapse" :user="user"></Header>
            </el-header>
            <!--主体-->
            <el-main>
                <!--        表示当前页面的子路由会在router-view里面展示-->
                <router-view @refreshUser="getUser"></router-view>
            </el-main>

        </el-container>

    </el-container>
</template>


<!--用JS写的用来完善HTML的属性方法等等-->
<script>
import Aside from "@/components/Aside.vue";
import Header from "@/components/Header.vue";
import request from "@/utils/request";

export default {
    name: 'HomeView',
    data() {
        return {
            collapseBtnClass: 'el-icon-s-fold',
            isCollapse: false,
            sideWidth: 200,
            logoTextShow: true,
            user: {}
        }
    },

    components: {
        Aside,
        Header
    },
    created() {
        // 从后台获取最新的User数据
        this.getUser()
    },
    methods: {
        collapse() { //点击收缩按钮触发收缩
            this.isCollapse = !this.isCollapse
            if (this.isCollapse) {
                this.sideWidth = 64;
                this.collapseBtnClass = 'el-icon-s-unfold';
                this.logoTextShow = false
            } else { //展开
                this.sideWidth = 200;
                this.collapseBtnClass = 'el-icon-s-fold';
                this.logoTextShow = true;
            }
        },
        getUser() {
            let username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : ""
            // 从后台获取数据
            request.get("http://localhost:8080/user/username/" + username).then(res => {
                // 重新赋值最新user数据
                this.user = res.data
            })
        }
    }
}

</script>






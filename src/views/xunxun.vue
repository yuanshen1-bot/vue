<template>
    <div class="wrapper">
        <div
                style="margin: 200px auto; background-color: #fff; width: 350px; height: 300px; padding: 20px; border-radius: 10px">
            <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>登 录</b></div>
            <el-form :model="user" :rules="rules" ref="userForm">
                <el-form-item prop="username">
                    <el-input placeholder="请输入账号" size="medium" style="margin: 10px 0" prefix-icon="el-icon-user"
                              v-model="user.username"></el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input placeholder="请输入密码" size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock"
                              show-password
                              v-model="user.password"></el-input>
                </el-form-item>

                <el-form-item style="margin: 10px 0; text-align: right">
                    <el-button type="primary" size="small" autocomplete="off">登录</el-button>
                    <el-button type="warning" size="small" autocomplete="off">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
import request from "@/utils/request";
import {setRoutes} from "@/router";

export default {
    name: "Login",
    computed: {
        register() {
            return register
        }
    },
    data() {
        return {
            user: {},
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 1, max: 10, message: '长度在3到5个字符', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {min: 1, max: 10, message: '长度在3到10个字符', trigger: 'blur'}
                ]
            },
        }
    },
    methods: {}
}


</script>

<!--界面样式-->
<style>
.wrapper {
    height: 100vh;
    /*渐变。 to bottom right从左上角到右下角*/
    background-image: linear-gradient(to bottom right, #FC4668, #3F5EFB);
    overflow: hidden;
}

</style>
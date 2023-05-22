<template>
    <div>
        <!--从上往下依次是搜索部分、增删改查、表格、页码-->
        <div style="margin: 10px 0">
            <!--搜索框和按钮-->
            <!--v-model实现双向绑定-->
            <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-user" v-model="name"
                      class="ml-5"></el-input>
            <!--用class引用CSS文件里的设置-->
            <!--primary设置蓝色-->
            <!--@click绑定load函数-->
            <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
            <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
        </div>

        <div style="margin: 10px 0">
            <el-button type="primary" @click="handleAdd()">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
            <el-popconfirm
                    class="ml-5"
                    confirm-button-text='好的'
                    cancel-button-text='不用了'
                    icon="el-icon-info"
                    icon-color="red"
                    title="您确定删除吗？"
                    @confirm="delBatch">
                <el-button type="danger" slot="reference">批量删除 <i class="el-icon-remove-outline"></i></el-button>
            </el-popconfirm>
            <!--      <el-upload action="http://localhost:8080/menu/import" :show-file-list="false" accept=".xlsx" :on-success="handleImportSuccess" style="display: inline-block">-->
            <!--        <el-button type="primary" class="ml-5">导入 <i class="el-icon-bottom"></i></el-button>-->
            <!--      </el-upload>-->
            <!--      <el-button type="primary" @click="exp" class="ml-5">导出 <i class="el-icon-top"></i></el-button>-->
        </div>

        <!--    row-key="id"可以设置树型表格-->
        <el-table :data="tableData" border stripe header-cell-class-name="headerBg"
                  default-expand-all @selection-change="handleSelectionChange" row-key="id">
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>

            <el-table-column prop="name" label="名称" align="center"></el-table-column>

            <el-table-column prop="path" label="路径" align="center"></el-table-column>

            <el-table-column prop="pagePath" label="页面路径" align="center"></el-table-column>
            <el-table-column label="图标" align="center">
                <template slot-scope="scope">
                    <i :class="scope.row.icon" style="font-size: 30px"></i>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" align="center"></el-table-column>

            <el-table-column label="操作" width="450" align="center">
                <!--这个scope记录了该行的信息-->
                <template slot-scope="scope">
                    <!--          当记录没有pid的时候，才允许新增子菜单-->
                    <el-button type="primary" @click="handleAdd(scope.row.id)" v-if="!scope.row.pid && !scope.row.path">
                        新增子菜单 <i class="el-icon-edit"></i></el-button>
                    <el-button type="warning" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i>
                    </el-button>
                    <el-popconfirm
                            class="ml-5"
                            confirm-button-text='好的'
                            cancel-button-text='不用了'
                            icon="el-icon-info"
                            icon-color="red"
                            title="您确定删除吗？"
                            @confirm="handleDel(scope.row.id)">
                        <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i>
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>

        </el-table>

        <!--    visible.sync控制可视化-->
        <el-dialog title="菜单信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small">
                <el-form-item label="名称">
                    <!--用v-model实现双向绑定，无论哪一方的数据变了，另一方也会变-->
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="路径">
                    <el-input v-model="form.path" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="页面路径">
                    <el-input v-model="form.pagePath" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="图标">
                    <el-select clearable v-model="form.icon" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.value">
                            <i :class="item.value">{{ item.name }}</i>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="描述">
                    <el-input v-model="form.description" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </div>
  <!--  要在最外层加个div，因为不允许多个div并行-->
</template>

<script>
import request from "@/utils/request";

export default {
    name: "User",
    data() {
        return {
//      tableData: Array(10).fill(item),
            tableData: [],
            name: "",
            description: "",
            path: "",
            icon: "",
            pagePath: "",
            dialogFormVisible: false,
            multipleSelection: [],
            form: {},
            pageNum: 1,  //起始页
            pageSize: 8, //页的大小
            total: 0,
            headerBg: 'headerBg',
            options: []
        }
    },
    created() {
        // 加载时运行的方法
        this.load()
    },
    methods: {
        load() {
            request.get("http://localhost:8080/menu/", {
                params:
                    {
                        name: this.name,
                    }
            }).then(res => {
                console.log(res)
                // 这里不用.records是因为不是分页查询
                this.tableData = res.data
            })
        },

        reset() {
            this.name = ""
            this.load()
        },

        handleEdit(row) {
            // 修改的话，要把这行原来的信息读到form列表里
            this.form = row
            // 触发弹窗
            this.dialogFormVisible = true

            // 请求图标的数据
            request.get("http://localhost:8080/menu/icons").then(res => {
                this.options = res.data
            })

        },

        handleAdd(pid) {
            // 增加的话，要建个空的form列表
            this.form = {}
            // 触发弹窗
            this.dialogFormVisible = true
            if (pid) {
                this.form.pid = pid
            }
        },

        handleDel(id) {
            request.delete("http://localhost:8080/menu/" + id).then(res => {
                if (res.code === '200') {
                    // 显示弹窗
                    this.$message.success("删除成功")
                    this.dialogFormVisible = false
                    this.load()
                } else {
                    this.$message.error("删除失败")
                }
            })
        },

        //这个函数在选中一行后会返回该行的信息
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        },
        delBatch() {
            let ids = this.multipleSelection.map(v => v.id) // [{}, {}, {}] => []
            request.post("http://localhost:8080/menu/del/batch", ids).then(res => {
                if (res.code === '200') {
                    this.$message.success("批量删除成功")
                    this.dialogFormVisible = false
                    this.load()
                } else {
                    this.$message.error("批量删除失败")
                }
            })
        },

        cancel() {
            this.dialogFormVisible = false
            this.load()
        },

        // 增加或更新都调用这个函数
        save() {
            request.post("http://localhost:8080/menu", this.form).then(res => {
                if (res.code === '200') {
                    this.$message.success("保存成功")
                    this.dialogFormVisible = false
                    this.load()
                } else {
                    this.$message.error("保存失败")
                }
            })
        },

        handleSizeChange(pageSize) {
            console.log(pageSize)
            this.pageSize = pageSize
            this.load()
        },
        handleCurrentChange(pageNum) {
            console.log(pageNum)
            this.pageNum = pageNum
            this.load()
        },

        exp() {
            window.open("http://localhost:8080/menu/export")

        },

        handleImportSuccess() {
            this.$message.success("导入成功")
            this.load()
        },

        addChildren(id) {

        },

    }

}
</script>

<!--在此处定义自定义的style-->
<!--！important用于提高该项的优先级-->
<style>
.headerBg {
    background: #cccccc !important;
}
</style>
<template>
    <div>
        <!--从上往下依次是搜索部分、增删改查、表格、页码-->
        <div style="margin: 10px 0">
            <!--搜索框和按钮-->
            <!--v-model实现双向绑定-->
            <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-user" v-model="name"
                      class="ml-5"></el-input>
            <el-input style="width: 200px" placeholder="请输入描述" suffix-icon="el-icon-phone" v-model="description"
                      class="ml-5"></el-input>
            <!--用class引用CSS文件里的设置-->
            <!--primary设置蓝色-->
            <!--@click绑定load函数-->
            <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
            <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
        </div>

        <div style="margin: 10px 0">
            <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
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
            <!--      <el-upload action="http://localhost:8080/role/import" :show-file-list="false" accept=".xlsx" :on-success="handleImportSuccess" style="display: inline-block">-->
            <!--        <el-button type="primary" class="ml-5">导入 <i class="el-icon-bottom"></i></el-button>-->
            <!--      </el-upload>-->
            <!--      <el-button type="primary" @click="exp" class="ml-5">导出 <i class="el-icon-top"></i></el-button>-->
        </div>

        <!--border设置边框，stripe设置斑马线表格-->
        <el-table :data="tableData" border stripe header-cell-class-name="headerBg"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="id" label="ID" width="80"></el-table-column>

            <el-table-column prop="name" label="名称"></el-table-column>

            <el-table-column prop="flag" label="唯一标识"></el-table-column>

            <el-table-column prop="description" label="描述"></el-table-column>

            <el-table-column label="操作">
                <!--这个scope记录了该行的信息-->
                <template slot-scope="scope">
                    <el-button type="info" @click="selectMenu(scope.row)">分配菜单 <i class="el-icon-menu"></i>
                    </el-button>
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

        <div style="padding: 10px 0">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[2, 5, 10, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>


        <!--设置弹窗，当dialogFormVisible为true时，就会弹出来-->
        <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="80px" size="small">
                <el-form-item label="名称">
                    <!--用v-model实现双向绑定，无论哪一方的数据变了，另一方也会变-->
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="唯一标识">
                    <el-input v-model="form.flag" autocomplete="off"></el-input>
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

        <!--设置弹窗，当dialogFormVisible为true时，就会弹出来-->
        <el-dialog title="菜单分配" :visible.sync="menuDialogVis" width="30%">
            <el-tree
                    :props="props"
                    :data="menuData"
                    show-checkbox
                    check-strictly
                    node-key="id"
                    ref="tree"
                    :default-expanded-keys="expends"
                    :default-checked-keys="checks">
         <span class="custom-tree-node" slot-scope="{node, data}">
           <span><i :class="data.icon"></i>> {{ data.name }} </span>
         </span>
            </el-tree>

            <div slot="footer" class="dialog-footer">
                <el-button @click="menuDialogVis=false">取 消</el-button>
                <el-button type="primary" @click="saveRoleMenu">确 定</el-button>
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
            dialogFormVisible: false,
            menuDialogVis: false,
            multipleSelection: [],
            form: {},
            pageNum: 1,  //起始页
            pageSize: 8, //页的大小
            total: 0,
            headerBg: 'headerBg',
            menuData: [],
            props: {
                label: 'name',
            },
            expends: [],
            checks: [],
            roleId: 0,
            roleFlag: ''
        }
    },
    created() {
        // 加载时运行的方法
        this.load()
    },
    methods: {
        load() {
            // 请求分页查询数据
            request.get("http://localhost:8080/role/page", {
                params:
                    {
                        pageNum: this.pageNum,
                        pageSize: this.pageSize,
                        name: this.name,
                        description: this.description,
                    }
            }).then(res => {
                console.log(res)
                this.tableData = res.data.records
                this.total = res.data.total
            })
        },

        reset() {
            this.name = ""
            this.description = ""
            this.load()
        },

        handleEdit(row) {
            // 修改的话，要把这行原来的信息读到form列表里
            this.form = row
            // 触发弹窗
            this.dialogFormVisible = true
        },

        handleAdd() {
            // 增加的话，要建个空的form列表
            this.form = {}
            // 触发弹窗
            this.dialogFormVisible = true
        },

        handleDel(id) {
            request.delete("http://localhost:8080/role/" + id).then(res => {
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
            request.post("http://localhost:8080/role/del/batch", ids).then(res => {
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
            request.post("http://localhost:8080/role", this.form).then(res => {
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
            window.open("http://localhost:8080/role/export")

        },

        handleImportSuccess() {
            this.$message.success("导入成功")
            this.load()
        },
        selectMenu(role) {
            this.menuDialogVis = true
            this.roleId = role.id
            this.roleFlag = role.flag

            // 请求菜单数据
            request.get("http://localhost:8080/menu").then(res => {
                this.menuData = res.data
                // 把后台返回的菜单数据处理成id数组
                this.expends = this.menuData.map(v => v.id)
            })

            request.get("http://localhost:8080/role/roleMenu/" + this.roleId).then(res => {
                this.checks = res.data
            })
        },

        saveRoleMenu() {
            request.post("http://localhost:8080/role/roleMenu/" + this.roleId, this.$refs.tree.getCheckedKeys()).then(res => {
                if (res.code === '200') {
                    this.$message.success("绑定成功")
                    this.menuDialogVis = false

                    // 操作管理员角色后需要重新登陆
                    if (this.roleFlag === 'ROLE_ADMIN') {
                        this.$store.commit("logout")
                    }
                    this.$store.commit("logout")
                } else {
                    this.$message.error(res.msg)
                }
            })

        }
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
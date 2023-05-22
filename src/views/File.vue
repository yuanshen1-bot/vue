<template xmlns="">
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name" class="ml-5"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
    </div>
    <div style="margin: 10px 0">
      <el-upload action="http://localhost:8080/file/upload" :show-file-list="false" accept=".xlsx" :on-success="handleFileUploadSuccess" style="display: inline-block">
        <el-button type="primary" class="ml-5">上传文件 <i class="el-icon-top"></i></el-button>
      </el-upload>
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

    </div>
    <el-table :data="tableData" border stripe header-cell-class-name="headerBg" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column prop="id" label="ID" width="80"></el-table-column>

      <el-table-column prop="name" label="文件名称" ></el-table-column>

      <el-table-column prop="type" label="文件类型" ></el-table-column>

      <el-table-column prop="size" label="文件大小(kb)"></el-table-column>

      <el-table-column label="下载">
        <template slot-scope="scope">
          <el-button type="primary" @click="download(scope.row.url)">下载</el-button>
        </template>
      </el-table-column>

      <el-table-column label="启用">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ccc" @change="changeEnable(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <!--这个scope记录了该行的信息-->
        <template slot-scope="scope">
          <el-popconfirm
              class="ml-5"
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="handleDel(scope.row.id)">
            <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
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
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "File",
  data() {
    return {
      tableData: [],
      name: '',
      multipleSelection: [],
      pageNum : 1,
      pageSize : 5,
      total: 0
    }
  },
  created() {
    this.load();
  },
  methods:{
    load()
    {
      // 请求分页查询数据
      request.get("http://localhost:8080/file/page", {
        params:
            {
              pageNum: this.pageNum,
              pageSize: this.pageSize,
              name: this.name,
            }
      }).then(res =>{
        this.tableData = res.data.records
        this.total = res.data.total
      })
    },
    download(url){
      window.open(url)
    },
    changeEnable(row) {
      request.post("http://localhost:8080/file/update", row).then(res => {
        if (res.code === '200') {
          this.$message.success("操作成功")
        }
      })
    },

    reset()
    {
      this.name = ""
      this.load()
    },
    handleDel(id)
    {
      request.delete("http://localhost:8080/file/" + id).then(res =>{
        if (res.code === '200')
        {
          // 显示弹窗
          this.$message.success("删除成功")
          this.load()
        }
        else
        {
          this.$message.error("删除失败")
        }
      })
    },

    //这个函数在选中一行后会返回该行的信息
    handleSelectionChange(val)
    {
      console.log(val)
      this.multipleSelection = val
    },
    delBatch()
    {
      let ids = this.multipleSelection.map(v => v.id) // [{}, {}, {}] => []
      request.post("http://localhost:8080/file/del/batch", ids).then(res =>{
        if (res.code === '200')
        {
          this.$message.success("批量删除成功")
          this.load()
        }
        else
        {
          this.$message.error("批量删除失败")
        }
      })
    },

    cancel()
    {
      this.dialogFormVisible = false
      this.load()
    },
    handleSizeChange(pageSize)
    {
      console.log(pageSize)
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum)
    {
      console.log(pageNum)
      this.pageNum = pageNum
      this.load()
    },
    handleFileUploadSuccess(res){
      console.log(res)
      this.load()
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <div>
    <el-row :gutter="10" style="margin-bottom: 40px">
      <el-col :span="6" >
        <el-card style="color: #409EFF">
          <div ><i class="el-icon-user-solid" style="margin-right: 5px"></i>用户总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">100</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #F56C6C">
          <div ><i class="el-icon-money" style="margin-right: 5px"></i>销售总量</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">￥10000</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #42b983">
          <div ><i class="el-icon-bank-card" style="margin-right: 5px"></i>收益总额</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">￥3000</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="color: #E6A23C">
          <div ><i class="el-icon-s-shop" style="margin-right: 5px"></i>门店总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold">100</div>
        </el-card>
      </el-col>
    </el-row>

<!--    插入图表-->
    <el-row>
      <el-col :span="12">
        <div id="main" style="width: 500px; height: 450px"></div>
      </el-col>
      <el-col :span="12">
        <div id="pie" style="width: 700px; height: 450px"></div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import * as echarts from 'echarts'
import request from "@/utils/request";
export default {
  name: "Home",
  data(){
    return {
    }
  },
  mounted() {  // 页面元素渲染之后再触发
    // 柱状图加折线图
    var option = {
      title: {
        text: '各季度会员数量统计',
        subtext: '趋势图',
        left: 'center'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        type: 'category',
        data: ["第一季度", "第二季度", "第三季度", "第四季度"]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: "星巴克",
          data: [],
          type: 'bar'  // 折线图
        },
        {
          name: "星巴克",
          data: [],
          type: 'line',  // 直方图
        },
        {
          name: "瑞幸",
          data: [],
          type: "bar"
        },
        {
          name: "瑞幸",
          data: [],
          type: "line"
        },
      ]
    };

    // 饼图
    var pieOption = {
      title: {
        text: '各季度会员数量统计',
        subtext: '比例图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['rose1', 'rose2', 'rose3', 'rose4']
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
          // 第一个饼图
        {
          name: "星巴克",
          type: 'pie',
          radius: [20, 140],
          center: ['20%', '60%'],
          roseType: 'radius',
          itemStyle: {
            borderRadius: 5
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true
            }
          },
          data: [],   // 填空
        },
          // 第二个饼图
        {
          name: "瑞幸",
          type: 'pie',
          radius: [20, 140],
          center: ['65%', '60%'],
          roseType: 'radius',      // 生成玫瑰图
          itemStyle: {
            borderRadius: 5
          },
          data: [{name: "第一季度", value: 5},
                 {name: "第二季度", value: 6},
                 {name: "第三季度", value: 7},
                 {name: "第四季度", value: 8},],   // 填空
        },

      ]
    };


    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);

    var pieDom = document.getElementById('pie');
    var pieChart = echarts.init(pieDom);

    request.get("http://localhost:8080/echarts/members").then(res => {
      // 填空
      // option.xAxis.data = res.data.x
      option.series[0].data = res.data
      option.series[1].data = res.data
      option.series[2].data = [5, 6, 7, 8]
      option.series[3].data = [7, 2, 5, 1]

      // 数据准备完毕之后再set
      myChart.setOption(option)

      pieOption.series[0].data = [
        {name: "第一季度", value: res.data[0]},
        {name: "第二季度", value: res.data[1]},
        {name: "第三季度", value: res.data[2]},
        {name: "第四季度", value: res.data[3]},
      ]

      pieChart.setOption(pieOption)
    })

  }
}
</script>

<style scoped>

</style>
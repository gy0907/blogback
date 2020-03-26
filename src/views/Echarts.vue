<template>
  <el-card>
    <div id="echarts" v-loading="loading"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
import request from '../network/request'
export default {
  data() {
    return {
      nowTime: Date.now(), // 获取当前时间
      dateArr:  [],
      oneday: 86400000,
      // 得到了今天还没过去的时间
      nowHours: (24 - new Date().getHours())*60*60*1000 - new Date().getMinutes()*60*1000,
      detailArr: [0,0,0,0,0,0,0],
      loading: true,
      total: [],
      delDate: [],
      delarr: [0,0,0,0,0,0,0],
      msgarr: [0,0,0,0,0,0,0],
      msgdate: []
    }
  },
  methods: {
    getarticle() {
      // 获取文章信息
      request('/article').then(res=>{
        res.data.filter(item=>{
          this.dateArr.push(item.date)
        })
        this.FormatTimeArr(this.dateArr,this.detailArr)
        this.getTotal()
      })
      // 获取删除信息
      request('/count').then(res=>{
        res.data.filter(item=>{
          this.delDate.push(item.delDate)
        })
        this.FormatTimeArr(this.delDate,this.delarr)
      })
      // 获取留言信息
      request('/messagedate').then(res=>{
        res.data.filter(item=>{
          this.msgdate.push(item.date)
        })
        this.FormatTimeArr(this.msgdate,this.msgarr)
      })
    },
    // 格式化时间数组
    FormatTimeArr(origin, target) {
      origin.forEach(item=>{
        for(let i = 0; i < 7; i++) {
          if(this.nowTime + this.nowHours - item < (i+1)*this.oneday) {
          target.splice(-i+7-1,1,++target[-i+7-1])
          break
          }
        }
      })
    },
    getTotal() {
      let sum = 0
      this.detailArr.reduce((prev,item)=>{
        sum += item
        this.total.push(prev)
        // this.total
        return prev+item
      })
        this.total.push(sum)
    }
  },
  mounted() {
    this.getarticle()
    
    setTimeout(()=>{
    var myChart = echarts.init(document.getElementById("echarts"));

    myChart.setOption({
      title: {
        text: "更新信息"
      },
      tooltip: {
        trigger: "axis"
      },
      legend: {
        data: ["总贴数", "更新数", "删除数","留言条数"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["六天前", "五天前", "四天前", "三天前", "前天", "昨天", "今天"]
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          name: "总贴数",
          type: "line",
          data: this.total
        },
        {
          name: "更新数",
          type: "line",
          data: this.detailArr
        },
        {
          name: "删除数",
          type: "line",
          data: this.delarr
        },
        {
          name: "留言条数",
          type: "line",
          data: this.msgarr
        }
      ]
    });
    this.loading = false
    },1000)
    
  }
};
</script>

<style lang="stylus" scoped>
.el-card
  margin-top 40px
  box-shadow 0 0 0 rgba(0,0,0,.2)!important

#echarts
  width 100%
  height 400px

</style>
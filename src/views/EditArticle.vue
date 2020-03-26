<template>
  <div class="edit">
    <el-card>
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        label="发布日期"
        width="180">
      <template slot-scope="scope">
        {{scope.row.date | getDate}}
      </template>
      </el-table-column>
      <el-table-column
        label="修改日期"
        width="180">
      <template slot-scope="scope">
        {{scope.row.editDate | getDate}}
      </template>
      </el-table-column>
      <el-table-column
        prop="category.name"
        label="分类"
        width="80">
      <template slot-scope="scope">
        <el-tag size="small" type="danger" v-if="scope.row.category.name == 'node'">{{scope.row.category.name}}</el-tag>
        <el-tag size="small" type="success" v-else-if="scope.row.category.name == 'js'">{{scope.row.category.name}}</el-tag>
        <el-tag size="small" type="primary" v-else-if="scope.row.category.name == 'css'">{{scope.row.category.name}}</el-tag>
        <el-tag size="small" type="warning" v-else-if="scope.row.category.name == 'vue'">{{scope.row.category.name}}</el-tag>
        <el-tag size="small" type="info" v-else>{{scope.row.category.name}}</el-tag>
      </template>
      </el-table-column>
      <el-table-column
        width="190">
      <template slot="header">
        <input
          class="searchInput"
          v-model="queryForm.query"
          size="mini"
          placeholder="输入关键字搜索"
          @input="inputSearch"/>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="editArticle(scope.row)"
          >编辑</el-button>
        <el-popconfirm
          confirmButtonText='好的'
          cancelButtonText='不用了'
          icon="el-icon-info"
          iconColor="red"
          title="确定删除吗？"
          @onConfirm="deleteArticle(scope.row)"
        >
          <el-button class="elbtn" size="mini" type="danger" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
      </el-table-column>
      </el-table>
      <!-- 分页器部分 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryForm.pagenum"
      :page-sizes="[5, 10, 50, 100]"
      :page-size="queryForm.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
import request from '../network/request'

import gettime from '../utils/gettime'
export default {
  data() {
    return {
      tableData: [],
      queryForm: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      deleteVisible: false
    }
  },
  filters:{
    getDate(time) {
      time = new Date(time)
      return gettime(time)
    }
  },
  mounted() {
    // 不加参数获取total
    request('/articlecount').then(res=>{
      this.total = res.data
    })
    this.getArticle()
  },
  methods: {
    // 获取文章列表信息
    getArticle() {
      request({url:'/article', params: this.queryForm}).then(res=>{
        if(!res&&res.meta.status !== 200) return this.$message.error('获取文章列表失败!')
        this.tableData = res.data
      })
    },
    // 删除文章相关方法
    async deleteArticle(sr){
      let res = await request({method: 'delete', url:`/deletearticle/${sr._id}`})
      if(!res&&res.meta.status !== 200) return this.$message.error('删除失败')
      this.getArticle()
      this.$notify({
          message: '删除成功!',
          type: 'success',
          duration: 1000
      });
    },
    // 修改文章相关方法
    editArticle(sr) {
      // 跳转到添加文章页面并携带参数
      this.$router.push({path:'/addarticle',query: {_id:sr._id}}) 
    },
    // 查询input的输入事件
    inputSearch(){
      this.getArticle()
    },
    // pagesize发生改变的事件
    handleSizeChange(size) {
      this.queryForm.pagesize = size
      this.getArticle()
    },
    // pagenum发生改变的事件
    handleCurrentChange(num) {
      this.queryForm.pagenum = num
      this.getArticle()
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-card
  box-shadow 0 0 1px rgba(0,0,0,.2)
  margin 20px 30px 0 0
.edit /deep/ .cell
  font-size 13px
.elbtn
  margin-left 10px
.el-pagination
  margin-top 15px
.searchInput
  padding 5px
  outline none
  border 1px solid #ddd
  border-radius 5px
</style>
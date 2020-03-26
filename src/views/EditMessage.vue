<template>
  <div class="edit">
    <el-card>
      <el-table
      :data="msgList"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="昵称"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="message"
        label="内容">
      </el-table-column>
      <el-table-column
        label="留言日期"
        width="180">
      <template slot-scope="scope">
        {{scope.row.date | getDate}}
      </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="190">
      <template slot-scope="scope">
        <el-popconfirm
          confirmButtonText='好的'
          cancelButtonText='不用了'
          icon="el-icon-info"
          iconColor="red"
          title="确定删除吗？"
          @onConfirm="deletemessage(scope.row)"
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
      msgList: [],
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
      time = new Date(time - 0)
      return gettime(time)
    }
  },
  mounted() {
    // 先请求一次total总条数
    request('/messagecount').then(res=>{
      this.total = res.data
    })
    this.getMessage()
  },
  methods: {
    async getMessage() {
      request({url:'/message', params: this.queryForm}).then(res=>{
        if(!res&&res.meta.status !== 200) return this.$message.error('获取留言列表失败!')
        this.msgList = res.data
      })
    },
    // 删除留言
    async deletemessage(sr){
      let res = await request({method: 'delete', url:`/message/${sr._id}`})
      if(!res&&res.meta.status !== 200) return this.$message.error('删除失败')
      this.getMessage()
      this.$notify({
          message: '删除成功!',
          type: 'success',
          duration: 1000
      });
      this.getMessage()
      // 先请求一次total总条数
      request('/messagecount').then(res=>{
        this.total = res.data
      })
    },
    // pagesize发生改变的事件
    handleSizeChange(size) {
      this.queryForm.pagesize = size
      this.getMessage()
    },
    // pagenum发生改变的事件
    handleCurrentChange(num) {
      this.queryForm.pagenum = num
      this.getMessage()
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
</style>


<template>
  <div class="edit">
    <el-card>
      <el-button @click="addCategory">新增分类</el-button>
      <el-dialog
        title="新增分类"
        :visible.sync="addCateDialogVisible"
        width="30%">
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="addCateForm.name"></el-input>
          </el-form-item>
          <el-form-item label="可删除性" prop="name">
            <el-select v-model="seleteValue" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="commitCategory">确 定</el-button>
        </span>
      </el-dialog>
      <el-table
      :data="cateList"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="分类"
        >
      </el-table-column>
      <el-table-column
        label="可删除"
        width="190"
        >
      <template slot-scope="scope">
        <el-tag size="small" type="danger" v-if="scope.row.editable == false">{{scope.row.editable}}</el-tag>
        <el-tag size="small" type="success" v-else>{{scope.row.editable}}</el-tag>
      </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
      <template slot-scope="scope">
        <el-popconfirm
          confirmButtonText='好的'
          cancelButtonText='不用了'
          icon="el-icon-info"
          iconColor="red"
          title="确定删除吗？"
          @onConfirm="deleteCategory(scope.row)"
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

export default {
  data() {
    return {
      cateList: [],
      queryForm: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      deleteVisible: false,
      addCateDialogVisible: false,
      options: ['true', 'false'],
      seleteValue: '',
      addCateForm: {
        name: '',
        editable: true
      },
      addCateRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getCategory()
  },
  methods: {
    async getCategory() {
      request({url:'/category', params: this.queryForm}).then(res=>{
        if(!res&&res.meta.status !== 200) return this.$message.error('获取分类列表失败!')
        this.cateList = res.data
        this.total = res.data.length
      })
    },
    // 删除留言
    async deleteCategory(sr){
      let res = await request({method: 'delete', url:`/category/${sr._id}`})
      if(!res.meta&&res.meta.status !== 200) return this.$message.error('删除失败!')
      if(res.meta.status === 403) return this.$notify.error('不能删除此分类!')
      this.getCategory()
      this.$notify({
          message: '删除成功!',
          type: 'success',
          duration: 1000
      });
    },
    // pagesize发生改变的事件
    handleSizeChange(size) {
      this.queryForm.pagesize = size
      this.getCategory()
    },
    // pagenum发生改变的事件
    handleCurrentChange(num) {
      this.queryForm.pagenum = num
      this.getCategory()
    },
    // 点击开启新增分类对话框
    addCategory() {
      this.addCateDialogVisible = true
    },
    // 提交分类请求
    commitCategory() {
      this.$refs.addCateRef.validate(valid=>{
        if(!valid) return this.$notify.error('请将表单填写完整')
        this.addCateForm.editable = this.seleteValue == 'true'
        request({method: 'post', url: '/addcategory',data: this.addCateForm}).then(res=>{
          if(!res.meta&&res.meta.status !== 200) return this.$message.error('新增分类失败!')
          this.getCategory()
          this.$notify({
              message: '新增分类成功!',
              type: 'success',
              duration: 1000
          });
          this.addCateDialogVisible = false
          this.seleteValue = ''
          this.$refs.addCateRef.resetFields()
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-card
  box-shadow 0 0 1px rgba(0,0,0,.2)
.edit /deep/ .cell
  font-size 13px
.el-pagination
  margin-top 15px
.el-input
  width 300px
</style>


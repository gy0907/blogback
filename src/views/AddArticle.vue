<template>
  <div class="container">
    <ssbutton @click.native="commitArticle" class="ssbutton" :type="1">发布</ssbutton>
    <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" >
      <el-form-item class="select" prop="category">
        <el-select @focus="getSelectOptions" v-model="addForm.category" clearable placeholder="请选择分类">
          <el-option
            v-for="item in options"
            :key="item._id || item"
            :label="item.name || item"
            :value="item._id || item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="title" prop="title">
        <el-input
          type="text"
          placeholder="请输入标题"
          v-model="addForm.title"
          maxlength="25"
          show-word-limit
          clearable
        >
        </el-input>
      </el-form-item>
      <el-form-item class="upload" prop="none">
        <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :on-success="uploadSuccess"
          multiple
          :file-list="fileList"
          :show-file-list="false"
          >
          <el-button size="mini" type="primary">上传文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <mavon-editor v-model="editorValue"/>
  </div>
</template>

<script>
import ssbutton from '../components/common/ss-button'

import request from '../network/request'

export default {
  components: {
    ssbutton
  },
  mounted() {
    // 先根据id请求修改的文章内容
    if(this.$route.query._id) {
      request(`/editarticle/${this.$route.query._id}`).then(res=>{
        this.addForm.title = res.data.title
        this.editorValue = res.data.body
      })
    }
  },
  data() {
    return {
      addForm: {
        title: '',
        body: '',
        // 选中了什么
        category: ''
      },
      editorValue: '',
      addFormRule: {
        title: [{ required: true, message: '请填写标题', trigger: 'change' },{ min: 5, max: 25, message: '长度在 5 到 25 个字符', trigger: 'blur' }],
        category: [{ required: true, message: '请选择分类', trigger: 'blur' }],
      },
      options: ['等','待','数','据'],
      // 文件上传的数组
      fileList: [],
      uploadUrl: 'http://localhost:3001/api/upload'
    }
  },
  methods: {
    getSelectOptions() {
      request('/category').then(res=>{
        if(res&&res.meta.status!==200) return this.$message.error('获取分类信息失败!')
        this.options = res.data
      })
    },
    uploadSuccess(res,file,filelist) {
      // console.log(this.uploadUrl.replace('api/upload', res[0].path.slice(7,)))
      this.editorValue = this.editorValue + `\n![](`+this.uploadUrl.replace('api/upload', res[0].path.slice(7,)) + `)`
      console.log(this.editorValue)
    },
    commitArticle() {
      this.$refs.addFormRef.validate(valid=>{
      if(!valid) return this.$message.error('请检查标题或分类是否填写!')
      // 有id表示这是修改文章。走的是修改接口
      if(this.$route.query._id) {
        this.addForm.editDate = Date.now()
        this.addForm.body = this.editorValue
        request({method: 'put',url: `/editarticle/${this.$route.query._id}`,data: this.addForm}).then(res=>{
          if(res.meta.status !== 200) return this.$message.error('修改文章失败!')
          this.$notify.success('修改成功')
          // 清空表单内容
          this.$refs.addFormRef.resetFields()
          this.addForm.body = ''
          this.editorValue = ''
          this.$router.push('/editarticle')
          })
      }
      else{
          this.addForm.date = Date.now()
          this.addForm.editDate = Date.now()
          this.addForm.looks = 0
          this.addForm.loves = 0
          this.addForm.body = this.editorValue
          request({method: 'post',url: '/addarticle',data: this.addForm}).then(res=>{
            if(res.meta.status !== 200) return this.$message.error('添加文章失败!')
            this.$notify.success('发布成功')
            // 清空表单内容
            this.$refs.addFormRef.resetFields()
            this.addForm.body = ''
            this.editorValue = ''
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  position relative
  height 80%
.v-note-wrapper
  height 80vh
.ssbutton
  position absolute
  right 30px
.title
  width 450px
.select
  position absolute
  right 180px

.upload
  margin 0 !important
  position absolute
  top 0
  right 500px
</style>
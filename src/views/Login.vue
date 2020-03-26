<template>
  <div class="container">
    <h2 class="title">Personal blog management system</h2>
    <div class="login">
      <div class="Avatar">
        <img src="../assets/logo.png">
      </div>
      <el-form hide-required-asterisk :model="loginForm" :rules="loginRule" ref="ruleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input @keyup.enter.native="commitForm" type="password" prefix-icon="el-icon-lock" v-model="loginForm.password"></el-input>
        </el-form-item>
      </el-form>
      <div class="button">
        <button @click="resetForm" class="button1">重置</button>
        <button @click="commitForm" class="button2">登录</button>
      </div>
    </div>
  </div>
</template>

<script>

import ssbutton from '../components/common/ss-button'

import request from '../network/request'
export default {
  components: {
    ssbutton,
  },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
      requestFlag: true,
      loginRule:{
        username: [
          { required: true, message: '请填写用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度不对', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度不对', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单
    resetForm() {
      console.log(this.$aaa);
      this.$refs.ruleForm.resetFields()
    },
    // 提交登录信息
    commitForm() {
      this.$refs.ruleForm.validate(async valid=>{
        if(!valid) return this.$message.info('登录信息填写格式错误!')
        if(!this.requestFlag) return this.$message.info('登录的太频繁了!')
        const res = await request({url: '/login',method: 'post', data: this.loginForm })
        // 节流
        this.requestFlag = false
        setTimeout(()=>{this.requestFlag = true},5000)
        // 将token保存到sessionStorage中
        if(!res.token) return this.$message.error('用户名或密码有误!') 
        window.sessionStorage.setItem('token', res.token)
        this.$router.replace('/home')
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  width 100%
  height 100%
  background linear-gradient(160deg, #00ffd0 20%,#008cff 80%)
  position relative

.title 
  color #ffffff
  font-size 40px
  margin: 0
  position absolute
  top 20%
  left 50%
  transform translate(-50%, -50%)
  font-weight 400
  white-space nowrap

.login
  width 500px
  height 300px
  background-color white
  position absolute
  top 50%
  left 50%
  box-shadow 0 0 4px rgba(0,0,0,.3)
  transform translate(-50%, -50%)
  border-radius 15px

.Avatar 
  height 60px
  width 60px
  position absolute
  left 50%
  transform translateX(-50%)
  border 1px solid #ccc
  border-radius 50%
  margin-top 10px
  >img 
    width 80% 
    margin-top 10px

.el-form 
  position absolute
  top 50%
  transform translateY(-50%)

.el-input
  width 330px

.button 
  position absolute
  bottom 30px
  right 60px

button
  outline none
  border none 
  font-size 16px
  padding 10px
  color #fff
  border-radius 6px
  width 80px
  cursor pointer
.button1:hover
  background: linear-gradient(to left, #ff9569 0%, #e92758 100%)

.button1
  background: linear-gradient(to right, #ff9569 0%, #e92758 100%)
  margin-right 20px

.button2:hover
  background: linear-gradient(-90deg, #29bdd9 0%, #276ace 100%)

.button2
  background: linear-gradient(90deg, #29bdd9 0%, #276ace 100%)
</style>
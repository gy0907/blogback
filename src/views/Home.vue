<template>
  <div class="home">
    <el-container class="container">
    <el-header>个人博客管理系统</el-header>
    <el-container>
      <el-aside width="200px">
        <div>
          <transition-group class="ul" name="flip-list" tag="ul">
            <li @click="clickMenuItem(item)" class="aside-menu" v-for="item in items" v-bind:key="item">
              {{ item }}
            </li>
          </transition-group>
        </div>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  </div>
</template>

<script>
import request from '../network/request'


export default {
  name: 'Home',
  data() {
    return {
      items: [],
      pushItems: ["首页信息","添加文章", "管理文章", "留言管理", "管理用户", "分类管理","标签管理", "退出登录",]
    }
  },
  mounted() {
    let num = 0
    let timer = setInterval(()=>{
      this.items.push(this.pushItems[num])
      num++
      if(num==this.pushItems.length) {
        clearInterval(timer)
      }
    },200)


 
  },
  methods: {
    clickMenuItem(item) {
      switch(item) {
        case '首页信息': this.$router.push('/home')
        break
        case '添加文章': this.$router.push('/addarticle')
        break
        case '管理文章': this.$router.push('/editarticle')
        break
        case '留言管理': this.$router.push('/editmessage')
        break
        case '分类管理': this.$router.push('/editcategory')
        break
        case '退出登录': this.exitLogin()
        break
      }
    },
    // 退出功能
    exitLogin() {
      window.sessionStorage.removeItem('token')
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="stylus" scoped>
.home
  height 100%


.container
  height 100%

.el-header
  height 50px!important
  font-size 26px
  line-height 50px
  color #ddd
  border-bottom 1px solid #16191f
  box-shadow 0 1px 10px rgba(0,0,0,.5)
  background-color #404040
  z-index 1
  text-align center
.el-aside
  height 100%
  width 100px
  background-color #f7f7f7

.el-main
  background-color #f7f7f7
.aside-menu
  width 160px
  height 40px
  font-size 16px
  color #b17749
  background-color #fff
  line-height 40px
  border-radius 5px
  margin 20px auto
  cursor pointer
  transition all .5s
  list-style none
  box-shadow 0 0 2px rgba(0,0,0,.3)
.aside-menu:hover
  box-shadow 0 0 4px rgba(0,0,0,.8)
.el-dropdown
  width 100%
.ul 
  padding 0
  margin 0
  margin-top 40px
  text-align center

.flip-list-enter-active {
  position absolute
  top -10px
}
</style>
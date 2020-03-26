import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    children: [
      {path: '/home',component: ()=>import('../views/Echarts')},
      {path: '/addarticle',component: ()=>import('../views/AddArticle')},
      {path: '/editarticle',component: ()=>import('../views/EditArticle')},
      {path: '/editmessage',component: ()=>import('../views/EditMessage')},
      {path: '/editcategory',component: ()=>import('../views/EditCategory')},
    ]
  },
  {
    path: '/login',
    component: ()=>import('../views/Login')
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to,form,next)=>{
  if(to.path=='/login') return next()
  let token = window.sessionStorage.getItem('token')
  if(token==null) return router.replace('/login')
  next()
})

export default router

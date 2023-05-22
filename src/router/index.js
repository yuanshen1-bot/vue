import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/Manage.vue'
import store from '../store';


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/404.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export const setRoutes = () => {
  const storeMenus = localStorage.getItem("menus");
  if (storeMenus) {
    // 拼装动态路由
    const manageRoute = { path: '/', name: 'Manage', component: () => import('../views/Manage.vue'), redirect: "/home", children: [] }
    const menus = JSON.parse(storeMenus)
    menus.forEach(item => {
      if (item.path) {  // 当且仅当path不为空的时候才去设置路由
        let itemMenu = { path: item.path.replace("/", ""), name: item.name, component: () => import('../views/' + item.pagePath + '.vue') }
        manageRoute.children.push(itemMenu)   // 这里的children是路由设置中的子路由的意思，不是自己设置的子菜单
      } else if (item.children.length){   // 这里的children是指自己设置的子菜单
        item.children.forEach(item => {
          if (item.path) {
            let itemMenu = { path: item.path.replace("/", ""), name: item.name, component: () => import('../views/' + item.pagePath + '.vue') }
            manageRoute.children.push(itemMenu)
          }
        })
      }
    })

    // 获取当前的路由对象名称数组
    const  currentRouteNames = router.getRoutes().map(v => v.name)
    if (! currentRouteNames.includes('Manage')){
      // 动态添加到现在的路由对象
      router.addRoute(manageRoute)
    }

  }
}

// 避免页面刷新后路由被清空了，再设置下路由,如果不加这个就要重新登录才能有页面
setRoutes()



// 路由守卫，只要路由发生跳转就会进入路由守卫
router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.name)   // 设置当前的路由名称
  store.commit("setPath") // 触发store的数据更新

  // 未找到路由的情况
  if (!to.matched.length){
    const storeMenus = localStorage.getItem("menus")
    if (storeMenus) {
      next("/404")  // 放行路由，必须写，不写路由出不来
    }else {
      next("/login") //如果没有缓存，说明还没登录，跳转到登陆界面
    }
  }
  // 其他的情况都放行
  next()


})

export default router

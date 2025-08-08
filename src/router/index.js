import { createRouter, createWebHistory } from 'vue-router'
import FeedbackForm from '../components/FeedbackForm.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import LoginPage from '../views/LoginPage.vue'

const routes = [
  { path: '/', name: 'Home', component: FeedbackForm },
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard },
  { path: '/login', name: 'Login', component: LoginPage },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    onAuthStateChanged(auth, user => {
      if (user) {
        next()
      } else {
        next('/login')
      }
    })
  } else {
    next()
  }
})


export default router

import { createRouter, createWebHistory } from 'vue-router'
import FeedbackForm from '../components/FeedbackForm.vue'
import AdminDashboard from '../components/AdminDashboard.vue'

const routes = [
  { path: '/', component: FeedbackForm },
  { path: '/admin', component: AdminDashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

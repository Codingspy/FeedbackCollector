<template>
  <div>
    <nav class="bg-blue-600 text-white p-4 flex justify-between">
      <div class="font-bold">Feedback MVP</div>
      <div>
        <router-link to="/" class="mr-4">Home</router-link>
        <router-link to="/admin" class="mr-4">Admin</router-link>
        <button v-if="user" @click="logout" class="bg-red-500 px-2 py-1 rounded">Logout</button>
        <router-link v-else to="/login">Login</router-link>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const user = ref(null)
const auth = getAuth()
const router = useRouter()

onMounted(() => {
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })
})

const logout = async () => {
  await signOut(auth)
  router.push('/login')
}
</script>

<template>
  <div>
    <h2>Admin Dashboard</h2>

    <div class="summary">
      <p><strong>Total Feedbacks:</strong> {{ feedbacks.length }}</p>
      <p><strong>Bug Reports:</strong> {{ bugCount }}</p>
      <p><strong>Feature Requests:</strong> {{ featureCount }}</p>
      <p><strong>General Suggestions:</strong> {{ suggestionCount }}</p>
    </div>

    <label>Filter by Category:</label>
    <select v-model="selectedCategory" @change="filterFeedbacks">
      <option value="">All</option>
      <option>Bug Report</option>
      <option>Feature Request</option>
      <option>General Suggestion</option>
    </select>

    <button @click="exportCSV">Export CSV</button>
    <button @click="logout">Logout</button>

    <ul class="bg-gray-100 p-4 rounded">
     <li v-for="feedback in filteredFeedbacks" :key="feedback.id" class="border-b py-2">
        <strong>{{ feedback.name }}</strong> ({{ feedback.category }}) [{{ feedback.sentiment }}]: {{ feedback.message }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const feedbacks = ref([])
const filteredFeedbacks = ref([])
const selectedCategory = ref('')

const fetchFeedbacks = async () => {
  const q = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  feedbacks.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  filteredFeedbacks.value = feedbacks.value
}

const filterFeedbacks = () => {
  if (!selectedCategory.value) {
    filteredFeedbacks.value = feedbacks.value
  } else {
    filteredFeedbacks.value = feedbacks.value.filter(
      fb => fb.category === selectedCategory.value
    )
  }
}

const router = useRouter()

const logout = async () => {
  const auth = getAuth()
  await signOut(auth)
  router.push('/login')
}

const exportCSV = () => {
  const rows = [
    ["Name", "Category", "Message", "Created At"],
    ...filteredFeedbacks.value.map(fb => [
      fb.name,
      fb.category,
      fb.message,
      fb.createdAt.toDate().toLocaleString()
    ])
  ]

  let csvContent = "data:text/csv;charset=utf-8,"
    + rows.map(e => e.map(field => `"${(field || '').toString().replace(/"/g, '""')}"`).join(",")).join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "feedbacks.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// ✅ Summary Computed:
const bugCount = computed(() => feedbacks.value.filter(fb => fb.category === 'Bug Report').length)
const featureCount = computed(() => feedbacks.value.filter(fb => fb.category === 'Feature Request').length)
const suggestionCount = computed(() => feedbacks.value.filter(fb => fb.category === 'General Suggestion').length)

onMounted(fetchFeedbacks)
</script>

<style scoped>
.summary {
  background: #f2f2f2;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 5px;
}
select {
  margin-right: 10px;
  padding: 6px;
}
button {
  padding: 6px 12px;
  margin-bottom: 15px;
}
</style>

<template>
  <div>
    <h2>Admin Dashboard</h2>

    <label>Filter by Category:</label>
    <select v-model="selectedCategory" @change="filterFeedbacks">
      <option value="">All</option>
      <option>Bug Report</option>
      <option>Feature Request</option>
      <option>General Suggestion</option>
    </select>

    <ul>
      <li v-for="feedback in filteredFeedbacks" :key="feedback.id">
        <strong>{{ feedback.name }}</strong> ({{ feedback.category }}): {{ feedback.message }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

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

onMounted(fetchFeedbacks)
</script>

<style scoped>
select {
  margin-bottom: 15px;
  padding: 6px;
}
</style>

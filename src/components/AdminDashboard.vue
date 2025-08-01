<template>
  <div>
    <h2>Admin Dashboard</h2>
    <ul>
      <li v-for="feedback in feedbacks" :key="feedback.id">
        <strong>{{ feedback.name }}:</strong> {{ feedback.message }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

const feedbacks = ref([])

const fetchFeedbacks = async () => {
  const q = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  feedbacks.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

onMounted(fetchFeedbacks)
</script>

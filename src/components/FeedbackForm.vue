<template>
  <div>
    <h2>Submit Feedback</h2>
    <form @submit.prevent="submitFeedback">
      <input v-model="name" placeholder="Your Name" required />

      <select v-model="category" required>
        <option disabled value="">Select Category</option>
        <option>Bug Report</option>
        <option>Feature Request</option>
        <option>General Suggestion</option>
      </select>

      <textarea v-model="message" placeholder="Your Feedback" required></textarea>

      <button type="submit">Submit</button>
    </form>

    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

const name = ref('')
const category = ref('')
const message = ref('')
const successMessage = ref('')

const submitFeedback = async () => {
  try {
    await addDoc(collection(db, 'feedbacks'), {
      name: name.value,
      category: category.value,
      message: message.value,
      createdAt: Timestamp.now()
    })
    successMessage.value = "Thank you for your feedback!"
    name.value = ''
    category.value = ''
    message.value = ''
  } catch (error) {
    console.error("Error adding feedback: ", error)
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  width: 300px;
}
input, select, textarea {
  margin-bottom: 10px;
  padding: 8px;
}
</style>

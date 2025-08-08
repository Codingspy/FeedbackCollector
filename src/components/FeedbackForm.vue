<template>
  <div>
    <h2>Submit Feedback</h2>
    <form @submit.prevent="submitFeedback" class="bg-white shadow p-6 rounded max-w-lg mx-auto mt-8">
  <input class="border p-2 w-full mb-4" v-model="name" placeholder="Your Name" required />
  <select class="border p-2 w-full mb-4" v-model="category" required>
    <option disabled value="">Select Category</option>
    <option>Bug Report</option>
    <option>Feature Request</option>
    <option>General Suggestion</option>
  </select>
  <textarea class="border p-2 w-full mb-4" v-model="message" placeholder="Your Feedback" required></textarea>
  <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Submit Feedback</button>
  <p v-if="successMessage" class="mt-4 text-green-600">{{ successMessage }}</p>
</form>


    <p v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import axios from 'axios'

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

   try {
    // Call Python API first
    const response = await axios.post('http://127.0.0.1:5000/analyze', {
      text: message.value
    })
    const sentiment = response.data.sentiment

    // Then save to Firestore with sentiment
    await addDoc(collection(db, 'feedbacks'), {
      name: name.value,
      category: category.value,
      message: message.value,
      sentiment: sentiment,
      createdAt: Timestamp.now()
    })

    successMessage.value = `Thank you! Your feedback was marked as ${sentiment}.`
    name.value = ''
    category.value = ''
    message.value = ''
  } catch (error) {
    console.error("Error:", error)
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

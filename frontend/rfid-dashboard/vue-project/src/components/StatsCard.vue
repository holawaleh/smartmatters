<template>
  <v-card class="pa-4 mb-4" color="indigo-lighten-5" rounded="xl">
    <v-row align="center" justify="space-between">
      <div>
        <h3 class="text-h6 font-weight-bold">👤 Attendance</h3>
        <p>{{ present }} Present</p>
        <p>{{ absent }} Absent</p>
      </div>
      <v-avatar size="48" color="indigo">
        <span class="white--text text-h6 font-weight-bold">{{ present }}</span>
      </v-avatar>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const present = ref(0)
const absent = ref(0)

onMounted(async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/stats/')
    present.value = res.data.present_count
    absent.value = res.data.absent_count
  } catch (e) {
    console.error('Failed to fetch stats:', e)
  }
})
</script>

<template>
  <v-card class="pa-4" elevation="2">
    <h3 class="text-h6 mb-3">📋 Real-Time Logs</h3>
    <v-list dense>
      <v-list-item
        v-for="log in logs"
        :key="log.id"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ log.student_name }} - {{ log.course_name }} - {{ formatTime(log.timestamp) }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const logs = ref([])

const fetchLogs = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/logs/')
    logs.value = res.data.reverse().slice(0, 10)  // Latest 10 logs
  } catch (err) {
    console.error('Failed to fetch logs:', err)
  }
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString()
}

onMounted(fetchLogs)
</script>

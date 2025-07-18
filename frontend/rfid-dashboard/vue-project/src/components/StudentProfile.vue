<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Student Profile
          </v-card-title>
          <v-card-text v-if="student">
            <p><strong>Name:</strong> {{ student.name }}</p>
            <p><strong>Email:</strong> {{ student.email }}</p>
            <p><strong>UID:</strong> {{ student.uid }}</p>
          </v-card-text>
          <v-card-text v-else>
            <v-progress-circular indeterminate color="primary" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const studentId = route.params.id

const student = ref(null)

onMounted(() => {
  if (studentId) {
    fetchStudent()
    fetchAttendance()
  }
})

</script>

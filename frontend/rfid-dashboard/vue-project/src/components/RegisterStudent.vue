<template>
  <v-card class="pa-4" elevation="2">
    <v-card-title class="text-h6">📘 Register Student to Courses</v-card-title>
    <v-card-subtitle>Select a student and assign one or more courses</v-card-subtitle>

    <v-form @submit.prevent="registerStudent" ref="form">
      <v-autocomplete
        v-model="selectedStudent"
        :items="students"
        item-title="full_name"
        item-value="id"
        label="Select Student"
        :loading="loading"
        :disabled="loading"
        clearable
        required
        class="mt-4"
      />

      <v-autocomplete
        v-model="selectedCourses"
        :items="courses"
        item-title="name"
        item-value="id"
        label="Select Courses"
        multiple
        chips
        clearable
        required
        class="mt-4"
      />

      <v-btn
        type="submit"
        color="primary"
        class="mt-4"
        :loading="submitting"
        :disabled="!selectedStudent || selectedCourses.length === 0"
        block
      >
        Register
      </v-btn>
    </v-form>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-card>
   <v-btn @click="viewProfile(student.id)">View Profile</v-btn>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()

const students = ref([])
const courses = ref([])
const selectedStudent = ref(null)
const selectedCourses = ref([])
const submitting = ref(false)
const loading = ref(true)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const fetchData = async () => {
  try {
    const [studentRes, courseRes] = await Promise.all([
      axios.get('/students/'),
      axios.get('/courses/')
    ])
    students.value = studentRes.data.map(s => ({
      id: s.id,
      full_name: `${s.first_name} ${s.last_name}`
    }))
    courses.value = courseRes.data
  } catch (err) {
    console.error('Error loading data', err)
  } finally {
    loading.value = false
  }
}

const registerStudent = async () => {
  submitting.value = true
  try {
    await axios.post('/course/register/', {
      student_id: selectedStudent.value,
      course_ids: selectedCourses.value
    })
    snackbar.value = {
      show: true,
      message: 'Student registered successfully!',
      color: 'success'
    }
    selectedStudent.value = null
    selectedCourses.value = []
  } catch (err) {
    snackbar.value = {
      show: true,
      message: 'Failed to register student.',
      color: 'error'
    }
  } finally {
    submitting.value = false
  }
}
function viewProfile(studentId) {
  router.push(`/student/${studentId}`)
}
onMounted(fetchData)
</script>

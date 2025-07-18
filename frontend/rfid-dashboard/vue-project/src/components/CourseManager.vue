<template>
  <v-card>
    <v-card-title class="text-h6 d-flex justify-space-between align-center">
      Manage Courses
      <v-btn color="primary" @click="openAddDialog">➕ Add Course</v-btn>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="courses"
      :loading="loading"
      class="elevation-1"
    >
      <template #item.actions="{ item }">
        <v-btn icon @click="openEditDialog(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon color="error" @click="deleteCourse(item.id)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- ADD/EDIT COURSE DIALOG -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ isEdit ? 'Edit' : 'Add' }} Course</span>
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="form.name"
            label="Course Name"
            :rules="[v => !!v || 'Name is required']"
            required
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="submitCourse" :loading="submitting">
            {{ isEdit ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- SIMPLE SNACKBAR -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const courses = ref([])
const loading = ref(false)
const submitting = ref(false)
const dialog = ref(false)
const isEdit = ref(false)
const form = ref({ id: null, name: '' })

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Course Name', key: 'name' },
  { title: 'Actions', key: 'actions', sortable: false },
]

function showSnackbar(message, color = 'success') {
  snackbar.value = { show: true, message, color }
}

async function fetchCourses() {
  loading.value = true
  try {
    const res = await axios.get('/api/courses/')
    courses.value = res.data
  } catch (err) {
    showSnackbar('Failed to fetch courses', 'error')
  } finally {
    loading.value = false
  }
}

function openAddDialog() {
  form.value = { id: null, name: '' }
  isEdit.value = false
  dialog.value = true
}

function openEditDialog(course) {
  form.value = { ...course }
  isEdit.value = true
  dialog.value = true
}

async function submitCourse() {
  if (!form.value.name) return

  submitting.value = true
  try {
    if (isEdit.value) {
      await axios.put(`/api/courses/${form.value.id}/`, {
        name: form.value.name,
      })
      showSnackbar('Course updated!')
    } else {
      await axios.post('/api/courses/', {
        name: form.value.name,
      })
      showSnackbar('Course added!')
    }

    dialog.value = false
    fetchCourses()
  } catch (err) {
    showSnackbar('Save failed. Check input or try again.', 'error')
  } finally {
    submitting.value = false
  }
}

async function deleteCourse(id) {
  if (!confirm('Are you sure you want to delete this course?')) return
  try {
    await axios.delete(`/api/courses/${id}/`)
    showSnackbar('Course deleted.', 'info')
    fetchCourses()
  } catch (err) {
    showSnackbar('Delete failed.', 'error')
  }
}

onMounted(fetchCourses)
</script>

<style scoped>
.v-data-table {
  margin-top: 16px;
}
</style>

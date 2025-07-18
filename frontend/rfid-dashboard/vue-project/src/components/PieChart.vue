<template>
  <v-card class="pa-4" title="👤 Present">
    <canvas ref="chartCanvas"></canvas>
    <div class="text-caption mt-2">
      {{ absentCount }} Absent | {{ presentCount }} Present
    </div>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(PieController, ArcElement, Tooltip, Legend)

const chartCanvas = ref(null)
let chartInstance = null
const presentCount = ref(0)
const absentCount = ref(0)

const fetchAttendanceData = async () => {
  try {
    const [studentsRes, logsRes] = await Promise.all([
      axios.get('http://localhost:8000/students/'),
      axios.get('http://localhost:8000/logs/')
    ])

    const allStudents = studentsRes.data
    const today = new Date().toISOString().slice(0, 10)

    const todaysLogs = logsRes.data.filter(log =>
      log.timestamp.startsWith(today)
    )

    const presentStudentIds = new Set(todaysLogs.map(log => log.student.id))
    presentCount.value = presentStudentIds.size
    absentCount.value = allStudents.length - presentCount.value

    renderChart()
  } catch (err) {
    console.error('Error fetching chart data:', err)
  }
}

const renderChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartCanvas.value, {
    type: 'pie',
    data: {
      labels: ['Present', 'Absent'],
      datasets: [
        {
          label: 'Attendance',
          data: [presentCount.value, absentCount.value],
          backgroundColor: ['#4CAF50', '#F44336']
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

onMounted(fetchAttendanceData)
</script>

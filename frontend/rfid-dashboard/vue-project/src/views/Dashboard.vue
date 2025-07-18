<script setup>
import { ref } from 'vue' // ✅ add this!

import PresentCard from '../components/PresentCard.vue'
import AttendanceException from '../components/AttendanceException.vue'
import RealTimeLogs from '../components/RealTimeLogs.vue'
import BarChart from '../components/BarChart.vue'
import PieChart from '@/components/PieChart.vue'
import RegisterStudent from '@/components/RegisterStudent.vue'
import CourseManager from '@/components/CourseManager.vue'

import StudentProfile from '@/components/StudentProfile.vue'


const tab = ref('register') // ✅ this drives the tabs
</script>


<template>
  <v-container fluid>
    <v-row>
      <!-- HEADER -->
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title class="text-h5">Smart RFID LOG</v-card-title>
          <v-card-subtitle>Student Attendance Monitor</v-card-subtitle>
          <PresentCard />
        </v-card>
      </v-col>

      <v-col cols="12">
  <StudentProfile />
</v-col>


      <!-- ADMIN TOOLS: TABBED CARD -->
<v-col cols="12">
  <v-card class="pa-4">
    <v-card-title class="text-h6">📘 Admin Tools</v-card-title>
    <v-tabs v-model="tab" background-color="blue-grey-lighten-5" grow>
      <v-tab value="register">Register Student</v-tab>
      <v-tab value="courses">Course Manager</v-tab>
    </v-tabs>

    <v-window v-model="tab" class="mt-4">
      <v-window-item value="register">
        <RegisterStudent />
      </v-window-item>
      <v-window-item value="courses">
        <CourseManager />
      </v-window-item>
    </v-window>
  </v-card>
</v-col>
   

      <!-- PIE CHART -->
      <v-col cols="12" md="6">
        <PieChart />
      </v-col>

      <!-- ATTENDANCE EXCEPTION LINE CHART -->
      <v-col cols="12" md="6">
        <AttendanceException />
      </v-col>

      <!-- REAL-TIME BAR CHART -->
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title class="text-h6">📊 Real-Time Monitor</v-card-title>
          <BarChart />
        </v-card>
      </v-col>

      <!-- REAL-TIME LOGS -->
      <v-col cols="12">
        <RealTimeLogs />
      </v-col>
    </v-row>
  </v-container>
</template>

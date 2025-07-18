<template>
  <section class="card">
    <h3>{{ title }}</h3>
    <slot />
  </section>
</template>

<script setup>
defineProps(['title'])
</script>

<style scoped>
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.chart-placeholder {
  height: 150px;
  background: #eee;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
}
.log-list {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>

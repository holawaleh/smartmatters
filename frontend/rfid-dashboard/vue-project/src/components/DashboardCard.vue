<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      v-bind="props"
      class="pa-4 transition-fast-in-fast-out"
      elevation="4"
      :class="{ 'elevation-8': isHovering }"
    >
      <v-card-title class="text-h6 text-primary font-weight-bold mb-2">
        {{ title }}
      </v-card-title>
      <v-divider class="mb-3" />
      <v-card-text>
        <slot />
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script setup>
defineProps({
  title: String
})
</script>

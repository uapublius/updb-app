<template>
  <span><span>{{ name }}</span><span v-if="value > 1">s</span></span>
</template>

<script setup lang="ts">
defineProps<{
  name: string;
  value: number;
}>();
</script>

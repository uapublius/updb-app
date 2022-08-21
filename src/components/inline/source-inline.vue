<template>
  <span>{{ sourceName }}</span>
</template>

<script setup lang="ts">
import { sources } from '@/enums';

let props = defineProps<{
  source: number;
}>();

let sourceName = $computed(() => {
  return sources[props.source];
});
</script>

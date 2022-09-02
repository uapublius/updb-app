<template>
  <div class="h-100 w-100">
    <client-only>
      <report-map />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePageMeta } from '@/composables/usePageMeta';

let { setPageMeta } = usePageMeta();
let route = useRoute();

setPageMeta('UFO Sightings Map | UPDB', 'This map shows reports of UFO sightings around the world submitted to MUFON, NUFORC, and other organizations.');

watch(route, async () => {
  setPageMeta('UFO Sightings Map | UPDB', 'This map shows reports of UFO sightings around the world submitted to MUFON, NUFORC, and other organizations.');
}, { immediate: true });
</script>

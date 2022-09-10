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

let title = 'UFO Sightings Map | UPDB';
let description = 'Map of UFO sightings around the world submitted to MUFON, NUFORC, and other organizations.';

setPageMeta(title, description, "https://updb.app/updb_wide_map.jpg");

watch(route, async () => {
  setPageMeta(title, description, "https://updb.app/updb_wide_map.jpg");
}, { immediate: true });
</script>

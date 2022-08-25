<template>
  <div class="h-100 w-100">
    <client-only>
      <report-map />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { usePageMeta } from '@/composables/usePageMeta';

let { setPageMeta } = usePageMeta();

setPageMeta('UPDB | Map of UFO Sightings', 'This map shows reports of UFO sightings around the world submitted to MUFON, NUFORC, and other organizations.');
</script>

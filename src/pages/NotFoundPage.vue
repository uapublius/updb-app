<template>
  <div>
    404 Not Found
  </div>
</template>

<script setup lang="ts">
import { usePageMeta } from '@/composables/usePageMeta';

let { setPageMeta } = usePageMeta();

setPageMeta('404 Not Found');
</script>

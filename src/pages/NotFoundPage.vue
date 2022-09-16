<template>
  <div>
    404 Not Found
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePageMeta } from '@/composables/usePageMeta';

let { setPageMeta } = usePageMeta();

let route = useRoute();
let pageTitle = '404 Not Found';
let pageDescription = '404 Not Found';

setPageMeta(pageTitle, pageDescription);

watch(route, () => {
  setPageMeta(pageTitle, pageDescription);
}, { immediate: true });
</script>

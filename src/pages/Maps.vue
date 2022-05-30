<template>
  <div class="h-100 w-100">
    <client-only>
      <up-map />
    </client-only>
  </div>
</template>

<script setup lang="ts">
import { usePageMeta } from '@/composables/usePageMeta';

let { setPageTitle } = usePageMeta();

setPageTitle('UPDB | Map');
</script>

<template>
  <el-header height="auto" class="p-4">
    <h1>Search UFO Documents</h1>
  </el-header>

  <el-main class="px-4">
    <router-view />
  </el-main>
</template>

<script setup lang="ts">
import { ElHeader, ElMain } from 'element-plus';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePageMeta } from '@/composables/usePageMeta';

let { setPageMeta } = usePageMeta();
let route = useRoute();

setPageMeta('UFO Document Search | UPDB', 'This searchable database contains over 500,000 pages of UFO related documents, journals, magazines, newspaper clippings, and more.');

watch(route, async () => {
  setPageMeta('UFO Document Search | UPDB', 'This searchable database contains over 500,000 pages of UFO related documents, journals, magazines, newspaper clippings, and more.');
}, { immediate: true });
</script>

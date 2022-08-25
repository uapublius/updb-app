<template>
  <el-header
    height="auto"
    class="p-4">
    <h2>Documents</h2>
  </el-header>

  <el-main class="px-4">
    <router-view />
  </el-main>
</template>

<script setup lang="ts">
import { ElHeader, ElMain } from 'element-plus';
import { usePageMeta } from '@/composables/usePageMeta';

let { setPageMeta } = usePageMeta();

setPageMeta('UPDB | UFO Documents Database', 'This searchable database contains over 500,000 pages of UFO related documents, journals, magazines, newspaper clippings, and more.');
</script>

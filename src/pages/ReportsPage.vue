<template>
  <el-header
    height="auto"
    class="flex align-items-center p-4">
    <h1 class="me-3">Search UFO Reports</h1>
  </el-header>

  <el-main class="px-4">
    <router-view />
  </el-main>
</template>

<script setup lang="ts">
import { ElHeader, ElMain } from 'element-plus';

defineProps<{
  country?: string;
  district?: string;
  city?: string;
  water?: string;
  other?: string;
}>();
</script>

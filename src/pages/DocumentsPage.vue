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
</script>

<template>
  <el-header
    height="auto"
    class="p-4">
    <h2>Submit</h2>
  </el-header>

  <div class="page-container p-4">
    <el-card
      header="Report"
      shadow="never"
      class="ms-3" />
    <el-card
      header="Upload"
      shadow="never"
      class="ms-3" />
    <el-card
      header="Submit"
      shadow="never"
      class="ms-3" />
  </div>
</template>

<script setup lang="ts">
import { ElHeader, ElCard } from 'element-plus';
</script>

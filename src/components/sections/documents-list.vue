<template>
  <el-card
    shadow="never"
    class="ms-3">
    <document-list :page-size="20" />
  </el-card>
</template>

<script setup lang="ts">
import { ElCard } from 'element-plus';
</script>

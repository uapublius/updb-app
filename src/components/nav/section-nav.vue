<template>
  <el-menu
    router
    :default-active="$route.path.toString()"
    mode="horizontal">
    <slot />
  </el-menu>
</template>

<script setup lang="ts">
import { ElMenu } from 'element-plus';
</script>
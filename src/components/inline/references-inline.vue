<template>
  <span
    class="flex-inline align-items-center"
    title="References">
    <el-icon
      :size="16"
      class="me-1">
      <icon-books />
    </el-icon>
    {{ references.length }}
  </span>
</template>

<script setup lang="ts">
import { ElIcon } from 'element-plus';
import { ReportReferenceView } from '@/models';

defineProps<{
  references: ReportReferenceView[];
}>();
</script>

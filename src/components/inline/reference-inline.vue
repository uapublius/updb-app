<template>
  <span class="reference-inline flex-inline align-items-start lineheight-1 ms-1">
    <el-icon
      :size="16"
      class="me-1 text-gray-60">
      <Document />
    </el-icon>
    <span
      :title="tooltipForReference(reference)"
      v-html="formatted" />
  </span>
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue';
import { ElIcon } from 'element-plus';
import { lf2br, linkify } from '@/util';

let props = defineProps<{
  reference: any;
}>();

let formatted = $computed(() => {
  let ref = linkify(props.reference);
  let parts = ref.split('\n');
  if (parts.length > 1) parts[0] = `<strong>${parts[0]}</strong>`;
  if (parts.length > 2) parts[1] = `<em>${parts[1]}</em>`;
  let final = '<div>' + lf2br(parts.join('</div><div>')) + '</div>';
  return final;
});

function tooltipForReference(reference) {
  if (reference.includes("https://mufoncms.com")) {
    return "MUFON membership is required to view mufoncms.com links";
  }
}
</script>

<style>
.reference-inline>span>div {
  margin-bottom: 4px;
}
</style>
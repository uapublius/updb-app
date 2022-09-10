<template>
  <div>
    <div
      v-for="report in reportsStore.reportsForCurrentPage"
      :key="report"
      class="report-results ms-4">
      <report-result
        :id="report"
        :expanded="expanded[report]"
        :anchor="anchor"
        :references="reportsStore.references[report]"
        :attachments="reportsStore.attachments[report]"
        @select="r => emit('select', r)"
        @toggle="expanded[report] = !expanded[report]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReportsStore } from "@/store/reports";
let reportsStore = useReportsStore();
let expanded = $ref({} as any);

defineProps<{
  anchor?: boolean;
}>();

let emit = defineEmits(['select']);

</script>

<style>
.report-results:first-child {
  margin-top: 0 !important;
}

.report-results:last-child {
  margin-bottom: 0 !important;
}
</style>

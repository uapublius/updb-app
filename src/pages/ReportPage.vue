<template>
  <el-header
    height="auto"
    class="p-4 flex justify-content-between">
    <h2>{{ title }} </h2>
    <slot />
  </el-header>

  <el-main class="report-page px-4">
    <report-overview
      v-if="report"
      :id="report.id" />
  </el-main>
</template>

<script setup lang="ts">
import { ElHeader, ElMain } from 'element-plus';
import { usePageMeta } from "@/composables/usePageMeta";
import { sources } from "@/enums";
import { useReportsStore } from "@/store/reports";

let { setPageTitle } = usePageMeta();
let reportsStore = useReportsStore();

let props = defineProps<{
  source: string;
  sourceId: string;
}>();

let title = $computed(() => {
  return `${sources[props.source]} ${props.sourceId}`;
});

let report = $computed(() => {
  return reportsStore.reportBySourceId(parseInt(props.source), props.sourceId);
});

await reportsStore.fetchReport(props.source, props.sourceId);
await reportsStore.getAttachmentsReferences([report.id]);
setPageTitle(title);
</script>

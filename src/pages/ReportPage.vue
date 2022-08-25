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
import { DateTime } from 'luxon';
import { usePageMeta } from "@/composables/usePageMeta";
import { sources } from "@/enums";
import { useReportsStore } from "@/store/reports";

let { setPageMeta } = usePageMeta();
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

let pageTitle = $computed(() => {
  let filterStrings = [];
  let locs = ['city', 'district', 'country', 'water', 'other'].map(l => {
    return report[l];
  }).filter(l => l).join(', ');
  filterStrings.push(locs);

  let date = DateTime.fromISO(report.date.toString()).toLocaleString(DateTime.DATETIME_SHORT);

  return `${sources[props.source]} ${props.sourceId} – ${date} – ${filterStrings.join(', ')} | UFO Report`;
});

let pageDescription = $computed(() => {
  return `${report.description?.substring(0, 239).replaceAll(/\n+/g, ' / ')}…`;
});

await reportsStore.fetchReport(props.source, props.sourceId);
await reportsStore.getAttachmentsReferences([report.id]);
setPageMeta(pageTitle, pageDescription);
</script>

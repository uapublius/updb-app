<template>
  <el-header
    height="auto"
    class="p-4 flex justify-content-between">
    <h1>{{ title }}</h1>
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
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePageMeta } from "@/composables/usePageMeta";
import { sources } from "@/enums";
import { useReportsStore } from "@/store/reports";

let { setPageMeta } = usePageMeta();
let reportsStore = useReportsStore();
let route = useRoute();

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

  let date = DateTime.fromISO(report.date.toString()).toLocaleString(DateTime.DATE_SHORT);

  return `${filterStrings.join(', ')} – ${date} | ${sources[props.source]} UFO Report`;
});

let pageDescription = $computed(() => {
  return `${report.description?.substring(0, 239).replaceAll(/\n+/g, ' / ')}…`;
});

await reportsStore.fetchReport(props.source, props.sourceId);
await reportsStore.fetchAttachmentsReferences([report.id]);
setPageMeta(pageTitle, pageDescription);

watch(route, () => {
  setPageMeta(pageTitle, pageDescription);
}, { immediate: true });
</script>

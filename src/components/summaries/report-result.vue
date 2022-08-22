<template>
  <div class="report-result">
    <div class="text-larger ms-2">
      <a
        class="inline"
        @click="emit('select', report)">
        <date-inline
          :date="report.date"
          format="DATETIME_MED"
          class="me-2" />

        <span class="me-2">—</span>

        <location-inline
          :id="report.location" />
      </a>
    </div>

    <div class="text-green ms-1 lineheight-1 flex align-items-center">
      <span class="me-3">
        {{ sourceName }} {{ report.source_id }}
      </span>

      <span
        class="flex align-items-center me-2"
        title="Word Count">
        <icon-align-left class="me-1" /> {{ report.word_count }}
      </span>

      <references-inline
        v-if="reportsStore.referencesForReport(report.id).length > 1"
        :references="reportsStore.referencesForReport(report.id)"
        class="me-2" />

      <attachments-inline
        v-if="attachments.length"
        :attachments="attachments" />
    </div>

    <div
      v-if="report.description?.trim().length"
      class="ms-2 flex align-items-center text-gray-30 snippet cursor-pointer"
      @click="emit('toggle', report.id)">
      <span
        v-if="expanded"
        class="inline me-1">
        {{ description }}
      </span>
      <span
        v-else
        class="inline me-1">
        {{ snippet }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import LocationInline from '../inline/location-inline.vue';
import { sources } from '@/enums';
import { Attachment, ReportReferenceView } from "@/models";
import { useReportsStore } from "@/store/reports";
let reportsStore = useReportsStore();

let emit = defineEmits(['select', 'toggle']);

let props = defineProps<{
  id: number;
  attachments?: Attachment[];
  references?: ReportReferenceView[];
  expanded?: boolean;
}>();

let report = $computed(() => {
  return reportsStore.reports[props.id];
});

let description = $computed(() => {
  return report.description?.trim();
});

let snippet = $computed(() => {
  return report.description?.trim()?.replace(/\n/g, ' ').substring(0, 120).trim() + "...";
});

let sourceName = $computed(() => {
  return sources[report.source];
});

let attachments = $computed(() => {
  return reportsStore.attachmentsForReport(report.id);
});
</script>

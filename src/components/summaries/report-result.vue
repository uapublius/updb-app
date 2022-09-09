<template>
  <div class="report-result" :class="{ 'is-collapsed': !expanded }">
    <div itemscope itemtype="https://schema.org/Event" class="text-larger ms-2">
      <a
        class="inline"
        :href="link"
        @click="emit('select', report)">
        <location-inline
          :id="report.location"
          itemprop="location"
          itemscope
          itemtype="https://schema.org/Place" />
        <span class="mx-2">—</span>
        <date-inline
          itemprop="startDate"
          :datetime="report.date"
          :date="report.date"
          format="DATETIME_MED" />
      </a>
    </div>

    <div class="text-green ms-1 lineheight-1 flex align-items-center">
      <span class="me-3">
        {{ sourceName }} {{ report.source_id }}
      </span>

      <span class="flex align-items-center me-2" title="Word Count">
        <icon-align-left class="me-1" /> {{ report.word_count }}
      </span>

      <references-inline
        v-if="reportsStore.referencesForReport(report.id).length > 1"
        :references="reportsStore.referencesForReport(report.id)"
        class="me-2" />

      <attachments-inline v-if="attachments.length" :attachments="attachments" />
    </div>

    <div
      v-if="report.description?.trim().length"
      class="ms-2 flex align-items-center text-gray-30 snippet cursor-pointer"
      @click="emit('toggle', report.id)">
      <span class="inline me-1">
        {{ description }}
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
  anchor?: boolean;
  attachments?: Attachment[];
  references?: ReportReferenceView[];
  expanded?: boolean;
}>();

let link = $computed(() => {
  return props.anchor ? `/report/${report.source}-${report.source_id}` : undefined;
});

let report = $computed(() => {
  return reportsStore.reports[props.id];
});

let description = $computed(() => {
  return report.description?.trim();
});

let sourceName = $computed(() => {
  return sources[report.source];
});

let attachments = $computed(() => {
  return reportsStore.attachmentsForReport(report.id);
});
</script>

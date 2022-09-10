<template>
  <div
    class="report-result"
    :class="{ 'is-collapsed': !expanded }"
    itemscope
    itemtype="https://schema.org/Event">
    <div class="text-larger ms-2">
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
      <span itemprop="name" class="me-3">
        {{ sourceName }} {{ report.source_id }}
      </span>

      <references-inline
        v-if="reportsStore.referencesForReport(report.id).length > 1"
        :references="reportsStore.referencesForReport(report.id)"
        class="me-3" />

      <attachments-inline v-if="attachments.length" :attachments="attachments" class="me-3" />

      <span v-if="wordData" class="flex align-items-center">
        <client-only>
          <el-popover
            :show-after="200"
            placement="auto"
            width="auto"
            trigger="hover">
            <template #reference>
              <span
                class="text-green lineheight-1 underdotted cursor-default">
                <span>{{ report.word_count }} words&nbsp;</span>
                <span>({{ wordData.original.adjectives.length }}adj&nbsp;</span>
                <span>{{ wordData.original.adverbs.length }}adv&nbsp;</span>
                <span>{{ wordData.original.verbs.length }}v)</span>
              </span>
            </template>
            <div>
              <div class="ms-2">
                <div class="text-bold text-larger ms-1">
                  {{ report.word_count }} Words
                </div>
              </div>
              <div class="ms-2">
                <div class="text-bold text-large ms-1 text-gray-50">
                  Adjectives
                </div>
                <div>
                  {{ wordData.formatted.adjectives }}
                </div>
              </div>
              <div class="ms-2">
                <div class="text-bold text-large ms-1 text-gray-50">
                  Adverbs
                </div>
                <div>
                  {{ wordData.formatted.adverbs }}
                </div>
              </div>
              <div>
                <div class="text-bold text-large ms-1 text-gray-50">
                  Verbs
                </div>
                <div>
                  {{ wordData.formatted.verbs }}
                </div>
              </div>
            </div>
          </el-popover>
        </client-only>
      </span>
    </div>

    <div class="snippet-wrapper">
      <div
        v-if="report.description?.trim().length"
        class="ms-2 flex align-items-center text-gray-30 snippet cursor-pointer"
        @click="emit('toggle', report.id)">
        <span class="inline me-1">
          {{ description }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElPopover, ElButton } from 'element-plus';
import { onMounted } from 'vue';
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

let wordData = $computed(() => {
  return reportsStore.wordDataForReport(report.id);
});

onMounted(() => {
  reportsStore.getAdverbs(report.id);
});
</script>

<template>
  <div class="result my-3">
    <div class="ms-1">
      <div>
        <router-link :to="permalink" target="_blank">{{ sourceName }} {{ report.source_id }}</router-link>
      </div>

      <div class="result-prefix ms-1">
        <span class="pe-1">{{ breadcrumbsForReport }}</span>
        <br />
        <span class="pe-1">{{ dateForReport }}</span>
      </div>

      <div v-if="expanded" class="snippet" v-html="report.description" />
      <div v-else class="snippet"
        v-html="report.snippet || report.description?.replace(/\n\n/g, '\n').substring(0, 240)" />
      <div class="result-show-more">
        <a class="mn-2" v-if="expanded" @click="expanded = false">Close</a>
        <a v-else @click="expanded = true">More</a>
      </div>

      <div class="pe-2">
        <h6 v-if="references?.length" class="ms-1 mn-2">References {{ references.length }}</h6>
        <h6 v-if="attachments?.length" class="ms-1 mn-2">Attachments {{ attachments.length }}</h6>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { DateTime } from "luxon";
import { sources } from "@/sources";

const props = defineProps<{
  report: Report;
  references: string[];
  attachments: string[];
}>();

let expanded = ref(false);

let sourceName = computed(() => {
  return sources[props.report.source];
});

let permalink = computed(() => {
  return `/report/${props.report.source}-${props.report.source_id}`;
});

function formatDate(date) {
  return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT);
}

let breadcrumbsForReport = computed(() => {
  let report = props.report;
  return [report.city, report.district, report.country, report.water, report.other]
    .filter(l => l)
    .join(" › ");
});

let dateForReport = computed(() => {
  return formatDate(props.report.date);
});

</script>

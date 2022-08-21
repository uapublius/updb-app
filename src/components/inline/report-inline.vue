<template>
  <span class="flex align-items-center text-large">
    <!-- <div class="text-gray-40">
      <location-inline v-if="showLocation" :id="report.location" />
      <date-inline :date="report.date" />
    </div>
    <div class="text-gray-40">&nbsp;•&nbsp;</div> -->
    <router-link
      class="me-1"
      :to="permalink">
      <date-inline :date="report.date" />
      <location-inline
        v-if="showLocation"
        :id="report.location" />

      <!-- <source-inline :source="report.source" />
      &nbsp;
      <span class="text-uppercase">{{ report.source_id }}</span> -->
    </router-link>
  </span>
</template>

<script setup lang="ts">
import { useReportsStore } from "@/store/reports";
import DateInline from "./date-inline.vue";
let reportsStore = useReportsStore();

let props = defineProps<{
  id: number;
  showLocation?: boolean;
}>();

let report = $computed(() => {
  return reportsStore.reports[props.id];
});

let permalink = $computed(() => {
  return `/report/${report.source}-${report.source_id}`;
});
</script>

<style scoped>
a {
  white-space: nowrap;
}
</style>
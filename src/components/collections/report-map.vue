<template>
  <div class="w-100 h-100">
    <div
      ref="reportMap"
      class="w-100 h-100 position-relative">
      <div
        id="report-map"
        class="w-100 h-100" />

      <el-drawer
        v-model="drawer"
        :modal="false"
        modal-class="features-drawer"
        size="30%"
        @close="drawerClose">
        <template #header>
          <div>
            {{ totalSelectedReports }}
            <plural
              name="report"
              :value="totalSelectedReports" />
            selected
          </div>
        </template>

        <report-list
          :key="page"
          class="px-3 map-result-list"
          @select="handleSelect" />

        <template #footer>
          <client-only>
            <el-pagination
              v-if="reportsStore.resultsTotal > reportsStore.limit" 
              v-model:currentPage="page"
              v-model:pageSize="reportsStore.limit"
              :pager-count="3"
              :total="reportsStore.resultsTotal"
              layout="prev, pager, next"
              class="p-0"
              background
              hide-on-single-page
              @current-change="pageChange" />
          </client-only>
        </template>
      </el-drawer>

      <el-drawer
        v-model="inspectorDrawer"
        :modal="false"
        direction="btt"
        modal-class="inspector-drawer"
        :title="viewingReportTitle"
        :append-to-body="true"
        size="calc(100% - 20px)">
        <report-overview
          v-if="viewingReport"
          :id="viewingReport.id" />
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElPagination, ElDrawer } from 'element-plus';
import { onMounted, watch } from "vue";
import { onBeforeRouteLeave, useRoute } from "vue-router";
import Plural from "../widgets/plural.vue";
import { useMap } from "@/composables/useMap";
import { sources } from "@/enums";
import { useFiltersStore } from "@/store/filters";
import { useReportsStore } from "@/store/reports";

let route = useRoute();
let filtersStore = useFiltersStore();
let reportsStore = useReportsStore();

let page = $ref(route.query.page ? parseInt(route.query.page?.toString()) : 1);
let drawer = $ref(false);
let inspectorDrawer = $ref(false);
let reportMap = $ref(null);

let lon = route.query.lon ? parseFloat(route.query.lon.toString()) : -97.7;
let lat = route.query.lat ? parseFloat(route.query.lat.toString()) : 38.8;
let zoom = route.query.zoom ? parseFloat(route.query.zoom.toString()) : 4.20;
let {
 createMap, selectedLocations, totalSelectedReports, unselectCluster
} = useMap('report-map');

onMounted(() => {
  createMap([lon, lat], zoom);
});

onBeforeRouteLeave(() => {
  if (inspectorDrawer) {
    inspectorDrawer = false;
    return false;
  }

  if (drawer) {
    drawer = false;
    return false;
  }

  page = 1;
  reportsStore.resultsTotal = null;
  reportsStore.results = [];
  reportsStore.selectedLocations = [];
});

watch(selectedLocations, async () => {
  drawer = !!selectedLocations.value.length;
  inspectorDrawer = false;
  reportsStore.selectedLocations = selectedLocations.value || [];

  page = 1;
  reportsStore.resultsTotal = null;
  reportsStore.results = [];

  if (reportsStore.selectedLocations.length) {
    await reportsStore.fetchNextReportsAndLocationDetails(page);
    
    let prefix = `${reportsStore.resultsTotal?.toLocaleString()} report`;
    if (reportsStore.resultsTotal > 1) prefix += 's';

    filtersStore.buildSummary(prefix);
  }
});

let viewingReport = $computed(() => {
  if (!reportsStore.viewingReport) return null;
  return reportsStore.reports[reportsStore.viewingReport];
});

let viewingReportTitle = $computed(() => {
  if (!viewingReport) return;
  return `${sources[viewingReport.source]} ${viewingReport.source_id}`;
});

function drawerClose() {
  inspectorDrawer = false;
  unselectCluster();
}

async function pageChange() {
  await reportsStore.fetchNextReportsAndLocationDetails(page);
}

function handleSelect(report) {
  reportsStore.viewingReport = report.id;
  inspectorDrawer = true;
}
</script>

<style>
html {
  scrollbar-gutter: initial;
}

.el-drawer__footer {
  padding: 1em;
  overflow-x: auto;
}

.el-drawer__header {
  padding: 1em 1em 0 1em;
}

.features-drawer .el-drawer__body {
  padding: 0;
}

.features-drawer .el-drawer__header {
  margin-bottom: var(--el-drawer-padding-primary);
}

.features-drawer > .el-drawer {
  resize: horizontal;
  direction: rtl;
  pointer-events: all;
  right: 10px;
  height: calc(100% - 20px);
  top: 10px;
  bottom: 10px;
  background: rgba(255, 255, 255, 0.96);
}

.features-drawer > .el-drawer > * {
  direction: ltr;
}

.features-drawer,
.inspector-drawer {
  background: none;
  pointer-events: none;
}

.inspector-drawer .el-drawer__header {
  margin-bottom: 0;
}

.inspector-drawer > .el-drawer {
  resize: horizontal;
  pointer-events: all;
  width: calc(70% - 30px);
  height: calc(100% - 20px);
  right: 10px;
  left: 10px;
  bottom: 10px;
  top: 10px;
  background: rgba(255, 255, 255, 0.96);
}
</style>
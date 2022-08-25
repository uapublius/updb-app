<template>
  <el-card
    shadow="never"
    class="ms-3">
    <report-filters
      :disabled="reportsStore.isSearching"
      @search="doNewSearch" />
  </el-card>

  <el-card
    v-if="reportsStore.resultsTotal !== null"
    shadow="never"
    class="ms-3">
    <div
      v-show="reportsStore.resultsTotal"
      class="text-bold text-gray-50 ms-3">
      Found {{ reportsStore.filterSummary }}
    </div>

    <div
      v-show="reportsStore.resultsTotal === 0"
      class="text-bold text-gray-50">
      No reports found
    </div>

    <report-list @select="handleSelect" />

    <client-only>
      <el-pagination
        v-if="reportsStore.resultsTotal"
        v-model:currentPage="page"
        v-model:pageSize="reportsStore.limit"
        :total="reportsStore.resultsTotal"
        layout="prev, pager, next"
        background
        hide-on-single-page
        class="mn-4"
        @current-change="addFiltersToRoute" />
    </client-only>
  </el-card>
</template>

<script setup lang="ts">
import { ElPagination, ElCard } from 'element-plus';
import { watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { usePageMeta } from '@/composables/usePageMeta';
import { useReportsStore } from "@/store/reports";
let reportsStore = useReportsStore();
let { setPageMeta } = usePageMeta();
let route = useRoute();
let router = useRouter();
let page = $ref(route.query.page ? parseInt(route.query.page?.toString()) : 1);

updateStoreFromRoute();

resetResults();
await doSearch();

watch(route, async () => {
  updateStoreFromRoute();
  await doSearch();
});

function updateStoreFromRoute() {
  page = route.query.page ? parseInt(route.query.page?.toString()) : 1;

  reportsStore.keyword = route.query.keyword?.toString() || undefined;
  reportsStore.from = route.query.from?.toString() || undefined;
  reportsStore.to = route.query.to?.toString() || undefined;
  reportsStore.location.city = route.query.city?.toString() || undefined;
  reportsStore.location.district = route.query.district?.toString() || undefined;
  reportsStore.location.country = route.query.country?.toString() || undefined;
  reportsStore.location.water = route.query.water?.toString() || undefined;
  reportsStore.location.other = route.query.other?.toString() || undefined;
}

function resetResults() {
  reportsStore.resultsTotal = null;
  reportsStore.results = [];
}

async function doSearch() {
  await reportsStore.doSearch(page);
  reportsStore.buildSummary();
  setPageMeta(reportsStore.filterSummary || "Reports" + " | UPDB");
}

async function doNewSearch() {
  let pageFrom = page;
  page = 1;
  resetResults();
  addFiltersToRoute();
  if (pageFrom === 1) await doSearch();
}

function addFiltersToRoute() {
  router.push({
    name: 'ReportsList',
    query: {
      page,
      locations: reportsStore.selectedLocations?.toString() || undefined,
      keyword: reportsStore.keyword?.toString() || undefined,
      from: reportsStore.from?.toString() || undefined,
      to: reportsStore.to?.toString() || undefined,
      city: reportsStore.location.city?.toString() || undefined,
      district: reportsStore.location.district?.toString() || undefined,
      country: reportsStore.location.country?.toString() || undefined,
      water: reportsStore.location.water?.toString() || undefined,
      other: reportsStore.location.other?.toString() || undefined
    }
  });
}

function handleSelect(report) {
  let permalink = `/report/${report.source}-${report.source_id}`;
  router.push(permalink);
}
</script>

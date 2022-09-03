<template>
  <el-card shadow="never" class="ms-3">
    <report-filters :disabled="reportsStore.isSearching" @search="doNewSearch" />
  </el-card>

  <el-card
    v-if="reportsStore.resultsTotal !== null"
    shadow="never"
    class="ms-3">
    <h2 v-show="reportsStore.resultsTotal" class="text-bold text-gray-50 text-larger ms-4">
      Found {{ reportsStore.filterSummary }}
    </h2>

    <div v-show="reportsStore.resultsTotal === 0" class="text-bold text-gray-50">
      No reports found
    </div>

    <report-list anchor />

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
        @current-change="updateRouteFromStore" />
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

let props = defineProps<{
  country?: string;
  district?: string;
  city?: string;
  water?: string;
  other?: string;
}>();

let title = $computed(() => {
  let start = reportsStore.filterSummary || "Search 300,000+ UFO & UAP Reports";
  return start + " | UPDB";
});

let description = $computed(() => {
  return "Search 300,000+ UFO & UAP Reports";
});

try {
  updateStoreFromRoute();
  reportsStore.resetResults();
  await searchAndBuildSummary();
}
 catch (error) {
  console.error(error.message);
}

watch(route, async () => {
  updateStoreFromRoute();
  await searchAndBuildSummary();
});

async function doNewSearch() {
  let pageFrom = page;
  page = 1;
  reportsStore.resetResults();
  updateRouteFromStore();
  if (pageFrom === 1) await searchAndBuildSummary();
}

async function searchAndBuildSummary() {
  await reportsStore.doSearch(page);
  reportsStore.buildSummary();
  setPageMeta(title, description);
}

function updateRouteFromStore() {
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

function updateStoreFromRoute() {
  page = route.query.page ? parseInt(route.query.page?.toString()) : 1;

  reportsStore.keyword = route.query.keyword?.toString() || undefined;
  reportsStore.from = route.query.from?.toString() || undefined;
  reportsStore.to = route.query.to?.toString() || undefined;
  reportsStore.location.city = props.city || route.query.city?.toString() || undefined;
  reportsStore.location.district = props.district?.replaceAll('_', ' ') || route.query.district?.toString() || undefined;
  reportsStore.location.country = props.country?.toUpperCase() || route.query.country?.toString().toUpperCase() || undefined;
  reportsStore.location.water = props.water || route.query.water?.toString() || undefined;
  reportsStore.location.other = props.other || route.query.other?.toString() || undefined;
}
</script>

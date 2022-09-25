<template>
  <el-card shadow="never" class="ms-3" :body-style="{ 'padding-bottom': '10px' }">
    <report-filters
      :searching="reportsStore.isSearching"
      @search="doNewSearch" />
  </el-card>
  
  <div v-if="!reportsStore.isSearching && reportsStore.resultsTotal !== null" shadow="never" class="ms-4 pn-2 pw-1">
    <div class="flex align-items-center justify-content-end search-header">
      <div class="flex-grow search-message">
        <h2 v-show="reportsStore.resultsTotal" class="text-bold text-gray-50 text-larger lineheight-13">
          Found {{ filtersStore.filterSummary }}
        </h2>

        <div v-show="reportsStore.resultsTotal === 0" class="text-bold text-gray-50">
          No reports found
        </div>
      </div>
    
      <div class="flex justify-content-end search-actions">
        <el-button
          :icon="Download"
          class="mx-3"
          title="Download CSV"
          @click="downloadResults">
          Download
        </el-button>

        <client-only>
          <el-select
            v-model="reportsStore.sort"
            placeholder="Sort"
            style="width: 140px"
            title="Sort"
            @change="doNewSearch">
            <el-option label="↓ Date" :value="defaultSort" />
            <el-option label="↑ Date" value="date,country,district,city" />
            <el-option label="↓ Location" value="country.desc,district.desc,city.desc,date.desc" />
            <el-option label="↑ Location" value="country,district,city,date.desc" />
          </el-select>
        </client-only>
      </div>
    </div>
  </div>

  <el-card v-show="!reportsStore.isSearching" shadow="never" class="ms-3">
    <report-list anchor />

    <div v-if="reportsStore.resultsTotal" class="flex justify-content-center">
      <el-pagination
        v-model:currentPage="page"
        v-model:pageSize="reportsStore.limit"
        :total="reportsStore.resultsTotal"
        :pager-count="5"
        layout="pager"
        background
        hide-on-single-page
        class="text-large mn-4"
        @current-change="updateRouteFromStore" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Download } from '@element-plus/icons-vue';
import {
 ElPagination, ElCard, ElSelect, ElOption, ElButton
} from 'element-plus';
import { watch } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { usePageMeta } from '@/composables/usePageMeta';
import { useFiltersStore } from "@/store/filters";
import { useReportsStore } from "@/store/reports";

let filtersStore = useFiltersStore();
let reportsStore = useReportsStore();
let { setPageMeta } = usePageMeta();
let route = useRoute();
let router = useRouter();

let page = $ref(route.query.page ? parseInt(route.query.page?.toString()) : 1);
let defaultSort = $ref('date.desc,country,district,city');

let props = defineProps<{
  sourcename?: string;
  country?: string;
  district?: string;
  city?: string;
  water?: string;
  other?: string;
}>();

let title = $computed(() => {
  if (filtersStore.filterSummary) return filtersStore.filterSummary + " | Search UFO Sightings";
  return "Search UFO Sightings | UPDB";
});

let description = $computed(() => {
  return "Search 300,000+ UFO Sightings & UAP Reports from around the world.";
});

try {
  await filtersStore.fetchSources();
  updateStoreFromRoute();
  reportsStore.resetResults();
  if (filtersStore.hasFilter) await searchAndBuildSummary();
}
catch (error) {
  console.error(error);
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
  await reportsStore.fetchNextReportsAndLocationDetails(page);

  let prefix = `${reportsStore.resultsTotal?.toLocaleString()} report`;
  if (reportsStore.resultsTotal > 1) prefix += 's';
  filtersStore.buildSummary(prefix);

  setPageMeta(title, description);
}

async function downloadResults() {
  let timestamp = Math.floor(+new Date() / 10000);
  await reportsStore.download(`UPDB.export.${timestamp}.csv`, { limit: undefined });
}

function updateRouteFromStore() {
  router.push({
    name: 'ReportsList',
    query: {
      page,
      locations: reportsStore.selectedLocations?.toString() || undefined,
      sort: reportsStore.sort === defaultSort ? undefined : reportsStore.sort?.toString(),
      keyword: filtersStore.keyword?.toString() || undefined,
      minWords: filtersStore.minWords?.toString() || undefined,
      source: filtersStore.source.length ? filtersStore.source.map(s=>s.id).join(',') : undefined,
      from: filtersStore.from?.toString() || undefined,
      to: filtersStore.to?.toString() || undefined,
      city: filtersStore.location.city?.toString() || undefined,
      district: filtersStore.location.district?.toString() || undefined,
      country: filtersStore.location.country?.toString() || undefined,
      water: filtersStore.location.water?.toString() || undefined,
      other: filtersStore.location.other?.toString() || undefined
    }
  });
}

function updateStoreFromRoute() {
  page = route.query.page ? parseInt(route.query.page?.toString()) : 1;

  if (route.query.source) {
    filtersStore.setSources(route.query.source);
  }
  else if (props.sourcename) {
    filtersStore.setSource(props.sourcename);
  }

  filtersStore.minWords = route.query.minWords ? parseInt(route.query.minWords?.toString()) : null;
  filtersStore.keyword = route.query.keyword?.toString() || undefined;
  filtersStore.from = route.query.from?.toString() || undefined;
  filtersStore.to = route.query.to?.toString() || undefined;
  filtersStore.location.city = props.city || route.query.city?.toString() || undefined;
  filtersStore.location.district = props.district?.replaceAll('_', ' ') || route.query.district?.toString() || undefined;
  filtersStore.location.country = props.country?.toUpperCase() || route.query.country?.toString().toUpperCase() || undefined;
  filtersStore.location.water = props.water || route.query.water?.toString() || undefined;
  filtersStore.location.other = props.other || route.query.other?.toString() || undefined;
  
  if (route.query.sort && route.query.sort !== defaultSort) {
    reportsStore.sort = route.query.sort.toString();
  }
}
</script>

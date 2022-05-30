<template>
  <div class="my-2 px-2">
    <search-nav />

    <h1 class="ms-3">Reports {{ summary }}</h1>

    <div class="my-4">
      <div v-for="report in reports">
        <result-report :report="report" :attachments="[]" :references="[]" />
      </div>

      <div class="loader">
        <div v-if="isSearchingReports" class="my-3">Searching...</div>
        <div v-if="!noMoreReports && !isSearchingReports">
          <a @click="searchReports">Load more...</a>
        </div>
      </div>

      <h4 v-if="noMoreReports">End of results.</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import qs from "qs";
import axios from "axios";
import { object2array, paramSummary } from "@/lib/util";
import { buildFilters } from "@/composables/useTabulator/buildFilters";

let route = useRoute();
let meta = inject("meta") as HeadTags;

let filters = ref(null);
let reports = ref([]);
let isSearchingReports = ref(false);
let summary = ref("");
let reportsOffset = ref(0);
let noMoreReports = ref(false);

onMounted(async () => {
  filters.value = object2array(qs.parse(route.query.filters));
  if (filters.value?.length) searchReports();
  summary.value = paramSummary(filters.value);
});

let size = 20;

async function searchReports() {
  let filterParams = buildFilters(filters.value);

  isSearchingReports.value = true;
  try {
    let { data } = await axios.get("/api/reports/report_view", {
      params: { ...filterParams, limit: size, order: "date.desc", offset: reportsOffset.value }
    });

    if (data.length < size) {
      noMoreReports.value = true;
    }

    let description = filters.value.find(f => f.field === "description");

    data = data.map(d => {
      return {
        ...d,
        snippet: d.description.replace(description.value, `<b>${description.value}</b>`)
      };
    });

    reports.value = [...reports.value, ...data];
    // }
  } catch (error) {
    console.log(error);
  } finally {
    isSearchingReports.value = false;
  }
}

function setMeta() {
  let title = "UPDB | Report Results";
  meta.title = title;
  meta.meta["og:title"] = { content: title };
  meta.meta["twitter:title"] = { content: title };
  meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
  meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
}

setMeta();
</script>

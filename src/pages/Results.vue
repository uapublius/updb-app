<template>
  <div class="my-2 p-2">
    <h1 class="ms-3">Results {{ summary }}</h1>

    <div class="inline-block">
      <div class="flex tabs">
        <h2 :class="{ active: show === 'docs' }">
          <a @click="switchTab('docs')">Documents</a>
        </h2>

        <h2 :class="{ active: show === 'reports' }">
          <a @click="switchTab('reports')">Reports</a>
        </h2>
      </div>
    </div>

    <div>
      <div v-if="show === 'reports'" class="my-4">
        <div v-for="report in reports">
          <result-report :report="report" :attachments="[]" :references="[]" />
        </div>

        <div v-if="isSearchingReports" class="searching my-3">Searching...</div>

        <div v-if="!noMoreReports && !isSearchingReports">
          <a @click="loadMoreReports">Load more...</a>
        </div>

        <h4 v-if="noMoreReports">End of results.</h4>
      </div>

      <div v-if="show === 'docs'" class="ms-4">
        <div v-for="doc in docs">
          <result-doc :doc="doc" />
        </div>

        <div v-if="isSearchingDocs" class="searching my-3">Searching...</div>

        <div v-if="!noMoreDocs && !isSearchingDocs">
          <a @click="loadMoreDocs">Load more...</a>
        </div>

        <h4 v-if="noMoreDocs">End of results.</h4>
      </div>
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
let keyword = ref(null);
let reports = ref([]);
let docs = ref([]);
let isSearchingReports = ref(false);
let isSearchingDocs = ref(false);
let summary = ref("");
let show = ref("reports");
let reportsOffset = ref(0);
let docsOffset = ref(0);
let noMoreDocs = ref(false);
let noMoreReports = ref(false);

onMounted(async () => {
  filters.value = object2array(qs.parse(route.query.filters));
  keyword.value = route.query.dockey;

  if (filters.value?.length) searchReports();
  if (keyword.value?.length) searchDocs();

  summary.value = paramSummary(filters.value);
});

let size = 5;

async function searchReports() {
  isSearchingReports.value = true;

  try {
    if (keyword.value) {
      let { data } = await axios.get("/api/reports/rpc/report_search", {
        params: { q: keyword.value, lim: size, off: reportsOffset.value }
      });

      if (data.length < size) {
        noMoreReports.value = true;
      }

      reports.value = [...reports.value, ...data];
    } else {
      let filterParams = buildFilters(filters.value);
      console.log(filterParams);

      let { data } = await axios.get("/api/reports/report_view", {
        params: { ...filterParams, limit: size, order: "date.desc", offset: reportsOffset.value }
      });

      if (data.length < size) {
        noMoreReports.value = true;
      }

      data = data.map(d => ({ ...d, snippet: d.description.substr(0, 280) }));

      reports.value = [...reports.value, ...data];
      console.log(reports.value);
    }
  } catch (error) {
    console.log(error);
  } finally {
    isSearchingReports.value = false;
  }
}

async function searchDocs() {
  isSearchingDocs.value = true;

  try {
    let { data } = await axios.get("/api/docs/rpc/doc_search", {
      params: { q: keyword.value, lim: size, off: docsOffset.value }
    });

    if (data.length < size) {
      noMoreDocs.value = true;
    }

    docs.value = [...docs.value, ...data];
  } catch (error) {
    console.log(error);
  } finally {
    isSearchingDocs.value = false;
  }
}

function loadMoreReports() {
  reportsOffset.value += 20;
  searchReports();
}

function loadMoreDocs() {
  docsOffset.value += 20;
  searchDocs();
}

function switchTab(name) {
  show.value = name;
}

function setMeta() {
  let title = "UPDB | Results";
  meta.title = title;
  meta.meta["og:title"] = { content: title };
  meta.meta["twitter:title"] = { content: title };
  meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
  meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
}

setMeta();
</script>

<style scoped></style>

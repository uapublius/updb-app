<template>
  <div class="my-2 px-2">
    <search-nav />

    <h1 class="ms-3">Documents {{ summary }}</h1>

    <div class="ms-4">
      <div v-for="doc in docs">
        <result-doc :doc="doc" />
      </div>

      <div v-if="isSearching" class="searching my-3">Searching...</div>

      <div v-if="hasMoreResults && !isSearching">
        <a @click="searchDocs">Load more...</a>
      </div>

      <h4 v-if="!hasMoreResults">End of results.</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import qs from "qs";
import axios from "axios";
import { object2array, paramSummary } from "@/lib/util";

let route = useRoute();
let meta = inject("meta") as HeadTags;

let keyword = ref(null);
let location = ref(null);
let dates = ref(null);
let docs = ref([]);
let filters = ref([]);
let isSearching = ref(false);
let summary = ref("");
let offset = ref(0);
let hasMoreResults = ref(true);

onMounted(async () => {
  filters.value = object2array(qs.parse(route.query.filters));
  keyword.value = filters.value.find(f => f.field === "description")?.value;
  let locFields = ["city", "district", "country", "water", "other"];
  let locations = filters.value.filter(f => locFields.includes(f.field));
  location.value = locations.map(l => l.value).join(" ");
  dates.value = filters.value.find(f => f.field === "date").value;
  summary.value = paramSummary(filters.value);
  searchDocs();
});

let size = 20;

async function searchDocs() {
  isSearching.value = true;
  let q = "";
  if (location.value) q += location.value;
  if (keyword.value) q += keyword.value;
  if (dates.value) q += dates.value.join(" ");
  console.log(q);
  try {
    let { data } = await axios.get("/api/docs/rpc/doc_search", {
      params: { q, lim: size, off: offset.value }
    });
    hasMoreResults.value = data.length >= size;
    docs.value = [...docs.value, ...data];
    offset.value += 20;
  } catch (error) {
    console.log(error);
    hasMoreResults.value = false;
  } finally {
    isSearching.value = false;
  }
}

function setMeta() {
  let title = "UPDB | Document Results";
  meta.title = title;
  meta.meta["og:title"] = { content: title };
  meta.meta["twitter:title"] = { content: title };
  meta.meta["og:url"] = { content: "https://updb.app" + route.fullPath };
  meta.meta["twitter:url"] = { content: "https://updb.app" + route.fullPath };
}

setMeta();
</script>

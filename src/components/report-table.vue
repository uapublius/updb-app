<template>
  <div>
    <header class="table-header mn-2 p-2">
      <div class="flex justify-content-between table-summary">
        <div class="table-filter-summary" />
        <div class="table-summary-actions mw-1 me-1">
          <a class="action-link mw-2" @click="resetFilters">Reset</a>
          <a class="action-link mw-2" @click="downloadAll">Download (CSV)</a>
          <a class="action-link mw-2" :href="permalink" target="_blank">Permalink</a>
          <a class="action-link mw-2 twitter-share-button" :href="tweetUrl" target="_blank">
            Tweet
          </a>
        </div>
      </div>
    </header>

    <div ref="tabulator" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import axios from "axios";
import { saveToFile } from "@/lib/util";
import { buildAjaxParams } from "@/composables/useTabulator/buildAjaxParams";
import useTabulator from "../composables/useTabulator";
import { computed } from "@vue/reactivity";

defineEmits(["rowSelectionChanged", "dataLoaded", "dataFiltered", "dataSorted"]);

let tabulator = ref(null);
let { table } = useTabulator(tabulator);

async function downloadAll() {
  let filter = table.value.getFilters(true);
  let sort = table.value.getSorters();
  let params = buildAjaxParams(filter, sort);
  let { data } = await axios.get("/api/report_view", {
    headers: { Accept: "text/csv" },
    params
  });
  let timestamp = Math.floor(+new Date() / 10000);

  saveToFile(data, `UPDB.export.${timestamp}.csv`);
}

function resetFilters() {
  table.value.clearFilter(true);
  table.value.clearSort();
}

let permalink = ref(window.location.href);

function watchUrl() {
  let lastUrl = location.href;
  new MutationObserver(() => {
    let url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      permalink.value = window.location.href;
    }
  }).observe(document, { subtree: true, childList: true });
}

onBeforeMount(() => {
  watchUrl();
});

let tweetUrl = computed(() => {
  const myUrlWithParams = new URL("https://twitter.com/intent/tweet");

  myUrlWithParams.searchParams.append("text", document.title);
  myUrlWithParams.searchParams.append("url", permalink.value);
  myUrlWithParams.searchParams.append("hashtags", "UFOTwitter,UPDB");

  return myUrlWithParams.href;
});
</script>

<style>
.table-summary .action-link {
  font-size: 12px;
}
</style>

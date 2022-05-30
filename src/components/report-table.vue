<template>
  <div>
    <header class="table-header mn-2 px-1 py-1">
      <div class="flex justify-content-between align-items-center table-summary">
        <div class="flex align-items-center">
          <div class="table-filter-summary">...</div>

          <a
            class="mw-2 flex align-items-center"
            style="font-size: 11px; line-height: 1; margin-top: 2px"
            @click="resetFilters"
          >
            <icon-undo />
            &nbsp;Reset
          </a>
        </div>

        <div class="table-summary-actions my-1 mx-1">
          <a
            class="action-link mx-2"
            :class="{ 'bg-highlight-vivid': copiedLink }"
            @click="copyLink"
          >
            <span>
              <icon-link />
              <template v-if="copiedLink">Copied</template>
              <template v-else="copiedLink">Permalink</template>
            </span>
          </a>

          <a class="action-link mx-2" :href="tweetUrl" target="_blank">
            <icon-twitter />
            Tweet results
          </a>

          <a
            class="action-link mx-2"
            @click="downloadAll"
            title="CSV download is limited to 20,000 records. Download full dataset for custom analysis."
          >
            <icon-download />
            Download results (CSV)
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
  let params = buildAjaxParams(filter, sort, 1, 0);
  let { data } = await axios.get("/api/reports/report_view", {
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

let copiedLink = ref(false);

async function copyLink() {
  copiedLink.value = true;
  await navigator.clipboard.writeText(permalink.value);
  setTimeout(() => {
    copiedLink.value = false;
  }, 3000);
}

let tweetUrl = computed(() => {
  const myUrlWithParams = new URL("https://twitter.com/intent/tweet");
  myUrlWithParams.searchParams.append("url", permalink.value);
  myUrlWithParams.searchParams.append("hashtags", "UFOTwitter,UPDB");
  return myUrlWithParams.href;
});
</script>

<style>
.table-summary .action-link {
  font-size: 12px;
}

.table-filter-summary small {
  background-color: rgba(255, 255, 180, 0.4);
}
</style>

<template>
  <header class="table-header ms-3">
    <div class="flex justify-content-between align-items-center table-summary">
      <div class="flex align-items-center">
        <div
          ref="summary"
          class="table-filter-summary" />

        <a
          class="mw-2"
          @click="resetFilters">
          Reset
        </a>
      </div>

      <div class="table-summary-actions my-1 mx-1">
        <a
          class="action-link mx-2"
          :class="{ 'bg-highlight-vivid': hasCopiedLink }"
          @click="copyLink">
          <span>
            <icon-link />
            <template v-if="hasCopiedLink">Copied</template>
            <template v-else>Permalink</template>
          </span>
        </a>

        <a
          class="action-link mx-2"
          :href="tweetUrl"
          target="_blank">
          <icon-twitter />
          Tweet results
        </a>

        <a
          class="action-link mx-2"
          title="CSV download is limited to 20,000 records. Download full dataset for custom analysis."
          @click="downloadAll">
          <icon-download />
          Download results (CSV)
        </a>

        <el-button
          size="small"
          :icon="Expand"
          @click="expandedDescription = !expandedDescription" />
      </div>
    </div>
  </header>

  <div
    ref="el"
    class="tabulator"
    :class="{ 'expanded-description': expandedDescription }" />
</template>

<script setup lang="ts">
import "tabulator-tables/dist/css/tabulator_simple.css";
import { onMounted } from "vue";
import { ElButton } from 'element-plus';
import { Expand } from '@element-plus/icons-vue';
import useTabulator from "@/composables/useTabulator";
import { buildAjaxParams } from "@/composables/useTabulator/buildAjaxParams";
import axios from "axios";
import { saveToFile } from "@/util";
import { sources } from "@/enums";

let props = defineProps(['columns', 'filters', 'sort', 'url', 'count', 'options']);
let emit = defineEmits(["rowSelectionChanged", "dataLoaded", "dataFiltered", "dataSorted"]);
let expandedDescription = $ref(false);
let el = $ref(null);
let summary = $ref(null);
let table = $ref(null);
let hasCopiedLink = $ref(false);
let permalink = $ref(window.location.href);

onMounted(() => {
  table = useTabulator(el, props.columns, props.filters, props.sort, props.url, props.count || "estimated", props.options);
  watchUrl();
  bindEvents();
});

function buildSummary() {
  let filters = table.getFilters(true);
  let filterString = `<span><strong>${table.totalResults.toLocaleString()}</strong> reports`;
  if (filters.length) filterString += " matching:";
  filterString += "</span>";

  let filterStrings = [];

  for (const filter of filters) {
    let field = filter.field;
    let value = filter;
    let formattedValue = filter;
    if (field === "date") {
      if (value.length == 1) {
        formattedValue = "From " + value;
      }
 else if (!value[0] && value[1]) {
        formattedValue = "To " + value[1];
      }
 else if (!value[1] && value[0]) {
        formattedValue = "From " + value[0];
      }
 else if (value.length == 2) {
        formattedValue = value[0] + "–" + value[1];
      }
    }
    if (field === "source") {
      formattedValue = [value]
        .flat()
        .map(s => sources[s])
        .join(", ");
    }
    if (field === "description") formattedValue = `"${value}"`;

    filterStrings.push(field.toUpperCase() + " = " + formattedValue);
  }

  summary.innerHTML = `${filterString} <small>${filterStrings.join("; ")}</small>`;
}

function highlightHeaders() {
  let filters = table.getFilters(true);

  for (const column of table.columnManager.columnsByIndex) {
    let headerNode = column.element;
    let field = headerNode.attributes["tabulator-field"];
    let filter = filters.find(f => f.field === field);

    if (filter) {
      headerNode.classList.add("tabulator-field-filtered");
    }
 else {
      headerNode.classList.remove("tabulator-field-filtered");
    }
  }
}

function bindEvents() {
  for (let event of ["dataFiltered", "dataSorted"]) {
    table.on(event, _ => {
      highlightHeaders();
      buildSummary();
    });
  }

  let events = ["rowSelectionChanged", "dataLoaded"];

  for (let event of events) {
    table.on(event, ev => emit(event as any, ev, table));
  }
}

function resetFilters() {
  table.clearFilter(true);
  table.clearSort();
}

async function copyLink() {
  hasCopiedLink = true;
  await navigator.clipboard.writeText(permalink);
  setTimeout(() => {
    hasCopiedLink = false;
  }, 3000);
}

async function downloadAll() {
  let filter = table.getFilters(true);
  let sort = table.getSorters();
  let params = buildAjaxParams(filter, sort, 1, 0);
  let { data } = await axios.get("/api/reports/report_view", {
    headers: { Accept: "text/csv" },
    params
  });
  let timestamp = Math.floor(+new Date() / 10000);

  saveToFile(data, `UPDB.export.${timestamp}.csv`);
}

function watchUrl() {
  let lastUrl = location.href;
  new MutationObserver(() => {
    let url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      permalink = window.location.href;
    }
  }).observe(document, { subtree: true, childList: true });
}

let tweetUrl = $computed(() => {
  const myUrlWithParams = new URL("https://twitter.com/intent/tweet");
  myUrlWithParams.searchParams.append("url", permalink);
  myUrlWithParams.searchParams.append("hashtags", "UFOTwitter,UPDB");
  return myUrlWithParams.href;
});
</script>
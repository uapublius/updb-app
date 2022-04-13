<template>
  <up-layout v-model:layout="layout">
    <template #header>
      <div class="d-flex flex-middle flex-space p-w-xs p-e-sm p-n-xxs p-s-xxs">
        <div class="d-flex flex-middle">
          <h1 class="gradient-text"><a href="/">UPDB</a></h1>
          <sup>beta</sup>
        </div>
        <div class="d-flex flex-middle flex-center">
          <a
            class="d-flex flex-middle feedback-link"
            title="uapublius@protonmail.com"
            href="mailto:uapublius@protonmail.com?subject=UPDB Beta Feedback"
          >
            <up-icon-envelope />
            <div>Beta Feedback</div>
          </a>
        </div>
      </div>
    </template>

    <template #toolbar>
      <div class="flex flex-space p-xs flex flex-middle">
        <div>
          <button @click="handleDownloadAll(table)" class="m-e-xs">Download Results (CSV)</button>

          <button @click="resetFilters(table)">Reset Filters</button>
        </div>
      </div>
    </template>

    <template #main>
      <ReportTable
        ref="table"
        @data-filtered="handleDataFiltered(table)"
        @data-sorted="handleDataFiltered(table)"
        @row-selection-changed="handleRowSelectionChanged"
        @total-rows-changed="handleTotalRowsChanged"
      />
    </template>

    <template #detail>
      <ReportDetail
        v-if="formattedReport"
        :report="formattedReport"
        :permalink="reportPermalink"
        @copy-text="handleCopyTextSelected"
        @copy-link="handleCopyLinkSelected"
        @download="handleDownloadSelected(table, formattedReport)"
      />
    </template>

    <template #footer>
      <div class="reports-table-footer tabulator-footer"></div>
    </template>
  </up-layout>
</template>

<script setup lang="ts">
import qs from "qs";
import wrap from "word-wrap";
import { computed, ref } from "vue";
import ReportDetail from "./components/ReportDetail.vue";
import ReportTable from "./components/ReportTable.vue";
import { handleDownloadSelected, handleDownloadAll } from "./lib/handleDownload";
import {
  formattedReport,
  handleRowSelectionChanged,
  handleTotalRowsChanged,
  handleDataFiltered,
  resetFilters
} from "./lib/rowOps";

let isMobile = navigator.userAgent.includes(" Mobile/");

let table = ref(null);

let splitDistribution = isMobile ? ["1fr", "1fr"] : ["3fr", "2fr"];

let layout = ref({
  name: "app",
  direction: "row",
  sizes: ["auto", "auto", "auto", "1fr"],
  panes: [
    {
      name: "header",
      resizable: false
    },
    {
      name: "toolbar",
      resizable: false
    },
    {
      name: "footer",
      resizable: false
    },
    {
      minSize: 100,
      direction: "row",
      sizes: splitDistribution,
      panes: [
        {
          name: "main",
          minSize: 100
        },
        {
          name: "detail",
          minSize: 100
        }
      ]
    }
  ]
});

let textReport = computed(() => {
  let lines = [];

  lines.push(`UPDB ID: ${formattedReport.value.id}`);
  lines.push(`SOURCE: ${formattedReport.value.source}`);
  lines.push(`SOURCE ID: ${formattedReport.value.source_id}`);
  lines.push(`DATE: ${formattedReport.value.date}`);
  if (formattedReport.value.city) lines.push(`CITY: ${formattedReport.value.city}`);
  if (formattedReport.value.district) lines.push(`DISTRICT: ${formattedReport.value.district}`);
  if (formattedReport.value.country) lines.push(`COUNTRY: ${formattedReport.value.country}`);
  if (formattedReport.value.attachments?.length)
    lines.push(
      `ATTACHMENTS: ${formattedReport.value.attachments
        .map(a => `https://web.archive.org/web/${a}`)
        .join("\n")}`
    );
  lines.push(`\n${"=".repeat(100)}\n${formattedReport.value.description}\n${"=".repeat(100)}\n\n`);

  return wrap(lines.join("\n"), {
    width: 100
  });
});

let reportPermalink = computed(() => {
  let filters = [
    { field: "source", type: "=", value: formattedReport.value.source },
    { field: "source_id", type: "=", value: formattedReport.value.source_id }
  ];
  let str = qs.stringify({ filters });

  return window.location.origin + "?" + str;
});

async function handleCopyTextSelected() {
  await navigator.clipboard.writeText(textReport.value);
}

async function handleCopyLinkSelected() {
  await navigator.clipboard.writeText(reportPermalink.value);
}
</script>

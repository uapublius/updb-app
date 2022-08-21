<template>
  <client-only>
    <tabulator
      :filters="[]"
      :sort="[]"
      :columns="columns"
      url="/api/reports/report_view"
      :options="options"
      @row-selection-changed="rowSelectionChanged" />
  </client-only>
</template>

<script setup lang="ts">
import { sourceColumn } from "@/composables/useTabulator/columns/sourceColumn";
import { sourceIdColumn } from "@/composables/useTabulator/columns/sourceIdColumn";
import { dateColumn } from "@/composables/useTabulator/columns/dateColumn";
import { locationColumns } from "@/composables/useTabulator/columns/locationColumns";
import { idColumn } from "@/composables/useTabulator/columns/idColumn";
import { descriptionColumn } from "@/composables/useTabulator/columns/descriptionColumn";
import axios from "axios";
let emit = defineEmits(["rowSelectionChanged", "dataLoaded", "dataFiltered", "dataSorted"]);

sourceColumn.visible = false;
sourceIdColumn.visible = false;

let columns = $ref([
  idColumn,
  sourceColumn,
  sourceIdColumn,
  dateColumn,
  ...locationColumns,
  descriptionColumn
]);

let options = $ref({
  paginationSize: 20
});

async function getAttachmentsReferences(report) {
  let res;

  try {
    res = await Promise.all([
      axios.get("/api/reports/attachment", {
        params: {
          report: "in.(" + report.id + ")"
        }
      }),
      axios.get("/api/reports/report_reference_view", {
        params: {
          report: "in.(" + report.id + ")"
        }
      })
    ]);
  }
 catch (error) {
    console.log(error.message);
    return;
  }

  let attachments = res[0].data.map(d => d.url);
  let references = res[1].data.map(d => d.text);

  return { attachments, references };
}

async function rowSelectionChanged(reports) {
  if (!reports.length) return;
  let report = reports[0];
  let { attachments, references } = await getAttachmentsReferences(report);
  report.attachments = attachments;
  report.references = references;
  emit("rowSelectionChanged", report);
}
</script>

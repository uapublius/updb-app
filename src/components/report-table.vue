<template>
  <div>
    <header class="flex justify-content-end">
      <div class="mn-1 px-2">
        <a class="action-link me-3" @click="downloadAll">Download (CSV)</a>
        <a class="action-link" @click="resetFilters">Reset</a>
      </div>
    </header>

    <div ref="tabulator" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { saveToFile } from "@/lib/util";
import { buildAjaxParams } from "@/composables/useTabulator/buildAjaxParams";
import useTabulator from "../composables/useTabulator";

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
</script>

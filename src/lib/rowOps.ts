import qs from "qs";
import { sources } from "./sources";
import { computed, Ref, ref } from "vue";
import { Report, ReportFormatted } from "../types";

let totalRows = ref(0);
let selectedReport: Ref<Report> = ref(null);
let firstLoad = true;

export let formattedReport: Ref<ReportFormatted> = computed(() => {
  if (!selectedReport.value) return;

  let {
    id,
    source,
    source_id,
    date,
    attachments,
    city,
    district,
    country,
    continent,
    water,
    other,
    description
  } = selectedReport.value;

  let formatted: ReportFormatted = {
    id,
    source: sources[source],
    source_id,
    date,
    attachments,
    city,
    district,
    country,
    continent,
    water,
    other,
    description
  };

  return formatted;
});

export function handleRowSelectionChanged(reports: Report[]) {
  if (reports?.length) {
    selectedReport.value = reports[0];
  }
}

export function handleTotalRowsChanged(total: number) {
  totalRows.value = total;
}

export function resetFilters(table) {
  table.tabulator.clearFilter(true);
}

export function handleDataFiltered(table) {
  let filters = table.tabulator.getFilters(true);
  let sort = table.tabulator.getSorters().map(s => ({ dir: s.dir, field: s.field }));
  let str = qs.stringify({ filters, sort });
  if (str) {
    window.history.replaceState("", "", "?" + str);
  }
  else {
    window.history.replaceState("", "", "/");
  }

  if (firstLoad && table.tabulator.getRows().length === 1) {
    firstLoad = true;
    table.tabulator.selectRow();
  }
}

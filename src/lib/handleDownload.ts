import axios from "axios";
import { buildParams } from "./ajaxRequestFunc";

function save(content: string, filename: string) {
  let bl = new Blob([content], { type: "text/csv" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(bl);
  a.download = filename;
  a.hidden = true;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function handleDownload(table, filename, extraParams: Record<string, unknown> = {}) {
  let filter = table.tabulator.getFilters(true);
  let sort = table.tabulator.getSorters();
  let params = buildParams(filter, sort);
  let { data } = await axios.get("/api/report_view", {
    headers: { Accept: "text/csv" },
    params: { ...params, ...extraParams }
  });

  save(data, filename);
}

export async function handleDownloadSelected(table, formattedReport) {
  debugger;
  await handleDownload(
    table,
    `UPDB.${formattedReport.source}.${formattedReport.source_id}.csv`,
    {
      id: "eq." + formattedReport.id
    }
  );
}

export async function handleDownloadAll(table) {
  let timestamp = Math.floor(+new Date() / 10000);
  await handleDownload(table, `UPDB.export.${timestamp}.csv`);
}

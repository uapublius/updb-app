import { DateTime } from "luxon";
import * as chrono from "chrono-node";
import { Tabulator } from "tabulator-tables";
import { infoSvg, isNarrow } from "@/util";

function createDateEditor(placeholder: string, value: string, cb: () => void) {
  let editor = document.createElement("input");
  editor.type = "search";
  editor.value = value;
  editor.placeholder = placeholder;
  editor.style.display = "block";

  editor.addEventListener("blur", () => cb());

  editor.addEventListener("keyup", event => {
    if (event.key === "Enter") cb();
  });

  return editor;
}

export let dateRangeEditor = function (cell, onRendered, success, cancel, editorParams) {
  let editor = createDateEditor("From", cell.getValue()?.[0] || "", successFunc);
  let editor2 = createDateEditor("To", cell.getValue()?.[1] || "", successFunc);

  let container = document.createElement("div");
  container.appendChild(editor);
  container.appendChild(editor2);

  function successFunc() {
    if (!editor && !editor2) {
      success();
      return;
    }
    let start = chrono.parse(editor.value);
    let startTime;
    if (start?.length)
      startTime = `${start[0].start.get("month")}/${start[0].start.get("day")}/${start[0].start.get(
        "year"
      )}`;
    let end = chrono.parse(editor2.value);
    let endTime;
    if (end?.length)
      endTime = `${end[0].start.get("month")}/${end[0].start.get("day")}/${end[0].start.get(
        "year"
      )}`;
    success([startTime, endTime]);
  }

  return container;
};

export let dateColumn: Tabulator.ColumnDefinition = {
  title: "Date",
  field: "date",
  minWidth: 72,
  width: isNarrow ? 62 : undefined,
  headerFilter: dateRangeEditor,
  headerFilterFunc: "ov",
  formatter(cell) {
    if (isNarrow) {
      return DateTime.fromISO(cell.getValue()).toLocaleString(DateTime.DATE_SHORT);
    }
 else {
      return DateTime.fromISO(cell.getValue()).toLocaleString(DateTime.DATETIME_SHORT);
    }
  },
  titleFormatter: () =>
    `<div class="title-wrapper">Date <span title="Dates are in the local time of report location.">${infoSvg}</span></div>`
};

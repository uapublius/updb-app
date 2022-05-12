import { attachmentsColumn } from "./attachmentsColumn";
import { dateColumn } from "./dateColumn";
import { descriptionColumn } from "./descriptionColumn";
import { referencesColumn } from "./referencesColumn";
// import { headerMenu } from "./headerMenu";
import { sourceColumn } from "./sourceColumn";
// import { sourceIdColumn } from "./sourceIdColumn";
import { locationColumns } from "./locationColumns";
import { isMobile } from "@/lib/util";

export let columnDefaults = {
  headerFilterLiveFilter: false
  // headerMenu
};

export let reportColumns = [
  "id",
  "source",
  "source_id",
  "date",
  "date_detail",
  "description",
  "word_count",
  "city",
  "district",
  "country",
  "water",
  "other"
];

let sortAmountDownSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M12.83 344h262.34A12.82 12.82 0 0 0 288 331.17v-22.34A12.82 12.82 0 0 0 275.17 296H12.83A12.82 12.82 0 0 0 0 308.83v22.34A12.82 12.82 0 0 0 12.83 344zm0-256h262.34A12.82 12.82 0 0 0 288 75.17V52.83A12.82 12.82 0 0 0 275.17 40H12.83A12.82 12.82 0 0 0 0 52.83v22.34A12.82 12.82 0 0 0 12.83 88zM432 168H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16z"/></svg>';

export let columns = [
  // {
  //   title: "Source",
  //   columns: [sourceColumn, sourceIdColumn]
  // },
  sourceColumn,
  dateColumn,
  locationColumns,
  attachmentsColumn,
  referencesColumn,
  {
    title: "Word Count",
    field: "word_count",
    visible: !isMobile,
    headerTooltip: "Word Count",
    hozAlign: "right",
    // headerMenu,
    titleFormatter: () => sortAmountDownSvg,
    formatter: cell => cell.getValue()?.toLocaleString() || ""
  },
  descriptionColumn
];

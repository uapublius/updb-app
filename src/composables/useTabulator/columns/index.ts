import { attachmentsColumn } from "./attachmentsColumn";
import { dateColumn } from "./dateColumn";
import { descriptionColumn } from "./descriptionColumn";
import { referencesColumn } from "./referencesColumn";
// import { headerMenu } from "./headerMenu";
import { sourceColumn } from "./sourceColumn";
import { sourceIdColumn } from "./sourceIdColumn";
import { locationColumns } from "./locationColumns";

export let columnDefaults = {
  headerFilterLiveFilter: false,
  // headerMenu
};

export let reportColumns = [
  "id",
  "source",
  "source_id",
  "date",
  "date_detail",
  "description",
  "city",
  "district",
  "country",
  "continent",
  "water",
  "other"
];

export let columns = [
  {
    title: "Source",
    columns: [
      sourceColumn,
      sourceIdColumn
    ]
  },
  dateColumn,
  locationColumns,
  attachmentsColumn,
  referencesColumn,
  descriptionColumn
];

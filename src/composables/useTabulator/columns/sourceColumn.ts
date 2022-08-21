import { sources } from "@/enums";
import { infoSvg, isNarrow } from "@/util";

export let sourceColumn = {
  title: "Name",
  field: "source",
  visible: !isNarrow,
  formatter: cell => sources[cell.getValue()],
  titleFormatter: () =>
    `<div class="title-wrapper">Source <a href="/about#sources" title="Click for more details about data sources">${infoSvg}</a></div>`,
  headerFilter: "select",
  headerFilterFunc: "in",
  headerFilterParams: {
    values: sources,
    multiselect: true,
    elementAttributes: {
      autocomplete: "no"
    }
  }
};

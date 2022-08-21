import { isNarrow } from "@/util";

export let locationColumns = [
  {
    field: "city",
    visible: false
  },
  {
    title: "City",
    field: "city",
    width: isNarrow ? 90 : undefined,
    headerFilter: true,
    headerFilterFunc: "ulike",
    headerFilterParams: {
      search: true,
      elementAttributes: {
        autocomplete: "no"
      }
    },
    maxInitialWidth: 175
  },
  {
    title: "District",
    titleFormatter: () => (isNarrow ? "&nbsp;" : "District"),
    field: "district",
    width: isNarrow ? 65 : undefined,
    headerFilter: true,
    headerFilterFunc: "ulike",
    headerFilterParams: {
      search: true,
      elementAttributes: {
        autocomplete: "no"
      }
    },
    maxInitialWidth: 175
  },
  {
    title: "Country",
    titleFormatter: () => (isNarrow ? "&nbsp;" : "Country"),
    field: "country",
    width: isNarrow ? 45 : undefined,
    headerFilter: true,
    headerFilterFunc: "u=",
    headerFilterParams: {
      search: true,
      mask: "AA",
      elementAttributes: {
        maxlength: "2",
        autocomplete: "no"
      }
    }
  },
  {
    title: "Water",
    field: "water",
    headerFilter: true,
    headerFilterParams: {
      search: true
    },
    visible: false
  },
  {
    title: "Other",
    field: "other",
    headerFilter: true,
    headerFilterParams: {
      search: true,
      elementAttributes: {
        autocomplete: "no"
      }
    },
    visible: false
  }
];

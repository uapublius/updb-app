import { isNarrow } from "@/lib/util";

export let locationColumns = {
  title: "Location",
  columns: [
    {
      title: "City",
      field: "city",
      width: isNarrow ? 90 : undefined,
      headerFilter: true,
      headerFilterFunc: "ulike",
      headerFilterParams: {
        search: true,
        elementAttributes: {
          autocomplete: "no",
        }
      },
      maxInitialWidth: 175
    },
    {
      title: "District",
      titleFormatter: () => isNarrow ? '' : "District",
      field: "district",
      width: isNarrow ? 45 : undefined,
      headerFilter: true,
      headerFilterFunc: "ulike",
      headerFilterParams: {
        search: true,
        elementAttributes: {
          autocomplete: "no",
        }
      },
      maxInitialWidth: 175
    },
    {
      title: "Country",
      titleFormatter: () => isNarrow ? '' : "Country",
      field: "country",
      width: isNarrow ? 36 : undefined,
      headerFilter: true,
      headerFilterFunc: "u=",
      headerFilterParams: {
        search: true,
        mask: "AA",
        elementAttributes: {
          maxlength: "2",
          autocomplete: "no",
        }
      }
    },
    {
      title: "Continent",
      field: "continent",
      headerFilter: true,
      headerFilterParams: {
        search: true
      },
      visible: false
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
          autocomplete: "no",
        }
      },
      visible: false
    }
  ]
};

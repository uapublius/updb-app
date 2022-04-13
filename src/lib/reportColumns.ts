import { DateTime } from 'luxon';
import { dateRangeEditor } from './createDateEditor';
import { sources } from './sources';

let isNarrow = document.body.offsetWidth <= 420;

export let columnDefaults = {
  headerFilterLiveFilter: false
};

let sourceColumn = {
  title: "Name",
  field: "source",
  visible: !isNarrow,
  formatter: cell => sources[cell.getValue()],
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

let sourceIdColumn = {
  title: "ID",
  field: "source_id",
  visible: !isNarrow,
  headerFilter: true,
  headerFilterFunc: "=",
  headerFilterParams: {
    search: true,
    elementAttributes: {
      autocomplete: "no"
    }
  }
};

let dateColumn = {
  title: "Date",
  field: "date",
  minWidth: 92,
  width: isNarrow ? 92 : undefined,
  headerFilter: dateRangeEditor,
  headerFilterFunc: "ov",
  formatter(cell) {
    if (isNarrow) {
      return DateTime.fromISO(cell.getValue()).toLocaleString(DateTime.DATE_SHORT);
    }
    else {
      return DateTime.fromISO(cell.getValue()).toLocaleString(DateTime.DATETIME_SHORT);
    }
  }
};

let locationColumns = {
  title: "Location",
  columns: [
    {
      title: "City",
      field: "city",
      width: isNarrow ? 80 : undefined,
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

let descriptionColumn = {
  title: "Report",
  field: "description",
  tooltip: true,
  headerSort: false,
  headerFilter: true,
  headerFilterFunc: "fts",
  headerFilterPlaceholder: "Search...",
  headerFilterParams: {
    search: true,
    elementAttributes: {
      id: "header-description-search",
      name: "header-description-search",
      autocomplete: true
    }
  },
};

let attachmentsColumn = {
  title: "",
  field: "attachments",
  visible: !isNarrow,
  headerTooltip: "Attachments",
  hozAlign: "center",
  headerSort: false,
  titleFormatter() {
    return '<div class="icon-col-title attachments-col-title">' + paperclipSvg + '</div>';
  },
  formatter: cell => cell.getValue()?.length || '',
};

let referencesColumn = {
  title: "",
  field: "references",
  visible: !isNarrow,
  headerTooltip: "References",
  hozAlign: "center",
  headerSort: false,
  titleFormatter() {
    return '<div class="icon-col-title references-col-title">' + quoteLeftSvg + '</div>';
  },
  formatter: cell => cell.getValue()?.length || '',
};

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

let paperclipSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M67.508 468.467c-58.005-58.013-58.016-151.92 0-209.943l225.011-225.04c44.643-44.645 117.279-44.645 161.92 0 44.743 44.749 44.753 117.186 0 161.944l-189.465 189.49c-31.41 31.413-82.518 31.412-113.926.001-31.479-31.482-31.49-82.453 0-113.944L311.51 110.491c4.687-4.687 12.286-4.687 16.972 0l16.967 16.971c4.685 4.686 4.685 12.283 0 16.969L184.983 304.917c-12.724 12.724-12.73 33.328 0 46.058 12.696 12.697 33.356 12.699 46.054-.001l189.465-189.489c25.987-25.989 25.994-68.06.001-94.056-25.931-25.934-68.119-25.932-94.049 0l-225.01 225.039c-39.249 39.252-39.258 102.795-.001 142.057 39.285 39.29 102.885 39.287 142.162-.028A739446.174 739446.174 0 0 1 439.497 238.49c4.686-4.687 12.282-4.684 16.969.004l16.967 16.971c4.685 4.686 4.689 12.279.004 16.965a755654.128 755654.128 0 0 0-195.881 195.996c-58.034 58.092-152.004 58.093-210.048.041z"/></svg>';
let quoteLeftSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256h-80v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8c-88.4 0-160 71.6-160 160v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48zm-288 0H96v-64c0-35.3 28.7-64 64-64h8c13.3 0 24-10.7 24-24V56c0-13.3-10.7-24-24-24h-8C71.6 32 0 103.6 0 192v240c0 26.5 21.5 48 48 48h128c26.5 0 48-21.5 48-48V304c0-26.5-21.5-48-48-48z"/></svg>';
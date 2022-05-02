import { getCurrentInstance, onBeforeMount, onMounted, ref } from "vue";
import axios from "axios";
import qs from "qs";
import { useRoute, useRouter } from "vue-router";
import { object2array } from "@/lib/util";
import { buildAjaxParams } from "@/composables/useTabulator/buildAjaxParams";
import { columnDefaults, columns } from "./columns";
import { updateRowsWithAttachments, updateRowsWithReferences } from "./updateRows";
import "tabulator-tables/dist/css/tabulator_simple.css";
import * as tabulator from 'tabulator-tables';
import { sources } from "@/sources";
const { Tabulator, KeybindingsModule, AjaxModule, PageModule, SortModule, FilterModule, FormatModule, EditModule, SelectRowModule } = tabulator;

async function buildTableData(url, params): Promise<PaginationData> {
  let res = await axios.get(url, {
    headers: { "Prefer": `count=estimated` },
    params: buildAjaxParams(params.filter, params.sort, params.page, params.size)
  });
  let rowCount = parseInt(res.headers["content-range"]?.split('/')?.[1]) || 1;
  let lastPage = Math.ceil(rowCount / parseInt(params.size));

  return {
    last_page: lastPage,
    rowCount,
    data: res.data
  };
}

function register() {
  let isMobile = navigator.userAgent.includes(" Mobile/");

  let tabulatorModules: any = [
    AjaxModule,
    PageModule,
    SortModule,
    FilterModule,
    FormatModule,
    EditModule,
    SelectRowModule
  ];

  if (!isMobile) {
    tabulatorModules = tabulatorModules.concat([KeybindingsModule]);
  }

  // @ts-ignore
  Tabulator.registerModule(tabulatorModules);

  let noop = () => { };

  // @ts-ignore
  Tabulator.extendModule("filter", "filters", {
    ulike: noop,
    "u=": noop,
    fts: noop,
    ov: noop
  });

  return {
    isMobile
  };
}

let totalResults = 0;

function paginationCounter(pageSize, _, currentPage, __) {
  let from = (pageSize * (currentPage - 1) || 1).toLocaleString();
  let to = Math.min(pageSize * currentPage, totalResults).toLocaleString();
  if (totalResults === 1) return "Showing 1 report";
  return "Showing " + from + "–" + to + " of " + totalResults.toLocaleString() + " reports";
}

export function ajaxRequestFunc(cb: (paginationData: PaginationData) => void) {
  return async function (url, config, params) {
    if (!params.size) params.size = 20;
    if (!params.page) params.page = 1;
    let data = await buildTableData(url, params);
    return cb(data);
  };
}

export default function useTabulator(tabulator) {
  let router = useRouter();
  let route = useRoute();
  let table = ref(null);
  let filtersParam = route.query.filters ? qs.parse(route.query.filters) : [];
  let sortParam = qs.parse(route.query.sort) || [];
  let headerFilter = object2array(filtersParam);
  let initialSort = object2array(sortParam);

  function handleAjaxData(paginationData) {
    totalResults = paginationData.rowCount;

    axios.get('/api/attachment', {
      params: {
        report: 'in.(' + paginationData.data.map(d => d.id) + ')'
      }
    }).then(updateRowsWithAttachments(table.value));

    axios.get('/api/report_reference_view', {
      params: {
        report: 'in.(' + paginationData.data.map(d => d.id) + ')'
      }
    }).then(updateRowsWithReferences(table.value));

    return paginationData;
  }

  onMounted(async () => {
    let { emit } = getCurrentInstance();

    table.value = new Tabulator(tabulator.value, {
      index: "id",
      columns,
      columnDefaults,
      layout: "fitDataStretch",
      initialHeaderFilter: headerFilter.map(f => ({ field: f.field, type: f.type, value: f.value })),
      initialSort: initialSort.map(f => ({ column: f.field, dir: f.dir })),
      selectable: 1,
      keybindings: true,
      sortMode: "remote",
      filterMode: "remote",
      headerFilterLiveFilterDelay: 1000,
      pagination: true,
      paginationSize: 25,
      paginationSizeSelector: true,
      paginationMode: "remote",
      paginationButtonCount: 5,
      paginationCounter,
      ajaxURL: "/api/report_view",
      ajaxRequestFunc: ajaxRequestFunc(handleAjaxData)
    });

    function dataFiltered() {
      let filters = table.value.getFilters(true);

      for (const column of table.value.columnManager.columnsByIndex) {
        let headerNode = column.element;
        let field = headerNode.attributes["tabulator-field"].value;
        let filter = filters.find(f => f.field === field);

        if (filter) {
          headerNode.classList.add("tabulator-field-filtered");
        }
        else {
          headerNode.classList.remove("tabulator-field-filtered");
        }
      }

      let summary = document.querySelector('.table-filter-summary');
      let filterString = `<span><strong>${totalResults.toLocaleString()}</strong> reports`;
      if (filters.length) filterString += ' matching:';
      filterString += '</span>';

      let filterStrings = [];

      for (const filter of filters) {
        let field = filter.field;
        let value = filter.value;
        let formattedValue = filter.value;
        if (field === 'date') {
          if (value.length == 1) {
            formattedValue = "From " + value;
          }
          else if (!value[0] && value[1]) {
            formattedValue = "To " + value[1];
          }
          else if (!value[1] && value[0]) {
            formattedValue = "From " + value[0];
          }
          else if (value.length == 2) {
            formattedValue = value[0] + "–" + value[1];
          }
        }
        if (field === 'source') {
          formattedValue = [value].flat().map(s => sources[s]).join(', ');
        }
        if (field === 'description') formattedValue = `"${value}"`;

        filterStrings.push(field.toUpperCase() + " = " + formattedValue);
      }

      summary.innerHTML = `${filterString} <small>${filterStrings.join('; ')}</small>`;

      let sort = table.value.getSorters().map(s => ({ dir: s.dir, field: s.field }));
      let f = filters?.length ? qs.stringify(filters) : undefined;
      let s = sort?.length ? qs.stringify(sort) : undefined;
      router.replace({
        path: "/reports", query: {
          filters: f,
          sort: s
        }
      });
    }

    let events = ["rowSelectionChanged", "dataLoaded",];

    for (let event of ["dataFiltered", "dataSorted"]) {
      table.value.on(event, ev => dataFiltered());
    }

    for (let event of events) {
      table.value.on(event, ev => emit(event as any, ev));
    }
  });

  onBeforeMount(() => {
    register();
  });

  return {
    table
  };
}

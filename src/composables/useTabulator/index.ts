import axios from "axios";
import * as tabulator from "tabulator-tables";
import { buildFilters } from "./buildFilters";

const {
  Tabulator,
  KeybindingsModule,
  AjaxModule,
  PageModule,
  SortModule,
  FilterModule,
  FormatModule,
  EditModule,
  SelectRowModule
} = tabulator;

export default function useTabulator(el, cols, headerFilter, initialSort, url, count = 'estimated', options = {}) {
  let table = null;
  let preferredCountMethod = `count=${count}`;
  let columns = cols;

  function paginationCounter(pageSize, _, currentPage, __) {
    let from = (pageSize * (currentPage - 1) || 1).toLocaleString();
    let to = Math.min(pageSize * currentPage, table.totalResults).toLocaleString();
    if (table.totalResults === 1) return "Showing 1 report";
    return "Showing " + from + "–" + to + " of " + table.totalResults.toLocaleString() + " reports";
  }

  registerModule();

  function buildAjaxParams(
    filter: Record<string, any>[] = [],
    sort: Record<string, any>[] = [],
    page = 1,
    size = 100
  ) {
    let order = sort?.map(p => p.field + "." + p.dir).join(",") || undefined;
    let filters = buildFilters(filter);
    let fields = Object.keys(table.columnManager.columnsByField).join(",");
    let params: Record<string, unknown> = {
      select: fields || undefined,
      order,
      ...filters
    };

    params.offset = (page - 1) * size;
    if (size) params.limit = size;

    return params;
  }

  async function ajaxRequestFunc(url, _, params) {
    if (!params.size) params.size = 20;
    if (!params.page) params.page = 1;
    let res = await axios.get(url, {
      headers: { Prefer: preferredCountMethod },
      params: buildAjaxParams(params.filter, params.sort, params.page, params.size)
    });

    table.totalResults = parseInt(res.headers["content-range"]?.split("/")?.[1]) || 1;

    let lastPage = Math.ceil(table.totalResults / parseInt(params.size));

    let data = {
      last_page: lastPage,
      rowCount: table.totalResults,
      data: res.data
    };

    return data;
  }

  function registerModule() {
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

    Tabulator.registerModule(tabulatorModules);

    let noop = () => { /* */ };

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

  function loadTable(tabulator, headerFilter, initialSort, ajaxURL, opts = {}) {
    return new Tabulator(tabulator, {
      columns,
      columnDefaults: { headerFilterLiveFilter: false },
      initialHeaderFilter: headerFilter.map(f => ({ field: f.field, type: f.type, value: f })),
      ajaxRequestFunc,
      ajaxURL,
      filterMode: "remote",
      index: "id",
      initialSort: initialSort.map(f => ({ column: f.field, dir: f.dir })),
      keybindings: true,
      layout: "fitDataStretch",
      pagination: true,
      paginationButtonCount: 5,
      paginationCounter,
      paginationMode: "remote",
      paginationSize: 40,
      paginationSizeSelector: true,
      selectable: 1,
      sortMode: "remote",
      ...opts
    });
  }

  table = loadTable(el, headerFilter, initialSort, url, options);

  return table;
}

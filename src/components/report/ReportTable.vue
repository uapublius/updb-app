<template>
  <div id="tabulator" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import qs from "qs";
import "tabulator-tables/dist/css/tabulator_simple.css";
import { columnDefaults, columns } from "../../lib/table/reportColumns";
import { ajaxRequestFunc } from "../../lib/table/ajaxRequestFunc";
import {
  Tabulator,
  AjaxModule,
  PageModule,
  SortModule,
  FilterModule,
  FormatModule,
  EditModule,
  ResizeColumnsModule,
  KeybindingsModule,
  SelectRowModule,
  MenuModule
} from "tabulator-tables";

let isMobile = navigator.userAgent.includes(" Mobile/");

let tabulatorModules = [
  AjaxModule,
  PageModule,
  SortModule,
  FilterModule,
  FormatModule,
  EditModule,
  SelectRowModule,
  MenuModule
];

if (!isMobile) {
  tabulatorModules = tabulatorModules.concat([ResizeColumnsModule, KeybindingsModule]);
}

Tabulator.registerModule(tabulatorModules);

let noop = () => {
  /* */
};

Tabulator.extendModule("filter", "filters", {
  ulike: noop,
  "u=": noop,
  fts: noop,
  ov: noop
});

export default defineComponent({
  name: "IncidentsTable",

  emits: ["rowSelectionChanged", "dataLoaded", "totalRowsChanged", "dataFiltered", "dataSorted"],

  data() {
    return {
      tabulator: null,
      totalResults: 0,
      initialHeaderFilter: [],
      initialSort: []
    };
  },

  created() {
    let querystring = window.location.search?.substring(1) || "";
    let parsedQs = qs.parse(querystring);
    this.initialHeaderFilter =
      parsedQs.filters?.map(f => ({ field: f.field, type: f.type, value: f.value })) || [];
    this.initialSort = parsedQs?.sort || [];
  },

  mounted() {
    this.tabulator = new Tabulator("#tabulator", {
      index: "id",
      columns,
      columnDefaults,
      layout: "fitDataStretch",
      initialHeaderFilter: this.initialHeaderFilter,
      initialSort: this.initialSort,
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
      paginationCounter: this.paginationCounter,
      ajaxURL: "/api/report_view",
      ajaxRequestFunc: ajaxRequestFunc(this)(total => {
        this.$emit("totalRowsChanged", total);
        this.totalResults = total;
      })
    });

    this.tabulator.on("rowSelectionChanged", data => this.$emit("rowSelectionChanged", data));
    this.tabulator.on("dataLoaded", data => this.$emit("dataLoaded"));
    this.tabulator.on("dataFiltered", data => this.$emit("dataFiltered"));
    this.tabulator.on("dataSorted", data => this.$emit("dataSorted"));
  },

  methods: {
    paginationCounter(pageSize, currentRow, currentPage, totalRows) {
      let from = (pageSize * (currentPage - 1) || 1).toLocaleString();
      let to = Math.min(pageSize * currentPage, this.totalResults).toLocaleString();
      return (
        "Showing " + from + "–" + to + " of " + this.totalResults.toLocaleString() + " reports"
      );
    }
  }
});
</script>

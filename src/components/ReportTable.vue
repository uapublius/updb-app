<template>
  <div id="tabulator" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import qs from "qs";
import "tabulator-tables/dist/css/tabulator.css";
import { columnDefaults, columns } from "../lib/reportColumns";
import { ajaxRequestFunc } from "../lib/ajaxRequestFunc";
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
  SelectRowModule
} from "tabulator-tables";

Tabulator.registerModule([
  AjaxModule,
  PageModule,
  SortModule,
  FilterModule,
  FormatModule,
  EditModule,
  ResizeColumnsModule,
  KeybindingsModule,
  SelectRowModule
]);

let noop = () => {
  /* */
};

Tabulator.extendModule("filter", "filters", {
  fts: noop,
  ov: noop
});

export default defineComponent({
  name: "IncidentsTable",

  emits: ["rowSelectionChanged", "dataLoaded", "totalRowsChanged", "dataFiltered", "dataSorted"],

  data() {
    return {
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

  computed: {
    tabulator() {
      let table = new Tabulator("#tabulator", {
        index: "id",
        height: "100%",
        columns,
        columnDefaults,
        layout: "fitDataStretch",
        initialHeaderFilter: this.initialHeaderFilter,
        initialSort: this.initialSort,
        selectable: 1,
        keybindings: true,
        footerElement: ".reports-table-footer",
        filterMode: "remote",
        headerFilterLiveFilterDelay: 1000,
        sortMode: "remote",
        pagination: true,
        paginationSize: 50,
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

      return table;
    }
  },

  mounted() {
    this.tabulator.on("rowSelectionChanged", (data, rows) => {
      this.$emit("rowSelectionChanged", data);
    });

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

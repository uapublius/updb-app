<template>
  <div class="py-2 pw-3 pe-4" :style="{ paddingBottom }">
    <div>
      <AppHeader />
    </div>

    <div class="flex justify-content-end mn-2 ps-1">
      <div class="pe-1">
        <a class="action-link me-3" @click="downloadAll">Download (CSV)</a>
        <a class="action-link" @click="resetFilters">Reset</a>
      </div>
    </div>

    <div>
      <ReportTable
        ref="tabulator"
        @data-filtered="dataFiltered"
        @data-sorted="dataFiltered"
        @row-selection-changed="handleRowSelectionChanged"
        @total-rows-changed="handleTotalRowsChanged"
      />
    </div>

    <div ref="panelBottom" v-show="panelOpen" class="panel-bottom px-3 pn-3">
      <ReportDetail
        ref="detail"
        v-if="formattedReport"
        :report="formattedReport"
        :permalink="reportPermalink"
        @close="panelClose"
        @copy-text="copyTextSelected"
        @copy-link="copyLinkSelected"
        @download="downloadSelected"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import qs from "qs";
import { DateTime } from "luxon";
import { buildParams } from "./lib/table/ajaxRequestFunc";
import { urlForAttachment, saveFile } from "./lib/util";
import { Report, ReportFormatted, sources } from "./types";

export default defineComponent({
  data() {
    return {
      totalRows: 0,
      firstLoad: true,
      selectedReport: null,
      currentSearch: "",
      panelOpen: false,
      panelHeight: 400
    };
  },

  computed: {
    reportPermalink() {
      let filters = [
        { field: "source", type: "=", value: this.formattedReport.source },
        { field: "source_id", type: "=", value: this.formattedReport.source_id }
      ];
      let str = qs.stringify({ filters });

      return window.location.origin + "?" + str;
    },

    textReport() {
      let lines = [];

      lines.push(`UPDB ID: ${this.formattedReport.id}`);
      lines.push(`SOURCE: ${this.formattedReport.source}`);
      lines.push(`SOURCE ID: ${this.formattedReport.source_id}`);
      lines.push(`DATE: ${this.formattedReport.date}`);
      if (this.formattedReport.city) lines.push(`CITY: ${this.formattedReport.city}`);
      if (this.formattedReport.district) lines.push(`DISTRICT: ${this.formattedReport.district}`);
      if (this.formattedReport.country) lines.push(`COUNTRY: ${this.formattedReport.country}`);
      if (this.formattedReport.attachments?.length)
        lines.push(
          `ATTACHMENTS: ${this.formattedReport.attachments
            .map(a => urlForAttachment(a))
            .join("\n")}`
        );
      if (this.formattedReport.references?.length)
        lines.push(`REFERENCES:\n${this.formattedReport.references.join("\n")}`);

      lines.push(
        `\n${"=".repeat(100)}\n${this.formattedReport.description}\n${"=".repeat(100)}\n\n`
      );

      return lines.join("\n");
    },

    formattedReport() {
      if (!this.selectedReport) return;

      let {
        id,
        source,
        source_id,
        date,
        date_detail,
        attachments,
        references,
        city,
        district,
        country,
        continent,
        water,
        other,
        description
      } = this.selectedReport;

      let formatted: ReportFormatted = {
        id,
        source: sources[source],
        source_id,
        date: DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_SHORT),
        date_detail,
        attachments,
        references,
        city,
        district,
        country,
        continent,
        water,
        other,
        description
      };

      return formatted;
    },

    tabulator() {
      return this.$refs.tabulator.tabulator;
    },

    paddingBottom() {
      if (this.panelOpen) {
        return this.panelHeight + "px !important";
      }

      return 0;
    }
  },

  methods: {
    handleSearch() {
      this.tabulator.setHeaderFilterValue("description", this.currentSearch);
    },

    handleRowSelectionChanged(reports: Report[]) {
      if (reports?.length) {
        this.selectedReport = reports[0];
        this.$refs.panelBottom.scrollTop = 0;
        this.panelOpen = true;
      }
    },

    panelClose() {
      this.panelOpen = false;
    },

    handleTotalRowsChanged(total: number) {
      this.totalRows = total;
    },

    resetFilters() {
      this.tabulator.clearFilter(true);
      this.tabulator.clearSort();
    },

    dataFiltered() {
      let filters = this.tabulator.getFilters(true);
      let searchFilter = filters.find(f => f.field === "description")?.value;
      this.currentSearch = searchFilter;
      let sort = this.tabulator.getSorters().map(s => ({ dir: s.dir, field: s.field }));
      let str = qs.stringify({ filters, sort });
      if (str) {
        window.history.replaceState("", "", "?" + str);
      } else {
        window.history.replaceState("", "", "/");
      }

      if (this.firstLoad && this.tabulator.getRows().length === 1) {
        this.firstLoad = true;
        this.tabulator.selectRow();
      }
    },

    async copyTextSelected() {
      await navigator.clipboard.writeText(this.textReport);
    },

    async copyLinkSelected() {
      await navigator.clipboard.writeText(this.reportPermalink);
    },

    async download(filename, extraParams: Record<string, unknown> = {}) {
      let filter = this.tabulator.getFilters(true);
      let sort = this.tabulator.getSorters();
      let params = buildParams(filter, sort);
      let { data } = await axios.get("/api/report_view", {
        headers: { Accept: "text/csv" },
        params: { ...params, ...extraParams }
      });

      saveFile(data, filename);
    },

    async downloadSelected() {
      await this.download(
        `UPDB.${this.formattedReport.source}.${this.formattedReport.source_id}.csv`,
        {
          id: "eq." + this.formattedReport.id
        }
      );
    },

    async downloadAll() {
      let timestamp = Math.floor(+new Date() / 10000);
      await this.download(`UPDB.export.${timestamp}.csv`);
    }
  }
});
</script>

<style lang="scss" scoped>
@import "./style/_vars.scss";

.panel-bottom {
  height: 400px;
  max-height: 400px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  background: #fff;
  border-top: 1px solid $color-gray-90;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
}
</style>

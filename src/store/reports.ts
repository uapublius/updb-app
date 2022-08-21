import axios from "axios";
import * as chrono from 'chrono-node';
import { defineStore } from "pinia";
import { Report, Attachment, Reference, ReportReferenceView } from "@/models";
import { pinia } from "@/pinia";
import { useLocationsStore } from "@/store/locations";
import { linkify } from "@/util";

let locationsStore = useLocationsStore(pinia);

export const useReportsStore = defineStore("reports", {
  state: () => ({
    reports: {} as Record<number, Report>, // dictionary of all report objects
    attachments: {} as Record<number, Attachment>,
    references: {} as Record<number, Reference>,
    viewingReport: null,
    results: [] as number[], // a list of report ids currently being viewed
    resultsTotal: null,
    keyword: "",
    location: {
      city: "",
      district: "",
      country: "",
      water: "",
      other: ""
    },
    from: null,
    to: null,
    selectedLocations: [],
    offset: 0,
    limit: 10,
    isSearching: false,
    filterSummary: ""
  }),

  getters: {
    reportsForCurrentPage() {
      let resultInCurrentPage = (_, idx) => idx < this.offset + this.limit && idx >= this.offset;
      return this.results.filter(resultInCurrentPage);
    }
  },

  actions: {
    formattedReport(id: number) {
      let report = this.reports[id];

      if (!report) return {} as any;

      report.description = linkify(report.description?.trim());

      return report;
    },

    reportBySourceId(source: number, sourceId: string) {
      for (let report of (Object.values(this.reports) as Report[])) {
        if (report.source === source && report.source_id === sourceId) {
          return report;
        }
      }
    },

    attachmentsForReport(id: number) {
      return Object.values(this.attachments).filter((a: Attachment) => a.report === id) as Attachment[];
    },

    referencesForReport(id: number) {
      return Object.values(this.references).filter((a: ReportReferenceView) => a.report === id) as ReportReferenceView[];
    },

    snippetForReport(report: Report) {
      return report.description?.trim()?.replace(/\n\n/g, '\n').substring(0, 76) + "…";
    },

    reportsForLocation(location): Report[] {
      return (Object.values(this.reports) as Report[])
        .filter(r => r.location === location)
        .sort((a, b) => a.date < b.date ? 1 : -1);
    },

    async fetchReport(source: string, sourceId: string) {
      try {
        let res = await axios.get("/api/reports/report_view", {
          params: {
            source: "eq." + source,
            source_id: "eq." + sourceId,
            limit: 1
          }
        });

        let datum = res.data[0];
        this.reports[datum.id] = datum;
      }
      catch (error) {
        console.log(error.message);
        return null;
      }
    },

    async fetchReports(locations?: number[]) {
      let params: any = {
        offset: this.offset,
        limit: this.limit,
        order: 'date.desc'
      };

      if (this.keyword) params.ts = "wfts." + this.keyword;

      if (this.selectedLocations?.length) params.location = "in.(" + this.selectedLocations.join(",") + ")";
      if (locations?.length) params.location = "in.(" + locations.join(",") + ")";

      let dates = [];

      if (this.from) {
        let value = chrono.parse(this.from.toString());
        if (value.length) {
          let thisFrom = value[0].start;
          let fromParam = `${thisFrom.get("month")}/${thisFrom.get("day")}/${thisFrom.get("year")}`;
          dates.push(`date.gte.${fromParam}`);
        }
      }

      if (this.to) {
        let value = chrono.parse(this.to.toString());
        if (value.length) {
          let thisTo = value[0].start;
          let toParam = `${thisTo.get("month")}/${thisTo.get("day")}/${thisTo.get("year")}`;
          dates.push(`date.lt.${toParam}`);
        }
      }

      if (dates.length) params.and = `(${dates.join(",")})`;

      if (this.location.city) params.city = "ilike.*" + this.location.city.trim().toUpperCase() + "*";

      if (this.location.district) params.district = "ilike.*" + this.location.district.trim().toUpperCase() + "*";

      if (this.location.country) params.country = "eq." + this.location.country.trim().toUpperCase();

      if (this.location.water) params.water = "ilike.*" + this.location.water.trim().toUpperCase() + "*";

      if (this.location.other) params.other = "ilike.*" + this.location.other.trim().toUpperCase() + "*";

      params.select = 'id,location,geoname_id,latitude,longitude,city,district,country,water,other,source,source_id,date,date_detail,description,word_count';

      let res;

      try {
        res = await axios.get("/api/reports/report_view", {
          headers: { Prefer: 'count=estimated' },
          params
        });
      }
      catch (error) {
        console.error(error.message);
        // TODO: show error notification
        return;
      }

      let { data, headers } = res;

      this.resultsTotal = parseInt(headers["content-range"]?.split("/")?.[1]) || 0;

      for (let idx = 0; idx < data.length; idx++) {
        let datum = data[idx];
        this.reports[datum.id] = datum;
        this.results[idx + this.offset] = datum.id;
      }

      return data;
    },

    async fetchReportsAndAttachments() {
      this.isSearching = true;
      let reports = await this.fetchReports();
      this.isSearching = false;

      locationsStore.setLocationsDetailsFromReports(reports);

      this.getAttachmentsReferences(reports.map(r => r.id));

      return reports;
    },

    async fetchNextReportsAndLocationDetails(page, locations = []) {
      this.selectedLocations = locations;
      this.offset = (page - 1) * this.limit;
      // if offset thru offset + limit is already in reports, then skip
      let start = this.offset;
      let end = this.offset + this.limit;

      for (let idx = start; idx < end; idx++) {
        const result = this.results[idx];
        if (!(result && this.reports[result])) {
          await this.fetchReportsAndAttachments();
          break;
        }
      }
    },

    async getAttachmentsReferences(reports: number[]) {
      try {
        let [attachments, references] = await Promise.all([
          axios.get("/api/reports/attachment", {
            params: {
              report: "in.(" + reports + ")"
            }
          }),
          axios.get("/api/reports/report_reference_view", {
            params: {
              report: "in.(" + reports + ")"
            }
          })
        ]);

        attachments.data.forEach(curr => {
          this.attachments[curr.id] = curr;
        });

        references.data.forEach(curr => {
          this.references[curr.reference] = curr;
        });

      }
      catch (error) {
        console.log(error.message);
        // TODO: show error notification
        return;
      }
    },

    hasFilter() {
      if (this.keyword || this.from || this.to || this.location.city || this.location.district || this.location.country || this.location.water || this.location.other) {
        return true;
      }
    },

    buildSummary() {
      let filterString = `${this.resultsTotal?.toLocaleString()} report`;

      if (this.resultsTotal > 1) filterString += 's';

      let filterStrings = [];

      if (this.hasFilter()) {
        if (this.keyword) filterStrings.push(`matching keyword "${this.keyword}"`);
        if (this.from && this.to) filterStrings.push(`between ${this.from}–${this.to}`);
        else if (this.from) filterStrings.push(this.from);
        else if (this.to) filterStrings.push(this.to);
        if (this.location.city || this.location.district || this.location.country || this.location.water || this.location.other) {
          filterStrings.push("in ");
          let locs = ['city', 'district', 'country', 'water', 'other'].map(l => {
            return this.location[l];
          }).filter(l => l).join(', ');
          filterStrings.push(locs);
        }
      }

      if (filterStrings.length) {
        this.filterSummary = `${filterString} ${filterStrings.join(" ")}`.trim();
      }
    },

    async doSearch(page) {
      if (this.keyword || this.selectedLocations.length || this.from || this.to || this.location.city || this.location.district || this.location.country || this.location.water || this.location.other) {
        await this.fetchNextReportsAndLocationDetails(page, this.selectedLocations);
      }
    }
  }
});

import axios from "axios";
import * as chrono from 'chrono-node';
import { countries } from "countries-list";
import { defineStore } from "pinia";
import { Report, Attachment, Reference, ReportReferenceView } from "@/models";
import { pinia } from "@/pinia";
import { useLocationsStore } from "@/store/locations";
import { linkify } from "@/util";

const API_REPORTS = import.meta.env.VITE_API_REPORTS;

let locationsStore = useLocationsStore(pinia);

export const useReportsStore = defineStore("reports", {
  state: () => ({
    reports: {} as Record<number, Report>,
    attachments: {} as Record<number, Attachment>,
    references: {} as Record<number, Reference>,
    viewingReport: null,
    results: [] as number[],
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
    filterSummary: "",
    reportCountryCounts: []
  }),

  getters: {
    reportsForCurrentPage() {
      let resultInCurrentPage = (_, idx) => idx < this.offset + this.limit && idx >= this.offset;
      return this.results.filter(resultInCurrentPage);
    },

    hasFilter() {
      if (this.keyword || this.from || this.to || this.location.city || this.location.district || this.location.country || this.location.water || this.location.other) {
        return true;
      }
    },

    reportCountsByContinent() {
      const result = {};

      for (let { country, count } of this.reportCountryCounts) {
        let fullCountry = countries[country] || { continent: 'unknown' };

        fullCountry.abbreviation = country;

        if (!result[fullCountry.continent]) result[fullCountry.continent] = [];

        result[fullCountry.continent].push({ ...fullCountry, count });
      }

      for (const continent of Object.keys(result)) {
        result[continent] = result[continent].sort((a, b) => {
          return b.count - a.count;
        });
      }

      return result;
    },

    reportCountsByCountry() {
      return this.reportCountryCounts.map(c => ({ ...c, ...countries[c.country] }));
    }
  },

  actions: {
    formattedReport(id: number) {
      let report = this.reports[id];

      if (!report) return {} as any;

      report.description = linkify(report.description?.trim());

      return report;
    },

    attachmentsForReport(id: number) {
      return Object.values(this.attachments).filter((a: Attachment) => a.report === id) as Attachment[];
    },

    referencesForReport(id: number) {
      return Object.values(this.references).filter((a: ReportReferenceView) => a.report === id) as ReportReferenceView[];
    },

    reportBySourceId(source: number, sourceId: string) {
      for (let report of (Object.values(this.reports) as Report[])) {
        if (report.source === source && report.source_id === sourceId) {
          return report;
        }
      }
    },

    reportsForLocation(location): Report[] {
      return (Object.values(this.reports) as Report[])
        .filter(r => r.location === location)
        .sort((a, b) => a.date < b.date ? 1 : -1);
    },

    resetResults() {
      this.resultsTotal = null;
      this.results = [];
    },

    buildSummary() {
      let filterString = `${this.resultsTotal?.toLocaleString()} UFO report`;

      if (this.resultsTotal > 1) filterString += 's';

      let filterStrings = [];

      if (this.hasFilter) {
        if (this.keyword) filterStrings.push(`matching keyword “${this.keyword}”`);

        if (this.from && this.to) filterStrings.push(`between ${this.from}–${this.to}`);
        else if (this.from) filterStrings.push(this.from);
        else if (this.to) filterStrings.push(this.to);

        if (this.location.city || this.location.district || this.location.country || this.location.water || this.location.other) {
          filterStrings.push("in ");

          let locs = ['city', 'district', 'country', 'water', 'other'].map(l => {
            return this.location[l];
          }).filter(l => l);

          if (locs.length === 1) {
            if (this.location.country) {
              filterStrings.push("country: ");
            }
            if (this.location.city) {
              filterStrings.push("city: ");
            }
            if (this.location.water) {
              filterStrings.push("water body: ");
            }
            if (this.location.district) {
              filterStrings.push("district: ");
            }
            if (this.location.other) {
              filterStrings.push("other location: ");
            }
          }

          filterStrings.push(locs.join(', '));
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
    },

    async fetchReportCountryCounts() {
      try {
        let res = await axios.get(API_REPORTS + "/report_count_by_country");
        this.reportCountryCounts = res.data;
      }
      catch (error) {
        console.log(error.message);
      }
    },

    async fetchReport(source: string, sourceId: string) {
      try {
        let res = await axios.get(API_REPORTS + "/report_view", {
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

      if (this.keyword) params.ts = "wfts(en)." + this.keyword;

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

      if (this.location.district) params.district = "eq." + this.location.district.trim().toUpperCase();

      if (this.location.country) params.country = "eq." + this.location.country.trim().toUpperCase();

      if (this.location.water) params.water = "ilike.*" + this.location.water.trim().toUpperCase() + "*";

      if (this.location.other) params.other = "ilike.*" + this.location.other.trim().toUpperCase() + "*";

      params.select = 'id,location,geoname_id,latitude,longitude,city,district,country,water,other,source,source_id,date,date_detail,description,word_count';

      let res;

      try {
        res = await axios.get(API_REPORTS + "/report_view", {
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

      this.fetchAttachmentsReferences(reports.map(r => r.id));

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

    async fetchAttachmentsReferences(reports: number[]) {
      try {
        let [attachments, references] = await Promise.all([
          axios.get(API_REPORTS + "/attachment", {
            params: {
              report: "in.(" + reports + ")"
            }
          }),
          axios.get(API_REPORTS + "/report_reference_view", {
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
    }
  }
});

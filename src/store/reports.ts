import axios from "axios";
import * as chrono from 'chrono-node';
import { countries } from "countries-list";
import { defineStore } from "pinia";
import { Report, Attachment, Reference, ReportReferenceView } from "@/models";
import { pinia } from "@/pinia";
import { useFiltersStore } from "@/store/filters";
import { useLocationsStore } from "@/store/locations";
import { linkify, saveToFile } from "@/util";

const API_REPORTS = import.meta.env.VITE_API_REPORTS;

let locationsStore = useLocationsStore(pinia);
let filtersStore = useFiltersStore(pinia);
let wordpos;

function buildDateParam(raw: string) {
  let isYearOnly = raw.match(/^\d{4}$/)?.length;
  if (isYearOnly) raw += '-01-01';
  
  let value = chrono.parse(raw);

  if (!value.length) return;
  let thisFrom = value[0].start;
  let fromParam = `${thisFrom.get("month")}/${thisFrom.get("day")}/${thisFrom.get("year")}`;
  return fromParam;
}

export const useReportsStore = defineStore("reports", {
  state: () => ({
    reports: {} as Record<number, Report>,
    attachments: {} as Record<number, Attachment>,
    references: {} as Record<number, Reference>,
    viewingReport: null,
    results: [] as number[],
    resultsTotal: null,
    selectedLocations: [],
    offset: 0,
    limit: 20,
    isSearching: false,
    reportCountryCounts: [],
    sort: 'date.desc,country,district,city',
    wordData: {} as Record<number, Record<string, string[]>>
  }),

  getters: {
    reportsForCurrentPage() {
      let resultInCurrentPage = (_, idx) => idx < this.offset + this.limit && idx >= this.offset;
      return this.results.filter(resultInCurrentPage);
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
    async download(filename, extraParams: Record<string, unknown> = {}) {
      let params = this.buildParams();
      let { data } = await axios.get(API_REPORTS + "/report_view", {
        headers: { Accept: "text/csv" },
        params: { ...params, ...extraParams }
      });
    
      saveToFile(data, filename);
    },
        
    wordDataForReport(id: number) {
      let wd = this.wordData[id];
      if (!wd) return;
      
      function filterWords(words: string[] = []) {
        return words
          .filter(w => w.length > 2)
          .filter(w => !w.match(/^\d/))
          .map(w => `<a href="/reports/search?keyword=${w}" target="_blank">${w}</a>`);
      }

      let data = {
        formatted: {
          adjectives: filterWords(wd.adjectives).join(' • '),
          adverbs: filterWords(wd.adverbs).join(' • '),
          verbs: filterWords(wd.verbs).join(' • ')
        },
        original: {
          adjectives: filterWords(wd.adjectives),
          adverbs: filterWords(wd.adverbs),
          verbs: filterWords(wd.verbs)
        }
      };
      return data;
    },

    async getAdverbs(id: number) {
      let report = this.reports[id];

      if (!import.meta.env.SSR) {
        if (!wordpos) {
          wordpos = new window['WordPOS']({
            // TODO: Use local version
            dictPath: 'https://cdn.jsdelivr.net/npm/wordpos-web@1.0.2/dict',
            preload: ['a', 'v', 'r'],
            includeData: false,
            stopwords: true
          });
        }
      }

      let adjectives = await wordpos?.getAdjectives(report?.description.toLowerCase());
      let adverbs = await wordpos?.getAdverbs(report?.description.toLowerCase());
      let verbs = await wordpos?.getVerbs(report?.description.toLowerCase());
      this.wordData[id] = { adjectives, adverbs, verbs };
    },

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

    async fetchReportCountryCounts() {
      try {
        let res = await axios.get(API_REPORTS + "/report_count_by_country");
        this.reportCountryCounts = res.data;
      }
      catch (error) {
        console.error(error);
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
        console.error(error);
        return null;
      }
    },

    buildParams(locations?: number[]) {
      let params: any = {
        offset: this.offset,
        limit: this.limit,
        order: this.sort
      };

      if (this.selectedLocations?.length) params.location = "in.(" + this.selectedLocations.join(",") + ")";

      if (locations?.length) params.location = "in.(" + locations.join(",") + ")";

      if (filtersStore.keyword) params.ts = "wfts(en)." + filtersStore.keyword;

      let dates = [];

      if (filtersStore.from) {
        let param = buildDateParam(filtersStore.from.toString());
        if (param) dates.push(`date.gte.${param}`);
      }

      if (filtersStore.to) {
        let param = buildDateParam(filtersStore.to.toString());
        if (param) dates.push(`date.lt.${param}`);
      }

      if (dates.length) params.and = `(${dates.join(",")})`;

      if (filtersStore.location.city) params.city = "ilike.*" + filtersStore.location.city.trim().toUpperCase() + "*";

      if (filtersStore.location.district) params.district = "eq." + filtersStore.location.district.trim().toUpperCase();

      if (filtersStore.location.country) params.country = "eq." + filtersStore.location.country.trim().toUpperCase();

      if (filtersStore.location.water) params.water = "ilike.*" + filtersStore.location.water.trim().toUpperCase() + "*";

      if (filtersStore.location.other) params.other = "ilike.*" + filtersStore.location.other.trim().toUpperCase() + "*";
      
      if (filtersStore.minWords) params.word_count = "gte." + filtersStore.minWords;

      if (filtersStore.source.length) params.source = "in.(" + filtersStore.source.map(s=>s.id).join(",") + ")";
      
      params.select = 'id,location,geoname_id,latitude,longitude,city,district,country,water,other,source,source_id,date,date_detail,description,word_count';

      return params;
    },

    async fetchReports(locations?: number[]) {
      let params = this.buildParams(locations);
      let res;

      let count = 'estimated';

      if (!filtersStore.hasFilter) count = 'exact';
      
      try {
        res = await axios.get(API_REPORTS + "/report_view", {
          headers: { Prefer: `count=${count}` },
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
      locationsStore.setLocationsDetailsFromReports(reports);

      await this.fetchAttachmentsReferences(reports?.map(r => r.id));
      this.isSearching = false;
    },

    async fetchNextReportsAndLocationDetails(page) {
      this.offset = (page - 1) * this.limit;
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

    async fetchAttachmentsReferences(reports?: number[]) {
      if (!reports) return;

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
        console.error(error.message);
        // TODO: show error notification
        return;
      }
    }
  }
});

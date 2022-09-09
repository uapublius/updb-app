import axios from "axios";
import { defineStore } from "pinia";
import { ReportView } from "@/models";

const API_REPORTS = import.meta.env.VITE_API_REPORTS;

export let useTagsStore = defineStore("tags", {
  state: () => ({
    tags: [] as string[],
    tagReports: {} as Record<string, string>[]
  }),

  getters: {
  },

  actions: {
    async fetchTagsForReport(report: ReportView) {
      let { data } = await axios.get(API_REPORTS + "/tag_report", {
        params: {
          source: `eq.${report.source}`,
          source_id: `eq.${report.source_id}`,
          order: "tag"
        }
      });

      this.tagReports[report.id] = data.map(d => d.tag);

      return data;
    },

    async createTags(tags: string[]) {
      let { data } = await axios.post(
        API_REPORTS + "/tag",
        tags.map(tag => ({ name: tag })),
        {
          headers: {
            'Prefer': 'resolution=merge-duplicates'
          }
        }
      );

      return data;
    },

    async addTagsToReport(tags: string[], report: ReportView) {
      await this.createTags(tags);

      let { data } = await axios.post(API_REPORTS + "/tag_report", tags.map(tag => ({
        source: report.source,
        source_id: report.source_id,
        tag
      })));

      this.fetchTagsForReport(report);

      return data;
    },

    async removeTagFromReport(tag: string, report: ReportView) {
      let { data } = await axios.delete(API_REPORTS + "/tag_report", {
        params: {
          source: `eq.${report.source}`,
          source_id: `eq.${report.source_id}`,
          tag: `eq.${tag}`
        }
      });

      this.fetchTagsForReport(report);

      return data;
    },

    async searchTags(query: string, report: ReportView) {
      let { data } = await axios.get(API_REPORTS + "/tag", {
        params: {
          name: "ilike.*" + query + "*",
          order: "name"
        }
      });

      data = data.filter(d => !this.tagReports[report.id]?.includes(d.name));
      data = data.map(d => d.name);

      return data;
    }
  }
});

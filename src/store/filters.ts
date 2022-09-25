import axios from "axios";
import { countries } from "countries-list";
import { defineStore } from "pinia";

const API_REPORTS = import.meta.env.VITE_API_REPORTS;

export const useFiltersStore = defineStore("filters", {
  state: () => ({
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
    source: [],
    minWords: null,
    sources: [],
    filterSummary: ""
  }),

  getters: {
    hasLocationFilter() {
      if (!this.location) return; 

      if (this.location.city || 
        this.location.district || 
        this.location.country || 
        this.location.water || 
        this.location.other) {
        return true;
      }
    },

    hasFilter() {
      if (this.keyword || 
        this.source.length || 
        this.minWords || 
        this.from || 
        this.to || 
        this.hasLocationFilter) {
        return true;
      }
    }
  },

  actions: {
    resetFilters() {
      this.keyword = "";
      this.location.city = "";
      this.location.district = "";
      this.location.country = "";
      this.location.water = "";
      this.from = "";
      this.to = "";
      this.minWords = null;
      this.source = [];
    },

    async fetchSources() {
      if (this.sources?.length) return;
      
      try {
        let { data } = await axios.get(API_REPORTS + "/source");
        this.sources = data.sort((a,b) => a.name < b.name ? -1 : 1);
      }
      catch (error) {
        console.error(error);
        return null;
      }
    },

    setSource(name: string) {
      this.source = [];
      let foundSource = this.sources.find(s => s.name.toLowerCase() === name.toLowerCase());
      if (foundSource) this.source.push(foundSource);
    },

    setSources(ids: string | string[]) {
      if (typeof ids === 'number') {
        this.source = [this.sources.find(s => s.id === parseInt(ids))];
      }
      else {
        this.source = this.sources.filter(s => ids.includes(s.id.toString()));
      }
    },

    buildSummary(prefix = '') {
      let summary = prefix;
      let filterStrings = [];

      if (!this.hasFilter) {
        this.filterSummary = summary;
        return;
      }
   
      if (this.from && this.to)  {
        filterStrings.push(`between ${this.from}–${this.to}`);
      }      
      else if (this.from)  {
        filterStrings.push(`from ${this.from}`);
      } 
      else if (this.to) {
        filterStrings.push(`to ${this.to}`);
      }

      if (this.minWords) filterStrings.push(`with at least ${this.minWords.toLocaleString()} words`);

      if (this.keyword) filterStrings.push(`matching keyword “${this.keyword}”`);
   
      if (this.hasLocationFilter) {
        filterStrings.push("in ");

        let locs = ['city', 'district', 'country', 'water', 'other'].map(l => {
          if (l === 'country') {
            let country = countries[this.location[l]];
            if (country) {
              let val = country.name;
              if (country.name !== country.native) val += ` (${country.native})`;
              return val;
            }
            else {
              return this.location[l];
            }
          }

          return this.location[l];
        }).filter(l => l);

        if (locs.length === 1) {
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

      if (this.source.length) {
        let plural = '';
        if (this.source.length > 1) plural += 's';
        filterStrings.push(`from ${this.source.map(s => s.name).join(', ')}`);
      }

      if (filterStrings.length) {
        this.filterSummary = `${summary} ${filterStrings.join(" ")}`.trim();
      }
      else {
        this.filterSummary = summary;
      }
    }
  }
});

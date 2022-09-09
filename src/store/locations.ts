import axios from "axios";
import localforage from "localforage";
import { defineStore } from "pinia";
import { parse } from '@/lib/csv-parse.js';
import { Location } from "@/models";

let counts = {} as Record<number, number>;
let locations = {} as Record<number, Location>;

const API_REPORTS = import.meta.env.VITE_API_REPORTS;

export let useLocationsStore = defineStore("locations", {
  state: () => ({
    details: {} as Record<number, Location>,
    viewingLocation: null,
    results: [],
    filter: {
      city: "",
      district: "",
      country: "",
      water: "",
      other: ""
    },
    from: null,
    to: null,
    offset: 0,
    limit: 10000
  }),

  getters: {
    counts: () => counts,
    locations: () => locations,
    features() {
      let features = Object.values(locations).map((location: Location) => {
        return {
          "type": "Feature",
          "properties": { location, count: counts[location.id] },
          "geometry": {
            "type": "Point",
            "coordinates": [location.longitude, location.latitude]
          }
        };
      });

      return features as any;
    }
  },

  actions: {
    async fetchLocationDetails(ids?: number[]) {
      let params: any = {
        offset: this.offset,
        limit: this.limit,
        order: 'id'
      };

      if (ids?.length) params.id = "in.(" + ids.join(",") + ")";

      if (this.filter.city) {
        params.city = "like.*" + this.filter.city.trim().toUpperCase() + "*";
      }
      if (this.filter.district) {
        params.district = "like.*" + this.filter.district.trim().toUpperCase() + "*";
      }
      if (this.filter.country) {
        params.country = "eq." + this.filter.country.trim().toUpperCase();
      }
      if (this.filter.water) {
        params.water = "like.*" + this.filter.water.trim().toUpperCase() + "*";
      }
      if (this.filter.other) {
        params.other = "like.*" + this.filter.other.trim().toUpperCase() + "*";
      }

      let { data } = await axios.get(API_REPORTS + "/location", {
        params
      });

      for (let datum of data) {
        this.details[datum.id] = {
          id: datum.id,
          city: datum.city,
          district: datum.district,
          country: datum.country,
          water: datum.water,
          other: datum.other,
          latitude: datum.latitude,
          longitude: datum.longitude,
          geoname_id: datum.geoname_id
        };
      }
    },

    setLocationsDetailsFromReports(reports: any[] = []) {
      for (let report of reports) {
        this.details[report.location] = {
          id: report.location,
          city: report.city,
          district: report.district,
          country: report.country,
          water: report.water,
          other: report.other,
          latitude: report.latitude,
          longitude: report.longitude,
          geoname_id: report.geoname_id
        };
      }
    },

    populateLocations(rows = []) {
      counts = {};
      locations = {};

      for (let row of rows) {
        let [location, count, latitude, longitude] = row;

        counts[location] = count;

        if (!locations[location]) locations[location] = {
          id: location,
          latitude,
          longitude,
          city: '',
          district: '',
          country: '',
          water: '',
          other: '',
          geoname_id: -1
        };
      }
    },

    async fetchSummaries(query) {
      let rows;
      let currentVersion = 'report_count_by_location-20220821';
      let previousVersions = ['summaries'];
      let parseOptions = {
        from: 2,
        cast: function (value, context) {
          if ([0, 1].includes(context.index)) {
            return parseInt(value);
          }

          if ([7, 8].includes(context.index)) {
            return parseFloat(value);
          }

          return value;
        }
      };

      async function parseRows(data) {
        await new Promise(resolve => {
          parse(data.toString(), parseOptions, (err, rowdata) => {
            rows = rowdata;
            resolve(null);
          });
        });
      }

      let fetchCounts = async () => {
        previousVersions.map(async version => await localforage.removeItem(version));

        let { data } = await axios.get('/data/map/report_count_by_location.csv');

        await parseRows(data);
        this.populateLocations(rows);
        localforage.setItem(currentVersion, rows);
      };

      try {
        if (query.q) {
          let { data } = await axios.get(API_REPORTS + "/rpc/location_search", {
            params: {
              q: query.q,
              lim: 50000
            }
          });

          let filteredRows = Object.values(data).map((d: any) => {
            return [d.id, d.count, d.lat, d.lon];
          });

          this.populateLocations(filteredRows);
        }
        else if (await localforage.getItem(currentVersion)) {
          rows = await localforage.getItem(currentVersion);
          this.populateLocations(rows);
        }
        else {
          await fetchCounts();
        }
      }
      catch (error) {
        await fetchCounts();
      }
    }
  }
});

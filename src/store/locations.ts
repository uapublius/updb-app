import axios from "axios";
import { parse } from 'csv-parse/browser/esm';
import localforage from "localforage";
import { defineStore } from "pinia";
import { Location } from "@/models";

let counts = {} as Record<number, number>;
let locations = {} as Record<number, Location>;

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

      let { data } = await axios.get("/api/reports/location", {
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

    setLocationsDetailsFromReports(reports: any[]) {
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

    async fetchSummaries() {
      let rows;

      if (await localforage.getItem('summaries')) {
        rows = await localforage.getItem('summaries');
      }
      else {
        let { data } = await axios.get('/data/map/summaries.csv');

        let options = {
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

        await new Promise(resolve => {
          parse(data.toString(), options, (err, rowdata) => {
            rows = rowdata;
            resolve(null);
          });
        });
      }

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

      localforage.setItem('summaries', rows);
    }
  }
});

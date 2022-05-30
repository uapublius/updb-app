import axios from "axios";
import Supercluster from 'supercluster';
import localforage from "localforage";

let features = [] as any[];
let reportsByLocation = {} as any;

export function clusteredFeaturesForArea(lg1, lt1, lg2, lt2, zoom) {
  let superCluster = new Supercluster({
    map: props => ({ count: props.count, loc: props.location }),
    reduce(accumulated, props) {
      if (!accumulated.sum) accumulated.sum = accumulated.count;
      accumulated.sum += props.count;
      if (!accumulated.locations) accumulated.locations = [accumulated.loc];
      accumulated.locations.push(props.loc);
    }
  });

  superCluster.load(features);

  let clusters = superCluster.getClusters(
    [
      Math.floor(lg1),
      Math.floor(lt1),
      Math.ceil(lg2),
      Math.ceil(lt2)
    ],
    Math.floor(zoom));

  return { superCluster, clusters };
}

export async function loadStorageSummaries() {
  let csvRows;

  if (await localforage.getItem('allSummaries')) {
    csvRows = await localforage.getItem('allSummaries');
  }
  else {
    let { data } = await axios.get('/summaries.csv');

    csvRows = data.toString()
      .split('\n')
      .map((row, jdx) => row
        .split(',')
        .map((cell, idx) => {
          if (jdx === 0) return cell;
          if (idx === 0 || idx === 1) return parseInt(cell);
          if (idx === 2 || idx === 3) return parseFloat(cell);
        })
      );

    csvRows.shift();

    localforage.setItem('allSummaries', csvRows);
  }

  features = csvRows.map(summaryToFeature);
}

export async function saveStorageReports() {
  localforage.setItem('reportsByLocation', reportsByLocation);
}

export async function loadStorageReports() {
  if (await localforage.getItem('reportsByLocation')) {
    reportsByLocation = await localforage.getItem('reportsByLocation');
  }
  else {
    reportsByLocation = {};
    saveStorageReports();
  }
}

export async function fetchReportsForLocations(locations) {
  let locationsInStorage = locations.filter(l => reportsByLocation[l]);
  let locationsNotInStorage = locations.filter(l => !reportsByLocation[l]);
  console.log('locationsNotInStorage', locationsNotInStorage);

  if (!locationsNotInStorage.length) return reportsByLocation;

  let { data } = await axios.get("/api/reports/report_view", {
    params: {
      select: 'id,source,source_id,date,date_detail,word_count,description,location,city,district,country,water,other',
      and: `(location.in.(${locationsNotInStorage}),location.not.in.(${locationsInStorage}))`
    }
  });

  for (const report of data) {
    if (!reportsByLocation[report.location]) reportsByLocation[report.location] = {};
    reportsByLocation[report.location][report.id] = report;
  }

  saveStorageReports();

  return reportsByLocation;
}

export function reportsForLocation(location) {
  return reportsByLocation[location];
}

export function summaryToFeature([location, count, latitude, longitude]) {
  return {
    "type": "Feature",
    "properties": { location, count },
    "geometry": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    }
  };
}
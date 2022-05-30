import { ref } from "vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { clusteredFeaturesForArea, fetchReportsForLocations, loadStorageReports, loadStorageSummaries } from "./data";
import { addReportsLayer } from "./layers";
import { hasMapMovedSignificantly } from "./util";

mapboxgl.accessToken = import.meta.env.VITE_MAP_KEY;
mapboxgl.baseApiUrl = "https://api.maptiler.com";

export function useMap() {
  let selectedLocations = ref(null);

  async function loadMap(map) {
    await loadStorageSummaries();
    await loadStorageReports();
    addReportsLayer(map);
  }

  async function refreshMap(map) {
    if (!hasMapMovedSignificantly(map)) return;

    selectedLocations.value = null;

    map.getSource('summaries-selected').setData({
      "type": "FeatureCollection",
      "features": [],
    });

    let [[lg1, lt1], [lg2, lt2]] = map.getBounds().toArray();
    let zoom = Math.floor(map.getZoom());
    let { clusters } = await clusteredFeaturesForArea(lg1, lt1, lg2, lt2, zoom);

    map.getSource('summaries').setData({
      "type": "FeatureCollection",
      "features": clusters,
    });
  }

  async function selectCluster(ev) {
    let layer = ev.target;
    let feature = ev.features[0];

    let props = feature.properties;

    // let clusterId = props.cluster_id;
    // let leaves = supercluster.getLeaves(clusterId);
    // let reportCount = leaves.reduce((acc,curr) => { acc += curr.properties.count; return acc; }, 0);
    // console.log(leaves);

    let selected;

    if (props.locations) {
      let locations = JSON.parse(props.locations);
      selected = locations;
    }
    else {
      selected = [props.location];
    }

    console.log(selected, props);

    layer.getSource('summaries-selected').setData({
      "type": "FeatureCollection",
      "features": [feature],
    });

    selectedLocations.value = [];

    await fetchReportsForLocations(selected);

    selectedLocations.value = selected;
  }

  function createMap(
    container,
    center,
    zoom = 8,
    maxZoom = 11,
    minZoom = 1,
    style = `/api/maps/maps/basic/style.json?key=${import.meta.env.VITE_MAP_KEY}`,
  ) {
    let map = new mapboxgl.Map({
      container,
      style,
      center,
      maxZoom,
      minZoom,
      zoom
    });

    map.on('load', async ({ target }) => {
      await loadMap(target);
      refreshMap(target);
    });

    map.on('moveend', ({ target }) => {
      refreshMap(target);
    });

    map.on('mouseenter', 'summaries', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'summaries', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('click', 'summaries', (ev) => {
      selectCluster(ev);
    });

    return map;
  }

  return {
    createMap,
    selectedLocations
  };
}
import mapboxgl from "mapbox-gl";
import Supercluster from 'supercluster';
import { computed, ref } from "vue";
import { useRouter, useRoute } from 'vue-router';
import "mapbox-gl/dist/mapbox-gl.css";
import { addReportsLayer } from "./layers";
import { useLocationsStore } from "@/store/locations";
import { useReportsStore } from "@/store/reports";

mapboxgl.accessToken = import.meta.env.VITE_MAP_KEY;
mapboxgl.baseApiUrl = import.meta.env.VITE_MAP_BASEURL;

export let mapInstance = null;

export function useMap(id: string) {
  let reportsStore = useReportsStore();
  let locationsStore = useLocationsStore();
  let router = useRouter();
  let route = useRoute();

  let lastBounds: Record<string, Record<string, any>> = {};
  let superCluster = new Supercluster({
    minPoints: 1,
    radius: 40,
    map: props => ({ location: props.location }),
    reduce(accumulated: any, props) {
      if (!accumulated.locations) accumulated.locations = [accumulated.location];
      accumulated.locations.push(props.location);
    }
  });

  let selectedLocations = ref([]);
  let zoomLevel = ref(null);
  let totalSelectedReports = ref(0);
  let cluster = ref(0);

  let selectedReports = computed(() => {
    let reports = selectedLocations.value.map(location => reportsStore.reportsForLocation(location));
    return reports.flat().sort((a, b) => a.date < b.date ? 1 : -1);
  });

  function hasMapMovedSignificantly(map, idx = 1) {
    if (!lastBounds[idx]) lastBounds[idx] = {};

    let [[lg1, lt1], [lg2, lt2]] = map.getBounds().toArray();
    let lastLt = lastBounds[idx].lt1 || 0;
    let lastLg = lastBounds[idx].lg1 || 0;

    lastBounds[idx] = {
      lt1, lt2, lg1, lg2
    };

    if (!(Math.abs(lastLt - lt1) > 0.004 || Math.abs(lastLg - lg1) > 0.004)) {
      return false;
    }

    return true;
  }

  async function loadMap(map) {
    await locationsStore.fetchSummaries(route.query);
    superCluster.load(locationsStore.features);
    addReportsLayer(map);
  }

  async function refreshMap(map) {
    if (!hasMapMovedSignificantly(map)) return;

    let [[lg1, lt1], [lg2, lt2]] = map.getBounds().toArray();
    let zoom = Math.floor(map.getZoom());

    let clusters = superCluster.getClusters([
      Math.floor(lg1),
      Math.floor(lt1),
      Math.ceil(lg2),
      Math.ceil(lt2)
    ], Math.floor(zoom));

    let individualLocations = {};

    for (let feature of clusters) {
      if (!feature.properties.cluster) {
        individualLocations[feature.properties.location.id] = true;
      }
    }

    for (let feature of clusters) {
      if (!feature.properties.cluster) {
        feature.properties.reportsCount = locationsStore.counts[feature.properties.location.id];
        continue;
      }

      let leaves = superCluster.getLeaves(feature.properties.cluster_id, Number.MAX_SAFE_INTEGER);
      let leafCount = leaves.map(feature => locationsStore.counts[feature.properties.location.id]).reduce((acc, curr) => acc + curr, 0);
      feature.properties.reportsCount = leafCount;
    }

    map.getSource('summaries').setData({
      "type": "FeatureCollection",
      "features": clusters
    });
  }

  function unselectCluster() {
    mapInstance.getSource('summaries-selected').setData({
      "type": "FeatureCollection",
      "features": []
    });
  }

  async function selectCluster(ev) {
    let map = ev.target;
    let feature = ev.features[0];

    map.getSource('summaries-selected').setData({
      "type": "FeatureCollection",
      "features": [feature]
    });

    let selected;

    if (feature.properties.cluster_id) {
      let leaves = superCluster.getLeaves(feature.properties.cluster_id, Number.MAX_SAFE_INTEGER);
      selected = leaves.map(feature => feature.properties.location.id);
      cluster.value = feature.properties.cluster_id;
    }
    else if (feature.properties.location) {
      let location = JSON.parse(feature.properties.location);
      selected = [location.id];
    }
    else {
      console.log('Could not determine selected location(s)', feature.properties);
      return;
    }

    totalSelectedReports.value = feature.properties.reportsCount;
    reportsStore.viewingReport = null;
    selectedLocations.value = selected;

    locationsStore.fetchLocationDetails(selectedLocations.value);
    reportsStore.offset = 0;
  }

  function updateRoute(map) {
    let zoom = map.getZoom();
    let center = map.getCenter();
    let query = {
      zoom: zoom.toFixed(2),
      lon: center.lng.toFixed(4),
      lat: center.lat.toFixed(4)
    };

    router.replace({
      query: Object.assign({}, route.query, query)
    });
  }

  function transformRequest(url) {
    return {
      url: url.replace("https://api.maptiler.com", mapboxgl.baseApiUrl)
    };
  }

  function createMap(
    center,
    zoom = 8,
    maxZoom = 11,
    minZoom = 1,
    style = `/api/maps/maps/basic/style.json?key=${import.meta.env.VITE_MAP_KEY}`
  ) {
    let container = document.getElementById(id);
    let map = new mapboxgl.Map({
      attributionControl: false,
      container,
      style,
      center,
      maxZoom,
      minZoom,
      zoom,
      transformRequest
    });


    mapInstance = map;

    map.on('load', async ({ target }) => {
      await loadMap(target);
      refreshMap(target);

      target.on('moveend', ({ target }) => {
        refreshMap(target);
        updateRoute(target);
      });
    });

    map.on('zoom', ({ target }) => {
      zoomLevel.value = target.getZoom();
    });

    map.on('mouseenter', 'summaries', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'summaries', () => {
      map.getCanvas().style.cursor = '';
    });

    map.on('click', 'summaries', ev => {
      selectCluster(ev);
    });

    return map;
  }

  return {
    cluster,
    createMap,
    totalSelectedReports,
    selectedLocations,
    zoomLevel,
    selectedReports,
    unselectCluster
  };
}

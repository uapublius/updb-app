export function addReportsLayer(map) {
  map.addSource("summaries", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
      tiles: [import.meta.env.VITE_MAP_BASEURL]
    }
  });

  map.addSource("summaries-selected", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: []
    }
  });

  map.addLayer({
    id: 'summaries',
    type: 'circle',
    source: 'summaries',
    paint: {
      'circle-color': '#556',
      'circle-opacity': 0.65,
      'circle-radius': 17,
      'circle-stroke-color': '#fff',
      'circle-translate': [0, 9]
    }
  });

  map.addLayer({
    id: 'summaries-selected',
    type: 'circle',
    source: 'summaries-selected',
    paint: {
      'circle-color': '#f00',
      'circle-opacity': 1,
      'circle-radius': 17,
      'circle-stroke-color': '#fff',
      'circle-translate': [0, 9]
    }
  });

  map.addLayer({
    id: 'summaries-count',
    type: 'symbol',
    source: 'summaries',
    layout: {
      'text-field': '{reportsCount}',
      'text-size': 15,
      'text-anchor': 'top',
      'text-allow-overlap': true,
      'text-ignore-placement': true
    },
    paint: {
      'text-color': '#000',
      'text-halo-color': '#fff',
      'text-halo-blur': 0.5,
      'text-halo-width': 1.5
    }
  });
}
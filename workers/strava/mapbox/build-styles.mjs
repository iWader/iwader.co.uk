// Builds the Mapbox styles used for activity maps on iwader.co.uk/now.
// Run with `node build-styles.mjs`, then upload the JSON files in Mapbox Studio (Styles → New style → Upload).

import { writeFileSync } from 'node:fs'

const palettes = {
  light: {
    name: 'iwader Light',
    land: '#F8F6FB',
    park: '#E9EEE6',
    wood: '#E1E9DD',
    sand: '#F2EEE6',
    civic: '#F1EEF4',
    water: '#DDD9EE',
    waterLabel: '#6B6491',
    building: '#EEEBF2',
    buildingOutline: '#E2DEE9',
    roadMinor: '#FFFFFF',
    roadMinorCasing: '#E2DEE9',
    roadMajor: '#FFFFFF',
    roadMajorCasing: '#D4CFDD',
    motorway: '#F1ECFA',
    motorwayCasing: '#CFC4E6',
    path: '#BDB6C8',
    rail: '#D1CCD9',
    label: '#5E5A66',
    placeLabel: '#3A3641',
    halo: '#F8F6FB',
  },
  dark: {
    name: 'iwader Dark',
    land: '#1A1720',
    park: '#1D221E',
    wood: '#1B211C',
    sand: '#211F1B',
    civic: '#1E1B24',
    water: '#100E15',
    waterLabel: '#7F78A3',
    building: '#221F29',
    buildingOutline: '#27232E',
    roadMinor: '#2C2834',
    roadMinorCasing: '#1A1720',
    roadMajor: '#3A3544',
    roadMajorCasing: '#1A1720',
    motorway: '#463C5C',
    motorwayCasing: '#1A1720',
    path: '#4D4857',
    rail: '#34303C',
    label: '#A8A2B2',
    placeLabel: '#CFCAD7',
    halo: '#1A1720',
  },
}

const MINOR = ['street', 'street_limited', 'service', 'pedestrian', 'track']
const MAJOR = ['trunk', 'trunk_link', 'primary', 'primary_link', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link']
const MOTORWAY = ['motorway', 'motorway_link']
const PATHS = ['path']
const RAIL = ['major_rail', 'minor_rail']

const width = (stops) => ['interpolate', ['exponential', 1.5], ['zoom'], ...stops.flat()]
const isLine = ['==', ['geometry-type'], 'LineString']
const notTunnel = ['!=', ['get', 'structure'], 'tunnel']
const classIn = (classes) => ['match', ['get', 'class'], classes, true, false]
const roads = (classes) => ['all', isLine, notTunnel, classIn(classes)]

const font = {
  regular: ['DIN Pro Regular', 'Arial Unicode MS Regular'],
  medium: ['DIN Pro Medium', 'Arial Unicode MS Regular'],
  italic: ['DIN Pro Italic', 'Arial Unicode MS Regular'],
}

const style = (c) => ({
  version: 8,
  name: c.name,
  metadata: { 'iwader:generated-by': 'workers/strava/mapbox/build-styles.mjs' },
  sources: {
    composite: { type: 'vector', url: 'mapbox://mapbox.mapbox-streets-v8' },
  },
  glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf',
  layers: [
    { id: 'background', type: 'background', paint: { 'background-color': c.land } },

    {
      id: 'landuse',
      type: 'fill',
      source: 'composite',
      'source-layer': 'landuse',
      filter: classIn(['park', 'grass', 'pitch', 'cemetery', 'wood', 'scrub', 'sand', 'school', 'hospital']),
      paint: {
        'fill-color': ['match', ['get', 'class'],
          ['park', 'grass', 'pitch', 'cemetery'], c.park,
          ['wood', 'scrub'], c.wood,
          'sand', c.sand,
          c.civic,
        ],
      },
    },
    {
      id: 'landuse-overlay',
      type: 'fill',
      source: 'composite',
      'source-layer': 'landuse_overlay',
      filter: classIn(['national_park', 'wetland', 'wetland_noveg']),
      paint: { 'fill-color': c.park, 'fill-opacity': 0.6 },
    },

    { id: 'water', type: 'fill', source: 'composite', 'source-layer': 'water', paint: { 'fill-color': c.water } },
    {
      id: 'waterway',
      type: 'line',
      source: 'composite',
      'source-layer': 'waterway',
      minzoom: 8,
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': c.water, 'line-width': width([[8, 0.5], [14, 2], [18, 8]]) },
    },

    {
      id: 'building',
      type: 'fill',
      source: 'composite',
      'source-layer': 'building',
      minzoom: 14,
      filter: ['all', ['!=', ['get', 'type'], 'building:part'], ['==', ['get', 'underground'], 'false']],
      paint: {
        'fill-color': c.building,
        'fill-outline-color': c.buildingOutline,
        'fill-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0, 15, 1],
      },
    },

    {
      id: 'road-path',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      minzoom: 13,
      filter: roads(PATHS),
      layout: { 'line-join': 'round' },
      paint: { 'line-color': c.path, 'line-width': width([[13, 0.6], [16, 1.4], [18, 2.5]]), 'line-dasharray': [2, 1.5] },
    },
    {
      id: 'road-rail',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      minzoom: 11,
      filter: roads(RAIL),
      paint: { 'line-color': c.rail, 'line-width': width([[11, 0.5], [16, 1.5], [18, 2.5]]) },
    },

    {
      id: 'road-minor-casing',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      minzoom: 12,
      filter: roads(MINOR),
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': c.roadMinorCasing, 'line-width': width([[12, 0.75], [14, 3], [16, 8], [18, 18]]) },
    },
    {
      id: 'road-major-casing',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      minzoom: 8,
      filter: roads(MAJOR),
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': c.roadMajorCasing, 'line-width': width([[8, 0.75], [12, 2.5], [14, 5.5], [16, 12], [18, 25]]) },
    },
    {
      id: 'road-motorway-casing',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      minzoom: 6,
      filter: roads(MOTORWAY),
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': c.motorwayCasing, 'line-width': width([[6, 1], [12, 3], [14, 6.5], [16, 13], [18, 27]]) },
    },
    {
      id: 'road-minor',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      minzoom: 12,
      filter: roads(MINOR),
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': c.roadMinor, 'line-width': width([[12, 0.5], [14, 2], [16, 6], [18, 15]]) },
    },
    {
      id: 'road-major',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      minzoom: 8,
      filter: roads(MAJOR),
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': c.roadMajor, 'line-width': width([[8, 0.5], [12, 1.5], [14, 4], [16, 9.5], [18, 21]]) },
    },
    {
      id: 'road-motorway',
      type: 'line',
      source: 'composite',
      'source-layer': 'road',
      minzoom: 6,
      filter: roads(MOTORWAY),
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': c.motorway, 'line-width': width([[6, 0.75], [12, 2], [14, 5], [16, 10.5], [18, 23]]) },
    },

    {
      id: 'water-label',
      type: 'symbol',
      source: 'composite',
      'source-layer': 'natural_label',
      filter: classIn(['bay', 'ocean', 'sea', 'water', 'reservoir', 'river']),
      layout: {
        'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
        'text-font': font.italic,
        'text-size': ['interpolate', ['linear'], ['zoom'], 10, 11, 16, 14],
        'text-max-width': 8,
        'text-letter-spacing': 0.05,
      },
      paint: { 'text-color': c.waterLabel, 'text-halo-color': c.water, 'text-halo-width': 1 },
    },
    {
      id: 'road-label',
      type: 'symbol',
      source: 'composite',
      'source-layer': 'road',
      minzoom: 13,
      filter: ['all', isLine, classIn([...MINOR, ...MAJOR, ...MOTORWAY])],
      layout: {
        'symbol-placement': 'line',
        'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
        'text-font': font.regular,
        'text-size': ['interpolate', ['linear'], ['zoom'], 13, 10, 18, 14],
        'text-padding': 4,
        'text-max-angle': 30,
      },
      paint: { 'text-color': c.label, 'text-halo-color': c.halo, 'text-halo-width': 1.25 },
    },
    {
      id: 'place-neighbourhood',
      type: 'symbol',
      source: 'composite',
      'source-layer': 'place_label',
      minzoom: 11,
      maxzoom: 17,
      filter: ['==', ['get', 'class'], 'settlement_subdivision'],
      layout: {
        'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
        'text-font': font.medium,
        'text-size': ['interpolate', ['linear'], ['zoom'], 11, 10, 16, 13],
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.1,
        'text-max-width': 7,
      },
      paint: { 'text-color': c.label, 'text-halo-color': c.halo, 'text-halo-width': 1.5 },
    },
    {
      id: 'place-settlement',
      type: 'symbol',
      source: 'composite',
      'source-layer': 'place_label',
      maxzoom: 16,
      filter: ['==', ['get', 'class'], 'settlement'],
      layout: {
        'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
        'text-font': font.medium,
        'text-size': ['interpolate', ['linear'], ['zoom'], 8, 12, 14, 18],
        'text-max-width': 8,
      },
      paint: { 'text-color': c.placeLabel, 'text-halo-color': c.halo, 'text-halo-width': 1.5 },
    },
  ],
})

for (const [key, palette] of Object.entries(palettes)) {
  const file = new URL(`./iwader-${key}.json`, import.meta.url)
  writeFileSync(file, JSON.stringify(style(palette), null, 2) + '\n')
  console.log(`Wrote ${file.pathname}`)
}

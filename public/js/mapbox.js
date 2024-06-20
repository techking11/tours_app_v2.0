/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);
mapboxgl.accessToken =
  'pk.eyJ1IjoidGVjaGtpbmcxMTMyIiwiYSI6ImNseG4yNjhwcjBkaGkya3NkaTVwNjgzZ2UifQ.JGo5t2ZkK4F0KPtuQsvLQQ';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v9', // style URL
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  const el = document.createElement('div');
  el.className = 'marker';

  // Add Marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add Popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`)
    .addTo(map);

  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});

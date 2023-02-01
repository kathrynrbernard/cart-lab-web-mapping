// Leaflet Quick Start Tutorial
// https://leafletjs.com/examples/quick-start/

// initialize map and set geographic coordinates and zoom level
var map = L.map('map').setView([51.505, -0.09], 13);

// add a tile layer to the map (OSM)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// add a marker to the map (blue location pin)
var marker = L.marker([51.5, -0.09]).addTo(map);

// add a circle to the map (red circle)
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500,
}).addTo(map);

// add a polygon to the map (blue triangle)
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047],
]).addTo(map);

// add popups to objects
marker.bindPopup('<b>Hello world!</b><br>I am a popup.').openPopup(); // open by default
circle.bindPopup('I am a circle.'); // opens on click
polygon.bindPopup('I am a polygon.');

// popup as a layer
var popup = L.popup()
    .setLatLng([51.513, -0.09])
    .setContent('I am a standalone popup.')
    .openOn(map); // Here we use openOn instead of addTo because it handles automatic closing of a previously opened popup when opening a new one which is good for usability.

// events; https://leafletjs.com/reference.html
function onMapClick(e) {
    alert('You clicked the map at ' + e.latlng); // native browser popup at the top of the window
}

map.on('click', onMapClick);

// popup instead of an alert - shows a popup on the map at the spot you clicked
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent('You clicked the map at ' + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

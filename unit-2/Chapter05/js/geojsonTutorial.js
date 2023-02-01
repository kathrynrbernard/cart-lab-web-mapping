// Leaflet GeoJSON Tutorial
// https://leafletjs.com/examples/geojson/

var map = L.map('map').setView([39.75621, -104.99404], 13);

// add a tile layer to the map (OSM)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// geoJSON
var geojsonFeature = {
    type: 'Feature',
    properties: {
        name: 'Coors Field',
        amenity: 'Baseball Stadium',
        popupContent: 'This is where the Rockies play!',
    },
    geometry: {
        type: 'Point',
        coordinates: [-104.99404, 39.75621],
    },
};

// add GeoJSON object to the map using a GeoJSON Layer
L.geoJSON(geojsonFeature).addTo(map);

// array of geoJSON objects
var myLines = [
    {
        type: 'LineString',
        coordinates: [
            [-100, 40],
            [-105, 45],
            [-110, 55],
        ],
    },
    {
        type: 'LineString',
        coordinates: [
            [-105, 40],
            [-110, 45],
            [-115, 55],
        ],
    },
];

// create empty geoJSON layer and assign it to a variable so more features can be added later
var myLayer = L.geoJSON().addTo(map);
myLayer.addData(geojsonFeature);

// One option for styling
var myLines = [
    {
        type: 'LineString',
        coordinates: [
            [-100, 40],
            [-105, 45],
            [-110, 55],
        ],
    },
    {
        type: 'LineString',
        coordinates: [
            [-105, 40],
            [-110, 45],
            [-115, 55],
        ],
    },
];

// style all paths (polylines and polygons) the same way
var myStyle = {
    color: '#ff7800',
    weight: 5,
    opacity: 0.65,
};

L.geoJSON(myLines, {
    style: myStyle,
}).addTo(map);

// Second option for syling
var states = [
    {
        type: 'Feature',
        properties: { party: 'Republican' },
        geometry: {
            type: 'Polygon',
            coordinates: [
                [
                    [-104.05, 48.99],
                    [-97.22, 48.98],
                    [-96.58, 45.94],
                    [-104.03, 45.94],
                    [-104.05, 48.99],
                ],
            ],
        },
    },
    {
        type: 'Feature',
        properties: { party: 'Democrat' },
        geometry: {
            type: 'Polygon',
            coordinates: [
                [
                    [-109.05, 41.0],
                    [-102.06, 40.99],
                    [-102.03, 36.99],
                    [-109.04, 36.99],
                    [-109.05, 41.0],
                ],
            ],
        },
    },
];

// style based on properties of each feature
L.geoJSON(states, {
    style: function (feature) {
        switch (feature.properties.party) {
            case 'Republican':
                return { color: '#ff0000' };
            case 'Democrat':
                return { color: '#0000ff' };
        }
    },
}).addTo(map);

// create a circle marker using points
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: '#ff7800',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
};

L.geoJSON(geojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },
}).addTo(map);

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

var geojsonFeature = {
    type: 'Feature',
    properties: {
        name: 'Coors Field',
        amenity: 'Baseball Stadium',
        popupContent: 'This is where the Rockies play!',
    },
    geometry: {
        type: 'Point',
        coordinates: [-104.99404, 39.75621],
    },
};

L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature,
}).addTo(map);

var someFeatures = [
    {
        type: 'Feature',
        properties: {
            name: 'Coors Field',
            show_on_map: true,
        },
        geometry: {
            type: 'Point',
            coordinates: [-104.99404, 39.75621],
        },
    },
    {
        type: 'Feature',
        properties: {
            name: 'Busch Field',
            show_on_map: false,
        },
        geometry: {
            type: 'Point',
            coordinates: [-104.98404, 39.74621],
        },
    },
];

L.geoJSON(someFeatures, {
    filter: function (feature, layer) {
        return feature.properties.show_on_map;
    },
}).addTo(map);

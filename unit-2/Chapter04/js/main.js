// Data from: https://geo.btaa.org/catalog/B540FDA4-3D6D-41C7-B01E-98C1C9F6B00E
// Monona Transit and Middleton Trolley stops

//declare map var in global scope
let map;

//function to instantiate the Leaflet map
function createMap() {
    //create the map
    map = L.map('map', {
        center: [43.0747, -89.3841],
        zoom: 13,
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(map);

    //call getData function
    getData();
}

const props = ['LOCATION', 'STOP_ID', 'SYSTEM'];
function popupContent(feature, layer) {
    let popupContent = '';
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (let property in props) {
            let prop_display = props[property],
                val_display = feature.properties[props[property]];
            props[property] === 'STOP_ID'
                ? (prop_display = 'STOP ID')
                : (prop_display = prop_display);
            if (props[property] === 'SYSTEM') {
                if (
                    feature.properties['SYSTEM'] === 'MON' ||
                    feature.properties['SYSTEM'] === 'MT'
                ) {
                    val_display = 'Monona Trolley';
                } else if (feature.properties['SYSTEM'] === 'MIDTROL') {
                    val_display = 'Middleton Trolley';
                }
            }
            popupContent +=
                '<p><b>' + prop_display + '</b>: ' + val_display + '</p>';
        }
        layer.bindPopup(popupContent);
    }
}

//function to retrieve the data and place it on the map
function getData() {
    //load the data
    fetch('data/Madison_City_Suburban_Transit_Stops_2020.geojson')
        .then((response) => response.json())
        .then(callback);
}

let mononaMarker = {
    radius: 8,
    fillColor: '#ff7800',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
};

let middletonMarker = {
    radius: 8,
    fillColor: '#748d69',
    color: '#000',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
};

function getMarker(feature) {
    switch (feature.properties.SYSTEM) {
        case 'MON':
            console.log('hi');
            return mononaMarker;
        case 'MT':
            return mononaMarker;
        case 'MIDTROL':
            return middletonMarker;
    }
}

function callback(response) {
    L.geoJson(response, {
        onEachFeature: popupContent,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, getMarker(feature));
        },
    }).addTo(map);
}

document.addEventListener('DOMContentLoaded', createMap);

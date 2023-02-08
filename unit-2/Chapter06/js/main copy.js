//declare map variable globally so all functions have access
let map;
let minValue;

//step 1 create map
function createMap() {
    //create the map
    map = L.map('map', {
        center: [0, 0],
        zoom: 2,
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(map);

    //call getData function
    getData(map);
}

function calculateMinValue(data) {
    //create empty array to store all data values
    let allValues = [];
    //loop through each city
    for (let city of data.features) {
        //loop through each year
        for (let year = 1985; year <= 2015; year += 5) {
            //get population for current year
            let value = city.properties['Pop_' + String(year)];
            //add value to array
            allValues.push(value);
        }
    }
    //get minimum value of our array
    let minValue = Math.min(...allValues);

    return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    let minRadius = 5;
    //Flannery Apperance Compensation formula
    let radius = 1.0083 * Math.pow(attValue / minValue, 0.5715) * minRadius;

    return radius;
}

function createPopupContent(properties, attribute) {
    //add city to popup content string
    let popupContent = '<p><b>City:</b> ' + properties.City + '</p>';

    //add formatted attribute to panel content string
    let year = attribute.split('_')[1];
    popupContent +=
        '<p><b>Population in ' +
        year +
        ':</b> ' +
        properties[attribute] +
        ' million</p>';

    return popupContent;
}

function pointToLayer(feature, latlng, attributes) {
    //Determine which attribute to visualize with proportional symbols
    let attribute = attributes[0];
    console.log(attribute);

    //create marker options
    let options = {
        fillColor: '#ff7800',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
    };

    //For each feature, determine its value for the selected attribute
    let attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    let layer = L.circleMarker(latlng, options);

    //build popup content string starting with city
    let popupContent = createPopupContent(feature.properties, attribute);

    //bind the popup to the circle marker, with vertical offset so the pointer doesn't cover the circle
    layer.bindPopup(popupContent, {
        offset: new L.Point(0, -options.radius),
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
}

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes) {
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return pointToLayer(feature, latlng, attributes);
        },
    }).addTo(map);
}

//Resize proportional symbols according to new attribute values
function updatePropSymbols(attribute) {
    map.eachLayer(function (layer) {
        if (layer.feature && layer.feature.properties[attribute]) {
            //update the layer style and popup
            //access feature properties
            let props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            let radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            let popupContent = createPopupContent(props, attribute);

            //update popup content
            popup = layer.getPopup();
            popup.setContent(popupContent).update();
        }
    });
}

// create new sequence controls
function createSequenceControls(json, attributes) {
    //create range input element (slider)
    let slider = "<input class='range-slider' type='range'></input>";
    document.querySelector('#panel').insertAdjacentHTML('beforeend', slider);

    //set slider attributes
    //MegaCities.json has 7 attributes (7 years of population data)
    document.querySelector('.range-slider').max = 6;
    document.querySelector('.range-slider').min = 0;
    document.querySelector('.range-slider').value = 0;
    document.querySelector('.range-slider').step = 1;

    //add step buttons
    document
        .querySelector('#panel')
        .insertAdjacentHTML(
            'beforeend',
            '<button class="step" id="reverse"></button>'
        );
    document
        .querySelector('#panel')
        .insertAdjacentHTML(
            'beforeend',
            '<button class="step" id="forward"></button>'
        );
    //replace button content with images
    document
        .querySelector('#reverse')
        .insertAdjacentHTML('beforeend', "<img src='img/backward.png'>");
    document
        .querySelector('#forward')
        .insertAdjacentHTML('beforeend', "<img src='img/forward.png'>");

    //click listener for buttons
    document.querySelectorAll('.step').forEach(function (step) {
        step.addEventListener('click', function () {
            var index = document.querySelector('.range-slider').value;

            // increment or decrement depending on button clicked
            if (step.id == 'forward') {
                index++;
                //if past the last attribute, wrap around to first attribute
                index = index > 6 ? 0 : index;
            } else if (step.id == 'reverse') {
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 0 ? 6 : index;
            }

            //update slider
            document.querySelector('.range-slider').value = index;
            //pass new attribute to update symbols
            updatePropSymbols(attributes[index]);
        });
    });

    //input listener for slider
    document
        .querySelector('.range-slider')
        .addEventListener('input', function () {
            var index = this.value;
            console.log(index);
            // pass new attribute to update symbols
            updatePropSymbols(attributes[index]);
        });
}

//build an attributes array from the data
function processData(data) {
    //empty array to hold attributes
    let attributes = [];

    //properties of the first feature in the dataset
    let properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (let attribute in properties) {
        //only take attributes with population values
        if (attribute.indexOf('Pop') > -1) {
            attributes.push(attribute);
        }
    }

    //check result
    console.log(attributes);

    return attributes;
}

//Import GeoJSON data
function getData() {
    //load the data
    fetch('data/MegaCities.geojson')
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            // create attributes array
            let attributes = processData(json);
            //calculate minimum data value
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json, map, attributes);
            createSequenceControls(json, attributes);
        });
}

document.addEventListener('DOMContentLoaded', createMap);

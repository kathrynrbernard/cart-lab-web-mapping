// long-form fetch
// function jsAjax() {
//     var request = new Request('../data/MegaCities.geojson');
//     var init = {
//         method: 'GET', // use GET for retrieving data, POST for sending data to server
//     };
//     fetch(request, init).then(conversion).then(callback); // use fetch to retrieve the data, then send the data to the callback function
// }

// simplified
function jsAjax() {
    fetch('data/MegaCities.geojson') // GET is the default method
        .then(function (response) {
            return response.json();
        }) //convert data to usable form
        .then(callback); //send retrieved data to a callback function
}

// any script that makes use of data sent through AJAX should be written or called within the callback() function
// to avoid manipulating the data before it is fully available in the browser
function callback(response) {
    console.log(response);
    console.log(JSON.stringify(response));
}

window.onload = jsAjax();

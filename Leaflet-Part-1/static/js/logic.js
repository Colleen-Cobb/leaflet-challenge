// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2022-11-01&endtime=2022-12-02&maxlongitude=180&minlongitude=-180&maxlatitude=90&minlatitude=-90";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var markers = [];

  for (var i = 0; i < earthquakeData.length; i++) {
    
    var lat = earthquakeData[i].geometry.coordinates[1]
    var lng = earthquakeData[i].geometry.coordinates[0]
    var cord = [lat, lng]
    var depth = earthquakeData[i].geometry.coordinates[2]
    var mag = earthquakeData[i].properties.mag 
    var color = "";
    if (depth < 10){
      color = "#77FF33"
    }
    else if (depth < 30){
      color = "#33FF35"
    }
    else if (depth < 50) {
      color = "#FFE033"
    }
    else if (depth < 70) {
      color = "#FF8E33"
    }
    else if (depth < 90) {
      color = "#FF7133"
    }
    else {
      color = "#FF4A33"
    }

    markers.push(
      L.circle(cord, {
        collapsed: false, 
        fillOpacity: 0.75, 
        color: "black",
        fillColor: color, 
      }).bindPopup(`<h3>${earthquakeData[i].properties.place}</h3><hr><p>${new Date(earthquakeData[i].properties.time)}</p>`)
    )
  }

  var earthquakes = L.layerGroup(markers)

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);



  // Create a legend for the map
  // var legend = L.control({
  //   position: "bottomright",
  //   fillColor: "white",
  //   title: "Earthquake Depth",
  //   collapsed: false
  //   // legend: [{
  //   //   labels: ["<10", "10-30", "30-50", "50-70", "70-90", "90+"
  //   })]
  // })
      



  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.

  // for (var i = 0; i < earthquakes.length; i++) {

  //   // Conditionals for country gdp_pc
  //   var color = "";
  //   if (earthquakes[i].geometry.coordinates[2] > 100000) {
  //     color = "yellow";
  //   }
  //   else if (countries[i].geometry.coordinates[2] > 75000) {
  //     color = "blue";
  //   }
  //   else if (countries[i].geometry.coordinates[2] > 50000) {
  //     color = "green";
  //   }
  //   else {
  //     color = "violet";
  //   }
  
  //   // Add circles to the map.
  //   L.circle(earthquakes[i].location, {
  //     fillOpacity: 0.75,
  //     color: "white",
  //     fillColor: color,
  //     // Adjust the radius.
  //     radius: Math.sqrt(earthquakes[i].gdp_pc) * 500
  //   }).bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`).addTo(myMap);
  // }


  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });


}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  function legnedColors(depth){
    if (depth < 10){
      color = "#77FF33"
    }
    else if (depth < 30){
      color = "#33FF35"
    }
    else if (depth < 50) {
      color = "#FFE033"
    }
    else if (depth < 70) {
      color = "#FF8E33"
    }
    else if (depth < 90) {
      color = "#FF7133"
    }
    else {
      color = "#FF4A33"
    }
  }

  var legend = L.control({
    position: "bottomright",
    fillcolor: "white", 
    collapsed: false, 
    title: "Earthquake Depth"
  });

}

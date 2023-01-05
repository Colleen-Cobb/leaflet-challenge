//   // Create the base layers.
//   var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//   })

//   var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
//     attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
//   });

//   // Create a baseMaps object.
//   var baseMaps = {
//     "Street Map": street,
//     "Topographic Map": topo
//   };

//   // Create an overlay object to hold our overlay.
//   var overlayMaps = {
//     Earthquakes: earthquakes
//   };

//   // Create our map, giving it the streetmap and earthquakes layers to display on load.
//   var myMap = L.map("map", {
//     center: [
//       37.09, -95.71
//     ],
//     zoom: 5,
//     layers: [street, earthquakes]
//   });

//   // Create a layer control.
//   // Pass it our baseMaps and overlayMaps.
//   // Add the layer control to the map.
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(myMap);

//   var info = L.control({
//     position: "bottomright",
//     fillcolor: "white", 
//     collapsed: false, 
//     title: "Earthquake Depth"
//   });

//   // When the layer control is added, insert a div with the class of "legend".
//   info.onAdd = function() {
//     var div = L.DomUtil.create("div", "legend");
//     return div;
// };
// // Add the info legend to the map.
//   info.addTo(map);


// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2022-11-01&endtime=2022-12-02&maxlongitude=180&minlongitude=-180&maxlatitude=90&minlatitude=-90";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function(data) {
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
    // var color = "";
    // if (depth < 10){
    //   color = "#77FF33"
    // }
    // else if (depth < 30){
    //   color = "#33FF35"
    // }
    // else if (depth < 50) {
    //   color = "#FFE033"
    // }
    // else if (depth < 70) {
    //   color = "#FF8E33"
    // }
    // else if (depth < 90) {
    //   color = "#FF7133"
    // }
    // else {
    //   color = "#FF4A33"
    // }
    function chooseColor(depth) {
      if (depth == "<10") return "yellow";
      else if (depth <30) return "red";
      else if (depth < 50) return "orange";
      else if (depth <70) return "green";
      else if (depth <90) return "purple";
      else return "black";
    }

    markers.push(
      L.circle(cord, {
        collapsed: false, 
        fillOpacity: 0.75, 
        color: "white",
        fillColor: chooseColor(earthquakeData[i].geometry.coordinates[2]), 
      }).bindPopup(`<h3>${earthquakeData[i].properties.place}</h3><hr><p>${new Date(earthquakeData[i].properties.time)}</p>`)
    )
  }

  var earthquakes = L.layerGroup(markers)

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);


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

//   var legend = L.control({
//     position: "bottomright",
//     fillcolor: "white", 
//     collapsed: false, 
//     title: "Earthquake Depth"
//   });

//   legend.onAdd = function() {
//     var div = L.DomUtil.create("div", "legend");
//     var depth = [9, 29, 49, 69, 89, 500];
//     var labels = ["<10", "10-30", "30-50", "50-70", "70-90", "90+"];
 
//   }
//   return div; 
// };
// legend.addTo(myMap);
}

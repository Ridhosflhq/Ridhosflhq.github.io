---
title:  "Advanced examples"
mathjax: true
layout: post
categories: media
---

![Peta_2](https://github.com/user-attachments/assets/d5644ae2-e76d-4fff-b83e-82d79c089d30)


## Introduction

In today's digital era, web-based mapping applications play a crucial role in navigation, transportation, and urban planning. With the power of Web GIS (Geographic Information Systems), users can interact with maps, find optimal routes, and visualize spatial data dynamically.

This project focuses on creating an interactive route navigation system using [Leaflet.js](https://leafletjs.com/), a powerful yet lightweight JavaScript library for web mapping. The system allows users to add multiple waypoints, drag markers to adjust routes, and view detailed step-by-step directions through a fixed-size legend with a scrollbar.

## Project Setup

To build this **Web GIS Route Planner**, the following tools and technologies are required:  

1. **HTML, CSS, and JavaScript** – For structuring, styling, and scripting the web application.  
2. **[Leaflet.js](https://leafletjs.com/)** – A lightweight JavaScript library for interactive maps.  
3. **[Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/)** – A plugin for route calculation and navigation.  
4. **[OpenStreetMap (OSM)](https://www.openstreetmap.org/)** – A free and open-source map data provider.  
5. **[Notepad++](https://notepad-plus-plus.org/)** – A lightweight and powerful code editor for writing and editing code.  
7. **Git & GitHub** – For version control and hosting on GitHub Pages.  

Once these tools are ready, the next step is to **set up the project structure** and start coding the interactive Web GIS! 🚀  

## Building Map

This section explains the key scripts used to build the **Web GIS Route Planner** with **Leaflet.js** and **Leaflet Routing Machine**.  

### Initializing the Map  
The map is initialized using **Leaflet.js**, with OpenStreetMap (OSM) as the base layer.  

```js
var map = L.map('map').setView([-7.7261, 109.9072], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
```
### **Adding Waypoints (Start & Destination Points)** 
Users can click on the map to add multiple waypoints for route navigation.
```js
map.on('click', function(e) {
    var newLatLng = L.latLng(e.latlng.lat, e.latlng.lng);
    waypoints.push(newLatLng);
    drawRoute();
});
```
* Each click adds a new waypoint to the `waypoints` array.
* The `drawRoute()` function is called to update the navigation path.

### **Generating the Route** 
The Leaflet Routing Machine is used to calculate and draw the route.
```js
function drawRoute() {
    if (routeControl) {
        map.removeControl(routeControl);
    }
    routeControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        createMarker: function(i, waypoint, n) {
            var marker = L.marker(waypoint.latLng, { draggable: true });
            // Event: Update waypoint when marker is dragged
            marker.on('dragend', function(event) {
                waypoints[i] = event.target.getLatLng();
                drawRoute();
            });
            markers[i] = marker;
            return marker;
        }
    }).addTo(map);
    routeControl.on('routesfound', function(e) {
        updateDirectionLegend(e.routes[0].instructions);
    });
}
```
* Removes the previous route before drawing a new one.
* Uses waypoints to create the navigation path.
* Markers are draggable, allowing users to adjust waypoints dynamically.
* Calls updateDirectionLegend() to display step-by-step navigation instructions.

### **Displaying Directions in the Legend** 
The fixed-size legend provides turn-by-turn directions for the calculated route.
```js
function updateDirectionLegend(instructions) {
    var directionContent = document.getElementById("direction-content");
    directionContent.innerHTML = "<strong>Navigation Steps:</strong><br><br>";
    instructions.forEach((instruksi, index) => {
        directionContent.innerHTML += (index + 1) + ". " + instruksi.text + " (" + instruksi.distance.toFixed(0) + " m)<br>";
    });
}
```
* Extracts step-by-step instructions from the routing engine.
* Each instruction displays turn direction and distance to the next point.
* The legend has a scrollbar if the instructions exceed the fixed height.

### ** Managing Waypoints** 

#### Removing the Last Point
```js
document.getElementById("hapusTitikTerakhir").addEventListener("click", function() {
    if (waypoints.length > 0) {
        waypoints.pop();
        markers.pop().remove(); // Remove the last marker
        drawRoute();
    }
});
```
* Removes the last waypoint and updates the route.
* The last marker is also removed from the map.

#### Clearing All Waypoints
```js
document.getElementById("hapusSemuaTitik").addEventListener("click", function() {
    waypoints = [];
    markers.forEach(marker => marker.remove()); // Remove all markers
    markers = [];
    if (routeControl) {
        map.removeControl(routeControl);
    }
    document.getElementById("direction-content").innerHTML = "Klik di peta untuk menambahkan titik rute.";
});
```
* Clears all waypoints, markers, and directions.
* Resets the legend to its initial state.

## Summary
This **Web GIS Route Planner** enables users to create, modify, and navigate routes dynamically using **Leaflet.js** and **Leaflet Routing Machine**. With features like **draggable waypoints**, **real-time route updates**, and a **fixed-size direction legend**, this project serves as a practical tool for route planning.  

### **Try the Live Navigation Map:**  
**[Live Demo](https://ridhosflhq.github.io/Peta_2/)**  

Happy mapping! 🗺️ 

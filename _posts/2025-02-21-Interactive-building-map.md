---
title:  "Interactive Web Map"
mathjax: true
layout: post
categories: media
---

<img src="https://github.com/user-attachments/assets/2972d23c-f321-4374-8f5c-e778d1806b63" alt="Interactive Web Map" style="width: 75%; display: block; margin: 0 auto;">

## Introduction

An interactive **Web GIS** that brings **Kutoarjo's building data to life** using **Overpass Turbo** and **Leaflet.js**. By leveraging OpenStreetMap (OSM), this project extracts and visualizes building footprints, offering a **real-time, web-based mapping experience**. 

This project focuses on creating an interactive building map using [Leaflet.js](https://leafletjs.com/), for rendering interactive web maps, **Overpass Turbo** for querying OSM data, and storing data using **GeoJSON format**.

## Project Setup

Designed for **efficiency and flexibility**, this project is built using:  

* **Overpass Turbo** – Extracts real-time building data from OSM.  
* **Notepad++** – A lightweight yet powerful editor for writing scripts.  
* **Leaflet.js** – Brings interactivity to the map with smooth rendering.  
* **GeoJSON** – Stores and processes spatial data effortlessly.  
* **HTML, CSS, JavaScript** – Powers the frontend for seamless user interaction.  
* **Git & GitHub** – Ensures version control and easy deployment.

## Building Map
An interactive **Web GIS** powered by **Leaflet.js** visualizes **building data in Kutoarjo**, extracted from **Overpass Turbo** in **GeoJSON format**. The system features **multiple basemaps, dynamic color-coded buildings, and real-time interaction**
### Extracting OSM Building Data  
Building data is retrieved using **Overpass Turbo**, executing a structured query to extract **building footprints** within Kutoarjo:  
```js
[out:json][timeout:60];
{{geocodeArea:Kutoarjo}}->.searchArea;
(
  way["building"](area.searchArea);
  relation["building"](area.searchArea);
);
out body;
>;
```
This query efficiently fetches all buildings within Kutoarjo and prepares them for visualization.

### Initializing the Map 
```js
var map = L.map('map').setView([-7.7261064987525225, 109.90718982884927], 15);
```
Centers the map at Kutoarjo with a zoom level of 15.

### Adding Basemaps
The Leaflet Routing Machine is used to calculate and draw the route.
```js
var basemaps = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {...}),
    "Google Satellite": L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {...}),
    "CartoDB Dark": L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {...})
};
basemaps["OpenStreetMap"].addTo(map);
L.control.layers(basemaps).addTo(map);
```
Enables multiple basemaps, allowing users to switch between `OSM`, `Google`, and `CartoDB styles`.

### Adding a Movable Center Marker
Adds a draggable marker that serves as the reference point for distance-based coloring.
```js
var centerMarker = L.marker([-7.7261064987525225, 109.90718982884927], { draggable: true }).addTo(map);
centerMarker.bindPopup("Titik Pusat (Geser atau Klik di Peta)").openPopup();
var centerCoords = centerMarker.getLatLng();
```

### Colorizing Buildings Based on Distance 
Assigns colors to buildings based on their distance from the center marker.
```js
function getColor(distance) {
    return distance < 200 ? "#00FF00" :   // Green  (< 200m)
           distance < 250 ? "#FFFF00" :   // Yellow (200m - 250m)
           distance < 500 ? "#FFA500" :   // Orange (250m - 500m)
                           "#FF0000";     // Red    (> 500m)
}

```


### Loading & Styling Building Data
```js
fetch('file.geojson')    //local file geojson
    .then(response => response.json())
    .then(data => {
        geojsonLayer = L.geoJSON(data, {
            style: function (feature) {
                var coords = feature.geometry.coordinates[0][0];
                var buildingCoords = L.latLng(coords[1], coords[0]);
                var distance = map.distance(buildingCoords, centerCoords);
                return { fillColor: getColor(distance), color: "#000000", weight: 1, fillOpacity: 0.6 };
            },
            onEachFeature: function (feature, layer) {
                var coords = feature.geometry.coordinates[0][0];
                var buildingCoords = L.latLng(coords[1], coords[0]);
                var distance = Math.round(map.distance(buildingCoords, centerCoords));
                layer.bindPopup("Bangunan<br>Jarak: " + distance + " m");
            }
        }).addTo(map);
    });
```
Loads buildings from a GeoJSON file, applies distance-based color coding, and displays interactive popups.

### Updating the Map on User Interaction
```js
centerMarker.on('dragend', function () {
    centerCoords = centerMarker.getLatLng();
    loadGeoJSON();
});

map.on('click', function (e) {
    centerCoords = e.latlng;
    centerMarker.setLatLng(e.latlng);
    loadGeoJSON();
});
```
Automatically updates building colors when the center marker is moved or the map is clicked.

## Summary
This project delivers an **interactive Web GIS** that visualizes **building data in Kutoarjo** using **Overpass Turbo** and **Leaflet.js**. By extracting real-time **OpenStreetMap (OSM) data**, it provides a **dynamic, user-friendly mapping experience** with **color-coded buildings, basemap switching, and real-time interaction**.  

### **Try the Live Building Map:**  
**[Live Demo](https://ridhosflhq.github.io/Peta_1/)**  

Happy mapping! 🗺️ 

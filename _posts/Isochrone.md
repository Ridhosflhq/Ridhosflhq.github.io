---
title:  "Isochrone WebGIS: Travel Distance Visualized"
mathjax: true
layout: post
categories: media
---

<img src="https://github.com/user-attachments/assets/374d74e1-3f23-4123-ad68-1d9224a4f9db" alt="Interactive Web Map" style="width: 75%; display: block; margin: 0 auto;">

## Introduction

This WebGIS visualizes travel reach using the [Mapbox Isochrone API](https://docs.mapbox.com/api/navigation/). Users select a transport mode and travel time to generate dynamic isochrone maps.  

Built with [Leaflet.js](https://leafletjs.com/), [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/), and standard web technologies ([HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS), [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)), it provides an interactive experience.  

The system requests an **isochrone polygon** via API, processes the response in [GeoJSON](https://geojson.org/), and visualizes travel zones with adaptive color coding.

## Project Setup 
Designed for efficiency and flexibility, this project is built using:  

* **[Leaflet.js](https://leafletjs.com/)** – Enables interactivity and map rendering.  
* **[Mapbox Isochrone API](https://docs.mapbox.com/api/navigation/#isochrone)** – Generates travel reach polygons based on time and transport mode.  
* **[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)** – Provides high-performance map visualization.  
* **[HTML, CSS, JavaScript](https://developer.mozilla.org/en-US/docs/Web/)** – Powers the frontend for seamless user experience.  
* **[GeoJSON](https://geojson.org/)** – Stores and processes isochrone polygon data dynamically.  

## Building the Map  

Bringing the WebGIS to life starts with a simple map, a marker, and an API call. Follow these steps to create an interactive travel reach visualization.  

### 1. Initialize the Map  

Everything begins with a map. Centered at [Alun-Alun Kutoarjo](https://maps.app.goo.gl/Qnty4y8dqhD3WZej8), this Leaflet-powered map lays the foundation.  

```js
var map = L.map('map').setView([-7.719891, 109.914573], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
```
A clean, interactive canvas—ready for exploration.

### 2. Add a Marker for the Starting Point
A journey needs a starting point. The marker stands firm at the heart of Kutoarjo, waiting for user input.
```js
var marker = L.marker([-7.719891, 109.914573]).addTo(map);
```
No dragging, no shifting—this is the reference for all calculations. [Here why](https://docs.mapbox.com/api/navigation/isochrone/#isochrone-api-restrictions-and-limits)

### 3. Fetch Isochrone Data from Mapbox API
Now, the real magic happens. With a single request, Mapbox returns a polygon showing just how far one can travel in a given time.
```js
async function getIsochrone(mode, minutes) {
    let url = `https://api.mapbox.com/isochrone/v1/mapbox/${mode}/109.914573,-7.719891?contours_minutes=${minutes}&access_token=YOUR_MAPBOX_ACCESS_TOKEN`;
    let response = await fetch(url);
    let data = await response.json();
    return data;
}
```
With this, distance transforms into data—structured, dynamic, and ready for visualization.

### 4. Display the Isochrone on the Map
A raw dataset is useful, but a visual representation makes it powerful. Here, the isochrone polygon takes shape, overlaying the map with smooth color-coded zones.
```js
function displayIsochrone(geojsonData) {
    L.geoJSON(geojsonData, {
        style: function () {
            return { color: "#007bff", weight: 2, fillOpacity: 0.4 };
        }
    }).addTo(map);
}
```
Just like that, travel reach appears—clear, structured, and interactive.

### 5. Handle User Selection
Walking or driving? 5 minutes or 30? The user decides, and the map responds instantly.
```js
document.getElementById("generate").addEventListener("click", async function() {
    let mode = document.getElementById("mode").value;
    let minutes = document.getElementById("time").value;
    let isochroneData = await getIsochrone(mode, minutes);
    displayIsochrone(isochroneData);
});
```
A single click—and the world shifts. The isochrone updates, dynamically reflecting new choices.

## Summary
This WebGIS project visualizes travel reachability using **Mapbox Isochrone API** and **Leaflet.js**. Centered at **Alun-Alun Kutoarjo**, users can select **walking or driving modes** and adjust travel time to see how far they can go. The map dynamically updates with an **isochrone polygon**, showing reachable areas in real-time. Built with **HTML, CSS, JavaScript, and Flask**, the project ensures an interactive and responsive experience. Designed for accessibility analysis, it helps users understand **distance in time** with a clear, visual approach.

### **Try the Live Building Map:**  
**[Live Demo](https://ridhosflhq.github.io/Peta_4/)**  

Happy mapping! 🗺️ 

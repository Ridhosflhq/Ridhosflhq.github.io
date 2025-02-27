---
title:  "Simple IndoGuessr: Guess the City from Satellite Images!"
mathjax: true
layout: post
categories: media
---

<img src="https://github.com/user-attachments/assets/0325e647-bd99-48d5-b7f4-3d5f0748315c" alt="Interactive Web Map" style="width: 75%; display: block; margin: 0 auto;">

## Introduction

An interactive Web GIS game that challenges players to guess Indonesian cities using satellite imagery. Built with [Leaflet.js](https://leafletjs.com/), this project dynamically selects cities and presents a fixed satellite view, requiring players to identify the location.

This project ensures a controlled and immersive experience by locking map interactions while maintaining randomized city selection, scoring, and accuracy tracking.

## Project Setup

Designed for efficiency and flexibility, this project is built using:

* **Leaflet.js** – Brings interactivity and map rendering.
* **HTML, CSS, JavaScript** – Powers the frontend for seamless gameplay.
* **GeoJSON** – Stores city coordinates and landmarks dynamically.
* **Notepad++** – A lightweight yet powerful code editor.
* **Git & GitHub** – Ensures version control and easy deployment.

## Building Map
This project creates an interactive GeoGuessr-style map using **Leaflet.js**, where users guess cities based on satellite imagery. The script ensures a random city appears each round and tracks scores.


This query efficiently fetches all buildings within Kutoarjo and prepares them for visualization.

### Initialize Map
The map is initialized with a random city at zoom level 15, ensuring a static view:
```js
function initMap() {
    randomCity = getNextCity();
    actualLat = randomCity.lat + getRandomOffset();
    actualLon = randomCity.lon + getRandomOffset();
    if (map) {
        map.setView([actualLat, actualLon], 15);
    } else {
        map = L.map('map', { zoomControl: false, dragging: false, scrollWheelZoom: false })
            .setView([actualLat, actualLon], 15);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; Esri'
        }).addTo(map);
    }
}
```

### Answer Check & Score Update
When users guess, the system compares input with the correct city and updates the score accordingly.
```js
function checkAnswer() {
    var userGuess = document.getElementById("guess").value.trim().toLowerCase();
    var correctCity = randomCity.name.toLowerCase();

    if (userGuess === correctCity) {
        document.getElementById("result").innerHTML = "✅ Benar! Ini adalah kota " + randomCity.name;
        score += 10;
        correctAnswers++;
    } else {
        document.getElementById("result").innerHTML = "❌ Salah! Ini adalah " + randomCity.name;
        score -= 5;
        wrongAnswers++;
    }
    updateStats();
    document.getElementById("nextBtn").style.display = "inline";
    map.setView([randomCity.lat, randomCity.lon], 13); // Zoom out after answer
}
```

### Next Round (New City)
The game selects a new random city, ensuring it's not the same as the previous round:
```js
function nextRound() {
    document.getElementById("result").innerHTML = "";
    document.getElementById("guess").value = "";
    document.getElementById("nextBtn").style.display = "none";
    initMap(); // Selects new city
}
```

## Summary
**Simple IndoGuessr** is a lightweight Web GIS game built with **HTML, JavaScript, and Leaflet.js**. Players guess Indonesian cities based on satellite imagery, with randomized locations ensuring variation. The game features **score tracking, accuracy percentage, and non-repetitive city selection**, dynamically adjusting the map zoom after each round for an engaging experience. 

### **Try the Live Building Map:**  
**[Live Demo](https://ridhosflhq.github.io/Peta_3/)**  

Happy mapping! 🗺️ 

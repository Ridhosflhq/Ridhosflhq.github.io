// Tambahkan basemap Esri
const map = L.map('map').setView([-6.220483917275577, 106.60468594322326], 18);

const streetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    maxZoom: 19
}).addTo(map);

const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    maxZoom: 19
});

const baseMaps = {
    "Peta Jalan": streetMap,
    "Peta Satelit": satelliteMap
};

L.control.layers(baseMaps).addTo(map);

L.control.browserPrint({
    title: 'Cetak Peta',
    documentTitle: 'Peta Bangunan',
    printModes: [
        L.BrowserPrint.Mode.Landscape("Landscape", "A4"),
        L.BrowserPrint.Mode.Custom("Custom", "A4")
    ],
    manualMode: false
}).addTo(map);

let geojsonLayer;
let highlightLayer = L.geoJSON(null, {
    style: {
        color: '#ff0000',
        weight: 2,
        fillOpacity: 0
    }
}).addTo(map);

let selectedFeatures = [];
let totalBuildings = 0;
let bufferLayer = L.layerGroup().addTo(map);
let drawnItems = new L.FeatureGroup().addTo(map);
let lastDrawnShape = null; // Menyimpan bentuk terakhir

// Layer untuk highlight merah
let redHighlightLayer = L.geoJSON(null, {
    style: {
        color: '#ff0000',
        weight: 3,
        fillOpacity: 0.2
    }
}).addTo(map);

//  Ambil data GeoJSON
fetch('bangunan.geojson')
    .then(response => response.json())
    .then(data => {
        totalBuildings = data.features.length;
        document.getElementById('totalBuildings').textContent = totalBuildings;

        geojsonLayer = L.geoJSON(data, {
            style: {
                color: '#000',
                weight: 1,
                fillColor: '#cccccc',
                fillOpacity: 0.5
            },
            onEachFeature: (feature, layer) => {
                layer.on('mouseover', () => {
                    const properties = feature.properties;
                    let popupContent = `<b>Nama:</b> ${properties.TOPONIM || 'Tidak Ada'}<br>`;
                    popupContent += `<b>Tipe:</b> ${properties.JENIS || 'Tidak Ada'}<br>`;
                    popupContent += `<b>Jenis Bangunan:</b> ${properties.JENISBANGU || 'Tidak Ada'}`;
                    layer.bindPopup(popupContent).openPopup();
                });

                layer.on('mouseout', () => {
                    layer.closePopup();
                });
            }
        }).addTo(map);
    });

function updateSidebar() {
    const classificationList = document.getElementById('classificationList');
    classificationList.innerHTML = '';

    const detailList = document.getElementById('detailList');
    detailList.innerHTML = '';

    const jenisCounts = {};
    selectedFeatures.forEach(feature => {
        const jenis = feature.properties.JENIS || 'Lainnya';
        if (!jenisCounts[jenis]) jenisCounts[jenis] = [];
        jenisCounts[jenis].push(feature);
    });

    for (const [jenis, features] of Object.entries(jenisCounts)) {
        const li = document.createElement('li');
        li.innerHTML = `${jenis}: ${features.length}`;
        li.addEventListener('click', () => {
            highlightLayer.clearLayers();
            detailList.innerHTML = '';

            features.forEach(f => {
                L.geoJSON(f, {
                    style: {
                        color: '#000',
                        weight: 2,
                        fillOpacity: 0.5
                    }
                }).addTo(highlightLayer);

                const detailItem = document.createElement('li');
                detailItem.innerHTML = `
                    <b>Nama:</b> ${f.properties.TOPONIM || 'Tidak Ada'}<br>
                    <b>Tipe:</b> ${f.properties.JENIS || 'Tidak Ada'}<br>
                    <b>Jenis Bangunan:</b> ${f.properties.JENISBANGU || 'Tidak Ada'}
                `;

                detailItem.addEventListener('click', () => {
                    redHighlightLayer.clearLayers();
                    const redHighlight = L.geoJSON(f, {
                        style: {
                            color: '#ff0000',
                            weight: 3,
                            fillOpacity: 0.2
                        }
                    }).addTo(redHighlightLayer);

                    map.fitBounds(redHighlight.getBounds());
                });

                detailList.appendChild(detailItem);
            });
        });

        classificationList.appendChild(li);
    }

    document.getElementById('selectedCount').textContent = selectedFeatures.length;
    document.getElementById('selectedPercentage').textContent = `${((selectedFeatures.length / totalBuildings) * 100).toFixed(2)}%`;
}

//  Aktifkan fitur seleksi garis + objek lainnya
const drawControl = new L.Control.Draw({
    draw: {
        polyline: false, 
        polygon: true,
        rectangle: true,
        circle: false,
        marker: true,
        circlemarker: false
    },
    edit: {
        featureGroup: drawnItems,
        remove: true // 
    }
});

map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, (e) => {
    const layer = e.layer;

    //  Hapus hasil seleksi sebelumnya
    if (lastDrawnShape) {
        drawnItems.removeLayer(lastDrawnShape);
    }
    lastDrawnShape = layer;
    drawnItems.addLayer(layer);

    const geoJSON = layer.toGeoJSON();

    //  Seleksi fitur menggunakan Turf.js
    const selectedBuildings = [];
    geojsonLayer.eachLayer(layer => {
        if (turf.intersect(geoJSON, layer.feature)) {
            selectedBuildings.push(layer.feature);
        }
    });

    selectedFeatures = selectedBuildings;
    updateSidebar();
});

//  Perbaiki penghapusan seleksi
map.on(L.Draw.Event.DELETED, () => {
    selectedFeatures = [];
    highlightLayer.clearLayers();
    redHighlightLayer.clearLayers();
    bufferLayer.clearLayers();
    updateSidebar(); // Reset sidebar
});

//  Buffer dari hasil gambar
document.getElementById('applyBuffer').addEventListener('click', () => {
    if (!lastDrawnShape) {
        alert("Silakan gambar area terlebih dahulu sebelum membuat buffer.");
        return;
    }

    const bufferDistance = parseFloat(document.getElementById('bufferDistance').value);
    if (isNaN(bufferDistance) || bufferDistance < 0) {
        alert('Masukkan jarak buffer yang valid!');
        return;
    }

    bufferLayer.clearLayers();

    const geoJSON = lastDrawnShape.toGeoJSON();
    const buffered = turf.buffer(geoJSON, bufferDistance / 1000, { units: 'kilometers' });

    L.geoJSON(buffered, {
        style: {
            color: '#00ff00',
            weight: 2,
            fillOpacity: 0.2
        }
    }).addTo(bufferLayer);
});

//  Hapus buffer
document.getElementById('clearBuffer').addEventListener('click', () => {
    bufferLayer.clearLayers(); // Hapus layer buffer dari peta
    selectedFeatures = []; // Hapus hasil seleksi buffer
    updateSidebar();
});

//  Fungsi untuk mencetak konten yang dipilih
function generateSelectedContentHTML() {
    let html = `
        <h2>Daftar Bangunan Terpilih</h2>
        <ul>
    `;

    selectedFeatures.forEach((feature, index) => {
        html += `
            <li>
                ${index + 1}. ${feature.properties.TOPONIM || 'Tidak Ada'} - 
                ${feature.properties.JENIS || 'Tidak Ada'}
            </li>
        `;
    });

    html += `</ul>`;
    return html;
}

document.getElementById('printSelectedContent').addEventListener('click', () => {
    const content = generateSelectedContentHTML();
    printJS({
        printable: content,
        type: 'raw-html'
    });
});

//  Bersihkan highlight saat klik di peta
map.on('click', () => {
    highlightLayer.clearLayers();
});

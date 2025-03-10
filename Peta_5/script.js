// ✅ Tambahkan basemap Esri
const map = L.map('map').setView([-6.2, 106.8], 14);

const streetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    maxZoom: 19
}).addTo(map);

const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
    maxZoom: 19
});

// ✅ Tambahkan kontrol layer untuk memilih basemap
const baseMaps = {
    "Peta Jalan": streetMap,
    "Peta Satelit": satelliteMap
};

L.control.layers(baseMaps).addTo(map);

let geojsonLayer;
let highlightLayer = L.geoJSON(null, {
    style: {
        color: '#ff0000', // Garis merah untuk highlight klasifikasi
        weight: 2,
        fillOpacity: 0
    }
}).addTo(map);

let selectedFeatures = [];
let totalBuildings = 0;

// ✅ Ambil data GeoJSON
fetch('bangunan.geojson')
    .then(response => response.json())
    .then(data => {
        totalBuildings = data.features.length;
        document.getElementById('totalBuildings').textContent = totalBuildings;

        // Tambahkan layer utama
        geojsonLayer = L.geoJSON(data, {
            style: {
                color: '#000', // Garis hitam untuk tampilan awal
                weight: 1,
                fillColor: '#cccccc',
                fillOpacity: 0.5
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

        // ✅ Klik untuk highlight dan zoom semua bangunan pada klasifikasi
        li.addEventListener('click', () => {
            highlightLayer.clearLayers();

            features.forEach(f => {
                L.geoJSON(f, {
                    style: {
                        color: '#ff0000', // Garis merah untuk highlight
                        weight: 2,
                        fillOpacity: 0.1
                    }
                }).addTo(highlightLayer);
            });

            const bounds = L.latLngBounds(features.map(f => {
                const layer = L.geoJSON(f);
                return layer.getBounds();
            }));
            map.fitBounds(bounds);

            detailList.innerHTML = '';
            features.forEach(f => {
                const detailItem = document.createElement('li');
                detailItem.textContent = f.properties.TOPONIM || 'Tidak Diketahui';

                // ✅ Klik untuk highlight spesifik toponim
                detailItem.addEventListener('click', () => {
                    highlightLayer.clearLayers();

                    const layer = L.geoJSON(f, {
                        style: {
                            color: '#ff0000', // Warna merah untuk highlight
                            weight: 2,
                            fillColor: '#ffff00', // Warna kuning untuk isian
                            fillOpacity: 0.6
                        }
                    }).addTo(highlightLayer);

                    map.fitBounds(layer.getBounds());
                });

                detailList.appendChild(detailItem);
            });
        });

        classificationList.appendChild(li);
    }

    // ✅ Perbarui statistik umum
    document.getElementById('selectedCount').textContent = selectedFeatures.length;
    document.getElementById('selectedPercentage').textContent = `${((selectedFeatures.length / totalBuildings) * 100).toFixed(2)}%`;
}

// ✅ Seleksi dengan Leaflet Draw
const drawnItems = new L.FeatureGroup().addTo(map);

const drawControl = new L.Control.Draw({
    draw: {
        polyline: false,
        marker: false,
        circle: false,
        circlemarker: false,
        rectangle: true, // ❌ Hapus seleksi kotak
        polygon: true // ✅ Tetap gunakan seleksi bentuk bebas
    },
    edit: {
        featureGroup: drawnItems
    }
});

map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, (e) => {
    drawnItems.clearLayers();
    drawnItems.addLayer(e.layer);

    selectedFeatures = [];
    geojsonLayer.eachLayer(layer => {
        if (e.layer.getBounds().intersects(layer.getBounds())) {
            selectedFeatures.push(layer.feature);
        }
    });

    updateSidebar();
});

// ✅ Reset highlight saat peta diklik
map.on('click', () => {
    highlightLayer.clearLayers();
});

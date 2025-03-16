// Inisialisasi peta
const map = L.map('map').setView([-7.486121, 110.222775], 15); // Fokus ke titik pertama

// Tambahkan layer peta dasar dari OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// URL file GeoJSON dari Google Drive (gunakan ID dari link)
const geojsonUrl = 'https://drive.google.com/uc?id=1KGgEiJmVXl71rPfd7Dqh8hjDwSaEd2Hr';

// Ambil data GeoJSON dari Google Drive dan tambahkan ke peta
fetch(geojsonUrl)
  .then(response => response.json())
  .then(data => {
    // Tambahkan data GeoJSON ke peta dengan simbol dot
    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 5, // Ukuran dot
          fillColor: '#ff5733', // Warna dot
          color: '#ffffff', // Warna border dot
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(`
          <b>Kelurahan:</b> ${feature.properties.kelurahan || 'Tidak Ada'}<br>
          <b>Jumlah Penduduk:</b> ${feature.properties.Jumlah || 'Tidak Ada'}
        `);
      }
    }).addTo(map);
  })
  .catch(error => console.error('Error loading GeoJSON:', error));

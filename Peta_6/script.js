// Inisialisasi peta
const map = L.map('map').setView([-7.479734, 110.217711], 13); // Koordinat Kota Magelang

// Tambahkan layer peta dasar dari OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// URL file GeoJSON dari Google Drive (ubah ID sesuai dengan file kamu)
const geojsonUrl = 'https://drive.google.com/uc?id=1KGgEiJmVXl71rPfd7Dqh8hjDwSaEd2Hr';

// Ambil data GeoJSON dari Google Drive dan tambahkan ke peta
fetch(geojsonUrl)
  .then(response => response.json())
  .then(data => {
    // Tambahkan data GeoJSON ke peta dengan simbol dot
    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 4, // Ukuran dot
          fillColor: '#ff5733', // Warna dot
          color: '#ffffff', // Warna border dot
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(`
          <b>Nama Kelurahan:</b> ${feature.properties.kelurahan}<br>
          <b>Jumlah Penduduk:</b> ${feature.properties.populasi}
        `);
      }
    }).addTo(map);
  })
  .catch(error => console.error('Error loading GeoJSON:', error));

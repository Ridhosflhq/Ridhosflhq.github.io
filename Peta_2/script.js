// Inisialisasi Peta
var map = L.map('map').setView([-7.7261, 109.9072], 13);

// Tambahkan Tile Layer dari OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

var waypoints = []; // Array untuk titik rute
var markers = []; // Simpan marker untuk memudahkan penghapusan
var routeControl = null; // Objek Leaflet Routing Machine

// Fungsi untuk menggambar rute
function drawRoute() {
    if (routeControl) {
        map.removeControl(routeControl);
    }

    routeControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        createMarker: function(i, waypoint, n) {
            var marker = L.marker(waypoint.latLng, { draggable: true });

            // Event: Saat marker digeser
            marker.on('dragend', function(event) {
                waypoints[i] = event.target.getLatLng(); // Update waypoint
                drawRoute(); // Perbarui rute
            });

            markers[i] = marker; // Simpan marker dalam array
            return marker;
        }
    }).addTo(map);

    routeControl.on('routesfound', function(e) {
        updateDirectionLegend(e.routes[0].instructions);
    });
}

// Menambahkan titik ke peta saat diklik
map.on('click', function(e) {
    var newLatLng = L.latLng(e.latlng.lat, e.latlng.lng);
    waypoints.push(newLatLng);
    drawRoute();
});

// Memperbarui legenda petunjuk arah
function updateDirectionLegend(instructions) {
    var directionContent = document.getElementById("direction-content");
    directionContent.innerHTML = "<strong>Petunjuk Arah:</strong><br><br>";

    instructions.forEach((instruksi, index) => {
        directionContent.innerHTML += (index + 1) + ". " + instruksi.text + " (" + instruksi.distance.toFixed(0) + " m)<br>";
    });
}

// Menghapus titik terakhir
document.getElementById("hapusTitikTerakhir").addEventListener("click", function() {
    if (waypoints.length > 0) {
        waypoints.pop();
        markers.pop().remove(); // Hapus marker terakhir
        drawRoute();
    }
});

// Menghapus semua titik
document.getElementById("hapusSemuaTitik").addEventListener("click", function() {
    waypoints = [];
    markers.forEach(marker => marker.remove()); // Hapus semua marker
    markers = [];
    if (routeControl) {
        map.removeControl(routeControl);
    }
    document.getElementById("direction-content").innerHTML = "Klik di peta untuk menambahkan titik rute.";
});

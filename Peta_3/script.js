// Daftar kota dengan koordinat pusat kota atau landmark utama
var cities = [
    { name: "Jakarta", lat: -6.1754, lon: 106.8272 }, // Monas
    { name: "Surabaya", lat: -7.2575, lon: 112.7521 }, // Tugu Pahlawan
    { name: "Bandung", lat: -6.9175, lon: 107.6191 }, // Alun-alun Bandung
    { name: "Medan", lat: 3.5952, lon: 98.6722 }, // Istana Maimun
    { name: "Makassar", lat: -5.1354, lon: 119.4238 }, // Pantai Losari
    { name: "Yogyakarta", lat: -7.7956, lon: 110.3695 }, // Tugu Yogyakarta
    { name: "Semarang", lat: -6.9731, lon: 110.4172 }, // Simpang Lima
    { name: "Denpasar", lat: -8.6705, lon: 115.2126 }, // Lapangan Puputan
    { name: "Palembang", lat: -2.9761, lon: 104.7754 }, // Jembatan Ampera
    { name: "Banjarmasin", lat: -3.3167, lon: 114.5900 }, // Pasar Terapung
    { name: "Pontianak", lat: -0.0226, lon: 109.3329 }, // Tugu Khatulistiwa
    { name: "Manado", lat: 1.4748, lon: 124.8428 }, // Patung Yesus Memberkati
    { name: "Padang", lat: -0.9492, lon: 100.3543 }, // Jam Gadang (Bukittinggi)
    { name: "Pekanbaru", lat: 0.5071, lon: 101.4478 }, // Masjid Agung An-Nur
    { name: "Balikpapan", lat: -1.2429, lon: 116.8510 } // Pantai Kemala
];

var map;
var randomCity;
var actualLat, actualLon;
var score = 0;
var correctAnswers = 0;
var wrongAnswers = 0;
var lastCityIndex = -1; // Menyimpan index kota sebelumnya

// Fungsi untuk memilih kota yang tidak sama dengan sebelumnya
function getNextCity() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * cities.length);
    } while (newIndex === lastCityIndex);

    lastCityIndex = newIndex;
    return cities[newIndex];
}

// Fungsi untuk memvariasikan koordinat dalam radius kecil
function getRandomOffset() {
    return (Math.random() - 0.5) * 0.005; // Variasi sekitar ±500 meter
}

// Inisialisasi peta dengan kota acak
function initMap() {
    randomCity = getNextCity();

    actualLat = randomCity.lat + getRandomOffset();
    actualLon = randomCity.lon + getRandomOffset();

    if (map) {
        map.setView([actualLat, actualLon], 15);
    } else {
        map = L.map('map', { zoomControl: false, dragging: false, scrollWheelZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: false, tap: false, touchZoom: false })
            .setView([actualLat, actualLon], 15);

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; Esri'
        }).addTo(map);
    }
}

// Cek jawaban pengguna
function checkAnswer() {
    var userGuess = document.getElementById("guess").value.trim().toLowerCase();
    var correctCity = randomCity.name.toLowerCase();

    if (userGuess === correctCity) {
        document.getElementById("result").innerHTML = "✅ Benar! Ini adalah kota " + randomCity.name;
        score += 10; // Tambah skor jika benar
        correctAnswers++; // Tambah jumlah jawaban benar
    } else {
        document.getElementById("result").innerHTML = "❌ Salah! Ini adalah " + randomCity.name;
        score -= 5; // Kurangi skor jika salah
        wrongAnswers++; // Tambah jumlah jawaban salah
    }

    updateStats(); // Update statistik skor & akurasi
    document.getElementById("nextBtn").style.display = "inline"; // Tampilkan tombol Next
    map.setView([randomCity.lat, randomCity.lon], 13); // Zoom out untuk menampilkan keseluruhan kota
}

// Update skor & akurasi
function updateStats() {
    var totalQuestions = correctAnswers + wrongAnswers;
    var accuracy = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0;
    document.getElementById("score").innerText = "Skor: " + score;
    document.getElementById("accuracy").innerText = `Benar: ${correctAnswers} | Salah: ${wrongAnswers} | Akurasi: ${accuracy}%`;
}

// Ganti ke kota baru
function nextRound() {
    document.getElementById("result").innerHTML = "";
    document.getElementById("guess").value = "";
    document.getElementById("nextBtn").style.display = "none"; // Sembunyikan tombol Next

    initMap(); // Pilih kota baru
}

// Jalankan pertama kali
initMap();

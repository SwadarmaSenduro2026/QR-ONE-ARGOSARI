/* =========================================================
   DATA QR-ONE ARGOSARI
   Edit data di file ini untuk mengganti destinasi, koordinat,
   deskripsi, link, dan kontak tanpa mengubah HTML/CSS.
========================================================= */

const SITE_CONFIG = {
  village: "Desa Argosari, Senduro, Lumajang",
  mapCenter: [-7.9902666, 113.013113],
  mapZoom: 13,
  whatsappNumber: "6282139497797",
  whatsappMessage: "Halo Admin QR-ONE Argosari, saya ingin bertanya tentang informasi wisata Desa Argosari.",
  tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

const CATEGORIES = [
  { id: "semua", label: "Semua", icon: "🌐" },
  { id: "wisata", label: "Wisata Alam", icon: "⛰️" },
  { id: "budaya", label: "Budaya & Desa", icon: "🏘️" },
  { id: "layanan", label: "Layanan", icon: "🏡" },
  { id: "fasilitas", label: "Fasilitas", icon: "🚻" },
  { id: "informasi", label: "Informasi", icon: "ℹ️" }
];

const DESTINATIONS = [
  {
    id: "b29",
    title: "Puncak B29 / Negeri di Atas Awan",
    category: "wisata",
    icon: "⛰️",
    image: "assets/wisata-b29.svg",
    lat: -7.959141,
    lng: 112.994822,
    status: "Destinasi Prioritas",
    summary: "Ikon wisata Argosari untuk menikmati sunrise, lautan awan, dan panorama pegunungan.",
    description: "Puncak B29 merupakan daya tarik utama yang sering dicari wisatawan saat berkunjung ke Argosari. Halaman ini dapat digunakan untuk menampilkan informasi rute, waktu terbaik berkunjung, fasilitas sekitar, serta imbauan keselamatan. Narasi dapat diperbarui setelah survei lapangan agar lebih akurat.",
    address: "Kawasan Desa Argosari, Kecamatan Senduro, Kabupaten Lumajang.",
    bestTime: "Pagi hari sebelum matahari terbit, terutama saat cuaca cerah.",
    facilities: ["Spot foto", "Area pandang", "Akses ojek wisata", "Warung sekitar kawasan", "Rute Google Maps"],
    tips: ["Datang lebih awal jika ingin mengejar sunrise.", "Gunakan jaket karena suhu dataran tinggi cenderung dingin.", "Pastikan kendaraan dan kondisi badan siap untuk rute menanjak.", "Ikuti arahan warga atau pengelola setempat."],
    verified: true
  },
  {
    id: "spot-sunrise",
    title: "Spot Foto & Sunrise Argosari",
    category: "wisata",
    icon: "🌄",
    image: "assets/wisata-sunrise.svg",
    lat: -7.967916,
    lng: 113.011641,
    status: "Destinasi Unggulan",
    summary: "Titik contoh untuk spot foto dan area pandang yang dapat diperbarui sesuai hasil survei.",
    description: "Bagian ini disiapkan untuk menampung daftar spot foto, titik pandang sunrise, dan informasi waktu terbaik. Jika nanti ada beberapa titik, data dapat dibuat menjadi beberapa marker berbeda pada file data.js.",
    address: "Koordinat sementara sekitar kawasan wisata Argosari. Perlu validasi lapangan.",
    bestTime: "Pagi hari dan sore hari saat pencahayaan bagus untuk foto.",
    facilities: ["Spot foto", "Pemandangan pegunungan", "Area pandang", "Informasi rute"],
    tips: ["Jangan melewati batas aman saat berfoto.", "Bawa kembali sampah pribadi.", "Gunakan alas kaki yang nyaman.", "Pastikan titik koordinat diperbarui setelah survei."],
    verified: false
  },
  {
    id: "kampung-tengger",
    title: "Kampung Wisata & Budaya Tengger",
    category: "budaya",
    icon: "🏘️",
    image: "assets/wisata-kampung.svg",
    lat: -7.9902666,
    lng: 113.013113,
    status: "Informasi Desa",
    summary: "Ruang informasi tentang kehidupan warga, budaya Tengger, pertanian, dan etika berkunjung.",
    description: "Halaman ini dapat digunakan untuk memperkenalkan karakter Desa Argosari sebagai desa dataran tinggi dengan potensi alam, budaya, pertanian, dan keramahan warga. Konten dapat dilengkapi dengan sejarah desa, tradisi lokal, kalender kegiatan, serta pesan etika kunjungan.",
    address: "Pusat Desa Argosari, Senduro, Lumajang.",
    bestTime: "Sepanjang hari, terutama saat ada kegiatan desa atau paket kunjungan budaya.",
    facilities: ["Informasi desa", "Homestay warga", "Kontak pengelola", "Produk lokal"],
    tips: ["Hormati adat dan ruang privat warga.", "Minta izin sebelum mengambil foto warga atau rumah.", "Dukung ekonomi lokal dengan membeli produk warga.", "Gunakan bahasa yang sopan saat bertanya."],
    verified: true
  },
  {
    id: "homestay-ojek",
    title: "Homestay & Ojek Wisata",
    category: "layanan",
    icon: "🏡",
    image: "assets/wisata-layanan.svg",
    lat: -7.9914,
    lng: 113.0140,
    status: "Layanan Wisata",
    summary: "Informasi tempat menginap, ojek wisata, dan kontak layanan lokal pendukung kunjungan.",
    description: "Wisatawan sering membutuhkan informasi homestay dan ojek wisata sebelum datang. Halaman ini dapat diisi dengan daftar homestay, kontak pemilik, rentang harga, titik penjemputan, jam layanan, dan catatan pemesanan. Untuk sementara, pengunjung diarahkan menghubungi admin.",
    address: "Area permukiman Desa Argosari. Titik detail dapat ditambahkan per homestay atau titik ojek.",
    bestTime: "Hubungi admin sebelum datang, terutama saat akhir pekan atau musim liburan.",
    facilities: ["Homestay warga", "Ojek wisata", "Informasi pemesanan", "Kontak WhatsApp"],
    tips: ["Konfirmasi harga dan fasilitas sebelum memesan.", "Simpan nomor kontak admin/pemilik homestay.", "Tanyakan titik jemput dan kondisi rute terbaru.", "Siapkan uang tunai jika pembayaran digital belum tersedia."],
    verified: false
  },
  {
    id: "warung-umkm",
    title: "Warung, Kuliner & UMKM Wisata",
    category: "layanan",
    icon: "☕",
    image: "assets/wisata-umkm.svg",
    lat: -7.9921,
    lng: 113.0124,
    status: "Perlu Pendataan",
    summary: "Ruang promosi warung, kuliner, oleh-oleh, dan produk lokal pendukung wisata.",
    description: "Bagian ini dapat dikembangkan menjadi katalog kecil UMKM wisata Argosari. Setiap warung atau produk lokal dapat diberi foto, deskripsi, jam buka, kontak, dan titik lokasi agar wisatawan mudah menemukan layanan warga.",
    address: "Area Desa Argosari. Titik detail menunggu data UMKM/warung.",
    bestTime: "Menyesuaikan jam buka masing-masing warung atau UMKM.",
    facilities: ["Kuliner", "Oleh-oleh", "Produk lokal", "Kontak penjual"],
    tips: ["Cek jam buka sebelum datang.", "Prioritaskan membeli produk lokal untuk mendukung warga.", "Tambahkan foto produk agar katalog lebih menarik.", "Pisahkan titik lokasi per UMKM jika datanya sudah lengkap."],
    verified: false
  },
  {
    id: "Rest Area 1 B29",
    title: "Rest Area 1 B29",
    category: "fasilitas",
    icon: "🚻",
    image: "assets/wisata-fasilitas.svg",
    lat: -7.980441,
    lng: 113.022133,
    status: "Fasilitas Pendukung",
    summary: "Informasi fasilitas dasar yang sering dicari wisatawan saat berada di lapangan.",
    description: "Halaman ini disiapkan untuk menampilkan fasilitas dasar seperti parkir, toilet, mushola, pos informasi, dan titik bantuan. Agar lebih berguna, setiap fasilitas sebaiknya dipisahkan menjadi marker sendiri setelah survei lokasi dilakukan.",
    address: "Titik sementara fasilitas pendukung di sekitar pusat Desa Argosari.",
    bestTime: "Sebelum menuju destinasi utama, pastikan kebutuhan dasar sudah terpenuhi.",
    facilities: ["Parkir", "Toilet", "Mushola", "Pos informasi", "Rute lokasi"],
    tips: ["Gunakan fasilitas resmi yang direkomendasikan warga atau pengelola.", "Jaga kebersihan fasilitas umum.", "Laporkan perubahan lokasi fasilitas ke admin.", "Tambahkan foto fasilitas agar wisatawan lebih mudah mengenali lokasi."],
    verified: false
  }
];

const IMPORTANT_LINKS = [
  {
    title: "Info Ojek & Homestay",
    icon: "🏍️",
    description: "Tautan sementara untuk informasi layanan penginapan dan transportasi lokal.",
    url: "https://drive.google.com/file/d/1sqlLbXMqJCVpAdCNrxgeVhsjM_SyfOe4/view?usp=sharing"
  },
  {
    title: "Booklet Desa Argosari",
    icon: "📘",
    description: "Bahan promosi yang bisa diringkas menjadi konten website.",
    url: "https://drive.google.com/file/d/1lynH9S6S6cacOb6_g4D3ML0p147BaRYo/view?usp=sharing"
  },
  {
    title: "Instagram Desa Wisata",
    icon: "📷",
    description: "Dokumentasi visual, promosi, dan kegiatan wisata Argosari.",
    url: "https://www.instagram.com/desawisataargosari/"
  },
  {
    title: "Lokasi Argosari di Google Maps",
    icon: "📍",
    description: "Buka rute awal menuju Desa Argosari melalui Google Maps.",
    url: "https://www.google.com/maps/search/?api=1&query=Argosari,+Senduro,+Lumajang"
  }
];

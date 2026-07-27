/* =========================================================
   QR-ONE ARGOSARI — DATA WEBSITE

   FILE YANG PALING SERING DIEDIT.
   Ubah teks, koordinat, foto, nomor WhatsApp, dan tautan di sini.
========================================================= */

const SITE_CONFIG = {
  village: "Desa Argosari, Kecamatan Senduro, Kabupaten Lumajang",
  mapCenter: [-7.9825, 113.0095],
  mapZoom: 13,
  fallbackImage: "assets/photos/hero-argosari.webp",
  whatsappNumber: "6282139497797",
  whatsappMessage: "Halo Admin QR-ONE Argosari, saya ingin memperoleh informasi wisata Desa Argosari.",
  tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

const CATEGORIES = {
  wisata: "Wisata Alam",
  budaya: "Budaya & Desa",
  layanan: "Layanan Wisata",
  fasilitas: "Fasilitas"
};

const DESTINATIONS = [
  {
    id: "b29",
    title: "Puncak B29 / Negeri di Atas Awan",
    category: "wisata",
    icon: "⛰️",
    image: "assets/b29.webp",
    lat: -7.959141,
    lng: 112.994822,
    status: "Destinasi Unggulan",
    summary: "Nikmati matahari terbit, lautan awan, dan panorama pegunungan dari salah satu ikon wisata Argosari.",
    description: "Puncak B29 merupakan salah satu tujuan utama di Desa Argosari. Pengunjung dapat menikmati panorama dataran tinggi, hamparan awan, dan suasana pagi yang khas. Jalur menuju lokasi menanjak, sehingga pengunjung perlu menyiapkan kondisi fisik, kendaraan, dan perlengkapan yang sesuai.",
    address: "Kawasan Puncak B29, Desa Argosari, Kecamatan Senduro, Kabupaten Lumajang, Jawa Timur.",
    bestTime: "Sekitar pukul 04.30–08.00 WIB saat cuaca cerah.",
    facilities: ["Area pandang", "Spot foto", "Akses ojek wisata", "Warung sekitar kawasan", "Rute Google Maps"],
    tips: ["Datang lebih awal untuk menikmati matahari terbit.", "Gunakan jaket dan pakaian hangat.", "Pastikan kendaraan siap melewati jalur menanjak.", "Ikuti arahan pengelola atau warga setempat."]
  },
  {
    id: "gardu-pandang",
    title: "Gardu Pandang Argosari",
    category: "wisata",
    icon: "🌄",
    image: "assets/photos/gardu-pandang.webp",
    lat: -7.967916,
    lng: 113.011641,
    status: "Destinasi Unggulan",
    summary: "Titik pandang untuk menikmati panorama pegunungan dan suasana pagi dari dataran tinggi Argosari.",
    description: "Gardu Pandang Argosari menawarkan pemandangan perbukitan, lahan pertanian, dan pegunungan dari ketinggian. Lokasi ini cocok untuk menikmati udara pagi dan mengabadikan panorama khas Desa Argosari.",
    address: "Desa Argosari, Kecamatan Senduro, Kabupaten Lumajang, Jawa Timur.",
    bestTime: "Pukul 05.00–08.00 WIB, terutama saat cuaca cerah.",
    facilities: ["Gardu pandang", "Spot foto", "Area istirahat", "Pemandangan pegunungan"],
    tips: ["Datang lebih awal.", "Gunakan pakaian hangat.", "Gunakan alas kaki yang nyaman.", "Tetap berada di area aman saat berfoto."]
  },
  {
    id: "kampung-tengger",
    title: "Argosari Kampung Budaya Tengger",
    category: "budaya",
    icon: "🏘️",
    image: "assets/wisata budaya.webp",
    lat: -7.9902666,
    lng: 113.013113,
    status: "Wisata Budaya",
    summary: "Kenali kehidupan masyarakat, pertanian dataran tinggi, dan budaya Tengger di Desa Argosari.",
    description: "Kampung Wisata dan Budaya Tengger menghadirkan pengalaman untuk mengenal kehidupan masyarakat dataran tinggi Argosari, aktivitas pertanian, budaya lokal, dan keramahan warga.",
    address: "Pusat Desa Argosari, Kecamatan Senduro, Kabupaten Lumajang, Jawa Timur.",
    bestTime: "Pagi hingga sore hari atau menyesuaikan jadwal kegiatan budaya.",
    facilities: ["Informasi desa", "Homestay warga", "Produk lokal", "Kontak pengelola"],
    tips: ["Hormati adat dan ruang pribadi warga.", "Minta izin sebelum mengambil foto warga.", "Gunakan bahasa yang sopan.", "Dukung produk lokal."]
  },
  {
    id: "homestay-ojek",
    title: "Homestay",
    category: "layanan",
    icon: "🏡",
    image: "assets/photos/homestay-ojek.webp",
    lat: -7.9914,
    lng: 113.014,
    status: "Layanan Wisata",
    summary: "Informasi penginapan warga dan transportasi lokal untuk mendukung perjalanan di Argosari.",
    description: "Layanan homestay dan ojek wisata membantu pengunjung merencanakan kunjungan dengan lebih praktis. Hubungi pengelola untuk menanyakan ketersediaan, titik penjemputan, harga, dan pemesanan.",
    address: "Kawasan permukiman Desa Argosari, Kecamatan Senduro, Kabupaten Lumajang.",
    bestTime: "Pesan sebelum kedatangan, terutama pada akhir pekan dan musim liburan.",
    facilities: ["Homestay warga", "Ojek wisata", "Informasi pemesanan", "Kontak WhatsApp"],
    tips: ["Konfirmasi harga dan fasilitas sebelum memesan.", "Simpan nomor kontak pengelola.", "Tanyakan titik penjemputan.", "Siapkan metode pembayaran yang disepakati."]
  },
  {
    id: "umkm-kuliner",
    title: "Warung, Kuliner, dan UMKM Argosari",
    category: "layanan",
    icon: "☕",
    image: "assets/photos/umkm-kuliner.webp",
    lat: -7.9921,
    lng: 113.0124,
    status: "Produk Lokal",
    summary: "Nikmati kuliner dan temukan produk lokal yang melengkapi pengalaman berwisata di Argosari.",
    description: "Warung dan UMKM lokal menyediakan makanan, minuman, oleh-oleh, dan produk warga. Berbelanja di usaha lokal membantu mendukung perekonomian masyarakat Desa Argosari.",
    address: "Kawasan Desa Argosari, Kecamatan Senduro, Kabupaten Lumajang.",
    bestTime: "Pagi hingga sore hari, menyesuaikan jam operasional masing-masing usaha.",
    facilities: ["Makanan dan minuman", "Produk lokal", "Oleh-oleh", "Kontak penjual"],
    tips: ["Tanyakan jam buka sebelum datang.", "Siapkan uang tunai.", "Pilih produk lokal.", "Jaga kebersihan area makan."]
  },
  {
    id: "rest-area-b29",
    title: "Rest Area 1 B29",
    category: "fasilitas",
    icon: "🚻",
    image: "assets/restarea1.webp",
    lat: -7.980441,
    lng: 113.022133,
    status: "Fasilitas Pendukung",
    summary: "Titik singgah untuk beristirahat sebelum melanjutkan perjalanan menuju kawasan wisata.",
    description: "Rest Area 1 B29 menjadi titik singgah bagi pengunjung yang menuju atau kembali dari kawasan wisata. Gunakan lokasi ini untuk beristirahat dan memeriksa kesiapan perjalanan.",
    address: "Jalur menuju kawasan B29, Desa Argosari, Kecamatan Senduro, Kabupaten Lumajang.",
    bestTime: "Sebelum menuju destinasi utama atau saat membutuhkan waktu istirahat.",
    facilities: ["Area istirahat", "Parkir", "Toilet", "Tempat ibadah", "Informasi rute"],
    tips: ["Gunakan fasilitas sesuai aturan.", "Jaga barang bawaan.", "Periksa kondisi kendaraan.", "Jaga kebersihan fasilitas umum."]
  }
];

const IMPORTANT_LINKS = [
  {
    title: "Informasi Ojek dan Homestay",

    image:
      "assets/ojek.png",

    imageAlt:
      "Ilustrasi layanan ojek dan homestay Desa Argosari",

    description:
      "Akses informasi penginapan dan transportasi lokal untuk mendukung perjalanan Anda di Argosari.",

    url:
      "https://drive.google.com/file/d/1sqlLbXMqJCVpAdCNrxgeVhsjM_SyfOe4/view?usp=sharing"
  },

  {
    title: "Booklet Desa Argosari",

    image:
      "assets/booklet.png",

    imageAlt:
      "Ilustrasi booklet panduan wisata Desa Argosari",

    description:
      "Pelajari daya tarik, fasilitas, layanan, dan informasi umum Desa Argosari sebelum berkunjung.",

    url:
      "https://drive.google.com/file/d/1lynH9S6S6cacOb6_g4D3ML0p147BaRYo/view?usp=sharing"
  },

  {
    title: "Instagram Desa Wisata",

    image:
      "assets/instagram.png",

    imageAlt:
      "Ilustrasi kamera untuk Instagram Desa Wisata Argosari",

    description:
      "Lihat dokumentasi, inspirasi perjalanan, dan informasi terbaru mengenai wisata Desa Argosari.",

    url:
      "https://www.instagram.com/desawisataargosari/"
  },

  {
    title: "Rute Menuju Desa Argosari",

    image:
      "assets/rute.png",

    imageAlt:
      "Ilustrasi peta dan rute perjalanan menuju Desa Argosari",

    description:
      "Buka petunjuk perjalanan menuju Desa Argosari melalui Google Maps.",

    url:
      "https://www.google.com/maps/search/?api=1&query=Argosari,+Senduro,+Lumajang"
  }
];

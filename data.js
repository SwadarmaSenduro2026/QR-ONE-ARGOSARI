/* =========================================================
   QR-ONE ARGOSARI — DATA WEBSITE

   Edit teks, foto, koordinat, nomor WhatsApp, dan daftar tempat
   pada file ini. Struktur HTML dan JavaScript tidak perlu diubah.
========================================================= */

const SITE_CONFIG = {
  village: "Desa Argosari, Kecamatan Senduro, Kabupaten Lumajang",
  mapCenter: [-7.9825, 113.0095],
  mapZoom: 13,
  fallbackImage: "assets/panorama_argosari.webp",
  whatsappNumber: "6282139497797",
  whatsappMessage: "Halo Admin QR-ONE Argosari, saya ingin memperoleh informasi wisata Desa Argosari.",
  tileAttribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

const CATEGORIES = {
  wisata: "Wisata Alam",
  budaya: "Budaya & Desa",
  fasilitas: "Fasilitas Pendukung",
  homestay: "Homestay & Penginapan",
  umkm: "Kuliner & UMKM"
};

/* Lokasi yang memiliki satu titik peta dan halaman detail. */
const DESTINATIONS = [
  {
    id: "b29",
    kind: "destination",
    title: "Puncak B29 / Negeri di Atas Awan",
    category: "wisata",
    icon: "▲",
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
    kind: "destination",
    title: "Gardu Pandang Argosari",
    category: "wisata",
    icon: "◒",
    image: "assets/Panorama_Argosari.png",
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
    kind: "destination",
    title: "Argosari Kampung Budaya Tengger",
    category: "budaya",
    icon: "◆",
    image: "assets/wisata budaya.webp",
    lat: -7.9902666,
    lng: 113.013113,
    status: "Wisata Budaya",
    summary: "Kenali kehidupan masyarakat, pertanian dataran tinggi, dan budaya Tengger di Desa Argosari.",
    description: "Kampung Budaya Tengger menghadirkan pengalaman untuk mengenal kehidupan masyarakat dataran tinggi Argosari, aktivitas pertanian, budaya lokal, serta keramahan warga.",
    address: "Pusat Desa Argosari, Kecamatan Senduro, Kabupaten Lumajang, Jawa Timur.",
    bestTime: "Pagi hingga sore hari atau menyesuaikan jadwal kegiatan budaya.",
    facilities: ["Informasi desa", "Homestay warga", "Produk lokal", "Kontak pengelola"],
    tips: ["Hormati adat dan ruang pribadi warga.", "Minta izin sebelum mengambil foto warga.", "Gunakan bahasa yang sopan.", "Dukung produk lokal."]
  },
  {
    id: "rest-area-b29",
    kind: "destination",
    title: "Rest Area 1 B29",
    category: "fasilitas",
    icon: "■",
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

/*
  Direktori layanan. Klik kartu di halaman utama untuk membuka daftar.
  Setiap item kemudian membuka Google Maps.

  CATATAN:
  Nama di bawah masih berupa kategori pencarian umum, bukan nama usaha
  yang sudah diverifikasi. Ganti name, description, dan mapUrl dengan
  data homestay/UMKM aktual setelah survei lapangan.
*/
const SERVICE_COLLECTIONS = [
  {
    id: "homestay",
    kind: "collection",
    title: "Homestay dan Penginapan",
    category: "homestay",
    icon: "⌂",
    image: "assets/gallery-2.svg",
    status: "Direktori Layanan",
    summary: "Buka daftar pilihan area penginapan dan akses pencarian lokasinya melalui Google Maps.",
    intro: "Pilih area penginapan yang sesuai. Tautan saat ini membuka hasil pencarian Google Maps dan dapat diganti dengan lokasi homestay aktual pada data.js.",
    places: [
      {
        name: "Homestay di Pusat Desa Argosari",
        description: "Pencarian penginapan di sekitar pusat Desa Argosari.",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=homestay+Desa+Argosari+Senduro+Lumajang"
      },
      {
        name: "Homestay di Jalur Wisata B29",
        description: "Pencarian penginapan yang berada di sekitar jalur menuju Puncak B29.",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=homestay+Puncak+B29+Argosari+Lumajang"
      },
      {
        name: "Penginapan di Sekitar Senduro",
        description: "Pilihan pencarian penginapan pendukung di wilayah Senduro.",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=penginapan+Senduro+Lumajang"
      }
    ]
  },
  {
    id: "umkm-kuliner",
    kind: "collection",
    title: "Warung, Kuliner, dan UMKM",
    category: "umkm",
    icon: "◎",
    image: "assets/gallery-3.svg",
    status: "Direktori Usaha Lokal",
    summary: "Temukan kategori warung, kuliner, dan produk lokal yang dapat dikunjungi di sekitar Argosari.",
    intro: "Pilih kategori usaha lokal untuk membukanya di Google Maps. Ganti daftar ini dengan nama usaha aktual setelah data lapangan tersedia.",
    places: [
      {
        name: "Warung di Desa Argosari",
        description: "Pencarian warung makan dan minum di kawasan Desa Argosari.",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=warung+Desa+Argosari+Senduro+Lumajang"
      },
      {
        name: "Kuliner di Jalur Wisata B29",
        description: "Pencarian tempat makan di sekitar jalur perjalanan menuju B29.",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=kuliner+Puncak+B29+Argosari+Lumajang"
      },
      {
        name: "UMKM dan Oleh-oleh Argosari",
        description: "Pencarian produk lokal dan oleh-oleh di sekitar Argosari.",
        mapUrl: "https://www.google.com/maps/search/?api=1&query=UMKM+oleh-oleh+Argosari+Senduro+Lumajang"
      }
    ]
  }
];

/* Urutan kartu pada galeri “Pesona alam dan budaya”. */
const EXPLORE_ITEMS = [
  DESTINATIONS[0],
  DESTINATIONS[1],
  DESTINATIONS[2],
  SERVICE_COLLECTIONS[0],
  SERVICE_COLLECTIONS[1],
  DESTINATIONS[3]
];

const IMPORTANT_LINKS = [
  {
    title: "Informasi Ojek dan Homestay",
    image: "assets/ojek.png",
    imageAlt: "Ilustrasi layanan ojek dan homestay Desa Argosari",
    description: "Akses informasi penginapan dan transportasi lokal untuk mendukung perjalanan Anda.",
    url: "https://drive.google.com/file/d/1sqlLbXMqJCVpAdCNrxgeVhsjM_SyfOe4/view?usp=sharing"
  },
  {
    title: "Booklet Desa Argosari",
    image: "assets/booklet.png",
    imageAlt: "Ilustrasi booklet panduan wisata Desa Argosari",
    description: "Pelajari daya tarik, fasilitas, layanan, dan informasi umum sebelum berkunjung.",
    url: "https://drive.google.com/file/d/1lynH9S6S6cacOb6_g4D3ML0p147BaRYo/view?usp=sharing"
  },
  {
    title: "Instagram Desa Wisata",
    image: "assets/instagram.png",
    imageAlt: "Ilustrasi kamera untuk Instagram Desa Wisata Argosari",
    description: "Lihat dokumentasi, inspirasi perjalanan, dan informasi terbaru mengenai wisata Argosari.",
    url: "https://www.instagram.com/puncakb29/"
  },
  {
    title: "Rute Menuju Desa Argosari",
    image: "assets/rute.png",
    imageAlt: "Ilustrasi peta dan rute perjalanan menuju Desa Argosari",
    description: "Buka petunjuk perjalanan menuju Desa Argosari melalui Google Maps.",
    url: "https://www.google.com/maps/search/?api=1&query=Argosari,+Senduro,+Lumajang"
  }
];

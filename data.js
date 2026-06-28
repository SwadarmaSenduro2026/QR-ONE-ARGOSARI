const CONFIG = {
  site: {
    title: "Jelajahi Argosari lewat satu QR.",
    navTitle: "QR-One Argosari",
    eyebrow: "PORTAL WISATA DESA",
    subtitle: "Temukan peta wisata, destinasi, fasilitas pendukung, panduan kunjungan, dan kontak penting Desa Argosari dalam satu halaman ringan.",
    notice: "Pilih kebutuhanmu: buka peta, cari destinasi, cek fasilitas, baca panduan, atau kirim koreksi data.",
    quickTitle: "Akses cepat untuk wisatawan",
    quickIntro: "Cek lokasi wisata, akses jalan, parkir, toilet, mushola, warung, homestay, dan kontak bantuan tanpa perlu mengunduh aplikasi.",
    footer: "Portal peta wisata desa berbasis QR Code.",
    lastUpdated: "Terakhir diperbarui: Juni 2026"
  },

  logos: {
    navText: "Q1"
  },

  stats: [
    { value: "1 QR", label: "akses wisata" },
    { value: "6 menu", label: "utama" },
    { value: "HP", label: "ramah pengunjung" }
  ],

  map: {
    embedUrl: "",
    mapButtonUrl: "#destinasi",
    description: "Gunakan peta untuk menemukan destinasi, jalur akses, parkir, toilet, mushola, warung, homestay, UMKM wisata, dan titik bantuan terdekat.",
    legend: ["Wisata", "Parkir", "Toilet", "UMKM", "Bantuan"]
  },

  contact: {
    description: "Butuh bantuan atau informasi wisata? Hubungi admin QR-One Argosari melalui WhatsApp atau gunakan formulir pembaruan data.",
    buttonText: "Chat WhatsApp",
    buttonUrl: ""
  },

  // Ganti nomor WhatsApp di bawah dengan nomor admin/pengelola.
  // Format wajib memakai kode negara Indonesia: 62, bukan 0.
  // Contoh: 081234567890 menjadi 6281234567890.
  whatsapp: {
    number: "6281234567890",
    message: "Halo Admin QR-One Argosari, saya ingin bertanya tentang informasi wisata Argosari.",
    floatText: "WhatsApp",
    ariaLabel: "Hubungi admin QR-One Argosari via WhatsApp"
  },

  form: {
    url: "",
    title: "Kirim / koreksi data wisata",
    description: "Gunakan form untuk usulan destinasi, koreksi titik lokasi, foto, fasilitas, UMKM wisata, atau kontak penting.",
    activeText: "Buka Form Update",
    inactiveText: "Form belum aktif"
  }
};

const MENU_ITEMS = [
  {
    id: "peta-wisata",
    title: "Peta Wisata Argosari",
    shortTitle: "Peta Wisata",
    icon: "🗺️",
    description: "Lihat titik wisata, fasilitas, parkir, toilet, UMKM wisata, dan akses lokasi.",
    status: "Peta",
    link: "#peta"
  },
  {
    id: "destinasi",
    title: "Daftar Destinasi",
    shortTitle: "Destinasi",
    icon: "⛰️",
    description: "Informasi singkat tempat wisata, daya tarik, dan catatan kunjungan.",
    status: "Wisata",
    link: "#destinasi"
  },
  {
    id: "fasilitas",
    title: "Fasilitas Pendukung",
    shortTitle: "Fasilitas",
    icon: "🚻",
    description: "Cek parkir, toilet, mushola, warung, homestay, dan pos informasi.",
    status: "Fasilitas",
    link: "#fasilitas"
  },
  {
    id: "panduan",
    title: "Panduan Kunjungan",
    shortTitle: "Panduan",
    icon: "📌",
    description: "Etika berkunjung, waktu terbaik, perlengkapan, dan imbauan keselamatan.",
    status: "Tips",
    link: "#panduan"
  },
  {
    id: "kontak",
    title: "Kontak Penting",
    shortTitle: "Kontak",
    icon: "☎️",
    description: "Kontak bantuan, pengelola, admin data, dan informasi darurat yang tersedia.",
    status: "Bantuan",
    link: "#kontak"
  },
  {
    id: "update",
    title: "Kirim / Koreksi Data",
    shortTitle: "Update",
    icon: "📝",
    description: "Usulkan destinasi, koreksi lokasi, tambahkan foto, atau laporkan pembaruan data.",
    status: "Form",
    link: "#update"
  }
];

const DESTINATIONS = [
  {
    title: "Wisata B29",
    tag: "Prioritas",
    icon: "⛰️",
    text: "Informasi akses, titik parkir, fasilitas sekitar, dan catatan keselamatan menuju kawasan wisata B29.",
    meta: "Lokasi • Akses • Panduan"
  },
  {
    title: "Spot Foto & Sunrise",
    tag: "Wisata Alam",
    icon: "🌄",
    text: "Titik pandang, spot foto, dan area yang cocok dikunjungi pada waktu tertentu.",
    meta: "Foto • Waktu terbaik"
  },
  {
    title: "UMKM Wisata",
    tag: "Pendukung",
    icon: "🛍️",
    text: "Produk lokal, kuliner, homestay, atau jasa pendukung yang relevan dengan aktivitas wisata.",
    meta: "Kuliner • Oleh-oleh • Homestay"
  }
];

const FACILITIES = [
  "🅿️ Parkir",
  "🚻 Toilet",
  "🕌 Mushola",
  "🍜 Warung",
  "🏠 Homestay",
  "ℹ️ Pos informasi",
  "⚠️ Titik bantuan",
  "📍 Titik kumpul"
];

const GUIDES = [
  {
    title: "Cek cuaca sebelum berangkat",
    icon: "🌦️",
    text: "Kondisi pegunungan dapat berubah. Siapkan jaket, jas hujan, dan alas kaki yang nyaman."
  },
  {
    title: "Gunakan jalur yang tersedia",
    icon: "🧭",
    text: "Ikuti rute yang disarankan dan perhatikan arahan pengelola atau warga setempat."
  },
  {
    title: "Jaga kebersihan lokasi",
    icon: "♻️",
    text: "Bawa kembali sampahmu atau gunakan tempat sampah yang tersedia di area wisata."
  },
  {
    title: "Hormati warga dan lingkungan",
    icon: "🤝",
    text: "Jaga ketertiban, sopan saat bertanya, dan dukung ekonomi lokal secara bijak."
  }
];

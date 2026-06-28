/*
  QR-One Argosari - Data Layout Akses Cepat

  Fokus template ini:
  - halaman awal ringkas
  - menu utama tidak terlalu banyak
  - cocok untuk scan QR di HP
  - link bisa diisi nanti

  Cara edit:
  1. Ubah teks di CONFIG.site.
  2. Ubah urutan/menu di MENU_ITEMS.
  3. Kalau link belum siap, biarkan link: "#".
  4. Jika Google Form sudah siap, isi CONFIG.form.url.
*/

const CONFIG = {
  site: {
    title: "QR-One Argosari",
    navTitle: "QR-One Argosari",
    eyebrow: "PORTAL INFORMASI DESA",
    subtitle: "Satu QR untuk akses informasi Desa Argosari.",
    intro: "Dibuat untuk memudahkan warga dan pengunjung mengakses informasi penting Desa Argosari.",
    notice: "Pilih menu utama di bawah ini. Setiap tombol dibuat singkat agar mudah dipakai dari HP saat scan QR.",
    footer: "QR-One Argosari - Program Kerja KKN",
    lastUpdated: "Terakhir diperbarui: Mei 2026"
  },

  // Untuk tahap awal logo dibuat tanpa file gambar agar upload lebih mudah.
  // Kalau nanti ingin pakai gambar logo asli, beri tahu aku, nanti aku bantu ubah.
  logos: {
    navText: "Q1",
    kknText: "KKN",
    campusText: "🏛️"
  },

  form: {
    url: "",
    title: "Kirim data atau koreksi informasi",
    description: "Gunakan satu form untuk mengirim data baru, koreksi informasi desa, UMKM, wisata, fasilitas umum, atau laporan pembaruan.",
    activeText: "Buka Form",
    inactiveText: "Form belum aktif"
  }
};

const MENU_ITEMS = [
  {
    id: "peta-desa",
    title: "Peta Desa & Lokasi Penting",
    shortTitle: "Peta Desa",
    icon: "🗺️",
    description: "Akses peta desa, lokasi wisata, fasilitas umum, dan titik penting.",
    status: "Prioritas utama",
    link: "#peta",
    priority: true
  },
  {
    id: "informasi-desa",
    title: "Informasi Desa Argosari",
    shortTitle: "Informasi Desa",
    icon: "🏛️",
    description: "Profil singkat, layanan desa, dan informasi umum Argosari.",
    status: "Disiapkan",
    link: "#informasi",
    priority: true
  },
  {
    id: "wisata-b29",
    title: "Wisata B29",
    shortTitle: "Wisata B29",
    icon: "⛰️",
    description: "Informasi akses, lokasi, dan panduan singkat wisata B29.",
    status: "Disiapkan",
    link: "#informasi",
    priority: true
  },
  {
    id: "fasilitas-umum",
    title: "Fasilitas Umum",
    shortTitle: "Fasilitas Umum",
    icon: "🏥",
    description: "Balai desa, sekolah, posyandu, masjid, parkir, dan fasilitas lain.",
    status: "Disiapkan",
    link: "#informasi",
    priority: true
  },
  {
    id: "mitigasi-darurat",
    title: "Mitigasi & Nomor Darurat",
    shortTitle: "Mitigasi Darurat",
    icon: "⚠️",
    description: "Informasi jalur evakuasi, titik kumpul, dan kontak penting.",
    status: "Perlu validasi",
    link: "#informasi",
    priority: true
  },
  {
    id: "update-data",
    title: "Kirim Data / Koreksi Informasi",
    shortTitle: "Update Data",
    icon: "📝",
    description: "Satu pintu untuk pendaftaran, koreksi, dan pembaruan data.",
    status: "Form menyusul",
    link: "#update",
    priority: true
  }
];

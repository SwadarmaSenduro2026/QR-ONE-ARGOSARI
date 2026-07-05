# QR-ONE ARGOSARI - Layout Mirip WebGIS UMKM Lemahputih

Versi ini dibuat dengan susunan yang lebih mirip contoh `umkm-lemahputih`:

1. Navbar: Home, Peta Wisata, Daftar Wisata, Tentang, Jelajahi
2. Hero utama
3. Tentang desa + slider/galeri
4. Peta interaktif berbasis Leaflet
5. Daftar wisata dengan tombol **Informasi lebih lanjut**
6. Halaman detail terpisah `detail.html?id=...`
7. Tautan penting pengganti Linktree
8. Footer dan navigasi mobile

## File yang perlu di-upload ke GitHub repository

Upload semua file/folder ini ke root repository GitHub Pages:

```text
index.html
detail.html
style.css
data.js
script.js
detail.js
README.md
.nojekyll
assets/
```

## Mengganti data wisata

Buka `data.js`, lalu edit bagian `DESTINATIONS`.

Contoh bagian yang paling sering diganti:

```js
{
  id: "b29",
  title: "Puncak B29 / Negeri di Atas Awan",
  lat: -7.9592318,
  lng: 112.9948334,
  summary: "Ikon wisata Argosari...",
  description: "Narasi lengkap..."
}
```

## Membuat halaman detail baru

Tidak perlu membuat file HTML baru. Cukup tambahkan data baru di `DESTINATIONS`, misalnya:

```js
id: "nama-wisata-baru"
```

Nanti tombol detail otomatis mengarah ke:

```text
detail.html?id=nama-wisata-baru
```

## Catatan peta

Peta memakai Leaflet dan OpenStreetMap dari CDN. Peta akan tampil saat website memiliki koneksi internet.

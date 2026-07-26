# QR-ONE ARGOSARI — Versi Revisi

Website ini memakai HTML, CSS, JavaScript, Leaflet 1.9.4, dan OpenStreetMap.

## Struktur yang harus berada di root repository

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

## File yang paling sering diedit

- `data.js`: destinasi, foto, koordinat, nomor WhatsApp, dan tautan.
- `index.html`: judul dan susunan bagian halaman utama.
- `style.css`: warna, ukuran, dan tata letak.

## Mengganti foto

Ganti file di `assets/photos/` menggunakan nama yang sama:

```text
hero-argosari.webp
b29.webp
gardu-pandang.webp
kampung-tengger.webp
homestay-ojek.webp
umkm-kuliner.webp
rest-area-b29.webp
og-argosari.jpg
```

Karena nama file tetap sama, `data.js` tidak perlu diubah.

## Ukuran foto

- Hero: 1600 × 1000 px, WebP, ideal di bawah 450 KB.
- Destinasi: 1200 × 750 px, WebP, ideal 150–300 KB.
- OG image: 1200 × 630 px, JPG.

## Peta

Peta membutuhkan internet karena mengambil Leaflet dan tile OpenStreetMap dari CDN.

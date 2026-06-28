# QR-One Argosari - Portal Wisata Siap Pakai

Versi ini dibuat sebagai portal wisata berbasis QR Code yang siap diunggah ke GitHub Pages. Kontennya berfokus pada peta wisata, destinasi, fasilitas pendukung, panduan kunjungan, kontak penting, dan koreksi data.

## File yang diunggah ke GitHub

Upload semua file berikut langsung ke root repository:

```text
index.html
style.css
script.js
data.js
README.md
```

Jangan masukkan file ke dalam folder, karena GitHub Pages perlu membaca `index.html` langsung dari root repository.

## Cara mengedit isi

Edit file `data.js` untuk mengubah:

- judul website;
- teks beranda;
- daftar menu;
- destinasi wisata;
- fasilitas pendukung;
- panduan kunjungan;
- link Google Form;
- link Google My Maps atau WebGIS.

## Cara memasang Google My Maps

1. Buka Google My Maps.
2. Buat peta dan masukkan titik wisata/fasilitas.
3. Klik Bagikan/Sematkan peta.
4. Salin URL `src` dari iframe.
5. Tempel ke bagian berikut di `data.js`:

```js
map: {
  embedUrl: "ISI_LINK_EMBED_GOOGLE_MY_MAPS_DI_SINI"
}
```

## Cara mengaktifkan tombol Form

Masukkan link Google Form pada `data.js`:

```js
form: {
  url: "ISI_LINK_GOOGLE_FORM_DI_SINI"
}
```

Setelah link diisi, tombol akan otomatis aktif.


## Cara mengganti nomor WhatsApp

Edit file `data.js`, lalu cari bagian berikut:

```js
whatsapp: {
  number: "6281234567890",
  message: "Halo Admin QR-One Argosari, saya ingin bertanya tentang informasi wisata Argosari.",
  floatText: "WhatsApp"
}
```

Ganti `6281234567890` dengan nomor WhatsApp admin/pengelola. Gunakan format kode negara Indonesia, misalnya nomor `081234567890` ditulis menjadi `6281234567890`.

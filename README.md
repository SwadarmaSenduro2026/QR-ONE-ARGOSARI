# QR-One Argosari - Layout WebGIS/UMKM

Template ini dibuat untuk GitHub Pages. Layout terinspirasi dari gaya portal WebGIS: navbar, hero besar, section tentang, menu cepat, peta, daftar informasi, form pendaftaran, dan footer.

## File penting

- `index.html` = struktur halaman
- `style.css` = tampilan/layout
- `script.js` = logika sederhana untuk menampilkan data
- `data.js` = isi website yang paling sering diedit
- `assets/` = logo dan ilustrasi

## Cara upload ke GitHub

1. Ekstrak ZIP ini.
2. Upload isi folder ke repository GitHub kamu.
3. Commit changes.
4. Aktifkan GitHub Pages dari Settings > Pages.
5. Pilih `Deploy from a branch`, branch `main`, folder `/root`.

## Cara edit isi

Edit file `data.js`.

Yang sering diganti:

- Judul website: `CONFIG.site.title`
- Nama desa: `CONFIG.site.place`
- Link Google Form: `CONFIG.form.url`
- Link Google Maps: bagian `MENU_ITEMS`
- Logo: bagian `CONFIG.assets`

## Cara ganti logo

1. Upload logo baru ke folder `assets`.
2. Pakai nama file tanpa spasi, contoh `logo-kkn.png`.
3. Ubah `data.js`, misalnya:

```js
kknLogo: "assets/logo-kkn.png"
```

## Cara pasang Google Maps embed

1. Buka Google Maps.
2. Klik Share / Bagikan.
3. Pilih Embed a map / Sematkan peta.
4. Copy nilai `src` dari iframe.
5. Paste ke:

```js
CONFIG.map.embedUrl
```

Contoh:

```js
embedUrl: "https://www.google.com/maps/embed?pb=..."
```

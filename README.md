# QR-ONE ARGOSARI — Versi Revisi

Portal informasi dan peta wisata Desa Argosari.

## Perubahan utama

- Bagian **Pilihan destinasi dan layanan wisata** dihapus.
- Seluruh destinasi dan layanan dirangkum dalam galeri interaktif **Pesona alam dan budaya**.
- Destinasi tunggal membuka `detail.html?id=...`.
- Homestay dan UMKM membuka `detail.html?collection=...` yang menampilkan daftar tempat.
- Setiap item pada daftar homestay/UMKM langsung membuka Google Maps.
- Peta utama hanya menampilkan lokasi yang mempunyai satu titik koordinat.

## File yang perlu diunggah untuk mengganti versi lama

- `index.html`
- `style.css`
- `script.js`
- `data.js`
- `detail.html`
- `detail.js`

Folder `assets` tidak perlu diganti karena kode revisi menggunakan gambar yang sudah tersedia di repository.

## Mengisi daftar homestay dan UMKM

Buka `data.js`, lalu cari:

```js
const SERVICE_COLLECTIONS = [
```

Ganti setiap `name`, `description`, dan `mapUrl` dengan data tempat aktual hasil survei. Daftar awal yang tersedia masih berupa kategori pencarian umum Google Maps, bukan daftar usaha terverifikasi.

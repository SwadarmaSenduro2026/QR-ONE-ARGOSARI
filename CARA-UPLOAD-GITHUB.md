# Cara Mengganti Website Lama di GitHub

## Sebelum mulai

1. Buka repository `SwadarmaSenduro2026/QR-ONE-ARGOSARI`.
2. Buat cadangan dengan memilih **Code > Download ZIP**, atau buat branch baru bernama `backup-sebelum-revisi`.
3. Ekstrak `QR-ONE-ARGOSARI-REVISI.zip` di komputer.

## Cara termudah melalui browser

1. Masuk ke halaman utama repository, bukan folder `assets`.
2. Klik **Add file > Upload files**.
3. Buka folder hasil ekstrak `QR-ONE-ARGOSARI-REVISI`.
4. Seret **isi foldernya**, yaitu `index.html`, `style.css`, `script.js`, `data.js`, `detail.html`, `detail.js`, `README.md`, `.nojekyll`, dan folder `assets`.
5. Jangan menyeret folder induk `QR-ONE-ARGOSARI-REVISI`, karena `index.html` harus tetap berada di root repository.
6. File dengan nama yang sama akan menjadi perubahan terhadap file lama. File baru seperti `detail.html` dan folder `assets/photos` akan ditambahkan.
7. Tulis commit message: `Rebuild QR-ONE Argosari website`.
8. Pilih **Commit directly to the main branch** untuk cara tercepat, atau buat branch baru lalu Pull Request untuk cara yang lebih aman.
9. Klik **Commit changes**.

## Mengganti foto setelah website sudah aktif

Masuk ke folder `assets/photos`, lalu unggah foto baru dengan nama yang sama:

- `hero-argosari.webp`
- `b29.webp`
- `gardu-pandang.webp`
- `kampung-tengger.webp`
- `homestay-ojek.webp`
- `umkm-kuliner.webp`
- `rest-area-b29.webp`
- `og-argosari.jpg`

Jika nama dan foldernya sama, kode tidak perlu diubah. Jika GitHub menolak karena file sudah ada, hapus file lama melalui ikon tempat sampah, commit, lalu unggah foto pengganti.

## Memastikan GitHub Pages memakai file yang benar

Buka **Settings > Pages** dan pastikan:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/(root)`

Setelah commit, lihat tab **Actions** atau halaman **Settings > Pages** untuk memastikan deployment selesai. Lalu buka website dan tekan `Ctrl + F5`.

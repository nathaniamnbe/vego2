Catatan Teknis

Setelah dilakukan proses build, file APK berhasil dibuat tanpa error dan proses build berjalan lancar. Namun, saat dilakukan instalasi dan eksekusi aplikasi pada beberapa perangkat Android, aplikasi tidak dapat berjalan sebagaimana mestinya.
Permasalahan:
- Aplikasi berhasil terinstall, namun tidak dapat dibuka (force close).
- Tidak ada pesan error yang jelas, sehingga penyebab crash tidak dapat dipastikan secara spesifik.
- Error hanya terjadi saat dijalankan di perangkat secara langsung, bukan saat dijalankan melalui emulator atau Expo Go.
Solusi Sementara:
Untuk memastikan dosen/aslab tetap dapat menilai fungsi dan tampilan aplikasi, kami menyarankan untuk menjalankan proyek menggunakan Expo Go dengan mengikuti langkah-langkah berikut:
- Clone repository ini. (https://github.com/nathaniamnbe/vego2 )
- buka cmd pada folder direktori yg telah di clone
- cd ke folder project yang di clone
- Jalankan perintah “npx expo start” pada direktori folder
- Scan QR code dengan aplikasi Expo Go di HP.
- Aplikasi Berjalan

Dengan metode ini, aplikasi dapat berjalan normal dan seluruh fitur dapat digunakan.

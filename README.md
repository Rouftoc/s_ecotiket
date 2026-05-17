# Eco-Tiket — Trans Banjarmasin

Sistem tiket digital berbasis penukaran botol plastik untuk layanan Bus Trans Banjarmasin. Penumpang menukarkan botol plastik kepada petugas di halte/stand, lalu mendapatkan tiket digital yang bisa digunakan untuk naik bus.

---

## Daftar Isi

- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Prasyarat](#prasyarat)
- [Instalasi & Menjalankan](#instalasi--menjalankan)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Struktur Database](#struktur-database)
- [API Endpoints](#api-endpoints)
- [Role Pengguna](#role-pengguna)

---

## Fitur

### Penumpang
- Registrasi menggunakan NIK (16 digit)
- QR Code unik sebagai identitas transaksi
- Melihat saldo tiket dan total poin
- Riwayat transaksi (penukaran botol & penggunaan tiket)
- Notifikasi reward
- Live chat dengan admin

### Petugas
- Login dengan email & password
- Manajemen shift (mulai & akhiri shift per lokasi)
- Mode **Stand** — scan QR penumpang untuk tukar botol
- Mode **Karnet** — validasi tiket penumpang di bus
- Registrasi penumpang baru langsung dari dashboard
- Riwayat transaksi shift

### Admin
- Dashboard statistik (total pengguna, tiket, transaksi, botol)
- Manajemen pengguna (penumpang, petugas, admin)
- Manajemen lokasi (terminal, koridor, stand)
- Manajemen berita & pengumuman
- Grafik tren penukaran botol & distribusi pengguna
- Monitor petugas yang sedang bertugas secara real-time
- Laporan & ekspor data (CSV, Excel, PDF dengan kop surat resmi)
- Pengaturan nilai tukar botol per jenis
- Live chat & support
- Kirim notifikasi reward ke penumpang

---

## Tech Stack

### Frontend
| Teknologi | Versi | Keterangan |
|---|---|---|
| React | 19 | UI library |
| TypeScript | 5.5 | Type safety |
| Vite | 5.4 | Build tool |
| React Router | 6 | Client-side routing |
| Tailwind CSS | 3.4 | Styling |
| shadcn/ui + Radix UI | — | Komponen UI |
| Recharts | 2 | Grafik & chart |
| React Hook Form + Zod | — | Form & validasi |
| TanStack Query | 5 | Data fetching |
| html5-qrcode / jsQR | — | Scan QR Code |
| qrcode | 1.5 | Generate QR Code |
| jsPDF + jspdf-autotable | — | Export PDF |
| xlsx | — | Export Excel/CSV |
| Zustand | 4.5 | State management |
| Framer Motion | 11 | Animasi |
| Sonner + SweetAlert2 | — | Notifikasi & dialog |

### Backend
| Teknologi | Versi | Keterangan |
|---|---|---|
| Node.js | — | Runtime |
| Express | 4.21 | Web framework |
| MySQL2 | 3.15 | Database driver |
| JWT (jsonwebtoken) | 9 | Autentikasi |
| bcrypt | 5.1 | Hash password |
| Multer | 2 | Upload file/gambar |
| Helmet | 7 | Security headers |
| express-rate-limit | 7 | Rate limiting |
| dotenv | 16 | Environment variables |

### Database
- **MySQL** 8.0

---

## Struktur Proyek

```
eco-tiket/
├── backend/
│   ├── config/
│   │   └── database.js          # Konfigurasi koneksi MySQL
│   ├── controllers/             # Logic bisnis per resource
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── locationController.js
│   │   ├── newsController.js
│   │   ├── notificationController.js
│   │   ├── shiftController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js              # JWT middleware
│   ├── routes/                  # Definisi endpoint API
│   ├── utils/
│   │   └── notificationHelper.js
│   ├── public/uploads/          # File upload (gambar berita, dll)
│   ├── server.js                # Entry point
│   └── .env                     # Konfigurasi environment
│
├── frontend/
│   ├── src/
│   │   ├── assets/              # Gambar & logo
│   │   ├── components/
│   │   │   ├── admin/           # Komponen dashboard admin
│   │   │   ├── common/          # Komponen shared (QR, chat, notifikasi)
│   │   │   ├── penumpang/       # Komponen dashboard penumpang
│   │   │   ├── petugas/         # Komponen dashboard petugas
│   │   │   └── ui/              # Komponen UI dasar (shadcn)
│   │   ├── lib/
│   │   │   └── api/             # Modul API per resource
│   │   │       ├── auth.ts
│   │   │       ├── bottleRates.ts
│   │   │       ├── locations.ts
│   │   │       ├── news.ts
│   │   │       ├── notifications.ts
│   │   │       ├── shifts.ts
│   │   │       ├── transactions.ts
│   │   │       └── users.ts
│   │   ├── pages/               # Halaman utama per route
│   │   └── types/               # TypeScript interfaces
│   └── index.html
│
└── database/
    └── eco_tiket.sql            # Dump database lengkap
```

---

## Prasyarat

Pastikan sudah terinstall:

- **Node.js** v18 atau lebih baru
- **pnpm** v8 (`npm install -g pnpm`)
- **MySQL** 8.0
- **nodemon** (opsional, untuk development backend): `npm install -g nodemon`

---

## Instalasi & Menjalankan

### 1. Clone repositori

```bash
git clone <url-repositori>
cd eco-tiket
```

### 2. Setup Database

Buka MySQL dan buat database, lalu import dump:

```bash
mysql -u root -p -e "CREATE DATABASE eco_tiket CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p eco_tiket < database/eco_tiket.sql
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Salin dan sesuaikan file environment:

```bash
cp .env.example .env
# Edit .env sesuai konfigurasi lokal Anda
```

Jalankan backend:

```bash
# Development (dengan auto-reload)
npm run dev

# Production
npm start
```

Backend berjalan di `http://localhost:5000`

### 4. Setup Frontend

```bash
cd frontend
pnpm install
```

Jalankan frontend:

```bash
pnpm dev
```

Frontend berjalan di `http://localhost:5173`

---

## Konfigurasi Environment

Buat file `backend/.env` berdasarkan contoh berikut:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=eco_tiket
DB_PORT=3306

# JWT
JWT_SECRET=ganti_dengan_secret_yang_kuat_dan_panjang
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# CORS — sesuaikan dengan URL frontend
FRONTEND_URL=http://localhost:5173
```

> **Penting:** Ganti `JWT_SECRET` dengan string acak yang panjang sebelum deploy ke production.

---

## Struktur Database

Database `eco_tiket` terdiri dari tabel-tabel berikut:

| Tabel | Keterangan |
|---|---|
| `users` | Data semua pengguna (penumpang, petugas, admin) |
| `transactions` | Riwayat transaksi penukaran botol & penggunaan tiket |
| `locations` | Data lokasi (terminal, koridor, stand) |
| `bottle_rates` | Konfigurasi nilai tukar per jenis botol |
| `shift_assignments` | Riwayat shift petugas per lokasi |
| `news` | Berita & pengumuman |
| `notifications` | Notifikasi per pengguna |
| `chat_sessions` | Sesi live chat |
| `chat_messages` | Pesan live chat |

### Jenis Botol & Nilai Tukar Default

| Jenis | Jumlah Botol | Tiket Didapat |
|---|---|---|
| Kecil | 15 | 1 tiket |
| Sedang | 8 | 1 tiket |
| Besar | 5 | 1 tiket |
| Jumbo | 1 | 2 tiket |
| Cup/Gelas | 20 | 1 tiket |

Nilai tukar dapat diubah melalui menu **Jenis Botol** di dashboard admin.

---

## API Endpoints

Base URL: `http://localhost:5000/api`

Semua endpoint (kecuali auth) memerlukan header:
```
Authorization: Bearer <token>
```

### Auth
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/auth/register` | Registrasi pengguna baru |
| POST | `/auth/login` | Login |
| GET | `/auth/profile` | Profil pengguna yang login |

### Users
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/users` | Daftar semua pengguna |
| GET | `/users/:id` | Detail pengguna |
| PUT | `/users/:id` | Update data pengguna |
| DELETE | `/users/:id` | Hapus pengguna |

### Transactions
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/transactions` | Semua transaksi |
| GET | `/transactions/user/:id` | Transaksi per pengguna |
| POST | `/transactions/bottle-exchange` | Proses tukar botol |
| POST | `/transactions/ticket-usage` | Proses penggunaan tiket |
| DELETE | `/transactions/:id` | Hapus transaksi |

### Locations
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/locations` | Daftar lokasi |
| POST | `/locations` | Tambah lokasi |
| PUT | `/locations/:id` | Update lokasi |
| DELETE | `/locations/:id` | Hapus lokasi |

### Bottle Rates
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/bottle-rates` | Daftar nilai tukar botol |
| POST | `/bottle-rates` | Tambah jenis botol |
| PUT | `/bottle-rates/:id` | Update nilai tukar |
| DELETE | `/bottle-rates/:id` | Hapus jenis botol |

### Shifts
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/shifts/active` | Semua shift aktif |
| GET | `/shifts/history/:petugasId` | Riwayat shift petugas |
| POST | `/shifts/start` | Mulai shift |
| PUT | `/shifts/end` | Akhiri shift |

### Notifications
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/notifications` | Notifikasi milik user yang login |
| PATCH | `/notifications/read-all` | Tandai semua sudah dibaca |
| POST | `/notifications/send` | Kirim notifikasi ke user tertentu |
| POST | `/notifications/broadcast` | Broadcast ke semua user |

### News
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/news` | Daftar berita |
| GET | `/news/:id` | Detail berita |
| POST | `/news` | Tambah berita (dengan upload gambar) |
| PUT | `/news/:id` | Update berita |
| DELETE | `/news/:id` | Hapus berita |

### Health Check
| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/health` | Status server |

---

## Role Pengguna

| Role | Cara Login | Akses |
|---|---|---|
| `penumpang` | NIK + QR Code | Dashboard penumpang |
| `petugas` | Email + Password | Dashboard petugas |
| `admin` | Email + Password | Dashboard admin (full access) |

### Alur Registrasi Penumpang

Penumpang tidak bisa registrasi mandiri. Alurnya:
1. Penumpang datang ke petugas di stand/halte
2. Petugas membuka menu **Daftar Penumpang** di dashboard
3. Petugas mengisi nama & NIK penumpang
4. Sistem generate QR Code otomatis
5. Petugas mencetak/mengunduh QR Code untuk diberikan ke penumpang

### Alur Penukaran Botol

1. Penumpang menunjukkan QR Code kepada petugas
2. Petugas scan QR Code via kamera atau input manual
3. Petugas memilih jenis dan jumlah botol
4. Sistem menghitung tiket yang didapat berdasarkan nilai tukar
5. Tiket otomatis masuk ke saldo penumpang

---

## Lisensi

Proyek ini dikembangkan untuk keperluan Dinas Perhubungan Kota Banjarmasin.

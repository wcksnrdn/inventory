# Inventory Management System

Inventory Management System adalah aplikasi berbasis web untuk mengelola stok barang dengan fitur autentikasi role-based access control (RBAC). Aplikasi ini memungkinkan **admin** untuk menambah, mengedit, dan menghapus barang, sementara **staff** hanya dapat melihat daftar inventory.

## 🚀 Teknologi yang Digunakan
- **Frontend:** Next.js (TypeScript), TailwindCSS, shadcn/ui
- **Backend:** Node.js, Express.js, PostgreSQL
- **Autentikasi:** JSON Web Token (JWT)

## 📌 Fitur Utama
### **1. Autentikasi User (Register & Login)**
- User dapat melakukan **registrasi** dengan konfirmasi password dan ceklis "Verified Human".
- User dapat **login** untuk mendapatkan akses ke dashboard inventory.
- **Token JWT** disimpan di `localStorage` untuk autentikasi.

### **2. Role-Based Access Control (RBAC)**
- **Admin:** Bisa **menambah, mengedit, dan menghapus** barang di inventory.
- **Staff:** Hanya bisa **melihat daftar inventory** tanpa akses CRUD.

### **3. CRUD Inventory**
- **GET /inventory** → Mendapatkan daftar barang (Admin & Staff).
- **POST /inventory** → Menambahkan barang baru (Hanya Admin).
- **PUT /inventory/:id** → Mengedit data barang (Hanya Admin).
- **DELETE /inventory/:id** → Menghapus barang (Hanya Admin).

## 🛠️ Cara Instalasi & Menjalankan Proyek
### **1. Clone Repository**
```bash
git clone https://github.com/wcksnrdn/inventory.git
cd inventory
```

### **2. Setup Backend**
```bash
cd backend
npm install
```

Buat file `.env` di folder `backend` dan tambahkan konfigurasi PostgreSQL:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=inventory_system
DB_PASS=yourpassword
DB_PORT=5432
JWT_SECRET=your_secret_key
```

Jalankan backend:
```bash
npx nodemon server.js
```

### **3. Setup Frontend**
```bash
cd frontend
npm install
```

Jalankan frontend:
```bash
npm run dev
```
Buka **[http://localhost:3000](http://localhost:3000)** di browser.

## 🎮 Cara Menggunakan
1. **Registrasi user di** [http://localhost:3000/register](http://localhost:3000/register)
2. **Login di** [http://localhost:3000/login](http://localhost:3000/login)
3. **Admin dapat mengelola inventory di** [http://localhost:3000/inventory](http://localhost:3000/inventory)

## 📜 Lisensi
Proyek ini bersifat open-source. Silakan gunakan dan kembangkan sesuai kebutuhan. 🚀

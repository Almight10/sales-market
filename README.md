This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Akun Admin Default (Seeded)

Setelah melakukan *seeding* database, Anda dapat menggunakan akun admin berikut untuk masuk ke aplikasi:

* **Email:** `admin@ciptainovasi.id`
* **Password:** `password123`

Untuk menjalankan *seeding* database (membuat akun admin default), jalankan perintah berikut:
```bash
node seed.js
```

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Running with Docker (Recommended)

Proyek ini telah dikonfigurasi untuk berjalan dengan Docker menggunakan **Docker Compose**. Ini mencakup seluruh layanan: Next.js Frontend, CRM Microservice, HR Microservice, PostgreSQL Database, dan MinIO Object Storage.

### Prasyarat
- Pastikan Anda sudah menginstal [Docker Desktop](https://www.docker.com/products/docker-desktop/) di mesin Anda.

### Cara Menjalankan

1. **Konfigurasi Environment Variable**
   Salin berkas `.env` Anda. Jika ingin menggunakan database PostgreSQL lokal yang disediakan oleh Docker Compose, pastikan `DATABASE_URL` menggunakan host `db` alih-alih `localhost`:
   ```env
   DATABASE_URL="postgresql://postgres:probolinggo@db:5432/dashboard_db?schema=public"
   ```
   *Catatan: Jika Anda ingin tetap menggunakan database Neon DB cloud, biarkan `DATABASE_URL` mengarah ke Neon DB.*

2. **Jalankan Docker Compose**
   Jalankan perintah berikut di root direktori proyek untuk membuat *image* dan menjalankan seluruh layanan:
   ```bash
   docker compose up --build
   ```

3. **Akses Aplikasi**
   Setelah semua layanan berjalan:
   - **Frontend (Next.js):** [http://localhost:3000](http://localhost:3000)
   - **CRM Microservice:** [http://localhost:3001](http://localhost:3001)
   - **HR Microservice:** [http://localhost:3002](http://localhost:3002)
   - **MinIO Console (Storage):** [http://localhost:9001](http://localhost:9001) (User: `admin`, Pass: `admin123`)

4. **Menghentikan Layanan**
   Untuk menghentikan semua kontainer:
   ```bash
   docker compose down
   ```

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Menyambungkan ke database...');
  
  // Periksa apakah admin sudah ada
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@ciptainovasi.id' },
  });

  if (existingAdmin) {
    console.log('User admin sudah ada!');
    console.log('Email:', existingAdmin.email);
    console.log('Kata Sandi:', existingAdmin.password);
  } else {
    // Buat admin baru
    const admin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@ciptainovasi.id',
        password: 'password123', // Password default dari skema
        role: 'Admin',
        status: 'Aktif',
      },
    });
    console.log('Admin berhasil ditambahkan!');
    console.log('Email:', admin.email);
    console.log('Kata Sandi:', admin.password);
  }
}

main()
  .catch((e) => {
    console.error('Terjadi kesalahan:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

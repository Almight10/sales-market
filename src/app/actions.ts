'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma'; // Sesuaikan lokasi prisma yang tadi kita buat

// === 1. Server Actions untuk Pengguna (User) ===
export async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function loginUser(email: string, passwordInput: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: 'Akun tidak ditemukan' };
    }

    if (user.password !== passwordInput) {
      return { success: false, message: 'Kata sandi salah' };
    }

    return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Terjadi kesalahan pada server' };
  }
}

export async function createUser(name: string, email: string, role: string) {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        role,
        status: "Aktif",
      }
    });
    revalidatePath('/');
    return { success: true, user };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Gagal menambah pengguna (mungkin email ganda)' };
  }
}

// === 2. Server Actions untuk Pesanan (Order) ===
export async function getOrders() {
  try {
    return await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createOrder(totalAmount: number) {
  try {
    // Generate random order number like ORD-00XX
    const orderNumber = `ORD-00${Math.floor(Math.random() * 1000)}`;
    const order = await prisma.order.create({
      data: {
        orderNumber,
        totalAmount,
        status: "Diproses",
      }
    });
    revalidatePath('/');
    return { success: true, order };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Gagal menambah pesanan' };
  }
}

// === 3. Server Actions untuk SCM ===
export async function getSCMData() {
  try {
    const suppliers = await prisma.supplier.findMany();
    const inventory = await prisma.inventory.findMany({ include: { supplier: true }});
    return { suppliers, inventory };
  } catch (error) {
    console.error(error);
    return { suppliers: [], inventory: [] };
  }
}

export async function createSupplier(name: string, contact: string) {
  try {
    const supplier = await prisma.supplier.create({
      data: { name, contact }
    });
    revalidatePath('/');
    return { success: true, supplier };
  } catch(error) {
    console.error(error);
    return { success: false, message: 'Gagal menambah pemasok' };
  }
}

export async function createInventory(itemName: string, stock: number, supplierId: string) {
  try {
    const inventory = await prisma.inventory.create({
      data: { itemName, stock, supplierId }
    });
    revalidatePath('/');
    return { success: true, inventory };
  } catch(error) {
    console.error(error);
    return { success: false, message: 'Gagal menambah barang inventaris' };
  }
}

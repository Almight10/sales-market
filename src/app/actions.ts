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

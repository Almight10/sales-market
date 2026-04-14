'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, ShoppingCart, FileText, Settings, 
  Menu, Bell, Search, Activity, CreditCard, DollarSign, 
  Package2, MoreHorizontal, Plus, X, User as UserIcon, Calendar, Info
} from 'lucide-react';

import { getUsers, createUser, getOrders, createOrder } from './actions';

const navigations = [
  { id: 'dashboard', label: 'Dasbor Utama', icon: BarChart3 },
  { id: 'users', label: 'Manajemen Pengguna', icon: Users },
  { id: 'orders', label: 'Pesanan & Transaksi', icon: ShoppingCart },
  { id: 'reports', label: 'Analisis Laporan', icon: FileText },
  { id: 'settings', label: 'Pengaturan Sistem', icon: Settings },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // States dari Database
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal States (Tambah Data)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  // Modal States (Lihat Detail)
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);

  // Form States
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Staff' });
  const [newOrder, setNewOrder] = useState({ amount: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    const dbUsers = await getUsers();
    const dbOrders = await getOrders();
    setUsers(dbUsers);
    setOrders(dbOrders);
    setIsLoading(false);
  };

  // HANDLERS UNTUK SUBMIT
  const submitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createUser(newUser.name, newUser.email, newUser.role);
    if (res.success) {
      setIsUserModalOpen(false);
      setNewUser({ name: '', email: '', role: 'Staff' }); 
      fetchData(); 
    } else {
      alert(res.message);
    }
    setIsSubmitting(false);
  };

  const submitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createOrder(Number(newOrder.amount));
    if (res.success) {
      setIsOrderModalOpen(false);
      setNewOrder({ amount: '' }); 
      fetchData(); 
    } else {
      alert(res.message);
    }
    setIsSubmitting(false);
  };

  const handleSaveSettings = () => {
    alert("Pengaturan Berhasil Disimpan ke Database (Tersimulasi)!");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    // Gunakan tanggal standar Indonesia
    return new Date(dateString).toLocaleString('id-ID', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // FEATURE 1: Dashboard Analytics
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold tracking-tight">Ikhtisar</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Pengguna Terdaftar", value: users.length.toString(), icon: Users, trend: "Realtime" },
          { title: "Total Pesanan", value: orders.length.toString(), icon: ShoppingCart, trend: "Realtime" },
          { title: "Estimasi Pendapatan", value: `Rp ${orders.reduce((a,b)=>a+b.totalAmount,0).toLocaleString()}`, icon: DollarSign, trend: "Realtime" },
          { title: "Aktivitas Aktif", value: "Sistem OK", icon: Activity, trend: "Stabil" }
        ].map((stat, i) => (
           <div key={i} className="glass rounded-xl p-6 transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer">
            <div className="flex flex-row items-center justify-between pb-2">
              <h3 className="tracking-tight text-sm font-medium text-[hsl(var(--muted-foreground))]">{stat.title}</h3>
              <stat.icon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                <span className="text-emerald-500 font-medium">{stat.trend}</span> bulan ini
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 glass rounded-xl p-6">
          <div className="flex flex-col space-y-1.5 pb-4 border-b border-[hsl(var(--border))] mb-4">
            <h3 className="font-semibold leading-none tracking-tight">Kinerja Aplikasi (Load Balancer)</h3>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Server berjalan optimal melalui database Prisma.</p>
          </div>
          <div className="h-[250px] w-full flex items-end justify-between gap-2 px-2">
            {[40, 70, 45, 90, 65, 55, 85].map((val, i) => (
              <div key={i} className="w-full bg-[hsl(var(--primary))] rounded-t-md transition-all hover:bg-[hsl(var(--primary))/0.8]" style={{ height: `${val}%` }}></div>
            ))}
          </div>
        </div>
        <div className="col-span-3 glass rounded-xl p-6">
          <div className="flex flex-col space-y-1.5 pb-4 border-b border-[hsl(var(--border))] mb-4">
            <h3 className="font-semibold leading-none tracking-tight">10 Pengguna Terbaru</h3>
          </div>
          <div className="space-y-4">
            {users.slice(0, 10).map((u) => (
               <div key={u.id} className="flex items-center">
                <div className="w-9 h-9 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mr-4">
                  <span className="text-xs font-bold">{u.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium leading-none">{u.name}</p>
                  <p className="text-sm text-[hsl(var(--muted-foreground))]">{u.email}</p>
                </div>
                <div className="font-medium text-xs text-[hsl(var(--primary))]">{u.role}</div>
              </div>
            ))}
            {users.length === 0 && <p className="text-sm text-gray-500">Belum ada pengguna di database...</p>}
          </div>
        </div>
      </div>
    </div>
  );

  // FEATURE 2: User Management
  const renderUsers = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h2>
        <button onClick={() => setIsUserModalOpen(true)} className="bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-blue-500/30">
          <Plus className="w-4 h-4" /> Tambah Pengguna
        </button>
      </div>
      <div className="glass rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
            <tr>
              <th className="px-6 py-4 font-medium">Nama Lengkap</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Peran (Role)</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border))]">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center">Memuat dari Database...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-4 text-center">Database kosong, silakan klik tombol biru di atas untuk menambah pengguna.</td></tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-[hsl(var(--muted))/50] transition-colors">
                <td className="px-6 py-4 font-medium text-base">{u.name}</td>
                <td className="px-6 py-4 text-[hsl(var(--muted-foreground))]">{u.email}</td>
                <td className="px-6 py-4 font-medium">{u.role}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setViewingUser(u)} className="p-2 bg-[hsl(var(--muted))] hover:bg-[hsl(var(--border))] rounded-lg transition-colors cursor-pointer text-[hsl(var(--foreground))]">
                     <Info className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // FEATURE 3: Orders
  const renderOrders = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold tracking-tight">Pesanan & Transaksi</h2>
         <button onClick={() => setIsOrderModalOpen(true)} className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-black/20 dark:shadow-white/10">
          <Plus className="w-4 h-4" /> Buat Pesanan Baru
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading && <p className="col-span-full">Memuat pesanan dari database...</p>}
        {orders.map((o) => (
          <div key={o.id} className="glass rounded-xl p-6 flex flex-col gap-4 group">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-[hsl(var(--primary))/10] rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Package2 className="w-6 h-6 text-[hsl(var(--primary))]" />
              </div>
               <span className="text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                {o.status}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-1">#{o.orderNumber}</h3>
              <p className="text-[hsl(var(--muted-foreground))] font-semibold">Rp {o.totalAmount.toLocaleString('id-ID')}</p>
            </div>
            <div className="mt-auto pt-4 border-t border-[hsl(var(--border))]">
               <button onClick={() => setViewingOrder(o)} className="text-sm text-[hsl(var(--primary))] font-medium hover:underline inline-flex items-center">
                Lihat Detail Lengkap <span className="ml-1 transition-transform group-hover:translate-x-1">&rarr;</span>
              </button>
            </div>
          </div>
        ))}
        {orders.length === 0 && !isLoading && (
          <div className="col-span-full text-center py-16 glass rounded-2xl border-dashed border-2 text-[hsl(var(--muted-foreground))]">
             Belum ada pesanan terdaftar di Database. Klik tombol di atas untuk membuat.
          </div>
        )}
      </div>
    </div>
  );

  // FEATURE 4: Reports
  const renderReports = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold tracking-tight">Analisis Laporan</h2>
      <div className="glass rounded-xl p-8 flex flex-col items-center justify-center text-center min-h-[500px] border-dashed border-2 border-[hsl(var(--border))] bg-gradient-to-b from-transparent to-[hsl(var(--muted))/30]">
         <div className="p-4 bg-[hsl(var(--primary))/10] rounded-3xl mb-6 shadow-2xl shadow-[hsl(var(--primary))/20]">
           <FileText className="w-20 h-20 text-[hsl(var(--primary))]" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Laporan Keseluruhan Sistem</h3>
        <p className="text-[hsl(var(--muted-foreground))] max-w-md mb-8 text-lg">
          Kami telah merangkum total <b>{users.length}</b> akun terdaftar dan mencatat <b>{orders.length}</b> transaksi pada Database `dashboard_db` Anda.
        </p>
        <button onClick={() => alert("Laporan PDF Asli sedang dijalankan (Tersimulasi)")} className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] px-8 py-3 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-[hsl(var(--foreground))/20]">
          Unduh Laporan Format .PDF
        </button>
      </div>
    </div>
  );

  // FEATURE 5: Settings
  const renderSettings = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      <h2 className="text-3xl font-bold tracking-tight">Pengaturan Sistem</h2>
      <div className="glass rounded-xl p-8 space-y-10 shadow-lg">
        <div className="space-y-5">
          <h3 className="text-xl font-bold border-b border-[hsl(var(--border))] pb-3 flex items-center gap-2"><Settings className="w-5 h-5"/> Profil Bisnis/Perusahaan</h3>
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Nama Perusahaan Resmi</label>
              <input type="text" className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-shadow font-medium" defaultValue="PT Cipta Inovasi Nusantara" />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Email Kontak Utama</label>
              <input type="email" className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-shadow font-medium" defaultValue="admin@ciptainovasi.id" />
            </div>
          </div>
        </div>

        <div className="space-y-5">
           <h3 className="text-xl font-bold border-b border-[hsl(var(--border))] pb-3 flex items-center gap-2"><Activity className="w-5 h-5"/> Mode Server Database</h3>
          <div className="flex items-center justify-between p-4 bg-[hsl(var(--muted))/50] rounded-lg border border-[hsl(var(--border))]">
            <div className="pr-4">
              <h4 className="font-bold text-[hsl(var(--foreground))] text-base mb-1">Status Koneksi Prisma ORM</h4>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Menghubungkan layanan sistem interface langsung menuju ke PostgreSQL lokal via URL Environment Variables.</p>
            </div>
            <div className="shrink-0">
               <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 font-bold text-sm flex items-center gap-2 animate-pulse">
                 AKTIF
               </span>
            </div>
          </div>
        </div>

        <button onClick={handleSaveSettings} className="w-full bg-[hsl(var(--primary))] text-white px-4 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-transform active:scale-95 shadow-xl shadow-blue-500/30">
          Simpan Ke Database
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#020817] overflow-hidden font-sans relative">
      
      {/* MODALS TAMBAH DATA (sudah ada) */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <form onSubmit={submitUser} className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 bg-[hsl(var(--background))]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Pengguna Baru</h3>
              <button type="button" onClick={() => setIsUserModalOpen(false)} className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-2">Nama Lengkap</label>
                <input required type="text" value={newUser.name} onChange={e=>setNewUser({...newUser, name: e.target.value})} className="w-full bg-transparent border border-[hsl(var(--input))] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-shadow" placeholder="Cth: Budiman Santoso" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Alamat Email</label>
                <input required type="email" value={newUser.email} onChange={e=>setNewUser({...newUser, email: e.target.value})} className="w-full bg-transparent border border-[hsl(var(--input))] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-shadow" placeholder="Cth: budi@contoh.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Tingkat Akses (Role)</label>
                <select value={newUser.role} onChange={e=>setNewUser({...newUser, role: e.target.value})} className="w-full bg-transparent border border-[hsl(var(--input))] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-shadow appearance-none cursor-pointer">
                  <option className="bg-[hsl(var(--background))]" value="Admin">Admin Utama</option>
                  <option className="bg-[hsl(var(--background))]" value="Staff">Staff Regular</option>
                  <option className="bg-[hsl(var(--background))]" value="Manajer">Manajer Cabang</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setIsUserModalOpen(false)} className="flex-1 py-3 px-4 rounded-xl font-bold border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">Batal</button>
              <button disabled={isSubmitting} type="submit" className="flex-1 py-3 px-4 rounded-xl font-bold bg-[hsl(var(--primary))] text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                {isSubmitting ? "Menyimpan..." : "Simpan Data"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={submitOrder} className="glass w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 bg-[hsl(var(--background))]">
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Pesanan Baru</h3>
              <button type="button" onClick={() => setIsOrderModalOpen(false)} className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-2">Total Harga Pesanan (IDR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[hsl(var(--muted-foreground))]">Rp</span>
                  <input required type="number" min="0" value={newOrder.amount} onChange={e=>setNewOrder({amount: e.target.value})} className="w-full bg-transparent border border-[hsl(var(--input))] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-shadow text-lg font-medium" placeholder="450000" />
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 text-justify">ID Pesanan otomatis dibuat oleh sistem.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setIsOrderModalOpen(false)} className="flex-1 py-3 px-4 rounded-xl font-bold border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">Batal</button>
              <button disabled={isSubmitting} type="submit" className="flex-1 py-3 px-4 rounded-xl font-bold bg-[hsl(var(--foreground))] text-[hsl(var(--background))] hover:opacity-90 transition-opacity disabled:opacity-50">
                {isSubmitting ? "Menyimpan..." : "Buat Order"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL LIHAT DETAIL USER */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 bg-[hsl(var(--background))] relative overflow-hidden">
             
             {/* Gradient Background Top Decorative */}
             <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 blur-xl"></div>
             
             <div className="flex items-start justify-between mb-2 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[hsl(var(--primary))] text-white flex items-center justify-center font-bold text-xl shadow-lg border-2 border-[hsl(var(--background))]">
                    {viewingUser.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold leading-none mb-1">{viewingUser.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold dark:bg-emerald-900/30 dark:text-emerald-400 uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/30">
                      {viewingUser.status}
                    </span>
                  </div>
                </div>
                <button onClick={() => setViewingUser(null)} className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors bg-[hsl(var(--background))] text-[hsl(var(--muted-foreground))] shadow-sm border border-[hsl(var(--border))]">
                  <X className="w-4 h-4" />
                </button>
             </div>
  
             <div className="mt-8 space-y-4 relative z-10 bg-[hsl(var(--muted))]/50 p-4 rounded-xl border border-[hsl(var(--border))]">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-[hsl(var(--background))] rounded-lg shadow-sm">
                      <Settings className="w-4 h-4 text-[hsl(var(--primary))]" />
                   </div>
                   <div>
                     <p className="text-xs text-[hsl(var(--muted-foreground))] font-semibold uppercase tracking-wider">Peran Pengguna</p>
                     <p className="font-semibold text-sm">{viewingUser.role}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-[hsl(var(--background))] rounded-lg shadow-sm">
                      <Users className="w-4 h-4 text-[hsl(var(--primary))]" />
                   </div>
                   <div>
                     <p className="text-xs text-[hsl(var(--muted-foreground))] font-semibold uppercase tracking-wider">Alamat Email</p>
                     <p className="font-semibold text-sm break-all">{viewingUser.email}</p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-[hsl(var(--background))] rounded-lg shadow-sm">
                      <Calendar className="w-4 h-4 text-[hsl(var(--primary))]" />
                   </div>
                   <div>
                     <p className="text-xs text-[hsl(var(--muted-foreground))] font-semibold uppercase tracking-wider">Tanggal Bergabung</p>
                     <p className="font-semibold text-sm">{formatDate(viewingUser.createdAt)}</p>
                   </div>
                </div>
             </div>

             <div className="mt-6 flex gap-3">
                <button className="flex-1 py-3 px-4 rounded-xl font-bold bg-[hsl(var(--foreground))] text-[hsl(var(--background))] hover:scale-[1.02] transition-transform text-sm shadow-md">Edit Profil</button>
                <button className="py-3 px-5 rounded-xl font-bold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-sm border border-red-500/20">Hapus</button>
             </div>
           </div>
        </div>
      )}

      {/* MODAL LIHAT DETAIL ORDER */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="glass w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 bg-[hsl(var(--background))]">
             <div className="flex items-start justify-between mb-2">
                <div className="mb-6">
                   <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-widest">
                    {viewingOrder.status}
                   </span>
                   <h3 className="text-3xl font-black mt-4 truncate">#{viewingOrder.orderNumber}</h3>
                </div>
                <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors text-[hsl(var(--muted-foreground))]">
                  <X className="w-5 h-5" />
                </button>
             </div>

             <div className="border-t border-b border-[hsl(var(--border))] py-6 my-4">
                <div className="flex justify-between items-end">
                   <div>
                     <p className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">Total Harga</p>
                     <p className="text-3xl font-bold text-[hsl(var(--primary))]">
                       Rp {viewingOrder.totalAmount.toLocaleString('id-ID')}
                     </p>
                   </div>
                </div>
             </div>
             
             <div className="space-y-3 mb-6 bg-[hsl(var(--muted))]/30 p-4 rounded-xl">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-[hsl(var(--muted-foreground))] font-medium">Dibuat pada:</span>
                   <span className="font-semibold text-right max-w-[60%]">{formatDate(viewingOrder.createdAt)}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-[hsl(var(--muted-foreground))] font-medium">Metode Pembayaran:</span>
                   <span className="font-semibold">Transfer Bank</span>
                 </div>
             </div>

             <button className="w-full py-3.5 px-4 rounded-xl font-bold bg-[hsl(var(--foreground))] text-[hsl(var(--background))] hover:scale-[1.02] transition-transform text-sm shadow-xl flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> Unduh Invoice PDF
             </button>
           </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        transition-all duration-300 ease-in-out glass z-20 h-full flex flex-col pt-6 border-r border-[hsl(var(--border))]
      `}>
        <div className="px-6 flex items-center justify-between mb-8 cursor-pointer group" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen && <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">NEXUS</span>}
          <div className={`p-2 rounded-xl bg-[hsl(var(--muted))] group-hover:bg-[hsl(var(--primary))] group-hover:text-white transition-colors duration-300 ${!isSidebarOpen && 'mx-auto'}`}>
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-3 mt-4">
           {navigations.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center p-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-[hsl(var(--primary))] text-white shadow-lg shadow-blue-500/30' 
                    : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'}
                `}
              >
                {isActive && <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>}
                <Icon className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {isSidebarOpen && <span className="font-bold text-sm tracking-wide">{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Layout */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[hsl(var(--primary))]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[hsl(var(--primary))]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        {/* Header */}
        <header className="h-20 glass border-b border-[hsl(var(--border))] flex items-center justify-between pl-6 pr-8 z-10 shrink-0 shadow-sm">
          <div className="flex items-center flex-1">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 mr-4 rounded-lg hover:bg-[hsl(var(--muted))] md:hidden transition-colors">
                <Menu className="w-6 h-6" />
             </button>
             <div className="relative w-full max-w-lg hidden md:block group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))] group-focus-within:text-[hsl(var(--primary))] transition-colors" />
               <input 
                 type="text" 
                 placeholder="Telusuri data dari pgAdmin..." 
                 className="w-full pl-12 pr-4 py-2.5 bg-[hsl(var(--background))]/50 border border-[hsl(var(--border))] rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50 transition-all focus:bg-[hsl(var(--background))]"
               />
             </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => alert("Menampilkan Log Server...")} className="relative p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors group">
              <Bell className="w-5 h-5 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))] transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce border-2 border-[hsl(var(--card))]"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-transform cursor-pointer border-2 border-[hsl(var(--background))]">
              AD
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 z-10 relative">
          <div className="max-w-7xl mx-auto pb-20">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </main>
    </div>
  );
}

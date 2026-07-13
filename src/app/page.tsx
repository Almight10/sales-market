'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, ShoppingCart, FileText, Settings, 
  Menu, Bell, Search, Activity, CreditCard, DollarSign, 
  Package2, MoreHorizontal, Plus, X, User as UserIcon, Calendar, Info,
  Lock, Mail, ArrowRight, Eye, EyeOff, LogOut, Truck, Warehouse, Boxes, Briefcase
} from 'lucide-react';

import { getUsers, createUser, getOrders, createOrder, loginUser, getSCMData, createSupplier, createInventory } from './actions';

const navigations = [
  { id: 'dashboard', label: 'Dasbor Utama', icon: BarChart3 },
  { id: 'users', label: 'Manajemen Pengguna', icon: Users },
  { id: 'orders', label: 'Pesanan & Transaksi', icon: ShoppingCart },
  { id: 'scm', label: 'Rantai Pasok (SCM)', icon: Truck },
  { id: 'reports', label: 'Analisis Laporan', icon: FileText },
  { id: 'settings', label: 'Pengaturan Sistem', icon: Settings },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // States dari Database
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [inventories, setInventories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal States (Tambah Data)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Modal States (Lihat Detail)
  const [viewingUser, setViewingUser] = useState<any | null>(null);
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);

  // Form States
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Staff' });
  const [newOrder, setNewOrder] = useState({ amount: '' });
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '' });
  const [newInventory, setNewInventory] = useState({ itemName: '', stock: '', supplierId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Cek status autentikasi dari query params (Google OAuth) atau localStorage/sessionStorage
    const params = new URLSearchParams(window.location.search);
    const oauthSuccess = params.get('oauth_success');
    const oauthError = params.get('oauth_error');

    if (oauthSuccess === 'true') {
      localStorage.setItem('nexus_auth', 'true');
      sessionStorage.setItem('nexus_auth', 'true');
      setIsLoggedIn(true);
      // Bersihkan query parameters dari URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      if (oauthError) {
        alert(`Gagal login dengan Google: ${oauthError}`);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      const authStatus = sessionStorage.getItem('nexus_auth') || localStorage.getItem('nexus_auth');
      if (authStatus === 'true') {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [activeTab, isLoggedIn]);

  const fetchData = async () => {
    setIsLoading(true);
    const dbUsers = await getUsers();
    const dbOrders = await getOrders();
    const scmData = await getSCMData();
    
    setUsers(dbUsers);
    setOrders(dbOrders);
    setSuppliers(scmData.suppliers);
    setInventories(scmData.inventory);
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

  const submitSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createSupplier(newSupplier.name, newSupplier.contact);
    if (res.success) {
      setIsSupplierModalOpen(false);
      setNewSupplier({ name: '', contact: '' });
      fetchData();
    } else {
      alert(res.message);
    }
    setIsSubmitting(false);
  };

  const submitInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createInventory(newInventory.itemName, Number(newInventory.stock), newInventory.supplierId);
    if (res.success) {
      setIsInventoryModalOpen(false);
      setNewInventory({ itemName: '', stock: '', supplierId: '' });
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

  // FEATURE: SCM (Rantai Pasok)
  const renderSCM = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
         <h2 className="text-3xl font-bold tracking-tight">Manajemen Rantai Pasok (SCM)</h2>
         <div className="flex gap-2">
           <button onClick={() => setIsSupplierModalOpen(true)} className="bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm border border-[hsl(var(--border))]">
            <Truck className="w-4 h-4" /> Tambah Pemasok
          </button>
           <button onClick={() => setIsInventoryModalOpen(true)} className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-blue-500/30">
            <Boxes className="w-4 h-4" /> Masukkan Barang
          </button>
         </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Suppliers List */}
        <div className="glass rounded-xl p-6 shadow-sm border border-[hsl(var(--border))] flex flex-col h-full">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[hsl(var(--border))]">
              <div className="p-2 bg-[hsl(var(--primary))/10] rounded-xl text-[hsl(var(--primary))]">
                 <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Daftar Pemasok Utama</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Kelola mitra dan supplier bisnis.</p>
              </div>
           </div>
           
           <div className="space-y-4 flex-1">
             {isLoading ? <p>Memuat pemasok...</p> : suppliers.length === 0 ? (
               <div className="py-8 text-center text-[hsl(var(--muted-foreground))] border-dashed border-2 rounded-xl border-[hsl(var(--border))]">
                 Belum ada data pemasok
               </div>
             ) : (
               suppliers.map((s) => (
                 <div key={s.id} className="flex justify-between items-center p-4 border border-[hsl(var(--border))] rounded-xl hover:bg-[hsl(var(--muted))/50] transition-colors">
                   <div>
                     <p className="font-bold">{s.name}</p>
                     <p className="text-sm text-[hsl(var(--muted-foreground))] flex items-center gap-1 mt-1"><Mail className="w-3 h-3"/> {s.contact}</p>
                   </div>
                   <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold dark:bg-emerald-900/30 dark:text-emerald-400 uppercase border border-emerald-200 dark:border-emerald-800/30">
                     Aktif
                   </span>
                 </div>
               ))
             )}
           </div>
        </div>

        {/* Inventory List */}
        <div className="glass rounded-xl p-6 shadow-sm border border-[hsl(var(--border))] flex flex-col h-full">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[hsl(var(--border))]">
              <div className="p-2 bg-[hsl(var(--foreground))] text-[hsl(var(--background))] rounded-xl">
                 <Warehouse className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Gudang Inventaris</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">Pantau stok bahan dan barang gudang secara real-time.</p>
              </div>
           </div>
           
           <div className="space-y-4 flex-1">
             {isLoading ? <p>Memuat inventaris...</p> : inventories.length === 0 ? (
               <div className="py-8 text-center text-[hsl(var(--muted-foreground))] border-dashed border-2 rounded-xl border-[hsl(var(--border))]">
                 Gudang inventaris masih kosong
               </div>
             ) : (
               inventories.map((inv) => (
                 <div key={inv.id} className="flex justify-between items-center p-4 border border-[hsl(var(--border))] rounded-xl hover:bg-[hsl(var(--muted))/50] transition-colors">
                   <div className="flex gap-4 items-center">
                     <div className="w-10 h-10 bg-[hsl(var(--muted))] rounded-lg flex items-center justify-center text-[hsl(var(--primary))] font-bold shadow-inner">
                       {inv.stock}
                     </div>
                     <div>
                       <p className="font-bold text-[hsl(var(--foreground))]">{inv.itemName}</p>
                       <p className="text-xs text-[hsl(var(--muted-foreground))] font-semibold mt-1">Pemasok: {inv.supplier?.name || "Tidak Diketahui"}</p>
                     </div>
                   </div>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${inv.stock > 10 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 border-blue-200' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 border-orange-200'}`}>
                     {inv.status}
                   </span>
                 </div>
               ))
             )}
           </div>
        </div>
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

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const result = await loginUser(loginEmail, loginPassword);
      if (result.success) {
        localStorage.setItem('nexus_auth', 'true');
        setIsLoggedIn(true);
      } else {
        alert(result.message || "Gagal masuk");
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem saat mencoba masuk.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_auth');
    sessionStorage.removeItem('nexus_auth');
    setIsLoggedIn(false);
  };

  // FEATURE: Homepage / Landing Page
  const renderHomepage = () => (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 overflow-x-hidden font-sans">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-indigo-600/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white">NEXUS<span className="text-blue-400">.</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Fitur</a>
          <a href="#stats" className="hover:text-white transition-colors">Statistik</a>
          <a href="#about" className="hover:text-white transition-colors">Tentang</a>
        </div>
        <button
          id="nav-login-btn"
          onClick={() => setShowLoginForm(true)}
          className="px-5 py-2.5 rounded-xl border border-white/20 text-white text-sm font-bold hover:bg-white/10 transition-all hover:border-white/40"
        >
          Masuk
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          Platform ERP Terpadu & Real-time
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100" style={{ textShadow: '0 0 80px rgba(99,102,241,0.3)' }}>
          Kelola Bisnis Anda<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">Dengan Cerdas.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
          Nexus ERP menyatukan manajemen pengguna, transaksi, rantai pasok, dan laporan bisnis Anda dalam satu platform yang powerful dan mudah digunakan.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-300">
          <button
            id="hero-cta-btn"
            onClick={() => setShowLoginForm(true)}
            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg hover:from-blue-500 hover:to-indigo-500 transition-all transform hover:scale-[1.03] shadow-2xl shadow-blue-500/30 flex items-center gap-3"
          >
            Masuk ke Sistem <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a href="#features" className="px-8 py-4 rounded-2xl border border-white/10 text-slate-300 font-semibold text-lg hover:bg-white/5 hover:border-white/20 transition-all">
            Lihat Fitur
          </a>
        </div>

        {/* Dashboard Preview Card */}
        <div className="mt-20 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-1 shadow-2xl shadow-black/50">
            <div className="rounded-xl bg-gradient-to-b from-slate-800/80 to-slate-900/80 p-6">
              {/* Fake Dashboard Header */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="flex-1 ml-4 h-6 bg-white/5 rounded-lg" />
              </div>
              {/* Fake Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Pengguna', value: '2,847', color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/20' },
                  { label: 'Total Pesanan', value: '12,590', color: 'from-indigo-500/20 to-indigo-600/20', border: 'border-indigo-500/20' },
                  { label: 'Pendapatan', value: 'Rp 4.2M', color: 'from-cyan-500/20 to-cyan-600/20', border: 'border-cyan-500/20' },
                  { label: 'Sistem Aktif', value: '100%', color: 'from-emerald-500/20 to-emerald-600/20', border: 'border-emerald-500/20' },
                ].map((s, i) => (
                  <div key={i} className={`rounded-xl p-4 bg-gradient-to-b ${s.color} border ${s.border}`}>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{s.label}</p>
                    <p className="text-xl font-black text-white">{s.value}</p>
                  </div>
                ))}
              </div>
              {/* Fake Bar Chart */}
              <div className="flex items-end gap-2 h-24">
                {[45, 72, 55, 88, 60, 78, 92, 65, 85, 70, 95, 80].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600/40 to-indigo-500/60" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-10 px-8 md:px-16 py-20 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '99.9%', label: 'Uptime Server', suffix: '' },
            { value: '50+', label: 'Fitur Terintegrasi', suffix: '' },
            { value: '3ms', label: 'Rata-rata Latensi DB', suffix: '' },
            { value: '100%', label: 'Open Source', suffix: '' },
          ].map((s, i) => (
            <div key={i} className="group">
              <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">{s.value}</p>
              <p className="text-slate-400 text-sm font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-8 md:px-16 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-4">Semua yang Anda Butuhkan</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">Fitur Unggulan Platform</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: 'Dasbor Analitik', desc: 'Pantau performa bisnis secara real-time dengan visualisasi data yang kaya dan interaktif.', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
              { icon: Users, title: 'Manajemen Pengguna', desc: 'Kelola akses dan peran tim Anda dengan sistem RBAC (Role-Based Access Control) yang canggih.', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
              { icon: ShoppingCart, title: 'Pesanan & Transaksi', desc: 'Lacak seluruh siklus pesanan dari pembuatan hingga penyelesaian dalam satu tampilan terpadu.', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
              { icon: Truck, title: 'Rantai Pasok (SCM)', desc: 'Optimalkan hubungan dengan pemasok dan kelola inventaris gudang Anda secara efisien.', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
              { icon: FileText, title: 'Laporan & Analisis', desc: 'Hasilkan laporan mendalam yang membantu pengambilan keputusan bisnis yang lebih baik.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
              { icon: Settings, title: 'Konfigurasi Sistem', desc: 'Sesuaikan setiap aspek platform dengan kebutuhan unik bisnis dan perusahaan Anda.', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
            ].map((f, i) => (
              <div key={i} className={`group p-6 rounded-2xl border bg-white/3 backdrop-blur-sm hover:bg-white/8 transition-all duration-300 hover:-translate-y-1 ${f.bg}`}>
                <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-5`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section id="about" className="relative z-10 px-8 md:px-16 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Siap Memulai?</h2>
          <p className="text-slate-400 text-lg mb-10">Masuk ke sistem Nexus ERP sekarang dan rasakan perbedaannya.</p>
          <button
            id="footer-cta-btn"
            onClick={() => setShowLoginForm(true)}
            className="group px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl hover:from-blue-500 hover:to-indigo-500 transition-all transform hover:scale-[1.03] shadow-2xl shadow-blue-500/30 flex items-center gap-3 mx-auto"
          >
            Masuk ke Sistem <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-8 py-6 text-center text-slate-600 text-sm">
        © 2026 Nexus ERP · PT Cipta Inovasi Nusantara · All rights reserved.
      </footer>
    </div>
  );

  // FEATURE: Login Screen
  const renderLogin = () => (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[60%] h-[60%] bg-indigo-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 mb-6 shadow-2xl shadow-blue-500/30">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-3">Selamat Datang</h1>
          <p className="text-slate-400 text-lg">Masuk ke sistem ERP Nexus</p>
        </div>

        {/* Back to homepage */}
        <button onClick={() => setShowLoginForm(false)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold mb-6 group">
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
        </button>
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-500 delay-150 fill-mode-both relative overflow-hidden">
          {/* Shimmer effect line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
          
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white ml-1">Alamat Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))] group-focus-within:text-[hsl(var(--primary))] transition-colors" />
                <input 
                  type="email" 
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@ciptainovasi.id"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-white ml-1">Kata Sandi</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--muted-foreground))] group-focus-within:text-[hsl(var(--primary))] transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 text-white placeholder:text-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 mb-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-[hsl(var(--border))] text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]/50 bg-transparent transition-colors cursor-pointer" />
                <span className="text-sm text-slate-400 group-hover:text-white transition-colors">Ingat saya</span>
              </label>
              <a href="#" className="text-sm font-bold text-blue-400 hover:underline">Lupa Sandi?</a>
            </div>

            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none group"
            >
              {loginLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Masuk Sistem <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6 flex py-2 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">atau</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            type="button"
            onClick={() => window.location.href = '/api/auth/google'}
            className="w-full bg-white/10 border border-white/10 text-white py-4 rounded-2xl font-bold text-lg hover:bg-white/15 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Masuk dengan Google
          </button>
          
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <p className="text-sm text-slate-500">
              Belum memiliki akses? <a href="#" className="font-bold text-slate-300 hover:text-white transition-colors">Hubungi Administrator</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoggedIn === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isLoggedIn === false) {
    if (showLoginForm) return renderLogin();
    return renderHomepage();
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans relative">
      
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

      {/* MODALS SCM */}
      {isSupplierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
           <form onSubmit={submitSupplier} className="glass w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 bg-[hsl(var(--background))]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Pemasok Baru</h3>
              <button type="button" onClick={() => setIsSupplierModalOpen(false)} className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-2">Nama Perusahaan / Pemasok</label>
                <input required type="text" value={newSupplier.name} onChange={e=>setNewSupplier({...newSupplier, name: e.target.value})} className="w-full bg-transparent border border-[hsl(var(--input))] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-shadow" placeholder="Cth: PT Sumber Makmur" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Kontak Email / Telepon</label>
                <input required type="text" value={newSupplier.contact} onChange={e=>setNewSupplier({...newSupplier, contact: e.target.value})} className="w-full bg-transparent border border-[hsl(var(--input))] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-shadow" placeholder="Cth: admin@sumber.com" />
              </div>
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => setIsSupplierModalOpen(false)} className="flex-1 py-3 px-4 rounded-xl font-bold border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">Batal</button>
              <button disabled={isSubmitting} type="submit" className="flex-1 py-3 px-4 rounded-xl font-bold bg-[hsl(var(--primary))] text-white hover:opacity-90 transition-opacity disabled:opacity-50">
                {isSubmitting ? "Menyimpan..." : "Simpan Data"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isInventoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={submitInventory} className="glass w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 bg-[hsl(var(--background))]">
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Barang Baru (Inventaris)</h3>
              <button type="button" onClick={() => setIsInventoryModalOpen(false)} className="p-2 hover:bg-[hsl(var(--muted))] rounded-full transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-2">Nama Barang</label>
                <input required type="text" value={newInventory.itemName} onChange={e=>setNewInventory({...newInventory, itemName: e.target.value})} className="w-full bg-transparent border border-[hsl(var(--input))] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-shadow font-medium" placeholder="Cth: Kertas HVS A4" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="col-span-2">
                   <label className="block text-sm font-semibold mb-2">Pilih Pemasok (Opsional)</label>
                   <select value={newInventory.supplierId} onChange={e=>setNewInventory({...newInventory, supplierId: e.target.value})} className="w-full bg-transparent border border-[hsl(var(--input))] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-shadow appearance-none cursor-pointer">
                     <option value="" className="bg-[hsl(var(--background))]">-- Tanpa Pemasok --</option>
                     {suppliers.map(s => (
                        <option key={s.id} value={s.id} className="bg-[hsl(var(--background))]">{s.name}</option>
                     ))}
                   </select>
                 </div>
                 <div className="col-span-2">
                   <label className="block text-sm font-semibold mb-2">Jumlah Stok</label>
                   <input required type="number" min="0" value={newInventory.stock} onChange={e=>setNewInventory({...newInventory, stock: e.target.value})} className="w-full bg-transparent border border-[hsl(var(--input))] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] transition-shadow font-medium" placeholder="0" />
                 </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button type="button" onClick={() => setIsInventoryModalOpen(false)} className="flex-1 py-3 px-4 rounded-xl font-bold border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors">Batal</button>
              <button disabled={isSubmitting} type="submit" className="flex-1 py-3 px-4 rounded-xl font-bold bg-[hsl(var(--foreground))] text-[hsl(var(--background))] hover:opacity-90 transition-opacity disabled:opacity-50">
                {isSubmitting ? "Menyimpan..." : "Tambah Stok"}
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

          <div className="flex items-center gap-6 relative">
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-2 rounded-full hover:bg-[hsl(var(--muted))] transition-colors group">
                <Bell className="w-5 h-5 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))] transition-colors" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-bounce border-2 border-[hsl(var(--card))]"></span>
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 glass rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 bg-[hsl(var(--background))] border border-[hsl(var(--border))] overflow-hidden z-50">
                  <div className="p-4 border-b border-[hsl(var(--border))] flex justify-between items-center bg-[hsl(var(--muted))]/30">
                    <h3 className="font-bold text-sm">Notifikasi Server</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-600 rounded-full">2 Baru</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    <div className="p-4 border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50 transition-colors cursor-pointer flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Pengguna Baru Mendaftar</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 line-clamp-2">Seseorang baru saja ditambahkan ke sistem.</p>
                        <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1 font-medium">Baru saja</p>
                      </div>
                    </div>
                    <div className="p-4 border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/50 transition-colors cursor-pointer flex gap-3 bg-[hsl(var(--primary))]/5">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Pesanan Tertunda</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 line-clamp-2">Ada pesanan terbaru di database yang perlu diproses.</p>
                        <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1 font-medium">2 jam yang lalu</p>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-[hsl(var(--muted))]/50 transition-colors cursor-pointer flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Sistem Stabil</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5 line-clamp-2">Semua kluster load-balancer beroperasi 100%.</p>
                        <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-1 font-medium">1 hari yang lalu</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 border-t border-[hsl(var(--border))] text-center bg-[hsl(var(--muted))]/20">
                    <button className="text-xs font-bold text-[hsl(var(--primary))] hover:underline">Tandai semua dibaca</button>
                  </div>
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="relative p-2 rounded-full hover:bg-red-500/10 text-[hsl(var(--muted-foreground))] hover:text-red-500 transition-colors group" title="Keluar">
              <LogOut className="w-5 h-5 transition-colors" />
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
            {activeTab === 'scm' && renderSCM()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </div>
      </main>
    </div>
  );
}

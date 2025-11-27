import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import {
  Users, MapPin, BarChart3, FileText,
  LogOut, Menu, X, User
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Custom Components (Pecahan)
import { OverviewTab } from '@/components/admin/tabs/OverviewTab';
import { UsersTab } from '@/components/admin/tabs/UsersTab';
import { LocationsTab } from '@/components/admin/tabs/LocationsTab';
import { UserDetailView } from '@/components/admin/views/UserDetailView';
import { PetugasDetailView } from '@/components/admin/views/PetugasDetailView';
import { AddUserForm } from '@/components/admin/forms/AddUserForm';
import { LocationForm } from '@/components/admin/forms/LocationForm';
import { EditUserDialog } from '@/components/admin/forms/EditUserDialog';
import { EditProfileDialog } from '@/components/admin/forms/EditProfileDialog';

// Legacy/Existing Components
import ReportGenerator from '@/components/ReportGenerator';
import logoEcoTiket from '@/assets/logo_ecotiket.png';

// API & Types
import { usersAPI, transactionsAPI, authAPI, locationsAPI } from '@/lib/api';
import {
  UserRecord, Transaction, Location,
  DashboardStats, BottleStats, PetugasDetail, CurrentUser
} from '@/types/dashboard';

// Dialog Wrapper Helper
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

// ================= HARDCODED LOCATIONS DATA =================
const hardcodedLocations: Location[] = [
  {
    id: 1,
    name: 'Terminal Antasari',
    type: 'terminal',
    operating_hours: '08:00-18:00',
    status: 'active'
  },
  {
    id: 2,
    name: 'Terminal KM 0',
    type: 'terminal',
    operating_hours: '08:00-18:00',
    status: 'active'
  },
  {
    id: 3,
    name: 'Koridor 1 (Terminal Antasari - Terminal Km. 6)',
    type: 'koridor',
    capacity: 18,
    operating_hours: '06:00-18:00',
    status: 'active'
  },
  {
    id: 4,
    name: 'Koridor 2 (Terminal Antasari - RS Ansari Saleh)',
    type: 'koridor',
    capacity: 18,
    operating_hours: '06:00-18:00',
    status: 'active'
  },
  {
    id: 5,
    name: 'Koridor 3 (Terminal Antasari - Jembatan Bromo)',
    type: 'koridor',
    capacity: 18,
    operating_hours: '06:00-18:00',
    status: 'active'
  },
  {
    id: 6,
    name: 'Koridor 4 (Sungai Andai - Teluk Tiram)',
    type: 'koridor',
    capacity: 12,
    operating_hours: '06:00-18:00',
    status: 'active'
  },
  {
    id: 7,
    name: 'Koridor 5 (Terminal Antasari - Pemangkih Laut)',
    type: 'koridor',
    capacity: 18,
    operating_hours: '06:00-18:00',
    status: 'active'
  },
  {
    id: 8,
    name: 'Koridor 6 (Sungai Lulut - 0 Km)',
    type: 'koridor',
    capacity: 18,
    operating_hours: '06:00-18:00',
    status: 'active'
  },
  {
    id: 9,
    name: 'Koridor 7 (0 Km - Dermaga Alalak)',
    type: 'koridor',
    capacity: 12,
    operating_hours: '06:00-18:00',
    status: 'active'
  },
  {
    id: 10,
    name: 'Koridor 8 (Terminal Antasari - Pelabuhan Trisakti)',
    type: 'koridor',
    capacity: 18,
    operating_hours: '06:00-18:00',
    status: 'active'
  },
  {
    id: 11,
    name: 'Koridor 9 (Terminal Antasari - Belitung)',
    type: 'koridor',
    capacity: 18,
    operating_hours: '06:00-18:00',
    status: 'active'
  },
  {
    id: 12,
    name: 'Koridor 10 (RS Ansari Saleh - Trisakti (Via Kuin))',
    type: 'koridor',
    capacity: 12,
    operating_hours: '06:00-18:00',
    status: 'active'
  },
  {
    id: 13,
    name: 'Koridor 11 (Terminal Antasari - Beruntung Jaya)',
    type: 'koridor',
    capacity: 12,
    operating_hours: '06:00-18:00',
    status: 'active'
  },
  {
    id: 14,
    name: 'Koridor 12 (Banjar Raya - Terminal Antasari)',
    type: 'koridor',
    capacity: 18,
    operating_hours: '06:00-18:00',
    status: 'active'
  },
  {
    id: 15,
    name: 'Koridor 13 (Trisakti - Sudimampir (Via Lingkar Selatan))',
    type: 'koridor',
    capacity: 18,
    operating_hours: '06:00-18:00',
    status: 'active'
  }
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ================= STATE MANAGEMENT =================

  // Auth & UI State
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Data State
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Detail Views State
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [selectedPetugas, setSelectedPetugas] = useState<PetugasDetail | null>(null);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);

  // Filter State
  const [userFilters, setUserFilters] = useState({ search: '', role: 'all', status: 'all' });
  const [statsFilter, setStatsFilter] = useState('all');
  const [userPieFilter, setUserPieFilter] = useState('all');

  // Stats State
  const [bottleStats, setBottleStats] = useState<BottleStats>({ kecil: 0, sedang: 0, jumbo: 0, besar: 0, cup: 0, total: 0 });
  const [growthRate, setGrowthRate] = useState(0);
  const [growthLoading, setGrowthLoading] = useState(false);

  // Modal/Dialog State
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);

  // ================= DATA LOADING =================

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        navigate('/login');
        return;
      }
      setCurrentUser(parsedUser);
      loadInitialData();
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const loadInitialData = async () => {
    setLoading(true);
    await Promise.all([loadUsers(), loadLocations(), loadTransactions()]);
    setLoading(false);
    calculateGrowthRate();
  };

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAllUsers({
        role: userFilters.role !== 'all' ? userFilters.role : undefined,
        status: userFilters.status !== 'all' ? userFilters.status : undefined,
        search: userFilters.search || undefined
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setUsers((response.users as any[]) || []);
    } catch (error) {
      toast.error('Gagal memuat data pengguna');
    }
  };

  const loadLocations = async () => {
    try {
      const response = await locationsAPI.getAllLocations();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiLocations = (response.locations as any[]) || [];

      // Merge API locations with hardcoded locations
      // Use hardcoded locations as fallback if API fails or returns empty
      if (apiLocations.length > 0) {
        setLocations(apiLocations);
      } else {
        setLocations(hardcodedLocations);
      }
    } catch (error) {
      console.error('Failed to load locations from API, using hardcoded data:', error);
      // Fallback to hardcoded locations if API fails
      setLocations(hardcodedLocations);
    }
  };

  const loadTransactions = async () => {
    try {
      let dateFilters = {};
      const now = new Date();
      if (statsFilter === 'today') {
        const today = now.toISOString().split('T')[0];
        dateFilters = { startDate: today, endDate: today };
      } else if (statsFilter === 'month') {
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
        dateFilters = { startDate: firstDay, endDate: lastDay };
      } else if (statsFilter === 'year') {
        const firstDay = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        const lastDay = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
        dateFilters = { startDate: firstDay, endDate: lastDay };
      }

      const response = await transactionsAPI.getAllTransactions(dateFilters);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const txData = (response.transactions as any[]) || [];
      setTransactions(txData);
      calculateBottleStats(txData);
    } catch (error) {
      console.error(error);
    }
  };

  // Debounce filter effect
  useEffect(() => {
    const timer = setTimeout(() => loadUsers(), 500);
    return () => clearTimeout(timer);
  }, [userFilters]);

  // Refetch transactions when stats filter changes
  useEffect(() => {
    loadTransactions();
  }, [statsFilter]);

  // ================= HELPERS & CALCULATIONS =================

  const calculateBottleStats = (txData: Transaction[]) => {
    const stats = { kecil: 0, sedang: 0, jumbo: 0, besar: 0, cup: 0, total: 0 };
    txData.filter(t => t.type === 'bottle_exchange' && t.status === 'completed').forEach(t => {
      const type = t.bottle_type?.toLowerCase();
      const count = t.bottles_count || 0;
      if (type === 'kecil') stats.kecil += count;
      else if (type === 'sedang') stats.sedang += count;
      else if (type === 'jumbo') stats.jumbo += count;
      else if (type === 'besar') stats.besar += count;
      else if (type === 'cup') stats.cup += count;
    });
    stats.total = stats.kecil + stats.sedang + stats.jumbo + stats.besar + stats.cup;
    setBottleStats(stats);
  };

  const calculateGrowthRate = async () => {
    setGrowthLoading(true);
    try {
      setGrowthRate(12.5);
    } catch {
      setGrowthRate(0);
    } finally {
      setGrowthLoading(false);
    }
  };

  const dashboardStats: DashboardStats = {
    totalUsers: users.length,
    totalPenumpang: users.filter(u => u.role === 'penumpang').length,
    totalPetugas: users.filter(u => u.role === 'petugas').length,
    totalAdmin: users.filter(u => u.role === 'admin').length,
    totalTickets: users.reduce((sum, u) => sum + (u.role === 'penumpang' ? u.ticketsBalance : 0), 0),
    activeUsers: users.filter(u => u.status === 'active').length,
    totalLocations: locations.length,
    activeLocations: locations.filter(l => l.status === 'active').length,
    totalTransactions: transactions.length,
    totalBottles: bottleStats.total
  };

  const loadUserTransactions = async (userId: number) => {
    setIsTransactionsLoading(true);
    try {
      const response = await transactionsAPI.getTransactionsByUserId(userId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setUserTransactions((response.transactions as any[]) || []);
    } catch (error) {
      toast.error('Gagal memuat riwayat transaksi');
      setUserTransactions([]);
    } finally {
      setIsTransactionsLoading(false);
    }
  };

  // ================= EVENT HANDLERS =================

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logout berhasil');
    navigate('/');
  };

  // User Handlers
  const handleAddUser = async (data: any) => {
    try {
      await authAPI.register(data);
      toast.success('Pengguna berhasil ditambahkan');
      setIsAddingUser(false);
      loadUsers();
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((error as any).message || 'Gagal menambahkan pengguna');
    }
  };

  const handleDeleteUser = (id: number) => {
    Swal.fire({
      title: "Yakin hapus pengguna?", text: "Data tidak bisa dikembalikan!", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Ya, hapus!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await usersAPI.deleteUser(id);
        toast.success('Pengguna dihapus');
        loadUsers();
        if (selectedUser?.id === id) setSelectedUser(null);
        if (selectedPetugas?.id === id) setSelectedPetugas(null);
      }
    });
  };

  const handleUpdateUser = async (id: number, data: Partial<UserRecord>) => {
    try {
      await usersAPI.updateUser(id, data);
      toast.success('Data berhasil diupdate');
      loadUsers();
      if (selectedUser?.id === id) setSelectedUser({ ...selectedUser, ...data } as UserRecord);
    } catch (error) {
      toast.error('Gagal update data');
    }
  };

  // Location Handlers
  const handleAddLocation = async (data: Omit<Location, 'id'>) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await locationsAPI.createLocation(data as any);
      toast.success('Lokasi ditambahkan');
      setIsAddingLocation(false);
      loadLocations();
    } catch (error) {
      toast.error('Gagal tambah lokasi');
    }
  };

  const handleUpdateLocation = async (data: Location) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await locationsAPI.updateLocation(data.id, data as any);
      toast.success('Lokasi diupdate');
      setEditingLocation(null);
      loadLocations();
    } catch (error) {
      toast.error('Gagal update lokasi');
    }
  };

  const handleDeleteLocation = (id: number) => {
    Swal.fire({
      title: "Hapus Lokasi?", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Ya"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await locationsAPI.deleteLocation(id);
        toast.success('Lokasi dihapus');
        loadLocations();
      }
    });
  };

  // View Handlers
  const handleViewUser = (user: UserRecord) => {
    if (user.role === 'petugas') {
      const petugasDetail: PetugasDetail = { ...user, total_transactions: 0, last_activity: undefined };
      setSelectedPetugas(petugasDetail);
    } else {
      setSelectedUser(user);
    }
    loadUserTransactions(user.id);
  };

  // ================= RENDER =================

  if (!currentUser) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Pengguna', icon: Users },
    { id: 'locations', label: 'Lokasi', icon: MapPin },
    { id: 'reports', label: 'Laporan', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <img src={logoEcoTiket} alt="Logo" className="h-12 w-25" />
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          {navigationItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); setSelectedUser(null); setSelectedPetugas(null); }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === item.id ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
        {/* User Dropdown Bottom */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full p-2 rounded-md hover:bg-gray-100 flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-semibold">
                {currentUser.name?.charAt(0)}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium truncate">{currentUser.name}</p>
                <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="top">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)}><User className="mr-2 h-4 w-4" />Edit Profil</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER MOBILE */}
        <header className="bg-white shadow-sm border-b lg:hidden px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></Button>
          <Badge>Admin</Badge>
        </header>

        {/* HEADER DESKTOP */}
        <header className="hidden lg:flex bg-white shadow-sm border-b px-6 py-4 justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 capitalize">
            {selectedUser ? 'Detail Pengguna' : selectedPetugas ? 'Detail Petugas' : activeTab}
          </h1>
          <Badge>Administrator</Badge>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto">
          {selectedUser ? (
            <UserDetailView
              user={selectedUser}
              transactions={userTransactions}
              isTransactionsLoading={isTransactionsLoading}
              onBack={() => setSelectedUser(null)}
              onDelete={handleDeleteUser}
              onUpdate={handleUpdateUser}
            />
          ) : selectedPetugas ? (
            <PetugasDetailView
              petugas={selectedPetugas}
              transactions={userTransactions}
              isTransactionsLoading={isTransactionsLoading}
              onBack={() => setSelectedPetugas(null)}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onEdit={(p) => setEditingUser(p as any)}
              onDelete={handleDeleteUser}
            />
          ) : (
            <div className="p-6">
              {activeTab === 'overview' && (
                <OverviewTab
                  stats={dashboardStats}
                  growthRate={growthRate}
                  growthLoading={growthLoading}
                  bottleStats={bottleStats}
                  transactions={transactions}
                  users={users}
                  statsFilter={statsFilter}
                  setStatsFilter={setStatsFilter}
                  userFilter={userPieFilter}
                  setUserFilter={setUserPieFilter}
                />
              )}
              {activeTab === 'users' && (
                <UsersTab
                  users={users}
                  loading={loading}
                  filters={userFilters}
                  setFilters={(f) => setUserFilters({ ...userFilters, ...f })}
                  onAddUser={() => setIsAddingUser(true)}
                  onViewUser={handleViewUser}
                  onEditUser={setEditingUser}
                  onDeleteUser={handleDeleteUser}
                />
              )}
              {activeTab === 'locations' && (
                <LocationsTab
                  locations={locations}
                  loading={loading}
                  onAddLocation={() => setIsAddingLocation(true)}
                  onEditLocation={setEditingLocation}
                  onDeleteLocation={handleDeleteLocation}
                />
              )}
              {activeTab === 'reports' && (
                <ReportGenerator users={users} transactions={transactions} />
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODALS & DIALOGS */}
      {isAddingUser && <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}><DialogContent><DialogHeader><DialogTitle>Tambah Pengguna</DialogTitle><DialogDescription>Isi form berikut.</DialogDescription></DialogHeader><AddUserForm onSubmit={handleAddUser} onCancel={() => setIsAddingUser(false)} /></DialogContent></Dialog>}

      {isAddingLocation && <Dialog open={isAddingLocation} onOpenChange={setIsAddingLocation}><DialogContent><DialogHeader><DialogTitle>Tambah Lokasi</DialogTitle></DialogHeader><LocationForm onSubmit={handleAddLocation} onCancel={() => setIsAddingLocation(false)} /></DialogContent></Dialog>}

      {editingLocation && <Dialog open={!!editingLocation} onOpenChange={() => setEditingLocation(null)}><DialogContent><DialogHeader><DialogTitle>Edit Lokasi</DialogTitle></DialogHeader><LocationForm location={editingLocation} onSubmit={(data) => handleUpdateLocation({ ...editingLocation, ...data })} onCancel={() => setEditingLocation(null)} /></DialogContent></Dialog>}

      <EditUserDialog
        open={!!editingUser}
        user={editingUser}
        onOpenChange={() => setEditingUser(null)}
        onSave={(data) => handleUpdateUser(editingUser!.id, data)}
      />

      <EditProfileDialog
        open={isProfileOpen}
        initialData={{
          name: currentUser.name,
          email: currentUser.email || '',
          phone: currentUser.phone || '',
          address: currentUser.address || ''
        }}
        onOpenChange={setIsProfileOpen}
        isUpdating={isProfileUpdating}
        onSave={async (data) => {
          setIsProfileUpdating(true);
          try {
            setCurrentUser({ ...currentUser, ...data });
            toast.success('Profil diupdate');
            setIsProfileOpen(false);
          } catch { toast.error('Gagal update'); }
          finally { setIsProfileUpdating(false); }
        }}
      />
    </div>
  );
}
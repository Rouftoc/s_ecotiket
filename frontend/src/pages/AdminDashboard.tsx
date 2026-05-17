import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { BarChart3, Users, MapPin, FileText, Database, Settings, LogOut, User, Menu, X, Image as ImageIcon, MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { OverviewTab } from '@/components/admin/tabs/OverviewTab';
import UserManager from '@/components/admin/managers/UserManager';
import LocationManager from '@/components/admin/managers/LocationManager';

import { EditProfile } from '@/components/admin/forms/profile/EditProfile';
import MasterDataView from '@/components/admin/views/MasterDataView';
import NewsManager from '@/components/admin/managers/NewsManager';
import AdminProfile from '@/components/admin/views/AdminProfile';
import AdminChatManager from '@/components/admin/managers/AdminChatManager';

import ReportGenerator from '@/components/admin/managers/ReportGenerator';
import logoEcoTiket from '@/assets/logo_ecotiket.png';
import NotificationBell from '@/components/common/NotificationBell';

import { usersAPI, transactionsAPI, authAPI, locationsAPI } from '@/lib/api';
import {
  UserRecord, Transaction, Location,
  DashboardStats, BottleStats, PetugasDetail, CurrentUser
} from '@/types/dashboard';



// Hardcoded locations removed. Using real data from database.

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);




  const [statsFilter, setStatsFilter] = useState('all');
  const [userPieFilter, setUserPieFilter] = useState('all');

  const [bottleStats, setBottleStats] = useState<BottleStats>({ kecil: 0, sedang: 0, jumbo: 0, besar: 0, cup: 0, total: 0 });
  const [growthRate, setGrowthRate] = useState(0);
  const [growthLoading, setGrowthLoading] = useState(false);


  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileUpdating, setIsProfileUpdating] = useState(false);

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

  const updateLocalStorage = (updatedUser: CurrentUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  const loadInitialData = async () => {
    setLoading(true);
    await Promise.all([loadUsers(), loadLocations(), loadTransactions()]);
    setLoading(false);
  };

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAllUsers({
        // Load all users for stats, no filters for dashboard level
      });
      setUsers((response.users as any[]) || []);
    } catch (error) {
      toast.error('Gagal memuat data pengguna');
    }
  };

  const loadLocations = async () => {
    try {
      const response = await locationsAPI.getAllLocations();
      const apiLocations = (response.locations as any[]) || [];
      setLocations(apiLocations);
    } catch (error) {
      console.error('Failed to load locations from API:', error);
      toast.error('Gagal memuat data lokasi');
      setLocations([]);
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
      const txData = (response.transactions as any[]) || [];

      setTransactions(txData);
      calculateBottleStats(txData);
      calculateGrowthRate(txData);

    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logout berhasil');
    navigate('/');
  };


  useEffect(() => {
    loadTransactions();
  }, [statsFilter]);

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

  const calculateGrowthRate = (txData: Transaction[]) => {
    setGrowthLoading(true);
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthYear = lastMonthDate.getFullYear();
      const lastMonth = lastMonthDate.getMonth();

      const currentMonthCount = txData.filter(t => {
        const tDate = new Date(t.created_at);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      }).length;

      const lastMonthCount = txData.filter(t => {
        const tDate = new Date(t.created_at);
        return tDate.getMonth() === lastMonth && tDate.getFullYear() === lastMonthYear;
      }).length;

      let rate = 0;
      if (lastMonthCount > 0) {
        rate = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
      } else if (currentMonthCount > 0) {
        rate = 100;
      }

      setGrowthRate(parseFloat(rate.toFixed(1)));
    } catch (error) {
      console.error("Gagal menghitung growth rate:", error);
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



  if (!currentUser) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const navigationItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Manajemen Pengguna', icon: Users },
    { id: 'locations', label: 'Manajemen Lokasi', icon: MapPin },
    { id: 'news', label: 'Manajemen Berita', icon: FileText },
    { id: 'messages', label: 'Live Chat & Support', icon: MessageCircle },
    { id: 'master', label: 'Jenis Botol', icon: Database },
    { id: 'reports', label: 'Laporan', icon: FileText },
    { id: 'profile', label: 'Profil Saya', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <img src={logoEcoTiket} alt="Logo" className="h-12 w-25" />
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-6 px-3 space-y-1">
          {navigationItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${activeTab === item.id
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } `}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm border-b lg:hidden px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}><Menu className="h-5 w-5" /></Button>
          <Badge>Admin</Badge>
        </header>

        <header className="hidden lg:flex bg-white shadow-sm border-b px-6 py-4 justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 capitalize">
            {activeTab === 'overview' ? 'Dashboard' :
              activeTab === 'users' ? 'Manajemen Pengguna' :
                activeTab === 'locations' ? 'Manajemen Lokasi' :
                  activeTab === 'news' ? 'Manajemen Berita' :
                    activeTab === 'messages' ? 'Live Chat & Support' :
                      activeTab === 'master' ? 'Jenis Botol' :
                        activeTab === 'reports' ? 'Laporan' :
                          activeTab === 'profile' ? 'Profil Saya' : activeTab}
          </h1>
          <div className="flex items-center gap-3">
            <NotificationBell />
            <Badge>Administrator</Badge>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === 'overview' && (
              <OverviewTab
                stats={dashboardStats}
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
              <UserManager />
            )}
            {activeTab === 'locations' && (
              <LocationManager />
            )}
            {activeTab === 'news' && (
              <NewsManager />
            )}
            {activeTab === 'messages' && (
              <AdminChatManager />
            )}
            {activeTab === 'master' && (
              <MasterDataView />
            )}
            {activeTab === 'reports' && (
              <ReportGenerator users={users} transactions={transactions} />
            )}
            {activeTab === 'profile' && (
              <AdminProfile
                user={currentUser}
                setUser={setCurrentUser}
                updateLocalStorage={updateLocalStorage}
              />
            )}
          </div>
        </main>
      </div>





      <EditProfile
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
    </div >
  );
}
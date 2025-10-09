import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import logoEcoTiket from '@/assets/logo_ecotiket.png';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Users,
  UserCheck,
  MapPin,
  QrCode,
  Settings,
  BarChart3,
  LogOut,
  Recycle,
  Bus,
  Award,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Activity,
  Eye,
  ArrowLeft,
  Save,
  User,
  Mail,
  CreditCard,
  Phone,
  Search,
  Upload,
  FileText,
  RefreshCw,
  Menu,
  X,
  Clock,
  History,
  Building,
  PillBottleIcon,
  BarChart
} from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import QRGenerator from '@/components/QRGenerator';
import ReportGenerator from '@/components/ReportGenerator';
import BottleStatisticsChart from '@/components/BottleLineChart';
import { usersAPI, transactionsAPI } from '@/lib/api';
import RolePieChart from '@/components/RolePieChart';

interface CurrentUser {
  id: number;
  email?: string;
  nik?: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  qrCode: string;
  ticketsBalance: number;
  points: number;
  status: string;
  token?: string;
}

interface UserRecord {
  id: number;
  email?: string;
  nik?: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  qr_code: string;
  tickets_balance: number;
  points: number;
  status: string;
  created_at: string;
}

interface ApiUser {
  id: number;
  email?: string;
  nik?: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  qr_code?: string;
  qrCode?: string;
  tickets_balance?: number;
  ticketsBalance?: number;
  points?: number;
  status: string;
  created_at?: string;
}

interface UpdateData {
  name?: string;
  email?: string;
  nik?: string;
  phone?: string;
  address?: string;
  status?: string;
  tickets_balance?: number;
  points?: number;
}

interface UserActivity {
  id: number;
  user_id: number;
  activity_type: string;
  description: string;
  created_at: string;
  location?: string;
}

interface PetugasDetail extends UserRecord {
  total_transactions?: number;
  last_activity?: string;
  activities?: UserActivity[];
}

interface Location {
  id: number;
  name: string;
  address: string;
  type: 'terminal' | 'koridor' | 'stand';
  coordinates?: string;
  description?: string;
  capacity?: number;
  operating_hours?: string;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: number;
  user_id: number;
  petugas_id: number;
  type: 'bottle_exchange' | 'ticket_usage';
  description?: string;
  bottles_count?: number;
  bottle_type?: string;
  tickets_change: number;
  points_earned?: number;
  location?: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  user_name?: string;
  petugas_name?: string;
}

interface BottleStats {
  kecil: number;
  sedang: number;
  jumbo: number;
  besar: number;
  cup: number;
  total: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  const [bottleStats, setBottleStats] = useState<BottleStats>({ kecil: 0, sedang: 0, jumbo: 0, besar: 0, cup: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userDetailView, setUserDetailView] = useState<UserRecord | null>(null);
  const [petugasDetailView, setPetugasDetailView] = useState<PetugasDetail | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsFilter, setStatsFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  const hardcodedLocations: Location[] = [
    {
      id: 1,
      name: 'Terminal Antasari',
      address: 'Jl. Pangeran Antasari, Banjarmasin Tengah',
      type: 'terminal',
      coordinates: '-3.3194,114.5906',
      description: 'Terminal utama untuk rute Banjarmasin Tengah',
      capacity: 200,
      operating_hours: '05:00-22:00',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Terminal KM 0',
      address: 'Jl. Ahmad Yani KM 0, Banjarmasin',
      type: 'terminal',
      coordinates: '-3.3181,114.5906',
      description: 'Terminal KM 0 pusat kota',
      capacity: 150,
      operating_hours: '05:00-23:00',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 3,
      name: 'Koridor 1 - Jl. Lambung Mangkurat',
      address: 'Jl. Lambung Mangkurat, Banjarmasin',
      type: 'koridor',
      coordinates: '-3.3206,114.5900',
      description: 'Koridor utama jalur Lambung Mangkurat',
      capacity: 50,
      operating_hours: '06:00-21:00',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 4,
      name: 'Stand Pasar Flamboyan',
      address: 'Pasar Flamboyan, Banjarmasin',
      type: 'stand',
      coordinates: '-3.3200,114.5850',
      description: 'Stand penukaran di area Pasar Flamboyan',
      capacity: 20,
      operating_hours: '07:00-18:00',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    }
  ];

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Pengguna', icon: Users },
    { id: 'locations', label: 'Lokasi', icon: MapPin },
    { id: 'reports', label: 'Laporan', icon: FileText },
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData) as CurrentUser;
      if (parsedUser.role !== 'admin') {
        navigate('/login');
        return;
      }

      setUser(parsedUser);
      setLocations(hardcodedLocations);
      loadUsers();
      loadTransactions();
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAllUsers({
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined
      });

      if (response && Array.isArray(response.users)) {
        const userRecords: UserRecord[] = response.users.map((apiUser: ApiUser) => ({
          id: apiUser.id,
          email: apiUser.email || '',
          nik: apiUser.nik || '',
          name: apiUser.name || 'Unknown',
          role: apiUser.role || 'penumpang',
          phone: apiUser.phone || '',
          address: apiUser.address || '',
          qr_code: apiUser.qr_code || apiUser.qrCode || `ECO-${apiUser.id}`,
          tickets_balance: apiUser.tickets_balance || apiUser.ticketsBalance || 0,
          points: apiUser.points || 0,
          status: apiUser.status || 'active',
          created_at: apiUser.created_at || new Date().toISOString()
        }));
        setUsers(userRecords);
      } else {
        setUsers([]);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Gagal memuat data pengguna: ' + errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      console.log('🔄 Loading transactions with filter:', statsFilter);

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

      if (response && Array.isArray(response.transactions)) {
        const convertedTransactions: Transaction[] = response.transactions.map((t: any) => ({
          id: t.id,
          user_id: t.user_id,
          petugas_id: t.petugas_id,
          type: t.type,
          description: t.description,
          bottles_count: t.bottles_count,
          bottle_type: t.bottle_type,
          tickets_change: t.tickets_change,
          points_earned: t.points_earned,
          location: t.location,
          status: t.status,
          created_at: t.created_at
        }));

        setTransactions(convertedTransactions);
        calculateBottleStats(convertedTransactions);
      } else {
        setTransactions([]);
        calculateBottleStats([]);
      }
    } catch (error) {
      console.error('❌ Error loading transactions:', error);
      toast.error('Gagal memuat data transaksi: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setTransactions([]);
      calculateBottleStats([]);
    }
  };

  const calculateBottleStats = (transactionData: Transaction[]) => {
    const stats: BottleStats = { kecil: 0, sedang: 0, jumbo: 0, besar: 0, cup: 0, total: 0 };

    const bottleTransactions = transactionData.filter(transaction =>
      transaction.type === 'bottle_exchange' &&
      transaction.status === 'completed' &&
      transaction.bottle_type &&
      transaction.bottles_count
    );

    bottleTransactions.forEach(transaction => {
      const bottleType = transaction.bottle_type?.toLowerCase();
      const count = transaction.bottles_count || 0;

      if (bottleType === 'kecil') stats.kecil += count;
      else if (bottleType === 'sedang') stats.sedang += count;
      else if (bottleType === 'jumbo') stats.jumbo += count;
      else if (bottleType === 'besar') stats.besar += count;
      else if (bottleType === 'cup') stats.cup += count;
    });

    stats.total = stats.kecil + stats.sedang + stats.jumbo + stats.besar + stats.cup;
    setBottleStats(stats);
  };

  const loadUserTransactions = async (userId: number) => {
    setIsTransactionsLoading(true);
    setUserTransactions([]);

    try {
      const response = await transactionsAPI.getTransactionsByUserId(userId);

      // Pastikan response ada dan memiliki array transaksi valid
      const transactions = Array.isArray(response?.transactions)
        ? (response.transactions as Transaction[])
        : [];

      setUserTransactions(transactions);
    } catch (error) {
      toast.error(
        "Gagal memuat riwayat transaksi: " +
        (error instanceof Error ? error.message : "Unknown error")
      );
      setUserTransactions([]);
    } finally {
      setIsTransactionsLoading(false);
    }
  };


  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadUsers();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    loadTransactions();
  }, [statsFilter]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logout berhasil');
    navigate('/');
  };

  const handleViewUserDetail = (userData: UserRecord) => {
    setUserDetailView(userData);
    loadUserTransactions(userData.id);
    setIsEditingProfile(false);
    setPetugasDetailView(null);
  };

  const loadPetugasActivities = async (petugasId: number): Promise<UserActivity[]> => {
    return [];
  };

  const handleViewPetugasDetail = async (userData: UserRecord) => {
    try {
      setLoading(true);
      loadUserTransactions(userData.id);
      const activities = await loadPetugasActivities(userData.id);
      const petugasDetail: PetugasDetail = {
        ...userData,
        total_transactions: 0,
        last_activity: activities.length > 0 ? activities[0].created_at : userData.created_at,
        activities: activities
      };
      setPetugasDetailView(petugasDetail);
      setUserDetailView(null);
    } catch (error) {
      toast.error('Gagal memuat detail petugas');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserProfile = async () => {
    if (!userDetailView) return;

    try {
      const updateData: UpdateData = {
        name: userDetailView.name,
        phone: userDetailView.phone,
        address: userDetailView.address,
        status: userDetailView.status,
        points: userDetailView.points
      };

      if (userDetailView.role === 'penumpang') {
        updateData.tickets_balance = userDetailView.tickets_balance;
        updateData.nik = userDetailView.nik;
      } else {
        updateData.email = userDetailView.email;
      }

      await usersAPI.updateUser(userDetailView.id, updateData);
      setIsEditingProfile(false);
      toast.success('Profil pengguna berhasil diupdate');
      loadUsers();
    } catch (error) {
      toast.error('Gagal memperbarui profil');
    }
  };

  const handleDeleteUser = (id: number) => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Data pengguna akan dihapus dan tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await usersAPI.deleteUser(id);
          Swal.fire({
            title: "Terhapus!",
            text: "Data pengguna berhasil dihapus.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
          loadUsers();
          if (userDetailView && userDetailView.id === id) setUserDetailView(null);
          if (petugasDetailView && petugasDetailView.id === id) setPetugasDetailView(null);
        } catch (error) {
          toast.error('Gagal menghapus pengguna');
        }
      }
    });
  };

  const handleEditUser = async (userData: Partial<UserRecord>) => {
    if (!editingUser) return;

    try {
      const updateData: UpdateData = {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
        status: userData.status,
        points: userData.points
      };

      if (editingUser.role === 'penumpang') {
        updateData.tickets_balance = userData.tickets_balance;
        updateData.nik = userData.nik;
      } else {
        updateData.email = userData.email;
      }

      await usersAPI.updateUser(editingUser.id, updateData);
      toast.success('Data pengguna berhasil diperbarui');
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      toast.error('Gagal memperbarui data');
    }
  };

  const handleAddLocation = async (locationData: Omit<Location, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newLocation: Location = {
        ...locationData,
        id: Math.max(...locations.map(l => l.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setLocations(prev => [...prev, newLocation]);
      toast.success('Lokasi berhasil ditambahkan');
      setIsAddingLocation(false);
    } catch (error) {
      toast.error('Gagal menambahkan lokasi');
    }
  };

  const handleEditLocation = async (locationData: Location) => {
    try {
      setLocations(prev => prev.map(loc =>
        loc.id === locationData.id
          ? { ...locationData, updated_at: new Date().toISOString() }
          : loc
      ));
      setEditingLocation(null);
      toast.success('Lokasi berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui lokasi');
    }
  };

  const handleDeleteLocation = (id: number) => {
    Swal.fire({
      title: "Hapus Lokasi?",
      text: "Lokasi akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLocations(prev => prev.filter(loc => loc.id !== id));
        toast.success('Lokasi berhasil dihapus');
      }
    });
  };

  const stats = {
    totalUsers: users.length,
    totalPenumpang: users.filter(u => u.role === 'penumpang').length,
    totalPetugas: users.filter(u => u.role === 'petugas').length,
    totalAdmin: users.filter(u => u.role === 'admin').length,
    totalTickets: users.reduce((sum, u) => sum + (u.role === 'penumpang' ? u.tickets_balance : 0), 0),
    activeUsers: users.filter(u => u.status === 'active').length,
    totalLocations: locations.length,
    activeLocations: locations.filter(l => l.status === 'active').length,
    totalTransactions: transactions.length,
    totalBottles: bottleStats.total
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'petugas': return 'bg-blue-100 text-blue-800';
      case 'penumpang': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case 'terminal': return 'bg-blue-100 text-blue-800';
      case 'koridor': return 'bg-green-100 text-green-800';
      case 'stand': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'scan_qr': return <QrCode className="h-4 w-4 text-blue-600" />;
      case 'issue_ticket': return <Bus className="h-4 w-4 text-green-600" />;
      case 'login': return <User className="h-4 w-4 text-gray-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const UserTransactionHistory = ({ transactions, isLoading, role }: { transactions: Transaction[], isLoading: boolean, role: string }) => {
    return (
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Riwayat Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Perubahan Tiket</TableHead>
                  <TableHead>{role === 'petugas' ? 'Penumpang' : 'Petugas'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8">Memuat riwayat transaksi...</TableCell></TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8">Tidak ada riwayat transaksi.</TableCell></TableRow>
                ) : (
                  transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-sm text-gray-600">{formatDateTime(tx.created_at)}</TableCell>
                      <TableCell>
                        <Badge variant={tx.type === 'bottle_exchange' ? 'default' : 'secondary'} className="flex items-center gap-1 w-fit">
                          {tx.type === 'bottle_exchange' ? <Recycle className="h-3 w-3" /> : <Bus className="h-3 w-3" />}
                          {tx.type === 'bottle_exchange' ? 'Tukar Botol' : 'Guna Tiket'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{tx.description}</TableCell>
                      <TableCell className={`font-medium ${tx.tickets_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.tickets_change > 0 ? `+${tx.tickets_change}` : tx.tickets_change}
                      </TableCell>
                      <TableCell className="text-sm">{role === 'petugas' ? tx.user_name : tx.petugas_name}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (userDetailView) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => { setUserDetailView(null); setIsEditingProfile(false); }}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali ke Manajemen Pengguna
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant={isEditingProfile ? "default" : "outline"} size="sm" onClick={() => setIsEditingProfile(!isEditingProfile)}>
                {isEditingProfile ? <><User className="h-4 w-4 mr-2" />Mode Lihat</> : <><Edit className="h-4 w-4 mr-2" />Edit Profil</>}
              </Button>
              {isEditingProfile && (
                <Button onClick={handleUpdateUserProfile} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />Simpan
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-semibold">{userDetailView.name?.charAt(0) || '?'}</span>
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{userDetailView.name || 'Unknown User'}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRoleColor(userDetailView.role)}>{userDetailView.role}</Badge>
                          <Badge className={getStatusColor(userDetailView.status)}>{userDetailView.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {userDetailView.role === 'penumpang' ? (
                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />NIK
                          </Label>
                          {isEditingProfile ? (
                            <Input value={userDetailView.nik || ''} onChange={(e) => setUserDetailView({ ...userDetailView, nik: e.target.value })} className="mt-1" maxLength={16} />
                          ) : (
                            <p className="text-sm font-mono">{userDetailView.nik || '-'}</p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Mail className="h-4 w-4" />Email
                          </Label>
                          {isEditingProfile ? (
                            <Input value={userDetailView.email || ''} onChange={(e) => setUserDetailView({ ...userDetailView, email: e.target.value })} className="mt-1" />
                          ) : (
                            <p className="text-sm">{userDetailView.email || '-'}</p>
                          )}
                        </div>
                      )}
                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Phone className="h-4 w-4" />No. Telepon
                        </Label>
                        {isEditingProfile ? (
                          <Input value={userDetailView.phone || ''} onChange={(e) => setUserDetailView({ ...userDetailView, phone: e.target.value })} placeholder="0812-xxxx-xxxx" className="mt-1" />
                        ) : (
                          <p className="text-sm">{userDetailView.phone || '-'}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-gray-500">Alamat</Label>
                        {isEditingProfile ? (
                          <Input value={userDetailView.address || ''} onChange={(e) => setUserDetailView({ ...userDetailView, address: e.target.value })} placeholder="Masukkan alamat lengkap" className="mt-1" />
                        ) : (
                          <p className="text-sm">{userDetailView.address || '-'}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Status</Label>
                        {isEditingProfile ? (
                          <Select value={userDetailView.status} onValueChange={(value) => setUserDetailView({ ...userDetailView, status: value })}>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="suspended">Suspended</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm capitalize">{userDetailView.status}</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Tanggal Bergabung</Label>
                        <p className="text-sm">{formatDate(userDetailView.created_at)}</p>
                      </div>
                    </div>
                    {isEditingProfile && userDetailView.role === 'penumpang' && (
                      <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Saldo Tiket</Label>
                          <Input type="number" value={userDetailView.tickets_balance} onChange={(e) => setUserDetailView({ ...userDetailView, tickets_balance: parseInt(e.target.value) || 0 })} className="mt-1" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Total Poin</Label>
                          <Input type="number" value={userDetailView.points} onChange={(e) => setUserDetailView({ ...userDetailView, points: parseInt(e.target.value) || 0 })} className="mt-1" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Statistik</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {userDetailView.role === 'penumpang' ? (
                        <>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{userDetailView.tickets_balance}</div>
                            <div className="text-sm text-gray-600">Saldo Tiket</div>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{userDetailView.points}</div>
                            <div className="text-sm text-gray-600">Total Poin</div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">Aktif</div>
                          <div className="text-sm text-gray-600">Status {userDetailView.role}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center"><QrCode className="h-5 w-5 mr-2" />QR Code</CardTitle>
                    <CardDescription>QR Code unik untuk {userDetailView.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    {userDetailView.qr_code && <QRGenerator value={userDetailView.qr_code} />}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-mono text-gray-700">{userDetailView.qr_code}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Aksi</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700" onClick={() => handleDeleteUser(userDetailView.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />Hapus Pengguna
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="pt-6 border-t">
              <UserTransactionHistory
                transactions={userTransactions}
                isLoading={isTransactionsLoading}
                role={userDetailView.role}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (petugasDetailView) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => setPetugasDetailView(null)}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali ke Manajemen Petugas
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-semibold text-blue-800">{petugasDetailView.name?.charAt(0) || '?'}</span>
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{petugasDetailView.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRoleColor(petugasDetailView.role)}>{petugasDetailView.role}</Badge>
                          <Badge className={getStatusColor(petugasDetailView.status)}>{petugasDetailView.status}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 grid md:grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-500 flex items-center gap-2"><Mail className="h-4 w-4" />Email</Label>
                      <p className="text-sm pt-1">{petugasDetailView.email || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500 flex items-center gap-2"><Phone className="h-4 w-4" />No. Telepon</Label>
                      <p className="text-sm pt-1">{petugasDetailView.phone || '-'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-gray-500">Alamat</Label>
                      <p className="text-sm pt-1">{petugasDetailView.address || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Tanggal Bergabung</Label>
                      <p className="text-sm pt-1">{formatDate(petugasDetailView.created_at)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Aktivitas Terakhir</Label>
                      <p className="text-sm pt-1">{petugasDetailView.last_activity ? formatDateTime(petugasDetailView.last_activity) : 'Belum ada aktivitas'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Statistik Petugas</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{petugasDetailView.total_transactions || 0}</div>
                      <div className="text-sm text-gray-600 mt-1">Total Transaksi Diverifikasi</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="flex items-center"><QrCode className="h-5 w-5 mr-2" />QR Code Petugas</CardTitle></CardHeader>
                  <CardContent className="text-center space-y-4">
                    {petugasDetailView.qr_code ? (
                      <>
                        <QRGenerator value={petugasDetailView.qr_code} />
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <p className="text-sm font-mono text-gray-700 break-all">{petugasDetailView.qr_code}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 py-4">QR Code tidak tersedia.</p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Aksi</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full" onClick={() => setEditingUser(petugasDetailView)}>
                      <Edit className="h-4 w-4 mr-2" />Edit Petugas
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={() => handleDeleteUser(petugasDetailView.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />Hapus Petugas
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Transaksi Petugas</CardTitle>
                <CardDescription>Menampilkan semua transaksi yang telah diverifikasi oleh petugas ini.</CardDescription>
              </CardHeader>
              <CardContent>
                <UserTransactionHistory
                  transactions={userTransactions}
                  isLoading={isTransactionsLoading}
                  role={petugasDetailView.role}
                />
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <img src={logoEcoTiket} alt="Logo" className="h-12 w-25" />
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === item.id ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}>
                  <Icon className="h-5 w-5 mr-3" />{item.label}
                </button>
              );
            })}
          </div>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">{user.name?.charAt(0) || '?'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email || user.nik}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />Logout
          </Button>
        </div>
      </div>

      <div className="flex-1 lg:ml-0">
        <header className="lg:hidden bg-white shadow-sm border-b">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <Badge variant="default">Administrator</Badge>
            </div>
          </div>
        </header>
        <header className="hidden lg:block bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="default">Administrator</Badge>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email || user.nik}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">{stats.totalPenumpang} penumpang, {stats.totalPetugas} petugas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tiket</CardTitle>
                    <Bus className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalTickets.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Saldo penumpang aktif</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeUsers}</div>
                    <p className="text-xs text-green-600">Status aktif</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Lokasi</CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalLocations}</div>
                    <p className="text-xs text-green-600">{stats.activeLocations} aktif</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                    <p className="text-xs text-muted-foreground">Transaksi selesai</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Botol Ditukar</CardTitle>
                    <Recycle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalBottles}</div>
                    <p className="text-xs text-muted-foreground">Botol plastik</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pertumbuhan</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12%</div>
                    <p className="text-xs text-green-600">Bulan ini</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Statistik Botol</h2>
                    <Select value={statsFilter} onValueChange={setStatsFilter}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Filter Waktu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Waktu</SelectItem>
                        <SelectItem value="today">Hari Ini</SelectItem>
                        <SelectItem value="month">Bulan Ini</SelectItem>
                        <SelectItem value="year">Tahun Ini</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <BottleStatisticsChart
                    statsFilter={statsFilter}
                    bottleStats={bottleStats}
                    transactions={transactions}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Distribusi Pengguna</h2>
                    <Select value={userFilter} onValueChange={setUserFilter}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <RolePieChart
                    users={users}
                    userFilter={userFilter}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />Manajemen Pengguna
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input placeholder="Cari nama, email, atau NIK..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                      </div>
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Role</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="petugas">Petugas</SelectItem>
                        <SelectItem value="penumpang">Penumpang</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pengguna</TableHead>
                          <TableHead>Identitas</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Saldo/Poin</TableHead>
                          <TableHead>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Memuat data...</TableCell></TableRow>
                        ) : users.length === 0 ? (
                          <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Tidak ada data pengguna</TableCell></TableRow>
                        ) : (
                          users.map((userData) => (
                            <TableRow key={userData.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold">{userData.name?.charAt(0) || '?'}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{userData.name}</div>
                                    <div className="text-sm text-gray-500">{userData.phone || 'No phone'}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {userData.role === 'penumpang' ? (
                                    <><CreditCard className="h-4 w-4 text-gray-400" /><span className="text-sm font-mono">{userData.nik || '-'}</span></>
                                  ) : (
                                    <><Mail className="h-4 w-4 text-gray-400" /><span className="text-sm">{userData.email || '-'}</span></>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell><Badge className={getRoleColor(userData.role)}>{userData.role}</Badge></TableCell>
                              <TableCell><Badge className={getStatusColor(userData.status)}>{userData.status}</Badge></TableCell>
                              <TableCell>
                                {userData.role === 'penumpang' ? (
                                  <div className="text-sm">
                                    <div className="flex items-center gap-1"><Bus className="h-3 w-3" />{userData.tickets_balance} tiket</div>
                                    <div className="flex items-center gap-1 text-gray-500"><Award className="h-3 w-3" />{userData.points} poin</div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      if (userData.role === 'petugas') {
                                        handleViewPetugasDetail(userData);
                                      } else {
                                        handleViewUserDetail(userData);
                                      }
                                    }}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => setEditingUser(userData)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  {userData.role !== 'admin' && (
                                    <Button size="sm" variant="outline" onClick={() => handleDeleteUser(userData.id)}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'locations' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Manajemen Lokasi</CardTitle>
                    </div>
                    <Button onClick={() => setIsAddingLocation(true)}>
                      <Plus className="h-4 w-4 mr-2" />Tambah Lokasi
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nama Lokasi</TableHead>
                          <TableHead>Alamat</TableHead>
                          <TableHead>Tipe</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Kapasitas</TableHead>
                          <TableHead>Jam Operasional</TableHead>
                          <TableHead>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {locations.length === 0 ? (
                          <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500">{loading ? 'Memuat data lokasi...' : 'Belum ada lokasi terdaftar'}</TableCell></TableRow>
                        ) : (
                          locations.map((location) => (
                            <TableRow key={location.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Building className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{location.name}</div>
                                    <div className="text-sm text-gray-500">{formatDate(location.created_at)}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell><div className="max-w-xs truncate">{location.address}</div></TableCell>
                              <TableCell>
                                <Badge className={getLocationTypeColor(location.type)}>
                                  {location.type === 'terminal' ? 'Terminal' : location.type === 'koridor' ? 'Koridor' : location.type === 'stand' ? 'Stand' : location.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(location.status)}>
                                  {location.status === 'active' ? 'Aktif' : location.status === 'inactive' ? 'Tidak Aktif' : location.status === 'maintenance' ? 'Maintenance' : location.status}
                                </Badge>
                              </TableCell>
                              <TableCell><span className="text-sm">{location.capacity ? `${location.capacity} orang` : '-'}</span></TableCell>
                              <TableCell><span className="text-sm">{location.operating_hours || '-'}</span></TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" onClick={() => setEditingLocation(location)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleDeleteLocation(location.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'reports' && <ReportGenerator users={users} transactions={transactions} />}
        </div>
      </div>

      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Pengguna</DialogTitle>
              <DialogDescription>Update data pengguna</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                </div>
                {editingUser.role === 'penumpang' ? (
                  <div className="space-y-2">
                    <Label>NIK</Label>
                    <Input value={editingUser.nik || ''} onChange={(e) => setEditingUser({ ...editingUser, nik: e.target.value })} maxLength={16} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={editingUser.email || ''} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>No. Telepon</Label>
                  <Input value={editingUser.phone || ''} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editingUser.status} onValueChange={(value) => setEditingUser({ ...editingUser, status: value })}>
                    <SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alamat</Label>
                <Input value={editingUser.address || ''} onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })} />
              </div>
              {editingUser.role === 'penumpang' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Saldo Tiket</Label>
                    <Input type="number" value={editingUser.tickets_balance} onChange={(e) => setEditingUser({ ...editingUser, tickets_balance: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Poin</Label>
                    <Input type="number" value={editingUser.points} onChange={(e) => setEditingUser({ ...editingUser, points: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
              )}
              <Button onClick={() => handleEditUser(editingUser)} className="w-full">Update Pengguna</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {isAddingLocation && (
        <Dialog open={isAddingLocation} onOpenChange={() => setIsAddingLocation(false)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Lokasi Baru</DialogTitle>
              <DialogDescription>Tambah terminal, halte, atau stasiun baru</DialogDescription>
            </DialogHeader>
            <LocationForm onSubmit={(data) => handleAddLocation(data)} onCancel={() => setIsAddingLocation(false)} />
          </DialogContent>
        </Dialog>
      )}

      {editingLocation && (
        <Dialog open={!!editingLocation} onOpenChange={() => setEditingLocation(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Lokasi</DialogTitle>
              <DialogDescription>Update informasi lokasi</DialogDescription>
            </DialogHeader>
            <LocationForm location={editingLocation} onSubmit={(data) => handleEditLocation({ ...editingLocation, ...data })} onCancel={() => setEditingLocation(null)} />
          </DialogContent>
        </Dialog>
      )}

      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}

function LocationForm({ location, onSubmit, onCancel }: { location?: Location; onSubmit: (data: Omit<Location, 'id' | 'created_at' | 'updated_at'>) => void; onCancel: () => void; }) {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    address: location?.address || '',
    type: location?.type || 'terminal' as 'terminal' | 'koridor' | 'stand',
    coordinates: location?.coordinates || '',
    description: location?.description || '',
    capacity: location?.capacity || 0,
    operating_hours: location?.operating_hours || '',
    status: location?.status || 'active' as 'active' | 'inactive' | 'maintenance'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Nama Lokasi</Label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Terminal Flamboyan" required />
        </div>
        <div className="space-y-2">
          <Label>Tipe Lokasi</Label>
          <Select value={formData.type} onValueChange={(value: 'terminal' | 'koridor' | 'stand') => setFormData({ ...formData, type: value })}>
            <SelectTrigger><SelectValue placeholder="Pilih Tipe" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="terminal">Terminal</SelectItem>
              <SelectItem value="koridor">Koridor</SelectItem>
              <SelectItem value="stand">Stand</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Alamat</Label>
        <Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Jl. Flamboyan No. 1, Palangkaraya" required />
      </div>
      <div className="space-y-2">
        <Label>Deskripsi (Opsional)</Label>
        <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Deskripsi lokasi..." rows={3} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Kapasitas</Label>
          <Input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} placeholder="100" min="0" />
        </div>
        <div className="space-y-2">
          <Label>Jam Operasional</Label>
          <Input value={formData.operating_hours} onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })} placeholder="06:00-22:00" />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'maintenance') => setFormData({ ...formData, status: value })}>
            <SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Tidak Aktif</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Koordinat GPS (Opsional)</Label>
        <Input value={formData.coordinates} onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })} placeholder="-2.2180,113.9120" />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
        <Button type="submit">{location ? 'Update Lokasi' : 'Tambah Lokasi'}</Button>
      </div>
    </form>
  );
}
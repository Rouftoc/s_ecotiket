import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import logoEcoTiket from '@/assets/logo_ecotiket.png';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import {
  QrCode,
  Recycle,
  Bus,
  MapPin,
  LogOut,
  CheckCircle,
  AlertCircle,
  History,
  UserPlus,  
  Loader2,   
  CreditCard,
  Menu,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import QRScanner from '@/components/QRScanner';
import QRGenerator from '@/components/QRGenerator'; 
import { transactionsAPI, usersAPI, authAPI } from '@/lib/api'; 

interface User {
  email: string;
  name: string;
  role: string;
}

interface UserData {
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
}

interface Transaction {
  id: number;
  qrCode: string;
  type: 'stand' | 'karnet';
  bottles?: {
    jumbo: number;
    besar: number;
    sedang: number;
    kecil: number;
    cup: number;
  };
  tickets: number;
  timestamp: string;
  location: string;
}

interface RegisteredUser {
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
}

export default function PetugasDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeMode, setActiveMode] = useState<'stand' | 'karnet' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentQR, setCurrentQR] = useState('');
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState('transaction');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bottleCount, setBottleCount] = useState({
    jumbo: 0,
    besar: 0,
    sedang: 0,
    kecil: 0,
    cup: 0
  });
  const [todayTransactions, setTodayTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'petugas') {
        navigate('/login');
        return;
      }
      setUser(parsedUser);
    } else {
      navigate('/login');
    }

    const today = new Date().toISOString().split('T')[0];
    const storedDate = localStorage.getItem('transactionDate');
    const storedTransactions = localStorage.getItem('todayTransactions');

    if (storedTransactions && storedDate === today) {
      console.log('Memuat riwayat dari localStorage');
      setTodayTransactions(JSON.parse(storedTransactions));
    } else {
      console.log('Memuat riwayat dari API');
      localStorage.removeItem('todayTransactions');
      localStorage.removeItem('transactionDate');
      loadTodayTransactions();
    }
    localStorage.setItem('transactionDate', today);
  }, [navigate]);

  const loadTodayTransactions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await transactionsAPI.getAllTransactions({
        startDate: today,
        endDate: today
      });

      if (response.transactions) {
        const localTransactions: Transaction[] = response.transactions.map((t) => ({
          id: t.id,
          qrCode: '',
          type: t.type === 'bottle_exchange' ? 'stand' : 'karnet',
          bottles: t.type === 'bottle_exchange' ? {
            jumbo: t.bottle_type === 'jumbo' ? t.bottles_count : 0,
            besar: t.bottle_type === 'besar' ? t.bottles_count : 0,
            sedang: t.bottle_type === 'sedang' ? t.bottles_count : 0,
            kecil: t.bottle_type === 'kecil' ? t.bottles_count : 0,
            cup: t.bottle_type === 'cup' ? t.bottles_count : 0
          } : undefined,
          tickets: t.tickets_change,
          timestamp: new Date(t.created_at).toLocaleString('id-ID'),
          location: t.location || ''
        }));

        setTodayTransactions(localTransactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success('Logout berhasil');
    navigate('/');
  };

  const locations = [
    { id: 'terminal-antasari', name: 'Terminal Antasari', type: 'terminal' },
    { id: 'terminal-km0', name: 'Terminal KM 0', type: 'terminal' },
    { id: 'koridor-1', name: 'Koridor 1 (Terminal Antasari - Terminal Km. 6)', type: 'koridor' },
    { id: 'koridor-2', name: 'Koridor 2 (Terminal Antasari - RS Ansari Saleh)', type: 'koridor' },
    { id: 'koridor-3', name: 'Koridor 3 (Terminal Antasari - Jembatan Bromo)', type: 'koridor' },
    { id: 'koridor-4', name: 'Koridor 4 (Sungai Andai - Teluk Tiram)', type: 'koridor' },
    { id: 'koridor-5', name: 'Koridor 5 (Terminal Antasari - Pemangkih Laut)', type: 'koridor' },
    { id: 'koridor-6', name: 'Koridor 6 (Sungai Lulut - 0 Km)', type: 'koridor' },
    { id: 'koridor-7', name: 'Koridor 7 (0 Km - Dermaga Alalak)', type: 'koridor' },
    { id: 'koridor-8', name: 'Koridor 8 (Terminal Antasari - Pelabuhan Trisakti)', type: 'koridor' },
    { id: 'koridor-9', name: 'Koridor 9 (Terminal Antasari - Belitung)', type: 'koridor' },
    { id: 'koridor-10', name: 'Koridor 10 (RS Ansari Saleh - Trisakti (Via Kuin))', type: 'koridor' },
    { id: 'koridor-11', name: 'Koridor 11 (Terminal Antasari - Beruntung Jaya)', type: 'koridor' },
    { id: 'koridor-12', name: 'Koridor 12 (Banjar Raya - Terminal Antasari)', type: 'koridor' },
    { id: 'koridor-13', name: 'Koridor 13 (Trisakti - Sudimampir (Via Lingkar Selatan))', type: 'koridor' }
  ];

  const calculateTickets = () => {
    const { jumbo, besar, sedang, kecil, cup } = bottleCount;
    return (jumbo * 2) + Math.floor(besar / 5) + Math.floor(sedang / 8) + Math.floor(kecil / 15) + Math.floor(cup / 20);
  };

  const handleQRScan = async (qrCode: string) => {
    if (!qrCode || qrCode.trim() === '') {
      toast.error('QR Code tidak valid');
      return;
    }

    const trimmedQR = qrCode.trim();
    setCurrentQR(trimmedQR);

    if (currentUserData && currentUserData.qrCode === trimmedQR) {
      console.log('Using cached user data:', currentUserData.name);
      toast.success(`QR Code ${trimmedQR} berhasil di-scan - Penumpang: ${currentUserData.name} (${currentUserData.ticketsBalance} tiket)`);
      return;
    }

    try {
      console.log('Mencari pengguna dengan QR Code:', trimmedQR);

      const response = await usersAPI.getAllUsers();

      if (response && response.users && Array.isArray(response.users)) {
        console.log(`Total users ditemukan: ${response.users.length}`);

        const userData = response.users.find((user: any) => {
          const userQrCode = user.qrCode || '';
          return userQrCode === trimmedQR;
        });

        if (userData) {
          if (userData.role !== 'penumpang') {
            toast.error(`QR Code ini untuk ${userData.role}, bukan penumpang`);
            setCurrentUserData(null);
            return;
          }

          if (userData.status !== 'active') {
            toast.error(`Akun penumpang ${userData.name} tidak aktif (status: ${userData.status})`);
            setCurrentUserData(null);
            return;
          }

          const normalizedUser: UserData = {
            id: userData.id,
            email: userData.email,
            nik: userData.nik,
            name: userData.name,
            role: userData.role,
            phone: userData.phone,
            address: userData.address,
            qrCode: userData.qrCode,
            ticketsBalance: userData.ticketsBalance,
            points: userData.points,
            status: userData.status
          };

          setCurrentUserData(normalizedUser);
          toast.success(`QR Code ${trimmedQR} berhasil di-scan - Penumpang: ${normalizedUser.name} (${normalizedUser.ticketsBalance} tiket)`);
        } else {
          setCurrentUserData(null);
          toast.error(`Penumpang dengan QR Code ${trimmedQR} tidak ditemukan di database`);
        }
      } else {
        setCurrentUserData(null);
        toast.error('Gagal memuat data pengguna dari server');
      }
    } catch (error) {
      console.error('Error finding user:', error);

      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          toast.error('Sesi login berakhir, silakan login ulang');
          navigate('/login');
          return;
        } else if (error.message.includes('403')) {
          toast.error('Tidak ada izin untuk mengakses data pengguna');
        } else {
          toast.error(`Gagal memverifikasi QR Code: ${error.message}`);
        }
      }

      setCurrentUserData(null);
    }
  };

  const handleStandTransaction = async () => {
    if (!currentQR || !selectedLocation || !currentUserData) {
      toast.error('Mohon scan QR Code penumpang yang valid dan pilih lokasi');
      return;
    }

    const totalTickets = calculateTickets();
    if (totalTickets === 0) {
      toast.error('Jumlah botol tidak mencukupi untuk mendapat tiket');
      return;
    }

    setLoading(true);

    try {
      const bottleTypes = [
        { type: 'jumbo', count: bottleCount.jumbo },
        { type: 'besar', count: bottleCount.besar },
        { type: 'sedang', count: bottleCount.sedang },
        { type: 'kecil', count: bottleCount.kecil },
        { type: 'cup', count: bottleCount.cup }
      ];

      for (const bottle of bottleTypes) {
        if (bottle.count > 0) {
          await transactionsAPI.processBottleExchange({
            userQrCode: currentQR,
            bottleType: bottle.type,
            bottleCount: bottle.count,
            location: locations.find(l => l.id === selectedLocation)?.name || selectedLocation
          });
        }
      }

      const transaction: Transaction = {
        id: Date.now(),
        qrCode: currentQR,
        type: 'stand',
        bottles: { ...bottleCount },
        tickets: totalTickets,
        timestamp: new Date().toLocaleString('id-ID'),
        location: locations.find(l => l.id === selectedLocation)?.name || selectedLocation
      };

      const newTransactions = [transaction, ...todayTransactions];
      setTodayTransactions(newTransactions);
      localStorage.setItem('todayTransactions', JSON.stringify(newTransactions));

      toast.success(`Berhasil! ${totalTickets} tiket ditambahkan ke akun ${currentUserData.name}`);
      setCurrentUserData(prev => prev ? {
        ...prev,
        ticketsBalance: prev.ticketsBalance + totalTickets
      } : null);

      setBottleCount({ jumbo: 0, besar: 0, sedang: 0, kecil: 0, cup: 0 });

    } catch (error) {
      console.error('Error processing bottle exchange:', error);
      if (error instanceof Error) {
        toast.error(`Gagal memproses transaksi botol: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKarnetTransaction = async () => {
    if (!currentQR || !selectedLocation || !currentUserData) {
      toast.error('Mohon scan QR Code penumpang yang valid dan pilih lokasi');
      return;
    }

    if (currentUserData.ticketsBalance < 1) {
      toast.error(`Saldo tiket ${currentUserData.name} tidak mencukupi!`);
      return;
    }

    setLoading(true);

    try {
      await transactionsAPI.processTicketUsage({
        userQrCode: currentQR,
        ticketCount: 1,
        location: locations.find(l => l.id === selectedLocation)?.name
      });

      const transaction: Transaction = {
        id: Date.now(),
        qrCode: currentQR,
        type: 'karnet',
        tickets: -1,
        timestamp: new Date().toLocaleString('id-ID'),
        location: locations.find(l => l.id === selectedLocation)?.name || selectedLocation
      };

      const newTransactions = [transaction, ...todayTransactions];
      setTodayTransactions(newTransactions);
      localStorage.setItem('todayTransactions', JSON.stringify(newTransactions));
      toast.success(`Tiket valid! Penumpang ${currentUserData.name} dapat naik bus.`);

      setCurrentUserData(prev => prev ? {
        ...prev,
        ticketsBalance: prev.ticketsBalance - 1
      } : null);

    } catch (error) {
      console.error('Error processing ticket usage:', error);
      if (error instanceof Error) {
        toast.error(`Gagal memproses validasi tiket: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const startShift = (mode: 'stand' | 'karnet') => {
    if (!selectedLocation) {
      toast.error('Pilih lokasi tugas terlebih dahulu');
      return;
    }

    setActiveMode(mode);
    setMobileMenuOpen(false);
    toast.success(`Shift ${mode} dimulai`);
  };

  const endShift = () => {
    setActiveMode(null);
    setCurrentQR('');
    setCurrentUserData(null);
    setBottleCount({ jumbo: 0, besar: 0, sedang: 0, kecil: 0, cup: 0 });
    setMobileMenuOpen(false);
    toast.success('Shift berakhir');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src={logoEcoTiket} alt="Logo" className="h-10 w-auto" />
            <Badge variant="secondary" className="hidden sm:inline">Petugas</Badge>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-600">{user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs - Desktop */}
      {activeMode && (
        <div className="hidden sm:block bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex gap-0">
              {[
                { id: 'transaction', label: 'Transaksi', icon: QrCode },
                { id: 'history', label: 'Riwayat Hari Ini', icon: History },
                { id: 'register', label: 'Daftar Penumpang', icon: UserPlus }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs - Mobile */}
      {activeMode && (
        <div className="sm:hidden bg-white border-b">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
          
          {mobileMenuOpen && (
            <div className="border-t px-4 py-2 space-y-1 bg-gray-50">
              {[
                { id: 'transaction', label: 'Transaksi', icon: QrCode },
                { id: 'history', label: 'Riwayat Hari Ini', icon: History },
                { id: 'register', label: 'Daftar Penumpang', icon: UserPlus }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm font-medium flex items-center gap-2 transition-all ${
                      activeTab === tab.id
                        ? 'bg-green-600 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Card className="mb-4 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Status Shift
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-2 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Label className="text-sm">Lokasi Tugas:</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-full sm:w-64 text-sm">
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id} className="text-sm">
                          {location.name} ({location.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {activeMode && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-green-600 text-xs sm:text-sm">
                      {activeMode === 'stand' ? 'Stand Aktif' : 'Karnet Aktif'}
                    </Badge>
                    <span className="text-xs sm:text-sm text-gray-600">
                      di {locations.find(l => l.id === selectedLocation)?.name}
                    </span>
                  </div>
                )}
              </div>
              {activeMode && (
                <Button onClick={endShift} variant="destructive" className="w-full sm:w-auto text-sm">
                  Akhiri Shift
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {activeMode ? (
          <>
            {activeTab === 'transaction' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <QRScanner
                    onScanResult={handleQRScan}
                    placeholder="Scan QR Code penumpang"
                  />

                  {activeMode === 'stand' ? (
                    <Card>
                      <CardHeader className="pb-3 sm:pb-6">
                        <CardTitle className="text-base sm:text-lg">Stand - Tukar Botol</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Input jumlah botol
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 sm:space-y-6">
                        {currentUserData && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                            <div className="flex items-center space-x-2 text-green-800 text-sm">
                              <CheckCircle className="h-4 w-4" />
                              <span className="font-medium">{currentUserData.name}</span>
                            </div>
                            <div className="text-xs sm:text-sm text-green-700 mt-1">
                              <p>Tiket: <span className="font-bold">{currentUserData.ticketsBalance}</span></p>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                          {[
                            { key: 'jumbo', label: 'Botol Jumbo', ratio: '1 = 2 tiket' },
                            { key: 'besar', label: 'Botol Besar', ratio: '5 = 1 tiket' },
                            { key: 'sedang', label: 'Botol Sedang', ratio: '8 = 1 tiket' },
                            { key: 'kecil', label: 'Botol Kecil', ratio: '15 = 1 tiket' },
                            { key: 'cup', label: 'Cup Plastik', ratio: '20 = 1 tiket' }
                          ].map(bottle => (
                            <div key={bottle.key} className="space-y-1 sm:space-y-2">
                              <Label className="text-xs sm:text-sm">{bottle.label}</Label>
                              <Input
                                type="number"
                                min="0"
                                value={bottleCount[bottle.key as keyof typeof bottleCount]}
                                onChange={(e) => setBottleCount({ 
                                  ...bottleCount, 
                                  [bottle.key]: parseInt(e.target.value) || 0 
                                })}
                                className="text-sm h-8 sm:h-10"
                              />
                              <p className="text-xs text-gray-500">{bottle.ratio}</p>
                            </div>
                          ))}
                        </div>

                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">Total:</span>
                            <Badge className="text-base sm:text-lg px-2 py-1 bg-green-600">
                              {calculateTickets()} Tiket
                            </Badge>
                          </div>
                        </div>

                        <Button
                          onClick={handleStandTransaction}
                          className="w-full bg-green-600 hover:bg-green-700 text-sm"
                          disabled={!currentUserData || calculateTickets() === 0 || loading}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {loading ? 'Memproses...' : 'Proses'}
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader className="pb-3 sm:pb-6">
                        <CardTitle className="text-base sm:text-lg flex items-center">
                          <Bus className="h-4 w-4 mr-2" />
                          Karnet - Validasi
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                          Validasi tiket untuk naik bus
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 sm:space-y-6">
                        {currentUserData && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                            <div className="flex items-center space-x-2 text-blue-800 text-sm">
                              <CheckCircle className="h-4 w-4" />
                              <span className="font-medium">{currentUserData.name}</span>
                            </div>
                            <div className="text-xs sm:text-sm text-blue-700 mt-1">
                              <p>Saldo: <span className="font-bold text-base">{currentUserData.ticketsBalance}</span></p>
                              {currentUserData.ticketsBalance < 1 && (
                                <p className="text-red-600 font-medium mt-1 text-xs">⚠️ Saldo tidak cukup!</p>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                          <div className="flex items-center space-x-2 text-blue-800 text-sm">
                            <AlertCircle className="h-5 w-5" />
                            <span className="font-medium">Tarif: 1 Tiket</span>
                          </div>
                        </div>

                        <Button
                          onClick={handleKarnetTransaction}
                          className="w-full text-sm"
                          disabled={!currentUserData || (currentUserData?.ticketsBalance < 1) || loading}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {loading ? 'Memproses...' : 'Validasi'}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Riwayat Hari Ini
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {todayTransactions.length} transaksi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {todayTransactions.length > 0 ? (
                    <div className="space-y-2 sm:space-y-4">
                      {todayTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-4 border rounded-lg gap-2">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`p-2 rounded-full flex-shrink-0 ${transaction.type === 'stand'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-blue-100 text-blue-600'
                              }`}>
                              {transaction.type === 'stand' ? <Recycle className="h-4 w-4" /> : <Bus className="h-4 w-4" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm">
                                {transaction.type === 'stand' ? 'Tukar Botol' : 'Validasi Tiket'}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 break-all">
                                {transaction.qrCode}
                              </p>
                              <p className="text-xs text-gray-500">{transaction.location}</p>
                              <p className="text-xs text-gray-500">{transaction.timestamp}</p>
                              {transaction.bottles && (
                                <p className="text-xs text-gray-500">
                                  Botol: {transaction.bottles.jumbo + transaction.bottles.besar + transaction.bottles.sedang + transaction.bottles.kecil + transaction.bottles.cup}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant={transaction.type === 'stand' ? 'default' : 'secondary'} className="text-xs sm:text-sm w-fit">
                            {transaction.tickets > 0 ? '+' : ''}{transaction.tickets}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">Belum ada transaksi hari ini</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'register' && (
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-base sm:text-lg flex items-center">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Buat Akun Penumpang
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Daftarkan penumpang baru ke sistem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RegisterPassengerForm />
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Pilih Mode Kerja</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Pilih lokasi tugas dan mode kerja untuk memulai shift
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="text-center p-4 sm:p-6 border-2 border-dashed border-gray-200 rounded-lg">
                  <Recycle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium mb-2">Mode Stand</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Tukar botol plastik menjadi tiket bus
                  </p>
                  <Button
                    onClick={() => startShift('stand')}
                    className="w-full bg-green-600 hover:bg-green-700 text-sm"
                    disabled={!selectedLocation}
                  >
                    Mulai Stand
                  </Button>
                </div>

                <div className="text-center p-4 sm:p-6 border-2 border-dashed border-gray-200 rounded-lg">
                  <Bus className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium mb-2">Mode Karnet</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Validasi tiket penumpang yang akan naik bus
                  </p>
                  <Button
                    onClick={() => startShift('karnet')}
                    variant="outline"
                    className="w-full text-sm"
                    disabled={!selectedLocation}
                  >
                    Mulai Karnet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function RegisterPassengerForm() {
  const [formData, setFormData] = useState({
    nik: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    if (registeredUser) setRegisteredUser(null);
  };

  const validateForm = () => {
    if (!formData.name || !formData.password || !formData.nik) {
      setError('Nama, NIK, dan password harus diisi');
      return false;
    }
    if (!/^\d{16}$/.test(formData.nik)) {
      setError('NIK harus 16 digit angka');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setRegisteredUser(null);

    try {
      const userData = {
        nik: formData.nik,
        password: formData.password,
        name: formData.name,
        role: 'penumpang',
        phone: formData.phone || undefined,
        address: formData.address || undefined
      };

      const response = await authAPI.register(userData);

      if (!response.user || !response.user.qrCode) {
        throw new Error('Respon server tidak valid atau QR code tidak ditemukan');
      }

      setRegisteredUser(response.user as RegisteredUser);
      toast.success('Registrasi penumpang berhasil!');

      setFormData({
        nik: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        address: ''
      });

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registrasi gagal';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (registeredUser) {
    return (
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 p-3 sm:p-4 bg-green-50 rounded-lg">
        <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-600" />
        <h3 className="text-base sm:text-xl font-semibold">Penumpang Berhasil Didaftarkan!</h3>
        <div className="w-full">
          <p className="text-xs sm:text-sm">Nama: <span className="font-medium block mt-1">{registeredUser.name}</span></p>
          <p className="text-xs sm:text-sm mt-2">NIK: <span className="font-medium block mt-1">{registeredUser.nik}</span></p>
        </div>
        
        {registeredUser.qrCode ? (
           <QRGenerator value={registeredUser.qrCode} />
        ) : (
          <p className="text-red-500 text-xs sm:text-sm">Gagal memuat QR Code.</p>
        )}
       
        <p className="text-xs text-gray-600 break-all">
          QR Code: <span className="font-mono bg-gray-100 p-1 rounded text-xs">{registeredUser.qrCode}</span>
        </p>
        <p className="text-xs text-gray-500">Minta penumpang untuk menyimpan QR Code ini.</p>
        <Button onClick={() => setRegisteredUser(null)} className="w-full text-sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Daftarkan Lagi
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="reg-name" className="text-xs sm:text-sm">Nama Lengkap *</Label>
        <Input 
          id="reg-name" 
          value={formData.name} 
          onChange={(e) => handleInputChange('name', e.target.value)} 
          placeholder="Masukkan nama lengkap" 
          className="text-sm h-8 sm:h-10"
          required 
        />
      </div>
      <div className="space-y-1 sm:space-y-2">
        <Label htmlFor="reg-nik" className="text-xs sm:text-sm flex items-center gap-2">
          <CreditCard className="h-4 w-4" /> NIK (16 digit) *
        </Label>
        <Input 
          id="reg-nik" 
          value={formData.nik} 
          onChange={(e) => handleInputChange('nik', e.target.value.replace(/\D/g, ''))} 
          maxLength={16} 
          placeholder="1234567890123456" 
          className="text-sm h-8 sm:h-10"
          required 
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="reg-password" className="text-xs sm:text-sm">Password *</Label>
          <Input 
            id="reg-password" 
            type="password" 
            value={formData.password} 
            onChange={(e) => handleInputChange('password', e.target.value)} 
            placeholder="Min 6 kar" 
            className="text-sm h-8 sm:h-10"
            required 
          />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="reg-confirmPassword" className="text-xs sm:text-sm">Konfirmasi *</Label>
          <Input 
            id="reg-confirmPassword" 
            type="password" 
            value={formData.confirmPassword} 
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)} 
            placeholder="Ulangi pass" 
            className="text-sm h-8 sm:h-10"
            required 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="reg-phone" className="text-xs sm:text-sm">No. Telp</Label>
          <Input 
            id="reg-phone" 
            value={formData.phone} 
            onChange={(e) => handleInputChange('phone', e.target.value)} 
            placeholder="0812..." 
            className="text-sm h-8 sm:h-10"
          />
        </div>
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="reg-address" className="text-xs sm:text-sm">Alamat</Label>
          <Input 
            id="reg-address" 
            value={formData.address} 
            onChange={(e) => handleInputChange('address', e.target.value)} 
            placeholder="Alamat" 
            className="text-sm h-8 sm:h-10"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="py-2 sm:py-3">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full text-sm" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mendaftarkan...
          </>
        ) : (
          'Daftarkan Penumpang'
        )}
      </Button>
    </form>
  );
}
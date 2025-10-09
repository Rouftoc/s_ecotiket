import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode, 
  Recycle, 
  Bus, 
  MapPin, 
  Scan,
  LogOut,
  CheckCircle,
  AlertCircle,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import QRScanner from '@/components/QRScanner';
import { transactionsAPI, usersAPI } from '@/lib/api';

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

export default function PetugasDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeMode, setActiveMode] = useState<'stand' | 'karnet' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentQR, setCurrentQR] = useState('');
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
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
    { id: 'koridor-1', name: 'Koridor 1', type: 'koridor' },
    { id: 'koridor-2', name: 'Koridor 2', type: 'koridor' },
    { id: 'koridor-3', name: 'Koridor 3', type: 'koridor' }
  ];

  const calculateTickets = () => {
    const { jumbo, besar, sedang, kecil, cup } = bottleCount;
    return Math.floor(jumbo / 1) + Math.floor(besar / 5) + Math.floor(sedang / 8) + Math.floor(kecil / 15) + Math.floor(cup / 20);
  };

  const handleQRScan = async (qrCode: string) => {
    if (!qrCode || qrCode.trim() === '') {
      toast.error('QR Code tidak valid');
      return;
    }

    const trimmedQR = qrCode.trim();
    setCurrentQR(trimmedQR);
    
    if (currentUserData && currentUserData.qrCode === trimmedQR) {
      console.log('✅ Using cached user data:', currentUserData.name);
      toast.success(`QR Code ${trimmedQR} berhasil di-scan - Penumpang: ${currentUserData.name} (${currentUserData.ticketsBalance} tiket)`);
      return;
    }
    
    try {
      console.log('🔍 Mencari pengguna dengan QR Code:', trimmedQR);
      
      // Get all users first
      const response = await usersAPI.getAllUsers();
      
      console.log('📊 Response dari API:', response);
      console.log('📊 Users data:', response?.users);
      
      if (response && response.users && Array.isArray(response.users)) {
        console.log(`📋 Total users ditemukan: ${response.users.length}`);
        
        const userData = response.users.find((user: any) => {
          const userQrCode = user.qrCode || '';
          console.log(`🔍 Comparing: "${userQrCode}" === "${trimmedQR}"`);
          return userQrCode === trimmedQR;
        });
        
        console.log('🎯 User ditemukan:', userData);
        
        if (userData) {
          // Check if user is penumpang and active
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
          console.log('✅ User data berhasil di-normalize:', normalizedUser);
        } else {
          setCurrentUserData(null);
          toast.error(`Penumpang dengan QR Code ${trimmedQR} tidak ditemukan di database`);
          console.log('❌ QR Code tidak ditemukan di database');
        }
      } else {
        setCurrentUserData(null);
        toast.error('Gagal memuat data pengguna dari server');
        console.log('❌ Response tidak valid atau users array kosong');
      }
    } catch (error) {
      console.error('❌ Error finding user:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          console.log('🚨 Authentication error - token may be expired');
          toast.error('Sesi login berakhir, silakan login ulang');
          navigate('/login');
          return;
        } else if (error.message.includes('403')) {
          toast.error('Tidak ada izin untuk mengakses data pengguna');
        } else if (error.message.includes('Access token required')) {
          toast.error('Token akses diperlukan, silakan login ulang');
          navigate('/login');
          return;
        } else {
          toast.error(`Gagal memverifikasi QR Code: ${error.message}`);
        }
      } else {
        toast.error('Gagal memverifikasi QR Code - Error tidak diketahui');
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
      console.log('🔄 Memulai transaksi botol...');
      console.log('📋 Data transaksi:', {
        userQrCode: currentQR,
        userName: currentUserData.name,
        location: selectedLocation,
        bottles: bottleCount,
        totalTickets
      });

      // Process each bottle type separately
      const bottleTypes = [
        { type: 'jumbo', count: bottleCount.jumbo },
        { type: 'besar', count: bottleCount.besar },
        { type: 'sedang', count: bottleCount.sedang },
        { type: 'kecil', count: bottleCount.kecil },
        { type: 'cup', count: bottleCount.cup }
      ];

      console.log('🔄 Processing bottle types:', bottleTypes);

      for (const bottle of bottleTypes) {
        if (bottle.count > 0) {
          console.log(`🔄 Processing ${bottle.type}: ${bottle.count} bottles`);
          
          const result = await transactionsAPI.processBottleExchange({
            userQrCode: currentQR,
            bottleType: bottle.type,
            bottleCount: bottle.count
          });
          console.log(`✅ ${bottle.type} processed successfully:`, result);
          
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
      console.log('✅ Transaksi berhasil:', transaction);
      setCurrentUserData(prev => prev ? {
        ...prev,
        ticketsBalance: prev.ticketsBalance + totalTickets
      } : null);
      
      // Reset bottle count but keep user data for potential next transaction
      setBottleCount({ jumbo: 0, besar: 0, sedang: 0, kecil: 0, cup: 0 });

    } catch (error) {
      console.error('❌ Error processing bottle exchange:', error);
      
      if (error instanceof Error) {
        console.log('❌ Error details:', {
          message: error.message,
          stack: error.stack
        });
        
        if (error.message.includes('404')) {
          toast.error('Endpoint transaksi botol tidak ditemukan di backend (404)');
        } else if (error.message.includes('403')) {
          toast.error('Tidak ada permission untuk mengakses endpoint transaksi botol');
        } else if (error.message.includes('401')) {
          toast.error('Sesi login berakhir, silakan login ulang');
          navigate('/login');
        } else if (error.message.includes('500')) {
          toast.error('Server error saat memproses transaksi botol');
        } else {
          toast.error(`Gagal memproses transaksi botol: ${error.message}`);
        }
      } else {
        toast.error('Gagal memproses transaksi botol - Error tidak diketahui');
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

    console.log('🎯 Validating ticket balance:', {
      currentBalance: currentUserData.ticketsBalance,
      required: 1,
      hasEnough: currentUserData.ticketsBalance >= 1
    });

    if (currentUserData.ticketsBalance < 1) {
      toast.error(`❌ Saldo tiket ${currentUserData.name} tidak mencukupi! Saldo saat ini: ${currentUserData.ticketsBalance} tiket (minimal 1 tiket diperlukan)`);
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Memulai validasi tiket...');
      console.log('📋 Data validasi:', {
        userQrCode: currentQR,
        userName: currentUserData.name,
        location: selectedLocation,
        currentBalance: currentUserData.ticketsBalance
      });

      await transactionsAPI.processTicketUsage({
        userQrCode: currentQR,
        ticketCount: 1,
        location: locations.find(l => l.id === selectedLocation)?.name
      });

      // Create transaction record for local display
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
      toast.success(`✅ Tiket valid! Penumpang ${currentUserData.name} dapat naik bus. Sisa saldo: ${currentUserData.ticketsBalance - 1} tiket`);
      console.log('✅ Validasi tiket berhasil:', transaction);
      
      // Update user balance locally (optimistic update)
      setCurrentUserData(prev => prev ? {
        ...prev,
        ticketsBalance: prev.ticketsBalance - 1
      } : null);

    } catch (error) {
      console.error('❌ Error processing ticket usage:', error);
      
      if (error instanceof Error) {
        console.log('❌ Ticket validation error details:', {
          message: error.message,
          stack: error.stack
        });
        
        if (error.message.includes('404')) {
          toast.error('Endpoint validasi tiket tidak ditemukan di backend (404)');
        } else if (error.message.includes('403')) {
          toast.error('Tidak ada permission untuk mengakses endpoint validasi tiket');
        } else if (error.message.includes('401')) {
          toast.error('Sesi login berakhir, silakan login ulang');
          navigate('/login');
        } else {
          toast.error(`Gagal memproses validasi tiket: ${error.message}`);
        }
      } else {
        toast.error('Gagal memproses validasi tiket');
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
    toast.success(`Shift ${mode} dimulai di ${locations.find(l => l.id === selectedLocation)?.name}`);
  };

  const endShift = () => {
    setActiveMode(null);
    setCurrentQR('');
    setCurrentUserData(null);
    setBottleCount({ jumbo: 0, besar: 0, sedang: 0, kecil: 0, cup: 0 });
    toast.success('Shift berakhir');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">Eco-Tiket</h1>
            <Badge variant="secondary">Petugas</Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Halo, {user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Status Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Status Shift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label>Lokasi Tugas:</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Pilih lokasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name} ({location.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {activeMode && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="bg-green-600">
                      {activeMode === 'stand' ? 'Stand Aktif' : 'Karnet Aktif'}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      di {locations.find(l => l.id === selectedLocation)?.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-x-2">
                {!activeMode ? (
                  <>
                    <Button onClick={() => startShift('stand')} className="bg-green-600 hover:bg-green-700">
                      <Recycle className="h-4 w-4 mr-2" />
                      Mulai Stand
                    </Button>
                    <Button onClick={() => startShift('karnet')} variant="outline">
                      <Bus className="h-4 w-4 mr-2" />
                      Mulai Karnet
                    </Button>
                  </>
                ) : (
                  <Button onClick={endShift} variant="destructive">
                    Akhiri Shift
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {activeMode && (
          <Tabs defaultValue="transaction" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transaction">Transaksi</TabsTrigger>
              <TabsTrigger value="history">Riwayat Hari Ini</TabsTrigger>
            </TabsList>

            <TabsContent value="transaction" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* QR Scanner */}
                <QRScanner 
                  onScanResult={handleQRScan}
                  placeholder="Scan QR Code penumpang"
                />

                {/* Transaction Form */}
                {activeMode === 'stand' ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Recycle className="h-5 w-5 mr-2" />
                        Stand - Tukar Botol ke Tiket
                      </CardTitle>
                      <CardDescription>
                        Input jumlah botol yang ditukar
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {currentUserData && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 text-green-800">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">Penumpang: {currentUserData.name}</span>
                          </div>
                          <div className="text-sm text-green-700 mt-1">
                            <p>Saldo Tiket: <span className="font-bold">{currentUserData.ticketsBalance}</span> | Poin: {currentUserData.points}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Botol Jumbo</Label>
                          <Input
                            type="number"
                            min="0"
                            value={bottleCount.jumbo}
                            onChange={(e) => setBottleCount({...bottleCount, jumbo: parseInt(e.target.value) || 0})}
                          />
                          <p className="text-xs text-gray-500">1 botol = 1 tiket</p>
                        </div>

                        <div className="space-y-2">
                          <Label>Botol Besar</Label>
                          <Input
                            type="number"
                            min="0"
                            value={bottleCount.besar}
                            onChange={(e) => setBottleCount({...bottleCount, besar: parseInt(e.target.value) || 0})}
                          />
                          <p className="text-xs text-gray-500">5 botol = 1 tiket</p>
                        </div>

                        <div className="space-y-2">
                          <Label>Botol Sedang</Label>
                          <Input
                            type="number"
                            min="0"
                            value={bottleCount.sedang}
                            onChange={(e) => setBottleCount({...bottleCount, sedang: parseInt(e.target.value) || 0})}
                          />
                          <p className="text-xs text-gray-500">8 botol = 1 tiket</p>
                        </div>

                        <div className="space-y-2">
                          <Label>Botol Kecil</Label>
                          <Input
                            type="number"
                            min="0"
                            value={bottleCount.kecil}
                            onChange={(e) => setBottleCount({...bottleCount, kecil: parseInt(e.target.value) || 0})}
                          />
                          <p className="text-xs text-gray-500">15 botol = 1 tiket</p>
                        </div>

                        <div className="space-y-2">
                          <Label>Cup Plastik</Label>
                          <Input
                            type="number"
                            min="0"
                            value={bottleCount.cup}
                            onChange={(e) => setBottleCount({...bottleCount, cup: parseInt(e.target.value) || 0})}
                          />
                          <p className="text-xs text-gray-500">20 cup = 1 tiket</p>
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Total Tiket yang Didapat:</span>
                          <Badge className="text-lg px-3 py-1 bg-green-600">
                            {calculateTickets()} Tiket
                          </Badge>
                        </div>
                      </div>

                      <Button 
                        onClick={handleStandTransaction} 
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={!currentUserData || calculateTickets() === 0 || loading}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {loading ? 'Memproses...' : 'Proses Transaksi'}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bus className="h-5 w-5 mr-2" />
                        Karnet - Validasi Tiket Bus
                      </CardTitle>
                      <CardDescription>
                        Validasi tiket penumpang untuk naik bus
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {currentUserData && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2 text-blue-800">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">Penumpang: {currentUserData.name}</span>
                          </div>
                          <div className="text-sm text-blue-700 mt-1">
                            <p>Saldo Tiket: <span className="font-bold text-lg">{currentUserData.ticketsBalance}</span> | Poin: {currentUserData.points}</p>
                            {currentUserData.ticketsBalance < 1 && (
                              <p className="text-red-600 font-medium mt-1">⚠️ Saldo tidak mencukupi untuk naik bus!</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 text-blue-800">
                          <AlertCircle className="h-5 w-5" />
                          <span className="font-medium">Tarif Bus: 1 Tiket</span>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          Sistem akan otomatis memotong 1 tiket dari saldo penumpang
                        </p>
                      </div>

                      <Button 
                        onClick={handleKarnetTransaction} 
                        className="w-full"
                        disabled={!currentUserData || (currentUserData?.ticketsBalance < 1) || loading}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {loading ? 'Memproses...' : 'Validasi Tiket'}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Riwayat Transaksi Hari Ini
                  </CardTitle>
                  <CardDescription>
                    Semua transaksi yang telah diproses hari ini ({todayTransactions.length} transaksi)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {todayTransactions.length > 0 ? (
                    <div className="space-y-4">
                      {todayTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${
                              transaction.type === 'stand' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              {transaction.type === 'stand' ? <Recycle className="h-4 w-4" /> : <Bus className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="font-medium">
                                {transaction.type === 'stand' ? 'Tukar Botol' : 'Validasi Tiket'}
                              </p>
                              <p className="text-sm text-gray-600">
                                {transaction.qrCode} • {transaction.location}
                              </p>
                              <p className="text-xs text-gray-500">{transaction.timestamp}</p>
                              {transaction.bottles && (
                                <p className="text-xs text-gray-500">
                                  Botol: {transaction.bottles.jumbo + transaction.bottles.besar + transaction.bottles.sedang + transaction.bottles.kecil + transaction.bottles.cup}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge variant={transaction.type === 'stand' ? 'default' : 'secondary'}>
                            {transaction.tickets > 0 ? '+' : ''}{transaction.tickets} Tiket
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Belum ada transaksi hari ini</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {!activeMode && (
          <Card>
            <CardHeader>
              <CardTitle>Pilih Mode Kerja</CardTitle>
              <CardDescription>
                Pilih lokasi tugas dan mode kerja untuk memulai shift
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
                  <Recycle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Mode Stand</h3>
                  <p className="text-gray-600 mb-4">
                    Tukar botol plastik menjadi tiket bus untuk penumpang
                  </p>
                  <Button 
                    onClick={() => startShift('stand')} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!selectedLocation}
                  >
                    Mulai Stand
                  </Button>
                </div>

                <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-lg">
                  <Bus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Mode Karnet</h3>
                  <p className="text-gray-600 mb-4">
                    Validasi tiket penumpang yang akan naik bus
                  </p>
                  <Button 
                    onClick={() => startShift('karnet')} 
                    variant="outline"
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
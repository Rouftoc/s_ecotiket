import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { transactionsAPI, usersAPI, locationsAPI } from '@/lib/api';
import QRScanner from '@/components/common/qr/QRScanner';
import { UserRecord, PetugasTransaction } from '@/types/dashboard';
import { BOTTLE_RATES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, History, UserPlus, LogOut, Menu, X, User as UserIcon } from 'lucide-react';
import logoEcoTiket from '@/assets/logo_ecotiket.png';
import { Badge } from '@/components/ui/badge';
import ShiftStatus from '@/components/petugas/ShiftStatus';
import ModeSelection from '@/components/petugas/ModeSelection';
import StandTransaction from '@/components/petugas/StandTransaction';
import KarnetTransaction from '@/components/petugas/KarnetTransaction';
import PetugasHistory from '@/components/petugas/PetugasHistory';
import PassengerRegister from '@/components/petugas/PassengerRegister';
import PetugasProfile from '@/components/petugas/PetugasProfile';


// User interface kept for local storage compatibility
interface User {
  id_user: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  status?: string;
}

export default function PetugasDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeMode, setActiveMode] = useState<'stand' | 'karnet' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentQR, setCurrentQR] = useState('');
  const [currentUserData, setCurrentUserData] = useState<UserRecord | null>(null);
  const [activeTab, setActiveTab] = useState('transaction');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bottleCount, setBottleCount] = useState({
    jumbo: 0,
    besar: 0,
    sedang: 0,
    kecil: 0,
    cup: 0
  });
  const [todayTransactions, setTodayTransactions] = useState<PetugasTransaction[]>([]);
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
      setTodayTransactions(JSON.parse(storedTransactions));
    } else {
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
        const localTransactions: PetugasTransaction[] = response.transactions.map((t: any) => ({
          id_transaction: t.id_transaction,
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

  const updateLocalStorage = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };


  const [locations, setLocations] = useState<{ id: string; name: string; type: string }[]>([]);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await locationsAPI.getActiveLocations();
        if (response.success && response.locations) {
          const formattedLocations = response.locations.map((loc: any) => ({
            id: String(loc.id_location),
            name: loc.name,
            type: loc.type
          }));
          setLocations(formattedLocations);
        }
      } catch (error) {
        console.error('Failed to load locations', error);
        toast.error('Gagal memuat data lokasi');
      }
    };
    loadLocations();
  }, []);

  const calculateTickets = () => {
    let total = 0;
    (Object.keys(BOTTLE_RATES) as Array<keyof typeof BOTTLE_RATES>).forEach(key => {
      const rate = BOTTLE_RATES[key];
      // Type safe access to bottleCount using the key
      const count = bottleCount[key] || 0;

      if (rate.bottles === 1) {
        total += count * rate.tickets;
      } else {
        total += Math.floor(count / rate.bottles) * rate.tickets;
      }
    });
    return total;
  };

  const handleQRScan = async (qrCode: string) => {
    if (!qrCode || qrCode.trim() === '') {
      toast.error('QR Code tidak valid');
      return;
    }

    const trimmedQR = qrCode.trim();
    setCurrentQR(trimmedQR);

    if (currentUserData && currentUserData.qrCode === trimmedQR) {
      toast.success(`QR Code ${trimmedQR} berhasil di-scan - Penumpang: ${currentUserData.name} (${currentUserData.ticketsBalance} tiket)`);
      return;
    }

    try {
      const response = await usersAPI.getAllUsers();
      if (response && response.users && Array.isArray(response.users)) {
        const userData = response.users.find((user: any) => user.qrCode === trimmedQR);
        if (userData) {
          if (userData.role !== 'penumpang') {
            toast.error(`QR Code ini untuk ${userData.role}, bukan penumpang`);
            setCurrentUserData(null);
            return;
          }
          if (userData.status !== 'active') {
            toast.error(`Akun penumpang ${userData.name} tidak aktif`);
            setCurrentUserData(null);
            return;
          }
          const normalizedUser: UserRecord = {
            id_user: userData.id_user,
            email: userData.email,
            nik: userData.nik,
            name: userData.name,
            role: userData.role,
            phone: userData.phone,
            address: userData.address,
            qrCode: userData.qrCode,
            ticketsBalance: userData.ticketsBalance,
            points: userData.points,
            status: userData.status as 'active' | 'inactive' | 'suspended',
            created_at: userData.created_at || new Date().toISOString()
          };
          setCurrentUserData(normalizedUser);
          toast.success(`QR Code ${trimmedQR} berhasil di-scan - Penumpang: ${normalizedUser.name}`);
        } else {
          setCurrentUserData(null);
          toast.error(`Penumpang dengan QR Code ${trimmedQR} tidak ditemukan`);
        }
      } else {
        setCurrentUserData(null);
        toast.error('Gagal memuat data pengguna');
      }
    } catch (error: any) {
      console.error('Error finding user:', error);
      toast.error(`Gagal memverifikasi QR Code: ${error.message}`);
      setCurrentUserData(null);
    }
  };

  const handleStandTransaction = async () => {
    if (!currentQR || !selectedLocation || !currentUserData) {
      toast.error('Mohon scan QR Code penumpang dan pilih lokasi');
      return;
    }
    const totalTickets = calculateTickets();
    if (totalTickets === 0) {
      toast.error('Jumlah botol tidak mencukupi');
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

      const transaction: PetugasTransaction = {
        id_transaction: Date.now(),
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
    } catch (error: any) {
      toast.error(`Gagal memproses transaksi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKarnetTransaction = async () => {
    if (!currentQR || !selectedLocation || !currentUserData) {
      toast.error('Mohon scan QR Code penumpang dan pilih lokasi');
      return;
    }
    if (currentUserData.ticketsBalance < 1) {
      toast.error('Saldo tiket tidak mencukupi');
      return;
    }

    setLoading(true);
    try {
      await transactionsAPI.processTicketUsage({
        userQrCode: currentQR,
        ticketCount: 1,
        location: locations.find(l => l.id === selectedLocation)?.name
      });

      const transaction: PetugasTransaction = {
        id_transaction: Date.now(),
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
    } catch (error: any) {
      toast.error(`Gagal memproses validasi: ${error.message}`);
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

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Only visible when activeMode is set, matching previous logic) */}
      {activeMode && (
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r`}>
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <img src={logoEcoTiket} alt="Logo" className="h-8 w-auto" />
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="mt-6 px-3 space-y-1">
            {[
              { id: 'transaction', label: 'Transaksi', icon: QrCode },
              { id: 'history', label: 'Riwayat Hari Ini', icon: History },
              { id: 'register', label: 'Daftar Penumpang', icon: UserPlus },
              { id: 'profile', label: 'Profil Saya', icon: UserIcon }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">Petugas</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            {activeMode && (
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            {!activeMode && <img src={logoEcoTiket} alt="Logo" className="h-8 w-auto" />}
            <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
              {activeMode ? (
                activeTab === 'transaction' ? 'Transaksi' :
                  activeTab === 'history' ? 'Riwayat Transaksi' :
                    activeTab === 'register' ? 'Daftar Penumpang' : 'Profil Petugas'
              ) : ''}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:inline">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* ShiftStatus Card - Always Visible when needed, EXCEPT for Profile? No, keep it. */}
            {/* User might be editing profile while on shift? Maybe hide if activeTab is profile? */}
            {/* Usually profiles are separate. I will hide ShiftStatus if Tab is Profile. */}
            {activeTab !== 'profile' && (
              <ShiftStatus
                locations={locations}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                activeMode={activeMode}
                endShift={endShift}
              />
            )}

            {activeMode ? (
              <>
                {activeTab === 'transaction' && (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <QRScanner onScanResult={handleQRScan} placeholder="Scan QR Code penumpang" autoStart={true} />

                    {activeMode === 'stand' ? (
                      <StandTransaction
                        currentUserData={currentUserData}
                        bottleCount={bottleCount}
                        setBottleCount={setBottleCount}
                        calculateTickets={calculateTickets}
                        handleStandTransaction={handleStandTransaction}
                        loading={loading}
                      />
                    ) : (
                      <KarnetTransaction
                        currentUserData={currentUserData}
                        handleKarnetTransaction={handleKarnetTransaction}
                        loading={loading}
                      />
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <PetugasHistory transactions={todayTransactions} />
                )}

                {activeTab === 'register' && (
                  <div className="max-w-6xl mx-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <UserPlus className="h-5 w-5" />
                          Registrasi Penumpang Baru
                        </CardTitle>
                        <CardDescription>Buat akun untuk penumpang yang belum terdaftar</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PassengerRegister />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <PetugasProfile
                    user={user}
                    setUser={setUser}
                    updateLocalStorage={updateLocalStorage}
                  />
                )}
              </>
            ) : (
              <ModeSelection selectedLocation={selectedLocation} startShift={startShift} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
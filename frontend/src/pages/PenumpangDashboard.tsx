import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, X, QrCode, History, User, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { transactionsAPI, notificationsAPI } from '@/lib/api';
import logoEcoTiket from '@/assets/logo_ecotiket.png';
import { Badge } from '@/components/ui/badge';
import NotificationBell from '@/components/common/NotificationBell';

// New Components
import PassengerStats from '@/components/penumpang/PassengerStats';
import PassengerQR from '@/components/penumpang/PassengerQR';
import PassengerHistory from '@/components/penumpang/PassengerHistory';
import PassengerProfile from '@/components/penumpang/PassengerProfile';
import ChatBot from '@/components/common/ChatBot';

interface Transaction {
  id_transaction: number;
  id_user: number;
  id_petugas: number;
  type: string;
  description: string;
  bottles_count?: number;
  bottle_type?: string;
  tickets_change: number;
  points_earned?: number;
  location?: string;
  status: string;
  created_at: string;
  user_name?: string;
  petugas_name?: string;
}

interface UserData {
  id_user: number;
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

export default function PenumpangDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData) as UserData;
    if (parsedUser.role !== 'penumpang') {
      navigate('/login');
      return;
    }

    setUser(parsedUser);
    loadTransactions(parsedUser.id_user);

    // Cek tiket kadaluarsa saat login
    fetch(`http://localhost:5000/api/notifications/check-expiring`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${parsedUser.token}`
      }
    }).catch(() => {});
  }, [navigate]);

  const loadTransactions = async (userId: number) => {
    setLoading(true);
    try {
      const response = await transactionsAPI.getUserTransactions(userId);
      if (Array.isArray(response.transactions)) {
        setTransactions(response.transactions);
      } else {
        setTransactions([]);
      }
    } catch (error: any) {
      toast.error("Gagal memuat riwayat transaksi: " + error.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const updateLocalStorage = (updatedUser: UserData) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const [activeTab, setActiveTab] = useState('qr');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (Mobile Drawer + Desktop Fixed) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <img src={logoEcoTiket} alt="Logo" className="h-8 w-auto" />
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          {[
            { id: 'qr', label: 'Dashboard', icon: QrCode },
            { id: 'history', label: 'Riwayat Transaksi', icon: History },
            { id: 'profile', label: 'Profil Saya', icon: User }
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
              <p className="text-xs text-gray-500 truncate">Penumpang</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              {activeTab === 'qr' ? 'Dashboard' : activeTab === 'history' ? 'Riwayat Transaksi' : 'Profil Pengguna'}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <NotificationBell />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {activeTab === 'qr' && (
              <>
                <PassengerStats user={user} transactionCount={transactions.length} />
                <PassengerQR qrCode={user.qrCode} userName={user.name} />
              </>
            )}

            {activeTab === 'history' && (
              <PassengerHistory transactions={transactions} loading={loading} />
            )}

            {activeTab === 'profile' && (
              <PassengerProfile
                user={user}
                setUser={setUser}
                updateLocalStorage={updateLocalStorage}
              />
            )}
          </div>
        </main>
      </div>
      <ChatBot user={user} />
    </div>
  );
}
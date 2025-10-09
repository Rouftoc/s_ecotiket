import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  QrCode,
  LogOut,
  Ticket,
  Coins,
  History,
  User,
  Edit,
  Save,
  X,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import QRGenerator from '@/components/QRGenerator';
import { usersAPI, transactionsAPI } from '@/lib/api';

interface Transaction {
  id: number;
  user_id: number;      
  petugas_id: number;    
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

export default function PenumpangDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    address: ''
  });

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
    setEditData({
      name: parsedUser.name || '',
      phone: parsedUser.phone || '',
      address: parsedUser.address || ''
    });

    loadTransactions(parsedUser.id);
  }, [navigate]);

  const loadTransactions = async (userId: number) => {
  setLoading(true);
  try {
    const response = await transactionsAPI.getUserTransactions(userId);
    if (Array.isArray(response.transactions)) {
      setTransactions(response.transactions);
    } else {
      console.warn("Tidak ada data transaksi atau API mengembalikan pesan:", response.transactions);
      setTransactions([]); // Atur state menjadi array kosong
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    toast.error("Gagal memuat riwayat transaksi: " + errorMessage);
    setTransactions([]); 
  } finally {
    setLoading(false);
  }
};

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleEditProfile = async () => {
    try {
      const response = await usersAPI.updateProfile(editData);

      if (!response.user) {
        throw new Error('Invalid response from server');
      }

      const updatedUser = { ...user, ...response.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser as UserData);

      setEditMode(false);
      toast.success('Profil berhasil diperbarui');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Gagal memperbarui profil: ' + errorMessage);
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'bottle_exchange' ? <Coins className="h-4 w-4" /> : <Ticket className="h-4 w-4" />;
  };

  const getTransactionColor = (type: string) => {
    return type === 'bottle_exchange' ? 'text-green-600' : 'text-blue-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Penumpang</h1>
              <p className="text-sm text-gray-600">Selamat datang, {user.name}</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saldo Tiket</p>
                  <p className="text-3xl font-bold text-blue-600">{user.ticketsBalance}</p>
                </div>
                <Ticket className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Poin</p>
                  <p className="text-3xl font-bold text-green-600">{user.points}</p>
                </div>
                <Coins className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
                  <p className="text-3xl font-bold text-purple-600">{transactions.length}</p>
                </div>
                <History className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="qr" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="history">Riwayat Transaksi</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="qr">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <QrCode className="h-6 w-6" />
                  QR Code Anda
                </CardTitle>
                <CardDescription>
                  Tunjukkan QR Code ini kepada petugas untuk melakukan transaksi
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <QRGenerator value={user.qrCode} />
                <div className="text-center">
                  <p className="text-sm font-mono text-gray-600">{user.qrCode}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Simpan screenshot QR Code ini untuk backup
                  </p>
                </div>
                <Alert>
                  <AlertDescription>
                    <strong>Tips:</strong> Pastikan QR Code terlihat jelas dan tidak rusak saat melakukan transaksi.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Riwayat Transaksi
                </CardTitle>
                <CardDescription>
                  Semua aktivitas transaksi Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Memuat riwayat transaksi...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Belum ada transaksi</p>
                    <p className="text-sm text-gray-400">Mulai tukar botol untuk mendapatkan tiket!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full bg-gray-100 ${getTransactionColor(transaction.type)}`}>
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-gray-900">{transaction.description}</p>
                                {getStatusIcon(transaction.status)}
                              </div>
                              <div className="text-sm text-gray-600 space-y-1">
                                <p>Petugas: {transaction.petugas_name}</p>
                                {transaction.location && (
                                  <p className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {transaction.location}
                                  </p>
                                )}
                                <p className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(transaction.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex flex-col gap-1">
                              {transaction.tickets_change !== 0 && (
                                <Badge variant={transaction.tickets_change > 0 ? "default" : "secondary"}>
                                  {transaction.tickets_change > 0 ? '+' : ''}{transaction.tickets_change} tiket
                                </Badge>
                              )}
                              {transaction.points_earned > 0 && (
                                <Badge variant="outline" className="text-green-600">
                                  +{transaction.points_earned} poin
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profil Saya
                  </div>
                  {!editMode && (
                    <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profil
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  Informasi akun dan data pribadi Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {editMode ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Alamat</Label>
                      <Textarea
                        id="address"
                        value={editData.address}
                        onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Masukkan alamat lengkap"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleEditProfile}>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan
                      </Button>
                      <Button variant="outline" onClick={() => setEditMode(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Batal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Nama Lengkap</Label>
                        <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          NIK
                        </Label>
                        <p className="mt-1 text-sm text-gray-900 font-mono">{user.nik}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Nomor Telepon
                        </Label>
                        <p className="mt-1 text-sm text-gray-900">{user.phone || 'Belum diisi'}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">QR Code</Label>
                        <p className="mt-1 text-sm text-gray-900 font-mono">{user.qrCode}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Status Akun</Label>
                        <div className="mt-1">
                          <Badge className="bg-green-100 text-green-800">
                            {user.status === 'active' ? 'Aktif' : user.status}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Saldo Tiket</Label>
                        <p className="mt-1 text-sm text-gray-900">{user.ticketsBalance} tiket</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Total Poin</Label>
                        <p className="mt-1 text-sm text-gray-900">{user.points} poin</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Alamat
                        </Label>
                        <p className="mt-1 text-sm text-gray-900">{user.address || 'Belum diisi'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
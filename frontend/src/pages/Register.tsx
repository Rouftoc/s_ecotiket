import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import QRGenerator from '@/components/QRGenerator';
import { authAPI } from '@/lib/api';

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
  token?: string; 
}

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);

  // Removed 'role' and 'email' from the initial form state
  const [formData, setFormData] = useState({
    nik: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
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

    try {
      const userData = {
        nik: formData.nik,
        password: formData.password,
        name: formData.name,
        role: 'penumpang', // Role is hardcoded here
        phone: formData.phone || undefined,
        address: formData.address || undefined
      };

      const response = await authAPI.register(userData);
      
      if (!response.user || !response.token) {
        throw new Error('Invalid response from server');
      }

      const userWithToken = { ...response.user, token: response.token };
      setRegisteredUser(userWithToken as RegisteredUser);
      
      toast.success('Registrasi berhasil!');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registrasi gagal';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    if (!registeredUser) return;

    localStorage.setItem('user', JSON.stringify(registeredUser));

    navigate('/penumpang');
  };

  if (registeredUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-green-700">Registrasi Berhasil!</CardTitle>
            <CardDescription>
              Akun Anda telah berhasil dibuat
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              {registeredUser.qrCode ? (
                <QRGenerator value={registeredUser.qrCode} />
              ) : (
                <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                  <p className="text-gray-500">QR Code tidak tersedia</p>
                </div>
              )}
              <p className="mt-2 text-sm text-gray-600">
                QR Code: <span className="font-mono">{registeredUser.qrCode || 'N/A'}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Simpan QR Code ini untuk login cepat
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nama:</span>
                <span className="font-medium">{registeredUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium capitalize">{registeredUser.role}</span>
              </div>
              {registeredUser.nik && (
                <div className="flex justify-between">
                  <span className="text-gray-600">NIK:</span>
                  <span className="font-medium">{registeredUser.nik}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Saldo Tiket:</span>
                <span className="font-medium">{registeredUser.ticketsBalance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Poin:</span>
                <span className="font-medium">{registeredUser.points}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={handleLoginRedirect} className="w-full">
                Masuk ke Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Kembali ke Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-green-700">
            <UserPlus className="h-6 w-6" />
            Daftar Akun Penumpang
          </CardTitle>
          <CardDescription>
            Buat akun untuk menggunakan sistem Eco-Tiket
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap *</Label>
              <Input
                id="name"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            {/* NIK input is now always shown */}
            <div className="space-y-2">
              <Label htmlFor="nik" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                NIK (16 digit) *
              </Label>
              <Input
                id="nik"
                placeholder="1234567890123456"
                maxLength={16}
                value={formData.nik}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  handleInputChange('nik', value);
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                placeholder="08123456789"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Textarea
                id="address"
                placeholder="Alamat lengkap"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mendaftar...
                </>
              ) : (
                'Daftar Akun'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sudah punya akun?{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal"
                onClick={() => navigate('/login')}
              >
                Masuk sekarang
              </Button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-sm"
            >
              ← Kembali ke Beranda
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
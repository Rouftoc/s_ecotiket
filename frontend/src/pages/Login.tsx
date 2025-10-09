import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import logoEcoTiket from '@/assets/logo_ecotiket.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, QrCode, Mail, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import QRScanner from '@/components/QRScanner';
import { authAPI } from '@/lib/api';

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

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQRScanner, setShowQRScanner] = useState(false);

  const [emailData, setEmailData] = useState({
    email: '',
    password: ''
  });

  const [nikData, setNikData] = useState({
    nik: '',
    password: ''
  });

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailData.email || !emailData.password) {
      setError('Email dan password harus diisi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(emailData.email, emailData.password);

      if (!response.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('user', JSON.stringify({
        ...response.user,
        token: response.token
      }));

      toast.success('Login berhasil!');

      if (response.user.role === 'admin') {
        navigate('/admin');
      } else if (response.user.role === 'petugas') {
        navigate('/petugas');
      } else {
        navigate('/penumpang');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login gagal';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNIKLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nikData.nik || !nikData.password) {
      setError('NIK dan password harus diisi');
      return;
    }

    if (!/^\d{16}$/.test(nikData.nik)) {
      setError('NIK harus 16 digit angka');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login('', nikData.password, undefined, nikData.nik);

      if (!response.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('user', JSON.stringify({
        ...response.user,
        token: response.token
      }));

      toast.success('Login berhasil!');
      navigate('/penumpang');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login gagal';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (qrCode: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login('', '', qrCode);

      if (!response.user) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('user', JSON.stringify({
        ...response.user,
        token: response.token
      }));

      toast.success('Login berhasil dengan QR Code!');
      setShowQRScanner(false);

      if (response.user.role === 'admin') {
        navigate('/admin');
      } else if (response.user.role === 'petugas') {
        navigate('/petugas');
      } else {
        navigate('/penumpang');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'QR Code tidak valid';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (showQRScanner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <QrCode className="h-6 w-6" />
              Scan QR Code
            </CardTitle>
            <CardDescription>
              Arahkan kamera ke QR Code Anda untuk login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRScanner onScanResult={handleQRScan} />
            <Button
              variant="outline"
              onClick={() => setShowQRScanner(false)}
              className="w-full mt-4"
              disabled={loading}
            >
              Kembali ke Login
            </Button>
            {error && (
              <Alert className="mt-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <img src={logoEcoTiket} alt="Logo" className="h-20" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="email" className="text-xs">
                <Mail className="h-4 w-4 mr-1" />
                Admin/Petugas
              </TabsTrigger>
              <TabsTrigger value="nik" className="text-xs">
                <CreditCard className="h-4 w-4 mr-1" />
                Penumpang
              </TabsTrigger>
              <TabsTrigger value="qr" className="text-xs">
                <QrCode className="h-4 w-4 mr-1" />
                QR Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@ecotiket.com"
                    value={emailData.email}
                    onChange={(e) => setEmailData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={emailData.password}
                    onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Masuk...
                    </>
                  ) : (
                    'Masuk dengan Email'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="nik">
              <form onSubmit={handleNIKLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK (16 digit)</Label>
                  <Input
                    id="nik"
                    type="text"
                    placeholder="1234567890123456"
                    maxLength={16}
                    value={nikData.nik}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setNikData(prev => ({ ...prev, nik: value }));
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nik-password">Password</Label>
                  <Input
                    id="nik-password"
                    type="password"
                    placeholder="••••••••"
                    value={nikData.password}
                    onChange={(e) => setNikData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Masuk...
                    </>
                  ) : (
                    'Masuk dengan NIK'
                  )}
                </Button>
              </form>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{' '}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={() => navigate('/register')}
                  >
                    Daftar sekarang
                  </Button>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="qr">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Gunakan QR Code yang ada di kartu Anda untuk login cepat
                </p>
                <Button
                  onClick={() => setShowQRScanner(true)}
                  className="w-full"
                  disabled={loading}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Buka Scanner QR
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
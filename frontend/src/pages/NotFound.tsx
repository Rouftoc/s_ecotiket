import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Recycle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Recycle className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-6xl font-bold text-gray-900">404</CardTitle>
          <CardDescription className="text-xl">
            Halaman Tidak Ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Mungkin halaman telah dipindahkan atau URL salah.
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Halaman Sebelumnya
            </Button>
            
            <Link to="/">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Home className="h-4 w-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
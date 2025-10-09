import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Recycle, 
  Bus, 
  Award, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Megaphone,
  Images,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  date: string;
}

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
}

export default function Landing() {
  const [announcements] = useState<Announcement[]>([
    {
      id: 1,
      title: 'Program Eco-Tiket Resmi Diluncurkan!',
      content: 'Mulai hari ini, Anda dapat menukar botol plastik dengan tiket bus Trans Banjarmasin. Mari bersama-sama menjaga lingkungan!',
      type: 'success',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Lokasi Stand Baru di Terminal Antasari',
      content: 'Stand Eco-Tiket baru telah dibuka di Terminal Antasari. Kini lebih mudah untuk menukar botol Anda!',
      type: 'info',
      date: '2024-01-10'
    },
    {
      id: 3,
      title: 'Maintenance Sistem Terjadwal',
      content: 'Sistem akan mengalami maintenance pada tanggal 25 Januari 2024 pukul 02:00 - 04:00 WITA.',
      type: 'warning',
      date: '2024-01-08'
    }
  ]);

  const [galleryImages] = useState<GalleryImage[]>([
    {
      id: 1,
      title: 'Peluncuran Program Eco-Tiket',
      description: 'Acara peluncuran program Eco-Tiket di Terminal Antasari',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      category: 'Event'
    },
    {
      id: 2,
      title: 'Kegiatan Edukasi Daur Ulang',
      description: 'Kegiatan edukasi daur ulang botol plastik untuk masyarakat',
      url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
      category: 'Kegiatan'
    },
    {
      id: 3,
      title: 'Stand Eco-Tiket Terminal KM 0',
      description: 'Stand Eco-Tiket yang beroperasi di Terminal KM 0',
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
      category: 'Fasilitas'
    },
    {
      id: 4,
      title: 'Bus Trans Banjarmasin',
      description: 'Armada bus Trans Banjarmasin yang dapat digunakan dengan tiket Eco-Tiket',
      url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400',
      category: 'Transportasi'
    }
  ]);

  // Conversion rates
  const conversionRates = {
    botol_jumbo: { bottles: 3, tickets: 1, size: '1.5L - 2L' },
    botol_sedang: { bottles: 5, tickets: 1, size: '600ml - 1L' },
    botol_kecil: { bottles: 10, tickets: 1, size: '330ml - 500ml' },
    cup_plastik: { bottles: 15, tickets: 1, size: 'kurang dari 330ml' }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <Megaphone className="h-4 w-4 text-yellow-600" />;
      case 'urgent': return <Megaphone className="h-4 w-4 text-red-600" />;
      default: return <Megaphone className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'urgent': return 'border-l-red-500 bg-red-50';
      default: return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Recycle className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-800">Eco-Tiket</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#beranda" className="text-gray-600 hover:text-green-600 transition-colors">Beranda</a>
              <a href="#cara-kerja" className="text-gray-600 hover:text-green-600 transition-colors">Cara Kerja</a>
              <a href="#pengumuman" className="text-gray-600 hover:text-green-600 transition-colors">Pengumuman</a>
              <a href="#galeri" className="text-gray-600 hover:text-green-600 transition-colors">Galeri</a>
              <a href="#kontak" className="text-gray-600 hover:text-green-600 transition-colors">Kontak</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Masuk</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-green-600 hover:bg-green-700">Daftar</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Tukar Botol Plastik Jadi{' '}
              <span className="text-green-600">Tiket Bus</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Bergabunglah dengan program Eco-Tiket Trans Banjarmasin! Tukar botol plastik bekas Anda 
              menjadi tiket bus gratis sambil membantu menjaga lingkungan yang lebih bersih dan sehat.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/register">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg">
                  <Users className="h-5 w-5 mr-2" />
                  Dapatkan QR Code Anda
                </Button>
              </Link>
              <a href="#cara-kerja">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Pelajari Lebih Lanjut
                </Button>
              </a>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">45,678</div>
                <div className="text-gray-600">Botol Terkumpul</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">9,136</div>
                <div className="text-gray-600">Tiket Dibuat</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">1,234</div>
                <div className="text-gray-600">Pengguna Aktif</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">5</div>
                <div className="text-gray-600">Lokasi Stand</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="cara-kerja" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cara Kerja Eco-Tiket</h2>
            <p className="text-xl text-gray-600">Proses sederhana untuk mendapatkan tiket bus gratis</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Daftar & Dapatkan QR</h3>
              <p className="text-gray-600">Daftar akun dan dapatkan QR Code unik Anda untuk memulai program</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Kumpulkan Botol</h3>
              <p className="text-gray-600">Kumpulkan botol plastik bekas dan bawa ke stand Eco-Tiket terdekat</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bus className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Tukar Jadi Tiket</h3>
              <p className="text-gray-600">Tukar botol dengan tiket bus dan nikmati perjalanan gratis!</p>
            </div>
          </div>

          {/* Conversion Rates */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-center mb-8">Nilai Tukar Botol ke Tiket</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">Botol Jumbo</CardTitle>
                  <CardDescription>{conversionRates.botol_jumbo.size}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {conversionRates.botol_jumbo.bottles}
                  </div>
                  <div className="text-sm text-gray-600">
                    botol = {conversionRates.botol_jumbo.tickets} tiket
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">Botol Sedang</CardTitle>
                  <CardDescription>{conversionRates.botol_sedang.size}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {conversionRates.botol_sedang.bottles}
                  </div>
                  <div className="text-sm text-gray-600">
                    botol = {conversionRates.botol_sedang.tickets} tiket
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">Botol Kecil</CardTitle>
                  <CardDescription>{conversionRates.botol_kecil.size}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {conversionRates.botol_kecil.bottles}
                  </div>
                  <div className="text-sm text-gray-600">
                    botol = {conversionRates.botol_kecil.tickets} tiket
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-lg">Cup Plastik</CardTitle>
                  <CardDescription>{conversionRates.cup_plastik.size}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {conversionRates.cup_plastik.bottles}
                  </div>
                  <div className="text-sm text-gray-600">
                    cup = {conversionRates.cup_plastik.tickets} tiket
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="keuntungan" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Keuntungan Bergabung</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lebih dari sekadar transportasi gratis, ini adalah investasi untuk masa depan
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Dampak Lingkungan</h3>
              <p className="text-gray-600 text-center">
                Setiap botol yang didaur ulang mengurangi polusi dan melindungi ekosistem
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Keamanan Terjamin</h3>
              <p className="text-gray-600 text-center">
                Sistem QR Code yang aman dan terintegrasi dengan database terpusat
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Proses Cepat</h3>
              <p className="text-gray-600 text-center">
                Transaksi instan dengan scan QR Code, tidak perlu antri lama
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Komunitas Peduli</h3>
              <p className="text-gray-600 text-center">
                Bergabung dengan ribuan warga Banjarmasin yang peduli lingkungan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kata Mereka</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pengalaman nyata dari warga Banjarmasin yang telah merasakan manfaatnya
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <p className="text-gray-700 mb-6 italic">
                  "Sangat membantu! Sekarang saya bisa naik bus gratis dengan menukar botol-botol bekas di rumah."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-semibold">SW</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Ibu Sari Wati</p>
                    <p className="text-sm text-gray-600">Ibu Rumah Tangga</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <p className="text-gray-700 mb-6 italic">
                  "Program yang brilliant! Selain hemat ongkos, saya juga ikut menjaga lingkungan Banjarmasin."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-semibold">AR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pak Ahmad Rizki</p>
                    <p className="text-sm text-gray-600">Pegawai Swasta</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="p-6">
              <CardContent className="p-0">
                <p className="text-gray-700 mb-6 italic">
                  "Aplikasinya mudah digunakan dan petugasnya ramah. Recommended untuk semua warga Banjarmasin!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-lg font-semibold">DM</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Dina Maharani</p>
                    <p className="text-sm text-gray-600">Mahasiswa</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Announcement Section */}
      <section id="pengumuman" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pengumuman Terbaru</h2>
            <p className="text-xl text-gray-600">Informasi dan berita terkini dari Eco-Tiket</p>
          </div>
          <div className="space-y-4 max-w-4xl mx-auto">
            {announcements.map((announcement) => (
              <div key={announcement.id} className={`p-6 border-l-4 rounded-lg ${getAnnouncementColor(announcement.type)}`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    {getAnnouncementIcon(announcement.type)}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                    <p className="text-gray-700 mt-1">{announcement.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(announcement.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeri" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Galeri Kegiatan</h2>
            <p className="text-xl text-gray-600">Dokumentasi kegiatan dan program Eco-Tiket</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((image) => (
              <Card key={image.id} className="overflow-hidden group">
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <img src={image.url} alt={image.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">{image.category}</Badge>
                  <h3 className="font-semibold">{image.title}</h3>
                  <p className="text-sm text-gray-600">{image.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Recycle className="h-8 w-8 text-green-400" />
                <h3 className="text-xl font-bold">Eco-Tiket</h3>
              </div>
              <p className="text-gray-400">
                Program inovatif untuk lingkungan yang lebih bersih melalui daur ulang botol plastik.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Program</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a></li>
                <li><a href="#cara-kerja" className="hover:text-white transition-colors">Nilai Tukar</a></li>
                <li><a href="#kontak" className="hover:text-white transition-colors">Lokasi Stand</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Akun</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/register" className="hover:text-white transition-colors">Daftar</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Masuk</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Lupa Password</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bantuan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Eco-Tiket Trans Banjarmasin. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
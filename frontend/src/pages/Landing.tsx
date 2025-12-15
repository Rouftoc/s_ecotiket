import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage1 from '@/assets/hero_section1.png';
import heroImage2 from '@/assets/hero_section2.png';
import heroImage3 from '@/assets/hero_section3.png';
import logoEcoTiket from '@/assets/logo_ecotiket.png';
import poster1 from '@/assets/poster1.png';
import poster2 from '@/assets/poster2.png';
import poster3 from '@/assets/poster3.png';
import poster4 from '@/assets/poster4.png';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Recycle,
  Bus,
  Users,
  CheckCircle,
  Globe,
  QrCode,
  ChevronLeft,
  ChevronRight,
  Menu, 
  X     
} from 'lucide-react';

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const navigate = useNavigate();

  const heroImages = [
    {
      url: heroImage1,
      title: "Peduli Sampah, Peduli Lingkungan",
      desc: "Ubah sampah botol plastik Anda menjadi tiket perjalanan yang bermanfaat."
    },
    {
      url: heroImage2,
      title: "Transportasi Hijau Masa Depan",
      desc: "Nikmati perjalanan nyaman dengan Bus Trans Banjarmasin tanpa biaya tunai."
    },
    {
      url: heroImage3,
      title: "Bergabunglah Bersama Kami",
      desc: "Jadilah bagian dari perubahan positif untuk kota Banjarmasin yang lebih bersih."
    }
  ];

  const posters = [poster1, poster2, poster3, poster4];

  const uniqueTestimonials = [
    { quote: 'Sangat membantu! Sekarang saya bisa naik bus gratis dengan menukar botol-botol bekas di rumah.', name: 'Ibu Sari Wati', role: 'Ibu Rumah Tangga', initials: 'SW' },
    { quote: 'Program yang brilliant! Selain hemat ongkos, saya juga ikut menjaga lingkungan Banjarmasin.', name: 'Pak Ahmad Rizki', role: 'Pegawai Swasta', initials: 'AR' },
    { quote: 'Aplikasinya mudah digunakan dan petugasnya ramah. Recommended untuk semua warga!', name: 'Dina Maharani', role: 'Mahasiswa', initials: 'DM' }
  ];

  const loopingTestimonials = [
    ...uniqueTestimonials,
    ...uniqueTestimonials,
    ...uniqueTestimonials,
    ...uniqueTestimonials,
  ];

  const conversionRates = {
    botol_jumbo: { bottles: 1, tickets: 2, size: 'Galon, Jerigen, Ember, dll' },
    botol_besar: { bottles: 5, tickets: 1, size: 'Botol 1.5 Liter' },
    botol_sedang: { bottles: 8, tickets: 1, size: 'Botol 700 Mililiter' },
    botol_kecil: { bottles: 15, tickets: 1, size: 'Botol 220 Mililiter' },
    gelas_cup: { bottles: 20, tickets: 1, size: 'Gelas Cup Plastik' }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50 animate-fadeIn">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 z-50">
              <img src={logoEcoTiket} alt="Logo" className="h-10 md:h-12 w-auto" />
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#beranda" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Beranda</a>
              <a href="#cara-kerja" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Cara Kerja</a>
              <a href="#keuntungan" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Keuntungan</a>
              <a href="#testimonials" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Testimoni</a>
              <a href="#kontak" className="text-gray-600 hover:text-green-600 font-medium transition-colors">Kontak</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => navigate('/login')} className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">Masuk</button>
              <button onClick={() => navigate('/register')} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">Daftar</button>
            </div>

            <div className="md:hidden z-50 flex items-center">
              <button onClick={toggleMobileMenu} className="p-2 text-gray-600 hover:text-green-600 focus:outline-none">
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ top: '64px' }}>
            <div className="flex flex-col p-6 space-y-6 h-full overflow-y-auto pb-24">
              <a href="#beranda" onClick={toggleMobileMenu} className="text-xl font-medium text-gray-800 border-b pb-2">Beranda</a>
              <a href="#cara-kerja" onClick={toggleMobileMenu} className="text-xl font-medium text-gray-800 border-b pb-2">Cara Kerja</a>
              <a href="#keuntungan" onClick={toggleMobileMenu} className="text-xl font-medium text-gray-800 border-b pb-2">Keuntungan</a>
              <a href="#testimonials" onClick={toggleMobileMenu} className="text-xl font-medium text-gray-800 border-b pb-2">Testimoni</a>
              <a href="#kontak" onClick={toggleMobileMenu} className="text-xl font-medium text-gray-800 border-b pb-2">Kontak</a>
              <div className="flex flex-col space-y-3 pt-4">
                <button onClick={() => { navigate('/login'); toggleMobileMenu(); }} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-medium">Masuk</button>
                <button onClick={() => { navigate('/register'); toggleMobileMenu(); }} className="w-full px-4 py-3 bg-green-600 text-white rounded-lg text-lg font-medium">Daftar</button>
              </div>
            </div>
        </div>
      </nav>

      <section id="beranda" className="py-0 bg-white">
        <div className="w-full relative group">
          <div className="relative w-full h-[500px] md:h-[650px] lg:h-[calc(100vh-80px)] overflow-hidden bg-gray-900">
            {heroImages.map((img, idx) => (
              <div key={idx} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-center h-full">
                  <div className="max-w-xl text-white space-y-4 animate-slideInRight opacity-90 pl-4 md:pl-0">
                      <div className="w-20 h-1 bg-green-500 mb-4"></div>
                      <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">{img.title}</h1>
                      <p className="text-base md:text-lg text-gray-200 leading-relaxed">{img.desc}</p>
                      <div className="pt-4">
                        <button onClick={() => navigate('/register')} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-all transform hover:translate-x-2">Mulai Sekarang</button>
                      </div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center border border-white/30 text-white bg-black/20 hover:bg-green-600 hover:border-green-600 transition-all duration-300 rounded-full md:rounded-md backdrop-blur-sm"><ChevronLeft className="h-6 w-6" /></button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center border border-white/30 text-white bg-black/20 hover:bg-green-600 hover:border-green-600 transition-all duration-300 rounded-full md:rounded-md backdrop-blur-sm"><ChevronRight className="h-6 w-6" /></button>
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
              {heroImages.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-2 transition-all duration-300 rounded-full ${idx === currentSlide ? 'bg-green-500 w-8' : 'bg-white/50 w-2 hover:bg-white'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="cara-kerja" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Cara Kerja Eco-Tiket</h2>
            <p className="text-xl text-gray-600">Proses sederhana untuk mendapatkan tiket bus gratis</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Users, title: '1. Daftar & Dapatkan QR', desc: 'Daftar akun dan dapatkan QR Code unik Anda untuk memulai program', delay: '0s' },
              { icon: Recycle, title: '2. Kumpulkan Botol', desc: 'Kumpulkan botol plastik bekas dan bawa ke stand Eco-Tiket terdekat', delay: '0.2s' },
              { icon: Bus, title: '3. Tukar Jadi Tiket', desc: 'Tukar botol dengan tiket bus dan nikmati perjalanan gratis!', delay: '0.4s' }
            ].map((item, idx) => (
              <div key={idx} className="text-center animate-fadeInUp transform hover:scale-105 transition-transform duration-300" style={{ animationDelay: item.delay }}>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-green-200">
                  <item.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 animate-fadeInUp">
            <h3 className="text-2xl font-bold text-center mb-8">Nilai Tukar Botol ke Tiket</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { key: 'botol_jumbo', label: 'Botol Jumbo', color: 'text-green-600' },
                { key: 'botol_besar', label: 'Botol Besar', color: 'text-green-600' },
                { key: 'botol_sedang', label: 'Botol Sedang', color: 'text-green-600' },
                { key: 'botol_kecil', label: 'Botol Kecil', color: 'text-green-600' },
                { key: 'gelas_cup', label: 'Gelas Cup', color: 'text-green-600' }
              ].map((item, idx) => {
                const rate = conversionRates[item.key];
                return (
                  <Card key={idx} className="transform hover:scale-105 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-lg">{item.label}</CardTitle>
                      <CardDescription>{rate.size}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${item.color}`}>
                        {rate.bottles}
                      </div>
                      <div className="text-sm text-gray-600">
                        = {rate.tickets} tiket
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-2xl font-bold mb-8">Informasi Lebih Lanjut</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                {posters.map((poster, idx) => (
                  <div key={idx} className="max-w-xs overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fadeInUp" style={{ animationDelay: `${idx * 0.15}s` }}>
                    <a href="https://www.instagram.com/p/DLfMGYZBBsd/?igsh=MWtyY3N2azhqNTV3Yw==" target="_blank" rel="noopener noreferrer">
                      <img src={poster} alt={`Poster ${idx + 1}`} className="w-full h-auto object-cover" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="keuntungan" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Keuntungan Bergabung</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Lebih dari sekadar transportasi gratis, ini adalah investasi untuk masa depan
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Globe, title: 'Dampak Lingkungan', desc: 'Setiap botol yang didaur ulang mengurangi polusi dan melindungi ekosistem', delay: '0s' },
              { icon: QrCode, title: 'Keamanan Terjamin', desc: 'Sistem QR Code yang aman dan terintegrasi dengan database terpusat', delay: '0.1s' },
              { icon: CheckCircle, title: 'Proses Cepat', desc: 'Transaksi instan dengan scan QR Code, tidak perlu antri lama', delay: '0.2s' },
              { icon: Users, title: 'Komunitas Peduli', desc: 'Bergabung dengan ribuan warga Banjarmasin yang peduli lingkungan', delay: '0.3s' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 transform hover:scale-105 transition-all duration-300 animate-fadeInUp" style={{ animationDelay: item.delay }}>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-green-200">
                  <item.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 mb-10">
          <div className="text-center animate-fadeInUp">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kata Mereka</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pengalaman nyata dari warga Banjarmasin yang telah merasakan manfaatnya
            </p>
          </div>
        </div>

        <div className="relative w-full">
          <div 
            className="flex gap-8 animate-scroll w-max"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
            }}
          >
            {loopingTestimonials.map((testimonial, idx) => (
              <Card key={idx} className="p-6 flex-shrink-0 w-[350px] transform hover:scale-105 transition-all duration-300 border-t-4 border-t-green-500 shadow-md">
                <CardContent className="p-0">
                  <p className="text-gray-700 mb-6 italic min-h-[80px]">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center border-t pt-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <span className="text-lg font-semibold">{testimonial.initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer id="kontak" className="bg-white text-gray-900 py-12 border-t animate-fadeIn">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <iframe width="100%" height="400" style={{ border: 0, borderRadius: '8px' }} loading="lazy" allowFullScreen src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.8245678901234!2d114.59!3d-3.33!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2de62e3b3b3b3b3b%3A0x1234567890abcdef!2sDinas%20Perhubungan%20Kota%20Banjarmasin!5e0!3m2!1sid!2sid!4v1234567890"></iframe>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="animate-fadeInUp">
              <h4 className="text-lg font-semibold mb-4">CONTACT</h4>
              <p className="text-gray-600">Telp: 0895-3433-34340<br />Email: transbanjarmasin54@gmail.com</p>
            </div>
            <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <h4 className="text-lg font-semibold mb-4">Dinas Perhubungan Kota Banjarmasin</h4>
              <p className="text-gray-600 mb-6">Jl. Karya Bakti No.54, Kuin Cerucuk, Kec. Banjarmasin Bar., Kota Banjarmasin, Kalimantan Selatan 70128</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.915 9.964 9.964 0 01-2.824.856 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>© 2025 Dishub Kota Banjarmasin. All Rights Reserved.</p>
            <p className="mt-2">Follow Us</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scroll {
          0% { transform: translateX(0); }
          /* Perhitungan: 3 data unik x (350px lebar + 32px gap) = 3 x 382 = 1146px.
            Agar looping mulus, kita geser sejauh total panjang data unik.
          */
          100% { transform: translateX(-1146px); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-in-out; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out; }
        /* Durasi diperlambat sedikit agar lebih enak dilihat */
        .animate-scroll { animation: scroll 40s linear infinite; }
      `}</style>
    </div>
  );
}
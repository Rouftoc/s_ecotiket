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
import PublicNavbar from '@/components/common/PublicNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
  X,
  Quote,
  Newspaper,
  Calendar,
  ArrowRight,
  Wallet,
  Sprout,
  ShieldCheck
} from 'lucide-react';
import { newsAPI } from '@/lib/api/news';
import { NewsItem } from '@/types/dashboard';
import { BOTTLE_RATES } from '@/lib/constants';

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [featuredNews, setFeaturedNews] = useState<NewsItem[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  // const [posters, setPosters] = useState<Poster[]>([]); // Dynamic state removed
  const [slides, setSlides] = useState<any[]>([]); // Initialize slides as a state variable

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [newsData] = await Promise.all([
          newsAPI.getLatestNews()
        ]);

        // Format news for carousel
        const newsSlides = newsData.filter(n => n.is_featured).map(news => ({
          url: news.image ? `http://localhost:5000/uploads/news/${news.image}` : heroImage1,
          title: news.title,
          desc: news.content.substring(0, 100) + '...',
          isNews: true,
          id: news.id_news
        }));

        // Merge static hero images with featured news if available
        if (newsSlides.length > 0) {
          setSlides([...newsSlides, ...heroImages]);
        } else {
          setSlides(heroImages); // Fallback to only hero images if no featured news
        }

        setLatestNews(newsData.slice(0, 3)); // Tampilkan 3 berita terbaru apapun statusnya
      } catch (err) {
        console.error("Failed to load content", err);
      } finally {
        setLoadingNews(false);
      }
    };

    loadContent();
  }, []);

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

  // Use 'slides' instead of 'heroImages' for logic below

  // const posters = []; // Dynamic posters removed as per request
  const posters = [
    { id_poster: 1, image: poster1, link: 'https://instagram.com', title: 'Poster 1' },
    { id_poster: 2, image: poster2, link: 'https://instagram.com', title: 'Poster 2' },
    { id_poster: 3, image: poster3, link: 'https://instagram.com', title: 'Poster 3' },
    { id_poster: 4, image: poster4, link: 'https://instagram.com', title: 'Poster 4' }
  ];

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
    if (slides.length <= 1) return; // Tidak perlu auto-slide kalau cuma 1
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleProfileClick = () => {
    if (user.role === 'admin') navigate('/admin');
    else if (user.role === 'petugas') navigate('/petugas');
    else navigate('/penumpang');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans overflow-x-hidden">

      <PublicNavbar />

      <section id="beranda" className="py-0 bg-white">
        <div className="w-full relative group">
          <div className="relative w-full h-[500px] md:h-[650px] lg:h-[calc(100vh-80px)] overflow-hidden bg-gray-900">
            {slides.map((img, idx) => (
              <div key={idx} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                {/* Improved Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
                <div className="absolute inset-0 container mx-auto px-6 md:px-12 flex flex-col justify-center h-full">
                  <div className="max-w-3xl text-white space-y-6 animate-slideInRight opacity-90">
                    <div className="w-24 h-1.5 bg-green-500 mb-6 rounded-full"></div>
                    {/* Badge for News */}
                    {(img as any).isNews && (
                      <span className="inline-block px-4 py-1.5 bg-green-600/90 backdrop-blur-sm text-white text-xs md:text-sm font-bold tracking-wider uppercase rounded-full mb-2 shadow-lg border border-green-500/30">
                        Featured News
                      </span>
                    )}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight drop-shadow-sm">
                      {img.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl drop-shadow-sm">
                      {img.desc}
                    </p>
                    <div className="pt-6 flex flex-wrap gap-4">
                      {!(img as any).isNews ? (
                        <button onClick={() => navigate('/register')} className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all transform hover:translate-x-1 hover:shadow-lg shadow-green-600/20 text-lg">
                          Mulai Sekarang
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/news/${(img as any).id}`)}
                          className="px-8 py-4 bg-white text-green-900 hover:bg-gray-100 font-bold rounded-lg transition-all transform hover:translate-x-1 shadow-lg text-lg flex items-center gap-2"
                        >
                          Baca Selengkapnya
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Tombol navigasi — hanya tampil kalau slides > 1 */}
            {slides.length > 1 && (
              <div className="hidden md:flex absolute bottom-10 right-10 z-20 gap-4">
                <button onClick={prevSlide} className="w-12 h-12 flex items-center justify-center border border-white/20 text-white bg-black/30 hover:bg-green-600 hover:border-green-600 transition-all duration-300 rounded-full backdrop-blur-md group">
                  <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                </button>
                <button onClick={nextSlide} className="w-12 h-12 flex items-center justify-center border border-white/20 text-white bg-black/30 hover:bg-green-600 hover:border-green-600 transition-all duration-300 rounded-full backdrop-blur-md group">
                  <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Dots — hanya tampil kalau slides > 1 */}
            {slides.length > 1 && (
              <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-20">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2.5 transition-all duration-500 rounded-full shadow-sm ${idx === currentSlide ? 'bg-green-500 w-10' : 'bg-white/40 w-2.5 hover:bg-white/80'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>



      {/* BERITA SECTION */}
      <section id="berita" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12 animate-fadeInUp">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Berita & Pengumuman</h2>
              <p className="text-lg text-gray-600">Informasi terbaru seputar Eco-Tiket dan lingkungan.</p>
            </div>
            {latestNews.length > 0 && (
              <button
                onClick={() => navigate('/berita')}
                className="hidden md:flex items-center text-green-600 font-semibold hover:text-green-700"
              >
                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>

          {!loadingNews && latestNews.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <Newspaper className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Belum ada berita terbaru.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestNews.map((news, idx) => (
              <Card
                key={news.id_news}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fadeInUp group cursor-pointer"
                style={{ animationDelay: `${idx * 0.1}s` }}
                onClick={() => navigate(`/news/${news.id_news}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  {news.image ? (
                    <img
                      src={`http://localhost:5000/uploads/news/${news.image}`}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Newspaper className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      Berita
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(news.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {news.content}
                  </p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <span className="text-green-600 font-semibold text-sm flex items-center group-hover:underline">
                    Baca Selengkapnya <ChevronRight className="h-4 w-4 ml-1" />
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <button
              onClick={() => navigate('/berita')}
              className="inline-flex items-center text-green-600 font-semibold hover:text-green-700"
            >
              Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>





      {/* ADDITIONAL INFO POSTERS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fadeInUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Galeri & Informasi</h2>
            <p className="text-gray-600">Dokumentasi kegiatan dan poster informasi lainnya.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {posters.map((poster, idx) => (
              <div key={poster.id_poster} className="max-w-xs overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 animate-fadeInUp cursor-pointer" style={{ animationDelay: `${idx * 0.15}s` }}>
                <a href={poster.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={poster.image}
                    alt={poster.title || `Poster ${idx + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 bg-gradient-to-b from-white to-green-50/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 mb-16 relative z-10">
          <div className="text-center animate-fadeInUp max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Kata Mereka</h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Dengarkan apa yang warga Banjarmasin katakan tentang perubahan positif ini.
            </p>
          </div>
        </div>

        <div className="relative w-full max-w-6xl mx-auto z-10 overflow-hidden rounded-2xl">
          {/* Gradient Masks for smooth fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-20"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-20"></div>

          <div
            className="flex gap-6 animate-scroll w-max py-8"
          >
            {loopingTestimonials.map((testimonial, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <Card className="relative p-6 flex-shrink-0 w-[300px] md:w-[320px] border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl transform transition-all duration-300 hover:-translate-y-2">
                  <CardContent className="p-0">
                    <Quote className="h-8 w-8 text-green-500/20 mb-3 absolute top-5 right-5" />
                    <div className="flex flex-col h-full justify-between min-h-[140px]">
                      <p className="text-gray-700 text-base leading-relaxed mb-4 italic relative z-10">
                        "{testimonial.quote}"
                      </p>

                      <div className="flex items-center gap-3 mt-auto">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center shadow-inner border-2 border-white">
                          <span className="text-lg font-bold text-green-700">{testimonial.initials}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                          <span className="inline-block px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-medium rounded-full mt-1">
                            {testimonial.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="kontak" className="bg-white text-gray-900 py-12 border-t animate-fadeIn">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <iframe width="100%" height="400" style={{ border: 0, borderRadius: '8px' }} loading="lazy" allowFullScreen src="https://maps.google.com/maps?q=Dinas+Perhubungan+Kota+Banjarmasin&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>
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
                <a href="#" className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-white hover:bg-gray-900 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.915 9.964 9.964 0 01-2.824.856 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-red-600 rounded flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>© 2026 Dishub Kota Banjarmasin. All Rights Reserved.</p>
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
    </div >
  );
}
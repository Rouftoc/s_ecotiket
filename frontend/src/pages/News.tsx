import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, Newspaper, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { newsAPI } from '@/lib/api/news';
import { NewsItem } from '@/types/dashboard';

export default function News() {
    const navigate = useNavigate();
    const [allNews, setAllNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const data = await newsAPI.getAllNews();
                setAllNews(data);
            } catch (err) {
                setError("Gagal memuat berita.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadNews();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-green-600 transition-colors" onClick={() => navigate('/')}>
                        <Home className="h-5 w-5" />
                        <span className="font-semibold">Eco-Tiket</span>
                    </div>
                    <Button onClick={() => navigate('/register')} className="bg-green-600 hover:bg-green-700 text-white font-bold">
                        Daftar Sekarang
                    </Button>
                </div>
            </nav>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="text-sm text-gray-500 mb-6 flex items-center gap-1">
                    <span className="hover:text-green-600 cursor-pointer" onClick={() => navigate('/')}>Beranda</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium text-gray-900">Berita & Pengumuman</span>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Semua Berita</h1>
                        <p className="text-xl text-gray-600">Informasi terbaru seputar Eco-Tiket, kegiatan lingkungan, dan pengumuman layanan.</p>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="bg-white rounded-xl h-96 animate-pulse">
                                    <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                                    <div className="p-6 space-y-4">
                                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-8 rounded-xl text-center">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">Terjadi Kesalahan</h3>
                            <p>{error}</p>
                            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4 border-red-200 hover:bg-red-100 text-red-700">Coba Lagi</Button>
                        </div>
                    ) : allNews.length === 0 ? (
                        <div className="bg-white text-gray-500 p-12 rounded-xl text-center shadow-sm">
                            <Newspaper className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg">Belum ada berita yang diterbitkan saat ini.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {allNews.map((news) => (
                                <Card
                                    key={news.id_news}
                                    className="bg-white overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col h-full"
                                    onClick={() => navigate(`/news/${news.id_news}`)}
                                >
                                    <div className="relative h-48 overflow-hidden shrink-0">
                                        {news.image ? (
                                            <img
                                                src={`http://localhost:5000/uploads/news/${news.image}`}
                                                alt={news.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                <Newspaper className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-green-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                                {news.is_featured ? 'Featured' : 'Berita'}
                                            </span>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 flex-grow">
                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                            <Calendar className="h-4 w-4 mr-2" />
                                            {new Date(news.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                                            {news.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm line-clamp-3">
                                            {news.content}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-6 pt-0 mt-auto">
                                        <span className="text-green-600 font-semibold text-sm flex items-center group-hover:underline">
                                            Baca Selengkapnya <ChevronRight className="h-4 w-4 ml-1" />
                                        </span>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

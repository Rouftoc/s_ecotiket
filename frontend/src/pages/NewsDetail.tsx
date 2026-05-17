
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsAPI } from '@/lib/api/news';
import { NewsItem } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Clock, Newspaper } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import PublicNavbar from '@/components/common/PublicNavbar';

export default function NewsDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [news, setNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await newsAPI.getNewsById(Number(id));
                setNews(data);
            } catch (err) {
                console.error("Failed to fetch news detail", err);
                setError("Gagal memuat berita. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans">
                <PublicNavbar />
                <div className="container mx-auto px-4 py-12 max-w-4xl">
                    <Skeleton className="w-full h-[400px] rounded-xl mb-8" />
                    <Skeleton className="h-10 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-8" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                </div>
            </div>
        );
    }

    if (error || !news) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans">
                <PublicNavbar />
                <div className="container mx-auto px-4 py-20 text-center">
                    <div className="max-w-md mx-auto">
                        <Newspaper className="h-20 w-20 mx-auto text-gray-300 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Berita Tidak Ditemukan</h2>
                        <p className="text-gray-600 mb-6">{error || "Berita yang Anda cari mungkin telah dihapus atau URL salah."}</p>
                        <Button onClick={() => navigate('/berita')} variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Berita
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <PublicNavbar />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Button
                    variant="ghost"
                    className="mb-6 pl-0 hover:bg-transparent hover:text-green-600"
                    onClick={() => navigate('/berita')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Berita
                </Button>

                <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    {news.image && (
                        <div className="w-full h-[300px] md:h-[500px] relative overflow-hidden bg-gray-100">
                            <img
                                src={`http://localhost:5000/uploads/news/${news.image}`}
                                alt={news.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                            <div className="flex items-center text-green-600 font-medium px-3 py-1 bg-green-50 rounded-full">
                                <Newspaper className="h-3.5 w-3.5 mr-2" />
                                Berita
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(news.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric', weekday: 'long'
                                })}
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                {new Date(news.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                            </div>
                            {news.author_name && (
                                <div className="flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    {news.author_name}
                                </div>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                            {news.title}
                        </h1>

                        <div className="prose prose-lg prose-green max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                            {news.content}
                        </div>
                    </div>
                </article>
            </main>

            <footer className="bg-white border-t mt-12 py-8">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© 2026 Dishub Kota Banjarmasin. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}

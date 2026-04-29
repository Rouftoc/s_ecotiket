import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, ArrowRight, Globe, QrCode, CheckCircle, Users, Sprout, ShieldCheck, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Keuntungan() {
    const navigate = useNavigate();

    const benefits = [
        {
            icon: Globe,
            title: 'Dampak Lingkungan Nyata',
            desc: 'Setiap botol yang Anda tukarkan mengurangi limbah plastik yang mencemari sungai dan tanah Banjarmasin. Anda berkontribusi langsung pada kota yang lebih hijau.',
            color: 'bg-emerald-100 text-emerald-600'
        },
        {
            icon: Wallet,
            title: 'Hemat Pengeluaran',
            desc: 'Ubah sampah menjadi alat pembayaran. Anda tidak perlu mengeluarkan uang tunai untuk transportasi sehari-hari menggunakan Bus Trans Banjarmasin.',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: CheckCircle,
            title: 'Transaksi Cepat & Mudah',
            desc: 'Tidak perlu antri beli karcis manual. Cukup scan QR Code Anda di petugas, saldo tiket langsung terpotong. Praktis dan efisien.',
            color: 'bg-purple-100 text-purple-600'
        },
        {
            icon: ShieldCheck,
            title: 'Sistem Transparan',
            desc: 'Riwayat penukaran dan penggunaan tiket tercatat rapi di dashboard Anda. Tidak ada manipulasi, semua data transparan.',
            color: 'bg-orange-100 text-orange-600'
        },
        {
            icon: Users,
            title: 'Komunitas Peduli',
            desc: 'Bergabung dengan ribuan warga Banjarmasin lainnya dalam gerakan ramah lingkungan. Dapatkan update event dan kegiatan sosial.',
            color: 'bg-pink-100 text-pink-600'
        },
        {
            icon: Sprout,
            title: 'Edukasi Lingkungan',
            desc: 'Dapatkan informasi edukatif tentang pengelolaan sampah daur ulang dan gaya hidup berkelanjutan melalui platform kami.',
            color: 'bg-teal-100 text-teal-600'
        }
    ];

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
                    <span className="font-medium text-gray-900">Keuntungan</span>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Mengapa Bergabung?</h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Bergabung dengan Eco-Tiket bukan hanya tentang tiket gratis, tapi tentang menjadi bagian dari solusi untuk masa depan yang lebih baik.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((item, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    <item.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Sticky CTA - Variant */}
                    <div className="mt-20 relative rounded-3xl overflow-hidden bg-gray-900 text-white p-10 md:p-16 text-center">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-24d4c16419d9?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Mulai Perubahan Hari Ini</h2>
                            <p className="text-gray-300 mb-8 text-lg">Jangan biarkan botol plastik Anda berakhir di TPA. Berikan nilai baru bagi mereka dan nikmati manfaatnya.</p>
                            <Button
                                onClick={() => navigate('/register')}
                                size="lg"
                                className="bg-green-500 hover:bg-green-600 text-white font-bold px-10 py-6 text-lg rounded-full shadow-lg"
                            >
                                Saya Mau Gabung! <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

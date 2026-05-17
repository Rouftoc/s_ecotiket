import { useNavigate } from 'react-router-dom';
import { Users, Recycle, Bus, ArrowRight, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoEcoTiket from '@/assets/logo_ecotiket.png';
import PublicNavbar from '@/components/common/PublicNavbar';

export default function CaraKerja() {
    const navigate = useNavigate();

    const steps = [
        {
            icon: Users,
            title: '1. Daftar & Dapatkan QR',
            desc: 'Daftar akun di website Eco-Tiket. Setelah berhasil mendaftar, Anda akan mendapatkan QR Code unik yang berfungsi sebagai identitas Anda dalam ekosistem Eco-Tiket.',
            detail: 'Pastikan data diri Anda sesuai KTP agar memudahkan verifikasi jika dibutuhkan.',
            color: 'bg-blue-100 text-blue-600'
        },
        {
            icon: Recycle,
            title: '2. Kumpulkan Botol',
            desc: 'Kumpulkan botol plastik bekas (Jumbo, Besar, Sedang, Kecil, atau Cup). Pastikan botol dalam keadaan bersih dan tidak remuk.',
            detail: 'Bawa botol ke petugas di terminal atau halte yang berpartisipasi.',
            color: 'bg-green-100 text-green-600'
        },
        {
            icon: Bus,
            title: '3. Tukar Jadi Tiket',
            desc: 'Petugas akan memindai QR Code Anda dan menghitung jumlah botol. Botol akan otomatis dikonversi menjadi saldo tiket.',
            detail: 'Gunakan saldo tiket untuk menaiki Bus Trans Banjarmasin secara gratis!',
            color: 'bg-purple-100 text-purple-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <PublicNavbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Cara Kerja Eco-Tiket</h1>
                        <p className="text-xl text-gray-600">
                            Panduan lengkap langkah demi langkah untuk mendapatkan perjalanan gratis dengan menukar sampah botol plastik.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative">
                                {/* Connector line */}
                                {idx < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-200 z-0 -translate-x-4" />
                                )}
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative z-10">
                                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-5`}>
                                        <step.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm mb-4">{step.desc}</p>
                                    <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 border border-gray-100">
                                        <strong>Tips:</strong> {step.detail}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="bg-green-900 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Siap untuk Memulai?</h2>
                            <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg">
                                Bergabunglah sekarang dan jadilah bagian dari gerakan peduli lingkungan di Banjarmasin.
                            </p>
                            <Button
                                onClick={() => navigate('/register')}
                                size="lg"
                                className="bg-white text-green-900 hover:bg-gray-100 font-bold px-8 py-6 text-lg shadow-lg"
                            >
                                Mengerti? Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <Recycle className="absolute top-10 left-10 w-32 h-32" />
                            <Bus className="absolute bottom-10 right-10 w-40 h-40" />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t mt-12 py-8">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© 2026 Dishub Kota Banjarmasin. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}

import { useNavigate } from 'react-router-dom';
import { Users, Recycle, Bus, ArrowRight, ChevronRight, Home } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function CaraKerja() {
    const navigate = useNavigate();

    const steps = [
        {
            icon: Users,
            title: '1. Daftar & Dapatkan QR',
            desc: 'Daftar akun di website Eco-Tiket. Setelah berhasil mendaftar, Anda akan mendapatkan QR Code unik yang berfungsi sebagai identitas Anda dalam ekosistem Eco-Tiket.',
            delay: '0s',
            detail: 'Pastikan data diri Anda sesuai KTP agar memudahkan verifikasi jika dibutuhkan.'
        },
        {
            icon: Recycle,
            title: '2. Kumpulkan Botol',
            desc: 'Kumpulkan botol plastik bekas (Jumbo, Besar, Sedang, Kecil, atau Cup). Pastikan botol dalam keadaan bersih dan tidak remuk.',
            delay: '0.1s',
            detail: 'Bawa botol ke petugas di terminal atau halte yang berpartisipasi.'
        },
        {
            icon: Bus,
            title: '3. Tukar Jadi Tiket',
            desc: 'Petugas akan memindai QR Code Anda dan menghitung jumlah botol. Botol akan otomatis dikonversi menjadi saldo tiket atau poin.',
            delay: '0.2s',
            detail: 'Gunakan saldo tiket untuk menaiki Bus Trans Banjarmasin secara gratis!'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Simple Navbar for Navigation Pages */}
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
                {/* Breadcrumbs */}
                <div className="text-sm text-gray-500 mb-6 flex items-center gap-1">
                    <span className="hover:text-green-600 cursor-pointer" onClick={() => navigate('/')}>Beranda</span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium text-gray-900">Cara Kerja</span>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Cara Kerja Eco-Tiket</h1>
                        <p className="text-xl text-gray-600">Panduan lengkap langkah demi langkah untuk mendapatkan perjalanan gratis dengan menukar sampah botol plastik.</p>
                    </div>

                    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                {/* Icon */}
                                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-100 group-hover:bg-green-500 transition-colors shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                                    <step.icon className="h-5 w-5 text-green-600 group-hover:text-white" />
                                </div>

                                {/* Card */}
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-md border hover:border-green-300 transition-all duration-300">
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-600 leading-relaxed mb-4">{step.desc}</p>
                                    <div className="bg-green-50 p-3 rounded-lg text-sm text-green-800 border border-green-100">
                                        <strong>Tips:</strong> {step.detail}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sticky CTA */}
                    <div className="mt-20 bg-green-900 rounded-2xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-4">Siap untuk Memulai?</h2>
                            <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg">Bergabunglah sekarang dan jadilah bagian dari gerakan peduli lingkungan di Banjarmasin.</p>
                            <Button
                                onClick={() => navigate('/register')}
                                size="lg"
                                className="bg-white text-green-900 hover:bg-gray-100 font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                Mengerti? Daftar Sekarang <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                        {/* Background decor */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <Recycle className="absolute top-10 left-10 w-32 h-32" />
                            <Bus className="absolute bottom-10 right-10 w-40 h-40" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

import { useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowRight, Recycle, Droplets, Coffee, Package, Box, GlassWater } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BOTTLE_RATES } from '@/lib/constants';
import logoEcoTiket from '@/assets/logo_ecotiket.png';
import PublicNavbar from '@/components/common/PublicNavbar';

const BOTTLE_ICONS: Record<string, React.ElementType> = {
    jumbo: Package,
    besar: Droplets,
    sedang: Recycle,
    kecil: Box,
    cup: Coffee,
};

const BOTTLE_COLORS: Record<string, string> = {
    jumbo: 'bg-purple-50 text-purple-600 border-purple-100',
    besar: 'bg-blue-50 text-blue-600 border-blue-100',
    sedang: 'bg-green-50 text-green-600 border-green-100',
    kecil: 'bg-orange-50 text-orange-600 border-orange-100',
    cup: 'bg-pink-50 text-pink-600 border-pink-100',
};

export default function NilaiTukar() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <PublicNavbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Nilai Tukar Botol</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Kami menerima berbagai jenis kemasan plastik. Semakin banyak Anda menukarkan, semakin banyak tiket gratis yang Anda dapatkan.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {(Object.keys(BOTTLE_RATES) as Array<keyof typeof BOTTLE_RATES>).map((key) => {
                            const rate = BOTTLE_RATES[key];
                            const Icon = BOTTLE_ICONS[key] || GlassWater;
                            const colorClass = BOTTLE_COLORS[key] || 'bg-gray-50 text-gray-600 border-gray-100';

                            return (
                                <Card key={key} className={`hover:shadow-lg transition-all duration-300 overflow-hidden group border ${colorClass.split(' ')[2]}`}>
                                    <div className={`h-32 flex items-center justify-center ${colorClass.split(' ')[0]} group-hover:brightness-95 transition-all`}>
                                        <Icon className={`h-16 w-16 ${colorClass.split(' ')[1]} opacity-80`} strokeWidth={1.5} />
                                    </div>
                                    <CardHeader className="text-center pb-2">
                                        <CardTitle className="text-xl font-bold text-gray-900">{rate.label}</CardTitle>
                                        <CardDescription className="text-gray-500 font-medium">{rate.size}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-center pb-8">
                                        <div className="flex items-center justify-center gap-4 my-4">
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-gray-800">{rate.bottles}</div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">Botol</div>
                                            </div>
                                            <ArrowRight className="h-6 w-6 text-green-400" />
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-green-600">{rate.tickets}</div>
                                                <div className="text-xs text-green-800/60 uppercase tracking-wide font-semibold mt-1">Tiket</div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 px-4">
                                            Kumpulkan {rate.bottles} botol jenis ini untuk mendapatkan {rate.tickets} tiket perjalanan gratis.
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Syarat & Ketentuan */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center mb-12">
                        <div className="bg-blue-100 p-4 rounded-full shrink-0">
                            <Recycle className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-blue-900 mb-2">Syarat & Ketentuan Penukaran</h3>
                            <ul className="list-disc list-inside text-blue-800 space-y-1">
                                <li>Botol harus dalam keadaan bersih dan kosong (tidak ada sisa cairan).</li>
                                <li>Botol tidak boleh remuk atau gepeng agar mudah dihitung petugas.</li>
                                <li>Tutup botol sebaiknya dipisahkan (namun tetap diterima).</li>
                                <li>Label merk boleh dilepas atau tidak.</li>
                            </ul>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-white rounded-2xl p-8 border text-center shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Sudah Punya Botol Bekas?</h2>
                        <p className="text-gray-600 mb-6">Jangan dibuang! Tukarkan sekarang dan nikmati perjalanan hemat.</p>
                        <Button
                            onClick={() => navigate('/register')}
                            size="lg"
                            className="bg-green-600 text-white hover:bg-green-700 font-bold px-8 py-4 shadow-md w-full md:w-auto"
                        >
                            Tukarkan Botol Saya <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
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

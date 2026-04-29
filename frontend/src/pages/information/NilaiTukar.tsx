import { useNavigate } from 'react-router-dom';
import { Home, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BOTTLE_RATES } from '@/lib/constants';

// Manual image import mapping (simulated since we don't have actual bottle photos yet, using placeholders/icons)
import { Cuboid as Bottle, Beer as Bottle2, GlassWater as Cup } from 'lucide-react';

export default function NilaiTukar() {
    const navigate = useNavigate();

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
                    <span className="font-medium text-gray-900">Nilai Tukar</span>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Nilai Tukar Botol</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Kami menerima berbagai jenis kemasan plastik. Semakin banyak Anda menukarkan, semakin banyak tiket gratis yang Anda dapatkan.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {(Object.keys(BOTTLE_RATES) as Array<keyof typeof BOTTLE_RATES>).map((key, idx) => {
                            const rate = BOTTLE_RATES[key];
                            // Assign visual icon based on type
                            let Icon = Bottle;
                            if (key === 'gelas_cup') Icon = Cup;
                            if (key === 'botol_jumbo') Icon = Bottle2;

                            return (
                                <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-green-100 overflow-hidden group">
                                    <div className="h-32 bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                        <Icon className="h-16 w-16 text-green-600/80" strokeWidth={1.5} />
                                    </div>
                                    <CardHeader className="text-center pb-2">
                                        <CardTitle className="text-xl font-bold text-gray-900">{rate.label}</CardTitle>
                                        <CardDescription className="text-green-600 font-medium">{rate.size}</CardDescription>
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

                    {/* Additional Info Box */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="bg-blue-100 p-4 rounded-full shrink-0">
                            <Bottle className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-blue-900 mb-2">Syarat & Ketentuan Penukaran</h3>
                            <ul className="list-disc list-inside text-blue-800 space-y-1">
                                <li>Botol harus dalam keadaan bersih dan kosong (tidak ada sisa cairan).</li>
                                <li>Botol tidak boleh remuk atau gepeng agar mudah dihitung mesin/petugas.</li>
                                <li>Tutup botol sebaiknya dipisahkan (namun tetap diterima).</li>
                                <li>Label merk boleh dilepas atau tidak.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Sticky CTA */}
                    <div className="mt-16 bg-white rounded-2xl p-8 border text-center shadow-lg">
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
        </div>
    );
}

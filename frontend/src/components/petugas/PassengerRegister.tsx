import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UserPlus, CheckCircle, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';
import QRGenerator from '@/components/common/qr/QRGenerator';
import logoEco from '@/assets/logo-eco.png';

interface RegisteredUser {
    name: string;
    nik: string;
    qrCode: string;
    ticketsBalance: number;
}

export default function PassengerRegister() {
    const [formData, setFormData] = useState({ name: '', nik: '', phone: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
    const qrRef = useRef<HTMLDivElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.nik) {
            toast.error('Nama dan NIK wajib diisi');
            return;
        }
        if (!/^\d{16}$/.test(formData.nik)) {
            toast.error('NIK harus 16 digit angka');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.register({ ...formData, role: 'penumpang' });
            setRegisteredUser({
                name: response.user?.name || formData.name,
                nik: formData.nik,
                qrCode: response.user?.qrCode || '',
                ticketsBalance: response.user?.ticketsBalance || 0
            });
            toast.success('Penumpang berhasil didaftarkan');
        } catch (error: any) {
            toast.error(error.message || 'Gagal mendaftarkan penumpang');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadQR = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (!canvas) { toast.error('QR Code tidak ditemukan'); return; }
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `QRCode-${registeredUser?.name?.replace(/\s+/g, '-')}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('QR Code berhasil diunduh');
    };

    const handleReset = () => {
        setRegisteredUser(null);
        setFormData({ name: '', nik: '', phone: '', address: '' });
    };

    // Tampilan sukses
    if (registeredUser) {
        return (
            <div className="space-y-6">
                {/* Header sukses */}
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                    <div>
                        <p className="font-semibold text-green-800">Registrasi Berhasil!</p>
                        <p className="text-sm text-green-600">Akun penumpang telah dibuat. Berikan QR Code ini kepada penumpang.</p>
                    </div>
                </div>

                {/* Info penumpang */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 text-xs">Nama</p>
                        <p className="font-semibold text-gray-900">{registeredUser.name}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 text-xs">NIK</p>
                        <p className="font-semibold text-gray-900 font-mono">{registeredUser.nik}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 text-xs">QR Code</p>
                        <p className="font-semibold text-gray-900 font-mono text-xs truncate">{registeredUser.qrCode}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-500 text-xs">Saldo Tiket</p>
                        <p className="font-semibold text-gray-900">{registeredUser.ticketsBalance} tiket</p>
                    </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center gap-4">
                    <div ref={qrRef}>
                        <QRGenerator value={registeredUser.qrCode} logoSrc={logoEco} size={220} />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                        Minta penumpang menyimpan QR Code ini untuk login dan transaksi
                    </p>
                </div>

                {/* Tombol aksi */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        onClick={handleDownloadQR}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Unduh QR Code
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleReset}
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Daftar Lagi
                    </Button>
                </div>
            </div>
        );
    }

    // Form registrasi
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nama sesuai KTP"
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="nik">NIK (16 digit) *</Label>
                <Input
                    id="nik"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                    placeholder="Nomor Induk Kependudukan"
                    maxLength={16}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="08xxxxxxxxxx"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Alamat Lengkap"
                />
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mendaftarkan...</>
                ) : (
                    <><UserPlus className="mr-2 h-4 w-4" />Daftar Penumpang</>
                )}
            </Button>
        </form>
    );
}

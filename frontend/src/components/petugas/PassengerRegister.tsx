import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authAPI } from '@/lib/api';

export default function PassengerRegister() {
    const [formData, setFormData] = useState({
        name: '',
        nik: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.name || !formData.nik) {
                toast.error('Nama dan NIK wajib diisi');
                return;
            }

            if (!/^\d{16}$/.test(formData.nik)) {
                toast.error('NIK harus 16 digit angka');
                return;
            }

            await authAPI.register({
                ...formData,
                role: 'penumpang'
            });

            toast.success('Penumpang berhasil didaftarkan');
            setFormData({
                name: '',
                nik: '',
                phone: '',
                address: ''
            });
        } catch (error: any) {
            toast.error(error.message || 'Gagal mendaftarkan penumpang');
        } finally {
            setLoading(false);
        }
    };

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
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Mendaftarkan...
                    </>
                ) : (
                    <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Daftar Penumpang
                    </>
                )}
            </Button>
        </form>
    );
}

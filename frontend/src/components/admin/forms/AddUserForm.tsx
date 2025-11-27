import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface AddUserFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
}

export function AddUserForm({ onSubmit, onCancel }: AddUserFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        role: 'penumpang' as 'penumpang' | 'petugas',
        email: '',
        nik: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateForm = () => {
        const { name, role, email, nik, password, confirmPassword } = formData;
        if (!name || !password || !confirmPassword) {
            setError('Nama, Password, dan Konfirmasi Password harus diisi.');
            return false;
        }
        if (role === 'petugas' && !email) {
            setError('Email harus diisi untuk petugas.');
            return false;
        }
        if (role === 'penumpang' && !nik) {
            setError('NIK harus diisi untuk penumpang.');
            return false;
        }
        if (role === 'penumpang' && !/^\d{16}$/.test(nik)) {
            setError('NIK harus terdiri dari 16 digit angka.');
            return false;
        }
        if (password.length < 6) {
            setError('Password minimal 6 karakter.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Konfirmasi password tidak cocok.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        const userData = {
            name: formData.name,
            role: formData.role,
            password: formData.password,
            phone: formData.phone || undefined,
            address: formData.address || undefined,
            ...(formData.role === 'penumpang' ? { nik: formData.nik } : { email: formData.email })
        };

        await onSubmit(userData);
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value: 'penumpang' | 'petugas') => {
                        setFormData(prev => ({ ...prev, role: value, email: '', nik: '' }));
                    }}>
                        <SelectTrigger id="role"><SelectValue placeholder="Pilih Role" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="penumpang">Penumpang</SelectItem>
                            <SelectItem value="petugas">Petugas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {formData.role === 'penumpang' ? (
                <div className="space-y-2">
                    <Label htmlFor="nik">NIK (16 digit)</Label>
                    <Input id="nik" value={formData.nik} onChange={(e) => handleInputChange('nik', e.target.value.replace(/\D/g, ''))} maxLength={16} required placeholder="Contoh: 6371..." />
                </div>
            ) : (
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required placeholder="Contoh: petugas@ecotiket.com" />
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} required placeholder="Minimal 6 karakter" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} required placeholder="Ulangi password" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon (Opsional)</Label>
                    <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="Contoh: 0812..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">Alamat (Opsional)</Label>
                    <Input id="address" value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="Contoh: Jl. Ahmad Yani" />
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Batal</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menambahkan...</> : 'Tambah Pengguna'}
                </Button>
            </div>
        </form>
    );
}
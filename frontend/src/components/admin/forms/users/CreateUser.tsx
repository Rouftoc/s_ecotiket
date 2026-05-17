import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

export interface CreateUserData {
    name: string;
    role: 'penumpang' | 'petugas';
    email?: string;
    nik?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    address?: string;
}

interface CreateUserProps {
    onSubmit: (data: CreateUserData) => Promise<void>;
    onCancel: () => void;
    isSaving?: boolean;
}

export function CreateUser({ onSubmit, onCancel, isSaving = false }: CreateUserProps) {
    const [formData, setFormData] = useState<CreateUserData>({
        name: '', role: 'penumpang', email: '', nik: '',
        password: '', confirmPassword: '', phone: '', address: ''
    });
    const [error, setError] = useState('');

    const set = (field: keyof CreateUserData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validate = () => {
        const { name, role, email, nik, password, confirmPassword } = formData;
        if (!name) { setError('Nama harus diisi.'); return false; }
        if (role === 'petugas') {
            if (!email) { setError('Email harus diisi untuk petugas.'); return false; }
            if (!password || !confirmPassword) { setError('Password wajib diisi.'); return false; }
            if (password.length < 6) { setError('Password minimal 6 karakter.'); return false; }
            if (password !== confirmPassword) { setError('Konfirmasi password tidak cocok.'); return false; }
        }
        if (role === 'penumpang') {
            if (!nik) { setError('NIK harus diisi.'); return false; }
            if (!/^\d{16}$/.test(nik)) { setError('NIK harus 16 digit angka.'); return false; }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <Input value={formData.name} onChange={e => set('name', e.target.value)} placeholder="Nama lengkap" required />
                </div>
                <div className="space-y-2">
                    <Label>Role</Label>
                    <Select value={formData.role} onValueChange={(v: 'penumpang' | 'petugas') =>
                        setFormData(prev => ({ ...prev, role: v, email: '', nik: '' }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="penumpang">Penumpang</SelectItem>
                            <SelectItem value="petugas">Petugas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {formData.role === 'penumpang' ? (
                <div className="space-y-2">
                    <Label>NIK (16 digit)</Label>
                    <Input value={formData.nik} onChange={e => set('nik', e.target.value.replace(/\D/g, ''))} maxLength={16} placeholder="6371..." />
                </div>
            ) : (
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={e => set('email', e.target.value)} placeholder="petugas@ecotiket.com" />
                </div>
            )}

            {formData.role === 'petugas' && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Password</Label>
                        <Input type="password" value={formData.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 karakter" />
                    </div>
                    <div className="space-y-2">
                        <Label>Konfirmasi Password</Label>
                        <Input type="password" value={formData.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Ulangi password" />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>No. Telepon (Opsional)</Label>
                    <Input value={formData.phone} onChange={e => set('phone', e.target.value)} placeholder="0812..." />
                </div>
                <div className="space-y-2">
                    <Label>Alamat (Opsional)</Label>
                    <Input value={formData.address} onChange={e => set('address', e.target.value)} placeholder="Jl. Ahmad Yani..." />
                </div>
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>Batal</Button>
                <Button type="submit" disabled={isSaving} className="bg-black hover:bg-gray-800">
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menambahkan...</> : 'Tambah Pengguna'}
                </Button>
            </DialogFooter>
        </form>
    );
}

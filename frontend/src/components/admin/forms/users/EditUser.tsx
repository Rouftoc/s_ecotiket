import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { UserRecord } from '@/types/dashboard';

export interface EditUserData {
    name: string;
    email?: string;
    nik?: string;
    phone: string;
    address: string;
    status: 'active' | 'inactive' | 'suspended';
    ticketsBalance?: number;
    points?: number;
}

interface EditUserProps {
    userData: UserRecord;
    isSaving: boolean;
    onSave: (data: EditUserData) => void;
    onCancel: () => void;
}

export function EditUser({ userData, isSaving, onSave, onCancel }: EditUserProps) {
    const [formData, setFormData] = useState<EditUserData>({
        name: '', email: '', nik: '', phone: '', address: '',
        status: 'active', ticketsBalance: 0, points: 0
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name,
                email: userData.email || '',
                nik: userData.nik || '',
                phone: userData.phone || '',
                address: userData.address || '',
                status: (userData.status as 'active' | 'inactive' | 'suspended') || 'active',
                ticketsBalance: userData.ticketsBalance || 0,
                points: userData.points || 0
            });
        }
    }, [userData]);

    const set = (field: keyof EditUserData, value: any) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    return (
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Nama Lengkap</Label>
                    <Input value={formData.name} onChange={e => set('name', e.target.value)} />
                </div>
                {userData.role === 'penumpang' ? (
                    <div className="space-y-2">
                        <Label>NIK</Label>
                        <Input value={formData.nik} disabled className="bg-gray-100 cursor-not-allowed" />
                        <p className="text-[10px] text-muted-foreground">NIK tidak dapat diubah</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={formData.email} disabled className="bg-gray-100 cursor-not-allowed" />
                        <p className="text-[10px] text-muted-foreground">Email tidak dapat diubah</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>No. Telepon</Label>
                    <Input value={formData.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Status Akun</Label>
                    <Select value={formData.status} onValueChange={(v: 'active' | 'inactive' | 'suspended') => set('status', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Tidak Aktif</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Alamat</Label>
                <Input value={formData.address} onChange={e => set('address', e.target.value)} />
            </div>

            {userData.role === 'penumpang' && (
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-2">
                        <Label>Saldo Tiket</Label>
                        <Input type="number" value={formData.ticketsBalance} onChange={e => set('ticketsBalance', parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Poin Reward</Label>
                        <Input type="number" value={formData.points} onChange={e => set('points', parseInt(e.target.value) || 0)} />
                    </div>
                </div>
            )}

            <DialogFooter>
                <Button variant="outline" onClick={onCancel} disabled={isSaving}>Batal</Button>
                <Button onClick={() => onSave(formData)} disabled={isSaving} className="bg-black hover:bg-gray-800">
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : 'Simpan Perubahan'}
                </Button>
            </DialogFooter>
        </div>
    );
}

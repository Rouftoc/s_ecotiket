
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { UserRecord } from '@/types/dashboard';

export interface EditUserFormData {
    name: string;
    email?: string;
    nik?: string;
    phone: string;
    address: string;
    status: 'active' | 'inactive' | 'suspended';
    ticketsBalance?: number;
    points?: number;
}

interface EditUserFormProps {
    userData: UserRecord;
    isSaving: boolean;
    onSave: (data: EditUserFormData) => void;
    onCancel: () => void;
}

export function EditUserForm({
    userData,
    isSaving,
    onSave,
    onCancel
}: EditUserFormProps) {
    const [formData, setFormData] = useState<EditUserFormData>({
        name: '',
        email: '',
        nik: '',
        phone: '',
        address: '',
        status: 'active',
        ticketsBalance: 0,
        points: 0
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

    const handleChange = (field: keyof EditUserFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Nama lengkap"
                    />
                </div>
                {userData.role === 'penumpang' ? (
                    <div className="space-y-2">
                        <Label htmlFor="nik">NIK</Label>
                        <Input
                            id="nik"
                            value={formData.nik}
                            disabled={true}
                            className="bg-gray-100 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-muted-foreground">NIK tidak dapat diubah</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            disabled={true} // Usually email is identity, keep disabled for simplicity unless creating
                            className="bg-gray-100 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-muted-foreground">Email tidak dapat diubah</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status Akun</Label>
                    <Select
                        value={formData.status}
                        onValueChange={(value: 'active' | 'inactive' | 'suspended') => handleChange('status', value)}
                    >
                        <SelectTrigger id="status"><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                />
            </div>

            {userData.role === 'penumpang' && (
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="tickets">Saldo Tiket</Label>
                        <Input
                            id="tickets"
                            type="number"
                            value={formData.ticketsBalance}
                            onChange={(e) => handleChange('ticketsBalance', parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="points">Poin Reward</Label>
                        <Input
                            id="points"
                            type="number"
                            value={formData.points}
                            onChange={(e) => handleChange('points', parseInt(e.target.value) || 0)}
                        />
                    </div>
                </div>
            )}

            <DialogFooter className="mt-6">
                <Button variant="outline" onClick={onCancel} disabled={isSaving}>
                    Batal
                </Button>
                <Button onClick={handleSubmit} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        'Simpan Perubahan'
                    )}
                </Button>
            </DialogFooter>
        </div>
    );
}

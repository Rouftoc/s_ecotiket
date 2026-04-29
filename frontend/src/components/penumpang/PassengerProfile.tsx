import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Edit, Save, X, Phone, MapPin, CreditCard } from 'lucide-react';
import { usersAPI } from '@/lib/api';
import { toast } from 'sonner';

interface UserData {
    id_user: number;
    name: string;
    email?: string;
    nik?: string;
    phone?: string;
    address?: string;
    role: string;
    status: string;
    ticketsBalance: number;
    points: number;
    qrCode: string;
}

interface PassengerProfileProps {
    user: UserData;
    setUser: (user: UserData) => void;
    updateLocalStorage: (user: UserData) => void;
}

export default function PassengerProfile({ user, setUser, updateLocalStorage }: PassengerProfileProps) {
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
    });

    const handleEditProfile = async () => {
        try {
            const response = await usersAPI.updateProfile(editData);
            if (!response.user) throw new Error('Invalid response');

            const updatedUser = { ...user, ...response.user };
            setUser(updatedUser);
            updateLocalStorage(updatedUser);
            setEditMode(false);
            toast.success('Profil berhasil diperbarui');
        } catch (error: any) {
            toast.error('Gagal memperbarui profil: ' + error.message);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profil Saya
                    </div>
                    {!editMode && (
                        <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profil
                        </Button>
                    )}
                </CardTitle>
                <CardDescription>
                    Informasi akun dan data pribadi Anda
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {editMode ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={editData.name}
                                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Masukkan nama lengkap"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <Input
                                id="phone"
                                value={editData.phone}
                                onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="Masukkan nomor telepon"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Alamat</Label>
                            <Textarea
                                id="address"
                                value={editData.address}
                                onChange={(e) => setEditData(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="Masukkan alamat lengkap"
                                rows={3}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleEditProfile}>
                                <Save className="h-4 w-4 mr-2" />
                                Simpan
                            </Button>
                            <Button variant="outline" onClick={() => setEditMode(false)}>
                                <X className="h-4 w-4 mr-2" />
                                Batal
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Nama Lengkap</Label>
                                <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    NIK
                                </Label>
                                <p className="mt-1 text-sm text-gray-900 font-mono">{user.nik}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Nomor Telepon
                                </Label>
                                <p className="mt-1 text-sm text-gray-900">{user.phone || 'Belum diisi'}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">QR Code</Label>
                                <p className="mt-1 text-sm text-gray-900 font-mono">{user.qrCode}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Status Akun</Label>
                                <div className="mt-1">
                                    <Badge className="bg-green-100 text-green-800">
                                        {user.status === 'active' ? 'Aktif' : user.status}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Saldo Tiket</Label>
                                <p className="mt-1 text-sm text-gray-900">{user.ticketsBalance} tiket</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Total Poin</Label>
                                <p className="mt-1 text-sm text-gray-900">{user.points} poin</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Alamat
                                </Label>
                                <p className="mt-1 text-sm text-gray-900">{user.address || 'Belum diisi'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Edit, Save, X, Phone, MapPin, Mail, Shield } from 'lucide-react';
import { usersAPI } from '@/lib/api';
import { toast } from 'sonner';

interface PetugasData {
    id_user: number;
    name: string;
    email: string;
    role: string;
    phone?: string;
    address?: string;
    status?: string;
}

interface PetugasProfileProps {
    user: PetugasData;
    setUser: (user: PetugasData) => void;
    updateLocalStorage: (user: PetugasData) => void;
}

export default function PetugasProfile({ user, setUser, updateLocalStorage }: PetugasProfileProps) {
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
    });

    const handleEditProfile = async () => {
        try {
            const response = await usersAPI.updateProfile(editData);
            // Handle different response structures if necessary, assuming consistent with Passenger
            const updatedData = response.user || response; // Fallback if structure varies

            const updatedUser = { ...user, ...updatedData };
            setUser(updatedUser);
            updateLocalStorage(updatedUser);
            setEditMode(false);
            toast.success('Profil berhasil diperbarui');
        } catch (error: any) {
            toast.error('Gagal memperbarui profil: ' + (error.message || 'Error tidak diketahui'));
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profil Petugas
                    </div>
                    {!editMode && (
                        <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profil
                        </Button>
                    )}
                </CardTitle>
                <CardDescription>
                    Kelola informasi akun dan data pribadi Anda
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
                                <p className="mt-1 text-sm text-gray-900 font-medium">{user.name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </Label>
                                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Role
                                </Label>
                                <div className="mt-1">
                                    <Badge variant="secondary" className="capitalize">
                                        {user.role}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    Nomor Telepon
                                </Label>
                                <p className="mt-1 text-sm text-gray-900">{user.phone || '-'}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Alamat
                                </Label>
                                <p className="mt-1 text-sm text-gray-900">{user.address || '-'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

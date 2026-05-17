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
import { CurrentUser } from '@/types/dashboard';
import ChangePasswordForm from '@/components/common/ChangePasswordForm';

interface AdminProfileProps {
    user: CurrentUser;
    setUser: (user: CurrentUser) => void;
    updateLocalStorage: (user: CurrentUser) => void;
}

export default function AdminProfile({ user, setUser, updateLocalStorage }: AdminProfileProps) {
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
    });

    const handleEditProfile = async () => {
        try {
            const response = await usersAPI.updateProfile({ // Checking api/index.ts for correct export
                name: editData.name,
                phone: editData.phone,
                address: editData.address
            });

            // Handle response
            const updatedData = response.user || response;

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
        <div className="space-y-6">
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profil Admin
                    </div>
                    {!editMode && (
                        <Button variant="outline" size="sm" onClick={() => {
                            setEditData({
                                name: user.name || '',
                                phone: user.phone || '',
                                address: user.address || ''
                            });
                            setEditMode(true);
                        }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profil
                        </Button>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {editMode ? (
                    <div className="space-y-4 max-w-lg">
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
                        <div className="flex gap-2 pt-2">
                            <Button onClick={handleEditProfile} className="bg-black hover:bg-gray-800">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Informasi Utama</Label>
                                <div className="space-y-4 mt-3">
                                    <div>
                                        <p className="text-sm text-gray-500">Nama Lengkap</p>
                                        <p className="text-base font-medium text-gray-900">{user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <Mail className="h-3 w-3" /> Email
                                        </p>
                                        <p className="text-base text-gray-900">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <Shield className="h-3 w-3" /> Peran
                                        </p>
                                        <div className="mt-1">
                                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">
                                                {user.role}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Kontak & Alamat</Label>
                                <div className="space-y-4 mt-3">
                                    <div>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <Phone className="h-3 w-3" /> Nomor Telepon
                                        </p>
                                        <p className="text-base text-gray-900">{user.phone || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <MapPin className="h-3 w-3" /> Alamat
                                        </p>
                                        <p className="text-base text-gray-900 whitespace-pre-line">{user.address || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
            <ChangePasswordForm />
        </div>
    );
}

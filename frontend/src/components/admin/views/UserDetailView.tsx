import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit, Save, Trash2, User, CreditCard, Mail, Phone, QrCode } from 'lucide-react';
import QRGenerator from '@/components/QRGenerator';
import ecotiketLogo from '@/assets/logo-eco.png';
import { UserTransactionHistory } from '../shared/UserTransactionHistory';
import { UserRecord, Transaction } from '@/types/dashboard';
import { transactionsAPI } from '@/lib/api';
import { toast } from 'sonner';

interface UserDetailViewProps {
    user: UserRecord;
    transactions: Transaction[];
    isTransactionsLoading: boolean;
    onBack: () => void;
    onDelete: (id: number) => void;
    onUpdate: (id: number, data: Partial<UserRecord>) => Promise<void>;
    currentUserRole?: string;
    onTransactionDeleted?: () => void;
}

export function UserDetailView({
    user: initialUser,
    transactions,
    isTransactionsLoading,
    onBack,
    onDelete,
    onUpdate,
    currentUserRole,
    onTransactionDeleted
}: UserDetailViewProps) {
    const [user, setUser] = useState(initialUser);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = async () => {
        await onUpdate(user.id, user);
        setIsEditing(false);
    };

    const handleDeleteTransaction = async (transactionId: number) => {
        try {
            await transactionsAPI.deleteTransaction(transactionId);
            toast.success('Transaksi berhasil dihapus');
            if (onTransactionDeleted) {
                onTransactionDeleted();
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch { return 'Invalid Date'; }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'petugas': return 'bg-blue-100 text-blue-800';
            case 'penumpang': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-yellow-100 text-yellow-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b p-4">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Kembali ke Manajemen Pengguna
                    </Button>
                    <div className="flex items-center space-x-2">
                        <Button variant={isEditing ? "default" : "outline"} size="sm" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? <><User className="h-4 w-4 mr-2" />Mode Lihat</> : <><Edit className="h-4 w-4 mr-2" />Edit Profil</>}
                        </Button>
                        {isEditing && (
                            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                                <Save className="h-4 w-4 mr-2" />Simpan
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-semibold">{user.name?.charAt(0) || '?'}</span>
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl">{user.name || 'Unknown User'}</CardTitle>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                                                <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {user.role === 'penumpang' ? (
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4" />NIK
                                                </Label>
                                                {isEditing ? (
                                                    <Input value={user.nik || ''} onChange={(e) => setUser({ ...user, nik: e.target.value })} className="mt-1" maxLength={16} />
                                                ) : (
                                                    <p className="text-sm font-mono">{user.nik || '-'}</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />Email
                                                </Label>
                                                {isEditing ? (
                                                    <Input value={user.email || ''} onChange={(e) => setUser({ ...user, email: e.target.value })} className="mt-1" />
                                                ) : (
                                                    <p className="text-sm">{user.email || '-'}</p>
                                                )}
                                            </div>
                                        )}
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                                                <Phone className="h-4 w-4" />No. Telepon
                                            </Label>
                                            {isEditing ? (
                                                <Input value={user.phone || ''} onChange={(e) => setUser({ ...user, phone: e.target.value })} placeholder="0812-xxxx-xxxx" className="mt-1" />
                                            ) : (
                                                <p className="text-sm">{user.phone || '-'}</p>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label className="text-sm font-medium text-gray-500">Alamat</Label>
                                            {isEditing ? (
                                                <Input value={user.address || ''} onChange={(e) => setUser({ ...user, address: e.target.value })} placeholder="Masukkan alamat lengkap" className="mt-1" />
                                            ) : (
                                                <p className="text-sm">{user.address || '-'}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Status</Label>
                                            {isEditing ? (
                                                <Select value={user.status} onValueChange={(value) => setUser({ ...user, status: value })}>
                                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                        <SelectItem value="suspended">Suspended</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <p className="text-sm capitalize">{user.status}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Tanggal Bergabung</Label>
                                            <p className="text-sm">{formatDate(user.created_at)}</p>
                                        </div>
                                    </div>
                                    {isEditing && user.role === 'penumpang' && (
                                        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Saldo Tiket</Label>
                                                <Input type="number" value={user.ticketsBalance} onChange={(e) => setUser({ ...user, ticketsBalance: parseInt(e.target.value) || 0 })} className="mt-1" />
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Total Poin</Label>
                                                <Input type="number" value={user.points} onChange={(e) => setUser({ ...user, points: parseInt(e.target.value) || 0 })} className="mt-1" />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {user.role === 'penumpang' && (
                                <Card>
                                    <CardHeader><CardTitle>Statistik</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="text-center p-6 bg-green-50 rounded-lg">
                                                <div className="text-3xl font-bold text-green-600">{user.ticketsBalance}</div>
                                                <div className="text-sm text-gray-600 mt-1">Saldo Tiket</div>
                                            </div>
                                            <div className="text-center p-6 bg-blue-50 rounded-lg">
                                                <div className="text-3xl font-bold text-blue-600">{user.points}</div>
                                                <div className="text-sm text-gray-600 mt-1">Total Poin</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center"><QrCode className="h-5 w-5 mr-2" />QR Code</CardTitle>
                                    <CardDescription>QR Code unik untuk {user.role}</CardDescription>
                                </CardHeader>
                                <CardContent className="text-center space-y-4">
                                    {user.qrCode && <QRGenerator value={user.qrCode} logoSrc={ecotiketLogo} />}
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-xs font-mono text-gray-700 break-all">{user.qrCode}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {user.role !== 'penumpang' && (
                                <Card>
                                    <CardHeader><CardTitle>Status</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="text-center p-6 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600 capitalize">{user.status}</div>
                                            <div className="text-sm text-gray-600 mt-1">Status {user.role}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            <Card>
                                <CardHeader><CardTitle>Aksi</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => onDelete(user.id)}>
                                        <Trash2 className="h-4 w-4 mr-2" />Hapus Pengguna
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Card>
                            <CardContent className="p-6">
                                <UserTransactionHistory
                                    transactions={transactions}
                                    isLoading={isTransactionsLoading}
                                    role={user.role}
                                    currentUserRole={currentUserRole}
                                    onDeleteTransaction={currentUserRole === 'admin' ? handleDeleteTransaction : undefined}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, Trash2, Mail, Phone, QrCode } from 'lucide-react';
import QRGenerator from '@/components/QRGenerator';
import ecotiketLogo from '@/assets/logo-eco.png';
import { UserTransactionHistory } from '../shared/UserTransactionHistory';
import { PetugasDetail, Transaction } from '@/types/dashboard';

interface PetugasDetailViewProps {
    petugas: PetugasDetail;
    transactions: Transaction[];
    isTransactionsLoading: boolean;
    onBack: () => void;
    onEdit: (petugas: PetugasDetail) => void;
    onDelete: (id: number) => void;
}

export function PetugasDetailView({
    petugas,
    transactions,
    isTransactionsLoading,
    onBack,
    onEdit,
    onDelete
}: PetugasDetailViewProps) {

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch { return '-'; }
    };

    const formatDateTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('id-ID', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch { return '-'; }
    };

    const getRoleColor = (role: string) => role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
    const getStatusColor = (status: string) => status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b p-4 sticky top-0 z-10">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <Button variant="ghost" size="sm" onClick={onBack}>
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Kembali ke Manajemen Petugas
                    </Button>
                </div>
            </div>
            <div className="p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-semibold text-blue-800">{petugas.name?.charAt(0) || '?'}</span>
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl">{petugas.name}</CardTitle>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Badge className={getRoleColor(petugas.role)}>{petugas.role}</Badge>
                                                <Badge className={getStatusColor(petugas.status)}>{petugas.status}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 grid md:grid-cols-2 gap-x-4 gap-y-6">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-2"><Mail className="h-4 w-4" />Email</Label>
                                        <p className="text-sm pt-1">{petugas.email || '-'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500 flex items-center gap-2"><Phone className="h-4 w-4" />No. Telepon</Label>
                                        <p className="text-sm pt-1">{petugas.phone || '-'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label className="text-sm font-medium text-gray-500">Alamat</Label>
                                        <p className="text-sm pt-1">{petugas.address || '-'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Tanggal Bergabung</Label>
                                        <p className="text-sm pt-1">{formatDate(petugas.created_at)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Aktivitas Terakhir</Label>
                                        <p className="text-sm pt-1">{petugas.last_activity ? formatDateTime(petugas.last_activity) : 'Belum ada aktivitas'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Statistik Petugas</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <div className="text-3xl font-bold text-blue-600">{petugas.total_transactions || 0}</div>
                                        <div className="text-sm text-gray-600 mt-1">Total Transaksi Diverifikasi</div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle className="flex items-center"><QrCode className="h-5 w-5 mr-2" />QR Code Petugas</CardTitle></CardHeader>
                                <CardContent className="text-center space-y-4">
                                    {petugas.qrCode ? (
                                        <>
                                            <QRGenerator value={petugas.qrCode} logoSrc={ecotiketLogo} />
                                            <div className="p-3 bg-gray-100 rounded-lg">
                                                <p className="text-sm font-mono text-gray-700 break-all">{petugas.qrCode}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-500 py-4">QR Code tidak tersedia.</p>
                                    )}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Aksi</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    <Button variant="outline" className="w-full" onClick={() => onEdit(petugas)}>
                                        <Edit className="h-4 w-4 mr-2" />Edit Petugas
                                    </Button>
                                    <Button variant="destructive" className="w-full" onClick={() => onDelete(petugas.id)}>
                                        <Trash2 className="h-4 w-4 mr-2" />Hapus Petugas
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Transaksi Petugas</CardTitle>
                            <CardDescription>Menampilkan semua transaksi yang telah diverifikasi oleh petugas ini.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserTransactionHistory
                                transactions={transactions}
                                isLoading={isTransactionsLoading}
                                role={petugas.role}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
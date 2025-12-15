import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History, Recycle, Bus, Trash2 } from 'lucide-react';
import { Transaction } from '@/types/dashboard';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface UserTransactionHistoryProps {
    transactions: Transaction[];
    isLoading: boolean;
    role: string;
    currentUserRole?: string;
    onDeleteTransaction?: (id: number) => Promise<void>;
}

export function UserTransactionHistory({ 
    transactions, 
    isLoading, 
    role, 
    currentUserRole,
    onDeleteTransaction 
}: UserTransactionHistoryProps) {
    const [deletingTransactionId, setDeletingTransactionId] = useState<number | null>(null);

    const formatDateTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('id-ID', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch { return 'Invalid Date'; }
    };

    const handleDeleteClick = (transaction: Transaction) => {
        if (!onDeleteTransaction) return;

        Swal.fire({
            title: "Hapus Transaksi?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setDeletingTransactionId(transaction.id);
                    await onDeleteTransaction(transaction.id);
                    
                } catch (error) {
                    console.error(error);
                    Swal.fire({
                        title: "Gagal",
                        text: "Terjadi kesalahan saat menghapus data.",
                        icon: "error"
                    });
                } finally {
                    setDeletingTransactionId(null);
                }
            }
        });
    };

    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Riwayat Transaksi
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead>Perubahan Tiket</TableHead>
                                <TableHead>{role === 'petugas' ? 'Penumpang' : 'Petugas'}</TableHead>
                                {currentUserRole === 'admin' && onDeleteTransaction && (
                                    <TableHead className="text-center">Aksi</TableHead>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={currentUserRole === 'admin' ? 6 : 5} className="text-center py-8">
                                        Memuat riwayat transaksi...
                                    </TableCell>
                                </TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={currentUserRole === 'admin' ? 6 : 5} className="text-center py-8">
                                        Tidak ada riwayat transaksi.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="text-sm text-gray-600">
                                            {formatDateTime(tx.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={tx.type === 'bottle_exchange' ? 'default' : 'secondary'} className="flex items-center gap-1 w-fit">
                                                {tx.type === 'bottle_exchange' ? <Recycle className="h-3 w-3" /> : <Bus className="h-3 w-3" />}
                                                {tx.type === 'bottle_exchange' ? 'Tukar Botol' : 'Guna Tiket'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">{tx.description}</TableCell>
                                        <TableCell className={`font-medium ${tx.tickets_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.tickets_change > 0 ? `+${tx.tickets_change}` : tx.tickets_change}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {role === 'petugas' ? tx.user_name : tx.petugas_name}
                                        </TableCell>
                                        {currentUserRole === 'admin' && onDeleteTransaction && (
                                            <TableCell className="text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(tx)}
                                                    disabled={deletingTransactionId === tx.id}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    {deletingTransactionId === tx.id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
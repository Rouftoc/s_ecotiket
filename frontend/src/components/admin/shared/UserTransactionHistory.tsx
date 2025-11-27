import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Recycle, Bus } from 'lucide-react';
import { Transaction } from '@/types/dashboard';

interface UserTransactionHistoryProps {
    transactions: Transaction[];
    isLoading: boolean;
    role: string;
}

export function UserTransactionHistory({ transactions, isLoading, role }: UserTransactionHistoryProps) {
    const formatDateTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('id-ID', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch { return 'Invalid Date'; }
    };

    return (
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Riwayat Transaksi</CardTitle>
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow><TableCell colSpan={5} className="text-center py-8">Memuat riwayat transaksi...</TableCell></TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center py-8">Tidak ada riwayat transaksi.</TableCell></TableRow>
                            ) : (
                                transactions.map((tx) => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="text-sm text-gray-600">{formatDateTime(tx.created_at)}</TableCell>
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
                                        <TableCell className="text-sm">{role === 'petugas' ? tx.user_name : tx.petugas_name}</TableCell>
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
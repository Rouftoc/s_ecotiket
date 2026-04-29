import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Recycle, Bus } from 'lucide-react';

interface Transaction {
    id_transaction: number;
    qrCode: string;
    type: 'stand' | 'karnet';
    bottles?: {
        jumbo: number;
        besar: number;
        sedang: number;
        kecil: number;
        cup: number;
    };
    tickets: number;
    timestamp: string;
    location: string;
}

interface PetugasHistoryProps {
    transactions: Transaction[];
}

export default function PetugasHistory({ transactions }: PetugasHistoryProps) {
    return (
        <Card>
            <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Riwayat Hari Ini
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    {transactions.length} transaksi
                </CardDescription>
            </CardHeader>
            <CardContent>
                {transactions.length > 0 ? (
                    <div className="space-y-2 sm:space-y-4">
                        {transactions.map((transaction) => (
                            <div key={transaction.id_transaction} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-4 border rounded-lg gap-2">
                                <div className="flex items-start space-x-3 flex-1">
                                    <div className={`p-2 rounded-full flex-shrink-0 ${transaction.type === 'stand'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {transaction.type === 'stand' ? <Recycle className="h-4 w-4" /> : <Bus className="h-4 w-4" />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm">
                                            {transaction.type === 'stand' ? 'Tukar Botol' : 'Validasi Tiket'}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-600 break-all">
                                            {transaction.qrCode}
                                        </p>
                                        <p className="text-xs text-gray-500">{transaction.location}</p>
                                        <p className="text-xs text-gray-500">{transaction.timestamp}</p>
                                        {transaction.bottles && (
                                            <p className="text-xs text-gray-500">
                                                Botol: {transaction.bottles.jumbo + transaction.bottles.besar + transaction.bottles.sedang + transaction.bottles.kecil + transaction.bottles.cup}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Badge variant={transaction.type === 'stand' ? 'default' : 'secondary'} className="text-xs sm:text-sm w-fit">
                                    {transaction.tickets > 0 ? '+' : ''}{transaction.tickets}
                                </Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">Belum ada transaksi hari ini</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

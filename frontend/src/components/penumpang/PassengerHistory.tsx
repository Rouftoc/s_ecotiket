import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Coins, Ticket, CheckCircle, Clock, XCircle, MapPin, Calendar } from 'lucide-react';

interface Transaction {
    id_transaction: number;
    description: string;
    petugas_name?: string;
    location?: string;
    created_at: string;
    type: string;
    status: string;
    tickets_change: number;
    points_earned?: number;
}

interface PassengerHistoryProps {
    transactions: Transaction[];
    loading: boolean;
}

export default function PassengerHistory({ transactions, loading }: PassengerHistoryProps) {
    const getTransactionIcon = (type: string) => {
        return type === 'bottle_exchange' ? <Coins className="h-4 w-4" /> : <Ticket className="h-4 w-4" />;
    };

    const getTransactionColor = (type: string) => {
        return type === 'bottle_exchange' ? 'text-green-600' : 'text-blue-600';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Riwayat Transaksi
                </CardTitle>
                <CardDescription>
                    Semua aktivitas transaksi Anda
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Memuat riwayat transaksi...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-8">
                        <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada transaksi</p>
                        <p className="text-sm text-gray-400">Mulai tukar botol untuk mendapatkan tiket!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {transactions.map((transaction) => (
                            <div key={transaction.id_transaction} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-full bg-gray-100 ${getTransactionColor(transaction.type)}`}>
                                            {getTransactionIcon(transaction.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium text-gray-900">{transaction.description}</p>
                                                {getStatusIcon(transaction.status)}
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>Petugas: {transaction.petugas_name}</p>
                                                {transaction.location && (
                                                    <p className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {transaction.location}
                                                    </p>
                                                )}
                                                <p className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(transaction.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex flex-col gap-1">
                                            {transaction.tickets_change !== 0 && (
                                                <Badge variant={transaction.tickets_change > 0 ? "default" : "secondary"}>
                                                    {transaction.tickets_change > 0 ? '+' : ''}{transaction.tickets_change} tiket
                                                </Badge>
                                            )}
                                            {(transaction.points_earned || 0) > 0 && (
                                                <Badge variant="outline" className="text-green-600">
                                                    +{transaction.points_earned} poin
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

import { Card, CardContent } from '@/components/ui/card';
import { Ticket, Coins, History } from 'lucide-react';

interface UserData {
    ticketsBalance: number;
    points: number;
}

interface PassengerStatsProps {
    user: UserData;
    transactionCount: number;
}

export default function PassengerStats({ user, transactionCount }: PassengerStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Saldo Tiket</p>
                            <p className="text-3xl font-bold text-green-600">{user.ticketsBalance}</p>
                        </div>
                        <Ticket className="h-8 w-8 text-green-600" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Poin</p>
                            <p className="text-3xl font-bold text-green-600">{user.points}</p>
                        </div>
                        <Coins className="h-8 w-8 text-green-600" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
                            <p className="text-3xl font-bold text-green-600">{transactionCount}</p>
                        </div>
                        <History className="h-8 w-8 text-green-600" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

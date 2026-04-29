import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bus, CheckCircle, AlertCircle } from 'lucide-react';

interface UserData {
    name: string;
    ticketsBalance: number;
}

interface KarnetTransactionProps {
    currentUserData: UserData | null;
    handleKarnetTransaction: () => void;
    loading: boolean;
}

export default function KarnetTransaction({
    currentUserData,
    handleKarnetTransaction,
    loading
}: KarnetTransactionProps) {
    return (
        <Card>
            <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex items-center">
                    <Bus className="h-4 w-4 mr-2" />
                    Karnet - Validasi
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Validasi tiket untuk naik bus
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
                {currentUserData && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
                        <div className="flex items-center space-x-2 text-blue-800 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">{currentUserData.name}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-blue-700 mt-1">
                            <p>Saldo: <span className="font-bold text-base">{currentUserData.ticketsBalance}</span></p>
                            {currentUserData.ticketsBalance < 1 && (
                                <p className="text-red-600 font-medium mt-1 text-xs">⚠️ Saldo tidak cukup!</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-800 text-sm">
                        <AlertCircle className="h-5 w-5" />
                        <span className="font-medium">Tarif: 1 Tiket</span>
                    </div>
                </div>

                <Button
                    onClick={handleKarnetTransaction}
                    className="w-full text-sm"
                    disabled={!currentUserData || (currentUserData?.ticketsBalance < 1) || loading}
                >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {loading ? 'Memproses...' : 'Validasi'}
                </Button>
            </CardContent>
        </Card>
    );
}

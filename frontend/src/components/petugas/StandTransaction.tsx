import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2 } from 'lucide-react';

interface UserData {
    name: string;
    ticketsBalance: number;
}

interface BottleRate {
    id_bottle_rate: number;
    bottle_type: string;
    bottles_required: number;
    tickets_earned: number;
    is_active: boolean;
}

interface StandTransactionProps {
    currentUserData: UserData | null;
    bottleCount: Record<string, number>;
    setBottleCount: (val: any) => void;
    calculateTickets: () => number;
    handleStandTransaction: () => void;
    loading: boolean;
}

export default function StandTransaction({
    currentUserData,
    bottleCount,
    setBottleCount,
    calculateTickets,
    handleStandTransaction,
    loading
}: StandTransactionProps) {
    const [bottleRates, setBottleRates] = useState<BottleRate[]>([]);
    const [ratesLoading, setRatesLoading] = useState(true);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/bottle-rates');
                if (response.ok) {
                    const data = await response.json();
                    const activeRates = data.filter((r: BottleRate) => r.is_active);
                    setBottleRates(activeRates);
                    // Init bottleCount untuk semua jenis botol
                    const initial: Record<string, number> = {};
                    activeRates.forEach((r: BottleRate) => {
                        initial[r.bottle_type] = 0;
                    });
                    setBottleCount(initial);
                }
            } catch (error) {
                console.error('Failed to fetch bottle rates', error);
            } finally {
                setRatesLoading(false);
            }
        };
        fetchRates();
    }, []);

    return (
        <Card>
            <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Stand - Tukar Botol</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Input jumlah botol
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
                {currentUserData && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
                        <div className="flex items-center space-x-2 text-green-800 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">{currentUserData.name}</span>
                        </div>
                        <div className="text-xs sm:text-sm text-green-700 mt-1">
                            <p>Tiket: <span className="font-bold">{currentUserData.ticketsBalance}</span></p>
                        </div>
                    </div>
                )}

                {ratesLoading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        {bottleRates.map((rate) => (
                            <div key={rate.id_bottle_rate} className="space-y-1 sm:space-y-2">
                                <Label className="text-xs sm:text-sm capitalize">{rate.bottle_type}</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={bottleCount[rate.bottle_type] || 0}
                                    onChange={(e) => setBottleCount({
                                        ...bottleCount,
                                        [rate.bottle_type]: parseInt(e.target.value) || 0
                                    })}
                                    className="text-sm h-8 sm:h-10"
                                />
                                <p className="text-xs text-gray-500">
                                    {rate.bottles_required} botol = {rate.tickets_earned} tiket
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">Total:</span>
                        <Badge className="text-base sm:text-lg px-2 py-1 bg-green-600">
                            {calculateTickets()} Tiket
                        </Badge>
                    </div>
                </div>

                <Button
                    onClick={handleStandTransaction}
                    className="w-full bg-green-600 hover:bg-green-700 text-sm"
                    disabled={!currentUserData || calculateTickets() === 0 || loading}
                >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {loading ? 'Memproses...' : 'Proses'}
                </Button>
            </CardContent>
        </Card>
    );
}

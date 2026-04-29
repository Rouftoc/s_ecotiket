import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ArrowRight } from 'lucide-react';
import { Transaction } from '@/types/dashboard';

interface TopLocationsWidgetProps {
    transactions: Transaction[];
}

export default function TopLocationsWidget({ transactions }: TopLocationsWidgetProps) {
    const locationStats: { [key: string]: number } = {};

    transactions.forEach(t => {
        if (t.type === 'bottle_exchange' && t.location) {
            locationStats[t.location] = (locationStats[t.location] || 0) + (t.bottles_count || 0);
        }
    });

    const sortedLocations = Object.entries(locationStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    const maxCount = sortedLocations.length > 0 ? sortedLocations[0].count : 0;

    return (
        <Card className="h-full">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    Lokasi Teramai
                </CardTitle>
                <p className="text-sm text-muted-foreground">Berdasarkan jumlah botol terkumpul</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {sortedLocations.length === 0 ? (
                        <p className="text-center text-gray-500 text-sm py-4">Belum ada data lokasi</p>
                    ) : (
                        sortedLocations.map((loc, index) => (
                            <div key={loc.name} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-700 truncate max-w-[70%]">{loc.name}</span>
                                    <span className="font-bold text-gray-900">{loc.count} Botol</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                        style={{ width: `${(loc.count / maxCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

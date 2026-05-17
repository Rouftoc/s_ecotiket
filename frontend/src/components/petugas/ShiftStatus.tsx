import { useState, useEffect } from 'react';
import { MapPin, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Location {
    id: string;
    name: string;
    type: string;
}

interface ShiftStatusProps {
    locations: Location[];
    selectedLocation: string;
    setSelectedLocation: (val: string) => void;
    activeMode: 'stand' | 'karnet' | null;
    endShift: () => void;
}

export default function ShiftStatus({
    locations,
    selectedLocation,
    setSelectedLocation,
    activeMode,
    endShift
}: ShiftStatusProps) {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const formatDate = (d: Date) => d.toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    const formatTime = (d: Date) => d.toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    return (
        <Card className="mb-4 sm:mb-8">
            <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-lg sm:text-xl flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Status Shift
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(now)}
                        </span>
                        <span className="flex items-center gap-1 font-mono font-semibold text-gray-700">
                            <Clock className="h-4 w-4" />
                            {formatTime(now)}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-2 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <Label className="text-sm shrink-0">Lokasi Tugas:</Label>
                            <Select value={selectedLocation} onValueChange={setSelectedLocation} disabled={!!activeMode}>
                                <SelectTrigger className="w-full sm:w-72 text-sm">
                                    <SelectValue placeholder="Pilih lokasi" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((location) => (
                                        <SelectItem key={location.id} value={location.id} className="text-sm">
                                            {location.name} ({location.type})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {activeMode && (
                            <div className="flex items-center gap-2">
                                <Badge className={`text-xs sm:text-sm ${activeMode === 'stand' ? 'bg-green-600' : 'bg-blue-600'}`}>
                                    {activeMode === 'stand' ? 'Stand Aktif' : 'Kernet Aktif'}
                                </Badge>
                                <span className="text-xs sm:text-sm text-gray-600">
                                    di {locations.find(l => l.id === selectedLocation)?.name}
                                </span>
                            </div>
                        )}
                    </div>
                    {activeMode && (
                        <Button onClick={endShift} variant="destructive" className="w-full sm:w-auto text-sm">
                            Akhiri Shift
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

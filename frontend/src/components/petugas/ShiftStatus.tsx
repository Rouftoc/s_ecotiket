import { MapPin } from 'lucide-react';
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
    return (
        <Card className="mb-4 sm:mb-8">
            <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Status Shift
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-2 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <Label className="text-sm">Lokasi Tugas:</Label>
                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                <SelectTrigger className="w-full sm:w-64 text-sm">
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
                            <div className="flex items-center space-x-2">
                                <Badge variant="default" className="bg-green-600 text-xs sm:text-sm">
                                    {activeMode === 'stand' ? 'Stand Aktif' : 'Karnet Aktif'}
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

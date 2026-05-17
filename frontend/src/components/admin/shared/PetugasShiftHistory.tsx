import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, MapPin, Loader2, CalendarDays } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { shiftsAPI, ShiftRecord } from '@/lib/api/shifts';

interface PetugasShiftHistoryProps {
    petugasId: number;
}

export function PetugasShiftHistory({ petugasId }: PetugasShiftHistoryProps) {
    const [shifts, setShifts] = useState<ShiftRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await shiftsAPI.getShiftHistory(petugasId);
                setShifts(res.shifts || []);
            } catch {
                setShifts([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [petugasId]);

    const formatTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString('id-ID', {
                hour: '2-digit', minute: '2-digit'
            });
        } catch { return '-'; }
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            });
        } catch { return '-'; }
    };

    const getDuration = (start: string, end: string | null) => {
        if (!end) return null;
        const ms = new Date(end).getTime() - new Date(start).getTime();
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        return `${hours}j ${minutes}m`;
    };

    const getDateKey = (dateString: string) => {
        return new Date(dateString).toISOString().split('T')[0];
    };

    const filteredShifts = dateFilter
        ? shifts.filter(s => getDateKey(s.started_at) === dateFilter)
        : shifts;

    return (
        <Card>
            <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Riwayat Shift
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Label className="text-sm text-gray-500 whitespace-nowrap">
                            <CalendarDays className="h-4 w-4 inline mr-1" />
                            Filter Tanggal:
                        </Label>
                        <Input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-40 h-8 text-sm"
                        />
                        {dateFilter && (
                            <button
                                onClick={() => setDateFilter('')}
                                className="text-xs text-gray-400 hover:text-gray-600"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                ) : filteredShifts.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm py-8">
                        {dateFilter ? 'Tidak ada shift pada tanggal ini' : 'Belum ada riwayat shift'}
                    </p>
                ) : (
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="text-xs font-semibold text-gray-500 uppercase">Tanggal</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-500 uppercase">Lokasi</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-500 uppercase">Mode</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-500 uppercase">Jam Masuk</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-500 uppercase">Jam Selesai</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-500 uppercase">Durasi</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-500 uppercase">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredShifts.map((shift) => (
                                <TableRow key={shift.id_assignment} className="hover:bg-gray-50/50">
                                    <TableCell className="text-sm text-gray-600">
                                        {formatDate(shift.started_at)}
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-medium flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                                            {shift.location_name}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={shift.mode === 'stand' ? 'default' : 'secondary'}>
                                            {shift.mode === 'stand' ? 'Stand' : 'Karnet'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm font-mono font-semibold text-gray-800">
                                        {formatTime(shift.started_at)}
                                    </TableCell>
                                    <TableCell className="text-sm font-mono font-semibold text-gray-800">
                                        {shift.ended_at ? formatTime(shift.ended_at) : (
                                            <span className="text-green-600 font-normal text-xs">Sedang bertugas</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {getDuration(shift.started_at, shift.ended_at) ?? (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={shift.is_active ? 'default' : 'outline'}
                                            className={shift.is_active
                                                ? 'bg-green-100 text-green-700 border-green-200'
                                                : 'text-gray-500'
                                            }
                                        >
                                            {shift.is_active ? 'Aktif' : 'Selesai'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Edit, Trash2, Building, RefreshCw } from 'lucide-react';
import { Location } from '@/types/dashboard';

interface LocationsTabProps {
    locations: Location[];
    loading: boolean;
    onAddLocation: () => void;
    onEditLocation: (location: Location) => void;
    onDeleteLocation: (id: number) => void;
}

export function LocationsTab({
    locations,
    loading,
    onAddLocation,
    onEditLocation,
    onDeleteLocation
}: LocationsTabProps) {

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-yellow-100 text-yellow-800';
            case 'maintenance': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getLocationTypeColor = (type: string) => {
        switch (type) {
            case 'terminal': return 'bg-blue-100 text-blue-800';
            case 'koridor': return 'bg-green-100 text-green-800';
            case 'stand': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'terminal': return 'Terminal';
            case 'koridor': return 'Koridor';
            case 'stand': return 'Stand';
            default: return type;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Aktif';
            case 'inactive': return 'Tidak Aktif';
            case 'maintenance': return 'Maintenance';
            default: return status;
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return '-';
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Manajemen Lokasi
                            </CardTitle>
                        </div>
                        <Button onClick={onAddLocation}>
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Lokasi
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Lokasi</TableHead>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Kapasitas</TableHead>
                                    <TableHead>Jam Operasional</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex items-center justify-center gap-2">
                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                Memuat data lokasi...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : locations && locations.length > 0 ? (
                                    locations.map((location) => (
                                        <TableRow key={location.id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                        <Building className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-medium text-gray-900 truncate">{location.name}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getLocationTypeColor(location.type)}>
                                                    {getTypeLabel(location.type)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(location.status)}>
                                                    {getStatusLabel(location.status)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm whitespace-nowrap">
                                                    {location.capacity ? `${location.capacity} orang` : '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm whitespace-nowrap">{location.operating_hours || '-'}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline" 
                                                        onClick={() => onEditLocation(location)}
                                                        title="Edit lokasi"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="outline" 
                                                        onClick={() => onDeleteLocation(location.id)}
                                                        title="Hapus lokasi"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            Belum ada lokasi terdaftar
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
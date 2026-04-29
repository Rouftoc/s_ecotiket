import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Location } from '@/types/dashboard';

interface LocationFormProps {
    location?: Location;
    onSubmit: (data: Omit<Location, 'id_location'>) => void;
    onCancel: () => void;
}

export function LocationForm({ location, onSubmit, onCancel }: LocationFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'terminal' as 'terminal' | 'koridor' | 'stand',
        address: '',
        capacity: 0,
        operating_hours: '',
        status: 'active' as 'active' | 'inactive' | 'maintenance'
    });

    useEffect(() => {
        console.log('LocationForm mounted/updated. Location prop:', location);
        if (location) {
            const rawType = (location.type || '').toLowerCase();
            const validTypes = ['terminal', 'koridor', 'stand'];
            const type = validTypes.includes(rawType) ? rawType : 'terminal';

            const rawStatus = (location.status || '').toLowerCase();
            const validStatuses = ['active', 'inactive', 'maintenance'];
            const status = validStatuses.includes(rawStatus) ? rawStatus : 'active';

            console.log('Normalization:', { rawType, type, rawStatus, status });

            setFormData({
                name: location.name || '',
                type: type as any,
                address: location.address || '',
                capacity: location.capacity || 0,
                operating_hours: location.operating_hours || '',
                status: status as any
            });
        }
    }, [location]);

    console.log('Current FormData:', formData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const rawType = (formData.type || '').toLowerCase().trim();
        const validTypes = ['terminal', 'koridor', 'stand'];
        const finalType = validTypes.includes(rawType) ? rawType : 'terminal';

        if (!formData.name || !formData.address) {
            alert('Nama dan Alamat wajib diisi');
            return;
        }

        const finalData = {
            ...formData,
            type: finalType as any,
            capacity: Number(formData.capacity) || 0
        };

        console.log('Submitting FormData:', finalData);
        onSubmit(finalData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Lokasi</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Terminal Antasari" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Tipe Lokasi</Label>
                    <Select value={formData.type} onValueChange={(value: 'terminal' | 'koridor' | 'stand') => setFormData({ ...formData, type: value })}>
                        <SelectTrigger id="type"><SelectValue placeholder="Pilih Tipe" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="terminal">Terminal</SelectItem>
                            <SelectItem value="koridor">Koridor</SelectItem>
                            <SelectItem value="stand">Stand</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Masukkan alamat lengkap" required />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="capacity">Kapasitas</Label>
                    <Input id="capacity" type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} placeholder="100" min="0" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="operating_hours">Jam Operasional</Label>
                    <Input id="operating_hours" value={formData.operating_hours} onChange={(e) => setFormData({ ...formData, operating_hours: e.target.value })} placeholder="06:00-22:00" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'maintenance') => setFormData({ ...formData, status: value })}>
                        <SelectTrigger id="status"><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Tidak Aktif</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
                <Button type="submit">{location ? 'Update Lokasi' : 'Tambah Lokasi'}</Button>
            </div>
        </form>
    );
}
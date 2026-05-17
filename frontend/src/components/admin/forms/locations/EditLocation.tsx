import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Location } from '@/types/dashboard';

export interface EditLocationData {
    name: string;
    type: 'terminal' | 'koridor' | 'stand';
    address: string;
    operating_hours: string;
    status: 'active' | 'inactive' | 'maintenance';
}

interface EditLocationProps {
    location: Location;
    onSubmit: (data: EditLocationData) => void;
    onCancel: () => void;
}

export function EditLocation({ location, onSubmit, onCancel }: EditLocationProps) {
    const validTypes = ['terminal', 'koridor', 'stand'];
    const validStatuses = ['active', 'inactive', 'maintenance'];

    const [formData, setFormData] = useState<EditLocationData>({
        name: location.name || '',
        type: (validTypes.includes(location.type) ? location.type : 'terminal') as EditLocationData['type'],
        address: location.address || '',
        operating_hours: location.operating_hours || '',
        status: (validStatuses.includes(location.status) ? location.status : 'active') as EditLocationData['status'],
    });

    const set = (field: keyof EditLocationData, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.address) {
            alert('Nama dan Alamat wajib diisi');
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Nama Lokasi</Label>
                    <Input value={formData.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <Label>Tipe Lokasi</Label>
                    <Select value={formData.type} onValueChange={(v: 'terminal' | 'koridor' | 'stand') => set('type', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="terminal">Terminal</SelectItem>
                            <SelectItem value="koridor">Koridor</SelectItem>
                            <SelectItem value="stand">Stand</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Alamat</Label>
                <Input value={formData.address} onChange={e => set('address', e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Jam Operasional</Label>
                    <Input value={formData.operating_hours} onChange={e => set('operating_hours', e.target.value)} placeholder="06:00-18:00" />
                </div>
                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(v: 'active' | 'inactive' | 'maintenance') => set('status', v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Tidak Aktif</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>Batal</Button>
                <Button type="submit">Simpan Perubahan</Button>
            </div>
        </form>
    );
}

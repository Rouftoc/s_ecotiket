import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface CreateLocationData {
    name: string;
    type: 'terminal' | 'koridor' | 'stand';
    address: string;
    operating_hours: string;
    status: 'active' | 'inactive' | 'maintenance';
}

interface CreateLocationProps {
    onSubmit: (data: CreateLocationData) => void;
    onCancel: () => void;
}

export function CreateLocation({ onSubmit, onCancel }: CreateLocationProps) {
    const [formData, setFormData] = useState<CreateLocationData>({
        name: '', type: 'terminal', address: '',
        operating_hours: '', status: 'active'
    });

    const set = (field: keyof CreateLocationData, value: string) =>
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
                    <Input value={formData.name} onChange={e => set('name', e.target.value)} placeholder="Terminal Antasari" required />
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
                <Input value={formData.address} onChange={e => set('address', e.target.value)} placeholder="Alamat lengkap" required />
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
                <Button type="submit">Tambah Lokasi</Button>
            </div>
        </form>
    );
}

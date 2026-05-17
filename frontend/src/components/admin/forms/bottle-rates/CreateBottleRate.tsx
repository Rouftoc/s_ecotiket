import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

export interface CreateBottleRateData {
    bottle_type: string;
    bottles_required: number;
    tickets_earned: number;
    points_earned: number;
}

interface CreateBottleRateProps {
    isSaving: boolean;
    onSave: (data: CreateBottleRateData) => void;
    onCancel: () => void;
}

export function CreateBottleRate({ isSaving, onSave, onCancel }: CreateBottleRateProps) {
    const [formData, setFormData] = useState<CreateBottleRateData>({
        bottle_type: '', bottles_required: 0, tickets_earned: 0, points_earned: 0
    });

    const set = (field: keyof CreateBottleRateData, value: string | number) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label>Jenis Botol</Label>
                <Input value={formData.bottle_type} onChange={e => set('bottle_type', e.target.value)} placeholder="Contoh: jumbo, kecil, cup" />
            </div>
            <div className="grid gap-2">
                <Label>Jumlah Botol Diperlukan</Label>
                <Input type="number" min="1" value={formData.bottles_required} onChange={e => set('bottles_required', parseInt(e.target.value) || 0)} />
            </div>
            <div className="grid gap-2">
                <Label>Tiket Didapat</Label>
                <Input type="number" min="1" value={formData.tickets_earned} onChange={e => set('tickets_earned', parseInt(e.target.value) || 0)} />
            </div>
            <div className="grid gap-2">
                <Label>Poin Tambahan (Opsional)</Label>
                <Input type="number" min="0" value={formData.points_earned} onChange={e => set('points_earned', parseInt(e.target.value) || 0)} />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel} disabled={isSaving}>Batal</Button>
                <Button onClick={() => onSave(formData)} disabled={isSaving} className="bg-black hover:bg-gray-800">
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : 'Tambah Jenis Botol'}
                </Button>
            </DialogFooter>
        </div>
    );
}

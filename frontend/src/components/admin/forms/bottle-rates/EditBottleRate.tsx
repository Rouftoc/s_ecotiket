import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

export interface EditBottleRateData {
    bottle_type: string;
    bottles_required: number;
    tickets_earned: number;
    points_earned: number;
}

interface EditBottleRateProps {
    initialData: Partial<EditBottleRateData>;
    isSaving: boolean;
    onSave: (data: EditBottleRateData) => void;
    onCancel: () => void;
}

export function EditBottleRate({ initialData, isSaving, onSave, onCancel }: EditBottleRateProps) {
    const [formData, setFormData] = useState<EditBottleRateData>({
        bottle_type: '', bottles_required: 0, tickets_earned: 0, points_earned: 0
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                bottle_type: initialData.bottle_type || '',
                bottles_required: initialData.bottles_required || 0,
                tickets_earned: initialData.tickets_earned || 0,
                points_earned: initialData.points_earned || 0
            });
        }
    }, [initialData]);

    const set = (field: keyof EditBottleRateData, value: string | number) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label>Jenis Botol</Label>
                <Input value={formData.bottle_type} disabled className="bg-gray-100 cursor-not-allowed" />
                <p className="text-xs text-muted-foreground">Jenis botol tidak dapat diubah. Hapus dan buat baru jika perlu.</p>
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
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : 'Simpan Perubahan'}
                </Button>
            </DialogFooter>
        </div>
    );
}

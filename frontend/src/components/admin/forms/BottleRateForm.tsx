
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

export interface BottleRateFormData {
    bottle_type: string;
    bottles_required: number;
    tickets_earned: number;
    points_earned: number;
}

interface BottleRateFormProps {
    initialData?: Partial<BottleRateFormData> | null;
    isCreating: boolean;
    isSaving: boolean;
    onSave: (data: BottleRateFormData) => void;
    onCancel: () => void;
}

export function BottleRateForm({
    initialData,
    isCreating,
    isSaving,
    onSave,
    onCancel
}: BottleRateFormProps) {
    const [formData, setFormData] = useState<BottleRateFormData>({
        bottle_type: '',
        bottles_required: 0,
        tickets_earned: 0,
        points_earned: 0
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

    const handleChange = (field: keyof BottleRateFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="bottle_type">Jenis Botol</Label>
                <Input
                    id="bottle_type"
                    placeholder="Contoh: Plastik Besar, Kaleng"
                    value={formData.bottle_type}
                    onChange={(e) => handleChange('bottle_type', e.target.value)}
                    disabled={!isCreating}
                />
                {!isCreating && (
                    <p className="text-xs text-muted-foreground">
                        Jenis botol tidak dapat diubah saat edit. Hapus dan buat baru jika perlu.
                    </p>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="bottles_required">Jumlah Botol Diperlukan</Label>
                <Input
                    id="bottles_required"
                    type="number"
                    min="1"
                    value={formData.bottles_required}
                    onChange={(e) => handleChange('bottles_required', parseInt(e.target.value) || 0)}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="tickets_earned">Tiket Didapat</Label>
                <Input
                    id="tickets_earned"
                    type="number"
                    min="1"
                    value={formData.tickets_earned}
                    onChange={(e) => handleChange('tickets_earned', parseInt(e.target.value) || 0)}
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="points_earned">Poin Tambahan (Opsional)</Label>
                <Input
                    id="points_earned"
                    type="number"
                    min="0"
                    value={formData.points_earned}
                    onChange={(e) => handleChange('points_earned', parseInt(e.target.value) || 0)}
                />
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={onCancel} disabled={isSaving}>
                    Batal
                </Button>
                <Button onClick={handleSubmit} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        isCreating ? 'Tambah Data' : 'Simpan Perubahan'
                    )}
                </Button>
            </DialogFooter>
        </div>
    );
}

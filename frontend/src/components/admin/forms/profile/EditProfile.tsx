import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';

export interface EditProfileData {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface EditProfileProps {
    initialData: EditProfileData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: EditProfileData) => Promise<void>;
    isUpdating: boolean;
}

export function EditProfile({ initialData, open, onOpenChange, onSave, isUpdating }: EditProfileProps) {
    const [formData, setFormData] = useState<EditProfileData>(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData, open]);

    const set = (field: keyof EditProfileData, value: string) =>
        setFormData(prev => ({ ...prev, [field]: value }));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Profil Admin</DialogTitle>
                    <DialogDescription>Perbarui informasi personal Anda.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Nama Lengkap</Label>
                        <Input value={formData.name} onChange={e => set('name', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" value={formData.email} onChange={e => set('email', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>No. Telepon</Label>
                        <Input value={formData.phone} onChange={e => set('phone', e.target.value)} placeholder="0812..." />
                    </div>
                    <div className="space-y-2">
                        <Label>Alamat</Label>
                        <Textarea value={formData.address} onChange={e => set('address', e.target.value)} placeholder="Alamat lengkap..." />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button onClick={() => onSave(formData)} disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Simpan Perubahan
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface EditProfileDialogProps {
    initialData: ProfileData;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: ProfileData) => Promise<void>;
    isUpdating: boolean;
}

export function EditProfileDialog({ initialData, open, onOpenChange, onSave, isUpdating }: EditProfileDialogProps) {
    const [profileData, setProfileData] = useState<ProfileData>(initialData);

    useEffect(() => {
        setProfileData(initialData);
    }, [initialData, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Profil Admin</DialogTitle>
                    <DialogDescription>Perbarui informasi personal Anda.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="profileName">Nama Lengkap</Label>
                        <Input id="profileName" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="profileEmail">Email</Label>
                        <Input id="profileEmail" type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="profilePhone">No. Telepon</Label>
                        <Input id="profilePhone" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} placeholder="0812..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="profileAddress">Alamat</Label>
                        <Textarea id="profileAddress" value={profileData.address} onChange={e => setProfileData({ ...profileData, address: e.target.value })} placeholder="Masukkan alamat lengkap..." />
                    </div>
                    <div className="flex justify-end pt-2 space-x-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
                        <Button onClick={() => onSave(profileData)} disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Simpan Perubahan
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
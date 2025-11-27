import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserRecord } from '@/types/dashboard';

interface EditUserDialogProps {
    user: UserRecord | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: Partial<UserRecord>) => Promise<void>;
}

export function EditUserDialog({ user, open, onOpenChange, onSave }: EditUserDialogProps) {
    const [formData, setFormData] = useState<Partial<UserRecord>>({});

    useEffect(() => {
        if (user) {
            setFormData({ ...user });
        }
    }, [user]);

    const handleSubmit = async () => {
        if (formData) {
            await onSave(formData);
            onOpenChange(false);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Pengguna</DialogTitle>
                    <DialogDescription>Update data pengguna</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nama Lengkap</Label>
                            <Input value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        {user.role === 'penumpang' ? (
                            <div className="space-y-2">
                                <Label>NIK</Label>
                                <Input value={formData.nik || ''} onChange={(e) => setFormData({ ...formData, nik: e.target.value })} maxLength={16} />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input type="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>No. Telepon</Label>
                            <Input value={formData.phone || ''} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Alamat</Label>
                        <Input value={formData.address || ''} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    </div>
                    {user.role === 'penumpang' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Saldo Tiket</Label>
                                <Input type="number" value={formData.ticketsBalance || 0} onChange={(e) => setFormData({ ...formData, ticketsBalance: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Poin</Label>
                                <Input type="number" value={formData.points || 0} onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })} />
                            </div>
                        </div>
                    )}
                    <Button onClick={handleSubmit} className="w-full">Update Pengguna</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
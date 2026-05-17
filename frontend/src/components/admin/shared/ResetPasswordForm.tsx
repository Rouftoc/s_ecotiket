import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import { usersAPI } from '@/lib/api';
import { toast } from 'sonner';

interface ResetPasswordFormProps {
    userId: number;
    userName: string;
}

export function ResetPasswordForm({ userId, userName }: ResetPasswordFormProps) {
    const [open, setOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('Konfirmasi password tidak cocok');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('Password minimal 6 karakter');
            return;
        }
        setSaving(true);
        try {
            await usersAPI.resetUserPassword(userId, newPassword);
            toast.success(`Password ${userName} berhasil direset`);
            setOpen(false);
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(error.message || 'Gagal mereset password');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="gap-1.5 w-full"
            >
                <KeyRound className="h-4 w-4" />
                Reset Password
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <KeyRound className="h-5 w-5" />
                            Reset Password
                        </DialogTitle>
                        <DialogDescription>
                            Reset password untuk <strong>{userName}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label>Password Baru</Label>
                            <div className="relative">
                                <Input
                                    type={showNew ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                    placeholder="Min. 6 karakter"
                                    className="pr-10"
                                    required
                                />
                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowNew(!showNew)}>
                                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Konfirmasi Password</Label>
                            <div className="relative">
                                <Input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Ulangi password baru"
                                    className="pr-10"
                                    required
                                />
                                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setShowConfirm(!showConfirm)}>
                                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving} className="flex-1">
                                Batal
                            </Button>
                            <Button type="submit" disabled={saving} className="flex-1">
                                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : 'Reset Password'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

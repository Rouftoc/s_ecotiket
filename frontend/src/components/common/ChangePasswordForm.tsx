import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import { usersAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function ChangePasswordForm() {
    const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.newPassword !== form.confirmPassword) {
            toast.error('Konfirmasi password tidak cocok');
            return;
        }
        if (form.newPassword.length < 6) {
            toast.error('Password baru minimal 6 karakter');
            return;
        }
        setSaving(true);
        try {
            await usersAPI.changePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            });
            toast.success('Password berhasil diubah');
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.message || 'Gagal mengubah password');
        } finally {
            setSaving(false);
        }
    };

    const PasswordInput = ({ id, label, field, showKey }: {
        id: string; label: string;
        field: keyof typeof form;
        showKey: keyof typeof show;
    }) => (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                <Input
                    id={id}
                    type={show[showKey] ? 'text' : 'password'}
                    value={form[field]}
                    onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    className="pr-10"
                    required
                />
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShow(prev => ({ ...prev, [showKey]: !prev[showKey] }))}
                >
                    {show[showKey] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <KeyRound className="h-5 w-5" />
                    Ganti Password
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
                    <PasswordInput id="current" label="Password Lama" field="currentPassword" showKey="current" />
                    <PasswordInput id="new" label="Password Baru" field="newPassword" showKey="new" />
                    <PasswordInput id="confirm" label="Konfirmasi Password Baru" field="confirmPassword" showKey="confirm" />
                    <Button type="submit" disabled={saving} className="w-full">
                        {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : 'Ubah Password'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

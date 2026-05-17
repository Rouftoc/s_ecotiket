import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Gift, Loader2 } from 'lucide-react';
import { notificationsAPI } from '@/lib/api/notifications';
import { toast } from 'sonner';
import { UserRecord } from '@/types/dashboard';

interface SendRewardNotificationProps {
    user: UserRecord;
}

export function SendRewardNotification({ user }: SendRewardNotificationProps) {
    const [open, setOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [form, setForm] = useState({
        title: 'Selamat! Kamu Mendapat Reward 🎉',
        message: `Halo ${user.name}, kamu telah mencapai target poin dan berhak mendapatkan reward e-money. Silakan hubungi admin untuk proses pengambilan hadiah.`
    });

    const handleSend = async () => {
        if (!form.title || !form.message) {
            toast.error('Judul dan pesan wajib diisi');
            return;
        }
        setSending(true);
        try {
            await notificationsAPI.sendToUser({
                id_user: user.id_user,
                type: 'reward',
                title: form.title,
                message: form.message
            });
            toast.success(`Notifikasi reward berhasil dikirim ke ${user.name}`);
            setOpen(false);
        } catch {
            toast.error('Gagal mengirim notifikasi');
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700 gap-1.5"
            >
                <Gift className="h-4 w-4" />
                Kirim Notifikasi Reward
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Gift className="h-5 w-5 text-yellow-500" />
                            Kirim Notifikasi Reward
                        </DialogTitle>
                        <DialogDescription>
                            Notifikasi akan dikirim ke <strong>{user.name}</strong> ({user.points} poin)
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                            <Label>Judul Notifikasi</Label>
                            <Input
                                value={form.title}
                                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Pesan</Label>
                            <Textarea
                                value={form.message}
                                onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                                rows={4}
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="outline" onClick={() => setOpen(false)} disabled={sending}>
                                Batal
                            </Button>
                            <Button
                                onClick={handleSend}
                                disabled={sending}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            >
                                {sending
                                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Mengirim...</>
                                    : <><Gift className="mr-2 h-4 w-4" />Kirim Notifikasi</>
                                }
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

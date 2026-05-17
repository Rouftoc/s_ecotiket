import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, Gift, Ticket, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { notificationsAPI, Notification } from '@/lib/api/notifications';
import { toast } from 'sonner';

const TYPE_ICON: Record<string, React.ReactNode> = {
    reward: <Gift className="h-5 w-5 text-yellow-500" />,
    ticket: <Ticket className="h-5 w-5 text-green-500" />,
    warning: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
};

const TYPE_LABEL: Record<string, string> = {
    reward: 'Reward',
    ticket: 'Tiket',
    warning: 'Peringatan',
    info: 'Informasi',
};

const TYPE_COLOR: Record<string, string> = {
    reward: 'bg-yellow-50 border-yellow-100',
    ticket: 'bg-green-50 border-green-100',
    warning: 'bg-red-50 border-red-100',
    info: 'bg-blue-50 border-blue-100',
};

function formatDateTime(dateString: string) {
    return new Date(dateString).toLocaleString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long',
        year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

export default function NotificationsPage() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const load = async () => {
        setLoading(true);
        try {
            const res = await notificationsAPI.getMyNotifications();
            setNotifications(res.notifications || []);
            setUnreadCount(res.unreadCount || 0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleMarkAllRead = async () => {
        await notificationsAPI.markAllRead();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
        toast.success('Semua notifikasi ditandai sudah dibaca');
    };

    const handleMarkOne = async (id: number) => {
        await notificationsAPI.markOneRead(id);
        setNotifications(prev => prev.map(n => n.id_notification === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleDelete = async (id: number) => {
        const deleted = notifications.find(n => n.id_notification === id);
        await notificationsAPI.deleteNotification(id);
        setNotifications(prev => prev.filter(n => n.id_notification !== id));
        if (deleted && !deleted.is_read) setUnreadCount(prev => Math.max(0, prev - 1));
        toast.success('Notifikasi dihapus');
    };

    const displayed = filter === 'unread'
        ? notifications.filter(n => !n.is_read)
        : notifications;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-1">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="font-bold text-gray-900 flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notifikasi
                            </h1>
                            {unreadCount > 0 && (
                                <p className="text-xs text-gray-500">{unreadCount} belum dibaca</p>
                            )}
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-green-600 hover:text-green-700 text-xs gap-1">
                            <CheckCheck className="h-4 w-4" />
                            Tandai semua dibaca
                        </Button>
                    )}
                </div>

                {/* Filter tabs */}
                <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Semua ({notifications.length})
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'unread' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Belum Dibaca ({unreadCount})
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
                {loading ? (
                    <div className="text-center py-16 text-gray-400">
                        <Bell className="h-10 w-10 mx-auto mb-3 opacity-20 animate-pulse" />
                        <p className="text-sm">Memuat notifikasi...</p>
                    </div>
                ) : displayed.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p className="font-medium text-gray-500">
                            {filter === 'unread' ? 'Tidak ada notifikasi yang belum dibaca' : 'Belum ada notifikasi'}
                        </p>
                    </div>
                ) : (
                    displayed.map(notif => (
                        <div
                            key={notif.id_notification}
                            className={`rounded-xl border p-4 transition-all ${!notif.is_read ? TYPE_COLOR[notif.type] || 'bg-blue-50 border-blue-100' : 'bg-white border-gray-100'}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 mt-0.5">
                                    {TYPE_ICON[notif.type] || TYPE_ICON.info}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className={`font-semibold text-gray-900 ${!notif.is_read ? 'text-base' : 'text-sm'}`}>
                                                {notif.title}
                                            </p>
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                {TYPE_LABEL[notif.type] || notif.type}
                                            </Badge>
                                            {!notif.is_read && (
                                                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Pesan FULL — tidak dipotong */}
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                        {notif.message}
                                    </p>

                                    <p className="text-xs text-gray-400 mt-2">
                                        {formatDateTime(notif.created_at)}
                                    </p>

                                    {/* Aksi */}
                                    <div className="flex items-center gap-2 mt-3">
                                        {!notif.is_read && (
                                            <button
                                                onClick={() => handleMarkOne(notif.id_notification)}
                                                className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                                            >
                                                <CheckCheck className="h-3.5 w-3.5" />
                                                Tandai dibaca
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notif.id_notification)}
                                            className="text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1 ml-auto"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

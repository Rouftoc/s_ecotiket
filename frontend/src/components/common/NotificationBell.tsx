import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Trash2, Gift, Ticket, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notificationsAPI, Notification } from '@/lib/api/notifications';
import { useNavigate } from 'react-router-dom';

const TYPE_ICON: Record<string, React.ReactNode> = {
    reward: <Gift className="h-4 w-4 text-yellow-500" />,
    ticket: <Ticket className="h-4 w-4 text-green-500" />,
    warning: <AlertCircle className="h-4 w-4 text-red-500" />,
    info: <Info className="h-4 w-4 text-blue-500" />,
};

function formatTime(dateString: string) {
    const d = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function NotificationBell() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const load = async () => {
        const res = await notificationsAPI.getMyNotifications();
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
    };

    useEffect(() => {
        load();
        const interval = setInterval(load, 30000);
        return () => clearInterval(interval);
    }, []);

    // Tutup dropdown kalau klik di luar
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleOpen = () => {
        setOpen(prev => !prev);
    };

    const handleMarkAllRead = async () => {
        await notificationsAPI.markAllRead();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
    };

    const handleMarkOne = async (id: number) => {
        await notificationsAPI.markOneRead(id);
        setNotifications(prev => prev.map(n => n.id_notification === id ? { ...n, is_read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        await notificationsAPI.deleteNotification(id);
        const deleted = notifications.find(n => n.id_notification === id);
        setNotifications(prev => prev.filter(n => n.id_notification !== id));
        if (deleted && !deleted.is_read) setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={handleOpen}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                        <h3 className="font-semibold text-gray-800 text-sm">Notifikasi</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1 font-medium"
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-gray-50">
                        {notifications.length === 0 ? (
                            <div className="py-10 text-center text-gray-400">
                                <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Belum ada notifikasi</p>
                            </div>
                        ) : (
                            notifications.slice(0, 5).map(notif => (
                                <div
                                    key={notif.id_notification}
                                    onClick={() => !notif.is_read && handleMarkOne(notif.id_notification)}
                                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!notif.is_read ? 'bg-blue-50/40' : ''}`}
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {TYPE_ICON[notif.type] || TYPE_ICON.info}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-sm font-medium text-gray-900 leading-tight ${!notif.is_read ? 'font-semibold' : ''}`}>
                                                {notif.title}
                                            </p>
                                            {!notif.is_read && (
                                                <span className="shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-1" />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">{formatTime(notif.created_at)}</p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(notif.id_notification, e)}
                                        className="shrink-0 p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer - Lihat Semua */}
                    {notifications.length > 0 && (
                        <div className="border-t px-4 py-2">
                            <button
                                onClick={() => { setOpen(false); navigate('/notifikasi'); }}
                                className="w-full text-xs text-green-600 hover:text-green-700 font-medium flex items-center justify-center gap-1 py-1"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Lihat Semua Notifikasi
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

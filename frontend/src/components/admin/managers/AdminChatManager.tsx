import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, ArrowLeft, XCircle } from 'lucide-react';
import { chatAPI } from '@/lib/api/chat';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

interface ChatSession {
    id_session: number;
    user_name: string;
    user_email: string;
    last_message: string;
    last_time: string;
    unread_count: number;
}

interface Message {
    id_message: number;
    message: string;
    sender_type: 'user' | 'admin' | 'bot';
    created_at: string;
}

export default function AdminChatManager() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [authError, setAuthError] = useState(false);

    // Refs for intervals
    const sessionInterval = useRef<NodeJS.Timeout | null>(null);
    const messageInterval = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const prevMessageCount = useRef<number>(0);

    // Helper to check if user is admin
    const isAdminUser = (): boolean => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return false;
            const user = JSON.parse(userStr);
            return user.role === 'admin' && !!user.token;
        } catch {
            return false;
        }
    };

    // Initial Load - with strict admin role validation
    useEffect(() => {
        // Strict check: only start if user is admin
        if (!isAdminUser()) {
            console.warn('AdminChatManager: User is not admin, will not start polling');
            setAuthError(true);
            return;
        }

        setAuthError(false);

        // Small delay to ensure everything is initialized
        const startupDelay = setTimeout(() => {
            // Re-check before starting
            if (!isAdminUser()) {
                setAuthError(true);
                return;
            }
            setIsReady(true);
            loadSessions();
            sessionInterval.current = setInterval(() => {
                // Re-validate on each poll
                if (isAdminUser()) {
                    loadSessions();
                } else {
                    console.warn('AdminChatManager: Lost admin role, stopping polling');
                    if (sessionInterval.current) clearInterval(sessionInterval.current);
                    setAuthError(true);
                }
            }, 5000);
        }, 500);

        return () => {
            clearTimeout(startupDelay);
            if (sessionInterval.current) clearInterval(sessionInterval.current);
            if (messageInterval.current) clearInterval(messageInterval.current);
        };
    }, []);

    // Load Messages when session selected
    useEffect(() => {
        if (selectedSessionId && isAdminUser()) {
            loadMessages(selectedSessionId);
            messageInterval.current = setInterval(() => {
                if (isAdminUser()) {
                    loadMessages(selectedSessionId);
                }
            }, 2000);
        } else {
            setMessages([]);
            if (messageInterval.current) clearInterval(messageInterval.current);
        }
        return () => {
            if (messageInterval.current) clearInterval(messageInterval.current);
        };
    }, [selectedSessionId]);

    // Only scroll to bottom when new messages arrive
    useEffect(() => {
        if (messages.length > prevMessageCount.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        prevMessageCount.current = messages.length;
    }, [messages]);

    const loadSessions = async () => {
        try {
            const data = await chatAPI.getAllSessions();
            setSessions(data);
        } catch (error: any) {
            // Handle 401/403 silently during polling to avoid spam
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                console.warn('Auth error on sessions polling, token may be expired');
            } else {
                console.error(error);
            }
        }
    };

    const loadMessages = async (id: number) => {
        try {
            const data = await chatAPI.getSessionMessages(id);
            setMessages(data);
        } catch (error: any) {
            // Handle 401/403 silently during polling
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                console.warn('Auth error on messages polling, token may be expired');
            } else {
                console.error(error);
            }
        }
    };

    const handleCloseSession = async () => {
        if (!selectedSessionId) return;
        Swal.fire({
            title: 'Tutup percakapan ini?',
            text: 'Sesi chat akan ditutup dan tidak muncul lagi di daftar aktif.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Tutup',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await chatAPI.closeSession(selectedSessionId);
                    toast.success('Sesi chat berhasil ditutup');
                    setSelectedSessionId(null);
                    loadSessions();
                } catch {
                    toast.error('Gagal menutup sesi');
                }
            }
        });
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedSessionId) return;

        try {
            await chatAPI.adminReply(selectedSessionId, replyText);
            setReplyText('');
            loadMessages(selectedSessionId); // Refresh immediately
        } catch (error) {
            toast.error('Gagal mengirim balasan');
        }
    };

    const selectedSession = sessions.find(s => s.id_session === selectedSessionId);

    return (
        <Card className="h-[calc(100vh-140px)] shadow-lg border-none flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar List */}
            <div className={`${selectedSessionId ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r bg-gray-50 flex-col h-full`}>
                <div className="p-4 border-b bg-white">
                    <h2 className="font-semibold flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-green-600" />
                        Percakapan Aktif
                    </h2>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {sessions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                Belum ada percakapan
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <button
                                    key={session.id_session}
                                    onClick={() => setSelectedSessionId(session.id_session)}
                                    className={`p-4 text-left hover:bg-white border-b transition-colors flex items-start gap-3 ${selectedSessionId === session.id_session ? 'bg-white border-l-4 border-l-green-600 shadow-sm' : 'border-l-4 border-l-transparent'
                                        }`}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                                            {session.user_name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium truncate">{session.user_name}</span>
                                            <span className="text-[10px] text-gray-400">
                                                {session.last_time ? new Date(session.last_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">
                                            {session.last_message || 'Belum ada pesan'}
                                        </p>
                                    </div>
                                    {session.unread_count > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                            {session.unread_count}
                                        </span>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>

            {/* Chat Window */}
            <div className={`${!selectedSessionId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white h-full`}>
                {selectedSession ? (
                    <>
                        <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm z-10">
                            <div className="flex items-center gap-3">
                                {/* Back Button for Mobile */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden -ml-2 mr-1"
                                    onClick={() => setSelectedSessionId(null)}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-gray-100 text-gray-600">
                                        {selectedSession.user_name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm md:text-base">{selectedSession.user_name}</h3>
                                    <p className="text-xs text-gray-500">{selectedSession.user_email}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCloseSession}
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1.5"
                            >
                                <XCircle className="h-4 w-4" />
                                <span className="hidden sm:inline">Tutup Chat</span>
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 p-4 bg-gray-50/30">
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id_message}
                                        className={`flex flex-col ${msg.sender_type === 'user' ? 'items-start' : 'items-end'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                {msg.sender_type === 'user' ? 'Pengguna' : msg.sender_type === 'bot' ? 'Bot' : 'Admin'}
                                            </span>
                                            <span className="text-[10px] text-gray-300">
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div
                                            className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.sender_type === 'user'
                                                ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                                : msg.sender_type === 'bot'
                                                    ? 'bg-gray-100 text-gray-600 italic border border-gray-200 rounded-tr-none'
                                                    : 'bg-green-600 text-white rounded-tr-none'
                                                }`}
                                        >
                                            {msg.message}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        <div className="p-4 bg-white border-t">
                            <form onSubmit={handleSendReply} className="flex gap-2">
                                <Input
                                    placeholder="Tulis balasan..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" className="bg-green-600 hover:bg-green-700 md:w-auto md:px-4">
                                    <Send className="h-4 w-4 md:mr-2" />
                                    <span className="hidden md:inline">Kirim</span>
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageCircle className="h-16 w-16 mb-4 opacity-20" />
                        <p>Pilih percakapan untuk melihat pesan</p>
                    </div>
                )}
            </div>
        </Card>
    );
}

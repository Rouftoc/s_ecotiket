import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { chatAPI } from '@/lib/api/chat';

interface Message {
    id_message: number;
    message: string;
    sender_type: 'user' | 'admin' | 'bot';
    timestamp: Date;
    created_at?: string;
}

interface ChatBotProps {
    user: any;
}

export default function ChatBot({ user }: ChatBotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollingInterval = useRef<NodeJS.Timeout | null>(null);
    const prevMessageCount = useRef<number>(0);
    const userScrolledUp = useRef<boolean>(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        if (!user) return;
        try {
            const data = await chatAPI.getMessages();
            if (data.messages) {
                setMessages(prev => {
                    // Keep temporary messages (with high tempId from Date.now())
                    const tempMessages = prev.filter(m => m.id_message > 1000000000);
                    // Get server message texts to check for duplicates
                    const serverMessageTexts = new Set(data.messages.map((m: Message) => m.message + m.sender_type));
                    // Filter out temp messages that are already on the server
                    const uniqueTempMessages = tempMessages.filter(
                        t => !serverMessageTexts.has(t.message + t.sender_type)
                    );
                    return [...data.messages, ...uniqueTempMessages];
                });
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    useEffect(() => {
        if (isOpen && user) {
            fetchMessages();
            pollingInterval.current = setInterval(fetchMessages, 2000);
        } else {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        }

        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, [isOpen, user]);

    // Only scroll to bottom when new messages arrive, not on every poll
    useEffect(() => {
        if (messages.length > prevMessageCount.current) {
            scrollToBottom();
        }
        prevMessageCount.current = messages.length;
    }, [messages, isOpen]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !user) return;

        const tempId = Date.now();
        const tempMsg: Message = {
            id_message: tempId,
            message: text,
            sender_type: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, tempMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            await chatAPI.sendMessage(text);
            await fetchMessages();
        } catch (error) {
            console.error("Failed to send", error);
        } finally {
            setIsTyping(false);
        }
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-80 md:w-96 shadow-2xl border-green-100 mb-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <CardHeader className="bg-green-600 text-white p-4 rounded-t-lg flex flex-row items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <MessageCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-base">EcoBot & Support</CardTitle>
                                <p className="text-xs text-green-100 opacity-90">Online • Balasan cepat</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20 h-8 w-8"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </CardHeader>

                    <CardContent className="p-0">
                        {/* Messages Area */}
                        <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 text-sm py-8 space-y-2">
                                    <p>👋 Halo, {user.name}!</p>
                                    <p>Ada yang bisa kami bantu seputar penukaran botol atau saldo tiket?</p>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div
                                    key={msg.id_message || idx}
                                    className={`flex flex-col ${msg.sender_type === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    {msg.sender_type !== 'user' && (idx === 0 || messages[idx - 1].sender_type === 'user') && (
                                        <span className="text-[10px] text-gray-500 ml-1 mb-1">
                                            {msg.sender_type === 'bot' ? '🤖 EcoBot' : '👨‍💻 Admin'}
                                        </span>
                                    )}

                                    <div
                                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.sender_type === 'user'
                                            ? 'bg-green-600 text-white rounded-br-none'
                                            : msg.sender_type === 'bot'
                                                ? 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                                : 'bg-blue-50 border border-blue-100 text-gray-800 rounded-bl-none'
                                            }`}
                                    >
                                        <div className="whitespace-pre-line leading-relaxed">{msg.message}</div>
                                    </div>

                                    <span className="text-[10px] text-gray-400 mt-1 px-1">
                                        {msg.created_at
                                            ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                            : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        }
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </CardContent>

                    <CardFooter className="p-3 bg-white border-t">
                        <form
                            className="flex w-full gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage(inputValue);
                            }}
                        >
                            <Input
                                placeholder="Tulis pesan..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="flex-1 focus-visible:ring-green-500 bg-gray-50 border-gray-200"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="bg-green-600 hover:bg-green-700 shrink-0"
                                disabled={!inputValue.trim() || isTyping}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 animate-bounce-slow"
                >
                    <MessageCircle className="h-7 w-7 text-white" />
                </Button>
            )}
        </div>
    );
}

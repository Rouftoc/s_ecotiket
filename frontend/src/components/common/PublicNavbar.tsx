import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import logoEcoTiket from '@/assets/logo_ecotiket.png';

const navLinks = [
    { label: 'Beranda', path: '/' },
    { label: 'Berita', path: '/berita' },
    { label: 'Cara Kerja', path: '/informasi/cara-kerja' },
    { label: 'Nilai Tukar', path: '/informasi/nilai-tukar' },
    { label: 'Keuntungan', path: '/informasi/keuntungan' },
];

export default function PublicNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
    }, []);

    const handleProfileClick = () => {
        if (!user) { navigate('/login'); return; }
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'petugas') navigate('/petugas');
        else navigate('/penumpang');
    };

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div
                        className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate('/')}
                    >
                        <img src={logoEcoTiket} alt="Logo" className="h-10 md:h-12 w-auto" />
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`text-sm font-medium transition-colors ${
                                    isActive(link.path)
                                        ? 'text-green-600 border-b-2 border-green-600 pb-0.5'
                                        : 'text-gray-600 hover:text-green-600'
                                }`}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <button
                                onClick={handleProfileClick}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-full transition-colors border border-green-200"
                            >
                                <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {user.name?.charAt(0)}
                                </div>
                                <span className="font-medium text-sm max-w-[100px] truncate">{user.name}</span>
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                                >
                                    Masuk
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                                >
                                    Daftar
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:text-green-600"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
                    {navLinks.map(link => (
                        <button
                            key={link.path}
                            onClick={() => { navigate(link.path); setMobileOpen(false); }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive(link.path)
                                    ? 'bg-green-50 text-green-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {link.label}
                        </button>
                    ))}
                    <div className="pt-2 border-t space-y-2">
                        {user ? (
                            <button
                                onClick={() => { handleProfileClick(); setMobileOpen(false); }}
                                className="w-full px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium flex items-center gap-2"
                            >
                                <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {user.name?.charAt(0)}
                                </div>
                                Dashboard Saya
                            </button>
                        ) : (
                            <>
                                <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium">Masuk</button>
                                <button onClick={() => { navigate('/register'); setMobileOpen(false); }} className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">Daftar</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Bus, BarChart, Recycle, Clock, MapPin, Loader2 } from 'lucide-react';
import BottleStatisticsChart from '@/components/admin/charts/BottleLineChart';
import { DashboardStats, BottleStats, Transaction, UserRecord } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';
import { shiftsAPI, ShiftRecord } from '@/lib/api/shifts';

interface OverviewTabProps {
    stats: DashboardStats;
    bottleStats: BottleStats;
    transactions: Transaction[];
    users: UserRecord[];
    statsFilter: string;
    setStatsFilter: (val: string) => void;
    userFilter: string;
    setUserFilter: (val: string) => void;
}

const FILTER_OPTIONS = [
    { value: 'all', label: 'Semua' },
    { value: 'today', label: 'Hari Ini' },
    { value: 'month', label: 'Bulan Ini' },
    { value: 'year', label: 'Tahun Ini' },
];

function FilterSelect({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-[120px] h-8 text-xs bg-gray-50 border-gray-200">
                <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
                {FILTER_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function filterTransactionsByPeriod(transactions: Transaction[], filter: string): Transaction[] {
    if (filter === 'all') return transactions;
    const now = new Date();
    return transactions.filter(t => {
        const d = new Date(t.created_at);
        if (filter === 'today') return d.toDateString() === now.toDateString();
        if (filter === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        if (filter === 'year') return d.getFullYear() === now.getFullYear();
        return true;
    });
}

function ActiveShiftsCard() {
    const [shifts, setShifts] = useState<ShiftRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await shiftsAPI.getAllActiveShifts();
                setShifts(res.shifts || []);
            } catch {
                setShifts([]);
            } finally {
                setLoading(false);
            }
        };
        load();
        // Refresh setiap 60 detik
        const interval = setInterval(load, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } catch { return '-'; }
    };

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
                        <Users className="h-4 w-4 text-green-500" />
                        Petugas Sedang Bertugas
                    </CardTitle>
                    <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                        {loading ? '...' : `${shifts.length} aktif`}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    </div>
                ) : shifts.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">Tidak ada petugas yang sedang bertugas</p>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {shifts.map(shift => (
                            <div key={shift.id_assignment} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
                                        {shift.petugas_name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{shift.petugas_name}</p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {shift.location_name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-right">
                                    <Badge variant={shift.mode === 'stand' ? 'default' : 'secondary'} className="text-xs">
                                        {shift.mode === 'stand' ? 'Stand' : 'Karnet'}
                                    </Badge>
                                    <div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 justify-end">
                                            <Clock className="h-3 w-3" />
                                            Sejak {formatTime(shift.started_at)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function RecentActivityCard({ transactions }: { transactions: Transaction[] }) {
    const formatDateTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('id-ID', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch { return 'Invalid Date'; }
    };

    const recentTransactions = transactions.slice(0, 10);

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Aktivitas Terakhir
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-500 w-[80px]">ID</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-500">Aktivitas</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-500">Pengguna</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-500">Tiket</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-500">Waktu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">Belum ada aktivitas</td>
                                </tr>
                            ) : (
                                recentTransactions.map((tx) => (
                                    <tr key={tx.id_transaction} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4 text-gray-400 text-xs font-mono">#{tx.id_transaction.toString().slice(-6)}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${tx.tickets_change > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                                                    {tx.type === 'bottle_exchange' ? (
                                                        <Recycle className={`h-4 w-4 ${tx.tickets_change > 0 ? 'text-green-600' : 'text-red-600'}`} />
                                                    ) : (
                                                        <Bus className={`h-4 w-4 ${tx.tickets_change > 0 ? 'text-green-600' : 'text-red-600'}`} />
                                                    )}
                                                </div>
                                                <p className="font-medium text-gray-800 text-sm truncate max-w-[200px]">{tx.description}</p>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">{tx.user_name}</td>
                                        <td className="py-3 px-4 text-right">
                                            <span className={`font-bold text-sm ${tx.tickets_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.tickets_change > 0 ? '+' : ''}{Math.abs(tx.tickets_change)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right text-gray-500 text-xs text-nowrap">{formatDateTime(tx.created_at)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}

export function OverviewTab({
    stats,
    bottleStats,
    transactions,
    users,
    statsFilter,
    setStatsFilter,
    userFilter,
    setUserFilter
}: OverviewTabProps) {
    const [bottleFilter, setBottleFilter] = useState('all');
    const bottleTransactions = filterTransactionsByPeriod(transactions, bottleFilter);

    return (
        <div className="space-y-6 pb-12">

            {/* Row 1: Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Pengguna</CardTitle>
                        <Users className="h-4 w-4 text-blue-500 opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                        <p className="text-xs text-gray-500 mt-1">{stats.totalPenumpang} penumpang · {stats.totalPetugas} petugas</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Tiket</CardTitle>
                        <Bus className="h-4 w-4 text-green-500 opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalTickets.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 mt-1">Tiket dalam sirkulasi</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Transaksi</CardTitle>
                        <BarChart className="h-4 w-4 text-purple-500 opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</div>
                        <p className="text-xs text-gray-500 mt-1">Selesai diproses</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Botol</CardTitle>
                        <Recycle className="h-4 w-4 text-orange-500 opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{bottleStats.total.toLocaleString()}</div>
                        <p className="text-xs text-gray-500 mt-1">Botol terkumpul</p>
                    </CardContent>
                </Card>
            </div>

            {/* Row 2: Grafik Statistik Botol (full width) */}
            <Card className="shadow-sm">
                <CardHeader className="border-b pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-bold text-gray-800">Statistik Botol</CardTitle>
                        <FilterSelect value={bottleFilter} onChange={setBottleFilter} />
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <BottleStatisticsChart
                        statsFilter={bottleFilter}
                        bottleStats={bottleStats}
                        transactions={bottleTransactions}
                    />
                </CardContent>
            </Card>

            {/* Row 3: Petugas Sedang Bertugas */}
            <ActiveShiftsCard />

            {/* Row 4: Aktivitas Terakhir */}
            <RecentActivityCard transactions={transactions} />

        </div>
    );
}

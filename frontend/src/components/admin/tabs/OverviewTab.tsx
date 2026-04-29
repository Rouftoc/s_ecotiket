import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Bus, Activity, MapPin, BarChart, Recycle, TrendingUp, Loader2, Clock } from 'lucide-react';
import BottleStatisticsChart from '@/components/admin/charts/BottleLineChart';
import RolePieChart from '@/components/admin/charts/RolePieChart';
import TicketCirculationChart from '@/components/admin/charts/TicketCirculationChart';
import { DashboardStats, BottleStats, Transaction, UserRecord } from '@/types/dashboard';
import TopUsersWidget from '@/components/admin/widgets/TopUsersWidget';
import TopLocationsWidget from '@/components/admin/widgets/TopLocationsWidget';
import { Badge } from '@/components/ui/badge';

interface OverviewTabProps {
    stats: DashboardStats;
    growthRate: number;
    growthLoading: boolean;
    bottleStats: BottleStats;
    transactions: Transaction[];
    users: UserRecord[];
    statsFilter: string;
    setStatsFilter: (val: string) => void;
    userFilter: string;
    setUserFilter: (val: string) => void;
}

function RecentActivityCard({ transactions }: { transactions: Transaction[] }) {
    const formatDateTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('id-ID', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch { return 'Invalid Date'; }
    };

    const getStatusBadge = (tickets_change: number) => {
        if (tickets_change > 0) return 'text-green-600 bg-green-50 border-green-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const recentTransactions = transactions.slice(0, 10);

    return (
        <Card className="shadow-sm border-gray-200">
            <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-800">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Aktivitas Terakhir
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-gray-500 w-[80px]">ID</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-500">Aktivitas</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-500">Pengguna</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-500">Nilai</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-500">Waktu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-400">
                                        Belum ada aktivitas
                                    </td>
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
                                                <div>
                                                    <p className="font-medium text-gray-800 text-sm truncate max-w-[200px]">{tx.description}</p>
                                                    <Badge variant="outline" className={`mt-1 text-[10px] px-1.5 font-normal ${getStatusBadge(tx.tickets_change)}`}>
                                                        {tx.tickets_change > 0 ? 'Masuk' : 'Keluar'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">{tx.user_name}</td>
                                        <td className="py-3 px-4 text-right">
                                            <p className={`font-bold text-sm ${tx.tickets_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.tickets_change > 0 ? '+' : ''}{Math.abs(tx.tickets_change)}
                                            </p>
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
    growthRate,
    growthLoading,
    bottleStats,
    transactions,
    users,
    statsFilter,
    setStatsFilter,
    userFilter,
    setUserFilter
}: OverviewTabProps) {

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
                        <p className="text-xs text-gray-500 mt-1">{stats.totalPenumpang} penumpang aktif</p>
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
                        <CardTitle className="text-sm font-medium text-gray-600">Pertumbuhan</CardTitle>
                        <TrendingUp className="h-4 w-4 text-orange-500 opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">
                            {growthLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            ) : (
                                <span>{growthRate >= 0 ? '+' : ''}{growthRate}%</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">vs Bulan Lalu</p>
                    </CardContent>
                </Card>
            </div>

            {/* Row 2: Charts & Eco Impact */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card className="h-full shadow-sm">
                        <CardHeader className="border-b pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-bold text-gray-800">Statistik Botol</CardTitle>
                                <Select value={statsFilter} onValueChange={setStatsFilter}>
                                    <SelectTrigger className="w-[120px] h-8 text-xs bg-gray-50 border-gray-200">
                                        <SelectValue placeholder="Period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="today">Hari Ini</SelectItem>
                                        <SelectItem value="month">Bulan Ini</SelectItem>
                                        <SelectItem value="year">Tahun Ini</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <BottleStatisticsChart
                                statsFilter={statsFilter}
                                bottleStats={bottleStats}
                                transactions={transactions}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6 flex flex-col h-full">
                    <Card className="h-full shadow-sm flex flex-col">
                        <CardHeader className="border-b pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                                    <Users className="h-5 w-5 text-yellow-500" />
                                    Top 5 Penumpang
                                </CardTitle>
                                <Select value={statsFilter} onValueChange={setStatsFilter}>
                                    <SelectTrigger className="w-[120px] h-8 text-xs bg-gray-50 border-gray-200">
                                        <SelectValue placeholder="Period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="today">Hari Ini</SelectItem>
                                        <SelectItem value="month">Bulan Ini</SelectItem>
                                        <SelectItem value="year">Tahun Ini</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 flex-1 overflow-auto">
                            <TopUsersWidget users={users} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Row 3: Detail Widgets */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="h-full">
                    <Card className="h-full shadow-sm flex flex-col">
                        <CardHeader className="border-b pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base font-bold text-gray-800 flex items-center gap-2">
                                    <Bus className="h-5 w-5 text-purple-500" />
                                    Sirkulasi Tiket
                                </CardTitle>
                                <Select value={statsFilter} onValueChange={setStatsFilter}>
                                    <SelectTrigger className="w-[120px] h-8 text-xs bg-gray-50 border-gray-200">
                                        <SelectValue placeholder="Period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="today">Hari Ini</SelectItem>
                                        <SelectItem value="month">Bulan Ini</SelectItem>
                                        <SelectItem value="year">Tahun Ini</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-[300px] pt-6">
                            <TicketCirculationChart transactions={transactions} />
                        </CardContent>
                    </Card>
                </div>
                <div className="h-full">
                    <TopLocationsWidget transactions={transactions} />
                </div>
            </div>

            {/* Row 4: Recent Activity */}
            <div>
                <RecentActivityCard transactions={transactions} />
            </div>
        </div>
    );
}
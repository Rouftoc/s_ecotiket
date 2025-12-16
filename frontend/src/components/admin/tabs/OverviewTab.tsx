import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Bus, Activity, MapPin, BarChart, Recycle, TrendingUp, Loader2, Trophy, Medal, Award, Clock } from 'lucide-react';
import BottleStatisticsChart from '@/components/BottleLineChart';
import RolePieChart from '@/components/RolePieChart';
import { DashboardStats, BottleStats, Transaction, UserRecord } from '@/types/dashboard';

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

interface TopUsersCardProps {
    users: UserRecord[];
}

function TopUsersCard({ users }: TopUsersCardProps) {
    const topUsers = users
        .filter(u => u.role === 'penumpang')
        .sort((a, b) => (b.ticketsBalance || 0) - (a.ticketsBalance || 0))
        .slice(0, 5);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return <Trophy className="h-4 w-4 text-yellow-500" />;
            case 1: return <Medal className="h-4 w-4 text-gray-400" />;
            case 2: return <Award className="h-4 w-4 text-amber-600" />;
            default: return <div className="h-4 w-4 flex items-center justify-center text-xs font-semibold text-gray-500">#{index + 1}</div>;
        }
    };

    const getRankBg = (index: number) => {
        switch (index) {
            case 0: return 'bg-yellow-50 border-yellow-200';
            case 1: return 'bg-gray-50 border-gray-200';
            case 2: return 'bg-amber-50 border-amber-200';
            default: return 'bg-white border-gray-200';
        }
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Top 5 Pengguna
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Pengguna dengan poin tertinggi</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {topUsers.length === 0 ? (
                        <p className="text-xs text-gray-500 text-center py-3">Belum ada data pengguna</p>
                    ) : (
                        topUsers.map((user, index) => (
                            <div
                                key={user.id}
                                className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all hover:shadow-sm ${getRankBg(index)}`}
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="flex-shrink-0 bg-white p-1 rounded-full shadow-sm">
                                        {getRankIcon(index)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-xs sm:text-sm truncate text-gray-800">
                                            {user.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 ml-2 text-right">
                                    <p className="font-bold text-green-600 text-sm">{user.ticketsBalance?.toLocaleString() || 0}</p>
                                    <p className="text-[10px] text-gray-400">Tiket</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

interface RecentActivityCardProps {
    transactions: Transaction[];
}

function RecentActivityCard({ transactions }: RecentActivityCardProps) {
    const formatDateTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString('id-ID', {
                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        } catch { return 'Invalid Date'; }
    };

    const getStatusBadge = (tickets_change: number) => {
        if (tickets_change > 0) return 'text-green-600 bg-green-100 border-green-200';
        return 'text-red-600 bg-red-100 border-red-200';
    };

    const recentTransactions = transactions.slice(0, 10);

    return (
        <Card className="lg:col-span-2 h-full flex flex-col">
            <CardHeader className="pb-4 border-b mb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Aktivitas Terakhir
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 sm:p-6">
                
                {/* Mobile View (Card List) */}
                <div className="block md:hidden">
                    {recentTransactions.length === 0 ? (
                        <p className="text-center py-8 text-gray-500 text-sm">Belum ada aktivitas</p>
                    ) : (
                        <div className="divide-y">
                            {recentTransactions.map((tx) => (
                                <div key={tx.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-full ${tx.tickets_change > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {tx.type === 'bottle_exchange' ? <Recycle className="h-3.5 w-3.5" /> : <Bus className="h-3.5 w-3.5" />}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {formatDateTime(tx.created_at)}
                                            </span>
                                        </div>
                                        <Badge variant="outline" className={`text-[10px] ${getStatusBadge(tx.tickets_change)}`}>
                                            {tx.tickets_change > 0 ? 'Masuk' : 'Keluar'}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex-1 mr-2">
                                            <p className="text-sm font-semibold text-gray-800 line-clamp-1">{tx.description}</p>
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{tx.user_name}</p>
                                        </div>
                                        <div className={`text-right font-bold ${tx.tickets_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {tx.tickets_change > 0 ? '+' : ''}{tx.tickets_change}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="text-left py-3 px-4 font-semibold text-gray-700 w-[80px]">ID</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Aktivitas</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Pengguna</th>
                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Poin</th>
                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Waktu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-gray-500">
                                        Belum ada aktivitas
                                    </td>
                                </tr>
                            ) : (
                                recentTransactions.map((tx) => (
                                    <tr key={tx.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 text-gray-500 text-xs font-mono">#{tx.id}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${tx.tickets_change > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                                    {tx.type === 'bottle_exchange' ? (
                                                        <Recycle className={`h-4 w-4 ${tx.tickets_change > 0 ? 'text-green-600' : 'text-red-600'}`} />
                                                    ) : (
                                                        <Bus className={`h-4 w-4 ${tx.tickets_change > 0 ? 'text-green-600' : 'text-red-600'}`} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 text-sm">{tx.description}</p>
                                                    <Badge variant="outline" className={`mt-1 text-[10px] h-5 px-1.5 ${getStatusBadge(tx.tickets_change)}`}>
                                                        {tx.tickets_change > 0 ? 'Penambahan' : 'Pengurangan'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">{tx.user_name}</td>
                                        <td className="py-3 px-4 text-right">
                                            <p className={`font-bold text-sm ${tx.tickets_change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {tx.tickets_change > 0 ? '+' : ''}{tx.tickets_change}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4 text-gray-500 text-xs">{formatDateTime(tx.created_at)}</td>
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
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">{stats.totalPenumpang} penumpang, {stats.totalPetugas} petugas</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tiket</CardTitle>
                        <Bus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTickets.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Saldo penumpang aktif</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pengguna Aktif</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeUsers}</div>
                        <p className="text-xs text-green-600">Status aktif</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Lokasi</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalLocations}</div>
                        <p className="text-xs text-green-600">{stats.activeLocations} aktif</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalTransactions}</div>
                        <p className="text-xs text-muted-foreground">Transaksi selesai</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Botol Ditukar</CardTitle>
                        <Recycle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalBottles}</div>
                        <p className="text-xs text-muted-foreground">Botol plastik</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pertumbuhan</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {growthLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            ) : (
                                <span>{growthRate >= 0 ? '+' : ''}{growthRate}%</span>
                            )}
                        </div>
                        <p className={`text-xs ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {growthRate >= 0 ? 'Peningkatan' : 'Penurunan'} bulan ini
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Select value={statsFilter} onValueChange={setStatsFilter}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Filter Waktu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Waktu</SelectItem>
                                    <SelectItem value="today">Hari Ini</SelectItem>
                                    <SelectItem value="month">Bulan Ini</SelectItem>
                                    <SelectItem value="year">Tahun Ini</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <BottleStatisticsChart
                            statsFilter={statsFilter}
                            bottleStats={bottleStats}
                            transactions={transactions}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Select value={userFilter} onValueChange={setUserFilter}>
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Status</SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <RolePieChart
                            users={users}
                            userFilter={userFilter}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 order-2 lg:order-1">
                    <RecentActivityCard transactions={transactions} />
                </div>
                <div className="order-1 lg:order-2">
                    <TopUsersCard users={users} />
                </div>
            </div>
        </div>
    );
}
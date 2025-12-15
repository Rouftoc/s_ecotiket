import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Bus, Activity, MapPin, BarChart, Recycle, TrendingUp, Loader2 } from 'lucide-react';
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

            <div className="grid lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">Statistik Botol</h2>
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
                    <BottleStatisticsChart
                        statsFilter={statsFilter}
                        bottleStats={bottleStats}
                        transactions={transactions}
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">Distribusi Pengguna</h2>
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
                    <RolePieChart
                        users={users}
                        userFilter={userFilter}
                    />
                </div>
            </div>
        </div>
    );
}
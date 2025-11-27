import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Search, Eye, Edit, Trash2, CreditCard, Mail, Award, Bus } from 'lucide-react';
import { UserRecord } from '@/types/dashboard';

interface UsersTabProps {
    users: UserRecord[];
    loading: boolean;
    filters: { search: string; role: string; status: string };
    setFilters: (filters: { search?: string; role?: string; status?: string }) => void;
    onAddUser: () => void;
    onViewUser: (user: UserRecord) => void;
    onEditUser: (user: UserRecord) => void;
    onDeleteUser: (id: number) => void;
}

export function UsersTab({
    users,
    loading,
    filters,
    setFilters,
    onAddUser,
    onViewUser,
    onEditUser,
    onDeleteUser
}: UsersTabProps) {

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'petugas': return 'bg-blue-100 text-blue-800';
            case 'penumpang': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'inactive': return 'bg-yellow-100 text-yellow-800';
            case 'suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />Manajemen Pengguna
                        </CardTitle>
                        <Button onClick={onAddUser}>
                            <UserPlus className="h-4 w-4 mr-2" />Tambah Pengguna
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Cari nama, email, atau NIK..."
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={filters.role} onValueChange={(val) => setFilters({ ...filters, role: val })}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Filter Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Role</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="petugas">Petugas</SelectItem>
                                <SelectItem value="penumpang">Penumpang</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filters.status} onValueChange={(val) => setFilters({ ...filters, status: val })}>
                            <SelectTrigger className="w-full sm:w-[180px]">
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

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pengguna</TableHead>
                                    <TableHead>Identitas</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Saldo/Poin</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Memuat data...</TableCell></TableRow>
                                ) : users.length === 0 ? (
                                    <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500">Tidak ada data pengguna</TableCell></TableRow>
                                ) : (
                                    users.map((userData) => (
                                        <TableRow key={userData.id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-semibold">{userData.name?.charAt(0) || '?'}</span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{userData.name}</div>
                                                        <div className="text-sm text-gray-500">{userData.phone || 'No phone'}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {userData.role === 'penumpang' ? (
                                                        <><CreditCard className="h-4 w-4 text-gray-400" /><span className="text-sm font-mono">{userData.nik || '-'}</span></>
                                                    ) : (
                                                        <><Mail className="h-4 w-4 text-gray-400" /><span className="text-sm">{userData.email || '-'}</span></>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge className={getRoleColor(userData.role)}>{userData.role}</Badge></TableCell>
                                            <TableCell><Badge className={getStatusColor(userData.status)}>{userData.status}</Badge></TableCell>
                                            <TableCell>
                                                {userData.role === 'penumpang' ? (
                                                    <div className="text-sm">
                                                        <div className="flex items-center gap-1"><Bus className="h-3 w-3" />{userData.ticketsBalance} tiket</div>
                                                        <div className="flex items-center gap-1 text-gray-500"><Award className="h-3 w-3" />{userData.points} poin</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => onViewUser(userData)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => onEditUser(userData)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    {userData.role !== 'admin' && (
                                                        <Button size="sm" variant="outline" onClick={() => onDeleteUser(userData.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
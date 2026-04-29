
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { usersAPI, authAPI, transactionsAPI } from '@/lib/api';
import { UserRecord, PetugasDetail, Transaction } from '@/types/dashboard';
import { UsersTab } from '@/components/admin/tabs/UsersTab';
import { UserDetailView } from '@/components/admin/views/UserDetailView';
import { PetugasDetailView } from '@/components/admin/views/PetugasDetailView';
import { AddUserForm, CreateUserFormData } from '@/components/admin/forms/AddUserForm';
import { EditUserForm, EditUserFormData } from '@/components/admin/forms/EditUserForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function UserManager() {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ search: '', role: 'all', status: 'all' });

    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
    const [selectedPetugas, setSelectedPetugas] = useState<PetugasDetail | null>(null);
    const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
    const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);

    const [isAddingUser, setIsAddingUser] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => loadUsers(), 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await usersAPI.getAllUsers({
                role: filters.role !== 'all' ? filters.role : undefined,
                status: filters.status !== 'all' ? filters.status : undefined,
                search: filters.search || undefined
            });
            setUsers((response.users as any[]) || []);
        } catch (error) {
            toast.error('Gagal memuat data pengguna');
        } finally {
            setLoading(false);
        }
    };

    const loadUserTransactions = async (userId: number) => {
        setIsTransactionsLoading(true);
        try {
            const response = await transactionsAPI.getTransactionsByUserId(userId);
            setUserTransactions((response.transactions as any[]) || []);
        } catch (error) {
            toast.error('Gagal memuat riwayat transaksi');
            setUserTransactions([]);
        } finally {
            setIsTransactionsLoading(false);
        }
    };

    const handleAddUser = async (data: CreateUserFormData) => {
        setSaving(true);
        try {
            const registerData = {
                name: data.name,
                role: data.role,
                password: data.password,
                email: data.role === 'petugas' ? data.email : undefined,
                nik: data.role === 'penumpang' ? data.nik : undefined,
                phone: data.phone,
                address: data.address
            };

            await authAPI.register(registerData);
            toast.success('Pengguna berhasil ditambahkan');
            setIsAddingUser(false);
            loadUsers();
        } catch (error) {
            toast.error((error as any).message || 'Gagal menambahkan pengguna');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateUser = async (data: EditUserFormData) => {
        if (!editingUser) return;
        setSaving(true);
        try {
            await usersAPI.updateUser(editingUser.id_user, data);
            toast.success('Data berhasil diupdate');
            loadUsers();
            setEditingUser(null);

            // Update detailed view if active
            const updatedData = { ...editingUser, ...data } as UserRecord;
            if (selectedUser?.id_user === editingUser.id_user) {
                setSelectedUser(updatedData);
            }
            if (selectedPetugas?.id_user === editingUser.id_user) {
                setSelectedPetugas(prev => prev ? ({ ...prev, ...data } as any) : null);
            }
        } catch (error) {
            toast.error('Gagal update data');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteUser = (id: number) => {
        Swal.fire({
            title: "Yakin hapus pengguna?",
            text: "Data tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                await usersAPI.deleteUser(id);
                toast.success('Pengguna dihapus');
                loadUsers();
                if (selectedUser?.id_user === id) setSelectedUser(null);
                if (selectedPetugas?.id_user === id) setSelectedPetugas(null);
            }
        });
    };

    const handleViewUser = (user: UserRecord) => {
        if (user.role === 'petugas') {
            const petugasDetail: PetugasDetail = { ...user, total_transactions: 0 };
            setSelectedPetugas(petugasDetail);
        } else {
            setSelectedUser(user);
        }
        loadUserTransactions(user.id_user);
    };

    const handleTransactionDeleted = () => {
        if (selectedUser) loadUserTransactions(selectedUser.id_user);
        if (selectedPetugas) loadUserTransactions(selectedPetugas.id_user);
        loadUsers();
    };

    // Helper for DetailViews to update user without the main form dialog mechanism (if they have inline edits)
    const handleUpdateFromDetail = async (id: number, data: Partial<UserRecord>) => {
        try {
            await usersAPI.updateUser(id, data);
            toast.success('Data berhasil diupdate');
            loadUsers(); // Refresh list

            // Refetch detail data
            if (selectedUser?.id_user === id) {
                setSelectedUser({ ...selectedUser, ...data } as UserRecord);
            }
            if (selectedPetugas?.id_user === id) {
                setSelectedPetugas(prev => prev ? ({ ...prev, ...data } as any) : null);
            }
        } catch (error) {
            toast.error('Gagal update data');
        }
    };

    if (selectedUser) {
        return (
            <UserDetailView
                user={selectedUser}
                transactions={userTransactions}
                isTransactionsLoading={isTransactionsLoading}
                onBack={() => setSelectedUser(null)}
                onDelete={handleDeleteUser}
                onUpdate={(id, data) => handleUpdateFromDetail(id, data)}
                currentUserRole="admin"
                onTransactionDeleted={handleTransactionDeleted}
            />
        );
    }

    if (selectedPetugas) {
        return (
            <PetugasDetailView
                petugas={selectedPetugas}
                transactions={userTransactions}
                isTransactionsLoading={isTransactionsLoading}
                onBack={() => setSelectedPetugas(null)}
                onEdit={(p) => setEditingUser(p as any)}
                onDelete={handleDeleteUser}
                currentUserRole="admin"
                onTransactionDeleted={handleTransactionDeleted}
            />
        );
    }

    return (
        <>
            <UsersTab
                users={users}
                loading={loading}
                filters={filters}
                setFilters={(f) => setFilters({ ...filters, ...f })}
                onAddUser={() => setIsAddingUser(true)}
                onViewUser={handleViewUser}
                onEditUser={setEditingUser}
                onDeleteUser={handleDeleteUser}
            />

            {/* Add User Dialog */}
            <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Pengguna</DialogTitle>
                        <DialogDescription>Isi form berikut.</DialogDescription>
                    </DialogHeader>
                    <AddUserForm
                        isSaving={saving}
                        onSubmit={handleAddUser}
                        onCancel={() => setIsAddingUser(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                        <DialogDescription>Update data pengguna</DialogDescription>
                    </DialogHeader>
                    {editingUser && (
                        <EditUserForm
                            userData={editingUser}
                            isSaving={saving}
                            onSave={handleUpdateUser}
                            onCancel={() => setEditingUser(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

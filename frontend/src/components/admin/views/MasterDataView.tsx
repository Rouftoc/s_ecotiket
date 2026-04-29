import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, Loader2, Edit, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { BottleRateForm, BottleRateFormData } from '@/components/admin/forms/BottleRateForm';

interface BottleRate {
    id_bottle_rate: number;
    bottle_type: string;
    bottles_required: number;
    tickets_earned: number;
    points_earned: number;
    updated_at: string;
}

export default function MasterDataView() {
    const [rates, setRates] = useState<BottleRate[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingRate, setEditingRate] = useState<BottleRate | null>(null); // Null means creating if dialog is open
    const [saving, setSaving] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/bottle-rates');
            if (response.ok) {
                const data = await response.json();
                setRates(data);
            }
        } catch (error) {
            console.error('Failed to fetch rates', error);
            toast.error('Gagal mengambil data botol');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setIsCreating(true);
        setEditingRate(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (rate: BottleRate) => {
        setIsCreating(false);
        setEditingRate(rate);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus jenis botol ini?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/bottle-rates/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setRates(rates.filter(r => r.id_bottle_rate !== id));
                toast.success('Jenis botol berhasil dihapus');
            } else {
                throw new Error('Failed delete');
            }
        } catch (error) {
            toast.error('Gagal menghapus data');
        }
    };

    const handleSave = async (data: BottleRateFormData) => {
        setSaving(true);
        try {
            const url = isCreating
                ? 'http://localhost:5000/api/bottle-rates'
                : `http://localhost:5000/api/bottle-rates/${editingRate?.id_bottle_rate}`;

            const method = isCreating ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const savedRate = await response.json();
                if (isCreating) {
                    setRates([...rates, savedRate]);
                    toast.success('Jenis botol berhasil ditambahkan');
                } else {
                    setRates(rates.map(r => r.id_bottle_rate === savedRate.id_bottle_rate ? savedRate : r));
                    toast.success('Data berhasil disimpan');
                }
                setIsDialogOpen(false);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save');
            }
        } catch (error: any) {
            toast.error(error.message || 'Gagal menyimpan data');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3 md:pb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Data Master
                            </CardTitle>
                        </div>
                        <Button onClick={handleAdd} className="bg-black hover:bg-gray-800 text-white self-start md:self-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Jenis Botol
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Jenis Botol</TableHead>
                                        <TableHead className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Jumlah Botol</TableHead>
                                        <TableHead className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Tiket Didapat</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Terakhir Diupdate</TableHead>
                                        <TableHead className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rates.map((rate) => (
                                        <TableRow key={rate.id_bottle_rate}>
                                            <TableCell className="text-sm font-medium text-gray-900 capitalize">
                                                {rate.bottle_type}
                                            </TableCell>
                                            <TableCell className="text-center font-mono text-base">
                                                {rate.bottles_required}
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-green-600">
                                                {rate.tickets_earned} Tiket
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-500">
                                                {new Date(rate.updated_at).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(rate)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDelete(rate.id_bottle_rate)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {rates.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                                Belum ada data botol. Silakan tambah data baru.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isCreating ? 'Tambah Jenis Botol' : 'Edit Konfigurasi Botol'}</DialogTitle>
                        <DialogDescription>
                            {isCreating
                                ? 'Tambahkan jenis botol baru dan atur nilai tukarnya.'
                                : `Ubah nilai tukar untuk botol jenis ${editingRate?.bottle_type}.`
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <BottleRateForm
                        initialData={editingRate}
                        isCreating={isCreating}
                        isSaving={saving}
                        onSave={handleSave}
                        onCancel={() => setIsDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

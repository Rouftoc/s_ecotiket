import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, MapPin, Building, Search, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { locationsAPI } from '@/lib/api';

interface Location {
  id: number;
  name: string;
  address: string;
  type: 'terminal' | 'koridor' | 'stand';
  coordinates?: string;
  description?: string;
  capacity?: number;
  operating_hours?: string;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

const LocationManager = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'terminal' as 'terminal' | 'koridor' | 'stand',
    coordinates: '',
    description: '',
    capacity: 0,
    operating_hours: '',
    status: 'active' as 'active' | 'inactive' | 'maintenance'
  });

  const loadLocations = async () => {
    try {
      setLoading(true);
      const response = await locationsAPI.getAllLocations({
        search: searchTerm || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      
      if (response.success) {
        setLocations(response.locations || []);
      } else {
        toast.error(response.error || 'Gagal memuat data lokasi');
        setLocations([]);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
      toast.error('Gagal memuat data lokasi');
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, [searchTerm, typeFilter, statusFilter]);

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.address) {
        toast.error('Nama dan alamat lokasi harus diisi');
        return;
      }

      if (editingLocation) {
        await locationsAPI.updateLocation(editingLocation.id, formData);
        toast.success('Lokasi berhasil diperbarui');
      } else {
        await locationsAPI.createLocation(formData);
        toast.success('Lokasi berhasil ditambahkan');
      }

      resetForm();
      await loadLocations();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error('Gagal menyimpan lokasi');
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      type: location.type,
      coordinates: location.coordinates || '',
      description: location.description || '',
      capacity: location.capacity || 0,
      operating_hours: location.operating_hours || '',
      status: location.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Hapus Lokasi?",
      text: "Lokasi akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await locationsAPI.deleteLocation(id);
          toast.success('Lokasi berhasil dihapus');
          await loadLocations();
        } catch (error) {
          toast.error('Gagal menghapus lokasi');
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      type: 'terminal',
      coordinates: '',
      description: '',
      capacity: 0,
      operating_hours: '',
      status: 'active'
    });
    setEditingLocation(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'terminal': return 'bg-blue-100 text-blue-800';
      case 'koridor': return 'bg-green-100 text-green-800';
      case 'stand': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'terminal': return 'Terminal';
      case 'koridor': return 'Koridor';
      case 'stand': return 'Stand';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'inactive': return 'Tidak Aktif';
      case 'maintenance': return 'Maintenance';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Manajemen Lokasi
              </CardTitle>
              <CardDescription>
                Kelola terminal, halte, dan stasiun di sistem Eco-Tiket
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadLocations}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Lokasi
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingLocation ? 'Edit Lokasi' : 'Tambah Lokasi Baru'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingLocation ? 'Update informasi lokasi' : 'Tambahkan terminal, halte, atau stasiun baru'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nama Lokasi *</Label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Terminal Antasari"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Tipe Lokasi *</Label>
                        <Select 
                          value={formData.type} 
                          onValueChange={(value: 'terminal' | 'koridor' | 'stand') => 
                            setFormData({...formData, type: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Tipe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="terminal">Terminal</SelectItem>
                            <SelectItem value="koridor">Koridor</SelectItem>
                            <SelectItem value="stand">Stand</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Alamat *</Label>
                      <Textarea
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Jl. Flamboyan No. 1, Palangkaraya"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Deskripsi</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        placeholder="Deskripsi lokasi..."
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Kapasitas</Label>
                        <Input
                          type="number"
                          value={formData.capacity}
                          onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                          placeholder="100"
                          min="0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Jam Operasional</Label>
                        <Input
                          value={formData.operating_hours}
                          onChange={(e) => setFormData({...formData, operating_hours: e.target.value})}
                          placeholder="06:00-22:00"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select 
                          value={formData.status} 
                          onValueChange={(value: 'active' | 'inactive' | 'maintenance') => 
                            setFormData({...formData, status: value})
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Aktif</SelectItem>
                            <SelectItem value="inactive">Tidak Aktif</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Koordinat GPS</Label>
                      <Input
                        value={formData.coordinates}
                        onChange={(e) => setFormData({...formData, coordinates: e.target.value})}
                        placeholder="-2.2180,113.9120"
                      />
                    </div>

                    <Button onClick={handleSubmit} className="w-full">
                      {editingLocation ? 'Update Lokasi' : 'Tambah Lokasi'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari nama atau alamat lokasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="terminal">Terminal</SelectItem>
                <SelectItem value="koridor">Koridor</SelectItem>
                <SelectItem value="stand">Stand</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Locations Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Lokasi</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kapasitas</TableHead>
                  <TableHead>Jam Operasional</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Memuat data lokasi...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : locations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {searchTerm || typeFilter !== 'all' || statusFilter !== 'all' 
                        ? 'Tidak ada lokasi yang sesuai dengan filter' 
                        : 'Belum ada lokasi terdaftar'
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  locations.map((location) => (
                    <TableRow key={location.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{location.name}</div>
                            <div className="text-sm text-gray-500">{formatDate(location.created_at)}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={location.address}>
                          {location.address}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(location.type)}>
                          {getTypeLabel(location.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(location.status)}>
                          {getStatusLabel(location.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {location.capacity ? `${location.capacity} orang` : '-'}
                      </TableCell>
                      <TableCell>
                        {location.operating_hours || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(location)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(location.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
};

export default LocationManager;
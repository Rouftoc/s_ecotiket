import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { locationsAPI } from '@/lib/api';
import { Location } from '@/types/dashboard';
import { LocationsTab } from '@/components/admin/tabs/LocationsTab';
import { CreateLocation, CreateLocationData } from '@/components/admin/forms/locations/CreateLocation';
import { EditLocation, EditLocationData } from '@/components/admin/forms/locations/EditLocation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function LocationManager() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddingLocation, setIsAddingLocation] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(null);

    useEffect(() => {
        loadLocations();
    }, []);

    const loadLocations = async () => {
        try {
            setLoading(true);
            const response = await locationsAPI.getAllLocations();
            const apiLocations = (response.locations as any[]) || [];
            setLocations(apiLocations);
        } catch (error) {
            console.error('Failed to load locations from API:', error);
            toast.error('Gagal memuat data lokasi');
            setLocations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLocation = async (data: CreateLocationData) => {
        try {
            await locationsAPI.createLocation(data as any);
            toast.success('Lokasi ditambahkan');
            setIsAddingLocation(false);
            loadLocations();
        } catch (error) {
            toast.error('Gagal tambah lokasi');
        }
    };

    const handleUpdateLocation = async (data: EditLocationData) => {
        if (!editingLocation) return;
        try {
            await locationsAPI.updateLocation(editingLocation.id_location, data as any);
            toast.success('Lokasi diupdate');
            setEditingLocation(null);
            loadLocations();
        } catch (error) {
            toast.error(`Gagal update lokasi: ${(error as Error).message}`);
        }
    };

    const handleDeleteLocation = (id: number) => {
        Swal.fire({
            title: "Hapus Lokasi?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Ya, Hapus",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await locationsAPI.deleteLocation(id);
                    toast.success('Lokasi dihapus');
                    loadLocations();
                } catch (error) {
                    toast.error('Gagal menghapus lokasi');
                }
            }
        });
    };

    return (
        <>
            <LocationsTab
                locations={locations}
                loading={loading}
                onAddLocation={() => setIsAddingLocation(true)}
                onEditLocation={setEditingLocation}
                onDeleteLocation={handleDeleteLocation}
            />

            {/* Add Dialog */}
            <Dialog open={isAddingLocation} onOpenChange={setIsAddingLocation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Lokasi</DialogTitle>
                    </DialogHeader>
                    <CreateLocation
                        onSubmit={handleAddLocation}
                        onCancel={() => setIsAddingLocation(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={!!editingLocation} onOpenChange={(open) => !open && setEditingLocation(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Lokasi</DialogTitle>
                    </DialogHeader>
                    {editingLocation && (
                        <EditLocation
                            key={editingLocation.id_location}
                            location={editingLocation}
                            onSubmit={handleUpdateLocation}
                            onCancel={() => setEditingLocation(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

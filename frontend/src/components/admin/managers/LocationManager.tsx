import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { locationsAPI } from '@/lib/api';
import { Location } from '@/types/dashboard';
import { LocationsTab } from '@/components/admin/tabs/LocationsTab';
import { LocationForm } from '@/components/admin/forms/LocationForm';
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

    const handleAddLocation = async (data: Omit<Location, 'id_location'>) => {
        try {
            await locationsAPI.createLocation(data as any);
            toast.success('Lokasi ditambahkan');
            setIsAddingLocation(false);
            loadLocations();
        } catch (error) {
            toast.error('Gagal tambah lokasi');
        }
    };

    const handleUpdateLocation = async (data: Location) => {
        try {
            console.log('Updating location:', data);
            await locationsAPI.updateLocation(data.id_location, data as any);
            toast.success('Lokasi diupdate');
            setEditingLocation(null);
            loadLocations();
        } catch (error) {
            console.error('Update error:', error);
            toast.error(`Gagal update lokasi: ${(error as Error).message}`);
        }
    };

    const handleDeleteLocation = (id: number) => {
        Swal.fire({
            title: "Hapus Lokasi?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Ya",
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
                    <LocationForm
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
                        <LocationForm
                            location={editingLocation}
                            onSubmit={(data) => handleUpdateLocation({ ...editingLocation, ...data })}
                            onCancel={() => setEditingLocation(null)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

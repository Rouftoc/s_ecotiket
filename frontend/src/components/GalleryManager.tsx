import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Images, Plus, Edit, Trash2, Upload, Eye } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: 'campaign' | 'event' | 'education' | 'achievement';
  created_at: string;
  status: 'active' | 'inactive';
}

type CategoryType = 'campaign' | 'event' | 'education' | 'achievement';

const GalleryManager = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'campaign' as CategoryType,
    imageUrl: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData({
        ...formData,
        imageUrl: previewUrl
      });
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      showToast('Judul dan deskripsi harus diisi', 'error');
      return;
    }

    if (editingItem) {
      setGalleryItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ));
      showToast('Item galeri berhasil diperbarui');
    } else {
      const newItem: GalleryItem = {
        id: Date.now(),
        ...formData,
        imageUrl: formData.imageUrl || `https://via.placeholder.com/400x300/22c55e/ffffff?text=${encodeURIComponent(formData.title)}`,
        status: 'active',
        created_at: new Date().toISOString()
      };
      setGalleryItems(prev => [newItem, ...prev]);
      showToast('Item galeri berhasil ditambahkan');
    }

    setFormData({
      title: '',
      description: '',
      category: 'campaign',
      imageUrl: ''
    });
    setSelectedFile(null);
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      imageUrl: item.imageUrl
    });
    setSelectedFile(null); 
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
    showToast('Item galeri berhasil dihapus');
  };

  const toggleStatus = (id: number) => {
    setGalleryItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'active' ? 'inactive' : 'active' }
        : item
    ));
    showToast('Status item berhasil diubah');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'campaign': return 'bg-green-100 text-green-800';
      case 'event': return 'bg-purple-100 text-purple-800';
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'achievement': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'campaign': return 'Kampanye';
      case 'event': return 'Event';
      case 'education': return 'Edukasi';
      case 'achievement': return 'Pencapaian';
      default: return category;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData, 
      category: value as CategoryType
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Images className="h-5 w-5 mr-2" />
                Manajemen Galeri
              </CardTitle>
              <CardDescription>
                Kelola foto dan dokumentasi kegiatan eCOTiket
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Item Galeri' : 'Tambah Item Galeri'}
                  </DialogTitle>
                  <DialogDescription>
                    Isi form di bawah untuk menambah atau mengedit item galeri
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Judul</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Masukkan judul"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Deskripsi</Label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Masukkan deskripsi"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Pilih Gambar</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="file:mr-2 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Pilih
                      </Button>
                    </div>
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Kategori</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="campaign">Kampanye</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="education">Edukasi</SelectItem>
                        <SelectItem value="achievement">Pencapaian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={handleSubmit} className="w-full">
                    {editingItem ? 'Perbarui Item' : 'Tambah Item'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {galleryItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Belum ada galeri.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/400x300/22c55e/ffffff?text=${encodeURIComponent(item.title)}`;
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                      <span>{formatDate(item.created_at)}</span>
                      <span className={`px-2 py-1 rounded ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleStatus(item.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

export default GalleryManager;
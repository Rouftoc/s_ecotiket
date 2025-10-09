import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Megaphone, 
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  target: 'all' | 'penumpang' | 'petugas';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_active: boolean;
  created_at: string;
  created_by_name: string;
  expiry_date?: string;
}

type AnnouncementFormData = Omit<Announcement, 'id' | 'is_active' | 'created_at' | 'created_by_name'>;

const initialFormData: AnnouncementFormData = {
  title: '',
  content: '',
  type: 'info',
  target: 'all',
  priority: 'normal',
  expiry_date: ''
};

export default function AnnouncementManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState<AnnouncementFormData>(initialFormData);

  const handleDialogOpenChange = (isOpen: boolean) => {
    setDialogOpen(isOpen);
    if (!isOpen) {
      setEditingAnnouncement(null);
      setFormData(initialFormData);
    }
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.content) {
      toast.error('Judul dan konten wajib diisi');
      return;
    }

    if (editingAnnouncement) {
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === editingAnnouncement.id 
            ? { ...ann, ...formData, expiry_date: formData.expiry_date || undefined } 
            : ann
        )
      );
      toast.success('Pengumuman berhasil diperbarui');
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now(),
        ...formData,
        is_active: true,
        created_at: new Date().toISOString(),
        created_by_name: 'Admin System',
        expiry_date: formData.expiry_date || undefined
      };
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      toast.success('Pengumuman berhasil dibuat');
    }

    handleDialogOpenChange(false); // Tutup dialog dan reset form
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      target: announcement.target,
      priority: announcement.priority,
      expiry_date: announcement.expiry_date || ''
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Hapus Pengumuman?',
      text: 'Tindakan ini tidak dapat dibatalkan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        setAnnouncements(prev => prev.filter(ann => ann.id !== id));
        toast.success('Pengumuman berhasil dihapus');
      }
    });
  };

  const toggleActive = (id: number) => {
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === id ? { ...ann, is_active: !ann.is_active } : ann
      )
    );
    toast.success('Status pengumuman berhasil diubah');
  };
  
  const getTypeIcon = (type: Announcement['type']) => ({
    'success': <CheckCircle className="h-4 w-4" />,
    'warning': <AlertTriangle className="h-4 w-4" />,
    'urgent': <AlertCircle className="h-4 w-4" />,
    'info': <Info className="h-4 w-4" />,
  }[type]);

  const getTypeColor = (type: Announcement['type']) => ({
    'success': 'bg-green-100 text-green-800',
    'warning': 'bg-yellow-100 text-yellow-800',
    'urgent': 'bg-red-100 text-red-800',
    'info': 'bg-blue-100 text-blue-800',
  }[type]);

  const getPriorityColor = (priority: Announcement['priority']) => ({
    'urgent': 'bg-red-100 text-red-800',
    'high': 'bg-orange-100 text-orange-800',
    'normal': 'bg-blue-100 text-blue-800',
    'low': 'bg-gray-100 text-gray-800',
  }[priority]);

  const getTargetIcon = (target: Announcement['target']) => ({
    'penumpang': '👥',
    'petugas': '👨‍💼',
    'all': '🌐',
  }[target]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center"><Megaphone className="h-5 w-5 mr-2" />Manajemen Pengumuman</CardTitle>
              <CardDescription>Kelola pengumuman untuk pengguna sistem Eco-Tiket</CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Tambah Pengumuman</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingAnnouncement ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Judul Pengumuman *</Label>
                    <Input value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Konten Pengumuman *</Label>
                    <Textarea value={formData.content} onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))} rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tipe</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Announcement['type'] }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Target</Label>
                      <Select 
                        value={formData.target} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, target: value as Announcement['target'] }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Pengguna</SelectItem>
                          <SelectItem value="penumpang">Penumpang</SelectItem>
                          <SelectItem value="petugas">Petugas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                      <Label>Prioritas</Label>
                      <Select 
                        value={formData.priority} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as Announcement['priority'] }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Rendah</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">Tinggi</SelectItem>
                          <SelectItem value="urgent">Mendesak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Kadaluarsa (Opsional)</Label>
                      <Input type="date" value={formData.expiry_date} onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleSubmit} className="flex-1">{editingAnnouncement ? 'Perbarui' : 'Buat'}</Button>
                    <Button variant="outline" onClick={() => handleDialogOpenChange(false)} className="flex-1">Batal</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Belum ada pengumuman.</p>
              </div>
            ) : (
              announcements.map((ann) => (
                <Card key={ann.id} className={`${ann.is_active ? '' : 'opacity-60'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center space-x-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-semibold">{ann.title}</h3>
                          <Badge className={getTypeColor(ann.type)}><div className="flex items-center space-x-1">{getTypeIcon(ann.type)}<span>{ann.type}</span></div></Badge>
                          <Badge className={getPriorityColor(ann.priority)} variant="outline">{ann.priority}</Badge>
                          <Badge variant="outline">{getTargetIcon(ann.target)} {ann.target}</Badge>
                        </div>
                        <p className="text-gray-700 mb-4">{ann.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 flex-wrap">
                          <div className="flex items-center"><Calendar className="h-4 w-4 mr-1" />{new Date(ann.created_at).toLocaleDateString('id-ID')}</div>
                          <div className="flex items-center"><Users className="h-4 w-4 mr-1" />{ann.created_by_name}</div>
                          {ann.expiry_date && (<div className="flex items-center text-orange-600"><AlertCircle className="h-4 w-4 mr-1" />Berakhir: {new Date(ann.expiry_date).toLocaleDateString('id-ID')}</div>)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant={ann.is_active ? "default" : "outline"} onClick={() => toggleActive(ann.id)}>{ann.is_active ? 'Aktif' : 'Nonaktif'}</Button>
                        <Button size="icon" variant="outline" onClick={() => handleEdit(ann)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="outline" onClick={() => handleDelete(ann.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
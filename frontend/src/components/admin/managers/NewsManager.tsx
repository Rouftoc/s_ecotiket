import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Newspaper, Loader2, Plus, Edit, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { newsAPI } from '@/lib/api/news';
import { NewsItem } from '@/types/dashboard';
import { CreateNews, CreateNewsData } from '@/components/admin/forms/news/CreateNews';
import { EditNews, EditNewsData } from '@/components/admin/forms/news/EditNews';

export default function NewsManager() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const data = await newsAPI.getAllNews();
            setNews(data);
        } catch (error) {
            console.error('Failed to fetch news:', error);
            toast.error('Gagal mengambil data berita');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredNews = news.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenDialog = (item?: NewsItem) => {
        setSelectedNews(item || null);
        setIsDialogOpen(true);
    };

    const handleSave = async (formData: CreateNewsData | EditNewsData) => {
        if (!formData.title || !formData.content) {
            toast.error('Judul dan konten wajib diisi');
            return;
        }

        setSaving(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('content', formData.content);
            data.append('is_featured', String(formData.is_featured));
            if (formData.image) {
                data.append('image', formData.image);
            }

            if (selectedNews) {
                await newsAPI.updateNews(selectedNews.id_news, data);
                toast.success('Berita berhasil diperbarui');
            } else {
                await newsAPI.createNews(data);
                toast.success('Berita berhasil ditambahkan');
            }
            fetchNews();
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Gagal menyimpan berita');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (newsItem: NewsItem) => {
        Swal.fire({
            title: "Hapus Berita?",
            text: `Apakah Anda yakin ingin menghapus berita "${newsItem.title}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#1f2937",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await newsAPI.deleteNews(newsItem.id_news);
                    Swal.fire({
                        title: "Terhapus!",
                        text: "Berita berhasil dihapus.",
                        icon: "success"
                    });
                    fetchNews();
                } catch (error) {
                    console.error("Delete error:", error);
                    Swal.fire({
                        title: "Gagal!",
                        text: "Terjadi kesalahan saat menghapus berita.",
                        icon: "error"
                    });
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="pb-3 md:pb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Newspaper className="h-5 w-5" />
                                Manajemen Berita
                            </CardTitle>
                        </div>
                        <Button onClick={() => handleOpenDialog()} className="bg-black hover:bg-gray-800 self-start md:self-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Berita
                        </Button>
                    </div>
                    <div className="flex items-center space-x-2 mt-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Cari berita..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                    ) : filteredNews.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>Belum ada berita yang ditambahkan</p>
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Gambar</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul</TableHead>
                                        <TableHead className="hidden md:table-cell text-xs font-semibold text-gray-500 uppercase tracking-wider">Konten Singkat</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</TableHead>
                                        <TableHead className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredNews.map((item) => (
                                        <TableRow key={item.id_news} className="hover:bg-gray-50/50">
                                            <TableCell>
                                                {item.image ? (
                                                    <img
                                                        src={`http://localhost:5000/uploads/news/${item.image}`}
                                                        alt={item.title}
                                                        className="h-10 w-16 object-cover rounded-md border"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 border">
                                                        <ImageIcon className="h-5 w-5" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-gray-900 max-w-[200px] truncate" title={item.title}>
                                                {item.title}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell max-w-[300px] truncate text-gray-500">
                                                {item.content}
                                            </TableCell>
                                            <TableCell>
                                                {Boolean(item.is_featured) ? (
                                                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">Featured</Badge>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-gray-500">
                                                {new Date(item.created_at).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="outline" onClick={() => handleOpenDialog(item)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDelete(item)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedNews ? 'Edit Berita' : 'Tambah Berita Baru'}</DialogTitle>
                        <DialogDescription>
                            Isi formulir di bawah ini untuk {selectedNews ? 'mengubah' : 'menambahkan'} berita.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedNews ? (
                        <EditNews
                            initialData={selectedNews}
                            isSaving={saving}
                            onSave={handleSave}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    ) : (
                        <CreateNews
                            isSaving={saving}
                            onSave={handleSave}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}



import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { NewsItem } from '@/types/dashboard';

export interface NewsFormData {
    title: string;
    content: string;
    is_featured: boolean;
    image: File | null;
}

interface NewsFormProps {
    initialData?: NewsItem | null;
    isCreating: boolean;
    isSaving: boolean;
    onSave: (data: NewsFormData) => void;
    onCancel: () => void;
}

export function NewsForm({
    initialData,
    isCreating,
    isSaving,
    onSave,
    onCancel
}: NewsFormProps) {
    const [formData, setFormData] = useState<NewsFormData>({
        title: '',
        content: '',
        is_featured: false,
        image: null
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                content: initialData.content,
                is_featured: initialData.is_featured || false,
                image: null // Reset image input on edit
            });
        } else {
            setFormData({
                title: '',
                content: '',
                is_featured: false,
                image: null
            });
        }
    }, [initialData]);

    const handleSubmit = () => {
        onSave(formData);
    };

    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="title">Judul Berita</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Masukkan judul berita..."
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="content">Konten Berita</Label>
                <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Tulis isi berita di sini..."
                    className="min-h-[200px]"
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="image">Gambar Utama</Label>
                <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })}
                />
                {!isCreating && initialData?.image && !formData.image && (
                    <p className="text-sm text-gray-500">
                        Gambar saat ini: {initialData.image}
                    </p>
                )}
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked as boolean })}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                    Jadikan Featured (Tampil di Hero Section)
                </Label>
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={onCancel} disabled={isSaving}>
                    Batal
                </Button>
                <Button onClick={handleSubmit} disabled={isSaving} className="bg-black hover:bg-gray-800">
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        isCreating ? 'Terbitkan Berita' : 'Simpan Perubahan'
                    )}
                </Button>
            </DialogFooter>
        </div>
    );
}

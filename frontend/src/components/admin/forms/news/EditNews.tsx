import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import { NewsItem } from '@/types/dashboard';

export interface EditNewsData {
    title: string;
    content: string;
    is_featured: boolean;
    image: File | null;
}

interface EditNewsProps {
    initialData: NewsItem;
    isSaving: boolean;
    onSave: (data: EditNewsData) => void;
    onCancel: () => void;
}

export function EditNews({ initialData, isSaving, onSave, onCancel }: EditNewsProps) {
    const [formData, setFormData] = useState<EditNewsData>({
        title: '', content: '', is_featured: false, image: null
    });

    useEffect(() => {
        setFormData({
            title: initialData.title,
            content: initialData.content,
            is_featured: initialData.is_featured || false,
            image: null
        });
    }, [initialData]);

    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label>Judul Berita</Label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="grid gap-2">
                <Label>Konten Berita</Label>
                <Textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="min-h-[100px]" />
            </div>
            <div className="grid gap-2">
                <Label>Gambar Utama</Label>
                <div className="flex items-center gap-3">
                    {initialData.image && !formData.image && (
                        <img
                            src={`http://localhost:5000/uploads/news/${initialData.image}`}
                            alt="Gambar saat ini"
                            className="w-16 h-16 object-cover rounded-md border shrink-0"
                        />
                    )}
                    <div className="flex-1">
                        <Input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image: e.target.files?.[0] ?? null })} />
                        <p className="text-xs text-gray-400 mt-1">Biarkan kosong jika tidak ingin mengganti gambar</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="featured" checked={formData.is_featured} onCheckedChange={v => setFormData({ ...formData, is_featured: v as boolean })} />
                <Label htmlFor="featured" className="cursor-pointer">Jadikan Featured (Tampil di Hero Section)</Label>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel} disabled={isSaving}>Batal</Button>
                <Button onClick={() => onSave(formData)} disabled={isSaving} className="bg-black hover:bg-gray-800">
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : 'Simpan Perubahan'}
                </Button>
            </DialogFooter>
        </div>
    );
}

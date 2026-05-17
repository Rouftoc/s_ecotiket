import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';

export interface CreateNewsData {
    title: string;
    content: string;
    is_featured: boolean;
    image: File | null;
}

interface CreateNewsProps {
    isSaving: boolean;
    onSave: (data: CreateNewsData) => void;
    onCancel: () => void;
}

export function CreateNews({ isSaving, onSave, onCancel }: CreateNewsProps) {
    const [formData, setFormData] = useState<CreateNewsData>({
        title: '', content: '', is_featured: false, image: null
    });

    return (
        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label>Judul Berita</Label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Masukkan judul berita..." />
            </div>
            <div className="grid gap-2">
                <Label>Konten Berita</Label>
                <Textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="Tulis isi berita di sini..." className="min-h-[100px]" />
            </div>
            <div className="grid gap-2">
                <Label>Gambar Utama</Label>
                <Input type="file" accept="image/*" onChange={e => setFormData({ ...formData, image: e.target.files?.[0] ?? null })} />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="featured" checked={formData.is_featured} onCheckedChange={v => setFormData({ ...formData, is_featured: v as boolean })} />
                <Label htmlFor="featured" className="cursor-pointer">Jadikan Featured (Tampil di Hero Section)</Label>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={onCancel} disabled={isSaving}>Batal</Button>
                <Button onClick={() => onSave(formData)} disabled={isSaving} className="bg-black hover:bg-gray-800">
                    {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : 'Terbitkan Berita'}
                </Button>
            </DialogFooter>
        </div>
    );
}

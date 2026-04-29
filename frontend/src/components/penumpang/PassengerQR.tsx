import { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QrCode, Download } from 'lucide-react';
import QRGenerator from '@/components/common/qr/QRGenerator';
import { toast } from 'sonner';
import ecotiketLogo from '@/assets/logo-eco.png';

interface PassengerQRProps {
    qrCode: string;
    userName: string;
}

export default function PassengerQR({ qrCode, userName }: PassengerQRProps) {
    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownloadQR = () => {
        if (!qrRef.current) return;
        try {
            const canvas = qrRef.current.querySelector('canvas');
            if (!canvas) {
                toast.error('QR Code tidak ditemukan');
                return;
            }
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `qr-code-${userName || 'penumpang'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('QR Code berhasil diunduh');
        } catch (error: any) {
            toast.error('Gagal mengunduh QR Code: ' + error.message);
        }
    };

    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                    <QrCode className="h-6 w-6" />
                    QR Code Anda
                </CardTitle>
                <CardDescription>
                    Tunjukkan QR Code ini kepada petugas untuk melakukan transaksi
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
                <div ref={qrRef}>
                    <QRGenerator
                        value={qrCode}
                        logoSrc={ecotiketLogo}
                    />
                </div>
                <Button onClick={handleDownloadQR} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    Unduh QR Code
                </Button>
                <Alert>
                    <AlertDescription>
                        <strong>Tips:</strong> Pastikan QR Code terlihat jelas dan tidak rusak saat melakukan transaksi.
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}

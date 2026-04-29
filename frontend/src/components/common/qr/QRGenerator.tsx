import { useEffect, useRef } from 'react';
import { toCanvas } from 'qrcode';

interface QRGeneratorProps {
  value: string;
  size?: number;
  logoSrc?: string;
}

export default function QRGenerator({
  value,
  size = 200,
  logoSrc,
}: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Could not get 2D context from canvas');
      return;
    }

    const qrOptions = {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H' as const, 
    };

    toCanvas(canvas, value, qrOptions, (error) => {
      if (error) {
        console.error('Error generating QR code:', error);
        return;
      }

      if (!logoSrc) {
        return;
      }

      const logoImg = new Image();
      logoImg.src = logoSrc;

      logoImg.onload = () => {
        const logoSize = size * 0.18; // Ukuran logo (18% dari QR)
        const padding = size * 0.015; // Padding di sekitar logo
        
        // Hitung posisi tengah logo/lingkaran
        const centerX = size / 2;
        const centerY = size / 2;
        
        // Radius untuk background putih (logo + padding)
        const bgRadius = (logoSize / 2) + padding;

        // Radius untuk logo itu sendiri
        const logoRadius = logoSize / 2;

        ctx.save(); // Simpan state canvas saat ini

        // 1. Gambar background putih berbentuk lingkaran
        ctx.beginPath();
        ctx.arc(centerX, centerY, bgRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.closePath();

        // Opsional: Border lingkaran putih
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = '#E0E0E0'; // Warna abu-abu muda
        // ctx.stroke();

        // 2. Buat clipping mask berbentuk lingkaran untuk logo
        ctx.beginPath();
        ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2, false);
        ctx.clip(); // Ini akan membatasi gambar selanjutnya di dalam lingkaran ini

        // 3. Gambar logo (akan otomatis terpotong jadi lingkaran)
        ctx.drawImage(
          logoImg, 
          centerX - logoRadius, // Posisi X
          centerY - logoRadius, // Posisi Y
          logoSize, 
          logoSize
        );

        ctx.restore(); // Kembalikan state canvas (hapus clipping mask)
      };

      logoImg.onerror = (err) => {
        console.error('Error loading logo image:', err);
      };
    });

  }, [value, size, logoSrc]);

  if (!value) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg"
        style={{ width: size, height: size }}
      >
        <p className="text-gray-500 text-sm">No QR data</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded-lg shadow-sm"
        width={size}
        height={size}
      />
      <span className="text-xs text-gray-500 break-all" style={{ maxWidth: size }}>
        {value}
      </span>
    </div>
  );
}
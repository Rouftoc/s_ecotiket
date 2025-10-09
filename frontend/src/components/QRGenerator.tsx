import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRGeneratorProps {
  value: string; 
  size?: number;
}

export default function QRGenerator({ value, size = 200 }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).catch((error) => {
        console.error('Error generating QR code:', error);
      });
    }
  }, [value, size]);

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
      <span className="text-xs text-gray-500 break-all">{value}</span>
    </div>
  );
}
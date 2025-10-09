// NEW: Import the jsQR library and the new 'Image' icon
import { useState, useRef, useEffect } from 'react';
import jsQR from 'jsqr';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Scan, Camera, Type, CheckCircle, AlertCircle, StopCircle, X, Image as ImageIcon, Loader2 } from 'lucide-react'; // Added ImageIcon, Loader2

interface QRScannerProps {
  onScanResult?: (result: string) => void;
  onClose?: () => void;
  placeholder?: string;
}

export default function QRScanner({
  onScanResult,
  onClose,
  placeholder = "Scan atau input QR Code"
}: QRScannerProps) {
  // NEW: Added 'gallery' to the possible scan modes
  const [scanMode, setScanMode] = useState<'camera' | 'manual' | 'gallery'>('manual');
  const [manualInput, setManualInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  
  // NEW: State for gallery scanning status
  const [galleryStatus, setGalleryStatus] = useState<'idle' | 'processing' | 'error'>('idle');
  const [galleryError, setGalleryError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // NEW: Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Toast replacement for this demo
  const toast = {
    success: (message: string) => {
      console.log('SUCCESS:', message);
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    },
    error: (message: string) => {
      console.error('ERROR:', message);
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    },
    info: (message: string) => {
      console.info('INFO:', message);
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    }
  };

  useEffect(() => {
    loadRegisteredUsers();
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const loadRegisteredUsers = () => {
    const users = localStorage.getItem('registeredUsers');
    if (users) {
      const parsedUsers = JSON.parse(users);
      const passengers = parsedUsers.filter((user: any) => user.role === 'penumpang');
      setRegisteredUsers(passengers);
    }
  };

  const checkCameraPermissions = async (): Promise<boolean> => {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return permissionStatus.state === 'granted';
    } catch (error) {
      console.log('Permission API not supported, trying direct access');
      return true;
    }
  };

  const requestCameraAccess = async (): Promise<MediaStream | null> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API tidak didukung di browser ini');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      return stream;
    } catch (error) {
      console.warn('Rear camera failed, trying front camera:', error);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        return stream;
      } catch (frontError) {
        console.warn('Front camera also failed, trying any camera:', frontError);
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 } }
          });
          return stream;
        } catch (basicError: any) {
          console.error('All camera access attempts failed:', basicError);
          throw basicError;
        }
      }
    }
  };

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setCameraError(null);
      setScanMode('camera');

      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const hasPermission = await checkCameraPermissions();
      if (!hasPermission) {
        setCameraError('Izin kamera diperlukan. Pastikan browser memiliki akses ke kamera.');
      }

      const newStream = await requestCameraAccess();
      
      if (!newStream) {
        throw new Error('Tidak dapat mengakses kamera');
      }
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
        startScanning();
      }
      toast.success('Kamera berhasil diaktifkan');
    } catch (error: any) {
      console.error('Camera startup error:', error);
      let errorMessage = 'Gagal mengakses kamera. ';
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Izin kamera ditolak. Periksa pengaturan browser dan izinkan akses kamera.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'Kamera tidak ditemukan. Pastikan perangkat memiliki kamera.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Kamera sedang digunakan aplikasi lain.';
      } else {
        errorMessage += error.message || 'Terjadi kesalahan tidak dikenal.';
      }
      setCameraError(errorMessage);
      toast.error(errorMessage);
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    toast.info('Kamera dihentikan');
  };

  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    scanIntervalRef.current = setInterval(scanForQRCode, 500);
  };

  const scanForQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        if (code.data !== lastScanned) {
            handleScanResult(code.data);
            stopCamera();
        }
      }
    } catch (error) {
        console.error("Error decoding QR code from camera stream:", error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setGalleryStatus('processing');
    setGalleryError(null);
    setLastScanned(null);

    const reader = new FileReader();
    reader.onload = (e) => {
        const image = new window.Image();
        image.src = e.target?.result as string;
        image.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const context = canvas.getContext('2d');
            if (!context) return;

            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            
            try {
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code && code.data) {
                    handleScanResult(code.data);
                    setGalleryStatus('idle');
                } else {
                    setGalleryError('QR Code tidak ditemukan pada gambar.');
                    toast.error('QR Code tidak ditemukan pada gambar.');
                    setGalleryStatus('error');
                }
            } catch (error) {
                console.error("Error decoding QR code from image:", error);
                setGalleryError('Gagal memproses gambar.');
                toast.error('Gagal memproses gambar.');
                setGalleryStatus('error');
            }
        };
        image.onerror = () => {
            setGalleryError('Gagal memuat file gambar.');
            toast.error('Gagal memuat file gambar.');
            setGalleryStatus('error');
        };
    };
    reader.onerror = () => {
        setGalleryError('Gagal membaca file.');
        toast.error('Gagal membaca file.');
        setGalleryStatus('error');
    };
    reader.readAsDataURL(file);

    event.target.value = '';
  };


  const handleScanResult = (result: string) => {
    setLastScanned(result);
    setManualInput(result);
    if (onScanResult) {
      onScanResult(result);
    }
    toast.success(`QR Code terdeteksi: ${result}`);
  };

  const handleManualSubmit = () => {
    if (manualInput.trim()) {
      handleScanResult(manualInput.trim());
    } else {
      toast.error('Mohon masukkan QR Code');
    }
  };
  
  const simulateRandomQRScan = () => {
    loadRegisteredUsers();
    if (registeredUsers.length === 0) {
        toast.error('Tidak ada penumpang terdaftar untuk disimulasikan');
        return;
    }
    const randomUser = registeredUsers[Math.floor(Math.random() * registeredUsers.length)];
    if (randomUser.qrCode) {
        handleScanResult(randomUser.qrCode);
    } else {
        toast.error('Pengguna tidak memiliki QR Code');
    }
  };

  const switchMode = (mode: 'camera' | 'manual' | 'gallery') => {
    if (isScanning) stopCamera();
    setScanMode(mode);
    setLastScanned(null);
    setCameraError(null);
    setGalleryError(null);
    setGalleryStatus('idle');
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Scan className="h-5 w-5 mr-2" />
            <CardTitle>QR Code Scanner</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <CardDescription>
          Pilih metode scan: Kamera, Galeri, atau Input Manual
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={scanMode === 'camera' ? 'default' : 'outline'}
            onClick={() => switchMode('camera')}
            disabled={isScanning && scanMode !== 'camera'}
          >
            <Camera className="h-4 w-4 mr-2" />
            Kamera
          </Button>
          <Button
            variant={scanMode === 'gallery' ? 'default' : 'outline'}
            onClick={() => switchMode('gallery')}
            disabled={isScanning}
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Galeri
          </Button>
          <Button
            variant={scanMode === 'manual' ? 'default' : 'outline'}
            onClick={() => switchMode('manual')}
            disabled={isScanning}
          >
            <Type className="h-4 w-4 mr-2" />
            Manual
          </Button>
        </div>

        {scanMode === 'camera' && (
          <div className="space-y-4">
            {cameraError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Error Kamera</span>
                </div>
                <p className="text-sm text-red-700 mt-1">{cameraError}</p>
              </div>
            )}
            <div className="relative">
              {!isScanning ? (
                <div className="w-full h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Kamera tidak aktif</p>
                    <p className="text-sm text-gray-500 mt-2">Klik "Mulai Scan" untuk mengaktifkan</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover rounded-lg bg-black"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg bg-black bg-opacity-20">
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-green-400"></div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-green-400"></div>
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-green-400"></div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-green-400"></div>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                    Scanning...
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              {!isScanning ? (
                <>
                  <Button onClick={startCamera} className="flex-1">
                    <Camera className="h-4 w-4 mr-2" />
                    Mulai Scan
                  </Button>
                </>
              ) : (
                <Button onClick={stopCamera} variant="destructive" className="flex-1">
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop Scan
                </Button>
              )}
            </div>
          </div>
        )}
        
        {scanMode === 'gallery' && (
            <div className="space-y-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                />
                <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    className="w-full"
                    disabled={galleryStatus === 'processing'}
                >
                    {galleryStatus === 'processing' ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <ImageIcon className="h-4 w-4 mr-2" />
                    )}
                    {galleryStatus === 'processing' ? 'Memproses...' : 'Pilih Gambar dari Galeri'}
                </Button>
                
                {galleryError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center space-x-2 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">{galleryError}</span>
                        </div>
                    </div>
                )}

                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                    Pilih sebuah gambar yang berisi QR code. Hasil scan akan muncul di bawah jika berhasil terdeteksi.
                </div>
            </div>
        )}

        {scanMode === 'manual' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-input">QR Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="qr-input"
                  placeholder={placeholder}
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
                />
                <Button onClick={handleManualSubmit}>
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {registeredUsers.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">Penumpang Terdaftar ({registeredUsers.length}):</p>
                  <Button onClick={loadRegisteredUsers} variant="ghost" size="sm" className="text-xs">
                    Refresh
                  </Button>
                </div>
                <div className="space-y-1 text-xs text-gray-600 max-h-32 overflow-y-auto">
                  {registeredUsers.map((user, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                      <div className="flex-1">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                      <button 
                        onClick={() => setManualInput(user.qrCode)}
                        className="bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded border text-xs font-mono"
                        title={user.qrCode}
                      >
                        {user.qrCode?.substring(0, 12)}...
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Klik QR Code untuk mengisi input field. Gunakan "Demo Scan" di mode Kamera untuk simulasi.
                </p>
              </div>
            )}
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />

        {lastScanned && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Hasil Scan Terakhir</span>
            </div>
            <p className="text-sm text-green-700 mt-1 break-all">
              <code className="bg-green-100 px-2 py-1 rounded">{lastScanned}</code>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
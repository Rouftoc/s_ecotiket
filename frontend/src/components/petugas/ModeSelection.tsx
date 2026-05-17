import { Recycle, Bus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ModeSelectionProps {
    selectedLocation: string;
    startShift: (mode: 'stand' | 'karnet') => void;
}

export default function ModeSelection({ selectedLocation, startShift }: ModeSelectionProps) {
    return (
        <Card>
            <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Pilih Mode Kerja</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                    Pilih lokasi tugas dan mode kerja untuk memulai shift
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="text-center p-4 sm:p-6 border-2 border-dashed border-gray-200 rounded-lg">
                        <Recycle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-medium mb-2">Mode Stand</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                            Tukar botol plastik menjadi tiket bus
                        </p>
                        <Button
                            onClick={() => startShift('stand')}
                            className="w-full bg-green-600 hover:bg-green-700 text-sm"
                            disabled={!selectedLocation}
                        >
                            Mulai Stand
                        </Button>
                    </div>

                    <div className="text-center p-4 sm:p-6 border-2 border-dashed border-gray-200 rounded-lg">
                        <Bus className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-base sm:text-lg font-medium mb-2">Mode Kernet</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                            Validasi tiket penumpang yang akan naik bus
                        </p>
                        <Button
                            onClick={() => startShift('karnet')}
                            variant="outline"
                            className="w-full text-sm"
                            disabled={!selectedLocation}
                        >
                            Mulai Kernet
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

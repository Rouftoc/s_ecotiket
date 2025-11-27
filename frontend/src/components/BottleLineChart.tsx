import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Recycle } from 'lucide-react';
import { Transaction, BottleStats } from '@/types/dashboard';
interface ChartDataPoint {
  time: string;
  kecil: number;
  sedang: number;
  besar: number;
  jumbo: number;
  cup: number;
}

interface BottleStatisticsChartProps {
  statsFilter: string;
  bottleStats: BottleStats;     
  transactions: Transaction[];  
}

export default function BottleStatisticsChart({ statsFilter, bottleStats, transactions }: BottleStatisticsChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const processRealData = () => {
      if (!transactions || transactions.length === 0) {
        return [];
      }

      const now = new Date();
      let dataTemplate: Record<string | number, ChartDataPoint> = {};
      let timeKeyFormatter: (date: Date) => string | number = (date) => date.toISOString();

      if (statsFilter === 'today') {
        timeKeyFormatter = (date) => date.getHours();
        for (let i = 0; i < 24; i++) {
          const time = `${i.toString().padStart(2, '0')}:00`;
          dataTemplate[i] = { time, kecil: 0, sedang: 0, jumbo: 0, besar: 0, cup: 0 };
        }
      } else if (statsFilter === 'month') {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        timeKeyFormatter = (date) => date.getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          dataTemplate[i] = { time: `${i}`, kecil: 0, sedang: 0, jumbo: 0, besar: 0, cup: 0 };
        }
      } else {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        timeKeyFormatter = (date) => date.getMonth();
        months.forEach((month, index) => {
          dataTemplate[index] = { time: month, kecil: 0, sedang: 0, jumbo: 0, besar: 0, cup: 0 };
        });
      }

      const bottleTransactions = transactions.filter(
        (t) => t.type === 'bottle_exchange' && t.status === 'completed'
      );

      bottleTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.created_at);
        const key = timeKeyFormatter(transactionDate);

        if (dataTemplate[key]) {
          const bottleType = transaction.bottle_type?.toLowerCase();
          const count = transaction.bottles_count || 0;

          if (bottleType === 'kecil') dataTemplate[key].kecil += count;
          else if (bottleType === 'sedang') dataTemplate[key].sedang += count;
          else if (bottleType === 'jumbo') dataTemplate[key].jumbo += count;
          else if (bottleType === 'besar') dataTemplate[key].besar += count;
          else if (bottleType === 'cup') dataTemplate[key].cup += count;
        }
      });

      return Object.values(dataTemplate);
    };

    setChartData(processRealData());
  }, [statsFilter, transactions]);

  const getTimeLabel = () => {
    switch (statsFilter) {
      case 'today': return 'Jam';
      case 'month': return 'Tanggal';
      case 'year': return 'Bulan';
      default: return 'Bulan';
    }
  };

  const getFilterLabel = () => {
    switch (statsFilter) {
      case 'today': return 'Hari Ini';
      case 'month': return 'Bulan Ini';
      case 'year': return 'Tahun Ini';
      default: return 'Semua Waktu';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Recycle className="h-5 w-5" />
          Tren Penukaran Botol
        </CardTitle>
        <CardDescription>
          Grafik penukaran botol per jenis - {getFilterLabel()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                label={{ value: getTimeLabel(), position: 'insideBottom', offset: -5 }}
              />
              <YAxis label={{ value: 'Jumlah Botol', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                formatter={(value) => [`${value} botol`, '']}
              />
              <Legend />
              <Line type="monotone" dataKey="kecil" stroke="#3b82f6" strokeWidth={2} name="Kecil" dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="sedang" stroke="#10b981" strokeWidth={2} name="Sedang" dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="jumbo" stroke="#8b5cf6" strokeWidth={2} name="Jumbo" dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="besar" stroke="#f5170bff" strokeWidth={2} name="Besar" dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="cup" stroke="#f97316" strokeWidth={2} name="Cup" dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[350px] text-gray-500">
            <div className="text-center">
              <Recycle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm font-medium">Tidak ada data transaksi pada periode ini</p>
              <p className="text-xs text-gray-400 mt-1">Data akan muncul setelah ada penukaran botol</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
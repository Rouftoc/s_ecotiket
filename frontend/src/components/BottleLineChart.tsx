import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
              <defs>
                <linearGradient id="colorKecil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSedang" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorJumbo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBesar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f5170b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f5170b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCup" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tickMargin={15}
                interval={statsFilter === 'year' ? 0 : 'preserveStartEnd'}
                label={{ value: getTimeLabel(), position: 'insideBottom', offset: -10 }}
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                label={{ value: 'Jumlah Botol', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`${value} botol`, '']}
              />
              <Legend iconType="circle" />

              <Area 
                type="monotone" 
                dataKey="kecil" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorKecil)" 
                name="Kecil" 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Area 
                type="monotone" 
                dataKey="sedang" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorSedang)" 
                name="Sedang" 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Area 
                type="monotone" 
                dataKey="jumbo" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorJumbo)" 
                name="Jumbo" 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Area 
                type="monotone" 
                dataKey="besar" 
                stroke="#f5170b" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBesar)" 
                name="Besar" 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Area 
                type="monotone" 
                dataKey="cup" 
                stroke="#f97316" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCup)" 
                name="Cup" 
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
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
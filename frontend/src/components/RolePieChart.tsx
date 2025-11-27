import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';
import { UserRecord } from '@/types/dashboard';

interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
}

interface RolePieChartProps {
  users: UserRecord[];
  userFilter: string;
}

const STATUS_COLORS = {
  active: '#22c55e',
  inactive: '#eab308',
  suspended: '#ef4444',
};

const STATUS_LABELS = {
  active: 'Aktif',
  inactive: 'Tidak Aktif',
  suspended: 'Suspended',
};

export default function RolePieChart({ users, userFilter }: RolePieChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const processUserData = () => {
      if (!users || users.length === 0) {
        return [];
      }

      let filteredUsers = users;
      if (userFilter !== 'all') {
        filteredUsers = users.filter(user => user.status === userFilter);
      }

      const statusCounts: Record<string, number> = {
        active: 0,
        inactive: 0,
        suspended: 0,
      };

      filteredUsers.forEach(user => {
        const status = user.status.toLowerCase();
        if (status in statusCounts) {
          statusCounts[status]++;
        }
      });

      const data: ChartDataPoint[] = Object.entries(statusCounts)
        .filter(([_, count]) => count > 0)
        .map(([status, count]) => ({
          name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
          value: count,
          color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#6b7280',
        }));

      return data;
    };

    setChartData(processUserData());
  }, [users, userFilter]);

  const getFilterLabel = () => {
    switch (userFilter) {
      case 'active': return 'Pengguna Aktif';
      case 'inactive': return 'Pengguna Tidak Aktif';
      case 'suspended': return 'Pengguna Suspended';
      default: return 'Semua Pengguna';
    }
  };

  const getTotalUsers = () => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / getTotalUsers()) * 100).toFixed(1);
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} pengguna ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Distribusi Pengguna
        </CardTitle>
        <CardDescription>
          Persentase pengguna berdasarkan status - {getFilterLabel()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 pt-4 border-t text-center">
              <div className="text-2xl font-bold text-gray-900">{getTotalUsers()}</div>
              <div className="text-sm text-gray-500">Total Pengguna</div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[350px] text-gray-500">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-sm font-medium">Tidak ada data pengguna</p>
              <p className="text-xs text-gray-400 mt-1">
                {userFilter !== 'all'
                  ? `Tidak ada pengguna dengan status ${STATUS_LABELS[userFilter as keyof typeof STATUS_LABELS]?.toLowerCase()}`
                  : 'Belum ada pengguna terdaftar di sistem'
                }
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
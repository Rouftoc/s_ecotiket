import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '@/types/dashboard';

interface TicketCirculationChartProps {
    transactions: Transaction[];
}

export default function TicketCirculationChart({ transactions }: TicketCirculationChartProps) {
    let earned = 0;
    let redeemed = 0;

    transactions.forEach(t => {
        if (t.status === 'completed') {
            if (t.tickets_change > 0) earned += t.tickets_change;
            else if (t.tickets_change < 0) redeemed += Math.abs(t.tickets_change);
        }
    });

    const data = [
        { name: 'Tiket Didapat', value: earned, color: '#16a34a' }, 
        { name: 'Tiket Dipakai', value: redeemed, color: '#2563eb' }  
    ];

    const total = earned + redeemed;
    const redemptionRate = total > 0 ? ((redeemed / earned) * 100).toFixed(1) : '0';

    return (
        <div className="h-full min-h-[250px] flex flex-col">
            <div className="flex items-center justify-between mb-4 px-2">
                <p className="text-sm text-gray-500 font-medium">Rasio Penggunaan</p>
            </div>
            <div className="flex-1 w-full h-full">
                <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => [value, 'Tiket']}
                            contentStyle={{ borderRadius: '12px', fontSize: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

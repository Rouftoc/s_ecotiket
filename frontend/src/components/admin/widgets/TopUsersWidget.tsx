import { User } from 'lucide-react';
import { UserRecord } from '@/types/dashboard';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TopUsersWidgetProps {
    users: UserRecord[];
}

export default function TopUsersWidget({ users }: TopUsersWidgetProps) {
    const topUsers = users
        .filter(u => u.role === 'penumpang')
        .sort((a, b) => (b.points || 0) - (a.points || 0)) // Sort by points
        .slice(0, 5);

    const getRankIcon = (index: number) => {
        return (
            <div className={`h-6 w-6 flex items-center justify-center text-sm font-bold ${index === 0 ? 'text-yellow-600' :
                index === 1 ? 'text-gray-600' :
                    index === 2 ? 'text-amber-700' :
                        'text-gray-500'
                }`}>
                #{index + 1}
            </div>
        );
    };

    const getRankStyle = (index: number) => {
        return 'bg-white border-gray-100 hover:bg-gray-50 shadow-sm mb-2';
    };

    return (
        <div className="space-y-2 h-full">
            {topUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <User className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Belum ada data</p>
                </div>
            ) : (
                topUsers.map((user, index) => (
                    <div
                        key={user.id_user}
                        className={`flex items-center p-3 rounded-xl border transition-all ${getRankStyle(index)}`}
                    >
                        <div className="flex-shrink-0 mr-4 flex items-center justify-center w-8">
                            {getRankIcon(index)}
                        </div>

                        <Avatar className="h-9 w-9 mr-3 border shadow-sm">
                            <AvatarFallback className="bg-blue-50 text-blue-700 font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user.phone || user.email || 'No Contact'}
                            </p>
                        </div>

                        <div className="text-right ml-3">
                            <p className="font-bold text-gray-900 text-sm">
                                {user.points?.toLocaleString() || 0}
                            </p>
                            <p className="text-[10px] uppercase font-bold text-gray-400">
                                Poin
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

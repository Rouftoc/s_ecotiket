export interface UserRecord {
    id_user: number;
    name: string;
    email?: string;
    nik?: string;
    role: 'admin' | 'petugas' | 'penumpang' | string;
    phone?: string;
    address?: string;
    qrCode: string;
    ticketsBalance: number;
    points: number;
    status: 'active' | 'inactive' | 'suspended' | string;
    created_at: string;
    token?: string;
}

export interface CurrentUser extends UserRecord { }
export interface UpdateData {
    name?: string;
    email?: string;
    nik?: string;
    phone?: string;
    address?: string;
    status?: string;
    tickets_balance?: number;
    ticketsBalance?: number;
    points?: number;
}

export interface Transaction {
    id_transaction: number;
    id_user: number;
    id_petugas: number;
    type: 'bottle_exchange' | 'ticket_usage' | string;
    description: string;
    bottles_count?: number;
    bottle_type?: string;
    tickets_change: number;
    points_earned?: number;
    id_location?: number;
    location_name?: string;
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
    user_name?: string;
    petugas_name?: string;
}

export interface PetugasTransaction {
    id_transaction: number;
    qrCode: string;
    type: 'stand' | 'karnet';
    bottles?: Record<string, number>;
    tickets: number;
    timestamp: string;
    location: string;
}
export interface Location {
    id_location: number;
    name: string;
    type: 'terminal' | 'koridor' | 'stand';
    address?: string;
    status: 'active' | 'inactive' | 'maintenance';
    operating_hours?: string;
}

export interface BottleStats {
    kecil: number;
    sedang: number;
    jumbo: number;
    besar: number;
    cup: number;
    total: number;
}

export interface DashboardStats {
    totalUsers: number;
    totalPenumpang: number;
    totalPetugas: number;
    totalAdmin: number;
    totalTickets: number;
    activeUsers: number;
    totalLocations: number;
    activeLocations: number;
    totalTransactions: number;
    totalBottles: number;
}

export interface UserActivity {
    id_activity: number;
    id_user: number;
    activity_type: string;
    description: string;
    created_at: string;
    location?: string;
}

export interface PetugasDetail extends UserRecord {
    total_transactions?: number;
    last_activity?: string;
    activities?: UserActivity[];
}

export interface NewsItem {
    id_news: number;
    title: string;
    slug: string;
    content: string;
    image: string | null;
    is_featured: boolean;
    created_by: number | null;
    author_name?: string;
    created_at: string;
    updated_at: string;
}
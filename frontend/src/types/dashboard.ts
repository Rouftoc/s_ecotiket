export interface UserRecord {
    id: number;
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
    id: number;
    user_id: number;
    petugas_id: number;
    type: 'bottle_exchange' | 'ticket_usage' | string;
    description: string;
    bottles_count?: number;
    bottle_type?: string;
    tickets_change: number; 
    points_earned?: number;
    location?: string;
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
    user_name?: string;
    petugas_name?: string;
}
export interface Location {
    id: number;
    name: string;
    type: 'terminal' | 'koridor' | 'stand';
    address?: string;
    capacity?: number;
    operating_hours?: string;
    status: 'active' | 'inactive' | 'maintenance';
    description?: string;
    coordinates?: string;
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
    id: number;
    user_id: number;
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
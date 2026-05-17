import { NewsItem } from '@/types/dashboard';

export interface User {
    id_user: number;
    email?: string;
    nik?: string;
    name: string;
    role: string;
    phone?: string;
    address?: string;
    qrCode: string;
    qr_code: string;
    ticketsBalance: number;
    tickets_balance: number;
    points: number;
    status: string;
    created_at: string;
    token?: string;
}

export interface Location {
    id_location: number;
    name: string;
    type: 'terminal' | 'koridor' | 'stand';
    address: string;
    status: 'active' | 'inactive' | 'maintenance';
    operating_hours?: string;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id_transaction: number;
    id_user: number;
    id_petugas: number;
    type: string;
    description: string;
    bottles_count?: number;
    bottle_type?: string;
    tickets_change: number;
    points_earned?: number;
    id_location?: number;
    location_name?: string;
    status: string;
    created_at: string;
    user_name?: string;
    petugas_name?: string;
}

export interface BottleRate {
    id_bottle_rate: number;
    bottle_type: string;
    bottles_required: number;
    tickets_earned: number;
    points_earned: number;
    is_active: boolean;
}

export interface ApiResponse<T = unknown> {
    message?: string;
    user?: User;
    users?: User[];
    transactions?: Transaction[];
    news?: NewsItem[]; // Added for News API
    newsItem?: NewsItem; // Single news item

    rates?: BottleRate[];
    locations?: Location[];
    location?: Location;
    token?: string;
    success?: boolean;
    error?: string;
    tickets_earned?: number;
    points_earned?: number;
    total?: number;
    filtered?: boolean;
    deletedTransaction?: Transaction;
    [key: string]: unknown;
}

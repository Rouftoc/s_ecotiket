import { User, Location, Transaction, BottleRate, ApiResponse } from './types';
import { NewsItem } from '@/types/dashboard';

export const API_BASE_URL = 'http://localhost:5000/api';

export const getAuthToken = () => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const userData = JSON.parse(user) as User;
            return userData.token;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }
    return null;
};

export const createHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

export const normalizeUserData = (userData: Record<string, unknown>): User => {
    return {
        id_user: Number(userData.id_user || userData.id) || 0,
        email: userData.email as string || '',
        nik: userData.nik as string || '',
        name: userData.name as string || 'Unknown',
        role: userData.role as string || 'penumpang',
        phone: userData.phone as string || '',
        address: userData.address as string || '',
        qrCode: (userData.qrCode || userData.qr_code || `ECO-${userData.id_user || userData.id}`) as string,
        qr_code: (userData.qr_code || userData.qrCode || `ECO-${userData.id_user || userData.id}`) as string,
        ticketsBalance: Number(userData.ticketsBalance ?? userData.tickets_balance ?? 0),
        tickets_balance: Number(userData.tickets_balance ?? userData.ticketsBalance ?? 0),
        points: Number(userData.points ?? 0),
        status: userData.status as string || 'active',
        created_at: userData.created_at as string || new Date().toISOString(),
        token: userData.token as string
    };
};

export const handleResponse = async <T = unknown>(response: Response): Promise<ApiResponse<T>> => {
    const contentType = response.headers.get('content-type');

    try {
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.error || errorData.message || errorMessage;
            } else {
                const textError = await response.text();
                if (textError) errorMessage = textError;
            }

            throw new Error(errorMessage);
        }

        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('API Response Data:', data);

            if (data.user) {
                try {
                    data.user = normalizeUserData(data.user);
                } catch (e) {
                    console.error('Error normalizing user:', e);
                }
            }
            if (data.users && Array.isArray(data.users)) {
                data.users = data.users.map(normalizeUserData);
            }

            return data;
        } else {
            return { message: 'Success', success: true };
        }
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to parse response');
    }
};

export const checkBackendHealth = async (): Promise<boolean> => {
    try {
        const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
        return response.ok;
    } catch (error) {
        console.error('Backend health check failed:', error);
        return false;
    }
};

export const retryRequest = async <T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> => {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await requestFn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');

            if (i < maxRetries) {
                console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2;
            }
        }
    }

    throw lastError!;
};

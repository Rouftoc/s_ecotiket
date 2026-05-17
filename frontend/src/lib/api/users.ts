import { ApiResponse, User } from './types';
import { API_BASE_URL, createHeaders, handleResponse, normalizeUserData } from './core';

export const usersAPI = {
    async getAllUsers(filters?: { role?: string; status?: string; search?: string }): Promise<ApiResponse> {
        try {
            const params = new URLSearchParams();
            if (filters?.role) params.append('role', filters.role);
            if (filters?.status) params.append('status', filters.status);
            if (filters?.search) params.append('search', filters.search);

            console.log('Fetching users with filters:', filters);

            const response = await fetch(`${API_BASE_URL}/users?${params}`, {
                headers: createHeaders()
            });

            const result = await handleResponse(response);
            console.log('Users fetched:', result);

            return result;
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            return {
                success: false,
                users: [],
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    async getUserById(id: number): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                headers: createHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching user by ID:', error);
            throw error;
        }
    },

    async getUserByQrCode(qrCode: string): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/qr/${encodeURIComponent(qrCode)}`, {
                headers: createHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching user by QR code:', error);
            throw error;
        }
    },

    async updateProfile(userData: {
        name: string;
        phone?: string;
        address?: string;
    }): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: createHeaders(),
                body: JSON.stringify(userData)
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    async updateUser(id: number, userData: {
        name?: string;
        email?: string;
        nik?: string;
        phone?: string;
        address?: string;
        status?: string;
        tickets_balance?: number;
        points?: number;
    }): Promise<ApiResponse> {
        try {
            console.log('Updating user:', id, userData);

            const backendData = {
                name: userData.name,
                email: userData.email,
                nik: userData.nik,
                phone: userData.phone,
                address: userData.address,
                status: userData.status,
                tickets_balance: userData.tickets_balance,
                ticketsBalance: userData.tickets_balance,
                points: userData.points
            };

            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'PUT',
                headers: createHeaders(),
                body: JSON.stringify(backendData)
            });

            const result = await handleResponse(response);
            console.log('User updated:', result);

            return result;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    async deleteUser(id: number): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: createHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> {
        const response = await fetch(`${API_BASE_URL}/users/change-password`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    async resetUserPassword(id: number, newPassword: string): Promise<ApiResponse> {
        const response = await fetch(`${API_BASE_URL}/users/${id}/reset-password`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify({ newPassword })
        });
        return handleResponse(response);
    }
};

export const updateLocalUser = (userData: Partial<User>): void => {
    const currentUser = localStorage.getItem('user');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser) as User;
            const updatedUser = normalizeUserData({ ...user, ...userData });
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error('Error updating local user:', error);
        }
    }
};

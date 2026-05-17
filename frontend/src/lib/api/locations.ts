import { ApiResponse } from './types';
import { API_BASE_URL, createHeaders, handleResponse } from './core';

export const locationsAPI = {
    async getAllLocations(filters?: {
        type?: string;
        status?: string;
        search?: string
    }): Promise<ApiResponse> {
        try {
            const params = new URLSearchParams();
            if (filters?.type) params.append('type', filters.type);
            if (filters?.status) params.append('status', filters.status);
            if (filters?.search) params.append('search', filters.search);

            console.log('Fetching locations from:', `${API_BASE_URL}/locations?${params}`);

            const response = await fetch(`${API_BASE_URL}/locations?${params}`, {
                headers: createHeaders()
            });

            const result = await handleResponse(response);
            console.log('Locations fetched:', result);

            return result;
        } catch (error) {
            console.error('Error fetching locations:', error);
            return {
                success: false,
                locations: [],
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    },

    async getLocationById(id: number): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
                headers: createHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error fetching location by ID:', error);
            throw error;
        }
    },

    async createLocation(locationData: {
        name: string;
        type: 'terminal' | 'koridor' | 'stand';
        address: string;
        operating_hours?: string;
        status?: 'active' | 'inactive' | 'maintenance';
    }): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/locations`, {
                method: 'POST',
                headers: createHeaders(),
                body: JSON.stringify(locationData)
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error creating location:', error);
            throw error;
        }
    },

    async updateLocation(id: number, locationData: {
        name?: string;
        type?: 'terminal' | 'koridor' | 'stand';
        address?: string;
        status?: 'active' | 'inactive' | 'maintenance';
        operating_hours?: string;
    }): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
                method: 'PUT',
                headers: createHeaders(),
                body: JSON.stringify(locationData)
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error updating location:', error);
            throw error;
        }
    },

    async deleteLocation(id: number): Promise<ApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/locations/${id}`, {
                method: 'DELETE',
                headers: createHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            console.error('Error deleting location:', error);
            throw error;
        }
    },

    async getActiveLocations(): Promise<ApiResponse> {
        return this.getAllLocations({ status: 'active' });
    }
};

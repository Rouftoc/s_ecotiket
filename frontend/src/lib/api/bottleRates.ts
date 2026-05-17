import { ApiResponse } from './types';
import { API_BASE_URL, createHeaders, handleResponse } from './core';

export interface BottleRate {
    id_bottle_rate: number;
    bottle_type: string;
    bottles_required: number;
    tickets_earned: number;
    points_earned: number;
    updated_at: string;
}

export const bottleRatesAPI = {
    async getAll(): Promise<BottleRate[]> {
        const response = await fetch(`${API_BASE_URL}/bottle-rates`, {
            headers: createHeaders()
        });
        return handleResponse(response);
    },

    async create(data: {
        bottle_type: string;
        bottles_required: number;
        tickets_earned: number;
        points_earned?: number;
    }): Promise<BottleRate> {
        const response = await fetch(`${API_BASE_URL}/bottle-rates`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    async update(id: number, data: {
        bottles_required?: number;
        tickets_earned?: number;
        points_earned?: number;
    }): Promise<BottleRate> {
        const response = await fetch(`${API_BASE_URL}/bottle-rates/${id}`, {
            method: 'PUT',
            headers: createHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    async delete(id: number): Promise<ApiResponse> {
        const response = await fetch(`${API_BASE_URL}/bottle-rates/${id}`, {
            method: 'DELETE',
            headers: createHeaders()
        });
        return handleResponse(response);
    }
};

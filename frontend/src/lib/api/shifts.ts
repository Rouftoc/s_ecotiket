import { ApiResponse } from './types';
import { API_BASE_URL, createHeaders, handleResponse } from './core';

export interface ShiftRecord {
    id_assignment: number;
    id_petugas: number;
    id_location: number;
    mode: 'stand' | 'karnet';
    is_active: boolean;
    started_at: string;
    ended_at: string | null;
    location_name: string;
    petugas_name?: string;
    petugas_phone?: string;
}

export interface ShiftApiResponse extends ApiResponse {
    shift?: ShiftRecord | null;
    shifts?: ShiftRecord[];
}

export const shiftsAPI = {
    async startShift(data: { locationId: number; mode: 'stand' | 'karnet' }): Promise<ShiftApiResponse> {
        const response = await fetch(`${API_BASE_URL}/shifts/start`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    async endShift(): Promise<ShiftApiResponse> {
        const response = await fetch(`${API_BASE_URL}/shifts/end`, {
            method: 'POST',
            headers: createHeaders()
        });
        return handleResponse(response);
    },

    async getActiveShift(): Promise<ShiftApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/shifts/active`, {
                headers: createHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            return { success: false, shift: null };
        }
    },

    async getShiftHistory(petugasId: number): Promise<ShiftApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/shifts/history/${petugasId}`, {
                headers: createHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            return { success: false, shifts: [] };
        }
    },

    async getAllActiveShifts(): Promise<ShiftApiResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/shifts/active-all`, {
                headers: createHeaders()
            });
            return handleResponse(response);
        } catch (error) {
            return { success: false, shifts: [] };
        }
    }
};

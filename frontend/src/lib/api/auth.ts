import { ApiResponse } from './types';
import { API_BASE_URL, createHeaders, handleResponse } from './core';

export const authAPI = {
    async login(email?: string, password?: string, qrCode?: string, nik?: string): Promise<ApiResponse> {
        const body: Record<string, string> = {};
        if (qrCode) {
            body.qrCode = qrCode;
        } else if (email && password) {
            body.email = email;
            body.password = password;
        } else if (nik && password) {
            body.nik = nik;
            body.password = password;
        }

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(body)
        });
        return handleResponse(response);
    },

    async register(userData: {
        email?: string;
        nik?: string;
        password?: string;
        name: string;
        role: string;
        phone?: string;
        address?: string;
    }): Promise<ApiResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    async getProfile(): Promise<ApiResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: createHeaders()
        });
        return handleResponse(response);
    }
};

import { createHeaders, handleResponse, getAuthToken } from './core';
import { ApiResponse } from './types';
import { NewsItem } from '@/types/dashboard';

const BASE_URL = 'http://localhost:5000/api/news';

export const newsAPI = {
    getAllNews: async (params?: { featured?: boolean; limit?: number }): Promise<NewsItem[]> => {
        const query = new URLSearchParams();
        if (params?.featured) query.append('featured', 'true');
        if (params?.limit) query.append('limit', params.limit.toString());

        const response = await fetch(`${BASE_URL}?${query.toString()}`, {
            headers: createHeaders()
        });
        const data = await handleResponse(response);
        return data as unknown as NewsItem[];
    },

    getLatestNews: async (): Promise<NewsItem[]> => {
        return newsAPI.getAllNews({ limit: 3 });
    },

    getNewsById: async (id: number): Promise<NewsItem> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            headers: createHeaders()
        });
        const data = await handleResponse(response);
        return data as unknown as NewsItem;
    },

    createNews: async (formData: FormData): Promise<{ message: string; id_news: number; image: string }> => {
        const token = getAuthToken();
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Note: Content-Type is not set manually for FormData, browser sets it with boundary
            },
            body: formData
        });
        const data = await handleResponse(response);
        return data as unknown as { message: string; id_news: number; image: string };
    },

    updateNews: async (id: number, formData: FormData): Promise<{ message: string; image: string }> => {
        const token = getAuthToken();
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const data = await handleResponse(response);
        return data as unknown as { message: string; image: string };
    },

    deleteNews: async (id: number): Promise<{ message: string }> => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: createHeaders()
        });
        const data = await handleResponse(response);
        return data as unknown as { message: string };
    }
};

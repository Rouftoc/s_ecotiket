import { API_BASE_URL, createHeaders, handleResponse } from './core';

export interface Notification {
    id_notification: number;
    id_user: number;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export interface NotificationResponse {
    success: boolean;
    notifications: Notification[];
    unreadCount: number;
}

export const notificationsAPI = {
    async getMyNotifications(): Promise<NotificationResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications`, {
                headers: createHeaders()
            });
            return handleResponse(response);
        } catch {
            return { success: false, notifications: [], unreadCount: 0 };
        }
    },

    async markAllRead(): Promise<void> {
        await fetch(`${API_BASE_URL}/notifications/read-all`, {
            method: 'PATCH',
            headers: createHeaders()
        });
    },

    async markOneRead(id: number): Promise<void> {
        await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
            method: 'PATCH',
            headers: createHeaders()
        });
    },

    async deleteNotification(id: number): Promise<void> {
        await fetch(`${API_BASE_URL}/notifications/${id}`, {
            method: 'DELETE',
            headers: createHeaders()
        });
    },

    async sendToUser(data: { id_user: number; type: string; title: string; message: string }) {
        const response = await fetch(`${API_BASE_URL}/notifications/send`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    },

    async broadcast(data: { type: string; title: string; message: string }) {
        const response = await fetch(`${API_BASE_URL}/notifications/broadcast`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(data)
        });
        return handleResponse(response);
    }
};
